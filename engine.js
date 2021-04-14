class Vertex {
	constructor(coordinates, textureCoordinates) {
		this.coordinates = coordinates;
		this.textureCoordinates = textureCoordinates;
	}

	translate(vector) {
		vectorAdd(this.coordinates, vector);
	}

	transform(matrix) {
		applyTransformationMatrix(this.coordinates, matrix);
	}

	multiply(vector) {
		vectorMultiply(this.coordinates, vector);
	}

	rotate(vector, origin) {
		vectorAdd(applyTransformationMatrix(vectorSubtract(this.coordinates, origin), getRotationMatrix(vector)), origin);
	}

	floor() {
		this.coordinates[0] = this.coordinates[0] << 0;
		this.coordinates[1] = this.coordinates[1] << 0;
		this.coordinates[2] = this.coordinates[2] << 0;
	}

	copy() {
		let newCoords = copyArray(this.coordinates);
		let newTextureCoords = copyArray(this.textureCoordinates);

		return new Vertex(newCoords, newTextureCoords);
	}
}

class Face {
	constructor(vertices, texture, lightLevel) {
		this.vertices = vertices;
		this.texture = texture;
		this.lightLevel = lightLevel;
	}

	translate(vector) {
		for (var i=0; i<this.vertices.length; i++) {
			this.vertices[i].translate(vector);
		}
	}

	transform(matrix) {
		for (var i=0; i<this.vertices.length; i++) {
			this.vertices[i].transform(matrix);
		}
	}

	rotate(vector, origin) {
		for (var i=0; i<this.vertices.length; i++) {
			this.vertices[i].rotate(vector, origin);
		}
	}

	scale(factor) {
		for (var i=0; i<this.vertices.length; i++) {
			vectorScale(this.vertices[i].coordinates, factor);
		}
	}

	floor() {
		for (var i=0; i<this.vertices.length; i++) {
			this.vertices[i].floor();
		}
	}

	getExtremes() {
		let extremes = [[null, null], [null, null], [null, null]];
		for (var i=0; i<this.vertices.length; i++) {
			for (var j=0; j<extremes.length; j++) {
				if (!extremes[j][0] || extremes[j][0] > this.vertices[i].coordinates[j]) {
					extremes[j][0] = this.vertices[i].coordinates[j];
				}

				if (!extremes[j][1] || extremes[j][1] < this.vertices[i].coordinates[j]) {
					extremes[j][1] = this.vertices[i].coordinates[j];
				}
			}
		}

		return extremes;
	}

	getNormal() {
		let vector1 = vectorSubtract(copyArray(this.vertices[1].coordinates), this.vertices[0].coordinates);
		let vector2 = vectorSubtract(copyArray(this.vertices[2].coordinates), this.vertices[0].coordinates);

		return vectorNormalize(vectorCrossProduct(vector1, vector2));
	}

	getAverageZ() {
		let total = 0;
		for (var i=0; i<this.vertices.length; i++) {
			total += this.vertices[i].coordinates[2];
		}

		return total/this.vertices.length;
	}

	setLighting(camera) {
		this.lightLevel = Math.max(0.1, vectorDotProduct(this.getNormal(), camera['lighting']));
	}

	copy() {
		let copyVertices = [];
		for (var i=0; i<this.vertices.length; i++) {
			copyVertices.push(this.vertices[i].copy());
		}

		return new Face(copyVertices, this.texture, this.lightLevel);
	}
}

class Body {
	constructor(faces) {
		this.faces = faces;
	}

	translate(vector) {
		for (var i=0; i<this.faces.length; i++) {
			this.faces[i].translate(vector);
		}
	}

	transform(matrix) {
		for (var i=0; i<this.faces.length; i++) {
			this.faces[i].transform(matrix);
		}
	}

	rotate(vector, origin) {
		for (var i=0; i<this.faces.length; i++) {
			this.faces[i].rotate(vector, origin);
		}
	}

	scale(factor) {
		for (var i=0; i<this.faces.length; i++) {
			this.faces[i].scale(factor);
		}
	}

