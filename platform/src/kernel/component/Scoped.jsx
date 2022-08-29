import { forwardRef, useMemo, createElement, Component, useContext } from "react";
import { ReactReduxContext } from "react-redux";

const Scoped = (id, preferentialStore, scope) => {
  if (!scope.component) {
    return null;
  }

  const Bridge = (props) => {
    const parentContext = useContext(ReactReduxContext);

    const reduxContext = useMemo(
      () => ({
        store: preferentialStore,
        subscription: parentContext.subscription,
      }),
      [parentContext.subscription],
    );

    const composite = useMemo(() => {
      if (props.forwardedRef) {
        return Object.assign({}, scope.props, props.owned, { ref: props.forwardedRef });
      } else if (scope.props) {
        return Object.assign({}, scope.props, props.owned);
      } else if (props.owned) {
        return props.owned;
      } else {
        return null;
      }
    }, [props.forwardedRef, props.owned]);

    return (
      <ReactReduxContext.Provider value={reduxContext}>
        {props.children
          ? createElement(scope.component, composite, props.children)
          : createElement(scope.component, composite)}
      </ReactReduxContext.Provider>
    );
  };

  class Boundaries extends Component {
    state = { error: null };

    static displayName = `Module(${id})`;

    static getDerivedStateFromError(error) {
      return { error };
    }

    render() {
      if (this.state.error === null) {
        return this.props.children
          ? createElement(Bridge, this.props, this.props.children)
          : createElement(Bridge, this.props);
      }
      if (scope.fallback) {
        return createElement(scope.fallback, this.state);
      }
      return null;
    }
  }

  return forwardRef((props, ref) => <Boundaries {...props} forwardedRef={ref} />);
};

export default Scoped;