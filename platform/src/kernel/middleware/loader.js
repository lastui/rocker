import * as constants from "../../constants";
import { warning } from "../../utils";
import { downloadAsset } from "../registry/assets";
import loader from "../registry/loader";

const createLoaderMiddleware = () => {
  let availableLocales = {};
  const loadedLocales = {};

  const downloadBatchLocales = async (ids, language) => {
    const scheduledAssets = [];
    for (const id of ids) {
      if (!loadedLocales[id]) {
        loadedLocales[id] = {};
      }
      if (loadedLocales[id][language]) {
        continue;
      }
      loadedLocales[id][language] = true;

      const uri = availableLocales[id] && availableLocales[id][language];
      if (!uri) {
        continue;
      }
      const promise = downloadAsset(uri)
        .then((data) => data.json())
        .then((data) => Object.keys(data).length > 0 && { module: id, data });
      scheduledAssets.push(promise);
    }

    const scheduled = await Promise.allSettled(scheduledAssets);

    const batch = [];
    for (const action of scheduled) {
      if (action.status !== "fulfilled" || !action.value) {
        continue;
      }
      console.debug(`module ${action.value.module} introducing locales for ${language}`);
      batch.push(action.value);
    }

    return batch;
  };

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
          return downloadBatchLocales([id], language).then((items) => {
            if (items.length > 0) {
              store.dispatch({
                type: constants.I18N_MESSAGES_BATCH,
                payload: {
                  language,
                  batch: items,
                },
              });
            }
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

          const missing = [];
          for (const id in loadedLocales) {
            if (loadedLocales[id][language]) {
              continue;
            }
            missing.push(id);
          }
          return downloadBatchLocales(missing, language).then((items) =>
            next({
              type: constants.I18N_MESSAGES_BATCH,
              payload: {
                language,
                batch: items,
              },
            }),
          );
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

export default createLoaderMiddleware;