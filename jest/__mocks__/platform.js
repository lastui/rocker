const React = require("react");

module.exports = {
	Module: (props) => props.children
		? React.createElement('section', { 'data-testid': `module/${props.name}` }, props.children)
		: React.createElement('section', { 'data-testid': `module/${props.name}` }),
	Route: () => null,
	Router: (props) => props.children
		? React.createElement(React.Fragment, {}, props.children)
		: null,
	Redirect: () => null,
	Link: (props) => props.children
		? React.createElement(React.Fragment, { navigate: () => {} }, props.children)
		: null,
	useHistory: () => ({
		push: () => {},
		replace: () => {},
	}),
	useLocation: () => null,
	useParams: () => null,
	useRouteMatch: () => null,
	constants: new Proxy(Object, {
		get(_ref, prop) {
			return prop;
		},
	}),
	moduleLoaderMiddleware: (_moduleLoader) => (_store) => (next) => (action) => next(action),
	dynamicMiddleware: (_store) => (next) => (action) => next(action),
	moduleLoader: {
		getModulesReducer: () => (state = {}, action) => state,
		setSagaRunner: () => {},
		setStore: () => {},
	},
	sharedState: (state = {}, action) => state,
};
