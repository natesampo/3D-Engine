const gameSpeed = 60;
var currLevel = 0;

var img = new Image();
img.src = 'download.jpg';

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

function gameLoop(context, prevWidth, prevHeight) {
	let canvasWidth;
	let canvasHeight;

	if (prevWidth != window.innerWidth || prevHeight != window.innerHeight) {
		context.canvas.width = window.innerWidth;
		context.canvas.height = window.innerHeight;
		canvasWidth = window.innerWidth;
		canvasHeight = window.innerHeight;
	} else {
		canvasWidth = prevWidth;
		canvasHeight = prevHeight;
	}

	levelCam['aspectRatio'] = canvasWidth/canvasHeight;

	tick();
	render(context, canvasWidth, canvasHeight);

	window.requestAnimationFrame(function() {gameLoop(context, canvasWidth, canvasHeight)});
}

function start() {
	const canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.position = 'absolute';
	canvas.style.top = 0;
	canvas.style.left = 0;
	const context = canvas.getContext('2d');

	window.requestAnimationFrame(function() {gameLoop(context, canvas.width, canvas.height)});
}

start();