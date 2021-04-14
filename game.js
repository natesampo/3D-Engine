function render(game) {
	for (var i=0; i<game.screens.length; i++) {
		renderScreen(game.screens[i]);
	}
}

function tick(game) {
	let levelCam = game.screens[0].camera;
	let pressed = Object.keys(game.inputs);
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
		levelCam.rotate([0, -0.9, 0, 0]);
	}
	if (contains(pressed, 'ArrowRight')) {
		levelCam.rotate([0, 0.9, 0, 0]);
	}

	levelCam['lighting'] = vectorNegate(copyArray(levelCam.look));
}

function gameLoop(game) {
	tick(game);
	render(game);
	window.requestAnimationFrame(function() {gameLoop(game)});
}

function start(game) {
	window.requestAnimationFrame(function() {gameLoop(game);});
}

function launchExample() {
	let game = new Game();
	addKeyUpListener(game.inputs);
	addKeyDownListener(game.inputs);

	loadLevel('example.lvl', function(level) {
		let canvas = document.createElement('canvas');
		canvas.classList.add('screenCanvas');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		document.body.appendChild(canvas);
		let context = canvas.getContext('2d');
		context.imageSmoothingEnabled = false;

		game.screens.push(new Screen(canvas, context, 0, 0, 1, 1, level, 
							new Camera([0.5, 0.75, -2, 0], [0, 0, 1, 0], canvas.width/canvas.height, 70, 0.1, 10, vectorNormalize([0, 0, -1, 0])),
							new ArrayBuffer(canvas.width * canvas.height * 4)));

		start(game);
	});
}

launchExample();