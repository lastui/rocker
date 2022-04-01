import { warning } from "./utils";

export default function (scope) {
  if (scope === null || scope.constructor !== Object) {
    throw new Error(`registerModule argument must be plain object`);
  }
  if (scope.Main) {
    if (scope.Main.constructor.name !== "Function") {
      warning("attribute Main provided in registerModule is not function");
    } else {
      window.__SANDBOX_SCOPE__.Main = scope.Main;
    }
  }
  if (scope.Error) {
    if (scope.Error.constructor.name !== "Function") {
      warning("attribute Error provided in registerModule is not function");
    } else {
      window.__SANDBOX_SCOPE__.Error = scope.Error;
    }
  }
  if (scope.reducer) {
    if (scope.reducer.constructor !== Object) {
      warning("attribute reducer provided in registerModule is not plain object");
    } else {
      window.__SANDBOX_SCOPE__.reducer = scope.reducer;
    }
  }
  if (scope.middleware) {
    if (
      !(
        scope.middleware.constructor.name === "Function" ||
        scope.middleware.constructor.name === "AsyncFunction"
      )
    ) {
      warning("attribute middleware provided in registerModule is not function or async function");
    } else {
      window.__SANDBOX_SCOPE__.middleware = scope.middleware;
    }
  }
  if (scope.saga) {
    if (
      !(
        scope.saga.constructor.name === "GeneratorFunction" ||
        scope.saga.constructor.name === "AsyncGeneratorFunction"
      )
    ) {
      warning("attribute saga provided in registerModule is not generator function or async generator function");
    } else {
      window.__SANDBOX_SCOPE__.saga = scope.saga;
    }
  }
  if (scope.props) {
    if (scope.props.constructor !== Object) {
      warning("attribute props provided in registerModule is not object");
    } else {
      window.__SANDBOX_SCOPE__.props = scope.props;
    }
  }
}
