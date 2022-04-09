const React = require("react");

module.exports = {
	Module: (props) =>
		props.children
			? React.createElement(React.Fragment, {}, props.children)
			: null,
	Route: () => null,
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
	constants: new Proxy({}, {
		get(_o, prop) {
			return prop;
		},
	})
};
