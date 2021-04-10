function contains(list, item) {
	for (var i in list) {
		if (list[i] == item) {
			return i;
		}
	}

	return false;
}

function copyArray(arr) {
	let newArr = [];
	for (var i in arr) {
		newArr.push(arr[i]);
	}

	return newArr;
}