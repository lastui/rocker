import * as constants from "../../constants";
import { warning } from "../../utils";

const initial = {
	keys: [],
	values: [],
};

const handler = {
	deleteProperty: function (target, prop) {
		const index = target.keys.indexOf(prop);
		if (index === -1) {
			return true;
		}
		target.keys = target.keys.filter((_, idx) => idx !== index);
		target.values = target.values.filter((_, idx) => idx !== index);
		return true;
	},
	get: function (target, prop) {
		if (prop === Symbol.iterator) {
			return target.values[Symbol.iterator].bind(target.values);
		}
		const index = target.keys.indexOf(prop);
		if (index !== -1) {
			return target.values[index][1];
		}
		return undefined;
	},
	set: function (obj, prop, value) {
		if (!value) {
			return false;
		}
		const index = obj.keys.indexOf(prop);
		if (index === -1) {
			obj.keys.push(prop);
			obj.values.push([prop, value]);
		} else {
			obj.values[index] = [prop, value];
		}
		return true;
	},
};

const modulesReducers = new Proxy(initial, handler);

const initialState = {};

function createModulesReducer() {
	return (state = initialState, action) => {
		switch (action.type) {
			case constants.INIT:
			case constants.REFRESH:
			case constants.FETCH_CONTEXT:
			case constants.ADD_I18N_MESSAGES:
			case constants.REMOVE_I18N_MESSAGES:
			case constants.MODULE_LOADED:
			case constants.SET_AVAILABLE_MODULES: {
				return state;
			}
			case constants.MODULE_READY: {
				const id = action.payload.module;
				console.debug(`module ${id} ready`);
				const reducer = modulesReducers[id];
				if (reducer) {
					try {
						state[id] = reducer(state[id], action);
					} catch (error) {
						warning(`module ${id} reducer failed to reduce`, error);
					}
				}
				console.log(`+ module ${id}`);
				return state;
			}
			case constants.MODULE_UNLOADED: {
				const id = action.payload.module;
				if (state[id]) {
					console.debug(`module ${id} evicting redux state`);
					delete state[id];
				}
				console.debug(`module ${id} unloaded`);
				console.log(`- module ${id}`);
				return state;
			}
			default: {
				for (const [id, reducer] of modulesReducers) {
					try {
						state[id] = reducer(state[id], action);
					} catch (error) {
						warning(`module ${id} reducer failed to reduce`, error);
					}
				}
				return state;
			}
		}
	};
}

export { modulesReducers };

export default createModulesReducer();