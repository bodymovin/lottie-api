var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
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
var ShapePath = require('./ShapePath');
var Transform = require('../transform/Transform');
var Matrix = require('../../helpers/transformationMatrix');

function ShapeContents(shapesData, shapes, parent) {
	var state = {
		properties: _buildPropertyMap(),
		parent: parent
	}

	function buildShapeObject(shape, index) {
		var ob = {
			name: shape.nm
		}
		Object.defineProperty(ob, 'value', {
		   get() { 
	   		if(shape.ty === 'gr') {
	   			return ShapeContents(shapesData[index].it, shapes[index].it, state);
	   		} else if(shape.ty === 'rc') {
	   			return ShapeRectangle(shapes[index], state);
	   		} else if(shape.ty === 'el') {
	   			return ShapeEllipse(shapes[index], state);
	   		} else if(shape.ty === 'fl') {
	   			return ShapeFill(shapes[index], state);
	   		} else if(shape.ty === 'st') {
	   			return ShapeStroke(shapes[index], state);
	   		} else if(shape.ty === 'gf') {
	   			return ShapeGradientFill(shapes[index], state);
	   		} else if(shape.ty === 'gs') {
	   			return ShapeGradientStroke(shapes[index], state);
	   		} else if(shape.ty === 'tm') {
	   			return ShapeTrimPaths(shapes[index], state);
	   		} else if(shape.ty === 'rp') {
	   			return ShapeRepeater(shapes[index], state);
	   		} else if(shape.ty === 'sr') {
	   			return ShapePolystar(shapes[index], state);
	   		} else if(shape.ty === 'rd') {
	   			return ShapeRoundCorners(shapes[index], state);
	   		} else if(shape.ty === 'sh') {
	   			return ShapePath(shapes[index], state);
	   		} else if(shape.ty === 'tr') {
	   			return Transform(shapes[index].transform.mProps, state);
	   		} else {
	   			console.log(shape.ty);
	   		}
		   }
		});
		return ob
	}

	function _buildPropertyMap() {
		return shapesData.map(function(shape, index) {
			return buildShapeObject(shape, index)
		});
	}

	function fromKeypathLayerPoint(point) {
		if(state.hasProperty('Transform')) {
    		var toWorldMat = Matrix();
        	var transformMat = state.getProperty('Transform').getTargetTransform();
			transformMat.applyToMatrix(toWorldMat);
        	point = toWorldMat.applyToPointArray(point[0],point[1],point[2]||0);
		}
		return state.parent.fromKeypathLayerPoint(point);
	}

	function toKeypathLayerPoint(point) {
		point = state.parent.toKeypathLayerPoint(point);
		if(state.hasProperty('Transform')) {
    		var toWorldMat = Matrix();
        	var transformMat = state.getProperty('Transform').getTargetTransform();
			transformMat.applyToMatrix(toWorldMat);
        	point = toWorldMat.inversePoint(point);
		}
		return point;
	}

	var methods = {
		fromKeypathLayerPoint: fromKeypathLayerPoint,
		toKeypathLayerPoint: toKeypathLayerPoint
	}

	//state.properties = _buildPropertyMap();

	return Object.assign(state, KeyPathNode(state), methods)
}

module.exports = ShapeContents;