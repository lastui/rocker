
export default (scope) => {
  if (scope.Main) {
    this.Main = scope.Main;
  }
  if (scope.Error) {
    this.Error = scope.Error;
  }
  if (scope.reducer) {
    this.reducer = scope.reducer;
  }
  if (scope.saga) {
    this.saga = scope.saga;
  }
  if (scope.props) {
    this.props = scope.props;
  }
}