function addKeyDownListener(inputs) {
	document.addEventListener('keydown', function(event) {
		inputs[event.code] = event.key;
	});
}

function addKeyUpListener(inputs) {
	document.addEventListener('keyup', function(event) {
		delete inputs[event.code];
	});
}