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
    value: props.moduleLoader
  }, props.children);
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
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/lib/index.js");
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! redux-saga/effects */ "./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js");
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(redux_saga_effects__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! redux */ "./node_modules/redux/lib/redux.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./constants */ "./node_modules/@lastui/rocker/platform/constants.js");
/* module decorator */ module = __webpack_require__.hmd(module);







(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};






var LOADED_MODULES = "loadedModules";
var AVAILABLE_MODULES = "availableModules";
var LOADING_MODULES = "loadingModules";
var MOUNTED_MODULES = "mountedModules";
var SAGAS = "sagas";
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
          case _constants__WEBPACK_IMPORTED_MODULE_10__.SET_AVAILABLE_MODULES:
            {
              return loader.setAvailableModules(action.payload.modules);
            }

          case _constants__WEBPACK_IMPORTED_MODULE_10__.SET_ENTRYPOINT_MODULE:
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

  var moduleState = (_moduleState = {}, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__.default)(_moduleState, CACHE, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__.default)(_moduleState, AVAILABLE_MODULES, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__.default)(_moduleState, LOADED_MODULES, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__.default)(_moduleState, LOADING_MODULES, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__.default)(_moduleState, MOUNTED_MODULES, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__.default)(_moduleState, READY, true), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__.default)(_moduleState, REDUCERS, {}), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__.default)(_moduleState, SAGAS, {}), _moduleState);

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
    var r = reducer({}, {
      type: _constants__WEBPACK_IMPORTED_MODULE_10__.MODULE_INIT
    });
    moduleState[REDUCERS][name] = reducer;
  };

  var removeSaga = function removeSaga(name) {
    if (!moduleState[SAGAS][name]) {
      return;
    }

    console.log("module", name, "removing saga");
    (0,redux_saga_effects__WEBPACK_IMPORTED_MODULE_8__.cancel)(moduleState[SAGAS][name]);
    delete moduleState[SAGAS][name];
  };

  var addSaga = function addSaga(name, saga) {
    removeSaga(name);
    console.log("module", name, "adding saga");
    moduleState[SAGAS][name] = sagaRunner(saga);
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
      type: _constants__WEBPACK_IMPORTED_MODULE_10__.MODULES_READY,
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


      addReducer(name, (0,redux__WEBPACK_IMPORTED_MODULE_9__.combineReducers)(scope.reducer));
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
      type: _constants__WEBPACK_IMPORTED_MODULE_10__.MODULE_LOADED,
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
    console.log('loading module', name); //console.log("load module", name, "called");

    if (isModuleLoaded(name)) {
      //console.log("module", name, "already loaded");
      return Promise.resolve(getLoadedModule(name));
    }

    if (isModuleLoading(name)) {
      //console.log("module", name, "is currently loading");
      return moduleState[LOADING_MODULES][name];
    }

    var module = getAvailableModule(name);

    if (!module) {
      //console.log("module", name, "is is not available");
      store.dispatch({
        type: _constants__WEBPACK_IMPORTED_MODULE_10__.MODULE_NOT_AVAILABLE,
        payload: {
          name: name
        }
      });
      return Promise.resolve(null);
    } //console.log("module", name, "will be loaded");


    return setLoadingModule(name, loadModuleFile(module.url).then(function (data) {
      return store.dispatch(connectModule(name, data));
    })).catch(function (error) {
      //console.log("load module", name, "error", error);
      delete moduleState[LOADING_MODULES][name];
      return Promise.resolve(null);
    });
  };

  var unloadModule = function unloadModule(name) {
    console.log('unloading module', name);
    removeReducer(name);
    removeSaga(name);
    delete moduleState[LOADED_MODULES][name];
    store.dispatch({
      type: _constants__WEBPACK_IMPORTED_MODULE_10__.MODULE_UNLOADED,
      payload: {
        name: name
      }
    });
  };

  var getReducer = function getReducer() {
    //const dynamicReducers = getReducers()
    return function () {
      var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var action = arguments.length > 1 ? arguments[1] : void 0;

      if (!moduleState[READY]) {
        //console.log("dynamic reducer not ready, not reducing", action);
        return state;
      }

      if (action.type.startsWith("@@module/")) {
        //        console.log('>>> will NOT propagate action', action.type, 'to module reducers')
        return state;
      } //const newState = {}
      //console.log('entering iteration of', moduleState[REDUCERS])


      for (var name in moduleState[REDUCERS]) {
        var moduleLoaded = isModuleLoaded(name);

        if (!moduleLoaded) {
          //console.log('>>> will NOT propagate action', action.type, 'to module', name, 'reducer')
          //newState[name] = state[name]
          continue;
        }

        if (action.type.startsWith("@@router/")) {
          //console.log('>>> will propagate action broadcast', action.type, 'to module', name, 'reducer')
          state[name] = moduleState[REDUCERS][name](state[name], action);
        } else if (action.type.startsWith("@" + name + "/")) {
          //console.log('>>> will propagate action module', action.type, 'to module', name, 'reducer')
          state[name] = moduleState[REDUCERS][name](state[name], _objectSpread(_objectSpread({}, action), {}, {
            type: action.type.slice(("@" + name + "/").length)
          }));
        }
      }

      return state;
    };
  };

  var isolateModule = function isolateModule(name, Component) {
    // console.log('isolating module', name)
    var ModuleWrapper = /*#__PURE__*/function (_React$Component) {
      (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__.default)(ModuleWrapper, _React$Component);

      var _super = _createSuper(ModuleWrapper);

      function ModuleWrapper() {
        (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__.default)(this, ModuleWrapper);

        return _super.apply(this, arguments);
      }

      (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__.default)(ModuleWrapper, [{
        key: "render",
        value: function render() {
          // INFO tracing why flickerring when chaning navigation happens
          //console.log('rendering ModuleWrapper of', name)
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_7__.Provider, {
            store: {
              dispatch: function dispatch(action) {
                if (action.type.startsWith("@@")) {
                  return store.dispatch(action);
                } else {
                  return store.dispatch(_objectSpread(_objectSpread({}, action), {}, {
                    type: "@" + name + "/" + action.type
                  }));
                }
              },
              getState: function getState() {
                //console.log("requesting state of", name);
                var state = store.getState(); //console.log("global state", state);

                var isolatedState = state.modules[name] || {}; //console.log("isolated state namespace", isolatedState);

                isolatedState.router = state.router; //console.log("isolated state after injection", isolatedState);

                return isolatedState;
              },
              subscribe: store.subscribe,
              replaceReducer: function replaceReducer(newReducer) {
                addReducer(name, newReducer);
              }
            }
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6__.createElement(Component, this.props));
        }
      }, {
        key: "__reactstandin__regenerateByEval",
        value: // @ts-ignore
        function __reactstandin__regenerateByEval(key, code) {
          // @ts-ignore
          this[key] = eval(code);
        }
      }]);

      return ModuleWrapper;
    }(react__WEBPACK_IMPORTED_MODULE_6__.Component);

    return ModuleWrapper;
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
      modules.forEach(function (module) {
        moduleState[AVAILABLE_MODULES][module.name] = module;
      });

      for (var name in moduleState[LOADED_MODULES]) {
        if (!isModuleAvailable(name)) {
          this.unloadModule(name);
        }
      }

      setReady(true);
    },
    loadSaga: loadSaga,
    unloadSaga: unloadSaga,
    getLoadedModule: getLoadedModule,
    getLoadedModules: getLoadedModules,
    getLoadingModules: getLoadingModules,
    getAvailableModules: getAvailableModules,
    isModuleLoaded: isModuleLoaded,
    isModuleLoading: isModuleLoading,
    isModuleAvailable: isModuleAvailable,
    isModuleMounted: isModuleMounted,
    loadModule: loadModule,
    unloadModule: unloadModule,
    setModuleMountState: setModuleMountState,
    clearCache: clearCache,
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

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

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

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _inherits)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js + 2 modules ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _possibleConstructorReturn)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/extends.js":
/*!********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/extends.js ***!
  \********************************************************/
