var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var Transform = require('../transform/Transform');

function ShapeRepeater(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Copies',
				value: Property(element.c, parent)
			},
			{
				name: 'Offset',
				value: Property(element.o, parent)
			},
			{
				name: 'Transform',
				value: Transform(element.tr, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRepeater;