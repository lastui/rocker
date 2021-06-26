import { constants } from "@lastui/rocker/platform";

const localeMapping = {};

const initialState = {
	language: "en-US",
	messages: {},
	entrypoint: null,
	ready: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_LANGUAGE: {
			return {
				language: action.payload.language,
				entrypoint: state.entrypoint,
				ready: state.ready,
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
				nextMessages[action.payload.language][id] = action.payload.data[action.payload.language][id];
			}
			return {
				language: state.language,
				entrypoint: state.entrypoint,
				ready: state.ready,
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
				language: state.language,
				entrypoint: state.entrypoint,
				ready: state.ready,
				messages: nextMessages,
			};
		}
		case constants.MODULES_READY: {
			return {
				language: state.language,
				entrypoint: state.entrypoint,
				ready: action.payload.isReady,
				messages: state.messages,
			};
		}
		case constants.SET_ENTRYPOINT_MODULE: {
			return {
				language: state.language,
				entrypoint: action.payload.entrypoint,
				ready: state.ready,
				messages: state.messages,
			};
		}
		default: {
			return state;
		}
	}
};