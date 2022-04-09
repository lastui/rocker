import * as SL from "../";

describe("selector", () => {
	const state = {
		runtime: {
			entrypoint: "value",
		},
		shared: {
			language: "en-US",
			messages: {
				"en-US": {
					foo: "bar",
				},
			},
		},
	};

	describe(".getEntrypoint", () => {
		it("should be defined", () => {
			expect(SL.getEntrypoint).toBeDefined();
		});
		it("should return entrypoint", () => {
			expect(SL.getEntrypoint(state)).toEqual("value");
		});
	});

	describe(".getLanguage", () => {
		it("should be defined", () => {
			expect(SL.getLanguage).toBeDefined();
		});
		it("should return language", () => {
			expect(SL.getLanguage(state)).toEqual("en-US");
		});
	});

	describe(".getI18nMessages", () => {
		it("should be defined", () => {
			expect(SL.getI18nMessages).toBeDefined();
		});
		it("should return i18n messages (exists for currently selected language)", () => {
			expect(SL.getI18nMessages(state)).toEqual(
				state.shared.messages["en-US"]
			);
		});
		it("should return same empty object (does not exists for currently selected language)", () => {
			const nextState = {
				...state,
				shared: {
					...state.shared,
					language: "cs-CZ",
				},
			};
			const messages = SL.getI18nMessages(nextState);
			expect(messages).toMatchObject({});
			expect(SL.getI18nMessages(nextState)).toEqual(messages);
		});
	});
});
