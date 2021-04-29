import { constants } from "@lastui/rocker/platform";

const initialState = {
	meta: {},
	loaded: {},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_AVAILABLE_MODULES: {
			const meta = {};
			const loaded = {};
			action.payload.modules.forEach((item) => {
				meta[item.id] = item.meta || {};
				loaded[item.id] = state.loaded[item.id] || false;
			});
			return {
				meta,
			};
		}
		case constants.MODULE_LOADED: {
			const nextLoaded = { ...state.loaded };
			nextLoaded[action.payload.id] = true;
			return {
				meta: state.meta,
				loaded: nextLoaded,
			};
		}
		case constants.MODULE_UNLOADED: {
			const nextLoaded = { ...state.loaded };
			nextLoaded[action.payload.id] = false;
			return {
				meta: state.meta,
				loaded: nextLoaded,
			};
		}
		default: {
			return state;
		}
	}
};