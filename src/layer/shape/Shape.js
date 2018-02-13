var LayerBase = require('../LayerBase');
var ShapeGroup = require('./ShapeGroup');

function Shape(element) {

	var instance = {};

	var state = {
		element: element,
		properties: _buildPropertyMap()
	}

	function buildShapeObject(shape, index) {
		var ob = {
			name: shape.nm
		}
		Object.defineProperty(ob, 'value', {
		   get() { 
	   		if(shape.ty === 'gr') {
	   			var group = ShapeGroup(element.itemsData[index], shape)
	   			return group
	   		}
		   }
		});
		return ob
	}

	function _buildPropertyMap() {
		var shapes = element.data.shapes.map(function(shape, index) {
			return buildShapeObject(shape, index)
		});
		return shapes
	}

	var methods = {
	}

	return Object.assign({}, LayerBase(state), methods);
}

module.exports = Shape;