const inputs = {};

document.addEventListener('keydown', function(event) {
	inputs[event.keyCode] = event.key;
});

document.addEventListener('keyup', function(event) {
	delete inputs[event.keyCode];
});