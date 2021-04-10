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


// Vector functions
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

function vectorAdd(vector1, vector2) {
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
	for (var i=0; i<vector1.length; i++) {
		vector1[i] += vector2[i];
	}
}

function applyMatrixScale(matrix, scale) {
	for (var i=0; i<matrix.length; i++) {
		for (var j=0; j<matrix[i].length; j++) {
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

	for (var i=0; i<vector.length; i++) {
		vector[i] = newVector[i];
	}
}