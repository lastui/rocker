import "regenerator-runtime/runtime";

import Module from "./component/Module";
import { SET_LANGUAGE, REFRESH, SET_SHARED, CLEAR_SHARED } from "./constants";
import registerModule from "./register";

function setLanguage(language) {
  return {
    type: SET_LANGUAGE,
    payload: {
      language,
    },
  };
}

function refresh() {
  return {
    type: REFRESH,
  };
}

function setShared(data) {
  return {
    type: SET_SHARED,
    payload: {
      data,
    },
  };
}

function clearShared() {
  return {
    type: CLEAR_SHARED,
    payload: {},
  };
}

const actions = {
  setLanguage,
  setShared,
  clearShared,
  refresh,
};

export { Module, actions, registerModule };

export default {
  Module,
  actions,
  registerModule,
};
