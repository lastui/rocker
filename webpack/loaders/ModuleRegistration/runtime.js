function isGenerator(val) {
  return /\[object Generator|GeneratorFunction\]/.test(Object.prototype.toString.call(val));
}

function isFunction(val) {
  return /\[object Function|AsyncFunction\]/.test(Object.prototype.toString.call(val));
}

module.exports = function (scope) {
  const result = {}

  if (!scope) {
    return;
  }

  const objectConstructor = Object.toString();

  if (scope.constructor.toString() !== objectConstructor) {
    throw new Error(`registerModule accepts only plain object, was called with ${typeof scope}`);
  }

  result.BUILD_ID = BUILD_ID;

  if (scope.component) {
    if (!isFunction(scope.component)) {
      console.error(`attribute "component" provided in registerModule is not function`);
    } else {
      result.component = scope.component;
    }
  }
  if (scope.fallback) {
    if (!isFunction(scope.fallback)) {
      console.error(`attribute "fallback" provided in registerModule is not function`);
    } else {
      result.fallback = scope.fallback;
    }
  }
  if (scope.reducers) {
    if (scope.reducers.constructor.toString() !== objectConstructor) {
      console.error(`attribute "reducers" provided in registerModule is not plain object`);
    } else {
      result.reducers = scope.reducers;
    }
  }
  if (scope.middleware) {
    if (!isFunction(scope.middleware) || isGenerator(scope.middleware)) {
      console.error(`attribute "middleware" provided in registerModule is not function or async function`);
    } else {
      result.middleware = scope.middleware;
    }
  }
  if (scope.saga) {
    if (!isGenerator(scope.saga)) {
      console.error(`attribute "saga" provided in registerModule is not generator function or async generator function`);
    } else {
      result.saga = scope.saga;
    }
  }
  if (scope.props) {
    if (scope.props.constructor.toString() !== objectConstructor) {
      console.error(`attribute "props" provided in registerModule is not plain object`);
    } else {
      result.props = scope.props;
    }
  }

  self.__SANDBOX_SCOPE__ = result;
}
