const levels = [new Level({r: 40, g: 40, b: 40, a: 1}, [
	new Body([
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.3, -0.3, -0.1),
			new Vertex(-0.3, -0.1, -0.1),
			new Vertex(-0.1, -0.1, -0.1),
			new Vertex(-0.1, -0.3, -0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.1, -0.3, 0.1),
			new Vertex(-0.1, -0.1, 0.1),
			new Vertex(-0.3, -0.1, 0.1),
			new Vertex(-0.3, -0.3, 0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.1, -0.3, -0.1),
			new Vertex(-0.1, -0.1, -0.1),
			new Vertex(-0.1, -0.1, 0.1),
			new Vertex(-0.1, -0.3, 0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.3, -0.3, 0.1),
			new Vertex(-0.3, -0.1, 0.1),
			new Vertex(-0.3, -0.1, -0.1),
			new Vertex(-0.3, -0.3, -0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.3, -0.3, 0.1),
			new Vertex(-0.3, -0.3, -0.1),
			new Vertex(-0.1, -0.3, -0.1),
			new Vertex(-0.1, -0.3, 0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.3, -0.1, -0.1),
			new Vertex(-0.3, -0.1, 0.1),
			new Vertex(-0.1, -0.1, 0.1),
			new Vertex(-0.1, -0.1, -0.1)])]),
	new Body([
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.1, -0.1, -0.1),
			new Vertex(-0.1, 0.1, -0.1),
			new Vertex(0.1, 0.1, -0.1),
			new Vertex(0.1, -0.1, -0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(0.1, -0.1, 0.1),
			new Vertex(0.1, 0.1, 0.1),
			new Vertex(-0.1, 0.1, 0.1),
			new Vertex(-0.1, -0.1, 0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(0.1, -0.1, -0.1),
			new Vertex(0.1, 0.1, -0.1),
			new Vertex(0.1, 0.1, 0.1),
			new Vertex(0.1, -0.1, 0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.1, -0.1, 0.1),
			new Vertex(-0.1, 0.1, 0.1),
			new Vertex(-0.1, 0.1, -0.1),
			new Vertex(-0.1, -0.1, -0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.1, -0.1, 0.1),
			new Vertex(-0.1, -0.1, -0.1),
			new Vertex(0.1, -0.1, -0.1),
			new Vertex(0.1, -0.1, 0.1)]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex(-0.1, 0.1, -0.1),
			new Vertex(-0.1, 0.1, 0.1),
			new Vertex(0.1, 0.1, 0.1),
			new Vertex(0.1, 0.1, -0.1)])]),
	new Body([
		new Face({r: 184, g: 142, b: 94, a: 1}, [
			new Vertex(-0.018, -0.16, -0.015),
			new Vertex(-0.018, -0.08, -0.015),
			new Vertex(0.018, -0.08, -0.015),
			new Vertex(0.018, -0.16, -0.015)]),
		new Face({r: 184, g: 142, b: 94, a: 1}, [
			new Vertex(0.018, -0.16, 0.015),
			new Vertex(0.018, -0.08, 0.015),
			new Vertex(-0.018, -0.08, 0.015),
			new Vertex(-0.018, -0.16, 0.015)]),
		new Face({r: 184, g: 142, b: 94, a: 1}, [
			new Vertex(0.018, -0.16, -0.015),
			new Vertex(0.018, -0.08, -0.015),
			new Vertex(0.018, -0.08, 0.015),
			new Vertex(0.018, -0.16, 0.015)]),
		new Face({r: 184, g: 142, b: 94, a: 1}, [
			new Vertex(-0.018, -0.16, 0.015),
			new Vertex(-0.018, -0.08, 0.015),
			new Vertex(-0.018, -0.08, -0.015),
			new Vertex(-0.018, -0.16, -0.015)]),
		new Face({r: 184, g: 142, b: 94, a: 1}, [
			new Vertex(-0.018, -0.16, 0.015),
			new Vertex(-0.018, -0.16, -0.015),
			new Vertex(0.018, -0.16, -0.015),
			new Vertex(0.018, -0.16, 0.015)]),
		new Face({r: 240, g: 50, b: 0, a: 1}, [
			new Vertex(-0.08, -0.08, -0.015),
			new Vertex(-0.08, 0.08, -0.015),
			new Vertex(0.08, 0.08, -0.015),
			new Vertex(0.08, -0.08, -0.015)]),
		new Face({r: 240, g: 50, b: 0, a: 1}, [
			new Vertex(0.08, -0.08, 0.015),
			new Vertex(0.08, 0.08, 0.015),
			new Vertex(-0.08, 0.08, 0.015),
			new Vertex(-0.08, -0.08, 0.015)]),
		new Face({r: 30, g: 30, b: 30, a: 1}, [
			new Vertex(0.08, -0.08, -0.015),
			new Vertex(0.08, 0.08, -0.015),
			new Vertex(0.08, 0.08, 0.015),
			new Vertex(0.08, -0.08, 0.015)]),
		new Face({r: 30, g: 30, b: 30, a: 1}, [
			new Vertex(-0.08, -0.08, 0.015),
			new Vertex(-0.08, 0.08, 0.015),
			new Vertex(-0.08, 0.08, -0.015),
			new Vertex(-0.08, -0.08, -0.015)]),
		new Face({r: 30, g: 30, b: 30, a: 1}, [
			new Vertex(-0.08, -0.08, 0.015),
			new Vertex(-0.08, -0.08, -0.015),
			new Vertex(-0.018, -0.08, -0.015),
			new Vertex(-0.018, -0.08, 0.015)]),
		new Face({r: 30, g: 30, b: 30, a: 1}, [
			new Vertex(0.018, -0.08, 0.015),
			new Vertex(0.018, -0.08, -0.015),
			new Vertex(0.08, -0.08, -0.015),
			new Vertex(0.08, -0.08, 0.015)]),
		new Face({r: 30, g: 30, b: 30, a: 1}, [
			new Vertex(-0.08, 0.08, -0.015),
			new Vertex(-0.08, 0.08, 0.015),
			new Vertex(0.08, 0.08, 0.015),
			new Vertex(0.08, 0.08, -0.015)])]),
	new Body([
		new Face({r: 0, g: 0, b: 150, a: 1}, [
			new Vertex(-1, -0.3, 1),
			new Vertex(1, -0.3, 1),
			new Vertex(1, -0.3, -0.1),
			new Vertex(-1, -0.3, -0.1)])])
	])];

const levelCam = new Camera(
		[0, 0, -1],
		[0, 0, 1],
		0,
		70,
		0.1,
		10,
		vectorNormalize([0, 0, -1]));