import * as constants from "../constants";

const initialState = {
  language: null,
  messages: {},
};

function createLocalisationReducer() {
  const localeMapping = {};
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.I18N_REMOVE_MESSAGES: {
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
          language: state.language,
          messages: nextMessages,
        };
      }

      case constants.I18N_ADD_MESSAGES: {
        if (action.payload.batch.length === 0) {
          if (action.payload.language === state.language) {
            return state;
          }
          return {
            language: action.payload.language,
            messages: state.messages,
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
          language: action.payload.language,
          messages: nextMessages,
        };
      }
      default: {
        return state;
      }
    }
  };
}

export { initialState };

export default createLocalisationReducer();
