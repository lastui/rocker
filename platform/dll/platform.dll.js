var platform_dll;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@lastui/rocker/platform/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/@lastui/rocker/platform/index.js + 12 modules ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Module": () => (/* reexport */ platform_Module),
  "ModuleContext": () => (/* reexport */ ModuleContext),
  "actions": () => (/* reexport */ actions_namespaceObject),
  "constants": () => (/* reexport */ constants_namespaceObject),
  "createModuleLoader": () => (/* reexport */ createModuleLoader),
  "default": () => (/* binding */ platform),
  "history": () => (/* reexport */ routing_history),
  "moduleLoaderMiddleware": () => (/* reexport */ moduleLoaderMiddleware),
  "registerModule": () => (/* reexport */ registerModule),
  "useModuleLoader": () => (/* reexport */ useModuleLoader)
});

// NAMESPACE OBJECT: ./node_modules/@lastui/rocker/platform/constants.js
var constants_namespaceObject = {};
__webpack_require__.r(constants_namespaceObject);
__webpack_require__.d(constants_namespaceObject, {
  "ADD_SHARED": () => (ADD_SHARED),
  "INIT": () => (INIT),
  "LOAD_MODULE": () => (LOAD_MODULE),
  "MODULE_INIT": () => (MODULE_INIT),
  "MODULE_LOADED": () => (MODULE_LOADED),
  "MODULE_NOT_AVAILABLE": () => (MODULE_NOT_AVAILABLE),
  "MODULE_UNLOADED": () => (MODULE_UNLOADED),
  "REMOVE_SHARED": () => (REMOVE_SHARED),
  "SET_AVAILABLE_MODULES": () => (SET_AVAILABLE_MODULES),
  "SET_ENTRYPOINT_MODULE": () => (SET_ENTRYPOINT_MODULE),
  "SHUTDOWN": () => (SHUTDOWN)
});

// NAMESPACE OBJECT: ./node_modules/@lastui/rocker/platform/actions.js
var actions_namespaceObject = {};
__webpack_require__.r(actions_namespaceObject);
__webpack_require__.d(actions_namespaceObject, {
  "addShared": () => (actions_addShared),
  "init": () => (init),
  "loadModule": () => (loadModule),
  "removeShared": () => (actions_removeShared),
  "setAvailableModules": () => (setAvailableModules),
  "setEntryPointModule": () => (setEntryPointModule)
});