/***/ ((module) => {

function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  module.exports.default = module.exports, module.exports.__esModule = true;
  return _extends.apply(this, arguments);
}

module.exports = _extends;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ "./node_modules/@redux-saga/core/dist/io-1d6eccda.js":
/*!***********************************************************!*\
  !*** ./node_modules/@redux-saga/core/dist/io-1d6eccda.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var symbols = __webpack_require__(/*! @redux-saga/symbols */ "./node_modules/@redux-saga/symbols/dist/redux-saga-symbols.cjs.js");
var _extends = _interopDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js"));
var is = __webpack_require__(/*! @redux-saga/is */ "./node_modules/@redux-saga/is/dist/redux-saga-is.cjs.js");
var delayP = _interopDefault(__webpack_require__(/*! @redux-saga/delay-p */ "./node_modules/@redux-saga/delay-p/dist/redux-saga-delay-p.cjs.js"));

var konst = function konst(v) {
  return function () {
    return v;
  };
};
var kTrue =
/*#__PURE__*/
konst(true);

exports.noop = function noop() {};

if ( typeof Proxy !== 'undefined') {
  exports.noop =
  /*#__PURE__*/
  new Proxy(exports.noop, {
    set: function set() {
      throw internalErr('There was an attempt to assign a property to internal `noop` function.');
    }
  });
}
var identity = function identity(v) {
  return v;
};
var hasSymbol = typeof Symbol === 'function';
var asyncIteratorSymbol = hasSymbol && Symbol.asyncIterator ? Symbol.asyncIterator : '@@asyncIterator';
function check(value, predicate, error) {
  if (!predicate(value)) {
    throw new Error(error);
  }
}
var assignWithSymbols = function assignWithSymbols(target, source) {
  _extends(target, source);

  if (Object.getOwnPropertySymbols) {
    Object.getOwnPropertySymbols(source).forEach(function (s) {
      target[s] = source[s];
    });
  }
};
var flatMap = function flatMap(mapper, arr) {
  var _ref;

  return (_ref = []).concat.apply(_ref, arr.map(mapper));
};
function remove(array, item) {
  var index = array.indexOf(item);

  if (index >= 0) {
    array.splice(index, 1);
  }
}
function once(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }

    called = true;
    fn();
  };
}

var kThrow = function kThrow(err) {
  throw err;
};

var kReturn = function kReturn(value) {
  return {
    value: value,
    done: true
  };
};

