const emptydict = {};

function createMessagesWithFallback(defaultLocale) {
  return new Proxy(
    {
      fallback: emptydict,
      primary: emptydict,
      descriptor: { configurable: true, enumerable: true },
    },
    {
      getOwnPropertyDescriptor(ref, _key) {
        return ref.descriptor;
      },
      get(ref, key) {
        return ref.primary[key] ?? ref.fallback[key];
      },
      set(ref, locale, messages) {
        if (locale in messages) {
          ref.primary = messages[locale];
        } else {
          ref.primary = emptydict;
        }
        if (defaultLocale in messages) {
          ref.fallback = messages[defaultLocale];
        } else {
          ref.fallback = emptydict;
        }
        return true;
      },
    },
  );
}

export const getI18nMessagesFacade = (defaultLocale) => {
  const memo = createMessagesWithFallback(defaultLocale);
  return (state) => {
    memo[state.localisation.language] = state.localisation.messages;
    return memo;
  };
};

export const getLanguage = (state) => state.localisation.language;

export const getIsInitialized = (state) => state.runtime.initialized;

export const getEntrypoint = (state) => state.runtime.entrypoint;
