const emptydict = {}

export const getEntrypoint = (state) => state.runtime.entrypoint;

export const getLanguage = (state) => state.runtime.language;

export const getI18nMessages = (state) =>
	state.runtime.messages[state.runtime.language] || emptydict;