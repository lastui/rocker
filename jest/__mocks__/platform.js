const React = require("react");

module.exports = {
	Module: (props) =>
		props.children
			? React.createElement('section', { 'data-testid': props.name }, props.children)
			: React.createElement('section', { 'data-testid': props.name }),
	Route: () => null,
	Router: (props) => props.children
			? React.createElement(React.Fragment, {}, props.children)
			: null,
	Redirect: () => null,
	Link: (props) =>
		props.children
			? React.createElement(
					React.Fragment,
					{ nagivate: () => {} },
					props.children
			  )
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
};
