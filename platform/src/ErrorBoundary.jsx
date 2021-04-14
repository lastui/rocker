import React from "react";

const initialState = { error: null };

class ErrorBoundary extends React.Component {
	state = initialState;
	updatedWithError = false;

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		console.error(error, info);
	}

	componentDidMount() {
		const { error } = this.state;

		if (error !== null) {
			this.updatedWithError = true;
		}
	}

	componentDidUpdate(prevProps) {
		const { error } = this.state;

		if (error !== null && !this.updatedWithError) {
			this.updatedWithError = true;
			return;
		}
	}

	render() {
		const { error } = this.state;
		const { fallback } = this.props;

		if (error === null) {
			return this.props.children;
		}

		if (typeof fallback === 'function') {
			return fallback(error);
		}

		return <React.Fragment />;
	}
}

export default ErrorBoundary;
