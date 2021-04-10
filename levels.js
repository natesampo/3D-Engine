const levels = [new Level({r: 40, g: 40, b: 40, a: 1}, [
	new Body([
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.3, -0.3, -0.1], [0, 1]),
			new Vertex([-0.3, -0.1, -0.1], [0, 0]),
			new Vertex([-0.1, -0.1, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.3, -0.3, -0.1], [0, 1]),
			new Vertex([-0.1, -0.1, -0.1], [0, 0]),
			new Vertex([-0.1, -0.3, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.3, 0.1], [0, 1]),
			new Vertex([-0.1, -0.1, 0.1], [0, 0]),
			new Vertex([-0.3, -0.1, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.3, 0.1], [0, 1]),
			new Vertex([-0.3, -0.1, 0.1], [0, 0]),
			new Vertex([-0.3, -0.3, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.3, -0.1], [0, 1]),
			new Vertex([-0.1, -0.1, -0.1], [0, 0]),
			new Vertex([-0.1, -0.1, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.3, -0.1], [0, 1]),
			new Vertex([-0.1, -0.1, 0.1], [0, 0]),
			new Vertex([-0.1, -0.3, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.3, -0.3, 0.1], [0, 1]),
			new Vertex([-0.3, -0.1, 0.1], [0, 0]),
			new Vertex([-0.3, -0.1, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.3, -0.3, 0.1], [0, 1]),
			new Vertex([-0.3, -0.1, -0.1], [0, 0]),
			new Vertex([-0.3, -0.3, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.3, -0.3, 0.1], [0, 1]),
			new Vertex([-0.3, -0.3, -0.1], [0, 0]),
			new Vertex([-0.1, -0.3, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.3, -0.3, 0.1], [0, 1]),
			new Vertex([-0.1, -0.3, -0.1], [0, 0]),
			new Vertex([-0.1, -0.3, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.3, -0.1, -0.1], [0, 1]),
			new Vertex([-0.3, -0.1, 0.1], [0, 0]),
			new Vertex([-0.1, -0.1, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.3, -0.1, -0.1], [0, 1]),
			new Vertex([-0.1, -0.1, 0.1], [0, 0]),
			new Vertex([-0.1, -0.1, -0.1], [1, 0])])]),
	new Body([
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.1, -0.1], [0, 1]),
			new Vertex([-0.1, 0.1, -0.1], [0, 0]),
			new Vertex([0.1, 0.1, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.1, -0.1], [0, 1]),
			new Vertex([0.1, 0.1, -0.1], [0, 0]),
			new Vertex([0.1, -0.1, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0.1, -0.1, 0.1], [0, 1]),
			new Vertex([0.1, 0.1, 0.1], [0, 0]),
			new Vertex([-0.1, 0.1, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0.1, -0.1, 0.1], [0, 1]),
			new Vertex([-0.1, 0.1, 0.1], [0, 0]),
			new Vertex([-0.1, -0.1, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0.1, -0.1, -0.1], [0, 1]),
			new Vertex([0.1, 0.1, -0.1], [0, 0]),
			new Vertex([0.1, 0.1, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([0.1, -0.1, -0.1], [0, 1]),
			new Vertex([0.1, 0.1, 0.1], [0, 0]),
			new Vertex([0.1, -0.1, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.1, 0.1], [0, 1]),
			new Vertex([-0.1, 0.1, 0.1], [0, 0]),
			new Vertex([-0.1, 0.1, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.1, 0.1], [0, 1]),
			new Vertex([-0.1, 0.1, -0.1], [0, 0]),
			new Vertex([-0.1, -0.1, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.1, 0.1], [0, 1]),
			new Vertex([-0.1, -0.1, -0.1], [0, 0]),
			new Vertex([0.1, -0.1, -0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, -0.1, 0.1], [0, 1]),
			new Vertex([0.1, -0.1, -0.1], [0, 0]),
			new Vertex([0.1, -0.1, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, 0.1, -0.1], [0, 1]),
			new Vertex([-0.1, 0.1, 0.1], [0, 0]),
			new Vertex([0.1, 0.1, 0.1], [1, 0])]),
		new Face({r: 255, g: 0, b: 0, a: 1}, [
			new Vertex([-0.1, 0.1, -0.1], [0, 1]),
			new Vertex([0.1, 0.1, 0.1], [0, 0]),
			new Vertex([0.1, 0.1, -0.1], [1, 0])])]),
	new Body([
		new Face({r: 0, g: 0, b: 150, a: 1}, [
			new Vertex([-1, -0.3, 1], [0, 1]),
			new Vertex([1, -0.3, 1], [0, 0]),
			new Vertex([1, -0.3, -0.1], [1, 0])]),
		new Face({r: 0, g: 0, b: 150, a: 1}, [
			new Vertex([-1, -0.3, 1], [0, 1]),
			new Vertex([1, -0.3, -0.1], [0, 0]),
			new Vertex([-1, -0.3, -0.1], [1, 0])])])
	])];

const levelCam = new Camera(
		[0, 0, -1],
		[0, 0, 1],
		0,
		70,
		0.1,
		10,
		vectorNormalize([0, 0, -1]));