	// Look at the extremes and find the average of those
	getCenter() {
		let extremes = [[null, null], [null, null], [null, null]];
		for (var i=0; i<this.faces.length; i++) {
			let faceExtremes = this.faces[i].getExtremes();
			for (var j=0; j<faceExtremes.length; j++) {
				if (!extremes[j][0] || extremes[j][0] > faceExtremes[j][0]) {
					extremes[j][0] = faceExtremes[j][0];
				}

				if (!extremes[j][1] || extremes[j][1] < faceExtremes[j][1]) {
					extremes[j][1] = faceExtremes[j][1];
				}
			}
		}

		return [(extremes[0][0] + extremes[0][1])/2, (extremes[1][0] + extremes[1][1])/2, (extremes[2][0] + extremes[2][1])/2];
	}

	copy() {
		let copyFaces = [];
		for (var i=0; i<this.faces.length; i++) {
			copyFaces.push(this.faces[i].copy());
		}

		return new Body(copyFaces);
	}
}

class Camera {
	constructor(position, look, aspectRatio, fov, znear, zfar, lighting) {
		this.position = position;
		this.look = look;
		this.aspectRatio = aspectRatio;
		this.fov = fov;
		this.znear = znear;
		this.zfar = zfar;
		this.lighting = lighting;
	}

	translate(vector) {
		vectorAdd(this.position, vector);
	}

	rotate(vector) {
		vectorNormalize(applyTransformationMatrix(this.look, getRotationMatrix(vector)));
	}
}

class Level {
	constructor(color, bodies, textures) {
		this.color = color;
		this.bodies = bodies;
		this.textures = textures;
	}

	translate(vector) {
		for (var i=0; i<this.bodies.length; i++) {
			this.bodies[i].translate(vector);
		}
	}

	transform(matrix) {
		for (var i=0; i<this.bodies.length; i++) {
			this.bodies[i].transform(matrix);
		}
	}

	getColor() {
		return 'rgba(' + this.color['r'].toString() + ', ' +
			this.color['g'].toString() + ', ' +
			this.color['b'].toString() + ', ' +
			this.color['a'].toString() + ')';
	}

	copy() {
		let copyBodies = [];
		for (var i=0; i<this.bodies.length; i++) {
			copyBodies.push(this.bodies[i].copy());
		}

		return new Level(this.color, copyBodies, this.textures);
	}
}

class Screen {
	constructor(canvas, context, x, y, width, height, level, camera, effects) {
		this.canvas = canvas;
		this.context = context;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.level = level;
		this.camera = camera;
		this.effects = effects;
	}

	resize(newWidth, newHeight, pageWidth, pageHeight) {
		if (this.canvas.width != Math.ceil(newWidth * pageWidth) || this.canvas.height != Math.ceil(newHeight * pageHeight)) {
			this.canvas.width = Math.ceil(newWidth * pageWidth);
			this.canvas.height = Math.ceil(newHeight * pageHeight);
			this.context = canvas.getContext('2d');
			this.effects = new ArrayBuffer(this.canvas.width * this.canvas.height * 4);
			this.camera.aspectRatio = this.canvas.width/this.canvas.height;
		}
		this.width = newWidth;
		this.height = newHeight;
	}

	checkForResize() {
		if (this.canvas.width != Math.ceil(this.width * window.innerWidth) || this.canvas.height != Math.ceil(this.height * window.innerHeight)) {
			this.canvas.width = Math.ceil(this.width * window.innerWidth);
			this.canvas.height = Math.ceil(this.height * window.innerHeight);
			this.context = canvas.getContext('2d');
			this.effects = new ArrayBuffer(this.canvas.width * this.canvas.height * 4);
			this.camera.aspectRatio = this.canvas.width/this.canvas.height;
		}
	}
}

class Game {
	constructor(screens, inputs) {
		this.screens = screens ? screens : [];
		this.inputs = inputs ? inputs : {};
	}
}

function loadTexture(texture) {
	if (!document.getElementById(texture)) {
		return new Promise(function(resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', 'textures/' + texture);
			xhr.onreadystatechange = function() {
				if (this.readyState === XMLHttpRequest.DONE) {
					let img = new Image();
					img.onload = function() {
						let canvas = document.createElement('canvas');
						canvas.classList.add('textureCanvas');
						canvas.id = texture;
						canvas.width = img.width;
						canvas.height = img.height;

						let context = canvas.getContext('2d');
						context.imageSmoothingEnabled = false;
						context.drawImage(img, 0, 0);
						resolve([texture, context.getImageData(0, 0, img.width, img.height)]);
					}
					img.src = 'textures/' + texture;
				}
			}
			xhr.send();
		});
	}
}

