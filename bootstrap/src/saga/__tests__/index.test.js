import * as sagas from '../'

describe('saga', () => {
	it('exposes watchContext', () => {
		expect(sagas.watchContext).toBeDefined();
	});
})