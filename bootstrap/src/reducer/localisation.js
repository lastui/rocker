/* c8 ignore start */
import * as constants from "../constants";

const initialState = {
  language: null,
  messages: {},
};
/* c8 ignore stop */

function createLocalisationReducer() {
  const localeMapping = {};
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.I18N_REMOVE_MESSAGES: {
        if (!(action.payload.module in localeMapping)) {
          return state;
        }

        const keys = localeMapping[action.payload.module];

        delete localeMapping[action.payload.module];

        for (const locale in state.messages) {
          for (const key in keys) {
            delete state.messages[locale][key];
          }
        }

        return {
          language: state.language,
          messages: state.messages,
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

        if (!(action.payload.language in state.messages)) {
          state.messages[action.payload.language] = {};
        }

        for (const patch of action.payload.batch) {
          if (!(patch.module in localeMapping)) {
            localeMapping[patch.module] = {};
          }

          const addItem = (key, message) => {
            const hash = key.substring(1);
            localeMapping[patch.module][hash] = true;
            state.messages[action.payload.language][hash] = message;
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
          messages: state.messages,
        };
      }
      default: {
        return state;
      }
    }
  };
}

/* c8 ignore start */
export { initialState };

export default createLocalisationReducer();
/* c8 ignore stop */