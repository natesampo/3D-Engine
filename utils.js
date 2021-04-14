function degToRad(degrees) {
	return (degrees * Math.PI/180);
}

function contains(list, item) {
	for (var i=0; i<list.length; i++) {
		if (list[i] == item) {
			return true;
		}
	}

	return false;
}

function copyArray(arr) {
	let newArr = [];
	for (var i=0; i<arr.length; i++) {
		newArr.push(arr[i]);
	}

	return newArr;
}

// Use: [var1, var2] = swap(var1, var2);
function swap(var1, var2) {
	return [var2, var1];
}


// Vector and matrix functions
function getMagnitude(vector) {
	return Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2]);
}

function vectorNegate(vector) {
	vector[0] = -vector[0];
	vector[1] = -vector[1];
	vector[2] = -vector[2];

	return vector;
}

function vectorScale(vector, scale) {
	vector[0] *= scale;
	vector[1] *= scale;
	vector[2] *= scale;

	return vector;
}

function vectorAdd(vector1, vector2) {
	vector1[0] += vector2[0];
	vector1[1] += vector2[1];
	vector1[2] += vector2[2];

	return vector1;
}

function vectorSubtract(vector1, vector2) {
	vector1[0] -= vector2[0];
	vector1[1] -= vector2[1];
	vector1[2] -= vector2[2];

	return vector1;
}

function vectorMultiply(vector1, vector2) {
	vector1[0] *= vector2[0];
	vector1[1] *= vector2[1];
	vector1[2] *= vector2[2];

	return vector1;
}

function vectorNormalize(vector) {
	let magnitude = getMagnitude(vector);

	if (magnitude == 0) {
		vector[0] = 0;
		vector[1] = 0;
		vector[2] = 0;

		return vector;
	}

	vector[0] /= magnitude;
	vector[1] /= magnitude;
	vector[2] /= magnitude;

	return vector;
}

function vectorDotProduct(vector1, vector2) {
	return vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2];
}

function vectorCrossProduct(vector1, vector2) {
	return [
		vector1[1] * vector2[2] - vector1[2] * vector2[1],
		vector1[2] * vector2[0] - vector1[0] * vector2[2],
		vector1[0] * vector2[1] - vector1[1] * vector2[0],
		0];
}

function applyMatrixScale(matrix, scale) {
	for (var i=0; i<matrix.length; i++) {
		for (var j=0; j<matrix[i].length; j++) {
			matrix[i][j] = matrix[i][j]*scale;
		}
	}

	return matrix;
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