function makeIterator(next, thro, name) {
  if (thro === void 0) {
    thro = kThrow;
  }

  if (name === void 0) {
    name = 'iterator';
  }

  var iterator = {
    meta: {
      name: name
    },
    next: next,
    throw: thro,
    return: kReturn,
    isSagaIterator: true
  };

  if (typeof Symbol !== 'undefined') {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}
function logError(error, _ref2) {
  var sagaStack = _ref2.sagaStack;

  /*eslint-disable no-console*/
  console.error(error);
  console.error(sagaStack);
}
var internalErr = function internalErr(err) {
  return new Error("\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project's github repo.\n  Error: " + err + "\n");
};
var createSetContextWarning = function createSetContextWarning(ctx, props) {
  return (ctx ? ctx + '.' : '') + "setContext(props): argument " + props + " is not a plain object";
};
var FROZEN_ACTION_ERROR = "You can't put (a.k.a. dispatch from saga) frozen actions.\nWe have to define a special non-enumerable property on those actions for scheduling purposes.\nOtherwise you wouldn't be able to communicate properly between sagas & other subscribers (action ordering would become far less predictable).\nIf you are using redux and you care about this behaviour (frozen actions),\nthen you might want to switch to freezing actions in a middleware rather than in action creator.\nExample implementation:\n\nconst freezeActions = store => next => action => next(Object.freeze(action))\n"; // creates empty, but not-holey array

var createEmptyArray = function createEmptyArray(n) {
  return Array.apply(null, new Array(n));
};
var wrapSagaDispatch = function wrapSagaDispatch(dispatch) {
  return function (action) {
    {
      check(action, function (ac) {
        return !Object.isFrozen(ac);
      }, FROZEN_ACTION_ERROR);
    }

    return dispatch(Object.defineProperty(action, symbols.SAGA_ACTION, {
      value: true
    }));
  };
};
var shouldTerminate = function shouldTerminate(res) {
  return res === symbols.TERMINATE;
};
var shouldCancel = function shouldCancel(res) {
  return res === symbols.TASK_CANCEL;
};
var shouldComplete = function shouldComplete(res) {
  return shouldTerminate(res) || shouldCancel(res);
};
function createAllStyleChildCallbacks(shape, parentCallback) {
  var keys = Object.keys(shape);
  var totalCount = keys.length;

  {
    check(totalCount, function (c) {
      return c > 0;
    }, 'createAllStyleChildCallbacks: get an empty array or object');
  }

  var completedCount = 0;
  var completed;
  var results = is.array(shape) ? createEmptyArray(totalCount) : {};
  var childCallbacks = {};

  function checkEnd() {
    if (completedCount === totalCount) {
      completed = true;
      parentCallback(results);
    }
  }

  keys.forEach(function (key) {
    var chCbAtKey = function chCbAtKey(res, isErr) {
      if (completed) {
        return;
      }

      if (isErr || shouldComplete(res)) {
        parentCallback.cancel();
        parentCallback(res, isErr);
      } else {
        results[key] = res;
        completedCount++;
        checkEnd();
      }
    };

    chCbAtKey.cancel = exports.noop;
    childCallbacks[key] = chCbAtKey;
  });

  parentCallback.cancel = function () {
    if (!completed) {
      completed = true;
      keys.forEach(function (key) {
        return childCallbacks[key].cancel();
      });
    }
  };

  return childCallbacks;
}
function getMetaInfo(fn) {
  return {
    name: fn.name || 'anonymous',
    location: getLocation(fn)
  };
}
function getLocation(instrumented) {
  return instrumented[symbols.SAGA_LOCATION];
}

var BUFFER_OVERFLOW = "Channel's Buffer overflow!";
var ON_OVERFLOW_THROW = 1;
var ON_OVERFLOW_DROP = 2;
var ON_OVERFLOW_SLIDE = 3;
var ON_OVERFLOW_EXPAND = 4;
var zeroBuffer = {
  isEmpty: kTrue,
  put: exports.noop,
  take: exports.noop
};

function ringBuffer(limit, overflowAction) {
  if (limit === void 0) {
    limit = 10;
  }

  var arr = new Array(limit);
  var length = 0;
  var pushIndex = 0;
  var popIndex = 0;

  var push = function push(it) {
    arr[pushIndex] = it;
    pushIndex = (pushIndex + 1) % limit;
    length++;
  };

  var take = function take() {
    if (length != 0) {
      var it = arr[popIndex];
      arr[popIndex] = null;
      length--;
      popIndex = (popIndex + 1) % limit;
      return it;
    }
  };

  var flush = function flush() {
    var items = [];

    while (length) {
      items.push(take());
    }

    return items;
  };

  return {
    isEmpty: function isEmpty() {
      return length == 0;
    },
    put: function put(it) {
      if (length < limit) {
        push(it);
      } else {
        var doubledLimit;

        switch (overflowAction) {
          case ON_OVERFLOW_THROW:
            throw new Error(BUFFER_OVERFLOW);

          case ON_OVERFLOW_SLIDE:
            arr[pushIndex] = it;
            pushIndex = (pushIndex + 1) % limit;
            popIndex = pushIndex;
            break;

          case ON_OVERFLOW_EXPAND:
            doubledLimit = 2 * limit;
            arr = flush();
            length = arr.length;
            pushIndex = arr.length;
            popIndex = 0;
            arr.length = doubledLimit;
            limit = doubledLimit;
            push(it);
            break;

          default: // DROP

        }
      }
    },
    take: take,
    flush: flush
  };
}

var none = function none() {
  return zeroBuffer;
};
var fixed = function fixed(limit) {
  return ringBuffer(limit, ON_OVERFLOW_THROW);
};
var dropping = function dropping(limit) {
  return ringBuffer(limit, ON_OVERFLOW_DROP);
};
var sliding = function sliding(limit) {
  return ringBuffer(limit, ON_OVERFLOW_SLIDE);
};
var expanding = function expanding(initialSize) {
  return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
};

var buffers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  none: none,
  fixed: fixed,
  dropping: dropping,
  sliding: sliding,
  expanding: expanding
});

var TAKE = 'TAKE';
var PUT = 'PUT';
var ALL = 'ALL';
var RACE = 'RACE';
var CALL = 'CALL';
var CPS = 'CPS';
var FORK = 'FORK';
var JOIN = 'JOIN';
var CANCEL = 'CANCEL';
var SELECT = 'SELECT';
var ACTION_CHANNEL = 'ACTION_CHANNEL';
var CANCELLED = 'CANCELLED';
var FLUSH = 'FLUSH';
var GET_CONTEXT = 'GET_CONTEXT';
var SET_CONTEXT = 'SET_CONTEXT';

