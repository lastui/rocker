import { constants } from "@lastui/rocker/platform";

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
			};
		}
		case constants.ADD_I18N_MESSAGES: {
			console.debug("runtime add i18n messages", action.payload);
			return state;
		}
		case constants.REMOVE_I18N_MESSAGES: {
			console.debug("runtime remove i18n messages", action.payload);
			return state;
		}
		case constants.MODULES_READY: {
			return {
				language: state.language,
				entrypoint: state.entrypoint,
				ready: action.payload.isReady,
			};
		}
		case constants.SET_ENTRYPOINT_MODULE: {
			return {
				language: state.language,
				entrypoint: action.payload.entrypoint,
				ready: state.ready,
			};
		}
		default: {
			return state;
		}
	}
};