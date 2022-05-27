import { forwardRef, useMemo, createElement, Component, useContext } from "react";
import { ReactReduxContext } from "react-redux";

const Scoped = (id, preferentialStore, scope) => {
  if (!scope.Main) {
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
        {props.children ? createElement(scope.Main, composite, props.children) : createElement(scope.Main, composite)}
      </ReactReduxContext.Provider>
    );
  };

  class Boundaries extends Component {
    state = { error: null };

    static displayName = `Module(${id})`;

    static getDerivedStateFromError(error) {
      return { error };
    }

    /*
    shouldComponentUpdate(nextProps, nextState) {
      if (this.props.isReady ^ nextProps.isReady) {
        return true;
      }
      if (this.state.error !== nextState.error) {
        return true;
      }
      if (this.props.lastUpdate !== nextProps.lastUpdate) {
        return true;
      }
      if (this.props.lastRuntimeUpdate !== nextProps.lastRuntimeUpdate) {
        return true;
      }
      for (const key in nextProps.owned) {
        if (this.props.owned[key] !== nextProps.owned[key]) {
          return true;
        }
      }
      return false;
    }*/

    render() {
      if (this.state.error === null) {
        return this.props.children
          ? createElement(Bridge, this.props, this.props.children)
          : createElement(Bridge, this.props);
      }
      if (scope.Error) {
        return createElement(scope.Error, this.state);
      }
      return null;
    }
  }

  return forwardRef((props, ref) => <Boundaries {...props} forwardedRef={ref} />);
};

export default Scoped;