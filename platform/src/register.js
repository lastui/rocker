import React from "react";
import { warning } from "./utils";

const GeneratorFunction = function* () {}.constructor;
const AsyncGeneratorFunction = async function* () {}.constructor;
const AsyncFunction = async function () {}.constructor;
const PlainFunction = function () {}.constructor;

export default function (scope) {
  if (scope === null || scope.constructor !== Object) {
    throw new Error(
      `registerModule accepts only plain object, was called with ${scope.constructor}`
    );
  }
  if (scope.buildId) {
    window.__SANDBOX_SCOPE__.buildId = buildId;
  }
  if (scope.Main) {
    if (!(scope.Main instanceof PlainFunction || scope.Main.constructor instanceof React.Component.constructor)) {
      warning(
        `attribute "Main" provided in registerModule is not function or React.Component, it is ${scope.Main.constructor}`
      );
    } else {
      window.__SANDBOX_SCOPE__.Main = scope.Main;
    }
  }
  if (scope.Error) {
    if (!(scope.Error instanceof PlainFunction || scope.Error.constructor instanceof React.Component.constructor)) {
      warning(
        `attribute "Error" provided in registerModule is not function or React.Component, it is ${scope.Error.constructor}`
      );
    } else {
      window.__SANDBOX_SCOPE__.Error = scope.Error;
    }
  }
  if (scope.reducer) {
    if (scope.reducer.constructor !== Object) {
      warning(
        `attribute "reducer" provided in registerModule is not plain object, it is ${scope.reducer.constructor}`
      );
    } else {
      window.__SANDBOX_SCOPE__.reducer = scope.reducer;
    }
  }
  if (scope.middleware) {
    if (
      !(
        scope.middleware instanceof PlainFunction ||
        scope.middleware instanceof AsyncFunction
      )
    ) {
      warning(
        `attribute "middleware" provided in registerModule is not function or async function, it is ${scope.middleware.constructor}`
      );
    } else {
      window.__SANDBOX_SCOPE__.middleware = scope.middleware;
    }
  }
  if (scope.saga) {
    if (
      !(
        scope.saga instanceof GeneratorFunction ||
        scope.saga instanceof AsyncGeneratorFunction
      )
    ) {
      warning(
        `attribute "saga" provided in registerModule is not generator function or async generator function, it is ${scope.saga.constructor}`
      );
    } else {
      window.__SANDBOX_SCOPE__.saga = scope.saga;
    }
  }
  if (scope.props) {
    if (scope.props.constructor !== Object) {
      warning(
        `attribute "props" provided in registerModule is not object, it is ${scope.props.constructor}`
      );
    } else {
      window.__SANDBOX_SCOPE__.props = scope.props;
    }
  }
}
