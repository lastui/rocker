import React from "react";

import { warning } from "./utils";

/* istanbul ignore next */
const GeneratorFunction = function* () {}.constructor;
/* istanbul ignore next */
const AsyncGeneratorFunction = async function* () {}.constructor;
/* istanbul ignore next */
const AsyncFunction = async function () {}.constructor;
/* istanbul ignore next */
const PlainFunction = function () {}.constructor;

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
  if (scope.Main) {
    if (!(scope.Main instanceof PlainFunction || scope.Main instanceof React.Component)) {
      warning(`attribute "Main" provided in registerModule is not function or React.Component`);
    } else {
      window.__SANDBOX_SCOPE__.Main = scope.Main;
    }
  }
  if (scope.Error) {
    if (!(scope.Error instanceof PlainFunction || scope.Error instanceof React.Component)) {
      warning(`attribute "Error" provided in registerModule is not function or React.Component`);
    } else {
      window.__SANDBOX_SCOPE__.Error = scope.Error;
    }
  }
  if (scope.reducer) {
    if (scope.reducer.constructor !== Object) {
      warning(`attribute "reducer" provided in registerModule is not plain object`);
    } else {
      window.__SANDBOX_SCOPE__.reducer = scope.reducer;
    }
  }
  if (scope.middleware) {
    if (
      !(scope.middleware instanceof PlainFunction || scope.middleware instanceof AsyncFunction) ||
      scope.middleware instanceof GeneratorFunction ||
      scope.middleware instanceof AsyncGeneratorFunction
    ) {
      warning(`attribute "middleware" provided in registerModule is not function or async function`);
    } else {
      window.__SANDBOX_SCOPE__.middleware = scope.middleware;
    }
  }
  if (scope.saga) {
    if (!(scope.saga instanceof GeneratorFunction || scope.saga instanceof AsyncGeneratorFunction)) {
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