const React = require("react");

const constants = new Proxy(Object, {
	get(_ref, prop) {
		return prop;
	},
});

module.exports = {
	Module: (props) =>
		props.children
			? React.createElement(
					"section",
					{ "data-testid": `module/${props.name}` },
					props.children
			  )
			: React.createElement("section", {
					"data-testid": `module/${props.name}`,
			  }),
	Route: () => null,
	Router: (props) =>
		props.children
			? React.createElement(React.Fragment, {}, props.children)
			: null,
	Redirect: () => null,
	Link: (props) =>
		props.component
			? React.createElement(props.component, { navigate: () => {} })
			: null,
	useHistory: () => ({
		push: () => {},
		replace: () => {},
	}),
	useLocation: () => null,
	useParams: () => null,
	useRouteMatch: () => null,
	constants,
	actions: {
		setLanguage: (language) => ({
			type: constants.SET_LANGUAGE,
			payload: {
				language,
			},
		}),
		refresh: () => ({
			type: constants.REFRESH,
		}),
	},
	moduleLoaderMiddleware: (_store) => (next) => (action) => next(action),
	dynamicMiddleware: (_store) => (next) => (action) => next(action),
	setSagaRunner: () => {},
	setStore: () => {},
	sharedReducer: (state = {}, action) => state,
	modulesReducer: (state = {}, action) => state,
};
