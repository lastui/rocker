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

export const getIsInitialized = (state) => state.runtime.initialized;

export const getEntrypoint = (state) => state.runtime.entrypoint;

export const getLanguage = (state) => state.localisation.language;
