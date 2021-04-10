const gameSpeed = 60;
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;

var currLevel = 0;

function render(context, canvasWidth, canvasHeight) {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	renderLevel(levels[currLevel], context, canvasWidth, canvasHeight, levelCam);
}

function tick() {
	if (contains(inputs, 'w')) {
		levelCam.translate(vectorScale(levelCam.look, 0.02));
	}
	if (contains(inputs, 's')) {
		levelCam.translate(vectorScale(levelCam.look, -0.02));
	}
	if (contains(inputs, 'a')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorCrossProduct([0, 1, 0], levelCam.look)), 0.02));
	}
	if (contains(inputs, 'd')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorCrossProduct([0, -1, 0], levelCam.look)), 0.02));
	}
	if (contains(inputs, ' ')) {
		levelCam.translate([0, 0.02, 0]);
	}
	if (contains(inputs, 'Shift')) {
		levelCam.translate([0, -0.02, 0]);
	}
	if (contains(inputs, 'ArrowUp')) {
		levelCam.rotate([1, 0, 0]);
	}
	if (contains(inputs, 'ArrowDown')) {
		levelCam.rotate([-1, 0, 0]);
	}
	if (contains(inputs, 'ArrowLeft')) {
		levelCam.rotate([0, -1, 0]);
	}
	if (contains(inputs, 'ArrowRight')) {
		levelCam.rotate([0, 1, 0]);
	}
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