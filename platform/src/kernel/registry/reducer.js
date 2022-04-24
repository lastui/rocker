import * as constants from "../../constants";
import { modulesReducers } from "../reducer/modules";
import { combineReducers } from "redux";

const emptydict = {};

function removeReducer(id) {
  if (!modulesReducers[id]) {
    return;
  }
  console.debug(`module ${id} removing reducer`);
  delete modulesReducers[id];
}

async function addReducer(id, reducer) {
  if (!modulesReducers[id]) {
    delete modulesReducers[id];
    console.debug(`module ${id} replacing reducer`);
  } else {
    console.debug(`module ${id} introducing reducer`);
  }
  try {
    const composedReducer = combineReducers({
      ...reducer,
      shared: (_state, _action) => emptydict,
      runtime: (_state, _action) => emptydict,
    });
    composedReducer(undefined, { type: constants.MODULE_INIT, module: id });
    modulesReducers[id] = composedReducer;
  } catch (error) {
    warning(`module ${id} wanted to register invalid reducer`, error);
  }
}

export { addReducer, removeReducer };