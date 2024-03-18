import "regenerator-runtime/runtime";

import Module from "./component/Module";
import { SET_LANGUAGE, REFRESH, SET_SHARED } from "./constants";
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
      module: true,
    },
  };
}

const actions = {
  setLanguage,
  setShared,
  refresh,
};

export { Module, actions, registerModule };

export default {
  Module,
  actions,
  registerModule,
};