;// CONCATENATED MODULE: ./node_modules/@lastui/rocker/platform/constants.js
var INIT="@@platform/INIT";var SET_AVAILABLE_MODULES="@@platform/SET_AVAILABLE_MODULES";var SET_ENTRYPOINT_MODULE="@@platform/SET_ENTRYPOINT_MODULE";var LOAD_MODULE="@@platform/LOAD_MODULE";var SHUTDOWN="@@platform/SHUTDOWN";var MODULE_INIT="@@modules/INIT";var MODULE_LOADED="@@modules/LOADED";var MODULE_UNLOADED="@@modules/UNLOADED";var MODULE_NOT_AVAILABLE="@@modules/NOT_AVAILABLE";var ADD_SHARED="@@shared/ADD_SHARED";var REMOVE_SHARED="@@shared/REMOVE_SHARED";
;// CONCATENATED MODULE: ./node_modules/@lastui/rocker/platform/actions.js
var init=function init(fetchContext){return{type:INIT,payload:{fetchContext:fetchContext}};};var actions_addShared=function addShared(name){var data=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return{type:ADD_SHARED,payload:{name:name,data:data}};};var actions_removeShared=function removeShared(name){return{type:REMOVE_SHARED,payload:{name:name}};};var setAvailableModules=function setAvailableModules(){var modules=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[];return{type:SET_AVAILABLE_MODULES,payload:{modules:modules}};};var setEntryPointModule=function setEntryPointModule(entrypoint){return{type:SET_ENTRYPOINT_MODULE,payload:{entrypoint:entrypoint}};};var loadModule=function loadModule(name){return{type:LOAD_MODULE,payload:{name:name}};};
// EXTERNAL MODULE: delegated ./node_modules/history/index.js from dll-reference dependencies_dll
var historyfrom_dll_reference_dependencies_dll = __webpack_require__("./node_modules/history/index.js");
;// CONCATENATED MODULE: ./node_modules/@lastui/rocker/platform/routing.js
var routing_history=(0,historyfrom_dll_reference_dependencies_dll.createBrowserHistory)();
// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dependencies_dll
var reactfrom_dll_reference_dependencies_dll = __webpack_require__("./node_modules/react/index.js");
;// CONCATENATED MODULE: ./node_modules/@lastui/rocker/platform/ModuleContext.jsx
var ModuleContext=reactfrom_dll_reference_dependencies_dll.createContext(null);var useModuleLoader=function useModuleLoader(){return reactfrom_dll_reference_dependencies_dll.useContext(ModuleContext);};/* harmony default export */ const platform_ModuleContext = (ModuleContext);
// EXTERNAL MODULE: delegated ./node_modules/@babel/runtime/regenerator/index.js from dll-reference dependencies_dll
var regeneratorfrom_dll_reference_dependencies_dll = __webpack_require__("./node_modules/@babel/runtime/regenerator/index.js");
var regeneratorfrom_dll_reference_dependencies_dll_default = /*#__PURE__*/__webpack_require__.n(regeneratorfrom_dll_reference_dependencies_dll);
// EXTERNAL MODULE: delegated ./node_modules/react-redux/lib/index.js from dll-reference dependencies_dll
var libfrom_dll_reference_dependencies_dll = __webpack_require__("./node_modules/react-redux/lib/index.js");
// EXTERNAL MODULE: delegated ./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js from dll-reference dependencies_dll
var redux_saga_effects_npm_proxy_cjsfrom_dll_reference_dependencies_dll = __webpack_require__("./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js");
// EXTERNAL MODULE: delegated ./node_modules/redux/lib/redux.js from dll-reference dependencies_dll
var reduxfrom_dll_reference_dependencies_dll = __webpack_require__("./node_modules/redux/lib/redux.js");
;// CONCATENATED MODULE: ./node_modules/@lastui/rocker/platform/modules.js
function registerModule(scope){if(scope.MainView){this.MainView=scope.MainView;}if(scope.reducer){this.reducer=scope.reducer;}if(scope.saga){this.saga=scope.saga;}if(scope.shared){this.shared=scope.shared;}if(scope.styles){this.styles=scope.styles;}}var moduleLoaderMiddleware=function moduleLoaderMiddleware(loader){return function(store){return function(next){return function(action){switch(action.type){case SET_AVAILABLE_MODULES:{return loader.setAvailableModules(action.payload.modules).then(function(){return next(action);});}case SET_ENTRYPOINT_MODULE:{return loader.loadModule(action.payload.entrypoint).then(function(){return next(action);});}default:{return next(action);}}};};};};var createModuleLoader=function createModuleLoader(){var store={dispatch:function dispatch(){console.error("Redux store is not provided!");},getState:function getState(){console.error("Redux store is not provided!");return{};},subscribe:function subscribe(){console.error("Redux store is not provided!");}};var sagaRunner=function sagaRunner(){console.error("Sagas runnner not provided!");};var loadedModules={};var availableModules={};var loadingModules={};var danglingNamespaces=[];var reducers={};var sagas={};var getLoadedModule=function getLoadedModule(name){return loadedModules[name];};var setLoadingModule=function setLoadingModule(name,promise){loadingModules[name]=promise;return promise;};var removeReducer=function removeReducer(name){delete reducers[name];};var addReducer=function addReducer(name,reducer){removeReducer(name);reducer({},{type:MODULE_INIT});reducers[name]=reducer;};var removeSaga=function removeSaga(name){if(!sagas[name]){return;}sagaRunner(regeneratorfrom_dll_reference_dependencies_dll_default().mark(function _callee(){return regeneratorfrom_dll_reference_dependencies_dll_default().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return (0,redux_saga_effects_npm_proxy_cjsfrom_dll_reference_dependencies_dll.cancel)(sagas[name]);case 2:case"end":return _context.stop();}}},_callee);}));delete sagas[name];};var addSaga=function addSaga(name,saga){removeSaga(name);sagas[name]=sagaRunner(regeneratorfrom_dll_reference_dependencies_dll_default().mark(function _callee2(){return regeneratorfrom_dll_reference_dependencies_dll_default().wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return (0,redux_saga_effects_npm_proxy_cjsfrom_dll_reference_dependencies_dll.fork)(saga);case 2:case"end":return _context2.stop();}}},_callee2);}));};var removeShared=function removeShared(name){store.dispatch(actions_removeShared(name));};var addShared=function addShared(name,payload){store.dispatch(actions_addShared(name,payload));};var connectModule=function connectModule(name){var scope=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(scope.reducer){console.debug("module ".concat(name," introducing reducer"));addReducer(name,(0,reduxfrom_dll_reference_dependencies_dll.combineReducers)(scope.reducer));}if(scope.saga){console.debug("module ".concat(name," introducing saga"));addSaga(name,scope.saga);}if(scope.shared){console.debug("module ".concat(name," introducing shared"));addShared(name,scope.shared);}if(scope.styles){console.debug("module ".concat(name," introducing styles"));scope.styles.use();}loadedModules[name]={name:name,root:scope.MainView&&isolateModule(name,scope.MainView),cleanup:function cleanup(){if(scope.style){scope.styles.unuse();}if(scope.saga){removeSaga(name);}}};};var loadModuleFile=function loadModuleFile(uri){return fetch(uri).then(function(data){return data.text();}).then(function(data){var sandbox={__SANDBOX_SCOPE__:{}};var r=new Function("with(this) {"+data+";}").call(sandbox);if(r!==void 0){return{};}return sandbox.__SANDBOX_SCOPE__;});};var setModuleMountState=function setModuleMountState(name,mounted){if(!mounted&&!loadedModules[name]){danglingNamespaces.push(name);}};var loadModule=function loadModule(name){var loaded=loadedModules[name];if(loaded){return Promise.resolve(loaded);}var loading=loadingModules[name];if(loading){return loading;}var module=availableModules[name];if(!module){store.dispatch({type:MODULE_NOT_AVAILABLE,payload:{name:name}});return Promise.resolve(null);}var promise=loadModuleFile(module.url).then(function(data){connectModule(name,data);store.dispatch({type:MODULE_LOADED,payload:{name:name}});return getLoadedModule(name);}).catch(function(error){return Promise.resolve(null);}).then(function(data){delete loadingModules[name];return data;});return setLoadingModule(name,promise);};var unloadModule=function unloadModule(name){var loaded=loadedModules[name];if(loaded){loaded.cleanup();delete loadedModules[name];store.dispatch({type:MODULE_UNLOADED,payload:{name:name}});}return Promise.resolve(null);};var setAvailableModules=function setAvailableModules(){var modules=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[];var promises=[];var newModules={};for(var i=modules.length;i--;){var module=modules[i];newModules[module.name]=module;availableModules[module.name]=module;}for(var _module in availableModules){if(newModules[_module]){continue;}if(loadedModules[_module]){promises.push(unloadModule(_module));}delete availableModules[_module];}return Promise.all(promises);};var getReducer=function getReducer(){return function(){var state=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};var action=arguments.length>1?arguments[1]:void 0;for(var _name=danglingNamespaces.pop();_name;_name=danglingNamespaces.pop()){console.debug("dyn reducer - module's ".concat(_name," state evicted"));delete state[_name];}switch(action.type){case ADD_SHARED:{console.debug("dyn reducer - add shared (ignore)");return state;}case REMOVE_SHARED:{console.debug("dyn reducer - remove shared (ignore)");return state;}case SET_AVAILABLE_MODULES:{console.debug("dyn reducer - set available modules (ignore)");return state;}case MODULE_UNLOADED:{console.debug("dyn reducer - module ".concat(name," unloaded"));removeReducer(name);return state;}case INIT:{console.debug("dyn reducer - platform init (ignore)");return state;}}for(var _name2 in reducers){state[_name2]=reducers[_name2](state[_name2],action);}return state;};};var isolateStore=function isolateStore(name){return{dispatch:store.dispatch,getState:function getState(){var state=store.getState();var isolatedState=state.modules[name]||{};isolatedState.router=state.router;isolatedState.shared=state.shared;return isolatedState;},subscribe:store.subscribe,replaceReducer:function replaceReducer(newReducer){addReducer(name,newReducer);}};};var isolateModule=function isolateModule(name,Component){var isolatedStore=isolateStore(name);var ModuleWrapper=function ModuleWrapper(props){return reactfrom_dll_reference_dependencies_dll.createElement(libfrom_dll_reference_dependencies_dll.ReactReduxContext.Provider,{value:{store:isolatedStore}},reactfrom_dll_reference_dependencies_dll.createElement(Component,props));};ModuleWrapper.displayName="ModuleWrapper-".concat(name);Component.displayName="Module-".concat(name);return ModuleWrapper;};return{setSagaRunner:function setSagaRunner(nextSagaRunner){if(nextSagaRunner){sagaRunner=nextSagaRunner;}},setStore:function setStore(nextStore){if(nextStore){store=nextStore;}},setAvailableModules:setAvailableModules,loadModule:loadModule,unloadModule:unloadModule,getLoadedModule:getLoadedModule,setModuleMountState:setModuleMountState,getReducer:getReducer};};
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
;// CONCATENATED MODULE: ./node_modules/@lastui/rocker/platform/Module.jsx
var Module=function Module(){var props=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};var moduleLoader=useModuleLoader();var _useState=(0,reactfrom_dll_reference_dependencies_dll.useState)(moduleLoader.getLoadedModule(props.name)),_useState2=_slicedToArray(_useState,2),loadedModule=_useState2[0],setLoadedModule=_useState2[1];(0,reactfrom_dll_reference_dependencies_dll.useEffect)(function(){var name=props.name;if(name){moduleLoader.loadModule(name).then(function(module){moduleLoader.setModuleMountState(name,true);setLoadedModule(module);});}return function(){if(name){moduleLoader.setModuleMountState(name,false);}};},[props.name]);if(!loadedModule){console.debug("module ".concat(props.name," is not loaded"));return reactfrom_dll_reference_dependencies_dll.createElement(reactfrom_dll_reference_dependencies_dll.Fragment,null);}if(!loadedModule.root){console.debug("module ".concat(props.name," does not have view"));return reactfrom_dll_reference_dependencies_dll.createElement(reactfrom_dll_reference_dependencies_dll.Fragment,null);}console.debug("module ".concat(props.name," ready"));var ModuleComponent=loadedModule.root;return reactfrom_dll_reference_dependencies_dll.createElement(ModuleContext.Provider,{value:moduleLoader},reactfrom_dll_reference_dependencies_dll.createElement(ModuleComponent,props.options));};/* harmony default export */ const platform_Module = (reactfrom_dll_reference_dependencies_dll.memo(Module));
;// CONCATENATED MODULE: ./node_modules/@lastui/rocker/platform/index.js
/* harmony default export */ const platform = ({Module:platform_Module,ModuleContext:ModuleContext,useModuleLoader:useModuleLoader,actions:actions_namespaceObject,constants:constants_namespaceObject,history:routing_history,createModuleLoader:createModuleLoader,moduleLoaderMiddleware:moduleLoaderMiddleware,registerModule:registerModule});

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!********************************************************************************************************!*\
  !*** delegated ./node_modules/@babel/runtime/regenerator/index.js from dll-reference dependencies_dll ***!
  \********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/@babel/runtime/regenerator/index.js");

/***/ }),

/***/ "./node_modules/history/index.js":
/*!*************************************************************************************!*\
  !*** delegated ./node_modules/history/index.js from dll-reference dependencies_dll ***!
  \*************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/history/index.js");

/***/ }),

/***/ "./node_modules/react-redux/lib/index.js":
/*!*********************************************************************************************!*\
  !*** delegated ./node_modules/react-redux/lib/index.js from dll-reference dependencies_dll ***!
  \*********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference dependencies_dll */ "dll-reference dependencies_dll"))("./node_modules/react-redux/lib/index.js");

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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