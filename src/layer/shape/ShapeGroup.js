var KeyPathNode = require('../../key_path/KeyPathNode');
var ShapeRectangle = require('./ShapeRectangle');
var ShapeFill = require('./ShapeFill');
var ShapeStroke = require('./ShapeStroke');

function ShapeGroup(element, data) {

	var instance = {};

	var state = {
		element: element,
		data: data,
		properties: _buildPropertyMap()
	}

	function buildShapeObject(shape, index) {
		var ob = {
			name: shape.nm
		}
		Object.defineProperty(ob, 'value', {
		   get() { 
	   		if(shape.ty === 'rc') {
	   			return ShapeRectangle(element.it[index], shape)
	   		} else if(shape.ty === 'fl') {
	   			return ShapeFill(element.it[index], shape)
	   		} else if(shape.ty === 'st') {
	   			return ShapeStroke(element.it[index], shape)
	   		} else if(shape.ty === 'tr') {
	   			return ShapeStroke(element.it[index], shape)
	   		} else {
	   			console.log(shape.ty)
	   		}
		   }
		});
		return ob
	}

	function _buildPropertyMap() {
		var shapes = data.it.map(function(shape, index) {
			return buildShapeObject(shape, index)
		});
		return shapes
	}

	var methods = {
	}

	return Object.assign({}, KeyPathNode(state), methods);
}

module.exports = ShapeGroup;