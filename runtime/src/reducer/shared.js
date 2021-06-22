import { constants } from "@lastui/rocker/platform";

const initialState = {
	meta: {},
	available: [],
	loaded: {},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_AVAILABLE_MODULES: {
			const meta = {};
			const available = {};
			const loaded = {};
			action.payload.modules.forEach((item) => {
				meta[item.id] = item.meta || {};
				available[item.id] = true;
				loaded[item.id] = state.loaded[item.id] || false;
			});
			return {
				meta,
				available: Object.keys(available),
				loaded: {},
			};
		}
		case constants.MODULE_LOADED: {
			const nextLoaded = { ...state.loaded };
			nextLoaded[action.payload.id] = true;
			return {
				meta: state.meta,
				available: state.available,
				loaded: nextLoaded,
			};
		}
		case constants.MODULE_UNLOADED: {
			const nextLoaded = { ...state.loaded };
			nextLoaded[action.payload.id] = false;
			return {
				meta: state.meta,
				available: state.available,
				loaded: nextLoaded,
			};
		}
		default: {
			return state;
		}
	}
};