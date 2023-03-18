const emptydict = {};

export const getEntrypoint = state => state.runtime.entrypoint;

export const getLanguage = state => state.shared.language;

export const getI18nMessages = state => state.shared.messages[state.shared.language] || emptydict;
