import { constants } from "@lastui/rocker/platform";

const initialState = {
	entrypoint: null,
	ready: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case constants.MODULES_READY: {
			return {
				entrypoint: state.entrypoint,
				ready: action.payload.isReady,
			};
		}

		case constants.SET_ENTRYPOINT_MODULE: {
			return {
				entrypoint: action.payload.entrypoint,
				ready: state.ready,
			};
		}

		default: {
			return state;
		}
	}
};
