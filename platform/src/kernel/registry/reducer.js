import { combineReducers } from "redux";

import * as constants from "../../constants";
import { modulesReducers } from "../reducer/modules";

const emptydict = {};

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
      env(_state, _action) {
        return emptydict;
      },
      shared(_state, _action) {
        return emptydict;
      },
    });
    composedReducer(undefined, { type: constants.MODULE_INIT, module: name });
    modulesReducers[name] = composedReducer;
  } catch (error) {
    console.error(`module ${name} wanted to register invalid reducer`, error);
  }
}

export { addReducer, removeReducer };
