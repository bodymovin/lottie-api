var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRoundCorners(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setRadius(value) {
		Property(element.rd).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Radius',
				value: {
					setValue: setRadius
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRoundCorners;