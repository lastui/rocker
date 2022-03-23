import { constants } from "@lastui/rocker/platform";

const localeMapping = {};

const initialState = {
	language: "en-US",
	messages: {},
	entrypoint: null,
	updatedAt: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case constants.ADD_I18N_MESSAGES: {
			if (!action.payload.batch.length) {
				return {
					updatedAt: state.updatedAt,
					language: action.payload.language,
					entrypoint: state.entrypoint,
					messages: state.messages,
				};
			}

			const nextMessages = {
				...state.messages,
			};

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
						if (typeof item !== "object") {
							addItem(`${path}.${property}`, item);
						} else {
							walk(`${path}.${property}`, item);
						}
					}
				};
				walk("", patch.data);
			}

			return {
				updatedAt: state.updatedAt,
				language: action.payload.language,
				entrypoint: state.entrypoint,
				messages: nextMessages,
			};
		}
		case constants.REMOVE_I18N_MESSAGES: {
			const nextMessages = {
				...state.messages,
			};
			const keys = localeMapping[action.payload.module] || {};
			for (const id in keys) {
				for (const locale in state.messages) {
					delete nextMessages[locale][id];
				}
			}
			delete localeMapping[action.payload.module];
			return {
				updatedAt: state.updatedAt,
				language: state.language,
				entrypoint: state.entrypoint,
				messages: nextMessages,
			};
		}
		case constants.SET_AVAILABLE_MODULES: {
			return {
				updatedAt: Date.now(),
				language: state.language,
				entrypoint: state.entrypoint,
				messages: state.messages,
			};
		}
		case constants.SET_ENTRYPOINT_MODULE: {
			return {
				updatedAt: state.updatedAt,
				language: state.language,
				entrypoint: action.payload.entrypoint,
				messages: state.messages,
			};
		}
		default: {
			return state;
		}
	}
};
