import React from "react";

import { warning } from "./utils";

/* istanbul ignore next */
function isGenerator(val) {
  return /\[object Generator|GeneratorFunction\]/.test(Object.prototype.toString.call(val));
}

/* istanbul ignore next */
function isFunction(val) {
  return /\[object Function|AsyncFunction\]/.test(Object.prototype.toString.call(val));
}

export default function (scope) {
  if (!scope) {
    return;
  }
  if (scope.constructor !== Object) {
    throw new Error(`registerModule accepts only plain object, was called with ${typeof scope}`);
  }
  if (scope.BUILD_ID) {
    if (typeof scope.BUILD_ID !== "string") {
      warning(`implicit attribute "BUILD_ID" provided in registerModule is not string`);
    } else {
      window.__SANDBOX_SCOPE__.BUILD_ID = scope.BUILD_ID;
    }
  }
  if (scope.component) {
    if (!(isFunction(scope.component) || scope.component instanceof React.Component)) {
      warning(`attribute "component" provided in registerModule is not function or React.Component`);
    } else {
      window.__SANDBOX_SCOPE__.component = scope.component;
    }
  }
  if (scope.fallback) {
    if (!(isFunction(scope.fallback) || scope.fallback instanceof React.Component)) {
      warning(`attribute "fallback" provided in registerModule is not function or React.Component`);
    } else {
      window.__SANDBOX_SCOPE__.fallback = scope.fallback;
    }
  }
  if (scope.reducers) {
    if (scope.reducers.constructor !== Object) {
      warning(`attribute "reducers" provided in registerModule is not plain object`);
    } else {
      window.__SANDBOX_SCOPE__.reducers = scope.reducers;
    }
  }
  if (scope.middleware) {
    if (!isFunction(scope.middleware) || isGenerator(scope.middleware)) {
      warning(`attribute "middleware" provided in registerModule is not function or async function`);
    } else {
      window.__SANDBOX_SCOPE__.middleware = scope.middleware;
    }
  }
  if (scope.saga) {
    if (!isGenerator(scope.saga)) {
      warning(`attribute "saga" provided in registerModule is not generator function or async generator function`);
    } else {
      window.__SANDBOX_SCOPE__.saga = scope.saga;
    }
  }
  if (scope.props) {
    if (scope.props.constructor !== Object) {
      warning(`attribute "props" provided in registerModule is not plain object`);
    } else {
      window.__SANDBOX_SCOPE__.props = scope.props;
    }
  }
}
