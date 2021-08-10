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
		case constants.SET_LANGUAGE: {
			return {
				updatedAt: state.updatedAt,
				language: action.payload.language,
				entrypoint: state.entrypoint,
				messages: state.messages,
			};
		}
		case constants.ADD_I18N_MESSAGES: {
			const nextMessages = {
				...state.messages,
			};
			if (!localeMapping[action.payload.module]) {
				localeMapping[action.payload.module] = {}
			}
			if (!nextMessages[action.payload.language]) {
				nextMessages[action.payload.language] = {};
			}
			for (const id in action.payload.data) {
				localeMapping[action.payload.module][id] = true
				nextMessages[action.payload.language][id] = action.payload.data[id];
			}
			return {
				updatedAt: state.updatedAt,
				language: state.language,
				entrypoint: state.entrypoint,
				messages: nextMessages,
			};
		}
		case constants.REMOVE_I18N_MESSAGES: {
			const nextMessages = {
				...state.messages,
			};
			const keys = localeMapping[action.payload.module] || {}
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