/* c8 ignore start */
import { combineReducers } from "redux";

import * as constants from "../../constants";
import { warning } from "../../utils";
import { modulesReducers } from "../reducer/modules";

const emptydict = {};
/* c8 ignore stop */

function removeReducer(name) {
  if (!modulesReducers[name]) {
    return;
  }
  delete modulesReducers[name];
}

async function addReducer(name, reducer) {
  if (modulesReducers[name]) {
    delete modulesReducers[name];
  }
  try {
    const composedReducer = combineReducers({
      ...reducer,
      env: (_state, _action) => emptydict,
      shared: (_state, _action) => emptydict,
    });
    composedReducer(undefined, { type: constants.MODULE_INIT, module: name });
    modulesReducers[name] = composedReducer;
  } catch (error) {
    warning(`module ${name} wanted to register invalid reducer`, error);
  }
}

export { addReducer, removeReducer };
