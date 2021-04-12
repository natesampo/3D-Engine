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

	copy() {
		let newCoords = copyArray(this.coordinates);
		let newTextureCoords = copyArray(this.textureCoordinates);

		return new Vertex(newCoords, newTextureCoords);
	}
}

class Face {
	constructor(color, vertices, lightLevel) {
		this.color = color;
		this.vertices = vertices;
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

		return new Face(this.color, copyVertices, this.lightLevel);
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
	constructor(color, bodies) {
		this.color = color;
		this.bodies = bodies;
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

		return new Level(this.color, copyBodies);
	}
}


function applyTransformationMatrix(vector, matrix) {
	let newVector = [0, 0, 0, 0];
	newVector[0] = vector[0] * matrix[0][0] + vector[1] * matrix[1][0] + vector[2] * matrix[2][0] + vector[3] * matrix[3][0];
	newVector[1] = vector[0] * matrix[0][1] + vector[1] * matrix[1][1] + vector[2] * matrix[2][1] + vector[3] * matrix[3][1];
	newVector[2] = vector[0] * matrix[0][2] + vector[1] * matrix[1][2] + vector[2] * matrix[2][2] + vector[3] * matrix[3][2];
	newVector[3] = vector[0] * matrix[0][3] + vector[1] * matrix[1][3] + vector[2] * matrix[2][3] + vector[3] * matrix[3][3];

	vector[0] = newVector[0];
	vector[1] = newVector[1];
	vector[2] = newVector[2];
	vector[3] = newVector[3];

	return vector;
}

// ONLY WORKS FOR THIS SPECIFIC CASE
function getInverseMatrix(matrix) {
	return [
		[matrix[0][0], matrix[1][0], matrix[2][0], 0],
		[matrix[0][1], matrix[1][1], matrix[2][1], 0],
		[matrix[0][2], matrix[1][2], matrix[2][2], 0],
		[-(matrix[3][0] * matrix[0][0] + matrix[3][1] * matrix[1][0] + matrix[3][2] * matrix[2][0]),
			-(matrix[3][0] * matrix[0][1] + matrix[3][1] * matrix[1][1] + matrix[3][2] * matrix[2][1]), 
			-(matrix[3][0] * matrix[0][2] + matrix[3][1] * matrix[1][2] + matrix[3][2] * matrix[2][2]), 1]];
}

function getRotationMatrix(vector) {
	let newAngleX = degToRad(vector[0]);
	let newAngleY = degToRad(vector[1]);
	let newAngleZ = degToRad(vector[2]);
	return [
		[Math.cos(newAngleY)*Math.cos(newAngleZ),
			-Math.cos(newAngleX)*Math.sin(newAngleZ) + Math.sin(newAngleX)*Math.sin(newAngleY)*Math.cos(newAngleZ),
			Math.sin(newAngleX)*Math.sin(newAngleZ) + Math.cos(newAngleX)*Math.sin(newAngleY)*Math.cos(newAngleZ),
			0],
		[Math.cos(newAngleY)*Math.sin(newAngleZ),
			Math.cos(newAngleX)*Math.cos(newAngleZ) + Math.sin(newAngleX)*Math.sin(newAngleY)*Math.sin(newAngleZ),
			-Math.sin(newAngleX)*Math.cos(newAngleZ) + Math.cos(newAngleX)*Math.sin(newAngleY)*Math.sin(newAngleZ),
			0],
		[-Math.sin(newAngleY),
			Math.sin(newAngleX)*Math.cos(newAngleY),
			Math.cos(newAngleX)*Math.cos(newAngleY),
			0],
		[0, 0, 0, 1]];
}

function getPointAtMatrix(camera) {
	let up = [0, 1, 0, 0];

	let newForward = camera.look;
	let newUp = vectorNormalize(vectorSubtract(vectorScale(copyArray(newForward), vectorDotProduct(up, newForward)), up));
	let newRight = vectorCrossProduct(newUp, newForward);

	return getInverseMatrix([
		[newRight[0], newRight[1], newRight[2], 0],
		[newUp[0], newUp[1], newUp[2], 0],
		[newForward[0], newForward[1], newForward[2], 0],
		[camera.position[0], camera.position[1], camera.position[2], 1]]);
}

function getProjectionMatrix(camera) {
	let newFov = 1/Math.tan(degToRad(camera['fov']/2));

	return [
		[camera['aspectRatio'] * newFov, 0, 0, 0],
		[0, newFov, 0, 0],
		[0, 0, camera['zfar'] / (camera['zfar'] - camera['znear']), 1],
		[0, 0, (-camera['zfar'] * camera['znear']) / (camera['zfar'] - camera['znear']), 0]];
}

function pointToPlaneDistance(point, planePoint, planeNormal) {
	return vectorDotProduct(point, planeNormal) - vectorDotProduct(planeNormal, planePoint);
}

function vectorIntersectPlanePortion(planePoint, planeNormal, lineStart, lineEnd) {
	let planeDot = vectorDotProduct(planeNormal, planePoint);
	let ad = vectorDotProduct(lineStart, planeNormal);
	let bd = vectorDotProduct(lineEnd, planeNormal);
	return (planeDot - ad)/(bd - ad);
}

function getPointAtPortionOfLine(lineStart, lineEnd, portion) {
	return vectorAdd(copyArray(lineStart), vectorScale(vectorSubtract(copyArray(lineEnd), lineStart), portion));
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

	switch(insidePoints.length) {
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

			let newFace = new Face(face.color, [newVertex.copy(), insidePoints[0].copy()], face.lightLevel);
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
		}
		if (clippedTriangles[k].vertices[1].coordinates[3] != 0) {
			clippedTriangles[k].vertices[1].textureCoordinates[0] /= clippedTriangles[k].vertices[1].coordinates[3];
			clippedTriangles[k].vertices[1].textureCoordinates[1] /= clippedTriangles[k].vertices[1].coordinates[3];
			clippedTriangles[k].vertices[1].textureCoordinates[2] = 1/clippedTriangles[k].vertices[1].coordinates[3];
			vectorScale(clippedTriangles[k].vertices[1].coordinates, 1/clippedTriangles[k].vertices[1].coordinates[3]);
		}
		if (clippedTriangles[k].vertices[2].coordinates[3] != 0) {
			clippedTriangles[k].vertices[2].textureCoordinates[0] /= clippedTriangles[k].vertices[2].coordinates[3];
			clippedTriangles[k].vertices[2].textureCoordinates[1] /= clippedTriangles[k].vertices[2].coordinates[3];
			clippedTriangles[k].vertices[2].textureCoordinates[2] = 1/clippedTriangles[k].vertices[2].coordinates[3];
			vectorScale(clippedTriangles[k].vertices[2].coordinates, 1/clippedTriangles[k].vertices[2].coordinates[3]);
		}
		applyViewSpaceTranslation(clippedTriangles[k], canvasWidth, canvasHeight);
	}

