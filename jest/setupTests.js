jest.mock("@linaria/react", () => {
	function styled(tag) {
		return jest.fn(() => tag);
	}
	return {
		styled: new Proxy(styled, {
			get(o, prop) {
				return o(prop);
			},
		}),
	};
});

jest.mock("@linaria/core", () => ({
	css: jest.fn(() => ""),
}));

jest.mock("linaria", () => ({
	css: jest.fn(() => ""),
	cx: jest.fn(() => ""),
	react: () => {
		function styled(tag) {
			return jest.fn(() => tag);
		}
		return {
			styled: new Proxy(styled, {
				get(o, prop) {
					return o(prop);
				},
			}),
		};
	},
}));
