var KeyPathNode = require('../../key_path/KeyPathNode');
var ShapeRectangle = require('./ShapeRectangle');
var ShapeFill = require('./ShapeFill');
var ShapeStroke = require('./ShapeStroke');
var ShapeEllipse = require('./ShapeEllipse');
var ShapeGradientFill = require('./ShapeGradientFill');
var ShapeGradientStroke = require('./ShapeGradientStroke');
var ShapeTrimPaths = require('./ShapeTrimPaths');
var ShapeRepeater = require('./ShapeRepeater');
var ShapePolystar = require('./ShapePolystar');
var ShapeRoundCorners = require('./ShapeRoundCorners');
var Transform = require('../transform/Transform');

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
	   		} else if(shape.ty === 'el') {
	   			return ShapeEllipse(element.it[index])
	   		} else if(shape.ty === 'fl') {
	   			return ShapeFill(element.it[index])
	   		} else if(shape.ty === 'st') {
	   			return ShapeStroke(element.it[index])
	   		} else if(shape.ty === 'gf') {
	   			return ShapeGradientFill(element.it[index])
	   		} else if(shape.ty === 'gs') {
	   			return ShapeGradientStroke(element.it[index])
	   		} else if(shape.ty === 'tm') {
	   			return ShapeTrimPaths(element.it[index])
	   		} else if(shape.ty === 'rp') {
	   			return ShapeRepeater(element.it[index])
	   		} else if(shape.ty === 'sr') {
	   			return ShapePolystar(element.it[index])
	   		} else if(shape.ty === 'rd') {
	   			return ShapeRoundCorners(element.it[index])
	   		} else if(shape.ty === 'tr') {
	   			return Transform(element.it[index].transform.mProps)
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