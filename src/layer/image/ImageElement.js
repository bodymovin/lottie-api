var LayerBase = require('../LayerBase');

function Image(element) {

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
		]
	}
	
	var methods = {
	}

	return Object.assign({}, LayerBase(state), methods);
}

module.exports = Image;