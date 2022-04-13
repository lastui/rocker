import * as all from "../";

describe("safe module exports", () => {
	it("should expose fixed number of things", () => {
		expect(Object.keys(all).length).toEqual(12);
	});

	describe("registerModule", () => {
		it("exposes expected", () => {
			expect(all.registerModule).toBeDefined();
		});
	});

	describe("actions", () => {
		it("exposes expected", () => {
			expect(Object.keys(all.actions).length).toEqual(2);
			expect(all.actions.setLanguage).toBeDefined();
			expect(all.actions.refresh).toBeDefined();
		});

		it(".setLanguage", () => {
			expect(all.actions.setLanguage("foo")).toEqual({
				type: "@@platform/SET_LANGUAGE",
				payload: {
					language: "foo",
				},
			});
		});

		it(".refresh", () => {
			expect(all.actions.refresh()).toEqual({
				type: "@@platform/REFRESH",
			});
		});
	});

	describe("hooks", () => {
		it("exposes expected", () => {
			expect(all.useLocation).toBeDefined();
			expect(all.useParams).toBeDefined();
			expect(all.useRouteMatch).toBeDefined();
			expect(all.useHistory).toBeDefined();
		});
	});

	describe("components", () => {
		it("exposes expected", () => {
			expect(all.Module).toBeDefined();
			expect(all.Link).toBeDefined();
			expect(all.Router).toBeDefined();
			expect(all.Route).toBeDefined();
			expect(all.Redirect).toBeDefined();
		});
	});
});