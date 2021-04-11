export const getEntrypoint = (state) => state.runtime.entrypoint;

export const getIsReady = (state) => state.runtime.ready;

export const getLanguage = (state) => state.runtime.language;

export const getI18nMessages = (state) => {
	const messages = state.runtime.messages;
	if (!messages) {
		return {}
	}
	return messages[state.runtime.language] || {};
}
