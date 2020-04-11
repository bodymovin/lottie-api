var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeStroke(element, parent) {
	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Color',
				value: Property(element.c, parent)
			},
			{
				name: 'Stroke Width',
				value: Property(element.w, parent)
			},
			{
				name: 'Opacity',
				value: Property(element.o, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeStroke