import * as constants from "../../constants";
import { warning } from "../../utils";
import { downloadAsset } from "../registry/assets";
import loader from "../registry/loader";

const createLoaderMiddleware = () => {
  let availableLocales = {};
  const loadedLocales = {};

  const downloadBatchLocales = async (names, language) => {
    const scheduledAssets = [];
    for (const name of names) {
      if (!loadedLocales[name]) {
        loadedLocales[name] = {};
      }
      if (loadedLocales[name][language]) {
        continue;
      }
      loadedLocales[name][language] = true;

      const uri = availableLocales[name] && availableLocales[name][language];
      if (!uri) {
        continue;
      }
      const promise = downloadAsset(uri)
        .then(data => data.json())
        .then(data => Object.keys(data).length > 0 && { module: name, data });
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

  return store => next => action => {
    try {
      switch (action.type) {
        case constants.SET_AVAILABLE_MODULES: {
          availableLocales = {};
          for (const item of action.payload.modules) {
            if (item.locales && Object.keys(item.locales) !== 0) {
              availableLocales[item.name] = item.locales;
            }
          }
          return loader.setAvailableModules(action.payload.modules).then(() => next(action));
        }

        case constants.SET_ENTRYPOINT_MODULE: {
          return loader.loadModule(action.payload.entrypoint).then(() => next(action));
        }

        case constants.MODULE_LOADED: {
          const name = action.payload.module;
          console.debug(`module ${name} loaded`);
          const language = store.getState().shared.language;
          return downloadBatchLocales([name], language).then(items => {
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
                module: name,
              },
            });
            return next({
              type: constants.MODULE_READY,
              payload: {
                module: name,
              },
            });
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
          return downloadBatchLocales(missing, language).then(items =>
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
          const name = action.payload.module;
          if (loadedLocales[name]) {
            delete loadedLocales[name];
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
