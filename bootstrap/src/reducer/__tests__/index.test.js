import * as reducerShape from '../'

describe('reducer', () => {
	it('exposes runtimeReducer', () => {
		expect(reducerShape.runtimeReducer).toBeDefined();
	})
})