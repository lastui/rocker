import * as constants from "../../constants";

const initialState = {
  meta: {},
  language: "en-US",
  messages: {},
  updatedAt: 0,
  readyModules: {},
};

const sharedReducer = () => {
  const localeMapping = {};
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.SET_AVAILABLE_MODULES: {
        const meta = {};
        for (const item of action.payload.modules) {
          meta[item.id] = item.meta || {};
        }
        return {
          meta,
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
          meta: state.meta,
          language: state.language,
          messages: state.messages,
          updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: nextReadyModules,
        };
      }
      case constants.MODULE_LOADED: {
        return {
          meta: state.meta,
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
          meta: state.meta,
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
              meta: state.meta,
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
          meta: state.meta,
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
};

export default sharedReducer();