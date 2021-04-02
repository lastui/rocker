import { constants } from "@lastui/rocker/platform";

const initialState = {};

export default (state = initialState, action) => {
	switch (action.type) {
		case constants.ADD_SHARED: {
			const nextState = { ...state };
			nextState[action.payload.name] = action.payload.data;
			return nextState;
		}
		case constants.REMOVE_SHARED: {
			const nextState = { ...state };
			delete nextState[action.payload.name];
			return nextState;
		}
		default: {
			return state;
		}
	}
};
