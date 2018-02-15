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
var TextElement = require('../layer/text/TextElement');
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
},{"../layer/LayerBase":11,"../layer/camera/Camera":13,"../layer/composition/Composition":14,"../layer/image/ImageElement":15,"../layer/null_element/NullElement":16,"../layer/shape/Shape":17,"../layer/solid/SolidElement":29,"../layer/text/TextElement":30}],7:[function(require,module,exports){
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
		]
	}

	var methods = {
	}

	return Object.assign(instance, LayerBase(state), methods);
}

module.exports = Solid;
},{"../LayerBase":11}],30:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function TextElement(element) {

	var instance = {};

	var state = {
		element: element,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
		]
	}

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

	return Object.assign(instance, LayerBase(state), methods);

}

module.exports = TextElement;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0uanMiLCJzcmMvZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yLmpzIiwic3JjL2VudW1zL2xheWVyX3R5cGVzLmpzIiwic3JjL2VudW1zL3Byb3BlcnR5X25hbWVzLmpzIiwic3JjL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9sYXllckFQSUJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9zdHJpbmdTYW5pdGl6ZXIuanMiLCJzcmMvaW5kZXguanMiLCJzcmMva2V5X3BhdGgvS2V5UGF0aExpc3QuanMiLCJzcmMva2V5X3BhdGgvS2V5UGF0aE5vZGUuanMiLCJzcmMvbGF5ZXIvTGF5ZXJCYXNlLmpzIiwic3JjL2xheWVyL0xheWVyTGlzdC5qcyIsInNyYy9sYXllci9jYW1lcmEvQ2FtZXJhLmpzIiwic3JjL2xheWVyL2NvbXBvc2l0aW9uL0NvbXBvc2l0aW9uLmpzIiwic3JjL2xheWVyL2ltYWdlL0ltYWdlRWxlbWVudC5qcyIsInNyYy9sYXllci9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGUuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVFbGxpcHNlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlRmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50RmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50U3Ryb2tlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlR3JvdXAuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVQb2x5c3Rhci5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVJlY3RhbmdsZS5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVJlcGVhdGVyLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUm91bmRDb3JuZXJzLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlU3Ryb2tlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlVHJpbVBhdGhzLmpzIiwic3JjL2xheWVyL3NvbGlkL1NvbGlkRWxlbWVudC5qcyIsInNyYy9sYXllci90ZXh0L1RleHRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RyYW5zZm9ybS9UcmFuc2Zvcm0uanMiLCJzcmMvcHJvcGVydHkvUHJvcGVydHkuanMiLCJzcmMvcmVuZGVyZXIvUmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlbmRlcmVyID0gcmVxdWlyZSgnLi4vcmVuZGVyZXIvUmVuZGVyZXInKTtcclxuXHJcbmZ1bmN0aW9uIEFuaW1hdGlvbkl0ZW1GYWN0b3J5KGFuaW1hdGlvbikge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRhbmltYXRpb246IGFuaW1hdGlvbixcclxuXHRcdGVsZW1lbnRzOiBhbmltYXRpb24ucmVuZGVyZXIuX2JyIHx8IGFuaW1hdGlvbi5yZW5kZXJlci5lbGVtZW50c1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0Q3VycmVudEZyYW1lKCkge1xyXG5cdFx0cmV0dXJuIGFuaW1hdGlvbi5jdXJyZW50RnJhbWU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRDdXJyZW50VGltZSgpIHtcclxuXHRcdHJldHVybiBhbmltYXRpb24uY3VycmVudEZyYW1lIC8gYW5pbWF0aW9uLmZyYW1lUmF0ZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZFZhbHVlQ2FsbGJhY2socHJvcGVydGllcywgdmFsdWUpIHtcclxuXHRcdHZhciBpLCBsZW4gPSBwcm9wZXJ0aWVzLmxlbmd0aDtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xyXG5cdFx0XHRwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7XHJcblx0XHRnZXRDdXJyZW50RnJhbWU6IGdldEN1cnJlbnRGcmFtZSxcclxuXHRcdGdldEN1cnJlbnRUaW1lOiBnZXRDdXJyZW50VGltZSxcclxuXHRcdGFkZFZhbHVlQ2FsbGJhY2s6IGFkZFZhbHVlQ2FsbGJhY2tcclxuXHR9LCBSZW5kZXJlcihzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbkl0ZW1GYWN0b3J5OyIsIm1vZHVsZS5leHBvcnRzID0gJywnOyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdCAwOiAwLFxyXG5cdCAxOiAxLFxyXG5cdCAyOiAyLFxyXG5cdCAzOiAzLFxyXG5cdCA0OiA0LFxyXG5cdCA1OiA1LFxyXG5cdCAxMzogMTMsXHJcblx0J2NvbXAnOiAwLFxyXG5cdCdjb21wb3NpdGlvbic6IDAsXHJcblx0J3NvbGlkJzogMSxcclxuXHQnaW1hZ2UnOiAyLFxyXG5cdCdudWxsJzogMyxcclxuXHQnc2hhcGUnOiA0LFxyXG5cdCd0ZXh0JzogNSxcclxuXHQnY2FtZXJhJzogMTNcclxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdExBWUVSX1RSQU5TRk9STTogJ3RyYW5zZm9ybSdcclxufSIsInZhciBrZXlfcGF0aF9zZXBhcmF0b3IgPSByZXF1aXJlKCcuLi9lbnVtcy9rZXlfcGF0aF9zZXBhcmF0b3InKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwcm9wZXJ0eVBhdGgpIHtcclxuXHR2YXIga2V5UGF0aFNwbGl0ID0gcHJvcGVydHlQYXRoLnNwbGl0KGtleV9wYXRoX3NlcGFyYXRvcik7XHJcblx0dmFyIHNlbGVjdG9yID0ga2V5UGF0aFNwbGl0LnNoaWZ0KCk7XHJcblx0cmV0dXJuIHtcclxuXHRcdHNlbGVjdG9yOiBzZWxlY3RvcixcclxuXHRcdHByb3BlcnR5UGF0aDoga2V5UGF0aFNwbGl0LmpvaW4oa2V5X3BhdGhfc2VwYXJhdG9yKVxyXG5cdH1cclxufSIsInZhciBUZXh0RWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL3RleHQvVGV4dEVsZW1lbnQnKTtcclxudmFyIFNoYXBlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL3NoYXBlL1NoYXBlJyk7XHJcbnZhciBOdWxsRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL251bGxfZWxlbWVudC9OdWxsRWxlbWVudCcpO1xyXG52YXIgU29saWRFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvc29saWQvU29saWRFbGVtZW50Jyk7XHJcbnZhciBJbWFnZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9pbWFnZS9JbWFnZUVsZW1lbnQnKTtcclxudmFyIENhbWVyYUVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9jYW1lcmEvQ2FtZXJhJyk7XHJcbnZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9sYXllci9MYXllckJhc2UnKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldExheWVyQXBpKGVsZW1lbnQpIHtcclxuXHR2YXIgbGF5ZXJUeXBlID0gZWxlbWVudC5kYXRhLnR5O1xyXG5cdHZhciBDb21wb3NpdGlvbiA9IHJlcXVpcmUoJy4uL2xheWVyL2NvbXBvc2l0aW9uL0NvbXBvc2l0aW9uJyk7XHJcblx0c3dpdGNoKGxheWVyVHlwZSkge1xyXG5cdFx0Y2FzZSAwOlxyXG5cdFx0cmV0dXJuIENvbXBvc2l0aW9uKGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSAxOlxyXG5cdFx0cmV0dXJuIFNvbGlkRWxlbWVudChlbGVtZW50KTtcclxuXHRcdGNhc2UgMjpcclxuXHRcdHJldHVybiBJbWFnZUVsZW1lbnQoZWxlbWVudCk7XHJcblx0XHRjYXNlIDM6XHJcblx0XHRyZXR1cm4gTnVsbEVsZW1lbnQoZWxlbWVudCk7XHJcblx0XHRjYXNlIDQ6XHJcblx0XHRyZXR1cm4gU2hhcGVFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSA1OlxyXG5cdFx0cmV0dXJuIFRleHRFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSAxMzpcclxuXHRcdHJldHVybiBDYW1lcmFFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdHJldHVybiBMYXllckJhc2UoZWxlbWVudCk7XHJcblx0fVxyXG59IiwiZnVuY3Rpb24gc2FuaXRpemVTdHJpbmcoc3RyaW5nKSB7XHJcblx0cmV0dXJuIHN0cmluZy50cmltKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FuaXRpemVTdHJpbmciLCJ2YXIgQW5pbWF0aW9uSXRlbSA9IHJlcXVpcmUoJy4vYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0nKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUFuaW1hdGlvbkFwaShhbmltKSB7XHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIEFuaW1hdGlvbkl0ZW0oYW5pbSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRjcmVhdGVBbmltYXRpb25BcGkgOiBjcmVhdGVBbmltYXRpb25BcGlcclxufSIsInZhciBrZXlQYXRoQnVpbGRlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXInKTtcclxudmFyIGxheWVyX2FwaSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5ZXJBUElCdWlsZGVyJyk7XHJcbnZhciBzYW5pdGl6ZVN0cmluZyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvc3RyaW5nU2FuaXRpemVyJyk7XHJcbnZhciBsYXllcl90eXBlcyA9IHJlcXVpcmUoJy4uL2VudW1zL2xheWVyX3R5cGVzJyk7XHJcblxyXG5mdW5jdGlvbiBLZXlQYXRoTGlzdChlbGVtZW50cywgbm9kZV90eXBlKSB7XHJcblxyXG5cdGZ1bmN0aW9uIF9nZXRMZW5ndGgoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS50eSA9PT0gbGF5ZXJfdHlwZXNbdHlwZV07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgbmFtZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEubm0gPT09IG5hbWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5UHJvcGVydHkoZWxlbWVudHMsIG5hbWUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHR2YXIgbGF5ZXJBUEkgPSBsYXllcl9hcGkoZWxlbWVudCk7XHJcblx0XHRcdGlmKGxheWVyQVBJLmhhc1Byb3BlcnR5KG5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGxheWVyQVBJLmdldFByb3BlcnR5KG5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlUeXBlKHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCBzZWxlY3RvciksICdsYXllcicpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlOYW1lKHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCBzZWxlY3RvciksICdsYXllcicpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydGllc0J5U2VsZWN0b3Ioc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXHJcblx0XHRcdHJldHVybiBlbGVtZW50Lmhhc1Byb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldFByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pLCAncHJvcGVydHknKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyUHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHZhciBsYXllcnMgPSBfZmlsdGVyTGF5ZXJCeVByb3BlcnR5KGVsZW1lbnRzLCBzZWxlY3Rvcik7XHJcblx0XHR2YXIgcHJvcGVydGllcyA9IGxheWVycy5tYXAoZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRcdHJldHVybiBsYXllcl9hcGkoZWxlbWVudCkuZ2V0UHJvcGVydHkoc2VsZWN0b3IpO1xyXG5cdFx0fSlcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChwcm9wZXJ0aWVzLCAncHJvcGVydHknKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEtleVBhdGgocHJvcGVydHlQYXRoKSB7XHJcblx0XHR2YXIga2V5UGF0aERhdGEgPSBrZXlQYXRoQnVpbGRlcihwcm9wZXJ0eVBhdGgpO1xyXG5cdFx0dmFyIHNlbGVjdG9yID0gc2FuaXRpemVTdHJpbmcoa2V5UGF0aERhdGEuc2VsZWN0b3IpO1xyXG5cdFx0dmFyIG5vZGVzQnlOYW1lLCBub2Rlc0J5VHlwZSwgc2VsZWN0ZWROb2RlcztcclxuXHRcdGlmIChub2RlX3R5cGUgPT09ICdyZW5kZXJlcicgfHwgbm9kZV90eXBlID09PSAnbGF5ZXInKSB7XHJcblx0XHRcdG5vZGVzQnlOYW1lID0gZ2V0TGF5ZXJzQnlOYW1lKHNlbGVjdG9yKTtcclxuXHRcdFx0bm9kZXNCeVR5cGUgPSBnZXRMYXllcnNCeVR5cGUoc2VsZWN0b3IpO1xyXG5cdFx0XHRpZiAobm9kZXNCeU5hbWUubGVuZ3RoID09PSAwICYmIG5vZGVzQnlUeXBlLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdHNlbGVjdGVkTm9kZXMgPSBnZXRMYXllclByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZWxlY3RlZE5vZGVzID0gbm9kZXNCeU5hbWUuY29uY2F0KG5vZGVzQnlUeXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXMuZ2V0S2V5UGF0aChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYobm9kZV90eXBlID09PSAncHJvcGVydHknKSB7XHJcblx0XHRcdHNlbGVjdGVkTm9kZXMgPSBnZXRQcm9wZXJ0aWVzQnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdGlmIChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2Rlcy5nZXRLZXlQYXRoKGtleVBhdGhEYXRhLnByb3BlcnR5UGF0aCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbmNhdChub2Rlcykge1xyXG5cdFx0dmFyIG5vZGVzRWxlbWVudHMgPSBub2Rlcy5nZXRFbGVtZW50cygpO1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KGVsZW1lbnRzLmNvbmNhdChub2Rlc0VsZW1lbnRzKSwgbm9kZV90eXBlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEVsZW1lbnRzKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHlBdEluZGV4KGluZGV4KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHNbaW5kZXhdO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRLZXlQYXRoOiBnZXRLZXlQYXRoLFxyXG5cdFx0Y29uY2F0OiBjb25jYXQsXHJcblx0XHRnZXRFbGVtZW50czogZ2V0RWxlbWVudHMsXHJcblx0XHRnZXRQcm9wZXJ0eUF0SW5kZXg6IGdldFByb3BlcnR5QXRJbmRleFxyXG5cdH1cclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1ldGhvZHMsICdsZW5ndGgnLCB7XHJcblx0XHRnZXQ6IF9nZXRMZW5ndGhcclxuXHR9KTtcclxuXHJcblx0cmV0dXJuIG1ldGhvZHM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5UGF0aExpc3Q7IiwidmFyIGtleV9wYXRoX3NlcGFyYXRvciA9IHJlcXVpcmUoJy4uL2VudW1zL2tleV9wYXRoX3NlcGFyYXRvcicpO1xyXG52YXIgcHJvcGVydHlfbmFtZXMgPSByZXF1aXJlKCcuLi9lbnVtcy9wcm9wZXJ0eV9uYW1lcycpO1xyXG5cclxuZnVuY3Rpb24gS2V5UGF0aE5vZGUoc3RhdGUsIG5vZGVfdHlwZSkge1xyXG5cclxuXHRmdW5jdGlvbiBnZXRQcm9wZXJ0eUJ5UGF0aChzZWxlY3RvciwgcHJvcGVydHlQYXRoKSB7XHJcblx0XHR2YXIgaW5zdGFuY2VQcm9wZXJ0aWVzID0gc3RhdGUucHJvcGVydGllcyB8fCBbXTtcclxuXHRcdHZhciBpID0gMCwgbGVuID0gaW5zdGFuY2VQcm9wZXJ0aWVzLmxlbmd0aDtcclxuXHRcdHdoaWxlKGkgPCBsZW4pIHtcclxuXHRcdFx0aWYoaW5zdGFuY2VQcm9wZXJ0aWVzW2ldLm5hbWUgPT09IHNlbGVjdG9yKSB7XHJcblx0XHRcdFx0cmV0dXJuIGluc3RhbmNlUHJvcGVydGllc1tpXS52YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpICs9IDE7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBoYXNQcm9wZXJ0eShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuICEhZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBnZXRQcm9wZXJ0eUJ5UGF0aChzZWxlY3Rvcik7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGhhc1Byb3BlcnR5OiBoYXNQcm9wZXJ0eSxcclxuXHRcdGdldFByb3BlcnR5OiBnZXRQcm9wZXJ0eVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG1ldGhvZHM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5UGF0aE5vZGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtL1RyYW5zZm9ybScpO1xyXG5cclxuZnVuY3Rpb24gTGF5ZXJCYXNlKHN0YXRlKSB7XHJcblx0XHJcblx0dmFyIHRyYW5zZm9ybSA9IFRyYW5zZm9ybShzdGF0ZS5lbGVtZW50LmZpbmFsVHJhbnNmb3JtLm1Qcm9wKTtcclxuXHJcblx0ZnVuY3Rpb24gX2dldFRyYW5zZm9ybSgpIHtcclxuXHRcdHJldHVybiB0cmFuc2Zvcm07XHJcblx0fVxyXG5cclxuXHRzdGF0ZS5wcm9wZXJ0aWVzLnB1c2goe1xyXG5cdFx0bmFtZTogJ3RyYW5zZm9ybScsXHJcblx0XHR2YWx1ZTogdHJhbnNmb3JtXHJcblx0fSx7XHJcblx0XHRuYW1lOiAnVHJhbnNmb3JtJyxcclxuXHRcdHZhbHVlOiB0cmFuc2Zvcm1cclxuXHR9KVxyXG5cclxuXHRmdW5jdGlvbiBnZXROYW1lKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLmVsZW1lbnQuZGF0YS5ubTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFR5cGUoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudC5kYXRhLnR5O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0RHVyYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudC5kYXRhLm9wIC0gc3RhdGUuZWxlbWVudC5kYXRhLmlwO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0RWxlbWVudCgpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5lbGVtZW50O1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXROYW1lOiBnZXROYW1lLFxyXG5cdFx0Z2V0VHlwZTogZ2V0VHlwZSxcclxuXHRcdGdldER1cmF0aW9uOiBnZXREdXJhdGlvbixcclxuXHRcdGdldFRhcmdldEVsZW1lbnQ6IGdldFRhcmdldEVsZW1lbnRcclxuXHR9XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbmFtZScsIHtcclxuXHRcdGdldDogZ2V0TmFtZSxcclxuXHRcdGVudW1lcmFibGU6IHRydWVcclxuXHR9KVxyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobWV0aG9kcywgJ3RyYW5zZm9ybScsIHtcclxuXHRcdGdldDogX2dldFRyYW5zZm9ybSxcclxuXHRcdGVudW1lcmFibGU6IHRydWVcclxuXHR9KVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyQmFzZTsiLCJ2YXIgbGF5ZXJfdHlwZXMgPSByZXF1aXJlKCcuLi9lbnVtcy9sYXllcl90eXBlcycpO1xyXG52YXIgbGF5ZXJfYXBpID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXllckFQSUJ1aWxkZXInKTtcclxuXHJcbmZ1bmN0aW9uIExheWVyTGlzdChlbGVtZW50cykge1xyXG5cclxuXHRmdW5jdGlvbiBfZ2V0TGVuZ3RoKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmxlbmd0aDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgdHlwZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEudHkgPT09IGxheWVyX3R5cGVzW3R5cGVdO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIG5hbWUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLm5tID09PSBuYW1lO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnMoKSB7XHJcblx0XHQgcmV0dXJuIExheWVyTGlzdChlbGVtZW50cyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeVR5cGUodHlwZSkge1xyXG5cdFx0dmFyIGVsZW1lbnRzTGlzdCA9IF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgdHlwZSk7XHJcblx0XHRyZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzTGlzdCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeU5hbWUodHlwZSkge1xyXG5cdFx0dmFyIGVsZW1lbnRzTGlzdCA9IF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgdHlwZSk7XHJcblx0XHRyZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzTGlzdCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBsYXllcihpbmRleCkge1xyXG5cdFx0aWYgKGluZGV4ID49IGVsZW1lbnRzLmxlbmd0aCkge1xyXG5cdFx0XHRyZXR1cm4gW107XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbGF5ZXJfYXBpKGVsZW1lbnRzW3BhcnNlSW50KGluZGV4KV0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkSXRlcmF0YWJsZU1ldGhvZHMoaXRlcmF0YWJsZU1ldGhvZHMsIGxpc3QpIHtcclxuXHRcdGl0ZXJhdGFibGVNZXRob2RzLnJlZHVjZShmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUpe1xyXG5cdFx0XHR2YXIgX3ZhbHVlID0gdmFsdWU7XHJcblx0XHRcdGFjY3VtdWxhdG9yW3ZhbHVlXSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xyXG5cdFx0XHRcdHJldHVybiBlbGVtZW50cy5tYXAoZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRcdFx0XHR2YXIgbGF5ZXIgPSBsYXllcl9hcGkoZWxlbWVudCk7XHJcblx0XHRcdFx0XHRpZihsYXllcltfdmFsdWVdKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBsYXllcltfdmFsdWVdLmFwcGx5KG51bGwsIF9hcmd1bWVudHMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGFjY3VtdWxhdG9yO1xyXG5cdFx0fSwgbWV0aG9kcyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRUYXJnZXRFbGVtZW50cygpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbmNhdChsaXN0KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuY29uY2F0KGxpc3QuZ2V0VGFyZ2V0RWxlbWVudHMoKSk7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldExheWVyczogZ2V0TGF5ZXJzLFxyXG5cdFx0Z2V0TGF5ZXJzQnlUeXBlOiBnZXRMYXllcnNCeVR5cGUsXHJcblx0XHRnZXRMYXllcnNCeU5hbWU6IGdldExheWVyc0J5TmFtZSxcclxuXHRcdGxheWVyOiBsYXllcixcclxuXHRcdGNvbmNhdDogY29uY2F0LFxyXG5cdFx0Z2V0VGFyZ2V0RWxlbWVudHM6IGdldFRhcmdldEVsZW1lbnRzXHJcblx0fTtcclxuXHJcblx0YWRkSXRlcmF0YWJsZU1ldGhvZHMoWydzZXRUcmFuc2xhdGUnLCAnZ2V0VHlwZScsICdnZXREdXJhdGlvbiddKTtcclxuXHRhZGRJdGVyYXRhYmxlTWV0aG9kcyhbJ3NldFRleHQnLCAnZ2V0VGV4dCcsICdzZXREb2N1bWVudERhdGEnLCAnY2FuUmVzaXplRm9udCcsICdzZXRNaW5pbXVtRm9udFNpemUnXSk7XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbGVuZ3RoJywge1xyXG5cdFx0Z2V0OiBfZ2V0TGVuZ3RoXHJcblx0fSk7XHJcblx0cmV0dXJuIG1ldGhvZHM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJMaXN0OyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBDYW1lcmEoZWxlbWVudCkge1xyXG5cdGNvbnNvbGUubG9nKCdlbGVtZW50OiAnLCBlbGVtZW50KVxyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvaW50T2ZJbnRlcmVzdCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5hKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRab29tKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnBlKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRYUm90YXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucngpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFlSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5yeSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WlJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnJ6KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9pbnQgb2YgSW50ZXJlc3QnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UG9pbnRPZkludGVyZXN0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1pvb20nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Wm9vbVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdYIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFhSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdZIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFlSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdaIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFpSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgS2V5UGF0aE5vZGUoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmE7IiwidmFyIEtleVBhdGhMaXN0ID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aExpc3QnKTtcclxudmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG52YXIgbGF5ZXJfYXBpID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9sYXllckFQSUJ1aWxkZXInKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIENvbXBvc2l0aW9uKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRUaW1lUmVtYXAodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQudG0pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdFxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0dmFyIGNvbXBvc2l0aW9uTGF5ZXJzID0gZWxlbWVudC5sYXllcnMubWFwKGZ1bmN0aW9uKGxheWVyLCBpbmRleCkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdG5hbWU6IGxheWVyLm5tLFxyXG5cdFx0XHRcdHZhbHVlOiBsYXllcl9hcGkoZWxlbWVudC5lbGVtZW50c1tpbmRleF0pXHJcblx0XHRcdH07XHJcblx0XHR9KVxyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdUaW1lIFJlbWFwJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFRpbWVSZW1hcFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XS5jb25jYXQoY29tcG9zaXRpb25MYXllcnMpXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBLZXlQYXRoTGlzdChzdGF0ZS5lbGVtZW50cywgJ2xheWVyJyksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0aW9uOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIEltYWdlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJCYXNlKGVsZW1lbnQpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZTsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBOdWxsRWxlbWVudCgpIHtcclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJCYXNlKGVsZW1lbnQpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOdWxsRWxlbWVudDsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBTaGFwZUdyb3VwID0gcmVxdWlyZSgnLi9TaGFwZUdyb3VwJyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZShlbGVtZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpIHtcclxuXHRcdHZhciBvYiA9IHtcclxuXHRcdFx0bmFtZTogc2hhcGUubm1cclxuXHRcdH1cclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYiwgJ3ZhbHVlJywge1xyXG5cdFx0ICAgZ2V0KCkgeyBcclxuXHQgICBcdFx0aWYoc2hhcGUudHkgPT09ICdncicpIHtcclxuXHQgICBcdFx0XHR2YXIgZ3JvdXAgPSBTaGFwZUdyb3VwKGVsZW1lbnQuaXRlbXNEYXRhW2luZGV4XSwgc2hhcGUpXHJcblx0ICAgXHRcdFx0cmV0dXJuIGdyb3VwXHJcblx0ICAgXHRcdH1cclxuXHRcdCAgIH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG9iXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHZhciBzaGFwZXMgPSBlbGVtZW50LmRhdGEuc2hhcGVzLm1hcChmdW5jdGlvbihzaGFwZSwgaW5kZXgpIHtcclxuXHRcdFx0cmV0dXJuIGJ1aWxkU2hhcGVPYmplY3Qoc2hhcGUsIGluZGV4KVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gc2hhcGVzXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVFbGxpcHNlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2l6ZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU2l6ZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTaXplXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVFbGxpcHNlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUZpbGwoZWxlbWVudCkge1xyXG5cclxuXHRjb25zb2xlLmxvZyhlbGVtZW50KVxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldENvbG9yKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ2NvbG9yJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldENvbG9yXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ29wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlRmlsbDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVHcmFkaWVudEZpbGwoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdGFydFBvaW50KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEVuZFBvaW50KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmUpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SGlnaGxpZ2h0TGVuZ3RoKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmgpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEhpZ2hsaWdodEFuZ2xlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldENvbG9ycyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5nLnByb3ApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdGFydCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdGFydFBvaW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRFbmRQb2ludFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IExlbmd0aCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRIaWdobGlnaHRMZW5ndGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IEFuZ2xlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEhpZ2hsaWdodEFuZ2xlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0NvbG9ycycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRDb2xvcnNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUdyYWRpZW50RmlsbDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVHcmFkaWVudFN0cm9rZShlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0YXJ0UG9pbnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RW5kUG9pbnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuZSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRIaWdobGlnaHRMZW5ndGgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuaCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SGlnaGxpZ2h0QW5nbGUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuYSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Q29sb3JzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmcucHJvcCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlV2lkdGgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQudykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1N0YXJ0IFBvaW50JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0YXJ0UG9pbnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnRW5kIFBvaW50JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEVuZFBvaW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgTGVuZ3RoJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEhpZ2hsaWdodExlbmd0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgQW5nbGUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0SGlnaGxpZ2h0QW5nbGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQ29sb3JzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldENvbG9yc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdHJva2UgV2lkdGgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlV2lkdGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUdyYWRpZW50U3Ryb2tlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBTaGFwZVJlY3RhbmdsZSA9IHJlcXVpcmUoJy4vU2hhcGVSZWN0YW5nbGUnKTtcclxudmFyIFNoYXBlRmlsbCA9IHJlcXVpcmUoJy4vU2hhcGVGaWxsJyk7XHJcbnZhciBTaGFwZVN0cm9rZSA9IHJlcXVpcmUoJy4vU2hhcGVTdHJva2UnKTtcclxudmFyIFNoYXBlRWxsaXBzZSA9IHJlcXVpcmUoJy4vU2hhcGVFbGxpcHNlJyk7XHJcbnZhciBTaGFwZUdyYWRpZW50RmlsbCA9IHJlcXVpcmUoJy4vU2hhcGVHcmFkaWVudEZpbGwnKTtcclxudmFyIFNoYXBlR3JhZGllbnRTdHJva2UgPSByZXF1aXJlKCcuL1NoYXBlR3JhZGllbnRTdHJva2UnKTtcclxudmFyIFNoYXBlVHJpbVBhdGhzID0gcmVxdWlyZSgnLi9TaGFwZVRyaW1QYXRocycpO1xyXG52YXIgU2hhcGVSZXBlYXRlciA9IHJlcXVpcmUoJy4vU2hhcGVSZXBlYXRlcicpO1xyXG52YXIgU2hhcGVQb2x5c3RhciA9IHJlcXVpcmUoJy4vU2hhcGVQb2x5c3RhcicpO1xyXG52YXIgU2hhcGVSb3VuZENvcm5lcnMgPSByZXF1aXJlKCcuL1NoYXBlUm91bmRDb3JuZXJzJyk7XHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuLi90cmFuc2Zvcm0vVHJhbnNmb3JtJyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUdyb3VwKGVsZW1lbnQsIGRhdGEpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRkYXRhOiBkYXRhLFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpIHtcclxuXHRcdHZhciBvYiA9IHtcclxuXHRcdFx0bmFtZTogc2hhcGUubm1cclxuXHRcdH1cclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYiwgJ3ZhbHVlJywge1xyXG5cdFx0ICAgZ2V0KCkgeyBcclxuXHQgICBcdFx0aWYoc2hhcGUudHkgPT09ICdyYycpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVSZWN0YW5nbGUoZWxlbWVudC5pdFtpbmRleF0sIHNoYXBlKVxyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdlbCcpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVFbGxpcHNlKGVsZW1lbnQuaXRbaW5kZXhdKVxyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdmbCcpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVGaWxsKGVsZW1lbnQuaXRbaW5kZXhdKVxyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdzdCcpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVTdHJva2UoZWxlbWVudC5pdFtpbmRleF0pXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2dmJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZUdyYWRpZW50RmlsbChlbGVtZW50Lml0W2luZGV4XSlcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnZ3MnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlR3JhZGllbnRTdHJva2UoZWxlbWVudC5pdFtpbmRleF0pXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3RtJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVRyaW1QYXRocyhlbGVtZW50Lml0W2luZGV4XSlcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAncnAnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlUmVwZWF0ZXIoZWxlbWVudC5pdFtpbmRleF0pXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3NyJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVBvbHlzdGFyKGVsZW1lbnQuaXRbaW5kZXhdKVxyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdyZCcpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVSb3VuZENvcm5lcnMoZWxlbWVudC5pdFtpbmRleF0pXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3RyJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBUcmFuc2Zvcm0oZWxlbWVudC5pdFtpbmRleF0udHJhbnNmb3JtLm1Qcm9wcylcclxuXHQgICBcdFx0fSBlbHNlIHtcclxuXHQgICBcdFx0XHRjb25zb2xlLmxvZyhzaGFwZS50eSlcclxuXHQgICBcdFx0fVxyXG5cdFx0ICAgfVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb2JcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0dmFyIHNoYXBlcyA9IGRhdGEuaXQubWFwKGZ1bmN0aW9uKHNoYXBlLCBpbmRleCkge1xyXG5cdFx0XHRyZXR1cm4gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpXHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBzaGFwZXNcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIEtleVBhdGhOb2RlKHN0YXRlKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVHcm91cDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVQb2x5c3RhcihlbGVtZW50KSB7XHJcblx0Y29uc29sZS5sb2coZWxlbWVudCk7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvaW50cyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5wdCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9zaXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Um90YXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SW5uZXJSYWRpdXModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2guaXIpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE91dGVyUmFkaXVzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLm9yKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRJbm5lclJvdW5kbmVzcyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5pcykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3V0ZXJSb3VuZG5lc3ModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gub3MpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb2ludHMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UG9pbnRzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0lubmVyIFJhZGl1cycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRJbm5lclJhZGl1c1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPdXRlciBSYWRpdXMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3V0ZXJSYWRpdXNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSW5uZXIgUm91bmRuZXNzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldElubmVyUm91bmRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ091dGVyIFJvdW5kbmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPdXRlclJvdW5kbmVzc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUG9seXN0YXI7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUmVjdGFuZ2xlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2l6ZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3VuZG5lc3ModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1NpemUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2l6ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3VuZG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Um91bmRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVSZWN0YW5nbGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybS9UcmFuc2Zvcm0nKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUmVwZWF0ZXIoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRDb3BpZXModmFsdWUpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdzZXRDb3BpZXMnKVxyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5jKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPZmZzZXQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T2Zmc2V0KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdDb3BpZXMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Q29waWVzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09mZnNldCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPZmZzZXRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnVHJhbnNmb3JtJyxcclxuXHRcdFx0XHR2YWx1ZTogVHJhbnNmb3JtKGVsZW1lbnQudHIpXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVJlcGVhdGVyOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVJvdW5kQ29ybmVycyhlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJhZGl1cyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5yZCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JhZGl1cycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSYWRpdXNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVJvdW5kQ29ybmVyczsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVTdHJva2UoZWxlbWVudCkge1xyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldENvbG9yKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlV2lkdGgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQudykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ2NvbG9yJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldENvbG9yXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3N0cm9rZSB3aWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VXaWR0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdvcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVN0cm9rZSIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVRyaW1QYXRocyhlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0YXJ0KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEVuZCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5lKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPZmZzZXQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1N0YXJ0JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0YXJ0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRFbmRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT2Zmc2V0JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9mZnNldFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlVHJpbVBhdGhzOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIFNvbGlkKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb2xpZDsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0RWxlbWVudChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGV4dCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LnRleHRQcm9wZXJ0eS5jdXJyZW50RGF0YS50O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0VGV4dCh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHNldERvY3VtZW50RGF0YSh7dDogdmFsdWV9LCBpbmRleCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXREb2N1bWVudERhdGEoZGF0YSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LnVwZGF0ZURvY3VtZW50RGF0YShkYXRhLCBpbmRleCk7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGNhblJlc2l6ZUZvbnQoX2NhblJlc2l6ZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuY2FuUmVzaXplRm9udChfY2FuUmVzaXplKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE1pbmltdW1Gb250U2l6ZShfZm9udFNpemUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LnNldE1pbmltdW1Gb250U2l6ZShfZm9udFNpemUpO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRUZXh0OiBnZXRUZXh0LFxyXG5cdFx0c2V0VGV4dDogc2V0VGV4dCxcclxuXHRcdGNhblJlc2l6ZUZvbnQ6IGNhblJlc2l6ZUZvbnQsXHJcblx0XHRzZXREb2N1bWVudERhdGE6IHNldERvY3VtZW50RGF0YSxcclxuXHRcdHNldE1pbmltdW1Gb250U2l6ZTogc2V0TWluaW11bUZvbnRTaXplXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgTGF5ZXJCYXNlKHN0YXRlKSwgbWV0aG9kcyk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRFbGVtZW50OyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBUcmFuc2Zvcm0ocHJvcHMpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRBbmNob3JQb2ludCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMuYSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9zaXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KHByb3BzLnApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFNjYWxlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WFJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5yeCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WVJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5yeSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WlJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5yeikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5weCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WVBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5weSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WlBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5weikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1NjYWxlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFNjYWxlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WVBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WlBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WFJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WVJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WlJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTsiLCJmdW5jdGlvbiBQcm9wZXJ0eShwcm9wZXJ0eSkge1xyXG5cdFxyXG5cdGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlKSB7XHJcblx0XHRpZighcHJvcGVydHkgfHwgIXByb3BlcnR5LmFkZEVmZmVjdCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHByb3BlcnR5LmFkZEVmZmVjdCh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnByb3BUeXBlID09PSAnbXVsdGlkaW1lbnNpb25hbCcgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5sZW5ndGggPT09IDIpIHtcclxuXHRcdFx0cHJvcGVydHkuYWRkRWZmZWN0KGZ1bmN0aW9uKCl7cmV0dXJuIHZhbHVlfSk7XHJcblx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnByb3BUeXBlID09PSAndW5pZGltZW5zaW9uYWwnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0cHJvcGVydHkuYWRkRWZmZWN0KGZ1bmN0aW9uKCl7cmV0dXJuIHZhbHVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdHNldFZhbHVlOiBzZXRWYWx1ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFByb3BlcnR5OyIsInZhciBMYXllckxpc3QgPSByZXF1aXJlKCcuLi9sYXllci9MYXllckxpc3QnKTtcclxudmFyIEtleVBhdGhMaXN0ID0gcmVxdWlyZSgnLi4va2V5X3BhdGgvS2V5UGF0aExpc3QnKTtcclxuXHJcbmZ1bmN0aW9uIFJlbmRlcmVyKHN0YXRlKSB7XHJcblxyXG5cdHN0YXRlLl90eXBlID0gJ3JlbmRlcmVyJztcclxuXHJcblx0ZnVuY3Rpb24gZ2V0UmVuZGVyZXJUeXBlKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLmFuaW1hdGlvbi5hbmltVHlwZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHtcclxuXHRcdGdldFJlbmRlcmVyVHlwZTogZ2V0UmVuZGVyZXJUeXBlXHJcblx0fSwgTGF5ZXJMaXN0KHN0YXRlLmVsZW1lbnRzKSwgS2V5UGF0aExpc3Qoc3RhdGUuZWxlbWVudHMsICdyZW5kZXJlcicpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjsiXX0=
