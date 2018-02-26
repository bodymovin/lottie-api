var LayerBase = require('../LayerBase');
var ShapeContents = require('./ShapeContents');

function Shape(element, parent) {

	var state = {
		properties: [],
		parent: parent,
		element: element
	}
	var shapeContents = ShapeContents(element.data.shapes, element.itemsData, state);

	

	function _buildPropertyMap() {
		state.properties.push(
			{
				name: 'Contents',
				value: shapeContents
			}
		)
	}

	var methods = {
	}

	_buildPropertyMap();

	return Object.assign(state, LayerBase(state), methods);
}

module.exports = Shape;