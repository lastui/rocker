import { watchContext, runContextRefresher } from "../context";
import { runSaga } from "redux-saga";
import { constants } from "@lastui/rocker/platform";

describe("context", () => {
	describe("watchContext", () => {
		it("should be defined", () => {
			expect(watchContext).toBeDefined();
		});

		it("should fork runContextRefresher", () => {
			const gen = watchContext({ type: constants.INIT });
			const step = gen.next();

			expect(step.done).toEqual(false);
			expect(step.value.type).toEqual("FORK");
			expect(step.value.payload.args[0]).toEqual(constants.INIT);
			expect(step.value.payload.args[1]).toEqual(runContextRefresher);
		});
	});

	describe("runContextRefresher", () => {
		const consoleDebug = console.warn;
		const consoleWarn = console.warn;

		beforeEach(() => {
			console.debug = jest.fn();
			console.warn = jest.fn();
		});

		afterAll(() => {
			console.debug = consoleDebug;
			console.warn = consoleWarn;
		});

		it("happy path, single run", async () => {
			const ctx = {
				entrypoint: "my-entrypoint",
				available: [],
			};
			const fetchContext = jest.fn();
			fetchContext.mockReturnValueOnce(ctx);
			const action = {
				type: constants.INIT,
				payload: {
					fetchContext,
				},
			};
			const dispatched = [];
			await runSaga(
				{
					dispatch: (action) => dispatched.push(action),
				},
				runContextRefresher,
				action
			).done;
			expect(fetchContext).toHaveBeenCalled();
			expect(dispatched.length).toEqual(2);
			expect(dispatched[0].type).toEqual(constants.SET_AVAILABLE_MODULES);
			expect(dispatched[0].payload.modules).toEqual(ctx.available);
			expect(dispatched[1].type).toEqual(constants.SET_ENTRYPOINT_MODULE);
			expect(dispatched[1].payload.entrypoint).toEqual(ctx.entrypoint);
		});

		it("error path, single run", async () => {
			const error = new Error("Async error");
			const initializeRuntime = jest.fn();
			const fetchContext = jest.fn();
			fetchContext.mockRejectedValueOnce(error);
			const action = {
				type: constants.INIT,
				payload: {
					fetchContext,
				},
			};
			const dispatched = [];
			await runSaga(
				{
					dispatch: (action) => dispatched.push(action),
				},
				runContextRefresher,
				action
			).done;
			expect(fetchContext).toHaveBeenCalled();
			expect(dispatched.length).toEqual(0);
			expect(console.warn).toHaveBeenCalledWith(
				"failed to obtain context",
				error
			);
		});

		it("continuous polling", () => {
			const ctx = {
				entrypoint: "my-entrypoint",
				available: [],
			};
			const fetchContext = jest.fn();
			const initializeRuntime = jest.fn();
			const action = {
				type: constants.INIT,
				payload: {
					fetchContext,
					initializeRuntime,
					contextRefreshInterval: 10,
				},
			};

			const gen = runContextRefresher(action);
			const stepInitialize = gen.next();

			expect(stepInitialize.done).toEqual(false);
			expect(stepInitialize.value.type).toEqual("CALL");
			expect(stepInitialize.value.payload.fn).toEqual(initializeRuntime);

			const stepFirstCycle = gen.next();

			expect(stepFirstCycle.done).toEqual(false);
			expect(stepFirstCycle.value.type).toEqual("CALL");
			expect(stepFirstCycle.value.payload.fn).toEqual(fetchContext);

			expect(console.debug).toHaveBeenCalledWith(
				"context will refresh automatically each 10 ms."
			);

			gen.next(ctx); // put available modules
			gen.next(); // put entrypoint module

			const stepYieldRefreshInterval = gen.next();

			expect(stepYieldRefreshInterval.done).toEqual(false);
			expect(stepYieldRefreshInterval.value.type).toEqual("CALL");
			expect(stepYieldRefreshInterval.value.payload.args[0]).toEqual(10);

			const stepNextCycle = gen.next();

			expect(stepNextCycle.done).toEqual(false);
			expect(stepNextCycle.value.type).toEqual("CALL");
			expect(stepNextCycle.value.payload.fn).toEqual(fetchContext);
		});
	});
});
