(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lottie_api = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Renderer = require('../renderer/Renderer');

function AnimationItemFactory(animation) {

	var state = {
		animation: animation,
		elements: animation.renderer._br || animation.renderer.elements
	}

	function getCurrentFrame() {
		return animation.currentFrame;
	}

	function getCurrentTime() {
		return animation.currentFrame / animation.frameRate;
	}

	function addValueCallback(properties, value) {
		var i, len = properties.length;
		for (i = 0; i < len; i += 1) {
			properties.getPropertyAtIndex(i).setValue(value);
		}
	}

	return Object.assign({
		getCurrentFrame: getCurrentFrame,
		getCurrentTime: getCurrentTime,
		addValueCallback: addValueCallback
	}, Renderer(state));
}

module.exports = AnimationItemFactory;
},{"../renderer/Renderer":33}],2:[function(require,module,exports){
module.exports = ',';
},{}],3:[function(require,module,exports){
module.exports = {
	 0: 0,
	 1: 1,
	 2: 2,
	 3: 3,
	 4: 4,
	 5: 5,
	 13: 13,
	'comp': 0,
	'composition': 0,
	'solid': 1,
	'image': 2,
	'null': 3,
	'shape': 4,
	'text': 5,
	'camera': 13
}
},{}],4:[function(require,module,exports){
module.exports = {
	LAYER_TRANSFORM: 'transform'
}
},{}],5:[function(require,module,exports){
var key_path_separator = require('../enums/key_path_separator')

module.exports = function(propertyPath) {
	var keyPathSplit = propertyPath.split(key_path_separator);
	var selector = keyPathSplit.shift();
	return {
		selector: selector,
		propertyPath: keyPathSplit.join(key_path_separator)
	}
}
},{"../enums/key_path_separator":2}],6:[function(require,module,exports){
var TextElement = require('../layer/text/Text');
var ShapeElement = require('../layer/shape/Shape');
var NullElement = require('../layer/null_element/NullElement');
var SolidElement = require('../layer/solid/SolidElement');
var ImageElement = require('../layer/image/ImageElement');
var CameraElement = require('../layer/camera/Camera');
var LayerBase = require('../layer/LayerBase');


module.exports = function getLayerApi(element) {
	var layerType = element.data.ty;
	var Composition = require('../layer/composition/Composition');
	switch(layerType) {
		case 0:
		return Composition(element);
		case 1:
		return SolidElement(element);
		case 2:
		return ImageElement(element);
		case 3:
		return NullElement(element);
		case 4:
		return ShapeElement(element);
		case 5:
		return TextElement(element);
		case 13:
		return CameraElement(element);
		default:
		return LayerBase(element);
	}
}
},{"../layer/LayerBase":11,"../layer/camera/Camera":13,"../layer/composition/Composition":14,"../layer/image/ImageElement":15,"../layer/null_element/NullElement":16,"../layer/shape/Shape":17,"../layer/solid/SolidElement":29,"../layer/text/Text":30}],7:[function(require,module,exports){
function sanitizeString(string) {
	return string.trim();
}

module.exports = sanitizeString
},{}],8:[function(require,module,exports){
var AnimationItem = require('./animation/AnimationItem');

function createAnimationApi(anim) {
	return Object.assign({}, AnimationItem(anim));
}

module.exports = {
	createAnimationApi : createAnimationApi
}
},{"./animation/AnimationItem":1}],9:[function(require,module,exports){
var keyPathBuilder = require('../helpers/keyPathBuilder');
var layer_api = require('../helpers/layerAPIBuilder');
var sanitizeString = require('../helpers/stringSanitizer');
var layer_types = require('../enums/layer_types');

function KeyPathList(elements, node_type) {

	function _getLength() {
		return elements.length;
	}

	function _filterLayerByType(elements, type) {
		return elements.filter(function(element) {
			return element.data.ty === layer_types[type];
		});
	}

	function _filterLayerByName(elements, name) {
		return elements.filter(function(element) {
			return element.data.nm === name;
		});
	}

	function _filterLayerByProperty(elements, name) {
		return elements.filter(function(element) {
			var layerAPI = layer_api(element);
			if(layerAPI.hasProperty(name)) {
				return layerAPI.getProperty(name);
			}
			return false;
		});
	}

	function getLayersByType(selector) {
		return KeyPathList(_filterLayerByType(elements, selector), 'layer');
	}

	function getLayersByName(selector) {
		return KeyPathList(_filterLayerByName(elements, selector), 'layer');
	}

	function getPropertiesBySelector(selector) {
		return KeyPathList(elements.filter(function(element) {
			//console.log(element)
			return element.hasProperty(selector);
		}).map(function(element) {
			return element.getProperty(selector);
		}), 'property');
	}

	function getLayerProperty(selector) {
		var layers = _filterLayerByProperty(elements, selector);
		var properties = layers.map(function(element){
			return layer_api(element).getProperty(selector);
		})
		return KeyPathList(properties, 'property');
	}

	function getKeyPath(propertyPath) {
		var keyPathData = keyPathBuilder(propertyPath);
		var selector = sanitizeString(keyPathData.selector);
		var nodesByName, nodesByType, selectedNodes;
		if (node_type === 'renderer' || node_type === 'layer') {
			nodesByName = getLayersByName(selector);
			nodesByType = getLayersByType(selector);
			if (nodesByName.length === 0 && nodesByType.length === 0) {
				selectedNodes = getLayerProperty(selector);
			} else {
				selectedNodes = nodesByName.concat(nodesByType);
			}
			if (keyPathData.propertyPath) {
				return selectedNodes.getKeyPath(keyPathData.propertyPath);
			} else {
				return selectedNodes;
			}
		} else if(node_type === 'property') {
			selectedNodes = getPropertiesBySelector(selector);
			if (keyPathData.propertyPath) {
				return selectedNodes.getKeyPath(keyPathData.propertyPath);
			} else {
				return selectedNodes;
			}
		}
	}

	function concat(nodes) {
		var nodesElements = nodes.getElements();
		return KeyPathList(elements.concat(nodesElements), node_type);
	}

	function getElements() {
		return elements;
	}

	function getPropertyAtIndex(index) {
		return elements[index];
	}

	var methods = {
		getKeyPath: getKeyPath,
		concat: concat,
		getElements: getElements,
		getPropertyAtIndex: getPropertyAtIndex
	}

	Object.defineProperty(methods, 'length', {
		get: _getLength
	});

	return methods;
}

module.exports = KeyPathList;
},{"../enums/layer_types":3,"../helpers/keyPathBuilder":5,"../helpers/layerAPIBuilder":6,"../helpers/stringSanitizer":7}],10:[function(require,module,exports){
var key_path_separator = require('../enums/key_path_separator');
var property_names = require('../enums/property_names');

function KeyPathNode(state, node_type) {

	function getPropertyByPath(selector, propertyPath) {
		var instanceProperties = state.properties || [];
		var i = 0, len = instanceProperties.length;
		while(i < len) {
			if(instanceProperties[i].name === selector) {
				return instanceProperties[i].value;
			}
			i += 1;
		}
		return null;

	}

	function hasProperty(selector) {
		return !!getPropertyByPath(selector);
	}

	function getProperty(selector) {
		return getPropertyByPath(selector);
	}

	var methods = {
		hasProperty: hasProperty,
		getProperty: getProperty
	}

	return methods;
}

module.exports = KeyPathNode;
},{"../enums/key_path_separator":2,"../enums/property_names":4}],11:[function(require,module,exports){
var KeyPathNode = require('../key_path/KeyPathNode');
var Transform = require('./transform/Transform');

function LayerBase(state) {

	var transform = Transform(state.element.finalTransform.mProp);

	function _getTransform() {
		return transform;
	}

	state.properties.push({
		name: 'transform',
		value: transform
	},{
		name: 'Transform',
		value: transform
	})

	function getName() {
		return state.element.data.nm;
	}

	function getType() {
		return state.element.data.ty;
	}

	function getDuration() {
		return state.element.data.op - state.element.data.ip;
	}

	function getTargetElement() {
		return state.element;
	}

	var methods = {
		getName: getName,
		getType: getType,
		getDuration: getDuration,
		getTargetElement: getTargetElement
	}

	Object.defineProperty(methods, 'name', {
		get: getName,
		enumerable: true
	})

	Object.defineProperty(methods, 'transform', {
		get: _getTransform,
		enumerable: true
	})

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = LayerBase;
},{"../key_path/KeyPathNode":10,"./transform/Transform":31}],12:[function(require,module,exports){
var layer_types = require('../enums/layer_types');
var layer_api = require('../helpers/layerAPIBuilder');

function LayerList(elements) {

	function _getLength() {
		return elements.length;
	}

	function _filterLayerByType(elements, type) {
		return elements.filter(function(element) {
			return element.data.ty === layer_types[type];
		});
	}

	function _filterLayerByName(elements, name) {
		return elements.filter(function(element) {
			return element.data.nm === name;
		});
	}

	function getLayers() {
		 return LayerList(elements);
	}

	function getLayersByType(type) {
		var elementsList = _filterLayerByType(elements, type);
		return LayerList(elementsList);
	}

	function getLayersByName(type) {
		var elementsList = _filterLayerByName(elements, type);
		return LayerList(elementsList);
	}

	function layer(index) {
		if (index >= elements.length) {
			return [];
		}
		return layer_api(elements[parseInt(index)]);
	}

	function addIteratableMethods(iteratableMethods, list) {
		iteratableMethods.reduce(function(accumulator, value){
			var _value = value;
			accumulator[value] = function() {
				var _arguments = arguments;
				return elements.map(function(element){
					var layer = layer_api(element);
					if(layer[_value]) {
						return layer[_value].apply(null, _arguments);
					}
					return null;
				});
			}
			return accumulator;
		}, methods);
	}

	function getTargetElements() {
		return elements;
	}

	function concat(list) {
		return elements.concat(list.getTargetElements());
	}

	var methods = {
		getLayers: getLayers,
		getLayersByType: getLayersByType,
		getLayersByName: getLayersByName,
		layer: layer,
		concat: concat,
		getTargetElements: getTargetElements
	};

	addIteratableMethods(['setTranslate', 'getType', 'getDuration']);
	addIteratableMethods(['setText', 'getText', 'setDocumentData', 'canResizeFont', 'setMinimumFontSize']);

	Object.defineProperty(methods, 'length', {
		get: _getLength
	});
	return methods;
}

module.exports = LayerList;
},{"../enums/layer_types":3,"../helpers/layerAPIBuilder":6}],13:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Camera(element) {
	console.log('element: ', element)

	var instance = {};

	var state = {
		element: element,
		properties: _buildPropertyMap()
	}

	function setPointOfInterest(value) {
		Property(element.a).setValue(value);
	}

	function setZoom(value) {
		Property(element.pe).setValue(value);
	}

	function setPosition(value) {
		Property(element.p).setValue(value);
	}

	function setXRotation(value) {
		Property(element.rx).setValue(value);
	}

	function setYRotation(value) {
		Property(element.ry).setValue(value);
	}

	function setZRotation(value) {
		Property(element.rz).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Point of Interest',
				value: {
					setValue: setPointOfInterest
				}
			},
			{
				name: 'Zoom',
				value: {
					setValue: setZoom
				}
			},
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'X Rotation',
				value: {
					setValue: setXRotation
				}
			},
			{
				name: 'Y Rotation',
				value: {
					setValue: setYRotation
				}
			},
			{
				name: 'Z Rotation',
				value: {
					setValue: setZRotation
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(instance, KeyPathNode(state), methods);
}

module.exports = Camera;
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],14:[function(require,module,exports){
var KeyPathList = require('../../key_path/KeyPathList');
var LayerBase = require('../LayerBase');
var layer_api = require('../../helpers/layerAPIBuilder');
var Property = require('../../property/Property');

function Composition(element) {

	var instance = {};

	var state = {
		element: element,
		properties: _buildPropertyMap()
	}

	function setTimeRemap(value) {
		Property(element.tm).setValue(value);
	}

	
	function _buildPropertyMap() {
		var compositionLayers = element.layers.map(function(layer, index) {
			return {
				name: layer.nm,
				value: layer_api(element.elements[index])
			};
		})
		return [
			{
				name: 'Time Remap',
				value: {
					setValue: setTimeRemap
				}
			}
		].concat(compositionLayers)
	}

	var methods = {
	}

	return Object.assign(instance, LayerBase(state), KeyPathList(state.elements, 'layer'), methods);
}

module.exports = Composition;
},{"../../helpers/layerAPIBuilder":6,"../../key_path/KeyPathList":9,"../../property/Property":32,"../LayerBase":11}],15:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Image(element) {

	var methods = {
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = Image;
},{"../LayerBase":11}],16:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function NullElement() {

	var methods = {
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = NullElement;
},{"../LayerBase":11}],17:[function(require,module,exports){
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
},{"../LayerBase":11,"./ShapeGroup":22}],18:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeEllipse(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setSize(value) {
		Property(element.sh.s).setValue(value);
	}

	function setPosition(value) {
		Property(element.sh.p).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: {
					setValue: setSize
				}
			},
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeEllipse;
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],19:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],20:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientFill(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setStartPoint(value) {
		Property(element.s).setValue(value);
	}

	function setEndPoint(value) {
		Property(element.e).setValue(value);
	}

	function setOpacity(value) {
		Property(element.o).setValue(value);
	}

	function setHighlightLength(value) {
		Property(element.h).setValue(value);
	}

	function setHighlightAngle(value) {
		Property(element.a).setValue(value);
	}

	function setColors(value) {
		Property(element.g.prop).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: {
					setValue: setStartPoint
				}
			},
			{
				name: 'End Point',
				value: {
					setValue: setEndPoint
				}
			},
			{
				name: 'Opacity',
				value: {
					setValue: setOpacity
				}
			},
			{
				name: 'Highlight Length',
				value: {
					setValue: setHighlightLength
				}
			},
			{
				name: 'Highlight Angle',
				value: {
					setValue: setHighlightAngle
				}
			},
			{
				name: 'Colors',
				value: {
					setValue: setColors
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientFill;
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],21:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientStroke(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setStartPoint(value) {
		Property(element.s).setValue(value);
	}

	function setEndPoint(value) {
		Property(element.e).setValue(value);
	}

	function setOpacity(value) {
		Property(element.o).setValue(value);
	}

	function setHighlightLength(value) {
		Property(element.h).setValue(value);
	}

	function setHighlightAngle(value) {
		Property(element.a).setValue(value);
	}

	function setColors(value) {
		Property(element.g.prop).setValue(value);
	}

	function setStrokeWidth(value) {
		Property(element.w).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: {
					setValue: setStartPoint
				}
			},
			{
				name: 'End Point',
				value: {
					setValue: setEndPoint
				}
			},
			{
				name: 'Opacity',
				value: {
					setValue: setOpacity
				}
			},
			{
				name: 'Highlight Length',
				value: {
					setValue: setHighlightLength
				}
			},
			{
				name: 'Highlight Angle',
				value: {
					setValue: setHighlightAngle
				}
			},
			{
				name: 'Colors',
				value: {
					setValue: setColors
				}
			},
			{
				name: 'Stroke Width',
				value: {
					setValue: setStrokeWidth
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientStroke;
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],22:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":10,"../transform/Transform":31,"./ShapeEllipse":18,"./ShapeFill":19,"./ShapeGradientFill":20,"./ShapeGradientStroke":21,"./ShapePolystar":23,"./ShapeRectangle":24,"./ShapeRepeater":25,"./ShapeRoundCorners":26,"./ShapeStroke":27,"./ShapeTrimPaths":28}],23:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePolystar(element) {
	console.log(element);

	var state = {
		properties: _buildPropertyMap()
	}

	function setPoints(value) {
		Property(element.sh.pt).setValue(value);
	}

	function setPosition(value) {
		Property(element.sh.p).setValue(value);
	}

	function setRotation(value) {
		Property(element.sh.r).setValue(value);
	}

	function setInnerRadius(value) {
		Property(element.sh.ir).setValue(value);
	}

	function setOuterRadius(value) {
		Property(element.sh.or).setValue(value);
	}

	function setInnerRoundness(value) {
		Property(element.sh.is).setValue(value);
	}

	function setOuterRoundness(value) {
		Property(element.sh.os).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Points',
				value: {
					setValue: setPoints
				}
			},
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'Rotation',
				value: {
					setValue: setRotation
				}
			},
			{
				name: 'Inner Radius',
				value: {
					setValue: setInnerRadius
				}
			},
			{
				name: 'Outer Radius',
				value: {
					setValue: setOuterRadius
				}
			},
			{
				name: 'Inner Roundness',
				value: {
					setValue: setInnerRoundness
				}
			},
			{
				name: 'Outer Roundness',
				value: {
					setValue: setOuterRoundness
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePolystar;
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],24:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRectangle(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setSize(value) {
		Property(element.sh.s).setValue(value);
	}

	function setPosition(value) {
		Property(element.sh.p).setValue(value);
	}

	function setRoundness(value) {
		Property(element.sh.r).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: {
					setValue: setSize
				}
			},
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'Roundness',
				value: {
					setValue: setRoundness
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRectangle;
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],25:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var Transform = require('../transform/Transform');

function ShapeRepeater(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setCopies(value) {
		console.log('setCopies')
		Property(element.c).setValue(value);
	}

	function setOffset(value) {
		Property(element.o).setValue(value);
	}

	function setOffset(value) {
		Property(element.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Copies',
				value: {
					setValue: setCopies
				}
			},
			{
				name: 'Offset',
				value: {
					setValue: setOffset
				}
			},
			{
				name: 'Transform',
				value: Transform(element.tr)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRepeater;
},{"../../key_path/KeyPathNode":10,"../../property/Property":32,"../transform/Transform":31}],26:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],27:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeStroke(element) {
	var state = {
		properties: _buildPropertyMap()
	}

	function setColor(value) {
		Property(element.c).setValue(value);
	}

	function setOpacity(value) {
		Property(element.o).setValue(value);
	}

	function setStrokeWidth(value) {
		Property(element.w).setValue(value);
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
				name: 'stroke width',
				value: {
					setValue: setStrokeWidth
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

module.exports = ShapeStroke
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],28:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeTrimPaths(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setStart(value) {
		Property(element.s).setValue(value);
	}

	function setEnd(value) {
		Property(element.e).setValue(value);
	}

	function setOffset(value) {
		Property(element.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start',
				value: {
					setValue: setStart
				}
			},
			{
				name: 'End',
				value: {
					setValue: setEnd
				}
			},
			{
				name: 'Offset',
				value: {
					setValue: setOffset
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeTrimPaths;
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],29:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Solid(element) {

	var instance = {};

	var state = {
		element: element,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'width',
				value: function() {
					
					return 100;
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(instance, LayerBase(state), methods);
}

module.exports = Solid;
},{"../LayerBase":11}],30:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Text(element) {

	function getText() {
		return element.textProperty.currentData.t;
	}

	function setText(value, index) {
		setDocumentData({t: value}, index);
	}

	function setDocumentData(data, index) {
		return element.updateDocumentData(data, index);
	}
	
	function canResizeFont(_canResize) {
		return element.canResizeFont(_canResize);
	}

	function setMinimumFontSize(_fontSize) {
		return element.setMinimumFontSize(_fontSize);
	}

	var methods = {
		getText: getText,
		setText: setText,
		canResizeFont: canResizeFont,
		setDocumentData: setDocumentData,
		setMinimumFontSize: setMinimumFontSize
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = Text;
},{"../LayerBase":11}],31:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Transform(props) {
	var state = {
		properties: _buildPropertyMap()
	}

	function setAnchorPoint(value) {
		Property(props.a).setValue(value);
	}

	function setPosition(value) {
		Property(props.p).setValue(value);
	}

	function setScale(value) {
		Property(props.s).setValue(value);
	}

	function setRotation(value) {
		Property(props.r).setValue(value);
	}

	function setXRotation(value) {
		Property(props.rx).setValue(value);
	}

	function setYRotation(value) {
		Property(props.ry).setValue(value);
	}

	function setZRotation(value) {
		Property(props.rz).setValue(value);
	}

	function setXPosition(value) {
		Property(props.px).setValue(value);
	}

	function setYPosition(value) {
		Property(props.py).setValue(value);
	}

	function setZPosition(value) {
		Property(props.pz).setValue(value);
	}

	function setOpacity(value) {
		Property(props.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'Scale',
				value: {
					setValue: setScale
				}
			},
			{
				name: 'Rotation',
				value: {
					setValue: setRotation
				}
			},
			{
				name: 'X Position',
				value: {
					setValue: setXPosition
				}
			},
			{
				name: 'Y Position',
				value: {
					setValue: setYPosition
				}
			},
			{
				name: 'Z Position',
				value: {
					setValue: setZPosition
				}
			},
			{
				name: 'X Rotation',
				value: {
					setValue: setXRotation
				}
			},
			{
				name: 'Y Rotation',
				value: {
					setValue: setYRotation
				}
			},
			{
				name: 'Z Rotation',
				value: {
					setValue: setZRotation
				}
			},
			{
				name: 'Opacity',
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

module.exports = Transform;
},{"../../key_path/KeyPathNode":10,"../../property/Property":32}],32:[function(require,module,exports){
function Property(property) {
	
	function setValue(value) {
		if(!property || !property.addEffect) {
			return;
		}
		if (typeof value === 'function') {
			property.addEffect(value);
		} else if (property.propType === 'multidimensional' && typeof value === 'object' && value.length === 2) {
			property.addEffect(function(){return value});
		} else if (property.propType === 'unidimensional' && typeof value === 'number') {
			property.addEffect(function(){return value});
		}
	}

	var methods = {
		setValue: setValue
	}

	return Object.assign({}, methods);
}

module.exports = Property;
},{}],33:[function(require,module,exports){
var LayerList = require('../layer/LayerList');
var KeyPathList = require('../key_path/KeyPathList');

function Renderer(state) {

	state._type = 'renderer';

	function getRendererType() {
		return state.animation.animType;
	}

	return Object.assign({
		getRendererType: getRendererType
	}, LayerList(state.elements), KeyPathList(state.elements, 'renderer'));
}

module.exports = Renderer;
},{"../key_path/KeyPathList":9,"../layer/LayerList":12}]},{},[8])(8)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0uanMiLCJzcmMvZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yLmpzIiwic3JjL2VudW1zL2xheWVyX3R5cGVzLmpzIiwic3JjL2VudW1zL3Byb3BlcnR5X25hbWVzLmpzIiwic3JjL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9sYXllckFQSUJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9zdHJpbmdTYW5pdGl6ZXIuanMiLCJzcmMvaW5kZXguanMiLCJzcmMva2V5X3BhdGgvS2V5UGF0aExpc3QuanMiLCJzcmMva2V5X3BhdGgvS2V5UGF0aE5vZGUuanMiLCJzcmMvbGF5ZXIvTGF5ZXJCYXNlLmpzIiwic3JjL2xheWVyL0xheWVyTGlzdC5qcyIsInNyYy9sYXllci9jYW1lcmEvQ2FtZXJhLmpzIiwic3JjL2xheWVyL2NvbXBvc2l0aW9uL0NvbXBvc2l0aW9uLmpzIiwic3JjL2xheWVyL2ltYWdlL0ltYWdlRWxlbWVudC5qcyIsInNyYy9sYXllci9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGUuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVFbGxpcHNlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlRmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50RmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50U3Ryb2tlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlR3JvdXAuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVQb2x5c3Rhci5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVJlY3RhbmdsZS5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVJlcGVhdGVyLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUm91bmRDb3JuZXJzLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlU3Ryb2tlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlVHJpbVBhdGhzLmpzIiwic3JjL2xheWVyL3NvbGlkL1NvbGlkRWxlbWVudC5qcyIsInNyYy9sYXllci90ZXh0L1RleHQuanMiLCJzcmMvbGF5ZXIvdHJhbnNmb3JtL1RyYW5zZm9ybS5qcyIsInNyYy9wcm9wZXJ0eS9Qcm9wZXJ0eS5qcyIsInNyYy9yZW5kZXJlci9SZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVuZGVyZXIgPSByZXF1aXJlKCcuLi9yZW5kZXJlci9SZW5kZXJlcicpO1xyXG5cclxuZnVuY3Rpb24gQW5pbWF0aW9uSXRlbUZhY3RvcnkoYW5pbWF0aW9uKSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uLFxyXG5cdFx0ZWxlbWVudHM6IGFuaW1hdGlvbi5yZW5kZXJlci5fYnIgfHwgYW5pbWF0aW9uLnJlbmRlcmVyLmVsZW1lbnRzXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRDdXJyZW50RnJhbWUoKSB7XHJcblx0XHRyZXR1cm4gYW5pbWF0aW9uLmN1cnJlbnRGcmFtZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCkge1xyXG5cdFx0cmV0dXJuIGFuaW1hdGlvbi5jdXJyZW50RnJhbWUgLyBhbmltYXRpb24uZnJhbWVSYXRlO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkVmFsdWVDYWxsYmFjayhwcm9wZXJ0aWVzLCB2YWx1ZSkge1xyXG5cdFx0dmFyIGksIGxlbiA9IHByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdHByb3BlcnRpZXMuZ2V0UHJvcGVydHlBdEluZGV4KGkpLnNldFZhbHVlKHZhbHVlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHtcclxuXHRcdGdldEN1cnJlbnRGcmFtZTogZ2V0Q3VycmVudEZyYW1lLFxyXG5cdFx0Z2V0Q3VycmVudFRpbWU6IGdldEN1cnJlbnRUaW1lLFxyXG5cdFx0YWRkVmFsdWVDYWxsYmFjazogYWRkVmFsdWVDYWxsYmFja1xyXG5cdH0sIFJlbmRlcmVyKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uSXRlbUZhY3Rvcnk7IiwibW9kdWxlLmV4cG9ydHMgPSAnLCc7IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0IDA6IDAsXHJcblx0IDE6IDEsXHJcblx0IDI6IDIsXHJcblx0IDM6IDMsXHJcblx0IDQ6IDQsXHJcblx0IDU6IDUsXHJcblx0IDEzOiAxMyxcclxuXHQnY29tcCc6IDAsXHJcblx0J2NvbXBvc2l0aW9uJzogMCxcclxuXHQnc29saWQnOiAxLFxyXG5cdCdpbWFnZSc6IDIsXHJcblx0J251bGwnOiAzLFxyXG5cdCdzaGFwZSc6IDQsXHJcblx0J3RleHQnOiA1LFxyXG5cdCdjYW1lcmEnOiAxM1xyXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0TEFZRVJfVFJBTlNGT1JNOiAndHJhbnNmb3JtJ1xyXG59IiwidmFyIGtleV9wYXRoX3NlcGFyYXRvciA9IHJlcXVpcmUoJy4uL2VudW1zL2tleV9wYXRoX3NlcGFyYXRvcicpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHByb3BlcnR5UGF0aCkge1xyXG5cdHZhciBrZXlQYXRoU3BsaXQgPSBwcm9wZXJ0eVBhdGguc3BsaXQoa2V5X3BhdGhfc2VwYXJhdG9yKTtcclxuXHR2YXIgc2VsZWN0b3IgPSBrZXlQYXRoU3BsaXQuc2hpZnQoKTtcclxuXHRyZXR1cm4ge1xyXG5cdFx0c2VsZWN0b3I6IHNlbGVjdG9yLFxyXG5cdFx0cHJvcGVydHlQYXRoOiBrZXlQYXRoU3BsaXQuam9pbihrZXlfcGF0aF9zZXBhcmF0b3IpXHJcblx0fVxyXG59IiwidmFyIFRleHRFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvdGV4dC9UZXh0Jyk7XHJcbnZhciBTaGFwZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9zaGFwZS9TaGFwZScpO1xyXG52YXIgTnVsbEVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQnKTtcclxudmFyIFNvbGlkRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL3NvbGlkL1NvbGlkRWxlbWVudCcpO1xyXG52YXIgSW1hZ2VFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvaW1hZ2UvSW1hZ2VFbGVtZW50Jyk7XHJcbnZhciBDYW1lcmFFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvY2FtZXJhL0NhbWVyYScpO1xyXG52YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJCYXNlJyk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRMYXllckFwaShlbGVtZW50KSB7XHJcblx0dmFyIGxheWVyVHlwZSA9IGVsZW1lbnQuZGF0YS50eTtcclxuXHR2YXIgQ29tcG9zaXRpb24gPSByZXF1aXJlKCcuLi9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbicpO1xyXG5cdHN3aXRjaChsYXllclR5cGUpIHtcclxuXHRcdGNhc2UgMDpcclxuXHRcdHJldHVybiBDb21wb3NpdGlvbihlbGVtZW50KTtcclxuXHRcdGNhc2UgMTpcclxuXHRcdHJldHVybiBTb2xpZEVsZW1lbnQoZWxlbWVudCk7XHJcblx0XHRjYXNlIDI6XHJcblx0XHRyZXR1cm4gSW1hZ2VFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSAzOlxyXG5cdFx0cmV0dXJuIE51bGxFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSA0OlxyXG5cdFx0cmV0dXJuIFNoYXBlRWxlbWVudChlbGVtZW50KTtcclxuXHRcdGNhc2UgNTpcclxuXHRcdHJldHVybiBUZXh0RWxlbWVudChlbGVtZW50KTtcclxuXHRcdGNhc2UgMTM6XHJcblx0XHRyZXR1cm4gQ2FtZXJhRWxlbWVudChlbGVtZW50KTtcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRyZXR1cm4gTGF5ZXJCYXNlKGVsZW1lbnQpO1xyXG5cdH1cclxufSIsImZ1bmN0aW9uIHNhbml0aXplU3RyaW5nKHN0cmluZykge1xyXG5cdHJldHVybiBzdHJpbmcudHJpbSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbml0aXplU3RyaW5nIiwidmFyIEFuaW1hdGlvbkl0ZW0gPSByZXF1aXJlKCcuL2FuaW1hdGlvbi9BbmltYXRpb25JdGVtJyk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVBbmltYXRpb25BcGkoYW5pbSkge1xyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBBbmltYXRpb25JdGVtKGFuaW0pKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Y3JlYXRlQW5pbWF0aW9uQXBpIDogY3JlYXRlQW5pbWF0aW9uQXBpXHJcbn0iLCJ2YXIga2V5UGF0aEJ1aWxkZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2tleVBhdGhCdWlsZGVyJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG52YXIgc2FuaXRpemVTdHJpbmcgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3N0cmluZ1Nhbml0aXplcicpO1xyXG52YXIgbGF5ZXJfdHlwZXMgPSByZXF1aXJlKCcuLi9lbnVtcy9sYXllcl90eXBlcycpO1xyXG5cclxuZnVuY3Rpb24gS2V5UGF0aExpc3QoZWxlbWVudHMsIG5vZGVfdHlwZSkge1xyXG5cclxuXHRmdW5jdGlvbiBfZ2V0TGVuZ3RoKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmxlbmd0aDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgdHlwZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEudHkgPT09IGxheWVyX3R5cGVzW3R5cGVdO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIG5hbWUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLm5tID09PSBuYW1lO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVByb3BlcnR5KGVsZW1lbnRzLCBuYW1lKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0dmFyIGxheWVyQVBJID0gbGF5ZXJfYXBpKGVsZW1lbnQpO1xyXG5cdFx0XHRpZihsYXllckFQSS5oYXNQcm9wZXJ0eShuYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiBsYXllckFQSS5nZXRQcm9wZXJ0eShuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5VHlwZShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgc2VsZWN0b3IpLCAnbGF5ZXInKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5TmFtZShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgc2VsZWN0b3IpLCAnbGF5ZXInKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnRpZXNCeVNlbGVjdG9yKHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5oYXNQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHR9KS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHR9KSwgJ3Byb3BlcnR5Jyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllclByb3BlcnR5KHNlbGVjdG9yKSB7XHJcblx0XHR2YXIgbGF5ZXJzID0gX2ZpbHRlckxheWVyQnlQcm9wZXJ0eShlbGVtZW50cywgc2VsZWN0b3IpO1xyXG5cdFx0dmFyIHByb3BlcnRpZXMgPSBsYXllcnMubWFwKGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0XHRyZXR1cm4gbGF5ZXJfYXBpKGVsZW1lbnQpLmdldFByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QocHJvcGVydGllcywgJ3Byb3BlcnR5Jyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRLZXlQYXRoKHByb3BlcnR5UGF0aCkge1xyXG5cdFx0dmFyIGtleVBhdGhEYXRhID0ga2V5UGF0aEJ1aWxkZXIocHJvcGVydHlQYXRoKTtcclxuXHRcdHZhciBzZWxlY3RvciA9IHNhbml0aXplU3RyaW5nKGtleVBhdGhEYXRhLnNlbGVjdG9yKTtcclxuXHRcdHZhciBub2Rlc0J5TmFtZSwgbm9kZXNCeVR5cGUsIHNlbGVjdGVkTm9kZXM7XHJcblx0XHRpZiAobm9kZV90eXBlID09PSAncmVuZGVyZXInIHx8IG5vZGVfdHlwZSA9PT0gJ2xheWVyJykge1xyXG5cdFx0XHRub2Rlc0J5TmFtZSA9IGdldExheWVyc0J5TmFtZShzZWxlY3Rvcik7XHJcblx0XHRcdG5vZGVzQnlUeXBlID0gZ2V0TGF5ZXJzQnlUeXBlKHNlbGVjdG9yKTtcclxuXHRcdFx0aWYgKG5vZGVzQnlOYW1lLmxlbmd0aCA9PT0gMCAmJiBub2Rlc0J5VHlwZS5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRzZWxlY3RlZE5vZGVzID0gZ2V0TGF5ZXJQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZWN0ZWROb2RlcyA9IG5vZGVzQnlOYW1lLmNvbmNhdChub2Rlc0J5VHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGtleVBhdGhEYXRhLnByb3BlcnR5UGF0aCkge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzLmdldEtleVBhdGgoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2RlcztcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmKG5vZGVfdHlwZSA9PT0gJ3Byb3BlcnR5Jykge1xyXG5cdFx0XHRzZWxlY3RlZE5vZGVzID0gZ2V0UHJvcGVydGllc0J5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0XHRpZiAoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXMuZ2V0S2V5UGF0aChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25jYXQobm9kZXMpIHtcclxuXHRcdHZhciBub2Rlc0VsZW1lbnRzID0gbm9kZXMuZ2V0RWxlbWVudHMoKTtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChlbGVtZW50cy5jb25jYXQobm9kZXNFbGVtZW50cyksIG5vZGVfdHlwZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRFbGVtZW50cygpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5QXRJbmRleChpbmRleCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzW2luZGV4XTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0S2V5UGF0aDogZ2V0S2V5UGF0aCxcclxuXHRcdGNvbmNhdDogY29uY2F0LFxyXG5cdFx0Z2V0RWxlbWVudHM6IGdldEVsZW1lbnRzLFxyXG5cdFx0Z2V0UHJvcGVydHlBdEluZGV4OiBnZXRQcm9wZXJ0eUF0SW5kZXhcclxuXHR9XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbGVuZ3RoJywge1xyXG5cdFx0Z2V0OiBfZ2V0TGVuZ3RoXHJcblx0fSk7XHJcblxyXG5cdHJldHVybiBtZXRob2RzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleVBhdGhMaXN0OyIsInZhciBrZXlfcGF0aF9zZXBhcmF0b3IgPSByZXF1aXJlKCcuLi9lbnVtcy9rZXlfcGF0aF9zZXBhcmF0b3InKTtcclxudmFyIHByb3BlcnR5X25hbWVzID0gcmVxdWlyZSgnLi4vZW51bXMvcHJvcGVydHlfbmFtZXMnKTtcclxuXHJcbmZ1bmN0aW9uIEtleVBhdGhOb2RlKHN0YXRlLCBub2RlX3R5cGUpIHtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IsIHByb3BlcnR5UGF0aCkge1xyXG5cdFx0dmFyIGluc3RhbmNlUHJvcGVydGllcyA9IHN0YXRlLnByb3BlcnRpZXMgfHwgW107XHJcblx0XHR2YXIgaSA9IDAsIGxlbiA9IGluc3RhbmNlUHJvcGVydGllcy5sZW5ndGg7XHJcblx0XHR3aGlsZShpIDwgbGVuKSB7XHJcblx0XHRcdGlmKGluc3RhbmNlUHJvcGVydGllc1tpXS5uYW1lID09PSBzZWxlY3Rvcikge1xyXG5cdFx0XHRcdHJldHVybiBpbnN0YW5jZVByb3BlcnRpZXNbaV0udmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0aSArPSAxO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaGFzUHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiAhIWdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5KHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IpO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRoYXNQcm9wZXJ0eTogaGFzUHJvcGVydHksXHJcblx0XHRnZXRQcm9wZXJ0eTogZ2V0UHJvcGVydHlcclxuXHR9XHJcblxyXG5cdHJldHVybiBtZXRob2RzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleVBhdGhOb2RlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL3RyYW5zZm9ybS9UcmFuc2Zvcm0nKTtcclxuXHJcbmZ1bmN0aW9uIExheWVyQmFzZShzdGF0ZSkge1xyXG5cclxuXHR2YXIgdHJhbnNmb3JtID0gVHJhbnNmb3JtKHN0YXRlLmVsZW1lbnQuZmluYWxUcmFuc2Zvcm0ubVByb3ApO1xyXG5cclxuXHRmdW5jdGlvbiBfZ2V0VHJhbnNmb3JtKCkge1xyXG5cdFx0cmV0dXJuIHRyYW5zZm9ybTtcclxuXHR9XHJcblxyXG5cdHN0YXRlLnByb3BlcnRpZXMucHVzaCh7XHJcblx0XHRuYW1lOiAndHJhbnNmb3JtJyxcclxuXHRcdHZhbHVlOiB0cmFuc2Zvcm1cclxuXHR9LHtcclxuXHRcdG5hbWU6ICdUcmFuc2Zvcm0nLFxyXG5cdFx0dmFsdWU6IHRyYW5zZm9ybVxyXG5cdH0pXHJcblxyXG5cdGZ1bmN0aW9uIGdldE5hbWUoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudC5kYXRhLm5tO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VHlwZSgpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5lbGVtZW50LmRhdGEudHk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXREdXJhdGlvbigpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5lbGVtZW50LmRhdGEub3AgLSBzdGF0ZS5lbGVtZW50LmRhdGEuaXA7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRUYXJnZXRFbGVtZW50KCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLmVsZW1lbnQ7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldE5hbWU6IGdldE5hbWUsXHJcblx0XHRnZXRUeXBlOiBnZXRUeXBlLFxyXG5cdFx0Z2V0RHVyYXRpb246IGdldER1cmF0aW9uLFxyXG5cdFx0Z2V0VGFyZ2V0RWxlbWVudDogZ2V0VGFyZ2V0RWxlbWVudFxyXG5cdH1cclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1ldGhvZHMsICduYW1lJywge1xyXG5cdFx0Z2V0OiBnZXROYW1lLFxyXG5cdFx0ZW51bWVyYWJsZTogdHJ1ZVxyXG5cdH0pXHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAndHJhbnNmb3JtJywge1xyXG5cdFx0Z2V0OiBfZ2V0VHJhbnNmb3JtLFxyXG5cdFx0ZW51bWVyYWJsZTogdHJ1ZVxyXG5cdH0pXHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJCYXNlOyIsInZhciBsYXllcl90eXBlcyA9IHJlcXVpcmUoJy4uL2VudW1zL2xheWVyX3R5cGVzJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG5cclxuZnVuY3Rpb24gTGF5ZXJMaXN0KGVsZW1lbnRzKSB7XHJcblxyXG5cdGZ1bmN0aW9uIF9nZXRMZW5ndGgoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS50eSA9PT0gbGF5ZXJfdHlwZXNbdHlwZV07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgbmFtZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEubm0gPT09IG5hbWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVycygpIHtcclxuXHRcdCByZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5VHlwZSh0eXBlKSB7XHJcblx0XHR2YXIgZWxlbWVudHNMaXN0ID0gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKTtcclxuXHRcdHJldHVybiBMYXllckxpc3QoZWxlbWVudHNMaXN0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5TmFtZSh0eXBlKSB7XHJcblx0XHR2YXIgZWxlbWVudHNMaXN0ID0gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCB0eXBlKTtcclxuXHRcdHJldHVybiBMYXllckxpc3QoZWxlbWVudHNMaXN0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxheWVyKGluZGV4KSB7XHJcblx0XHRpZiAoaW5kZXggPj0gZWxlbWVudHMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiBbXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBsYXllcl9hcGkoZWxlbWVudHNbcGFyc2VJbnQoaW5kZXgpXSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRJdGVyYXRhYmxlTWV0aG9kcyhpdGVyYXRhYmxlTWV0aG9kcywgbGlzdCkge1xyXG5cdFx0aXRlcmF0YWJsZU1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSl7XHJcblx0XHRcdHZhciBfdmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0YWNjdW11bGF0b3JbdmFsdWVdID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XHJcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnRzLm1hcChmdW5jdGlvbihlbGVtZW50KXtcclxuXHRcdFx0XHRcdHZhciBsYXllciA9IGxheWVyX2FwaShlbGVtZW50KTtcclxuXHRcdFx0XHRcdGlmKGxheWVyW192YWx1ZV0pIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyW192YWx1ZV0uYXBwbHkobnVsbCwgX2FyZ3VtZW50cyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gYWNjdW11bGF0b3I7XHJcblx0XHR9LCBtZXRob2RzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRhcmdldEVsZW1lbnRzKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY29uY2F0KGxpc3QpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5jb25jYXQobGlzdC5nZXRUYXJnZXRFbGVtZW50cygpKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0TGF5ZXJzOiBnZXRMYXllcnMsXHJcblx0XHRnZXRMYXllcnNCeVR5cGU6IGdldExheWVyc0J5VHlwZSxcclxuXHRcdGdldExheWVyc0J5TmFtZTogZ2V0TGF5ZXJzQnlOYW1lLFxyXG5cdFx0bGF5ZXI6IGxheWVyLFxyXG5cdFx0Y29uY2F0OiBjb25jYXQsXHJcblx0XHRnZXRUYXJnZXRFbGVtZW50czogZ2V0VGFyZ2V0RWxlbWVudHNcclxuXHR9O1xyXG5cclxuXHRhZGRJdGVyYXRhYmxlTWV0aG9kcyhbJ3NldFRyYW5zbGF0ZScsICdnZXRUeXBlJywgJ2dldER1cmF0aW9uJ10pO1xyXG5cdGFkZEl0ZXJhdGFibGVNZXRob2RzKFsnc2V0VGV4dCcsICdnZXRUZXh0JywgJ3NldERvY3VtZW50RGF0YScsICdjYW5SZXNpemVGb250JywgJ3NldE1pbmltdW1Gb250U2l6ZSddKTtcclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1ldGhvZHMsICdsZW5ndGgnLCB7XHJcblx0XHRnZXQ6IF9nZXRMZW5ndGhcclxuXHR9KTtcclxuXHRyZXR1cm4gbWV0aG9kcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXllckxpc3Q7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIENhbWVyYShlbGVtZW50KSB7XHJcblx0Y29uc29sZS5sb2coJ2VsZW1lbnQ6ICcsIGVsZW1lbnQpXHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9pbnRPZkludGVyZXN0KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFpvb20odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucGUpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFhSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5yeCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WVJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnJ5KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRaUm90YXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucnopLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb2ludCBvZiBJbnRlcmVzdCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb2ludE9mSW50ZXJlc3RcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnWm9vbScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRab29tXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WFJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WVJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WlJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBLZXlQYXRoTm9kZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYTsiLCJ2YXIgS2V5UGF0aExpc3QgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTGlzdCcpO1xyXG52YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gQ29tcG9zaXRpb24oZWxlbWVudCkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFRpbWVSZW1hcCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC50bSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0XHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHR2YXIgY29tcG9zaXRpb25MYXllcnMgPSBlbGVtZW50LmxheWVycy5tYXAoZnVuY3Rpb24obGF5ZXIsIGluZGV4KSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bmFtZTogbGF5ZXIubm0sXHJcblx0XHRcdFx0dmFsdWU6IGxheWVyX2FwaShlbGVtZW50LmVsZW1lbnRzW2luZGV4XSlcclxuXHRcdFx0fTtcclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1RpbWUgUmVtYXAnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0VGltZVJlbWFwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdLmNvbmNhdChjb21wb3NpdGlvbkxheWVycylcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIExheWVyQmFzZShzdGF0ZSksIEtleVBhdGhMaXN0KHN0YXRlLmVsZW1lbnRzLCAnbGF5ZXInKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRpb247IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG5cclxuZnVuY3Rpb24gSW1hZ2UoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBMYXllckJhc2UoZWxlbWVudCksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIE51bGxFbGVtZW50KCkge1xyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBMYXllckJhc2UoZWxlbWVudCksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE51bGxFbGVtZW50OyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxudmFyIFNoYXBlR3JvdXAgPSByZXF1aXJlKCcuL1NoYXBlR3JvdXAnKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZFNoYXBlT2JqZWN0KHNoYXBlLCBpbmRleCkge1xyXG5cdFx0dmFyIG9iID0ge1xyXG5cdFx0XHRuYW1lOiBzaGFwZS5ubVxyXG5cdFx0fVxyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iLCAndmFsdWUnLCB7XHJcblx0XHQgICBnZXQoKSB7IFxyXG5cdCAgIFx0XHRpZihzaGFwZS50eSA9PT0gJ2dyJykge1xyXG5cdCAgIFx0XHRcdHZhciBncm91cCA9IFNoYXBlR3JvdXAoZWxlbWVudC5pdGVtc0RhdGFbaW5kZXhdLCBzaGFwZSlcclxuXHQgICBcdFx0XHRyZXR1cm4gZ3JvdXBcclxuXHQgICBcdFx0fVxyXG5cdFx0ICAgfVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb2JcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0dmFyIHNoYXBlcyA9IGVsZW1lbnQuZGF0YS5zaGFwZXMubWFwKGZ1bmN0aW9uKHNoYXBlLCBpbmRleCkge1xyXG5cdFx0XHRyZXR1cm4gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpXHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBzaGFwZXNcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUVsbGlwc2UoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTaXplKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLnMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLnApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTaXplJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFNpemVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UG9zaXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUVsbGlwc2U7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlRmlsbChlbGVtZW50KSB7XHJcblxyXG5cdGNvbnNvbGUubG9nKGVsZW1lbnQpXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Q29sb3IodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuYykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnY29sb3InLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Q29sb3JcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnb3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVGaWxsOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUdyYWRpZW50RmlsbChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0YXJ0UG9pbnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RW5kUG9pbnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuZSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRIaWdobGlnaHRMZW5ndGgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuaCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SGlnaGxpZ2h0QW5nbGUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuYSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Q29sb3JzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmcucHJvcCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1N0YXJ0IFBvaW50JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0YXJ0UG9pbnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnRW5kIFBvaW50JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEVuZFBvaW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgTGVuZ3RoJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEhpZ2hsaWdodExlbmd0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgQW5nbGUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0SGlnaGxpZ2h0QW5nbGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQ29sb3JzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldENvbG9yc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlR3JhZGllbnRGaWxsOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUdyYWRpZW50U3Ryb2tlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3RhcnRQb2ludCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRFbmRQb2ludCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5lKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEhpZ2hsaWdodExlbmd0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5oKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRIaWdobGlnaHRBbmdsZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5hKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRDb2xvcnModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuZy5wcm9wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VXaWR0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC53KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU3RhcnQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3RhcnRQb2ludFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdFbmQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RW5kUG9pbnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBMZW5ndGgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0SGlnaGxpZ2h0TGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBBbmdsZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRIaWdobGlnaHRBbmdsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdDb2xvcnMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Q29sb3JzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1N0cm9rZSBXaWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VXaWR0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlR3JhZGllbnRTdHJva2U7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFNoYXBlUmVjdGFuZ2xlID0gcmVxdWlyZSgnLi9TaGFwZVJlY3RhbmdsZScpO1xyXG52YXIgU2hhcGVGaWxsID0gcmVxdWlyZSgnLi9TaGFwZUZpbGwnKTtcclxudmFyIFNoYXBlU3Ryb2tlID0gcmVxdWlyZSgnLi9TaGFwZVN0cm9rZScpO1xyXG52YXIgU2hhcGVFbGxpcHNlID0gcmVxdWlyZSgnLi9TaGFwZUVsbGlwc2UnKTtcclxudmFyIFNoYXBlR3JhZGllbnRGaWxsID0gcmVxdWlyZSgnLi9TaGFwZUdyYWRpZW50RmlsbCcpO1xyXG52YXIgU2hhcGVHcmFkaWVudFN0cm9rZSA9IHJlcXVpcmUoJy4vU2hhcGVHcmFkaWVudFN0cm9rZScpO1xyXG52YXIgU2hhcGVUcmltUGF0aHMgPSByZXF1aXJlKCcuL1NoYXBlVHJpbVBhdGhzJyk7XHJcbnZhciBTaGFwZVJlcGVhdGVyID0gcmVxdWlyZSgnLi9TaGFwZVJlcGVhdGVyJyk7XHJcbnZhciBTaGFwZVBvbHlzdGFyID0gcmVxdWlyZSgnLi9TaGFwZVBvbHlzdGFyJyk7XHJcbnZhciBTaGFwZVJvdW5kQ29ybmVycyA9IHJlcXVpcmUoJy4vU2hhcGVSb3VuZENvcm5lcnMnKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybS9UcmFuc2Zvcm0nKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlR3JvdXAoZWxlbWVudCwgZGF0YSkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdGRhdGE6IGRhdGEsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZFNoYXBlT2JqZWN0KHNoYXBlLCBpbmRleCkge1xyXG5cdFx0dmFyIG9iID0ge1xyXG5cdFx0XHRuYW1lOiBzaGFwZS5ubVxyXG5cdFx0fVxyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iLCAndmFsdWUnLCB7XHJcblx0XHQgICBnZXQoKSB7IFxyXG5cdCAgIFx0XHRpZihzaGFwZS50eSA9PT0gJ3JjJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVJlY3RhbmdsZShlbGVtZW50Lml0W2luZGV4XSwgc2hhcGUpXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2VsJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZUVsbGlwc2UoZWxlbWVudC5pdFtpbmRleF0pXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2ZsJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZUZpbGwoZWxlbWVudC5pdFtpbmRleF0pXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3N0Jykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVN0cm9rZShlbGVtZW50Lml0W2luZGV4XSlcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnZ2YnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlR3JhZGllbnRGaWxsKGVsZW1lbnQuaXRbaW5kZXhdKVxyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdncycpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVHcmFkaWVudFN0cm9rZShlbGVtZW50Lml0W2luZGV4XSlcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAndG0nKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlVHJpbVBhdGhzKGVsZW1lbnQuaXRbaW5kZXhdKVxyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdycCcpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVSZXBlYXRlcihlbGVtZW50Lml0W2luZGV4XSlcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnc3InKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlUG9seXN0YXIoZWxlbWVudC5pdFtpbmRleF0pXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3JkJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVJvdW5kQ29ybmVycyhlbGVtZW50Lml0W2luZGV4XSlcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAndHInKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFRyYW5zZm9ybShlbGVtZW50Lml0W2luZGV4XS50cmFuc2Zvcm0ubVByb3BzKVxyXG5cdCAgIFx0XHR9IGVsc2Uge1xyXG5cdCAgIFx0XHRcdGNvbnNvbGUubG9nKHNoYXBlLnR5KVxyXG5cdCAgIFx0XHR9XHJcblx0XHQgICB9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvYlxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHR2YXIgc2hhcGVzID0gZGF0YS5pdC5tYXAoZnVuY3Rpb24oc2hhcGUsIGluZGV4KSB7XHJcblx0XHRcdHJldHVybiBidWlsZFNoYXBlT2JqZWN0KHNoYXBlLCBpbmRleClcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHNoYXBlc1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgS2V5UGF0aE5vZGUoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUdyb3VwOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVBvbHlzdGFyKGVsZW1lbnQpIHtcclxuXHRjb25zb2xlLmxvZyhlbGVtZW50KTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9pbnRzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLnB0KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5yKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRJbm5lclJhZGl1cyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5pcikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3V0ZXJSYWRpdXModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gub3IpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldElubmVyUm91bmRuZXNzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLmlzKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPdXRlclJvdW5kbmVzcyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5vcykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1BvaW50cycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb2ludHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UG9zaXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Um90YXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSW5uZXIgUmFkaXVzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldElubmVyUmFkaXVzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ091dGVyIFJhZGl1cycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPdXRlclJhZGl1c1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdJbm5lciBSb3VuZG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0SW5uZXJSb3VuZG5lc3NcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT3V0ZXIgUm91bmRuZXNzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE91dGVyUm91bmRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVQb2x5c3RhcjsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVSZWN0YW5nbGUoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTaXplKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLnMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLnApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJvdW5kbmVzcyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5yKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU2l6ZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTaXplXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JvdW5kbmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSb3VuZG5lc3NcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVJlY3RhbmdsZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi4vdHJhbnNmb3JtL1RyYW5zZm9ybScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVSZXBlYXRlcihlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldENvcGllcyh2YWx1ZSkge1xyXG5cdFx0Y29uc29sZS5sb2coJ3NldENvcGllcycpXHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9mZnNldCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPZmZzZXQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0NvcGllcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRDb3BpZXNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT2Zmc2V0JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9mZnNldFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdUcmFuc2Zvcm0nLFxyXG5cdFx0XHRcdHZhbHVlOiBUcmFuc2Zvcm0oZWxlbWVudC50cilcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUmVwZWF0ZXI7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUm91bmRDb3JuZXJzKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UmFkaXVzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnJkKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUmFkaXVzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFJhZGl1c1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUm91bmRDb3JuZXJzOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVN0cm9rZShlbGVtZW50KSB7XHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Q29sb3IodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuYykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VXaWR0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC53KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnY29sb3InLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Q29sb3JcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnc3Ryb2tlIHdpZHRoJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZVdpZHRoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ29wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlU3Ryb2tlIiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlVHJpbVBhdGhzKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3RhcnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RW5kKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmUpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9mZnNldCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU3RhcnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3RhcnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnRW5kJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEVuZFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPZmZzZXQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T2Zmc2V0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVUcmltUGF0aHM7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG5cclxuZnVuY3Rpb24gU29saWQoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICd3aWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRyZXR1cm4gMTAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgTGF5ZXJCYXNlKHN0YXRlKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29saWQ7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG5cclxuZnVuY3Rpb24gVGV4dChlbGVtZW50KSB7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRleHQoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC50ZXh0UHJvcGVydHkuY3VycmVudERhdGEudDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFRleHQodmFsdWUsIGluZGV4KSB7XHJcblx0XHRzZXREb2N1bWVudERhdGEoe3Q6IHZhbHVlfSwgaW5kZXgpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RG9jdW1lbnREYXRhKGRhdGEsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC51cGRhdGVEb2N1bWVudERhdGEoZGF0YSwgaW5kZXgpO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBjYW5SZXNpemVGb250KF9jYW5SZXNpemUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmNhblJlc2l6ZUZvbnQoX2NhblJlc2l6ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5zZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGV4dDogZ2V0VGV4dCxcclxuXHRcdHNldFRleHQ6IHNldFRleHQsXHJcblx0XHRjYW5SZXNpemVGb250OiBjYW5SZXNpemVGb250LFxyXG5cdFx0c2V0RG9jdW1lbnREYXRhOiBzZXREb2N1bWVudERhdGEsXHJcblx0XHRzZXRNaW5pbXVtRm9udFNpemU6IHNldE1pbmltdW1Gb250U2l6ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIExheWVyQmFzZShlbGVtZW50KSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gVHJhbnNmb3JtKHByb3BzKSB7XHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0QW5jaG9yUG9pbnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KHByb3BzLmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTY2FsZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Um90YXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KHByb3BzLnIpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFhSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucngpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFlSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucnkpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFpSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucnopLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFhQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucHgpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFlQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucHkpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFpQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucHopLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KHByb3BzLm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTY2FsZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTY2FsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdYIFBvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFhQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdZIFBvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFlQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdaIFBvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFpQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdYIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFhSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdZIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFlSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdaIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFpSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2Zvcm07IiwiZnVuY3Rpb24gUHJvcGVydHkocHJvcGVydHkpIHtcclxuXHRcclxuXHRmdW5jdGlvbiBzZXRWYWx1ZSh2YWx1ZSkge1xyXG5cdFx0aWYoIXByb3BlcnR5IHx8ICFwcm9wZXJ0eS5hZGRFZmZlY3QpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRwcm9wZXJ0eS5hZGRFZmZlY3QodmFsdWUpO1xyXG5cdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS5wcm9wVHlwZSA9PT0gJ211bHRpZGltZW5zaW9uYWwnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUubGVuZ3RoID09PSAyKSB7XHJcblx0XHRcdHByb3BlcnR5LmFkZEVmZmVjdChmdW5jdGlvbigpe3JldHVybiB2YWx1ZX0pO1xyXG5cdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS5wcm9wVHlwZSA9PT0gJ3VuaWRpbWVuc2lvbmFsJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XHJcblx0XHRcdHByb3BlcnR5LmFkZEVmZmVjdChmdW5jdGlvbigpe3JldHVybiB2YWx1ZX0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRzZXRWYWx1ZTogc2V0VmFsdWVcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcm9wZXJ0eTsiLCJ2YXIgTGF5ZXJMaXN0ID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJMaXN0Jyk7XHJcbnZhciBLZXlQYXRoTGlzdCA9IHJlcXVpcmUoJy4uL2tleV9wYXRoL0tleVBhdGhMaXN0Jyk7XHJcblxyXG5mdW5jdGlvbiBSZW5kZXJlcihzdGF0ZSkge1xyXG5cclxuXHRzdGF0ZS5fdHlwZSA9ICdyZW5kZXJlcic7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFJlbmRlcmVyVHlwZSgpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5hbmltYXRpb24uYW5pbVR5cGU7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7XHJcblx0XHRnZXRSZW5kZXJlclR5cGU6IGdldFJlbmRlcmVyVHlwZVxyXG5cdH0sIExheWVyTGlzdChzdGF0ZS5lbGVtZW50cyksIEtleVBhdGhMaXN0KHN0YXRlLmVsZW1lbnRzLCAncmVuZGVyZXInKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyZXI7Il19
