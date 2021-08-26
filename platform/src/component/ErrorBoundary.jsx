import React from "react";

const initialState = { error: null };

class ErrorBoundary extends React.Component {
	state = initialState;

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		console.error(`module ${this.props.name} errored`, error, info);
	}

	render() {
		const { error } = this.state;
		if (error === null) {
			return this.props.children;
		}
		const { fallback } = this.props;
		if (fallback) {
			return React.createElement(fallback, { error });
		}
		return <React.Fragment />;
	}
}

export default ErrorBoundary;
