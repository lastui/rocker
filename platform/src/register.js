export default function(scope) {
  if (scope === null || typeof scope !== 'object') {
    throw new Error(`scope must be object. Was: ${scope}`)
  }

  if (scope.Main) {
    window.__SANDBOX_SCOPE__.Main = scope.Main;
  }
  if (scope.Error) {
    window.__SANDBOX_SCOPE__.Error = scope.Error;
  }
  if (scope.reducer) {
    window.__SANDBOX_SCOPE__.reducer = scope.reducer;
  }
  if (scope.middleware) {
    window.__SANDBOX_SCOPE__.middleware = scope.middleware;
  }
  if (scope.saga) {
    window.__SANDBOX_SCOPE__.saga = scope.saga;
  }
  if (scope.props) {
    window.__SANDBOX_SCOPE__.props = scope.props;
  }
}
