function contains(list, item) {
	for (var i in list) {
		if (list[i] == item) {
			return i;
		}
	}

	return false;
}