function loadLevel(level, func) {
	return new Promise(function (resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', 'levels/' + level);
		xhr.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				let levelColor;
				let faceTexture;
				let bodies = [];
				let faces = [];
				let vertices = [];
				let promises = {};
				let levelText = this.responseText.split('\n');
				for (var i=0; i<levelText.length; i++) {
					let line = levelText[i].split(' ');
					switch (line[0]) {
						case 'color':
							levelColor = {'r': parseInt(line[1]), 'g': parseInt(line[2]), 'b': parseInt(line[3]), 'a': parseInt(line[4])};
							break;
						case 'b':
							if (vertices.length > 0) {
								faces.push(new Face(vertices, faceTexture));
								vertices = [];
							}

							if (faces.length > 0) {
								bodies.push(new Body(faces));
								faces = [];
							}
							break;
						case 'f':
							if (vertices.length > 0) {
								faces.push(new Face(vertices, faceTexture));
								vertices = [];
								if (!document.getElementById(line[1]) && !promises[line[1]]) {promises[line[1]] = (loadTexture(line[1]));}
							}
							faceTexture = line[1];
							break;
						case 'v':
							vertices.push(new Vertex([parseInt(line[1]), parseInt(line[2]), parseInt(line[3]), 1], [parseInt(line[4]), parseInt(line[5]), 1]));
							break;
					}
				}

				if (vertices.length > 0) {
					faces.push(new Face(vertices, faceTexture));
					vertices = [];
				}

				if (faces.length > 0) {
					bodies.push(new Body(faces));
					faces = [];
				}

				Promise.all(Object.values(promises)).then(function(imageDati) {
					let textures = {};
					for (var i in imageDati) {
						textures[imageDati[i][0]] = imageDati[i][1];
					}

					resolve(new Level(levelColor, bodies, textures));
				});
			}
		}
		xhr.send();
	}).then(function(values) {
		if (func) {func(values);}
	}, function() {
		throw ('Error loading level \"levels/' + level);
	});
}

function faceClipAgainstPlane(planePoint, planeNormal, face) {
	vectorNormalize(planeNormal);

	let insidePoints = [];
	let outsidePoints = [];

	for (var i=face.vertices.length-1; i>=0; i--) {
		if (pointToPlaneDistance(face.vertices[i].coordinates, planePoint, planeNormal) >= 0) {
			insidePoints.push(face.vertices[i]);
		} else {
			outsidePoints.push(face.vertices.splice(i, 1)[0]);
		}
	}

	switch (insidePoints.length) {
		case 0:
			return [];
			break
		case 1:
			for (var i=0; i<outsidePoints.length; i++) {
				let intersectPortion = vectorIntersectPlanePortion(planePoint, planeNormal, insidePoints[0].coordinates, outsidePoints[i].coordinates);
				face.vertices.push(new Vertex(getPointAtPortionOfLine(insidePoints[0].coordinates, outsidePoints[i].coordinates, intersectPortion), 
												getPointAtPortionOfLine(insidePoints[0].textureCoordinates, outsidePoints[i].textureCoordinates, intersectPortion)));
			}
			return [face];
			break;
		case 2:
			let intersectPortion = vectorIntersectPlanePortion(planePoint, planeNormal, insidePoints[1].coordinates, outsidePoints[0].coordinates);
			let newVertex = new Vertex(getPointAtPortionOfLine(insidePoints[1].coordinates, outsidePoints[0].coordinates, intersectPortion),
											getPointAtPortionOfLine(insidePoints[1].textureCoordinates, outsidePoints[0].textureCoordinates, intersectPortion));

			let newFace = new Face([newVertex.copy(), insidePoints[0].copy()], face.texture, face.lightLevel);
			face.vertices.push(newVertex);

			intersectPortion = vectorIntersectPlanePortion(planePoint, planeNormal, insidePoints[0].coordinates, outsidePoints[0].coordinates);
			newFace.vertices.push(new Vertex(getPointAtPortionOfLine(insidePoints[0].coordinates, outsidePoints[0].coordinates, intersectPortion),
												getPointAtPortionOfLine(insidePoints[0].textureCoordinates, outsidePoints[0].textureCoordinates, intersectPortion)));

			return [face, newFace];
			break;
		case 3:
			return [face];
	}
}

