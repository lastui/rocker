import { combineReducers } from "redux";

import * as constants from "../../constants";
import { warning } from "../../utils";
import { modulesReducers } from "../reducer/modules";

const emptydict = {};

function removeReducer(name) {
  if (!modulesReducers[name]) {
    return;
  }
  console.debug(`module ${name} removing reducer`);
  delete modulesReducers[name];
}

async function addReducer(name, reducer) {
  if (modulesReducers[name]) {
    delete modulesReducers[name];
    console.debug(`module ${name} replacing reducer`);
  } else {
    console.debug(`module ${name} introducing reducer`);
  }
  try {
    const composedReducer = combineReducers({
      ...reducer,
      platform: (_state, _action) => emptydict,
      shared: (_state, _action) => emptydict,
    });
    composedReducer(undefined, { type: constants.MODULE_INIT, module: name });
    modulesReducers[name] = composedReducer;
  } catch (error) {
    warning(`module ${name} wanted to register invalid reducer`, error);
  }
}

export { addReducer, removeReducer };
