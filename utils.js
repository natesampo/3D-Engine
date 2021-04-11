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