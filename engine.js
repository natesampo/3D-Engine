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

function vectorNormalize(vector) {
	let magnitude = getMagnitude(vector);

	if(magnitude == 0) {
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
	return [
		vector1[0] + vector2[0],
		vector1[1] + vector2[1],
		vector1[2] + vector2[2]];
}

function applyMatrixScale(matrix, scale) {
	for(var i in matrix) {
		for(var j in matrix[i]) {
			matrix[i][j] = matrix[i][j]*scale;
		}
	}
}

function applyTransformationMatrix(vector, matrix) {
	newX = vector[0] * matrix[0][0] + vector[1] * matrix[1][0] + vector[2] * matrix[2][0] + matrix[3][0];
	newY = vector[0] * matrix[0][1] + vector[1] * matrix[1][1] + vector[2] * matrix[2][1] + matrix[3][1];
	newZ = vector[0] * matrix[0][2] + vector[1] * matrix[1][2] + vector[2] * matrix[2][2] + matrix[3][2];
	let w = vector[0] * matrix[0][3] + vector[1] * matrix[1][3] + vector[2] * matrix[2][3] + matrix[3][3];

	if(w != 0) {
		newX = newX/w;
		newY = newY/w;
		newZ = newZ/w;
	}

	return [newX, newY, newZ];
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

class Vertex {
	constructor(x, y, z) {
		this.coordinates = [x, y, z];
	}

	translate(vector) {
		this.coordinates = applyTranslationVector(this.coordinates, vector);
	}

	transform(matrix) {
		this.coordinates = applyTransformationMatrix(this.coordinates, matrix);
	}

	rotate(vector, origin) {
		this.coordinates = vectorSubtract(this.coordinates, origin);
		this.coordinates = vectorAddition(origin, applyTransformationMatrix(this.coordinates, getRotationMatrix(vector)));
	}

	copy() {
		return new Vertex(this.coordinates[0], this.coordinates[1], this.coordinates[2]);
	}
}

class Face {
	constructor(color, vertices) {
		this.color = color;
		this.vertices = vertices;
	}

	translate(vector) {
		for(var i in this.vertices) {
			this.vertices[i].translate(vector);
		}
	}

	transform(matrix) {
		for(var i in this.vertices) {
			this.vertices[i].transform(matrix);
		}
	}

	rotate(vector, origin) {
		for(var i in this.vertices) {
			this.vertices[i].rotate(vector, origin);
		}
	}

	getExtremes() {
		let extremes = [[null, null], [null, null], [null, null]];
		for(var i in this.vertices) {
			for(var j in extremes) {
				if(!extremes[j][0] || extremes[j][0] > this.vertices[i][j]) {
					extremes[j][0] = this.vertices[i][j];
				}

				if(!extremes[j][1] || extremes[j][1] < this.vertices[i][j]) {
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
		for(var i in this.vertices) {
			total += this.vertices[i].z;
		}

		return total/this.vertices.length;
	}

	getColor(lighting) {
		let dp = vectorDotProduct(this.getNormal(), lighting);
		return 'rgba(' + (parseInt(Math.max(this.color['r']*(0.45 + 0.55*dp), this.color['r']/4))).toString() + ', ' +
			(parseInt(Math.max(this.color['g']*dp, this.color['g']/2))).toString() + ', ' +
			(parseInt(Math.max(this.color['b']*dp, this.color['b']/2))).toString() + ', ' +
			this.color['a'].toString() + ')';
	}

	copy() {
		let copyVertices = [];
		for(var i in this.vertices) {
			copyVertices.push(this.vertices[i].copy());
		}

		return new Face(this.color, copyVertices);
	}
}

class Body {
	constructor(faces) {
		this.faces = faces;
	}

	translate(vector) {
		for(var i in this.faces) {
			this.faces[i].translate(vector);
		}
	}

	transform(matrix) {
		for(var i in this.faces) {
			this.faces[i].transform(matrix);
		}
	}

	rotate(vector, origin) {
		for(var i in this.faces) {
			this.faces[i].rotate(vector, origin);
		}
	}

	// Look at the extremes and find the average of those
	getCenter() {
		let extremes = [[null, null], [null, null], [null, null]];
		for(var i in this.faces) {
			let faceExtremes = this.faces[i].getExtremes();
			for(var j in faceExtremes) {
				if(!extremes[j][0] || extremes[j][0] > faceExtremes[j][0]) {
					extremes[j][0] = faceExtremes[j][0];
				}

				if(!extremes[j][1] || extremes[j][1] < faceExtremes[j][1]) {
					extremes[j][1] = faceExtremes[j][1];
				}
			}
		}

		return [(extremes[0][0] + extremes[0][1])/2, (extremes[1][0] + extremes[1][1])/2, (extremes[2][0] + extremes[2][1])/2];
	}

	copy() {
		let copyFaces = [];
		for(var i in this.faces) {
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

	translate(vector, speed) {
		vector = vectorScale(vectorNormalize(vector), speed);
		this.position = applyTranslationVector(this.position, vector);
	}

	rotate(vector, speed, real) {
		vector = vectorScale(vectorNormalize(vector), speed);
		this.look = vectorNormalize(applyTransformationMatrix(this.look, getRotationMatrix(vector)));
	}
}

class Level {
	constructor(color, bodies) {
		this.color = color;
		this.bodies = bodies;
	}

	translate(vector) {
		for(var i in this.bodies) {
			this.bodies[i].translate(vector);
		}
	}

	transform(matrix) {
		for(var i in this.bodies) {
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
		for(var i in this.bodies) {
			copyBodies.push(this.bodies[i].copy());
		}

		return new Level(this.color, copyBodies);
	}
}

function renderLevel(level, context, canvasWidth, canvasHeight, camera) {
	context.fillStyle = level.getColor();
	context.fillRect(0, 0, canvasWidth, canvasHeight);

	let facesToDraw = [];
	for(var i in level.bodies) {
		let body = level.bodies[i];
		for(var j in body.faces) {
			let face = body.faces[j];
			let toCameraVector = vectorSubtract(face.vertices[0].coordinates, camera.position);

			if(vectorDotProduct(face.getNormal(), toCameraVector) < 0) {
				let toDraw = face.copy();
				toDraw.transform(getPointAtMatrix(camera));
				toDraw.transform(getProjectionMatrix(camera));

				facesToDraw.push(toDraw);
			}
		}
	}

	facesToDraw = sort(facesToDraw, function(elem1, elem2) {return elem1.getAverageZ() < elem2.getAverageZ();});
	
	for(var i in facesToDraw) {
		let face = facesToDraw[i];

		context.fillStyle = face.getColor(camera['lighting']);
		context.strokeStyle = 'rgba(30, 30, 30, 1)';
		context.lineWidth = 4;
		context.beginPath();
		context.lineTo((face.vertices[0].coordinates[0]+1)*(canvasWidth/2), (face.vertices[0].coordinates[1]+1)*(canvasHeight/2));

		for(var j=0; j<face.vertices.length; j++) {
			let nextVertex = face.vertices[(j+1)%face.vertices.length];

			context.lineTo((nextVertex.coordinates[0]+1)*(canvasWidth/2), (nextVertex.coordinates[1]+1)*(canvasHeight/2));
		}

		context.stroke();
		context.fill();
		context.closePath();
	}
}