var effectTypes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TAKE: TAKE,
  PUT: PUT,
  ALL: ALL,
  RACE: RACE,
  CALL: CALL,
  CPS: CPS,
  FORK: FORK,
  JOIN: JOIN,
  CANCEL: CANCEL,
  SELECT: SELECT,
  ACTION_CHANNEL: ACTION_CHANNEL,
  CANCELLED: CANCELLED,
  FLUSH: FLUSH,
  GET_CONTEXT: GET_CONTEXT,
  SET_CONTEXT: SET_CONTEXT
});

var TEST_HINT = '\n(HINT: if you are getting these errors in tests, consider using createMockTask from @redux-saga/testing-utils)';

var makeEffect = function makeEffect(type, payload) {
  var _ref;

  return _ref = {}, _ref[symbols.IO] = true, _ref.combinator = false, _ref.type = type, _ref.payload = payload, _ref;
};

var isForkEffect = function isForkEffect(eff) {
  return is.effect(eff) && eff.type === FORK;
};

var detach = function detach(eff) {
  {
    check(eff, isForkEffect, 'detach(eff): argument must be a fork effect');
  }

  return makeEffect(FORK, _extends({}, eff.payload, {
    detached: true
  }));
};
function take(patternOrChannel, multicastPattern) {
  if (patternOrChannel === void 0) {
    patternOrChannel = '*';
  }

  if ( arguments.length) {
    check(arguments[0], is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
  }

  if (is.pattern(patternOrChannel)) {
    return makeEffect(TAKE, {
      pattern: patternOrChannel
    });
  }

  if (is.multicast(patternOrChannel) && is.notUndef(multicastPattern) && is.pattern(multicastPattern)) {
    return makeEffect(TAKE, {
      channel: patternOrChannel,
      pattern: multicastPattern
    });
  }

  if (is.channel(patternOrChannel)) {
    return makeEffect(TAKE, {
      channel: patternOrChannel
    });
  }

  {
    throw new Error("take(patternOrChannel): argument " + patternOrChannel + " is not valid channel or a valid pattern");
  }
}
var takeMaybe = function takeMaybe() {
  var eff = take.apply(void 0, arguments);
  eff.payload.maybe = true;
  return eff;
};
function put(channel, action) {
  {
    if (arguments.length > 1) {
      check(channel, is.notUndef, 'put(channel, action): argument channel is undefined');
      check(channel, is.channel, "put(channel, action): argument " + channel + " is not a valid channel");
      check(action, is.notUndef, 'put(channel, action): argument action is undefined');
    } else {
      check(channel, is.notUndef, 'put(action): argument action is undefined');
    }
  }

  if (is.undef(action)) {
    action = channel; // `undefined` instead of `null` to make default parameter work

    channel = undefined;
  }

  return makeEffect(PUT, {
    channel: channel,
    action: action
  });
}
var putResolve = function putResolve() {
  var eff = put.apply(void 0, arguments);
  eff.payload.resolve = true;
  return eff;
};
function all(effects) {
  var eff = makeEffect(ALL, effects);
  eff.combinator = true;
  return eff;
}
function race(effects) {
  var eff = makeEffect(RACE, effects);
  eff.combinator = true;
  return eff;
} // this match getFnCallDescriptor logic

var validateFnDescriptor = function validateFnDescriptor(effectName, fnDescriptor) {
  check(fnDescriptor, is.notUndef, effectName + ": argument fn is undefined or null");

  if (is.func(fnDescriptor)) {
    return;
  }

  var context = null;
  var fn;

  if (is.array(fnDescriptor)) {
    context = fnDescriptor[0];
    fn = fnDescriptor[1];
    check(fn, is.notUndef, effectName + ": argument of type [context, fn] has undefined or null `fn`");
  } else if (is.object(fnDescriptor)) {
    context = fnDescriptor.context;
    fn = fnDescriptor.fn;
    check(fn, is.notUndef, effectName + ": argument of type {context, fn} has undefined or null `fn`");
  } else {
    check(fnDescriptor, is.func, effectName + ": argument fn is not function");
    return;
  }

  if (context && is.string(fn)) {
    check(context[fn], is.func, effectName + ": context arguments has no such method - \"" + fn + "\"");
    return;
  }

  check(fn, is.func, effectName + ": unpacked fn argument (from [context, fn] or {context, fn}) is not a function");
};

function getFnCallDescriptor(fnDescriptor, args) {
  var context = null;
  var fn;

  if (is.func(fnDescriptor)) {
    fn = fnDescriptor;
  } else {
    if (is.array(fnDescriptor)) {
      context = fnDescriptor[0];
      fn = fnDescriptor[1];
    } else {
      context = fnDescriptor.context;
      fn = fnDescriptor.fn;
    }

    if (context && is.string(fn) && is.func(context[fn])) {
      fn = context[fn];
    }
  }

  return {
    context: context,
    fn: fn,
    args: args
  };
}

var isNotDelayEffect = function isNotDelayEffect(fn) {
  return fn !== delay;
};

function call(fnDescriptor) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  {
    var arg0 = typeof args[0] === 'number' ? args[0] : 'ms';
    check(fnDescriptor, isNotDelayEffect, "instead of writing `yield call(delay, " + arg0 + ")` where delay is an effect from `redux-saga/effects` you should write `yield delay(" + arg0 + ")`");
    validateFnDescriptor('call', fnDescriptor);
  }

  return makeEffect(CALL, getFnCallDescriptor(fnDescriptor, args));
}
function apply(context, fn, args) {
  if (args === void 0) {
    args = [];
  }

  var fnDescriptor = [context, fn];

  {
    validateFnDescriptor('apply', fnDescriptor);
  }

  return makeEffect(CALL, getFnCallDescriptor([context, fn], args));
}
function cps(fnDescriptor) {
  {
    validateFnDescriptor('cps', fnDescriptor);
  }

  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return makeEffect(CPS, getFnCallDescriptor(fnDescriptor, args));
}
function fork(fnDescriptor) {
  {
    validateFnDescriptor('fork', fnDescriptor);
    check(fnDescriptor, function (arg) {
      return !is.effect(arg);
    }, 'fork: argument must not be an effect');
  }

  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return makeEffect(FORK, getFnCallDescriptor(fnDescriptor, args));
}
function spawn(fnDescriptor) {
  {
    validateFnDescriptor('spawn', fnDescriptor);
  }

  for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  return detach(fork.apply(void 0, [fnDescriptor].concat(args)));
}
function join(taskOrTasks) {
  {
    if (arguments.length > 1) {
      throw new Error('join(...tasks) is not supported any more. Please use join([...tasks]) to join multiple tasks.');
    }

    if (is.array(taskOrTasks)) {
      taskOrTasks.forEach(function (t) {
        check(t, is.task, "join([...tasks]): argument " + t + " is not a valid Task object " + TEST_HINT);
      });
    } else {
      check(taskOrTasks, is.task, "join(task): argument " + taskOrTasks + " is not a valid Task object " + TEST_HINT);
    }
  }

  return makeEffect(JOIN, taskOrTasks);
}
function cancel(taskOrTasks) {
  if (taskOrTasks === void 0) {
    taskOrTasks = symbols.SELF_CANCELLATION;
  }

  {
    if (arguments.length > 1) {
      throw new Error('cancel(...tasks) is not supported any more. Please use cancel([...tasks]) to cancel multiple tasks.');
    }

    if (is.array(taskOrTasks)) {
      taskOrTasks.forEach(function (t) {
        check(t, is.task, "cancel([...tasks]): argument " + t + " is not a valid Task object " + TEST_HINT);
      });
    } else if (taskOrTasks !== symbols.SELF_CANCELLATION && is.notUndef(taskOrTasks)) {
      check(taskOrTasks, is.task, "cancel(task): argument " + taskOrTasks + " is not a valid Task object " + TEST_HINT);
    }
  }

  return makeEffect(CANCEL, taskOrTasks);
}
function select(selector) {
  if (selector === void 0) {
    selector = identity;
  }

  for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  if ( arguments.length) {
    check(arguments[0], is.notUndef, 'select(selector, [...]): argument selector is undefined');
    check(selector, is.func, "select(selector, [...]): argument " + selector + " is not a function");
  }

  return makeEffect(SELECT, {
    selector: selector,
    args: args
  });
}
/**
  channel(pattern, [buffer])    => creates a proxy channel for store actions
**/

function actionChannel(pattern, buffer) {
  {
    check(pattern, is.pattern, 'actionChannel(pattern,...): argument pattern is not valid');

    if (arguments.length > 1) {
      check(buffer, is.notUndef, 'actionChannel(pattern, buffer): argument buffer is undefined');
      check(buffer, is.buffer, "actionChannel(pattern, buffer): argument " + buffer + " is not a valid buffer");
    }
  }

  return makeEffect(ACTION_CHANNEL, {
    pattern: pattern,
    buffer: buffer
  });
}
function cancelled() {
  return makeEffect(CANCELLED, {});
}
function flush(channel) {
  {
    check(channel, is.channel, "flush(channel): argument " + channel + " is not valid channel");
  }

  return makeEffect(FLUSH, channel);
}
function getContext(prop) {
  {
    check(prop, is.string, "getContext(prop): argument " + prop + " is not a string");
  }

  return makeEffect(GET_CONTEXT, prop);
}
function setContext(props) {
  {
    check(props, is.object, createSetContextWarning(null, props));
  }

  return makeEffect(SET_CONTEXT, props);
}
var delay =
/*#__PURE__*/
call.bind(null, delayP);

exports.ACTION_CHANNEL = ACTION_CHANNEL;
exports.ALL = ALL;
exports.CALL = CALL;
exports.CANCEL = CANCEL;
exports.CANCELLED = CANCELLED;
exports.CPS = CPS;
exports.FLUSH = FLUSH;
exports.FORK = FORK;
exports.GET_CONTEXT = GET_CONTEXT;
exports.JOIN = JOIN;
exports.PUT = PUT;
exports.RACE = RACE;
exports.SELECT = SELECT;
exports.SET_CONTEXT = SET_CONTEXT;
exports.TAKE = TAKE;
exports.actionChannel = actionChannel;
exports.all = all;
exports.apply = apply;
exports.assignWithSymbols = assignWithSymbols;
exports.asyncIteratorSymbol = asyncIteratorSymbol;
exports.buffers = buffers;
exports.call = call;
exports.cancel = cancel;
exports.cancelled = cancelled;
exports.check = check;
exports.cps = cps;
exports.createAllStyleChildCallbacks = createAllStyleChildCallbacks;
exports.createEmptyArray = createEmptyArray;
exports.createSetContextWarning = createSetContextWarning;
exports.delay = delay;
exports.detach = detach;
exports.effectTypes = effectTypes;
exports.expanding = expanding;
exports.flatMap = flatMap;
exports.flush = flush;
exports.fork = fork;
exports.getContext = getContext;
exports.getLocation = getLocation;
exports.getMetaInfo = getMetaInfo;
exports.identity = identity;
exports.internalErr = internalErr;
exports.join = join;
exports.kTrue = kTrue;
exports.logError = logError;
exports.makeIterator = makeIterator;
exports.none = none;
exports.once = once;
exports.put = put;
exports.putResolve = putResolve;
exports.race = race;
exports.remove = remove;
exports.select = select;
exports.setContext = setContext;
exports.shouldCancel = shouldCancel;
exports.shouldComplete = shouldComplete;
exports.shouldTerminate = shouldTerminate;
exports.sliding = sliding;
exports.spawn = spawn;
exports.take = take;
exports.takeMaybe = takeMaybe;
exports.wrapSagaDispatch = wrapSagaDispatch;


/***/ }),

/***/ "./node_modules/@redux-saga/core/dist/redux-saga-effects.cjs.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@redux-saga/core/dist/redux-saga-effects.cjs.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./redux-saga-effects.dev.cjs.js */ "./node_modules/@redux-saga/core/dist/redux-saga-effects.dev.cjs.js")
}


/***/ }),

/***/ "./node_modules/@redux-saga/core/dist/redux-saga-effects.dev.cjs.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@redux-saga/core/dist/redux-saga-effects.dev.cjs.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

__webpack_require__(/*! @redux-saga/symbols */ "./node_modules/@redux-saga/symbols/dist/redux-saga-symbols.cjs.js");
__webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
var is = __webpack_require__(/*! @redux-saga/is */ "./node_modules/@redux-saga/is/dist/redux-saga-is.cjs.js");
var io = __webpack_require__(/*! ./io-1d6eccda.js */ "./node_modules/@redux-saga/core/dist/io-1d6eccda.js");
__webpack_require__(/*! @redux-saga/delay-p */ "./node_modules/@redux-saga/delay-p/dist/redux-saga-delay-p.cjs.js");

var done = function done(value) {
  return {
    done: true,
    value: value
  };
};

var qEnd = {};
function safeName(patternOrChannel) {
  if (is.channel(patternOrChannel)) {
    return 'channel';
  }

  if (is.stringableFunc(patternOrChannel)) {
    return String(patternOrChannel);
  }

  if (is.func(patternOrChannel)) {
    return patternOrChannel.name;
  }

  return String(patternOrChannel);
}
function fsmIterator(fsm, startState, name) {
  var stateUpdater,
      errorState,
      effect,
      nextState = startState;

  function next(arg, error) {
    if (nextState === qEnd) {
      return done(arg);
    }

    if (error && !errorState) {
      nextState = qEnd;
      throw error;
    } else {
      stateUpdater && stateUpdater(arg);
      var currentState = error ? fsm[errorState](error) : fsm[nextState]();
      nextState = currentState.nextState;
      effect = currentState.effect;
      stateUpdater = currentState.stateUpdater;
      errorState = currentState.errorState;
      return nextState === qEnd ? done(arg) : effect;
    }
  }

  return io.makeIterator(next, function (error) {
    return next(null, error);
  }, name);
}

function takeEvery(patternOrChannel, worker) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var yTake = {
    done: false,
    value: io.take(patternOrChannel)
  };

  var yFork = function yFork(ac) {
    return {
      done: false,
      value: io.fork.apply(void 0, [worker].concat(args, [ac]))
    };
  };

  var action,
      setAction = function setAction(ac) {
    return action = ac;
  };

  return fsmIterator({
    q1: function q1() {
      return {
        nextState: 'q2',
        effect: yTake,
        stateUpdater: setAction
      };
    },
    q2: function q2() {
      return {
        nextState: 'q1',
        effect: yFork(action)
      };
    }
  }, 'q1', "takeEvery(" + safeName(patternOrChannel) + ", " + worker.name + ")");
}

function takeLatest(patternOrChannel, worker) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var yTake = {
    done: false,
    value: io.take(patternOrChannel)
  };

  var yFork = function yFork(ac) {
    return {
      done: false,
      value: io.fork.apply(void 0, [worker].concat(args, [ac]))
    };
  };

  var yCancel = function yCancel(task) {
    return {
      done: false,
      value: io.cancel(task)
    };
  };

  var task, action;

  var setTask = function setTask(t) {
    return task = t;
  };

  var setAction = function setAction(ac) {
    return action = ac;
  };

  return fsmIterator({
    q1: function q1() {
      return {
        nextState: 'q2',
        effect: yTake,
        stateUpdater: setAction
      };
    },
    q2: function q2() {
      return task ? {
        nextState: 'q3',
        effect: yCancel(task)
      } : {
        nextState: 'q1',
        effect: yFork(action),
        stateUpdater: setTask
      };
    },
    q3: function q3() {
      return {
        nextState: 'q1',
        effect: yFork(action),
        stateUpdater: setTask
      };
    }
  }, 'q1', "takeLatest(" + safeName(patternOrChannel) + ", " + worker.name + ")");
}

function takeLeading(patternOrChannel, worker) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var yTake = {
    done: false,
    value: io.take(patternOrChannel)
  };

  var yCall = function yCall(ac) {
    return {
      done: false,
      value: io.call.apply(void 0, [worker].concat(args, [ac]))
    };
  };

  var action;

  var setAction = function setAction(ac) {
    return action = ac;
  };

  return fsmIterator({
    q1: function q1() {
      return {
        nextState: 'q2',
        effect: yTake,
        stateUpdater: setAction
      };
    },
    q2: function q2() {
      return {
        nextState: 'q1',
        effect: yCall(action)
      };
    }
  }, 'q1', "takeLeading(" + safeName(patternOrChannel) + ", " + worker.name + ")");
}

function throttle(delayLength, pattern, worker) {
  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var action, channel;
  var yActionChannel = {
    done: false,
    value: io.actionChannel(pattern, io.sliding(1))
  };

  var yTake = function yTake() {
    return {
      done: false,
      value: io.take(channel)
    };
  };

  var yFork = function yFork(ac) {
    return {
      done: false,
      value: io.fork.apply(void 0, [worker].concat(args, [ac]))
    };
  };

  var yDelay = {
    done: false,
    value: io.delay(delayLength)
  };

  var setAction = function setAction(ac) {
    return action = ac;
  };

  var setChannel = function setChannel(ch) {
    return channel = ch;
  };

  return fsmIterator({
    q1: function q1() {
      return {
        nextState: 'q2',
        effect: yActionChannel,
        stateUpdater: setChannel
      };
    },
    q2: function q2() {
      return {
        nextState: 'q3',
        effect: yTake(),
        stateUpdater: setAction
      };
    },
    q3: function q3() {
      return {
        nextState: 'q4',
        effect: yFork(action)
      };
    },
    q4: function q4() {
      return {
        nextState: 'q2',
        effect: yDelay
      };
    }
  }, 'q1', "throttle(" + safeName(pattern) + ", " + worker.name + ")");
}

function retry(maxTries, delayLength, fn) {
  var counter = maxTries;

  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var yCall = {
    done: false,
    value: io.call.apply(void 0, [fn].concat(args))
  };
  var yDelay = {
    done: false,
    value: io.delay(delayLength)
  };
  return fsmIterator({
    q1: function q1() {
      return {
        nextState: 'q2',
        effect: yCall,
        errorState: 'q10'
      };
    },
    q2: function q2() {
      return {
        nextState: qEnd
      };
    },
    q10: function q10(error) {
      counter -= 1;

      if (counter <= 0) {
        throw error;
      }

      return {
        nextState: 'q1',
        effect: yDelay
      };
    }
  }, 'q1', "retry(" + fn.name + ")");
}

function debounceHelper(delayLength, patternOrChannel, worker) {
  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var action, raceOutput;
  var yTake = {
    done: false,
    value: io.take(patternOrChannel)
  };
  var yRace = {
    done: false,
    value: io.race({
      action: io.take(patternOrChannel),
      debounce: io.delay(delayLength)
    })
  };

  var yFork = function yFork(ac) {
    return {
      done: false,
      value: io.fork.apply(void 0, [worker].concat(args, [ac]))
    };
  };

  var yNoop = function yNoop(value) {
    return {
      done: false,
      value: value
    };
  };

  var setAction = function setAction(ac) {
    return action = ac;
  };

  var setRaceOutput = function setRaceOutput(ro) {
    return raceOutput = ro;
  };

  return fsmIterator({
    q1: function q1() {
      return {
        nextState: 'q2',
        effect: yTake,
        stateUpdater: setAction
      };
    },
    q2: function q2() {
      return {
        nextState: 'q3',
        effect: yRace,
        stateUpdater: setRaceOutput
      };
    },
    q3: function q3() {
      return raceOutput.debounce ? {
        nextState: 'q1',
        effect: yFork(action)
      } : {
        nextState: 'q2',
        effect: yNoop(raceOutput.action),
        stateUpdater: setAction
      };
    }
  }, 'q1', "debounce(" + safeName(patternOrChannel) + ", " + worker.name + ")");
}

var validateTakeEffect = function validateTakeEffect(fn, patternOrChannel, worker) {
  io.check(patternOrChannel, is.notUndef, fn.name + " requires a pattern or channel");
  io.check(worker, is.notUndef, fn.name + " requires a saga parameter");
};

function takeEvery$1(patternOrChannel, worker) {
  {
    validateTakeEffect(takeEvery$1, patternOrChannel, worker);
  }

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return io.fork.apply(void 0, [takeEvery, patternOrChannel, worker].concat(args));
}
function takeLatest$1(patternOrChannel, worker) {
  {
    validateTakeEffect(takeLatest$1, patternOrChannel, worker);
  }

  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return io.fork.apply(void 0, [takeLatest, patternOrChannel, worker].concat(args));
}
function takeLeading$1(patternOrChannel, worker) {
  {
    validateTakeEffect(takeLeading$1, patternOrChannel, worker);
  }

  for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  return io.fork.apply(void 0, [takeLeading, patternOrChannel, worker].concat(args));
}
function throttle$1(ms, pattern, worker) {
  {
    io.check(pattern, is.notUndef, 'throttle requires a pattern');
    io.check(worker, is.notUndef, 'throttle requires a saga parameter');
  }

  for (var _len4 = arguments.length, args = new Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
    args[_key4 - 3] = arguments[_key4];
  }

  return io.fork.apply(void 0, [throttle, ms, pattern, worker].concat(args));
}
function retry$1(maxTries, delayLength, worker) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 3 ? _len5 - 3 : 0), _key5 = 3; _key5 < _len5; _key5++) {
    args[_key5 - 3] = arguments[_key5];
  }

  return io.call.apply(void 0, [retry, maxTries, delayLength, worker].concat(args));
}
function debounce(delayLength, pattern, worker) {
  for (var _len6 = arguments.length, args = new Array(_len6 > 3 ? _len6 - 3 : 0), _key6 = 3; _key6 < _len6; _key6++) {
    args[_key6 - 3] = arguments[_key6];
  }

  return io.fork.apply(void 0, [debounceHelper, delayLength, pattern, worker].concat(args));
}

exports.actionChannel = io.actionChannel;
exports.all = io.all;
exports.apply = io.apply;
exports.call = io.call;
exports.cancel = io.cancel;
exports.cancelled = io.cancelled;
exports.cps = io.cps;
exports.delay = io.delay;
exports.effectTypes = io.effectTypes;
exports.flush = io.flush;
exports.fork = io.fork;
exports.getContext = io.getContext;
exports.join = io.join;
exports.put = io.put;
exports.putResolve = io.putResolve;
exports.race = io.race;
exports.select = io.select;
exports.setContext = io.setContext;
exports.spawn = io.spawn;
exports.take = io.take;
exports.takeMaybe = io.takeMaybe;
exports.debounce = debounce;
exports.retry = retry$1;
exports.takeEvery = takeEvery$1;
exports.takeLatest = takeLatest$1;
exports.takeLeading = takeLeading$1;
exports.throttle = throttle$1;


/***/ }),

/***/ "./node_modules/@redux-saga/delay-p/dist/redux-saga-delay-p.cjs.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@redux-saga/delay-p/dist/redux-saga-delay-p.cjs.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var symbols = __webpack_require__(/*! @redux-saga/symbols */ "./node_modules/@redux-saga/symbols/dist/redux-saga-symbols.cjs.js");

function delayP(ms, val) {
  if (val === void 0) {
    val = true;
  }

  var timeoutId;
  var promise = new Promise(function (resolve) {
    timeoutId = setTimeout(resolve, ms, val);
  });

  promise[symbols.CANCEL] = function () {
    clearTimeout(timeoutId);
  };

  return promise;
}

exports.default = delayP;


/***/ }),

/***/ "./node_modules/@redux-saga/is/dist/redux-saga-is.cjs.js":
/*!***************************************************************!*\
  !*** ./node_modules/@redux-saga/is/dist/redux-saga-is.cjs.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var symbols = __webpack_require__(/*! @redux-saga/symbols */ "./node_modules/@redux-saga/symbols/dist/redux-saga-symbols.cjs.js");

var undef = function undef(v) {
  return v === null || v === undefined;
};
var notUndef = function notUndef(v) {
  return v !== null && v !== undefined;
};
var func = function func(f) {
  return typeof f === 'function';
};
var number = function number(n) {
  return typeof n === 'number';
};
var string = function string(s) {
  return typeof s === 'string';
};
var array = Array.isArray;
var object = function object(obj) {
  return obj && !array(obj) && typeof obj === 'object';
};
var promise = function promise(p) {
  return p && func(p.then);
};
var iterator = function iterator(it) {
  return it && func(it.next) && func(it.throw);
};
var iterable = function iterable(it) {
  return it && func(Symbol) ? func(it[Symbol.iterator]) : array(it);
};
var task = function task(t) {
  return t && t[symbols.TASK];
};
var sagaAction = function sagaAction(a) {
  return Boolean(a && a[symbols.SAGA_ACTION]);
};
var observable = function observable(ob) {
  return ob && func(ob.subscribe);
};
var buffer = function buffer(buf) {
  return buf && func(buf.isEmpty) && func(buf.take) && func(buf.put);
};
var pattern = function pattern(pat) {
  return pat && (string(pat) || symbol(pat) || func(pat) || array(pat) && pat.every(pattern));
};
var channel = function channel(ch) {
  return ch && func(ch.take) && func(ch.close);
};
var stringableFunc = function stringableFunc(f) {
  return func(f) && f.hasOwnProperty('toString');
};
var symbol = function symbol(sym) {
  return Boolean(sym) && typeof Symbol === 'function' && sym.constructor === Symbol && sym !== Symbol.prototype;
};
var multicast = function multicast(ch) {
  return channel(ch) && ch[symbols.MULTICAST];
};
var effect = function effect(eff) {
  return eff && eff[symbols.IO];
};

exports.array = array;
exports.buffer = buffer;
exports.channel = channel;
exports.effect = effect;
exports.func = func;
exports.iterable = iterable;
exports.iterator = iterator;
exports.multicast = multicast;
exports.notUndef = notUndef;
exports.number = number;
exports.object = object;
exports.observable = observable;
exports.pattern = pattern;
exports.promise = promise;
exports.sagaAction = sagaAction;
exports.string = string;
exports.stringableFunc = stringableFunc;
exports.symbol = symbol;
exports.task = task;
exports.undef = undef;


/***/ }),

/***/ "./node_modules/@redux-saga/symbols/dist/redux-saga-symbols.cjs.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@redux-saga/symbols/dist/redux-saga-symbols.cjs.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var createSymbol = function createSymbol(name) {
  return "@@redux-saga/" + name;
};

var CANCEL =
/*#__PURE__*/
createSymbol('CANCEL_PROMISE');
var CHANNEL_END_TYPE =
/*#__PURE__*/
createSymbol('CHANNEL_END');
var IO =
/*#__PURE__*/
createSymbol('IO');
var MATCH =
/*#__PURE__*/
createSymbol('MATCH');
var MULTICAST =
/*#__PURE__*/
createSymbol('MULTICAST');
var SAGA_ACTION =
/*#__PURE__*/
createSymbol('SAGA_ACTION');
var SELF_CANCELLATION =
/*#__PURE__*/
createSymbol('SELF_CANCELLATION');
var TASK =
/*#__PURE__*/
createSymbol('TASK');
var TASK_CANCEL =
/*#__PURE__*/
createSymbol('TASK_CANCEL');
var TERMINATE =
/*#__PURE__*/
createSymbol('TERMINATE');
var SAGA_LOCATION =
/*#__PURE__*/
createSymbol('LOCATION');

exports.CANCEL = CANCEL;
exports.CHANNEL_END_TYPE = CHANNEL_END_TYPE;
exports.IO = IO;
exports.MATCH = MATCH;
exports.MULTICAST = MULTICAST;
exports.SAGA_ACTION = SAGA_ACTION;
exports.SAGA_LOCATION = SAGA_LOCATION;
exports.SELF_CANCELLATION = SELF_CANCELLATION;
exports.TASK = TASK;
exports.TASK_CANCEL = TASK_CANCEL;
exports.TERMINATE = TERMINATE;


/***/ }),

/***/ "./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js":
/*!**************************************************************************!*\
  !*** ./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var effects = __webpack_require__(/*! @redux-saga/core/effects */ "./node_modules/@redux-saga/core/dist/redux-saga-effects.cjs.js");



Object.keys(effects).forEach(function (k) {
	if (k !== 'default') Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () {
			return effects[k];
		}
	});
});


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