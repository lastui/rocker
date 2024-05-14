import * as constants from "../../constants";
import { warning } from "../../utils";
import { downloadAsset } from "../registry/assets";
import loader from "../registry/loader";

const createLoaderMiddleware = () => {
  const availableLocales = {};
  const loadedLocales = {};

  const downloadBatchLocales = async (names, language) => {
    const scheduledAssets = [];
    for (const name of names) {
      if (!loadedLocales[name]) {
        loadedLocales[name] = {};
      }
      if (language in loadedLocales[name]) {
        continue;
      }
      loadedLocales[name][language] = true;
      const uri = name in availableLocales && availableLocales[name][language];
      if (!uri) {
        continue;
      }
      const promise = downloadAsset(uri)
        .then((data) => data.json())
        .then((data) => {
          for (const _prop in data) {
            return { module: name, data };
          }
          return null;
        });
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
          /* istanbul ignore next */
          for (const key in availableLocales) {
            delete availableLocales[key];
          }
          for (const item of action.payload.modules) {
            if (!item.locales) {
              continue;
            }
            for (const _prop in item.locales) {
              availableLocales[item.name] = item.locales;
              break;
            }
          }
          return loader.setAvailableModules(action.payload.modules).then(() => next(action));
        }

        case constants.SET_ENTRYPOINT_MODULE: {
          return loader.loadModule(action.payload.entrypoint, new AbortController()).then(() => next(action));
        }

        case constants.MODULE_LOADED: {
          const name = action.payload.module;
          console.debug(`module ${name} loaded`);
          const language = store.getState().env.language;
          return downloadBatchLocales([name], language).then((items) => {
            if (items.length > 0) {
              store.dispatch({
                type: constants.I18N_MESSAGES_BATCH,
                payload: {
                  language,
                  batch: items,
                },
              });
            }
            store.dispatch({ type: constants.MODULE_INIT, payload: { module: name } });
            return next({ type: constants.MODULE_READY, payload: { module: name } });
          });
        }

        case constants.SET_LANGUAGE: {
          const language = action.payload.language;

          const missing = [];
          for (const name in loadedLocales) {
            if (loadedLocales[name][language]) {
              continue;
            }
            missing.push(name);
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
          delete loadedLocales[action.payload.module];
          return next(action);
        }

        default: {
          return next(action);
        }
      }
    } catch (error) {
      warning("loader middleware errored", error);
      return next(action);
    }
  };
};

export default createLoaderMiddleware;
