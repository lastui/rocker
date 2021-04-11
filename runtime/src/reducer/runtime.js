import { constants } from "@lastui/rocker/platform";

const refCount = {};

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
			for (const locale in action.payload.data) {
				if (!nextMessages[locale]) {
					nextMessages[locale] = {};
				}
				for (const id in action.payload.data[locale]) {
					if (refCount[id]) {
						refCount[id]++;
					} else {
						refCount[id] = 1;
					}
					nextMessages[locale][id] = action.payload.data[locale][id];
				}
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

			for (const locale in action.payload.data) {
				for (const id in action.payload.data[locale]) {
					if (refCount[id]) {
						refCount[id]--;
					}
				}
			}

			const toDelete = [];
			for (const id in refCount) {
				if (refCount[id]) {
					continue
				}
				for (const locale in state.messages) {
					delete nextMessages[locale][id];
				}
				toDelete.push(id);
			}

			for (const id of toDelete) {
				delete refCount[id];
			}
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
