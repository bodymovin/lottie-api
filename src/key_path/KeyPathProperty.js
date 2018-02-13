function KeyPathProperty(property, element) {

	function _totalKeyframes() {
		
	}
	function getKeyframes() {

	}

	var methods = {
		getKeyframes: getKeyframes
	}

	Object.defineProperty(methods, 'totalKeyframes', {
		get: _totalKeyframes
	});

	return methods;
}

module.exports = KeyPathNode;