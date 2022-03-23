const emptydict = {}

export const getEntrypoint = (state) => state.runtime.entrypoint;

export const getLanguage = (state) => state.shared.language;

export const getI18nMessages = (state) => {
	console.log('selector get messages', state.shared.messages, 'language', state.shared.language);

	return state.shared.messages[state.shared.language] || emptydict
};