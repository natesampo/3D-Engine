function degToRad(degrees) {
	return (degrees * Math.PI/180);
}

function vectorNegate(vector) {
	return [
		-vector[0],
		-vector[1],
		-vector[2]];
}

function copyVector(vector) {
	return [
		vector[0],
		vector[1],
		vector[2]];
}

function getMagnitude(vector) {
	return Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2]);
}

function vectorScale(vector, scale) {
	return [
		vector[0]*scale,
		vector[1]*scale,
		vector[2]*scale];
}

function vectorAddition(vector1, vector2) {
	return [
		vector1[0] + vector2[0],
		vector1[1] + vector2[1],
		vector1[2] + vector2[2]];
}

function vectorSubtract(vector1, vector2) {
	return [
		vector1[0] - vector2[0],
		vector1[1] - vector2[1],
		vector1[2] - vector2[2]];
}

function vectorMultiply(vector1, vector2) {
	return [
		vector1[0] * vector2[0],
		vector1[1] * vector2[1],
		vector1[2] * vector2[2]];
}

function vectorNormalize(vector) {
	let magnitude = getMagnitude(vector);

	if (magnitude == 0) {
		return [0, 0, 0];
	}

	return [
		vector[0]/magnitude,
		vector[1]/magnitude,
		vector[2]/magnitude];
}

function vectorDotProduct(vector1, vector2) {
	return vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2];
}

function vectorCrossProduct(vector1, vector2) {
	return [
		vector1[1] * vector2[2] - vector1[2] * vector2[1],
		vector1[2] * vector2[0] - vector1[0] * vector2[2],
		vector1[0] * vector2[1] - vector1[1] * vector2[0]];
}

function applyTranslationVector(vector1, vector2) {
	for (var i in vector1) {
		vector1[i] += vector2[i];
	}
}

function applyMatrixScale(matrix, scale) {
	for (var i in matrix) {
		for (var j in matrix[i]) {
			matrix[i][j] = matrix[i][j]*scale;
		}
	}
}

