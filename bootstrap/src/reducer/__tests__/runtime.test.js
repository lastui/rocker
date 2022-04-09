import runtimeReducer from "../runtime";
import { constants } from "@lastui/rocker/platform";

describe("runtimeReducer", () => {
	it("should be defined", () => {
		expect(runtimeReducer).toBeDefined();
	});

	it("initial state", () => {
		const action = { type: "stub" };
		const initialState = runtimeReducer(undefined, action);
		expect(initialState).toEqual({
			entrypoint: null,
		});
	});

	it("initial state", () => {
		const action = {
			type: constants.SET_ENTRYPOINT_MODULE,
			payload: {
				entrypoint: "value",
			},
		};
		const nextState = runtimeReducer(undefined, action);
		expect(nextState.entrypoint).toEqual("value");
	});
});
