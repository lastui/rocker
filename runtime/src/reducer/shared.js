import { constants } from "@lastui/rocker/platform";

const initialState = {
	meta: {},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_AVAILABLE_MODULES: {
			const meta = action.payload.modules.map((item) => item.meta || {})
			return {
				meta,
			}
		}
		default: {
			return state;
		}
	}
};
