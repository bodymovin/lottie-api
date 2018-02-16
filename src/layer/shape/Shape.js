var LayerBase = require('../LayerBase');
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

function Shape(element, shapesData, shapes) {

	var instance = {};

	var state = {
		properties: _buildPropertyMap(),
		element: element
	}

	function buildShapeObject(shape, index) {
		var ob = {
			name: shape.nm
		}
		Object.defineProperty(ob, 'value', {
		   get() { 
	   		if(shape.ty === 'gr') {
	   			return Shape(element, shapesData[index].it, shapes[index].it)
	   		} else if(shape.ty === 'rc') {
	   			return ShapeRectangle(shapes[index])
	   		} else if(shape.ty === 'el') {
	   			return ShapeEllipse(shapes[index])
	   		} else if(shape.ty === 'fl') {
	   			return ShapeFill(shapes[index])
	   		} else if(shape.ty === 'st') {
	   			return ShapeStroke(shapes[index])
	   		} else if(shape.ty === 'gf') {
	   			return ShapeGradientFill(shapes[index])
	   		} else if(shape.ty === 'gs') {
	   			return ShapeGradientStroke(shapes[index])
	   		} else if(shape.ty === 'tm') {
	   			return ShapeTrimPaths(shapes[index])
	   		} else if(shape.ty === 'rp') {
	   			return ShapeRepeater(shapes[index])
	   		} else if(shape.ty === 'sr') {
	   			return ShapePolystar(shapes[index])
	   		} else if(shape.ty === 'rd') {
	   			return ShapeRoundCorners(shapes[index])
	   		} else if(shape.ty === 'tr') {
	   			return Transform(shapes[index].transform.mProps)
	   		} else {
	   			console.log(shape.ty)
	   		}
		   }
		});
		return ob
	}

	function _buildPropertyMap() {
		var shapes = shapesData.map(function(shape, index) {
			return buildShapeObject(shape, index)
		});
		return shapes
	}

	var methods = {
	}

	return Object.assign({}, LayerBase(state), methods);
}

module.exports = Shape;