import * as constants from "../../constants";

const initialState = {
  env: {},
  language: "en-US",
  messages: {},
  updatedAt: 0,
  readyModules: {},
};

function createSharedReducer() {
  const localeMapping = {};
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.SET_SHARED: {
        return {
          env: Object.assign({}, state.evn, action.payload),
          language: state.language,
          messages: state.messages,
          updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: state.readyModules,
        };
      }
      case constants.MODULE_READY: {
        const nextReadyModules = { ...state.readyModules };
        nextReadyModules[action.payload.module] = true;
        return {
          env: state.env,
          language: state.language,
          messages: state.messages,
          updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: nextReadyModules,
        };
      }
      case constants.MODULE_LOADED: {
        return {
          env: state.env,
          language: state.language,
          messages: state.messages,
          updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: state.readyModules,
        };
      }
      case constants.MODULE_UNLOADED: {
        const nextReadyModules = { ...state.readyModules };
        delete nextReadyModules[action.payload.module];
        const nextMessages = {};
        for (const locale in state.messages) {
          nextMessages[locale] = { ...state.messages[locale] };
        }
        const keys = localeMapping[action.payload.module] || {};
        for (const id in keys) {
          for (const locale in state.messages) {
            delete nextMessages[locale][id];
          }
        }
        delete localeMapping[action.payload.module];

        return {
          env: state.env,
          language: state.language,
          messages: nextMessages,
          updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: nextReadyModules,
        };
      }
      case constants.ADD_I18N_MESSAGES: {
        if (action.payload.batch.length === 0) {
          if (action.payload.language !== state.language) {
            return {
              env: state.env,
              language: action.payload.language,
              messages: state.messages,
              updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
              readyModules: state.readyModules,
            };
          }
          return state;
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
              if (typeof item !== "object") {
                addItem(`${path}.${property}`, item);
              } else {
                walk(`${path}.${property}`, item);
              }
            }
          };
          walk("", patch.data);
        }

        return {
          env: state.env,
          language: action.payload.language,
          messages: nextMessages,
          updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
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