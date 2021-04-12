const levels = [new Level({r: 40, g: 40, b: 40, a: 255}, [
	new Body([
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0, 0, 0, 1], [0, 1, 1]),
			new Vertex([0, 1, 0, 1], [0, 0, 1]),
			new Vertex([1, 1, 0, 1], [1, 0, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0, 0, 0, 1], [0, 1, 1]),
			new Vertex([1, 1, 0, 1], [1, 0, 1]),
			new Vertex([1, 0, 0, 1], [1, 1, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([1, 0, 0, 1], [0, 1, 0]),
			new Vertex([1, 1, 0, 1], [0, 0, 0]),
			new Vertex([1, 1, 1, 1], [1, 0, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([1, 0, 0, 1], [0, 1, 1]),
			new Vertex([1, 1, 1, 1], [1, 0, 1]),
			new Vertex([1, 0, 1, 1], [1, 1, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([1, 0, 1, 1], [0, 1, 1]),
			new Vertex([1, 1, 1, 1], [0, 0, 1]),
			new Vertex([0, 1, 1, 1], [1, 0, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([1, 0, 1, 1], [0, 1, 1]),
			new Vertex([0, 1, 1, 1], [1, 0, 1]),
			new Vertex([0, 0, 1, 1], [1, 1, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0, 0, 1, 1], [0, 1, 1]),
			new Vertex([0, 1, 1, 1], [0, 0, 1]),
			new Vertex([0, 1, 0, 1], [1, 0, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0, 0, 1, 1], [0, 1, 1]),
			new Vertex([0, 1, 0, 1], [1, 0, 1]),
			new Vertex([0, 0, 0, 1], [1, 1, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0, 1, 0, 1], [0, 1, 1]),
			new Vertex([0, 1, 1, 1], [0, 0, 1]),
			new Vertex([1, 1, 1, 1], [1, 0, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0, 1, 0, 1], [0, 1, 1]),
			new Vertex([1, 1, 1, 1], [1, 0, 1]),
			new Vertex([1, 1, 0, 1], [1, 1, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([1, 0, 1, 1], [0, 1, 1]),
			new Vertex([0, 0, 1, 1], [0, 0, 1]),
			new Vertex([0, 0, 0, 1], [1, 0, 1])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([1, 0, 1, 1], [0, 1, 1]),
			new Vertex([0, 0, 0, 1], [1, 0, 1]),
			new Vertex([1, 0, 0, 1], [1, 1, 1])])])
	])];

const levelCam = new Camera(
		[0.5, 0.75, -2, 0],
		[0, 0, 1, 0],
		0,
		70,
		0.1,
		10,
		vectorNormalize([0, 0, -1, 0]));