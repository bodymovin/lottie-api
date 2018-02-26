var LayerBase = require('../LayerBase');

function NullElement(element, parent) {

	var instance = {};

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

	return Object.assign(instance, LayerBase(state), methods);
}

module.exports = NullElement;