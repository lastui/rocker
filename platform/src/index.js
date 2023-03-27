import { SET_LANGUAGE, REFRESH, SET_SHARED } from "./constants";

import registerModule from "./register";
import Module from "./component/Module";

const object1 = {};

Object.defineProperties(object1, {
  property1: {
    value: 42,
    writable: true,
  },
  property2: {},
});

console.log(object1.property1);

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

function setGlobalShared(data) {
  return {
    type: SET_SHARED,
    payload: {
      data,
      module: false,
    },
  };
}

function setLocalShared(data) {
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
  setGlobalShared,
  setLocalShared,
  refresh,
};

export { Module, actions, registerModule };

export default {
  Module,
  actions,
  registerModule,
};
