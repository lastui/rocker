var platform_dll;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@lastui/rocker/platform/ModuleContext.jsx":
/*!****************************************************************!*\
  !*** ./node_modules/@lastui/rocker/platform/ModuleContext.jsx ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ModuleContextProvider": () => (/* binding */ ModuleContextProvider),
/* harmony export */   "useModuleLoader": () => (/* binding */ useModuleLoader)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};


var ModuleContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);

var ModuleContextProvider = function ModuleContextProvider(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ModuleContext.Provider, {
    value: props.moduleLoader || null
  }, props.moduleLoader ? props.children : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null));
};

var useModuleLoader = function useModuleLoader() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(ModuleContext);
};

__signature__(useModuleLoader, "useContext{}");


var _default = ModuleContextProvider;
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_default);
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(ModuleContext, "ModuleContext", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/ModuleContext.jsx");
  reactHotLoader.register(ModuleContextProvider, "ModuleContextProvider", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/ModuleContext.jsx");
  reactHotLoader.register(useModuleLoader, "useModuleLoader", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/ModuleContext.jsx");
  reactHotLoader.register(_default, "default", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/ModuleContext.jsx");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ }),

/***/ "./node_modules/@lastui/rocker/platform/actions.js":
/*!*********************************************************!*\
  !*** ./node_modules/@lastui/rocker/platform/actions.js ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "init": () => (/* binding */ init),
/* harmony export */   "setAvailableModules": () => (/* binding */ setAvailableModules),
/* harmony export */   "setEntryPointModule": () => (/* binding */ setEntryPointModule),
/* harmony export */   "loadModule": () => (/* binding */ loadModule)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./node_modules/@lastui/rocker/platform/constants.js");
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};


var init = function init() {
  return {
    type: _constants__WEBPACK_IMPORTED_MODULE_0__.INIT
  };
};
var setAvailableModules = function setAvailableModules() {
  var modules = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  return {
    type: _constants__WEBPACK_IMPORTED_MODULE_0__.SET_AVAILABLE_MODULES,
    payload: {
      modules: modules
    }
  };
};
var setEntryPointModule = function setEntryPointModule(entrypoint) {
  return {
    type: _constants__WEBPACK_IMPORTED_MODULE_0__.SET_ENTRYPOINT_MODULE,
    payload: {
      entrypoint: entrypoint
    }
  };
};
var loadModule = function loadModule(name) {
  return {
    type: _constants__WEBPACK_IMPORTED_MODULE_0__.LOAD_MODULE,
    payload: {
      name: name
    }
  };
};
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(init, "init", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/actions.js");
  reactHotLoader.register(setAvailableModules, "setAvailableModules", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/actions.js");
  reactHotLoader.register(setEntryPointModule, "setEntryPointModule", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/actions.js");
  reactHotLoader.register(loadModule, "loadModule", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/actions.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ }),

/***/ "./node_modules/@lastui/rocker/platform/constants.js":
/*!***********************************************************!*\
  !*** ./node_modules/@lastui/rocker/platform/constants.js ***!
  \***********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "INIT": () => (/* binding */ INIT),
/* harmony export */   "SET_AVAILABLE_MODULES": () => (/* binding */ SET_AVAILABLE_MODULES),
/* harmony export */   "SET_ENTRYPOINT_MODULE": () => (/* binding */ SET_ENTRYPOINT_MODULE),
/* harmony export */   "LOAD_MODULE": () => (/* binding */ LOAD_MODULE),
/* harmony export */   "SHUTDOWN": () => (/* binding */ SHUTDOWN),
/* harmony export */   "MODULE_INIT": () => (/* binding */ MODULE_INIT),
/* harmony export */   "MODULE_LOADED": () => (/* binding */ MODULE_LOADED),
/* harmony export */   "MODULE_UNLOADED": () => (/* binding */ MODULE_UNLOADED),
/* harmony export */   "MODULE_NOT_AVAILABLE": () => (/* binding */ MODULE_NOT_AVAILABLE),
/* harmony export */   "MODULES_READY": () => (/* binding */ MODULES_READY)
/* harmony export */ });
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var INIT = "@@platform/INIT";
var SET_AVAILABLE_MODULES = "@@platform/SET_AVAILABLE_MODULES";
var SET_ENTRYPOINT_MODULE = "@@platform/SET_ENTRYPOINT_MODULE";
var LOAD_MODULE = "@@platform/LOAD_MODULE";
var SHUTDOWN = "@@platform/SHUTDOWN";
var MODULE_INIT = "@@modules/INIT";
var MODULE_LOADED = "@@modules/LOADED";
var MODULE_UNLOADED = "@@modules/UNLOADED";
var MODULE_NOT_AVAILABLE = "@@modules/NOT_AVAILABLE";
var MODULES_READY = "@@modules/READY";
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(INIT, "INIT", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
  reactHotLoader.register(SET_AVAILABLE_MODULES, "SET_AVAILABLE_MODULES", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
  reactHotLoader.register(SET_ENTRYPOINT_MODULE, "SET_ENTRYPOINT_MODULE", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
  reactHotLoader.register(LOAD_MODULE, "LOAD_MODULE", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
  reactHotLoader.register(SHUTDOWN, "SHUTDOWN", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
  reactHotLoader.register(MODULE_INIT, "MODULE_INIT", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
  reactHotLoader.register(MODULE_LOADED, "MODULE_LOADED", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
  reactHotLoader.register(MODULE_UNLOADED, "MODULE_UNLOADED", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
  reactHotLoader.register(MODULE_NOT_AVAILABLE, "MODULE_NOT_AVAILABLE", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
  reactHotLoader.register(MODULES_READY, "MODULES_READY", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/constants.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ }),

/***/ "./node_modules/@lastui/rocker/platform/development.js":
/*!*************************************************************!*\
  !*** ./node_modules/@lastui/rocker/platform/development.js ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerModule": () => (/* binding */ registerModule),
/* harmony export */   "Module": () => (/* binding */ Module)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var connected_react_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! connected-react-router */ "./node_modules/connected-react-router/lib/index.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/lib/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! redux */ "./node_modules/redux/lib/redux.js");
/* harmony import */ var _routing__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./routing */ "./node_modules/@lastui/rocker/platform/routing.js");
/* module decorator */ module = __webpack_require__.hmd(module);


(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};











function configureStore() {
  var initialState = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var rootReducer = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var enhancers = [(0,connected_react_router__WEBPACK_IMPORTED_MODULE_3__.routerMiddleware)(_routing__WEBPACK_IMPORTED_MODULE_7__.history)];
  var reducer = (0,redux__WEBPACK_IMPORTED_MODULE_6__.combineReducers)(_objectSpread(_objectSpread({}, rootReducer), {}, {
    router: (0,connected_react_router__WEBPACK_IMPORTED_MODULE_3__.connectRouter)(_routing__WEBPACK_IMPORTED_MODULE_7__.history)
  }));
  var store = (0,redux__WEBPACK_IMPORTED_MODULE_6__.createStore)(reducer, initialState, redux__WEBPACK_IMPORTED_MODULE_6__.compose.apply(void 0, [redux__WEBPACK_IMPORTED_MODULE_6__.applyMiddleware.apply(void 0, enhancers)]));
  return store;
}

function registerModule(scope) {
  var node = document.createElement("div");
  var store = configureStore({}, scope.reducer);
  var View = scope.MainView;
  react_dom__WEBPACK_IMPORTED_MODULE_2__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_5__.Provider, {
    store: store
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(connected_react_router__WEBPACK_IMPORTED_MODULE_3__.ConnectedRouter, {
    history: _routing__WEBPACK_IMPORTED_MODULE_7__.history
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_router__WEBPACK_IMPORTED_MODULE_4__.Switch, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(View, null)))), node);
  document.body.appendChild(node);
}
var Module = function Module(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    style: {
      boxSizing: "border-box",
      border: "1px dashed rgba(0,0,0,.5)",
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "[".concat(props.name, "]"));
};
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(configureStore, "configureStore", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/development.js");
  reactHotLoader.register(registerModule, "registerModule", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/development.js");
  reactHotLoader.register(Module, "Module", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/development.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ }),

/***/ "./node_modules/@lastui/rocker/platform/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@lastui/rocker/platform/index.js ***!
  \*******************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Module": () => (/* binding */ Module),
/* harmony export */   "ModuleContextProvider": () => (/* reexport safe */ _ModuleContext__WEBPACK_IMPORTED_MODULE_3__.ModuleContextProvider),
/* harmony export */   "useModuleLoader": () => (/* reexport safe */ _ModuleContext__WEBPACK_IMPORTED_MODULE_3__.useModuleLoader),
/* harmony export */   "actions": () => (/* reexport module object */ _actions__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "constants": () => (/* reexport module object */ _constants__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "history": () => (/* reexport safe */ _routing__WEBPACK_IMPORTED_MODULE_2__.history),
/* harmony export */   "createModuleLoader": () => (/* reexport safe */ _modules__WEBPACK_IMPORTED_MODULE_4__.createModuleLoader),
/* harmony export */   "moduleLoaderMiddleware": () => (/* reexport safe */ _modules__WEBPACK_IMPORTED_MODULE_4__.moduleLoaderMiddleware),
/* harmony export */   "registerModule": () => (/* binding */ registerModule),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions */ "./node_modules/@lastui/rocker/platform/actions.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./node_modules/@lastui/rocker/platform/constants.js");
/* harmony import */ var _routing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./routing */ "./node_modules/@lastui/rocker/platform/routing.js");
/* harmony import */ var _ModuleContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ModuleContext */ "./node_modules/@lastui/rocker/platform/ModuleContext.jsx");
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules */ "./node_modules/@lastui/rocker/platform/modules.js");
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};






var registerModule =  false ? 0 : __webpack_require__(/*! ./development */ "./node_modules/@lastui/rocker/platform/development.js").registerModule;
var Module =  false ? 0 : __webpack_require__(/*! ./development */ "./node_modules/@lastui/rocker/platform/development.js").Module;

var _default = {
  Module: Module,
  ModuleContextProvider: _ModuleContext__WEBPACK_IMPORTED_MODULE_3__.ModuleContextProvider,
  useModuleLoader: _ModuleContext__WEBPACK_IMPORTED_MODULE_3__.useModuleLoader,
  actions: _actions__WEBPACK_IMPORTED_MODULE_0__,
  constants: _constants__WEBPACK_IMPORTED_MODULE_1__,
  history: _routing__WEBPACK_IMPORTED_MODULE_2__.history,
  createModuleLoader: _modules__WEBPACK_IMPORTED_MODULE_4__.createModuleLoader,
  moduleLoaderMiddleware: _modules__WEBPACK_IMPORTED_MODULE_4__.moduleLoaderMiddleware,
  registerModule: registerModule
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_default);
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(registerModule, "registerModule", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/index.js");
  reactHotLoader.register(Module, "Module", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/index.js");
  reactHotLoader.register(_default, "default", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/index.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ }),

/***/ "./node_modules/@lastui/rocker/platform/modules.js":
/*!*********************************************************!*\
  !*** ./node_modules/@lastui/rocker/platform/modules.js ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "moduleLoaderMiddleware": () => (/* binding */ moduleLoaderMiddleware),
/* harmony export */   "createModuleLoader": () => (/* binding */ createModuleLoader)
/* harmony export */ });
/* unused harmony export registerModule */
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/lib/index.js");
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! redux-saga/effects */ "./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js");
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(redux_saga_effects__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! redux */ "./node_modules/redux/lib/redux.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants */ "./node_modules/@lastui/rocker/platform/constants.js");
/* module decorator */ module = __webpack_require__.hmd(module);


(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }



var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};






var LOADED_MODULES = "loadedModules";
var AVAILABLE_MODULES = "availableModules";
var LOADING_MODULES = "loadingModules";
var MOUNTED_MODULES = "mountedModules";
var SAGAS = "sagas"; //const LISTENERS = "listeners";

var REDUCERS = "reducers";
var CACHE = "cache";
var READY = "ready";
function registerModule(scope) {
  if (scope.MainView) {
    this.MainView = scope.MainView;
  }

  if (scope.reducer) {
    this.reducer = scope.reducer;
  }

  if (scope.saga) {
    this.saga = scope.saga;
  }
}
var moduleLoaderMiddleware = function moduleLoaderMiddleware(loader) {
  return function (store) {
    return function (next) {
      return function (action) {
        switch (action.type) {
          case _constants__WEBPACK_IMPORTED_MODULE_6__.SET_AVAILABLE_MODULES:
            {
              return loader.setAvailableModules(action.payload.modules);
            }

          case _constants__WEBPACK_IMPORTED_MODULE_6__.SET_ENTRYPOINT_MODULE:
            {
              return loader.loadModule(action.payload.entrypoint).then(function () {
                return next(action);
              });
            }

          default:
            {
              return next(action);
            }
        }
      };
    };
  };
};
var createModuleLoader = function createModuleLoader() {
  var _moduleState;

  var store = {
    dispatch: function dispatch() {
      console.error("Redux store is not provided!");
    },
    getState: function getState() {
      console.error("Redux store is not provided!");
      return {};
    },
    subscribe: function subscribe() {
      console.error("Redux store is not provided!");
    }
  };

  var sagaRunner = function sagaRunner() {
    console.log("Sagas runnner not provided!");
  };

  var moduleState = (_moduleState = {}, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(_moduleState, CACHE, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(_moduleState, AVAILABLE_MODULES, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(_moduleState, LOADED_MODULES, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(_moduleState, LOADING_MODULES, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(_moduleState, MOUNTED_MODULES, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(_moduleState, READY, true), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(_moduleState, REDUCERS, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(_moduleState, SAGAS, {}), _moduleState);

  var getAvailableModules = function getAvailableModules() {
    return moduleState[AVAILABLE_MODULES];
  };

  var getAvailableModule = function getAvailableModule(name) {
    return moduleState[AVAILABLE_MODULES][name];
  };

  var getLoadedModules = function getLoadedModules() {
    return moduleState[LOADED_MODULES];
  };

  var getLoadedModule = function getLoadedModule(name) {
    return moduleState[LOADED_MODULES][name];
  };

  var getLoadingModules = function getLoadingModules() {
    return moduleState[LOADING_MODULES];
  };

  var setLoadingModule = function setLoadingModule(name, promise) {
    moduleState[LOADING_MODULES][name] = promise;
    return promise;
  };

  var getReducers = function getReducers() {
    return moduleState[REDUCERS];
  };

  var removeReducer = function removeReducer(name) {
    if (!moduleState[REDUCERS][name]) {
      return;
    }

    console.log("module", name, "removing reducer");
    delete moduleState[REDUCERS][name];
  };

  var addReducer = function addReducer(name, reducer) {
    removeReducer(name);
    console.log("module", name, "adding reducer");
    reducer({}, {
      type: _constants__WEBPACK_IMPORTED_MODULE_6__.MODULE_INIT
    });
    moduleState[REDUCERS][name] = reducer;
  };

  var removeSaga = function removeSaga(name) {
    if (!moduleState[SAGAS][name]) {
      return;
    }

    console.log("module", name, "removing saga");
    console.log("before cancel");
    sagaRunner( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0,redux_saga_effects__WEBPACK_IMPORTED_MODULE_4__.cancel)(moduleState[SAGAS][name]);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    console.log("after cancel");
    console.log("module", name, "removed saga");
    delete moduleState[SAGAS][name];
  };

  var addSaga = function addSaga(name, saga) {
    removeSaga(name);
    console.log("module", name, "adding saga");
    moduleState[SAGAS][name] = sagaRunner( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee2() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0,redux_saga_effects__WEBPACK_IMPORTED_MODULE_4__.fork)(saga);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    console.log("module", name, "added saga");
  };

  var setCache = function setCache(key, value) {
    moduleState[CACHE][key] = value;
    return value;
  };

  var getFromCache = function getFromCache(key) {
    return moduleState[CACHE][key];
  };

  var clearCache = function clearCache() {
    return moduleState[CACHE] = {};
  };

  var setReady = function setReady(isReady) {
    moduleState[READY] = isReady;
    store.dispatch({
      type: _constants__WEBPACK_IMPORTED_MODULE_6__.MODULES_READY,
      payload: isReady
    });
  };

  var cachePromise = function cachePromise(cacheKey, promise) {
    return promise.then(function (data) {
      return Promise.resolve(setCache(cacheKey, data));
    });
  };

  var connectModule = function connectModule(name) {
    var scope = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};

    //console.log("connecting module", name, "with scope", scope);
    if (scope.reducer) {
      //console.log("adding reducer of", name, "is", scope.reducer);
      scope.reducer.router = function () {
        return {};
      }; //console.log("after patching router in its", scope.reducer);


      addReducer(name, (0,redux__WEBPACK_IMPORTED_MODULE_5__.combineReducers)(scope.reducer));
    }

    if (scope.saga) {
      //console.log("adding saga of", name, "is", scope.saga);
      addSaga(name, scope.saga);
    }

    var module = {
      name: name,
      root: scope.MainView && isolateModule(name, scope.MainView)
    };
    moduleState[LOADED_MODULES][name] = module;
    delete moduleState[LOADING_MODULES][name];
    return {
      type: _constants__WEBPACK_IMPORTED_MODULE_6__.MODULE_LOADED,
      payload: {
        name: name
      }
    };
  };

  var loadModuleFile = function loadModuleFile(uri) {
    return fetch(uri).then(function (data) {
      return data.text();
    }).then(function (data) {
      var sandbox = {
        __SANDBOX_SCOPE__: {}
      }; // FIXME try without "with(this)"

      var r = new Function("with(this) {" + data + ";}").call(sandbox);

      if (r !== void 0) {
        //console.log("leak while evaluating sandbox", r);
        return {};
      } //console.log('')
      //console.log("sandbox value after evaluation is", sandbox);


      return sandbox.__SANDBOX_SCOPE__;
    });
  };

  var getMountedModules = function getMountedModules() {
    return moduleState[MOUNTED_MODULES];
  };

  var setModuleMountState = function setModuleMountState(name, mounted) {
    if (!mounted) {
      delete moduleState[MOUNTED_MODULES][name];
    } else {
      moduleState[MOUNTED_MODULES][name] = true;
    }
  };

  var isModuleLoaded = function isModuleLoaded(name) {
    return moduleState[LOADED_MODULES][name] !== void 0;
  };

  var isModuleMounted = function isModuleMounted(name) {
    return moduleState[MOUNTED_MODULES][name];
  };

  var isModuleLoading = function isModuleLoading(name) {
    return moduleState[LOADING_MODULES][name] !== void 0;
  };

  var isModuleAvailable = function isModuleAvailable(name) {
    return moduleState[AVAILABLE_MODULES][name] !== void 0;
  };

  var loadModule = function loadModule(name) {
    if (isModuleLoaded(name)) {
      return Promise.resolve(getLoadedModule(name));
    }

    console.log("loading module", name);

    if (isModuleLoading(name)) {
      return moduleState[LOADING_MODULES][name];
    }

    var module = getAvailableModule(name);

    if (!module) {
      store.dispatch({
        type: _constants__WEBPACK_IMPORTED_MODULE_6__.MODULE_NOT_AVAILABLE,
        payload: {
          name: name
        }
      });
      return Promise.resolve(null);
    }

    return setLoadingModule(name, loadModuleFile(module.url).then(function (data) {
      store.dispatch(connectModule(name, data));
      return getLoadedModule(name);
    })).catch(function (error) {
      delete moduleState[LOADING_MODULES][name];
      return Promise.resolve(null);
    });
  };

  var unloadModule = function unloadModule(name) {
    console.log("unloading module", name);
    removeReducer(name);
    removeSaga(name);
    delete moduleState[LOADED_MODULES][name];
    store.dispatch({
      type: _constants__WEBPACK_IMPORTED_MODULE_6__.MODULE_UNLOADED,
      payload: {
        name: name
      }
    }); //delete moduleState[LISTENERS][name];
  };

  var getReducer = function getReducer() {
    return function () {
      var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var action = arguments.length > 1 ? arguments[1] : void 0;

      if (!moduleState[READY]) {
        return state;
      }

      if (action.type.startsWith("@@module/")) {
        return state;
      }

      for (var name in moduleState[REDUCERS]) {
        var moduleLoaded = isModuleLoaded(name);

        if (!moduleLoaded) {
          continue;
        }

        if (action.type.startsWith("@@router/")) {
          state[name] = moduleState[REDUCERS][name](state[name], action);
        } else if (action.type.startsWith("@" + name + "/")) {
          state[name] = moduleState[REDUCERS][name](state[name], _objectSpread(_objectSpread({}, action), {}, {
            type: action.type.slice(("@" + name + "/").length)
          }));
        }
      }

      return state;
    };
  };

  var isolateStore = function isolateStore(name) {
    return {
      dispatch: function dispatch(action) {
        console.log("dispatch", name, "action", action.type);

        if (action.type.startsWith("@@")) {
          store.dispatch(action);
          /*
          // FIXME check if its loaded
          for (const n in moduleState[LISTENERS]) {
            for (const listener in moduleState[LISTENERS][n]) {
              try {
                console.log('listener', n, 'as', listener);
                listener();
                console.log(
                  "notified",
                  n,
                  "about dispatch with listener",
                  listener
                );
              } catch (error) {
                console.error("unable to notify listener for", n, "with", error);
              }
            }
          }
          */
        } else {
          store.dispatch(_objectSpread(_objectSpread({}, action), {}, {
            type: "@" + name + "/" + action.type
          }));
          /*
          if (moduleState[LISTENERS][name]) {
            for (const listener in moduleState[LISTENERS][name]) {
              console.log(
                "notified",
                name,
                "about dispatch with listener",
                listener
              );
              listener();
            }
          }*/
        }
      },
      getState: function getState() {
        console.log("get state called for", name);
        var state = store.getState();
        var isolatedState = state.modules[name] || {};
        isolatedState.router = state.router;
        return isolatedState;
      },
      subscribe: function subscribe(listener) {
        console.log("module", name, "wanted to subscribe", listener); //console.log("subscribing to events at", name, "with", listener);
        // fixme subscribe returns function to unsuscribe
        // listener function should be invoked after event is dispatched
        // some namespacing control is needed
        // FIXME array

        /*
        if (!moduleState[LISTENERS][name]) {
          moduleState[LISTENERS][name] = [];
        }
        moduleState[LISTENERS][name].push(listener);
        return () => {
          const index = moduleState[LISTENERS][name].indexOf(listener);
          moduleState[LISTENERS][name].splice(index, 1);
          if (moduleState[LISTENERS][name].length == 0) {
            delete moduleState[LISTENERS][name];
          }
        };
        */
        //return store.subscribe(listener); // FIXME do not listen to other modules events
      },
      replaceReducer: function replaceReducer(newReducer) {
        console.log("replaceReducer called for", name);
        addReducer(name, newReducer);
      }
    };
  };

  var isolateModule = function isolateModule(name, Component) {
    var isolatedStore = isolateStore(name);

    var ModuleWrapper = function ModuleWrapper(props) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_3__.Provider, {
        store: isolatedStore
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(Component, props));
    };
  };

  return {
    setSagaRunner: function setSagaRunner(nextSagaRunner) {
      if (nextSagaRunner) {
        sagaRunner = nextSagaRunner;
      }
    },
    setStore: function setStore(nextStore) {
      if (nextStore) {
        store = nextStore;
      }
    },
    setAvailableModules: function setAvailableModules() {
      var modules = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      setReady(false);
      moduleState[AVAILABLE_MODULES] = {};

      var _iterator = _createForOfIteratorHelper(modules),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var module = _step.value;
          moduleState[AVAILABLE_MODULES][module.name] = module;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      for (var name in moduleState[LOADED_MODULES]) {
        if (!isModuleAvailable(name)) {
          this.unloadModule(name);
        }
      }

      setReady(true);
    },
    loadModule: loadModule,
    unloadModule: unloadModule,
    getLoadedModule: getLoadedModule,
    setModuleMountState: setModuleMountState,
    getReducer: getReducer
  };
};
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(LOADED_MODULES, "LOADED_MODULES", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(AVAILABLE_MODULES, "AVAILABLE_MODULES", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(LOADING_MODULES, "LOADING_MODULES", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(MOUNTED_MODULES, "MOUNTED_MODULES", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(SAGAS, "SAGAS", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(REDUCERS, "REDUCERS", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(CACHE, "CACHE", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(READY, "READY", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(registerModule, "registerModule", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(moduleLoaderMiddleware, "moduleLoaderMiddleware", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
  reactHotLoader.register(createModuleLoader, "createModuleLoader", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/modules.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ }),

/***/ "./node_modules/@lastui/rocker/platform/routing.js":
/*!*********************************************************!*\
  !*** ./node_modules/@lastui/rocker/platform/routing.js ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "history": () => (/* binding */ history)
/* harmony export */ });
/* harmony import */ var history__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! history */ "./node_modules/history/index.js");
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};


var history = (0,history__WEBPACK_IMPORTED_MODULE_0__.createBrowserHistory)();
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(history, "history", "/Users/admin/Repositories/LastUI/rocker/platform/node_modules/@lastui/rocker/platform/routing.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/connected-react-router/lib/index.js":
/*!********************************************************************************************************!*\
  !*** delegated ./node_modules/connected-react-router/lib/index.js from dll-reference dependencies_dll ***!
  \********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/connected-react-router/lib/index.js");

/***/ }),

/***/ "./node_modules/history/index.js":
/*!*************************************************************************************!*\
  !*** delegated ./node_modules/history/index.js from dll-reference dependencies_dll ***!
  \*************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/history/index.js");

/***/ }),

/***/ "./node_modules/react-dom/index.js":
/*!***************************************************************************************!*\
  !*** delegated ./node_modules/react-dom/index.js from dll-reference dependencies_dll ***!
  \***************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/react-dom/index.js");

/***/ }),

/***/ "./node_modules/react-redux/lib/index.js":
/*!*********************************************************************************************!*\
  !*** delegated ./node_modules/react-redux/lib/index.js from dll-reference dependencies_dll ***!
  \*********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/react-redux/lib/index.js");

/***/ }),

/***/ "./node_modules/react-router/index.js":
/*!******************************************************************************************!*\
  !*** delegated ./node_modules/react-router/index.js from dll-reference dependencies_dll ***!
  \******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/react-router/index.js");

/***/ }),

/***/ "./node_modules/react/index.js":
/*!***********************************************************************************!*\
  !*** delegated ./node_modules/react/index.js from dll-reference dependencies_dll ***!
  \***********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/react/index.js");

/***/ }),

/***/ "./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js":
/*!************************************************************************************************************************!*\
  !*** delegated ./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js from dll-reference dependencies_dll ***!
  \************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js");

/***/ }),

/***/ "./node_modules/redux/lib/redux.js":
/*!***************************************************************************************!*\
  !*** delegated ./node_modules/redux/lib/redux.js from dll-reference dependencies_dll ***!
  \***************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/redux/lib/redux.js");

/***/ }),

/***/ "?5991":
/*!********************!*\
  !*** dll platform ***!
  \********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__;

/***/ }),

/***/ "dll-reference dependencies_dll":
/*!***********************************!*\
  !*** external "dependencies_dll" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = dependencies_dll;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("?5991");
/******/ 	platform_dll = __webpack_exports__;
/******/ 	
/******/ })()
;