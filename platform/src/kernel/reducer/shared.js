import * as constants from "../../constants";

export const initialState = {
  global: {},
  local: {},
  language: null,
  messages: {},
  readyModules: {},
  lastUpdate: 0,
};

function createSharedReducer() {
  const localeMapping = {};
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.SET_SHARED: {
        if (!action.payload.module || typeof action.payload.module !== "string") {
          return {
            global: {
              ...state.global,
              ...action.payload.data,
            },
            local: state.local,
            language: state.language,
            messages: state.messages,
            lastUpdate: state.lastUpdate,
            readyModules: state.readyModules,
          };
        }
        const nextLocal = { ...state.local };
        nextLocal[action.payload.module] = {
          ...nextLocal[action.payload.module],
          ...action.payload.data,
        };
        return {
          global: state.global,
          local: nextLocal,
          language: state.language,
          messages: state.messages,
          lastUpdate: state.lastUpdate,
          readyModules: state.readyModules,
        };
      }
      case constants.SET_ENTRYPOINT_MODULE: {
        return {
          global: state.global,
          local: state.local,
          language: state.language,
          messages: state.messages,
          lastUpdate: (state.lastUpdate + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: state.readyModules,
        };
      }
      case constants.MODULE_READY: {
        const nextReadyModules = { ...state.readyModules };
        nextReadyModules[action.payload.module] = true;
        return {
          global: state.global,
          local: state.local,
          language: state.language,
          messages: state.messages,
          lastUpdate: state.lastUpdate,
          readyModules: nextReadyModules,
        };
      }
      case constants.MODULE_LOADED: {
        return {
          global: state.global,
          local: state.local,
          language: state.language,
          messages: state.messages,
          lastUpdate: (state.lastUpdate + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: state.readyModules,
        };
      }
      case constants.MODULE_UNLOADED: {
        const nextLocal = { ...state.local };
        delete nextLocal[action.payload.module];
        const nextReadyModules = { ...state.readyModules };
        delete nextReadyModules[action.payload.module];
        const nextMessages = {};
        for (const locale in state.messages) {
          nextMessages[locale] = { ...state.messages[locale] };
        }
        const keys = localeMapping[action.payload.module] || {};
        for (const key in keys) {
          for (const locale in state.messages) {
            delete nextMessages[locale][key];
          }
        }
        delete localeMapping[action.payload.module];

        return {
          global: state.global,
          local: nextLocal,
          language: state.language,
          messages: nextMessages,
          lastUpdate: (state.lastUpdate + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: nextReadyModules,
        };
      }
      case constants.I18N_MESSAGES_BATCH: {
        if (action.payload.batch.length === 0) {
          if (action.payload.language === state.language) {
            return state;
          }
          return {
            global: state.global,
            local: state.local,
            language: action.payload.language,
            messages: state.messages,
            lastUpdate: state.lastUpdate,
            readyModules: state.readyModules,
          };
        }

        const nextMessages = {};
        for (const locale in state.messages) {
          nextMessages[locale] = { ...state.messages[locale] };
        }

        for (const patch of action.payload.batch) {
          if (!localeMapping[patch.module]) {
            localeMapping[patch.module] = {};
          }
          if (!nextMessages[action.payload.language]) {
            nextMessages[action.payload.language] = {};
          }
          const addItem = (key, message) => {
            const hash = key.substring(1);
            localeMapping[patch.module][hash] = true;
            nextMessages[action.payload.language][hash] = message;
          };
          const walk = (path, table) => {
            for (const property in table) {
              const item = table[property];
              if (item.constructor !== Object) {
                addItem(`${path}.${property}`, item);
              } else {
                walk(`${path}.${property}`, item);
              }
            }
          };
          walk("", patch.data);
        }

        return {
          global: state.global,
          local: state.local,
          language: action.payload.language,
          messages: nextMessages,
          lastUpdate: state.lastUpdate,
          readyModules: state.readyModules,
        };
      }
      default: {
        return state;
      }
    }
  };
}

export default createSharedReducer();
