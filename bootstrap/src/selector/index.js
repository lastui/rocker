/* global DEFAULT_LOCALE */

const emptydict = {};

const memoizedMessages = new Proxy(
  {
    fallback: emptydict,
    primary: emptydict,
    descriptor: { configurable: true, enumerable: true },
  },
  {
    getOwnPropertyDescriptor(ref, key) {
      return ref.descriptor;
    },
    get(ref, key) {
      if (key in ref.primary) {
        return ref.primary[key];
      }
      if (key in ref.fallback) {
        return ref.fallback[key];
      }
      return undefined;
    },
    set(ref, locale, messages) {
      if (!messages) {
        ref.primary = emptydict;
        ref.fallback = emptydict;
        return true;
      }
      if (locale in messages) {
        ref.primary = messages[locale];
      } else {
        ref.primary = emptydict;
      }
      if (DEFAULT_LOCALE in messages) {
        ref.fallback = messages[DEFAULT_LOCALE];
      } else {
        ref.fallback = emptydict;
      }
      return true;
    },
  },
);

export const getI18nMessages = (state) => {
  memoizedMessages[state.env.language] = state.env.messages;
  return memoizedMessages;
};

export const getIsInitialized = (state) => state.runtime.initialized;

export const getEntrypoint = (state) => state.runtime.entrypoint;

export const getLanguage = (state) => state.env.language;
