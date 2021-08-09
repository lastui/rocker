import { constants } from "@lastui/rocker/platform";

const initialState = {
	buster: 0,
	meta: {},
	available: [],
	loaded: {},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_AVAILABLE_MODULES: {
			const meta = {};
			const available = [];
			const loaded = {};
			action.payload.modules.forEach((item) => {
				if (!meta[item.id]) {
					available.push(item.id)
				}
				meta[item.id] = item.meta || {};
				loaded[item.id] = state.loaded[item.id] || false;
			});
			return {
				buster: Date.now(),
				meta,
				available,
				loaded,
			};
		}
		case constants.MODULE_LOADED: {
			const nextLoaded = { ...state.loaded };
			nextLoaded[action.payload.id] = true;
			return {
				buster: state.buster,
				meta: state.meta,
				available: state.available,
				loaded: nextLoaded,
			};
		}
		case constants.MODULE_UNLOADED: {
			const nextLoaded = { ...state.loaded };
			nextLoaded[action.payload.id] = false;
			return {
				buster: state.buster,
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