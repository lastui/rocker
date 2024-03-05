const emptydict = {};
const descriptor = { configurable: true, enumerable: true };

const memoizedMessages = new Proxy(
  {
    messages: emptydict,
    descriptor: undefined,
  },
  {
    getOwnPropertyDescriptor(ref, key) {
      return ref.descriptor;
    },
    get(ref, key) {
      return ref.messages[key];
    },
    set(ref, locale, messages) {
      let next = undefined;
      if (locale in messages) {
        next = messages[locale];
      }
      if (next) {
        ref.descriptor = descriptor;
        ref.messages = next;
      } else {
        ref.descriptor = undefined;
        ref.messages = emptydict;
      }
      return true;
    },
  },
);

export const getI18nMessages = (state) => {
  memoizedMessages[state.shared.language] = state.shared.messages;
  return memoizedMessages;
};

export const getIsInitialized = (state) => state.runtime.initialized;

export const getEntrypoint = (state) => state.runtime.entrypoint;

export const getLanguage = (state) => state.shared.language;
