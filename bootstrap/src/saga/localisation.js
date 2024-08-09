import { put, call, take, select } from "redux-saga/effects";

import { constants, downloadAsset } from "@lastui/rocker/platform";

import { I18N_ADD_MESSAGES, I18N_REMOVE_MESSAGES } from "../constants";
import { getLanguage } from "../selector";

// TODO move to saga context
const availableLocales = {};
const loadedLocales = {};

/* istanbul ignore next */
export async function downloadBatchLocales(names, language) {
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
    batch.push(action.value);
  }

  return batch;
}

export function* watchModules() {
  while (true) {
    const action = yield take([constants.SET_AVAILABLE_MODULES, constants.MODULE_LOADED, constants.MODULE_UNLOADED]);

    if (action.type === constants.SET_AVAILABLE_MODULES) {
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
    } else if (action.type === constants.MODULE_LOADED) {
      const name = action.payload.module;

      const language = yield select(getLanguage);

      const items = yield call(downloadBatchLocales, [name], language);

      if (items.length > 0) {
        yield put({
          type: I18N_ADD_MESSAGES,
          payload: {
            language,
            batch: items,
          },
        });
      }

      yield put({ type: constants.MODULE_INIT, payload: { module: name } });
      yield put({ type: constants.MODULE_READY, payload: { module: name } });
    } else {
      delete loadedLocales[action.payload.module];
      yield put({ type: I18N_REMOVE_MESSAGES, payload: { module: action.payload.module } });
    }
  }
}

export function* watchChangeLanguage() {
  while (true) {
    const action = yield take(constants.SET_LANGUAGE);

    const language = action.payload.language;

    const missing = [];
    /* istanbul ignore next */
    for (const name in loadedLocales) {
      if (loadedLocales[name][language]) {
        continue;
      }
      missing.push(name);
    }

    const items = yield call(downloadBatchLocales, missing, language);

    yield put({
      type: I18N_ADD_MESSAGES,
      payload: {
        language,
        batch: items,
      },
    });
  }
}
