function LayerItem(element) {

	function getName() {
		return element.data.nm;
	}

	function getType() {
		return element.data.ty;
	}

	function getDuration() {
		return element.data.op - element.data.ip;
	}

	function getTargetElement() {
		return element;
	}

	var methods = {
		getName: getName,
		getType: getType,
		getDuration: getDuration,
		getTargetElement: getTargetElement
	}

	Object.defineProperty(methods, 'name', {
		get: getName,
		enumerable: true
	})

	return methods;
}

module.exports = LayerItem;