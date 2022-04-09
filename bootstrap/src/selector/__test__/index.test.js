import * as SL from "../";

describe("selector", () => {
	describe(".getEntrypoint", () => {
		it("should be defined", () => {
			expect(SL.getEntrypoint).toBeDefined();
		});
	});

	describe(".getLanguage", () => {
		it("should be defined", () => {
			expect(SL.getLanguage).toBeDefined();
		});
	});

	describe(".getI18nMessages", () => {
		it("should be defined", () => {
			expect(SL.getI18nMessages).toBeDefined();
		});
	});
});
