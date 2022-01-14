import React from "react";

import { matchPath } from "../routing";

export const HistoryContext = React.createContext();
export const RouterContext = React.createContext();

export function useHistory() {
  return React.useContext(HistoryContext);
}

export function useLocation() {
  return React.useContext(RouterContext).location;
}

export function useParams() {
  const match = React.useContext(RouterContext).match;
  return match ? match.params : {};
}

export function useRouteMatch(path) {
  const ctx = React.useContext(RouterContext);
  return path ? matchPath(ctx.location.pathname, path, {}) : ctx.match;
}

class Router extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      location: {
        hash: props.history.location.hash,
        pathname: props.history.location.pathname,
        search: props.history.location.search,
      }
    };

    this._isMounted = false;
    this._pendingLocation = null;

    this.unlisten = props.history.listen((action) => {
      if (this._isMounted) {
        this.setState({
          location: {
            hash: action.location.hash,
            pathname: action.location.pathname,
            search: action.location.search,
          }
        });
      } else {
        this._pendingLocation = {
          hash: action.location.hash,
          pathname: action.location.pathname,
          search: action.location.search,
        };
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._pendingLocation) {
      this.setState({ location: this._pendingLocation });
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
      this._isMounted = false;
      this._pendingLocation = null;
    }
  }

  render() {
    return (
      <RouterContext.Provider
        value={{
          history: this.props.history,
          location: this.state.location,
          match: {
            path: "/",
            url: "/",
            params: {},
            isExact: this.state.location.pathname === "/"
          }
        }}
      >
        <HistoryContext.Provider
          children={this.props.children || null}
          value={this.props.history}
        />
      </RouterContext.Provider>
    );
  }
}

export default Router;
