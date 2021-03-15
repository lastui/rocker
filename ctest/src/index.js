import React from 'react';
import ReactDom from 'react-dom';
import Stub from './components/Stub';

window.addEventListener('load', (event) => {
	const mount = document.createElement('div');
	document.body.appendChild(mount);
	ReactDom.render(<Stub />, mount);
});
