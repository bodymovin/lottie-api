var LayerBase = require('../LayerBase');

function Solid(element) {

	var instance = {};

	var state = {
		element: element,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'width',
				value: function() {
					
					return 100;
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(instance, LayerBase(state), methods);
}

module.exports = Solid;