	for (var k=0; k<4; k++) {
		for (var l=clippedTriangles.length-1; l>=0; l--) {
			let newTris = [];
			switch(k) {
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

function clipAndProjectLevelBodies(level, canvasWidth, canvasHeight, camera) {
	let facesToDraw = [];
	for (var i=0; i<level.bodies.length; i++) {
		let body = level.bodies[i];
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

function xyToImageDataIndex(x, y, width) {
	return y * width * 4 + x * 4;
}

function imageDataIndexToXY(index, width) {
	return [(index/4) % width, Math.floor((index/4) / width)];
}

function updatePixel(newImageData, imageDataIndex, textureDataIndex) {
	newImageData.data[imageDataIndex] = colors[textureDataIndex];
	newImageData.data[imageDataIndex+1] = colors[textureDataIndex+1];
	newImageData.data[imageDataIndex+2] = colors[textureDataIndex+2];
	newImageData.data[imageDataIndex+3] = colors[textureDataIndex+3];
}

function textureTriangle(face, newImageData, depthBuffer, canvasWidth, imgData) {
	sortTriangleVerticesByY(face);

	let vertex1 = face.vertices[0].coordinates;
	let vertex2 = face.vertices[1].coordinates;
	let vertex3 = face.vertices[2].coordinates;

	let textureVertex1 = face.vertices[0].textureCoordinates;
	let textureVertex2 = face.vertices[1].textureCoordinates;
	let textureVertex3 = face.vertices[2].textureCoordinates;

	let dy1 = vertex2[1] - vertex1[1];
	let dy2 = vertex3[1] - vertex1[1];

	let xStep1 = ((dy1) ? (vertex2[0] - vertex1[0]) / dy1 : 0);
	let xStep2 = ((dy2) ? (vertex3[0] - vertex1[0]) / dy2 : 0);

	let txStep1 = ((dy1) ? (textureVertex2[0] - textureVertex1[0]) / dy1 : 0);
	let tyStep1 = ((dy1) ? (textureVertex2[1] - textureVertex1[1]) / dy1 : 0);
	let twStep1 = ((dy1) ? (textureVertex2[2] - textureVertex1[2]) / dy1 : 0);

	let txStep2 = ((dy2) ? (textureVertex3[0] - textureVertex1[0]) / dy2 : 0);
	let tyStep2 = ((dy2) ? (textureVertex3[1] - textureVertex1[1]) / dy2 : 0);
	let twStep2 = ((dy2) ? (textureVertex3[2] - textureVertex1[2]) / dy2 : 0);

	if (dy1 > 1 && dy2 > 1) {
		for (var j=vertex1[1] << 0; j<=vertex2[1]; j++) {
			let stepsTaken1 = j - vertex1[1];

			let startX = vertex1[0] + stepsTaken1 * xStep1 << 0;
			let endX = vertex1[0] + stepsTaken1 * xStep2 << 0;

			let startTx = textureVertex1[0] + stepsTaken1 * txStep1;
			let startTy = textureVertex1[1] + stepsTaken1 * tyStep1;
			let startTw = textureVertex1[2] + stepsTaken1 * twStep1;
			let endTx = textureVertex1[0] + stepsTaken1 * txStep2;
			let endTy = textureVertex1[1] + stepsTaken1 * tyStep2;
			let endTw = textureVertex1[2] + stepsTaken1 * twStep2;

			if (startX > endX) {
				[startX, endX] = swap(startX, endX);
				[startTx, endTx] = swap(startTx, endTx);
				[startTy, endTy] = swap(startTy, endTy);
				[startTw, endTw] = swap(startTw, endTw);
			}

			let tStep = 1/(endX - startX);

			let txStep3 = tStep * (endTx - startTx) * img.width;
			let tyStep3 = tStep * (endTy - startTy) * img.height;
			let twStep3 = tStep * (endTw - startTw);

			let tx = startTx * img.width;
			let ty = startTy * img.height;
			let tw = startTw;

			for (var k=startX; k<=endX; k++) {
				let ind = j * canvasWidth + k;
				if (tw > depthBuffer[ind]) {
					newImageData[ind] = imgData[(ty/tw << 0) * img.width + (tx/tw << 0)];

					depthBuffer[ind] = tw;
				}

				tx += txStep3;
				ty += tyStep3;
				tw += twStep3;
			}
		}
	}

	dy1 = vertex3[1] - vertex2[1];

	xStep1 = ((dy1) ? (vertex3[0] - vertex2[0]) / dy1 : 0);

	txStep1 = ((dy1) ? (textureVertex3[0] - textureVertex2[0]) / dy1 : 0);
	tyStep1 = ((dy1) ? (textureVertex3[1] - textureVertex2[1]) / dy1 : 0);
	twStep1 = ((dy1) ? (textureVertex3[2] - textureVertex2[2]) / dy1 : 0);

	if (dy1 > 1 && dy2 > 1) {
		for (var j=vertex2[1] << 0; j<=vertex3[1]; j++) {
			let stepsTaken1 = j - vertex1[1];
			let stepsTaken2 = j - vertex2[1];

			let startX = vertex2[0] + stepsTaken2 * xStep1 << 0;
			let endX = vertex1[0] + stepsTaken1 * xStep2 << 0;

			let startTx = textureVertex2[0] + stepsTaken2 * txStep1;
			let startTy = textureVertex2[1] + stepsTaken2 * tyStep1;
			let startTw = textureVertex2[2] + stepsTaken2 * twStep1;
			let endTx = textureVertex1[0] + stepsTaken1 * txStep2;
			let endTy = textureVertex1[1] + stepsTaken1 * tyStep2;
			let endTw = textureVertex1[2] + stepsTaken1 * twStep2;

			if (startX > endX) {
				[startX, endX] = swap(startX, endX);
				[startTx, endTx] = swap(startTx, endTx);
				[startTy, endTy] = swap(startTy, endTy);
				[startTw, endTw] = swap(startTw, endTw);
			}

			let tStep = 1/(endX - startX);
			
			let txStep3 = tStep * (endTx - startTx) * img.width;
			let tyStep3 = tStep * (endTy - startTy) * img.height;
			let twStep3 = tStep * (endTw - startTw);

			let tx = startTx * img.width;
			let ty = startTy * img.height;
			let tw = startTw;

			for (var k=startX; k<=endX; k++) {
				let ind = j * canvasWidth + k;
				if (tw > depthBuffer[ind]) {
					newImageData[ind] = imgData[(ty/tw << 0) * img.width + (tx/tw << 0)];

					depthBuffer[ind] = tw;
				}

				tx += txStep3;
				ty += tyStep3;
				tw += twStep3;
			}
		}
	}

	return newImageData;
}

function renderLevel(level, context, imageData, canvasWidth, canvasHeight, camera) {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	let depthBuffer = new Uint8Array(canvasWidth*canvasHeight);

	context.fillStyle = level.getColor();
	context.fillRect(0, 0, canvasWidth, canvasHeight);

	let buf = new ArrayBuffer(imageData.data.length);
	let buf8 = new Uint8ClampedArray(buf);
	let data = new Uint32Array(buf);
	data.fill((level.color['a'] << 24) | (level.color['b'] << 16) | (level.color['g'] << 8) | level.color['r']);

	let data2 = new Uint32Array(colors.buffer);

	//let newImageData = context.getImageData(0, 0, canvasWidth, canvasHeight);

	let facesToDraw = clipAndProjectLevelBodies(level, canvasWidth, canvasHeight, camera);

	//facesToDraw.sort(function(elem1, elem2) {return elem2.getAverageZ() - elem1.getAverageZ();});
	for (var i=0; i<facesToDraw.length; i++) {
		let face = facesToDraw[i];

		/*context.fillStyle = 'rgba(' + (Math.round(face.color['r'] * face.lightLevel)).toString() + ', ' +
										(Math.round(face.color['g'] * face.lightLevel)).toString() + ', ' +
										(Math.round(face.color['b'] * face.lightLevel)).toString() + ', ' +
										face.color['a'].toString() + ')';
		context.strokeStyle = 'rgba(30, 30, 30, 1)';
		context.lineWidth = 4;
		context.beginPath();
		context.lineTo(face.vertices[0].coordinates[0], face.vertices[0].coordinates[1]);

		for (var j=0; j<face.vertices.length; j++) {
			let nextVertex = face.vertices[(j + 1) % face.vertices.length];

			context.lineTo(nextVertex.coordinates[0], nextVertex.coordinates[1]);
		}

		context.stroke();
		//context.fill();
		context.closePath();*/

		textureTriangle(face, data, depthBuffer, canvasWidth, data2);
	}

	imageData.data.set(buf8);

	context.putImageData(imageData, 0, 0);
	//context.drawImage(imageData, 0, 0);
}