function sortTriangleVerticesByY(face) {
	if (face.vertices[1].coordinates[1] < face.vertices[0].coordinates[1]) {
		[face.vertices[0], face.vertices[1]] = swap(face.vertices[0], face.vertices[1]);
	}

	if (face.vertices[2].coordinates[1] < face.vertices[0].coordinates[1]) {
		[face.vertices[0], face.vertices[2]] = swap(face.vertices[0], face.vertices[2]);
	}

	if (face.vertices[2].coordinates[1] < face.vertices[1].coordinates[1]) {
		[face.vertices[1], face.vertices[2]] = swap(face.vertices[1], face.vertices[2]);
	}
}

function applyViewSpaceTranslation(face, canvasWidth, canvasHeight) {
	for (var i=0; i<face.vertices.length; i++) {
		face.vertices[i].translate([1, 1, 0, 0]);
		face.vertices[i].multiply([canvasWidth/2, canvasHeight/2, 1, 0]);
	}
}

function clipAndProjectFace(face, canvasWidth, canvasHeight, camera) {
	let clippedTriangles = faceClipAgainstPlane([0, 0, 0.1, 0], [0, 0, 1, 0], face);
	for (var k=0; k<clippedTriangles.length; k++) {
		clippedTriangles[k].transform(getProjectionMatrix(camera));
		if (clippedTriangles[k].vertices[0].coordinates[3] != 0) {
			clippedTriangles[k].vertices[0].textureCoordinates[0] /= clippedTriangles[k].vertices[0].coordinates[3];
			clippedTriangles[k].vertices[0].textureCoordinates[1] /= clippedTriangles[k].vertices[0].coordinates[3];
			clippedTriangles[k].vertices[0].textureCoordinates[2] = 1/clippedTriangles[k].vertices[0].coordinates[3];
			vectorScale(clippedTriangles[k].vertices[0].coordinates, 1/clippedTriangles[k].vertices[0].coordinates[3]);
			clippedTriangles[k].vertices[0].coordinates[3] = 1;
		}
		if (clippedTriangles[k].vertices[1].coordinates[3] != 0) {
			clippedTriangles[k].vertices[1].textureCoordinates[0] /= clippedTriangles[k].vertices[1].coordinates[3];
			clippedTriangles[k].vertices[1].textureCoordinates[1] /= clippedTriangles[k].vertices[1].coordinates[3];
			clippedTriangles[k].vertices[1].textureCoordinates[2] = 1/clippedTriangles[k].vertices[1].coordinates[3];
			vectorScale(clippedTriangles[k].vertices[1].coordinates, 1/clippedTriangles[k].vertices[1].coordinates[3]);
			clippedTriangles[k].vertices[1].coordinates[3] = 1;
		}
		if (clippedTriangles[k].vertices[2].coordinates[3] != 0) {
			clippedTriangles[k].vertices[2].textureCoordinates[0] /= clippedTriangles[k].vertices[2].coordinates[3];
			clippedTriangles[k].vertices[2].textureCoordinates[1] /= clippedTriangles[k].vertices[2].coordinates[3];
			clippedTriangles[k].vertices[2].textureCoordinates[2] = 1/clippedTriangles[k].vertices[2].coordinates[3];
			vectorScale(clippedTriangles[k].vertices[2].coordinates, 1/clippedTriangles[k].vertices[2].coordinates[3]);
			clippedTriangles[k].vertices[2].coordinates[3] = 1;
		}
		applyViewSpaceTranslation(clippedTriangles[k], canvasWidth, canvasHeight);
	}

	for (var k=0; k<4; k++) {
		for (var l=clippedTriangles.length-1; l>=0; l--) {
			let newTris = [];
			switch (k) {
				case 0:
					newTris = faceClipAgainstPlane([0, 0, 0, 0], [1, 0, 0, 0], clippedTriangles[l]);
					break;
				case 1:
					newTris = faceClipAgainstPlane([canvasWidth - 1, 0, 0, 0], [-1, 0, 0, 0], clippedTriangles[l]);
					break;
				case 2:
					newTris = faceClipAgainstPlane([0, 0, 0, 0], [0, 1, 0, 0], clippedTriangles[l]);
					break;
				case 3:
					newTris = faceClipAgainstPlane([0, canvasHeight - 1, 0, 0], [0, -1, 0, 0], clippedTriangles[l]);
					break;
			}

			for (var m=0; m<newTris.length; m++) {
				clippedTriangles.push(newTris[m]);
			}
			clippedTriangles.splice(l, 1);
		}
	}

	return clippedTriangles;
}

function clipAndProjectBodies(bodies, canvasWidth, canvasHeight, camera) {
	let facesToDraw = [];
	for (var i=0; i<bodies.length; i++) {
		let body = bodies[i];
		for (var j=0; j<body.faces.length; j++) {
			let face = body.faces[j];
			let toCameraVector = vectorSubtract(copyArray(face.vertices[0].coordinates), camera.position);

			if (vectorDotProduct(face.getNormal(), toCameraVector) < 0) {
				let toDraw = face.copy();
				toDraw.setLighting(camera);
				toDraw.transform(getPointAtMatrix(camera));

				let clippedTriangles = clipAndProjectFace(toDraw, canvasWidth, canvasHeight, camera);
				for (var k=0; k<clippedTriangles.length; k++) {
					facesToDraw.push(clippedTriangles[k]);
				}
			}
		}
	}

	return facesToDraw;
}

function textureTriangle(face, newImageData, depthBuffer, canvasWidth, imgData) {
	face.floor();
	sortTriangleVerticesByY(face);

	let vertex1 = face.vertices[0].coordinates;
	let vertex2 = face.vertices[1].coordinates;
	let vertex3 = face.vertices[2].coordinates;

	let textureVertex1 = face.vertices[0].textureCoordinates;
	let textureVertex2 = face.vertices[1].textureCoordinates;
	let textureVertex3 = face.vertices[2].textureCoordinates;

	let dy1 = vertex2[1] - vertex1[1] << 0;
	let dy2 = vertex3[1] - vertex1[1] << 0;

	let xStep1 = ((dy1) ? (vertex2[0] - vertex1[0]) / dy1 : 0);
	let txStep1 = ((dy1) ? (textureVertex2[0] - textureVertex1[0]) / dy1 : 0);
	let tyStep1 = ((dy1) ? (textureVertex2[1] - textureVertex1[1]) / dy1 : 0);
	let twStep1 = ((dy1) ? (textureVertex2[2] - textureVertex1[2]) / dy1 : 0);

	let xStep2 = ((dy2) ? (vertex3[0] - vertex1[0]) / dy2 : 0);
	let txStep2 = ((dy2) ? (textureVertex3[0] - textureVertex1[0]) / dy2 : 0);
	let tyStep2 = ((dy2) ? (textureVertex3[1] - textureVertex1[1]) / dy2 : 0);
	let twStep2 = ((dy2) ? (textureVertex3[2] - textureVertex1[2]) / dy2 : 0);

	let imgWidth = imgData.width;
	let imgHeight = imgData.height;
	let colorData = new Uint32Array(imgData.data.buffer);

	let startX = vertex1[0];
	let startTx = textureVertex1[0];
	let startTy = textureVertex1[1];
	let startTw = textureVertex1[2];
	let endX = startX;
	let endTx = startTx;
	let endTy = startTy;
	let endTw = startTw;

	let flipped = false;
	if ((vertex2[0] - vertex1[0]) * (vertex3[1] - vertex1[1]) - (vertex2[1] - vertex1[1]) * (vertex3[0] - vertex1[0]) > 0) {
		[xStep1, xStep2] = swap(xStep1, xStep2);
		[txStep1, txStep2] = swap(txStep1, txStep2);
		[tyStep1, tyStep2] = swap(tyStep1, tyStep2);
		[twStep1, twStep2] = swap(twStep1, twStep2);

		flipped = true;
	}

	let j = vertex1[1] << 0;
	if (dy1 > 1 && dy2 > 1) {
		while (j<=vertex2[1]) {
			if (startX != endX) {
				let tStep = 1/(endX - startX);

				let txStep3 = tStep * (endTx - startTx) * imgWidth;
				let tyStep3 = tStep * (endTy - startTy) * imgHeight;
				let twStep3 = tStep * (endTw - startTw);

				let tx = startTx * imgWidth;
				let ty = startTy * imgHeight;
				let tw = startTw;
				let ind = j * canvasWidth + startX << 0;

				if (twStep3 == 0) {
					let txtw = txStep3/tw;
					let tytw = tyStep3/tw;
					ty /= tw;
					tx /= tw;
					for (var k=startX; k<=endX; k++) {
						if (tw > depthBuffer[ind]) {
							newImageData[ind] = colorData[(ty << 0) * imgWidth + (tx << 0)];

							depthBuffer[ind] = tw;
						}

						tx += txtw;
						ty += tytw;
						ind++;
					}
				} else {
					for (var k=startX; k<=endX; k++) {
						if (tw > depthBuffer[ind]) {
							newImageData[ind] = colorData[(ty/tw << 0) * imgWidth + (tx/tw << 0)];

							depthBuffer[ind] = tw;
						}

						tx += txStep3;
						ty += tyStep3;
						tw += twStep3;
						ind++;
					}
				}
			}

			startX += xStep1;
			startTx += txStep1;
			startTy += tyStep1;
			startTw += twStep1;
			endX += xStep2;
			endTx += txStep2;
			endTy += tyStep2;
			endTw += twStep2;
			j++;
		}
	}

	dy1 = vertex3[1] - vertex2[1] << 0;

	if (dy1 > 1) {
		if (flipped) {
			endX = vertex2[0];
			endTx = textureVertex2[0];
			endTy = textureVertex2[1];
			endTw = textureVertex2[2];
			xStep2 = ((dy1) ? (vertex3[0] - vertex2[0]) / dy1 : 0);
			txStep2 = ((dy1) ? (textureVertex3[0] - textureVertex2[0]) / dy1 : 0);
			tyStep2 = ((dy1) ? (textureVertex3[1] - textureVertex2[1]) / dy1 : 0);
			twStep2 = ((dy1) ? (textureVertex3[2] - textureVertex2[2]) / dy1 : 0);
		} else {
			startX = vertex2[0];
			startTx = textureVertex2[0];
			startTy = textureVertex2[1];
			startTw = textureVertex2[2];
			xStep1 = ((dy1) ? (vertex3[0] - vertex2[0]) / dy1 : 0);
			txStep1 = ((dy1) ? (textureVertex3[0] - textureVertex2[0]) / dy1 : 0);
			tyStep1 = ((dy1) ? (textureVertex3[1] - textureVertex2[1]) / dy1 : 0);
			twStep1 = ((dy1) ? (textureVertex3[2] - textureVertex2[2]) / dy1 : 0);
		}

		while (j<=vertex3[1]) {
			if (startX != endX) {
				let tStep = 1/(endX - startX);
				
				let txStep3 = tStep * (endTx - startTx) * imgWidth;
				let tyStep3 = tStep * (endTy - startTy) * imgHeight;
				let twStep3 = tStep * (endTw - startTw);

				let tx = startTx * imgWidth;
				let ty = startTy * imgHeight;
				let tw = startTw;
				let ind = j * canvasWidth + startX << 0;

				if (twStep3 == 0) {
					let txtw = txStep3/tw;
					let tytw = tyStep3/tw;
					ty /= tw;
					tx /= tw;
					for (var k=startX; k<=endX; k++) {
						if (tw > depthBuffer[ind]) {
							newImageData[ind] = colorData[(ty << 0) * imgWidth + (tx << 0)];

							depthBuffer[ind] = tw;
						}

						tx += txtw;
						ty += tytw;
						ind++;
					}
				} else {
					for (var k=startX; k<=endX; k++) {
						if (tw > depthBuffer[ind]) {
							newImageData[ind] = colorData[(ty/tw << 0) * imgWidth + (tx/tw << 0)];

							depthBuffer[ind] = tw;
						}

						tx += txStep3;
						ty += tyStep3;
						tw += twStep3;
						ind++;
					}
				}
			}

			startX += xStep1;
			startTx += txStep1;
			startTy += tyStep1;
			startTw += twStep1;
			endX += xStep2;
			endTx += txStep2;
			endTy += tyStep2;
			endTw += twStep2;
			j++;
		}
	}

	return newImageData;
}

function renderScreen(screen) {
	screen.checkForResize();

	let canvasWidth = screen.canvas.width;
	let canvasHeight = screen.canvas.height;
	let level = screen.level;

	let depthBuffer = new Float32Array(canvasWidth * canvasHeight);

	let imageData = screen.context.createImageData(canvasWidth, canvasHeight);
	let data = new Uint32Array(imageData.data.buffer);
	let color = (level.color['a'] << 24) | (level.color['b'] << 16) | (level.color['g'] << 8) | level.color['r'];
	data.fill(color);

	let facesToDraw = clipAndProjectBodies(level.bodies, canvasWidth, canvasHeight, screen.camera);
	for (var i=0; i<facesToDraw.length; i++) {
		let face = facesToDraw[i];

		textureTriangle(face, data, depthBuffer, canvasWidth, level.textures[face.texture]);
	}

	let context = screen.context;

	context.putImageData(imageData, 0, 0, 0, 0, canvasWidth, canvasHeight);
}