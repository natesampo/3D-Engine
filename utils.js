function contains(list, item) {
	for(var i in list) {
		if(list[i] == item) {
			return i;
		}
	}

	return false;
}

function sort(list, lambda) {
	if(list.length < 2) {
		return list;
	}

	let i = 0;
	while(i+1 < list.length) {
		if(lambda(list[i], list[i+1])) {
			let tempElem = list[i];

			list[i] = list[i+1];
			list[i+1] = tempElem;
		}

		i += 1;
	}

	return list;
}