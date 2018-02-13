var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeFill(element) {

	console.log(element)
	var state = {
		properties: _buildPropertyMap()
	}

	function setColor(value) {
		Property(element.c).setValue(value);
	}

	function setOpacity(value) {
		Property(element.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'color',
				value: {
					setValue: setColor
				}
			},
			{
				name: 'opacity',
				value: {
					setValue: setOpacity
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeFill;