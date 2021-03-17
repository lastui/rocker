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
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! redux */ "./node_modules/redux/lib/redux.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./constants */ "./node_modules/@lastui/rocker/platform/constants.js");
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
}
var moduleLoaderMiddleware = function moduleLoaderMiddleware(loader) {
  return function (store) {
    return function (next) {
      return function (action) {
        switch (action.type) {
          case _constants__WEBPACK_IMPORTED_MODULE_9__.SET_AVAILABLE_MODULES:
            {
              return loader.setAvailableModules(action.payload.modules);
            }

          case _constants__WEBPACK_IMPORTED_MODULE_9__.SET_ENTRYPOINT_MODULE:
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

  var addReducer = function addReducer(name, reducer) {
    console.log("adding reducer", reducer, "to", name);
    var r = reducer({}, {
      type: _constants__WEBPACK_IMPORTED_MODULE_9__.MODULE_INIT
    });
    console.log("ran reducer yielded", r);
    moduleState[REDUCERS][name] = reducer;
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
      type: _constants__WEBPACK_IMPORTED_MODULE_9__.MODULES_READY,
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
    console.log("connecting module", name, "with scope", scope);

    if (scope.reducer) {
      console.log("adding reducer of", name, "is", scope.reducer);

      scope.reducer.router = function () {
        return {};
      };

      console.log("after patching router in its", scope.reducer);
      addReducer(name, (0,redux__WEBPACK_IMPORTED_MODULE_8__.combineReducers)(scope.reducer));
    }

    var module = {
      name: name,
      root: scope.MainView && isolateModule(name, scope.MainView)
    };
    moduleState[LOADED_MODULES][name] = module;
    delete moduleState[LOADING_MODULES][name];
    return {
      type: _constants__WEBPACK_IMPORTED_MODULE_9__.MODULE_LOADED,
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
    console.log("load module", name, "called");

    if (isModuleLoaded(name)) {
      console.log("module", name, "already loaded");
      return Promise.resolve(getLoadedModule(name));
    }

    if (isModuleLoading(name)) {
      console.log("module", name, "is currently loading");
      return moduleState[LOADING_MODULES][name];
    }

    var module = getAvailableModule(name);

    if (!module) {
      console.log("module", name, "is is not available");
      store.dispatch({
        type: _constants__WEBPACK_IMPORTED_MODULE_9__.MODULE_NOT_AVAILABLE,
        payload: {
          name: name
        }
      });
      return Promise.resolve(null);
    }

    console.log("module", name, "will be loaded");
    return setLoadingModule(name, loadModuleFile(module.url).then(function (data) {
      return store.dispatch(connectModule(name, data));
    })).catch(function (error) {
      console.log("load module", name, "error", error);
      delete moduleState[LOADING_MODULES][name];
      return Promise.resolve(null);
    });
  };

  var unloadModule = function unloadModule(name) {
    delete moduleState[LOADED_MODULES][name];
    store.dispatch({
      type: _constants__WEBPACK_IMPORTED_MODULE_9__.MODULE_UNLOADED,
      payload: {
        name: name
      }
    });
  };

  var loadSaga = function loadSaga(name, saga) {
    if (moduleState[SAGAS][name]) {
      //console.log(" saga under", name);
      return;
    }

    console.log("injecting saga under", name, 'as', sagaRunner);
    moduleState[SAGAS][name] = sagaRunner(saga);
  };

  var unloadSaga = function unloadSaga(name) {
    if (!moduleState[SAGAS][name]) {
      return;
    } // FIXME cancel saga now
    //SAGAS[name] = runner(saga);


    console.log("ejecting saga under", name);
  };

  var getReducer = function getReducer() {
    //const dynamicReducers = getReducers()
    return function () {
      var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var action = arguments.length > 1 ? arguments[1] : void 0;

      if (!moduleState[READY]) {
        console.log("dynamic reducer not ready, not reducing", action);
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
                console.log("requesting state of", name);
                var state = store.getState();
                console.log("global state", state);
                var isolatedState = state.modules[name] || {};
                console.log("isolated state namespace", isolatedState);
                isolatedState.router = state.router;
                console.log("isolated state after injection", isolatedState);
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