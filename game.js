function render(game) {
	
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

launchExample();