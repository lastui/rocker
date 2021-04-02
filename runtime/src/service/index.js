
export const getContext = async () =>
	fetch('/context').then((data) => data.json())