function applyTransformationMatrix(vector, matrix) {
	let newVector = [0, 0, 0];
	newVector[0] = vector[0] * matrix[0][0] + vector[1] * matrix[1][0] + vector[2] * matrix[2][0] + matrix[3][0];
	newVector[1] = vector[0] * matrix[0][1] + vector[1] * matrix[1][1] + vector[2] * matrix[2][1] + matrix[3][1];
	newVector[2] = vector[0] * matrix[0][2] + vector[1] * matrix[1][2] + vector[2] * matrix[2][2] + matrix[3][2];
	let w = vector[0] * matrix[0][3] + vector[1] * matrix[1][3] + vector[2] * matrix[2][3] + matrix[3][3];

	if (w != 0) {
		newVector[0] /= w;
		newVector[1] /= w;
		newVector[2] /= w;
	}

	for (var i in vector) {
		vector[i] = newVector[i];
	}
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
	let up = [0, 1, 0];

	let newForward = camera.look;
	let newUp = vectorNormalize(vectorSubtract(vectorScale(newForward, vectorDotProduct(up, newForward)), up));
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

function applyViewSpaceTranslation(face, canvasWidth, canvasHeight) {
	for (var i=0; i<face.vertices.length; i++) {
		face.vertices[i].translate([1, 1, 0]);
		face.vertices[i].multiply([canvasWidth/2, canvasHeight/2, 1]);
	}
}

function pointToPlaneDistance(point, planePoint, planeNormal) {
	return vectorDotProduct(point, planeNormal) - vectorDotProduct(planeNormal, planePoint);
}

function vectorIntersectPlane(planePoint, planeNormal, lineStart, lineEnd, debug) {
	let planeDot = vectorDotProduct(planeNormal, planePoint);
	let ad = vectorDotProduct(lineStart, planeNormal);
	let bd = vectorDotProduct(lineEnd, planeNormal);
	let t = (planeDot - ad)/(bd - ad);
	let lineToIntersect = vectorScale(vectorSubtract(lineEnd, lineStart), t);
	return vectorAddition(lineStart, lineToIntersect);
}

function faceClipAgainstPlane(planePoint, planeNormal, face) {
	let normal = face.getNormal();
	planeNormal = vectorNormalize(planeNormal);

	let insidePoints = [];
	let outsidePoints = [];

	for (var i=face.vertices.length-1; i>=0; i--) {
		if (pointToPlaneDistance(face.vertices[i].coordinates, planePoint, planeNormal) >= 0) {
			insidePoints.push(face.vertices[i].coordinates);
		} else {
			outsidePoints.push(face.vertices[i].coordinates);
			face.vertices.splice(i, 1);
		}
	}

	switch(insidePoints.length) {
		case 0:
			return [];
			break
		case 1:
			for (var i=0; i<outsidePoints.length; i++) {
				face.vertices.push(new Vertex(vectorIntersectPlane(planePoint, planeNormal, insidePoints[0], outsidePoints[i])));
			}
			return [face];
			break;
		case 2:
			let newVertex = new Vertex(vectorIntersectPlane(planePoint, planeNormal, insidePoints[1], outsidePoints[0]));
			let newFace = new Face(face.color, [newVertex.copy(), new Vertex(copyArray(insidePoints[0]))], face.drawColor);
			face.vertices.push(newVertex);
			newFace.vertices.push(new Vertex(vectorIntersectPlane(planePoint, planeNormal, insidePoints[0], outsidePoints[0])));
			return [face, newFace];
			break;
		case 3:
			return [face];
	}
}

class Vertex {
	constructor(coordinates) {
		this.coordinates = coordinates;
	}

	translate(vector) {
		applyTranslationVector(this.coordinates, vector);
	}

	transform(matrix) {
		applyTransformationMatrix(this.coordinates, matrix);
	}

	multiply(vector) {
		this.coordinates = vectorMultiply(this.coordinates, vector);
	}

	rotate(vector, origin) {
		this.coordinates = vectorSubtract(this.coordinates, origin);
		applyTransformationMatrix(this.coordinates, getRotationMatrix(vector));
		this.coordinates = vectorAddition(this.coordinates, origin);
	}

	copy() {
		let newCoords = [];
		for (var i in this.coordinates) {
			newCoords.push(this.coordinates[i]);
		}

		return new Vertex(newCoords);
	}
}

class Face {
	constructor(color, vertices, drawColor) {
		this.color = color;
		this.vertices = vertices;
		this.drawColor = drawColor;
	}

	translate(vector) {
		for (var i in this.vertices) {
			this.vertices[i].translate(vector);
		}
	}

	transform(matrix) {
		for (var i in this.vertices) {
			this.vertices[i].transform(matrix);
		}
	}

	rotate(vector, origin) {
		for (var i in this.vertices) {
			this.vertices[i].rotate(vector, origin);
		}
	}

	getExtremes() {
		let extremes = [[null, null], [null, null], [null, null]];
		for (var i in this.vertices) {
			for (var j in extremes) {
				if (!extremes[j][0] || extremes[j][0] > this.vertices[i][j]) {
					extremes[j][0] = this.vertices[i][j];
				}

				if (!extremes[j][1] || extremes[j][1] < this.vertices[i][j]) {
					extremes[j][1] = this.vertices[i][j];
				}
			}
		}

		return extremes;
	}

	getNormal() {
		let vector1 = vectorSubtract(this.vertices[1].coordinates, this.vertices[0].coordinates);
		let vector2 = vectorSubtract(this.vertices[2].coordinates, this.vertices[0].coordinates);
		let normal = vectorNormalize(vectorCrossProduct(vector1, vector2));

		return normal;
	}

	getAverageZ() {
		let total = 0;
		for (var i in this.vertices) {
			total += this.vertices[i].coordinates[2];
		}

		return total/this.vertices.length;
	}

	setColor(camera) {
		let dp = Math.max(0.1, vectorDotProduct(this.getNormal(), camera['lighting']));
		this.drawColor = 'rgba(' + (Math.round(this.color['r'] * dp)).toString() + ', ' +
			(Math.round(this.color['g'] * dp)).toString() + ', ' +
			(Math.round(this.color['b'] * dp)).toString() + ', ' +
			this.color['a'].toString() + ')';
	}

	copy() {
		let copyVertices = [];
		for (var i in this.vertices) {
			copyVertices.push(this.vertices[i].copy());
		}

		return new Face(this.color, copyVertices, this.drawColor);
	}
}

class Body {
	constructor(faces) {
		this.faces = faces;
	}

	translate(vector) {
		for (var i in this.faces) {
			this.faces[i].translate(vector);
		}
	}

	transform(matrix) {
		for (var i in this.faces) {
			this.faces[i].transform(matrix);
		}
	}

	rotate(vector, origin) {
		for (var i in this.faces) {
			this.faces[i].rotate(vector, origin);
		}
	}

	// Look at the extremes and find the average of those
	getCenter() {
		let extremes = [[null, null], [null, null], [null, null]];
		for (var i in this.faces) {
			let faceExtremes = this.faces[i].getExtremes();
			for (var j in faceExtremes) {
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
		for (var i in this.faces) {
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
		applyTranslationVector(this.position, vector);
	}

	rotate(vector) {
		applyTransformationMatrix(this.look, getRotationMatrix(vector));
		this.look = vectorNormalize(this.look);
	}
}

class Level {
	constructor(color, bodies) {
		this.color = color;
		this.bodies = bodies;
	}

	translate(vector) {
		for (var i in this.bodies) {
			this.bodies[i].translate(vector);
		}
	}

	transform(matrix) {
		for (var i in this.bodies) {
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
		for (var i in this.bodies) {
			copyBodies.push(this.bodies[i].copy());
		}

		return new Level(this.color, copyBodies);
	}
}

function renderLevel(level, context, canvasWidth, canvasHeight, camera) {
	context.fillStyle = level.getColor();
	context.fillRect(0, 0, canvasWidth, canvasHeight);

	let facesToDraw = [];
	for (var i in level.bodies) {
		let body = level.bodies[i];
		for (var j in body.faces) {
			let face = body.faces[j];
			let toCameraVector = vectorSubtract(face.vertices[0].coordinates, camera.position);

			if (vectorDotProduct(face.getNormal(), toCameraVector) < 0) {
				let toDraw = face.copy();
				toDraw.setColor(camera);
				toDraw.transform(getPointAtMatrix(camera));

				let clippedTriangles = faceClipAgainstPlane([0, 0, 0.1], [0, 0, 1], toDraw);
				for (var k in clippedTriangles) {
					clippedTriangles[k].transform(getProjectionMatrix(camera));
					applyViewSpaceTranslation(clippedTriangles[k], canvasWidth, canvasHeight);
				}

				for (var k=0; k<4; k++) {
					for (var l=clippedTriangles.length-1; l>=0; l--) {
						let newTris = [];
						switch(k) {
							case 0:
								newTris = faceClipAgainstPlane([0, 0, 0], [1, 0, 0], clippedTriangles[l]);
								break;
							case 1:
								newTris = faceClipAgainstPlane([canvasWidth, 0, 0], [-1, 0, 0], clippedTriangles[l]);
								break;
							case 2:
								newTris = faceClipAgainstPlane([0, 0, 0], [0, 1, 0], clippedTriangles[l]);
								break;
							case 3:
								newTris = faceClipAgainstPlane([0, canvasHeight, 0], [0, -1, 0], clippedTriangles[l]);
								break;
						}

						for (var m=0; m<newTris.length; m++) {
							clippedTriangles.push(newTris[m]);
						}
						clippedTriangles.splice(l, 1);
					}
				}

				for (var k=0; k<clippedTriangles.length; k++) {
					facesToDraw.push(clippedTriangles[k]);

					if (clippedTriangles[k].getNormal()[2] > 0) {
						let temp = clippedTriangles[k].vertices[2];
						clippedTriangles[k].vertices[2] = clippedTriangles[k].vertices[1];
						clippedTriangles[k].vertices[1] = temp;
					}
				}
			}
		}
	}

	facesToDraw.sort(function(elem1, elem2) {return elem2.getAverageZ() - elem1.getAverageZ();});
	
	for (var i in facesToDraw) {
		let face = facesToDraw[i];

		context.fillStyle = face.drawColor;
		context.strokeStyle = 'rgba(30, 30, 30, 1)';
		context.lineWidth = 4;
		context.beginPath();
		context.lineTo(face.vertices[0].coordinates[0], face.vertices[0].coordinates[1]);

		for (var j=0; j<face.vertices.length; j++) {
			let nextVertex = face.vertices[(j + 1) % face.vertices.length];

			context.lineTo(nextVertex.coordinates[0], nextVertex.coordinates[1]);
		}

		context.stroke();
		context.fill();
		context.closePath();
	}
}