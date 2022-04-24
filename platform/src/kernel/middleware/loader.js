import { compose } from "redux";
import { warning } from "../../utils";
import { downloadAsset } from "../registry/assets";
import loader from "../registry/loader";
import * as constants from "../../constants";

const createLoaderMiddleware = () => {
  let availableLocales = {};
  const loadedLocales = {};
  const noop = { type: "" };

  return (store) => (next) => (action) => {
    try {
      switch (action.type) {
        case constants.SET_AVAILABLE_MODULES: {
          availableLocales = {};
          for (const item of action.payload.modules) {
            if (item.locales && Object.keys(item.locales) !== 0) {
              availableLocales[item.id] = item.locales;
            }
          }
          return loader.setAvailableModules(action.payload.modules).then(() => next(action));
        }

        case constants.SET_ENTRYPOINT_MODULE: {
          return loader.loadModule(action.payload.entrypoint).then(() => next(action));
        }

        case constants.MODULE_LOADED: {
          const id = action.payload.module;
          console.debug(`module ${id} loaded`);
          if (!id) {
            return next({
              type: constants.MODULE_READY,
              payload: {
                module: id,
              },
            });
          }
          const language = store.getState().shared.language;
          if (!language) {
            return next({
              type: constants.MODULE_READY,
              payload: {
                module: id,
              },
            });
          }
          if (loadedLocales[id] && loadedLocales[id][language]) {
            return next({
              type: constants.MODULE_READY,
              payload: {
                module: id,
              },
            });
          }
          if (!availableLocales[id]) {
            return next({
              type: constants.MODULE_READY,
              payload: {
                module: id,
              },
            });
          }
          const uri = availableLocales[id][language];
          if (!uri) {
            return next({
              type: constants.MODULE_READY,
              payload: {
                module: id,
              },
            });
          }
          return downloadAsset(uri)
            .then((data) => data.json())
            .then((data) => {
              if (!availableLocales[id]) {
                return next({
                  type: constants.MODULE_READY,
                  payload: {
                    module: id,
                  },
                });
              }
              if (!loadedLocales[id]) {
                loadedLocales[id] = {};
              }
              loadedLocales[id][language] = true;
              if (Object.keys(data).length === 0) {
                return next({
                  type: constants.MODULE_READY,
                  payload: {
                    module: id,
                  },
                });
              }
              console.debug(`module ${id} introducing locales for ${language}`);
              store.dispatch({
                type: constants.MODULE_READY,
                payload: {
                  module: id,
                },
              });
              return next({
                type: constants.ADD_I18N_MESSAGES,
                payload: {
                  language,
                  batch: [{ module: id, data }],
                },
              });
            });
        }

        case constants.SET_LANGUAGE: {
          const language = action.payload.language;
          const scheduledAssets = [];
          for (const id in loadedLocales) {
            if (!loadedLocales[id][language]) {
              const uri = availableLocales[id][language];
              if (uri) {
                const promise = downloadAsset(uri)
                  .then((data) => data.json())
                  .then((data) => {
                    if (!availableLocales[id]) {
                      return null;
                    }
                    if (!loadedLocales[id]) {
                      loadedLocales[id] = {};
                    }
                    loadedLocales[id][language] = true;
                    if (Object.keys(data).length === 0) {
                      return null;
                    }
                    console.debug(`module ${id} introducing locales for ${language}`);
                    return { module: id, data };
                  });
                scheduledAssets.push(promise);
              }
            }
          }
          return Promise.allSettled(scheduledAssets).then((scheduled) => {
            const batch = [];
            for (const action of scheduled) {
              if (action.status === "fulfilled" && action.value !== null) {
                batch.push(action.value);
              }
            }
            return next({
              type: constants.ADD_I18N_MESSAGES,
              payload: {
                language,
                batch,
              },
            });
          });
        }

        case constants.MODULE_UNLOADED: {
          const id = action.payload.module;
          if (loadedLocales[id]) {
            delete loadedLocales[id];
          }
          return next(action);
        }

        default: {
          return next(action);
        }
      }
    } catch (error) {
      warning("dynamic middleware errored", error);
      return next(action);
    }
  };
};

export default createLoaderMiddleware();