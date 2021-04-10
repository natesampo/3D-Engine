const gameSpeed = 60;
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;

var currLevel = 0;

function render(context, canvasWidth, canvasHeight) {
	renderLevel(levels[currLevel], context, canvasWidth, canvasHeight, levelCam);
}

function tick() {
	let pressed = Object.keys(inputs);
	if (contains(pressed, 'KeyW')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorMultiply(levelCam.look, [1, 0, 1])), 0.01));
	}
	if (contains(pressed, 'KeyS')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorMultiply(levelCam.look, [1, 0, 1])), -0.01));
	}
	if (contains(pressed, 'KeyA')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorCrossProduct([0, 1, 0], vectorMultiply(levelCam.look, [1, 0, 1]))), 0.01));
	}
	if (contains(pressed, 'KeyD')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorCrossProduct([0, -1, 0], vectorMultiply(levelCam.look, [1, 0, 1]))), 0.01));
	}
	if (contains(pressed, 'Space')) {
		levelCam.translate([0, 0.01, 0]);
	}
	if (contains(pressed, 'ShiftLeft')) {
		levelCam.translate([0, -0.01, 0]);
	}
	if (contains(pressed, 'ArrowUp')) {
		levelCam.rotate([0.9, 0, 0]);
	}
	if (contains(pressed, 'ArrowDown')) {
		levelCam.rotate([-0.9, 0, 0]);
	}
	if (contains(pressed, 'ArrowLeft')) {
		levelCam.rotate([0, -0.9, 0]);
	}
	if (contains(pressed, 'ArrowRight')) {
		levelCam.rotate([0, 0.9, 0]);
	}

	levelCam['lighting'] = vectorNegate(levelCam.look);
}

function gameLoop(prevWidth, prevHeight) {
	if (prevWidth != window.innerWidth || prevHeight != window.innerHeight) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	let canvasWidth = canvas.width;
	let canvasHeight = canvas.height;
	let context = canvas.getContext('2d');
	levelCam['aspectRatio'] = canvasWidth/canvasHeight;

	tick();
	render(context, canvasWidth, canvasHeight);

	window.requestAnimationFrame(function() {gameLoop(canvasWidth, canvasHeight)});
}

function start() {
	window.requestAnimationFrame(function() {gameLoop(0, 0)});
}

start();