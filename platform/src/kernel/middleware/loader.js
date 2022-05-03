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
          const language = store.getState().shared.language;
          if (
            !language ||
            (loadedLocales[id] && loadedLocales[id][language]) ||
            !(availableLocales[id] && availableLocales[id][language])
          ) {
            store.dispatch({
              type: constants.MODULE_INIT,
              payload: {
                module: id,
              },
            });
            return next({
              type: constants.MODULE_READY,
              payload: {
                module: id,
              },
            });
          }
          const uri = availableLocales[id][language];
          return downloadAsset(uri)
            .then((data) => data.json())
            .then((data) => {
              if (!availableLocales[id]) {
                throw new Error("locale no longer available");
              }
              if (!loadedLocales[id]) {
                loadedLocales[id] = {};
              }
              loadedLocales[id][language] = true;
              return data;
            })
            .then((data) => {
              if (Object.keys(data).length > 0) {
                console.debug(`module ${id} introducing locales for ${language}`);
                store.dispatch({
                  type: constants.ADD_I18N_MESSAGES,
                  payload: {
                    language,
                    batch: [{ module: id, data }],
                  },
                });
              }
            })
            .catch((error) => {
              warning(`invalid localisation asset ${uri}`, error);
            })
            .then(() => {
              store.dispatch({
                type: constants.MODULE_INIT,
                payload: {
                  module: id,
                },
              });
              return next({
                type: constants.MODULE_READY,
                payload: {
                  module: id,
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
                  .catch((error) => {
                    warning(`invalid localisation asset ${uri}`, error);
                    return null;
                  })
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