import * as SL from "../";

describe("selectors", () => {
	describe(".getEntrypoint", () => {
		it("should be a defined", () => {
			expect(SL.getEntrypoint).toBeDefined();
		});
	});

	describe(".getLanguage", () => {
		it("should be a defined", () => {
			expect(SL.getLanguage).toBeDefined();
		});
	});

	describe(".getI18nMessages", () => {
		it("should be a defined", () => {
			expect(SL.getI18nMessages).toBeDefined();
		});
	});
});
