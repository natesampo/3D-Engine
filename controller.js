const inputs = {};

document.addEventListener('keydown', function(event) {
	inputs[event.code] = event.key;
});

document.addEventListener('keyup', function(event) {
	delete inputs[event.code];
});