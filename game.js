const gameSpeed = 60;
var currLevel = 0;

var newCanv = document.createElement('canvas');
var newCont = newCanv.getContext('2d');
var colors;
var img = new Image();
img.onload = function() {
	newCanv.width = img.width;
	newCanv.height = img.height;
	newCont.drawImage(img, 0, 0);
	colors = newCont.getImageData(0, 0, img.width, img.height).data;
	start();
}
img.src = 'download.jpg';

function render(context, imageData, canvasWidth, canvasHeight, fps) {
	renderLevel(levels[currLevel], context, imageData, canvasWidth, canvasHeight, levelCam);
	context.fillStyle = 'rgba(255, 255, 255, 1)';
	context.fillText('FPS: ' + Math.round(fps), canvasWidth-50, 20);
}

function tick() {
	let pressed = Object.keys(inputs);
	if (contains(pressed, 'KeyW')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorMultiply(copyArray(levelCam.look), [1, 0, 1, 0])), 0.02));
	}
	if (contains(pressed, 'KeyS')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorMultiply(copyArray(levelCam.look), [1, 0, 1, 0])), -0.02));
	}
	if (contains(pressed, 'KeyA')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorCrossProduct([0, 1, 0, 0], vectorMultiply(copyArray(levelCam.look), [1, 0, 1, 0]))), 0.02));
	}
	if (contains(pressed, 'KeyD')) {
		levelCam.translate(vectorScale(vectorNormalize(vectorCrossProduct([0, -1, 0, 0], vectorMultiply(copyArray(levelCam.look), [1, 0, 1, 0]))), 0.02));
	}
	if (contains(pressed, 'Space')) {
		levelCam.translate([0, 0.02, 0, 0]);
	}
	if (contains(pressed, 'ShiftLeft')) {
		levelCam.translate([0, -0.02, 0, 0]);
	}
	if (contains(pressed, 'ArrowUp')) {
		levelCam.rotate([0.9, 0, 0, 0]);
	}
	if (contains(pressed, 'ArrowDown')) {
		levelCam.rotate([-0.9, 0, 0, 0]);
	}
	if (contains(pressed, 'ArrowLeft')) {
		levelCam.rotate([0, 0.9, 0, 0]);
	}
	if (contains(pressed, 'ArrowRight')) {
		levelCam.rotate([0, -0.9, 0, 0]);
	}

	levelCam['lighting'] = vectorNegate(copyArray(levelCam.look));
}

function gameLoop(context, imageData, prevWidth, prevHeight, prevTime) {
	let start = new Date();

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
	render(context, imageData, canvasWidth, canvasHeight, 1000/(start - prevTime));

	window.requestAnimationFrame(function() {gameLoop(context, imageData, canvasWidth, canvasHeight, start)});
}

function start() {
	const canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.position = 'absolute';
	canvas.style.top = 0;
	canvas.style.left = 0;
	const context = canvas.getContext('2d');
	context.imageSmoothingEnabled = false;
	const imageData = context.createImageData(canvas.width, canvas.height);

	window.requestAnimationFrame(function() {gameLoop(context, imageData, canvas.width, canvas.height, new Date())});
}