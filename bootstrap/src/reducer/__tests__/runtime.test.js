import runtimeReducer from "../runtime";

describe("runtimeReducer", () => {
	
	it("should be defined", () => {
		expect(runtimeReducer).toBeDefined();
	});

	it("initial state", () => {
		const initialState = runtimeReducer(undefined, { type: 'stub' });

		expect(initialState).toEqual({
			entrypoint: null,
		});
	});
});
