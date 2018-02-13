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
},{"../renderer/Renderer":25}],2:[function(require,module,exports){
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
var LayerBase = require('../layer/LayerBase');
var Composition = require('../layer/composition/Composition');

module.exports = function getLayerApi(element) {
	var layerType = element.data.ty;
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
		default:
		return LayerBase(element);
	}
}
},{"../layer/LayerBase":11,"../layer/composition/Composition":13,"../layer/image/ImageElement":14,"../layer/null_element/NullElement":15,"../layer/shape/Shape":16,"../layer/solid/SolidElement":21,"../layer/text/Text":22}],7:[function(require,module,exports){
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

	var transform = Transform(state.element);

	function _getTransform() {
		return transform;
	}

	state.properties.push({
		name: 'transform',
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
},{"../key_path/KeyPathNode":10,"./transform/Transform":23}],12:[function(require,module,exports){
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
var LayerList = require('../LayerList');
var LayerBase = require('../LayerBase');

function Composition(state) {
	return Object.assign({}
		, LayerList(state.elements)
		, LayerBase(state));
}

module.exports = Composition;
},{"../LayerBase":11,"../LayerList":12}],14:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Image(element) {

	var methods = {
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = Image;
},{"../LayerBase":11}],15:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function NullElement() {

	var methods = {
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = NullElement;
},{"../LayerBase":11}],16:[function(require,module,exports){
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
},{"../LayerBase":11,"./ShapeGroup":18}],17:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":10,"../../property/Property":24}],18:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":10,"./ShapeFill":17,"./ShapeRectangle":19,"./ShapeStroke":20}],19:[function(require,module,exports){
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
				name: 'size',
				value: {
					setValue: setSize
				}
			},
			{
				name: 'position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'roundness',
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
},{"../../key_path/KeyPathNode":10,"../../property/Property":24}],20:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":10,"../../property/Property":24}],21:[function(require,module,exports){
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
},{"../LayerBase":11}],22:[function(require,module,exports){
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
},{"../LayerBase":11}],23:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Transform(element) {
	var state = {
		properties: _buildPropertyMap()
	}

	function setAnchorPoint(value) {
		Property(element.finalTransform.mProp.a).setValue(value);
	}

	function setPosition(value) {
		Property(element.finalTransform.mProp.p).setValue(value);
	}

	function setScale(value) {
		Property(element.finalTransform.mProp.s).setValue(value);
	}

	function setRotation(value) {
		Property(element.finalTransform.mProp.r).setValue(value);
	}

	function setOpacity(value) {
		Property(element.finalTransform.mProp.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'scale',
				value: {
					setValue: setScale
				}
			},
			{
				name: 'rotation',
				value: {
					setValue: setRotation
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

module.exports = Transform;
},{"../../key_path/KeyPathNode":10,"../../property/Property":24}],24:[function(require,module,exports){
function Property(property) {
	
	function setValue(value) {
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
},{}],25:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0uanMiLCJzcmMvZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yLmpzIiwic3JjL2VudW1zL2xheWVyX3R5cGVzLmpzIiwic3JjL2VudW1zL3Byb3BlcnR5X25hbWVzLmpzIiwic3JjL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9sYXllckFQSUJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9zdHJpbmdTYW5pdGl6ZXIuanMiLCJzcmMvaW5kZXguanMiLCJzcmMva2V5X3BhdGgvS2V5UGF0aExpc3QuanMiLCJzcmMva2V5X3BhdGgvS2V5UGF0aE5vZGUuanMiLCJzcmMvbGF5ZXIvTGF5ZXJCYXNlLmpzIiwic3JjL2xheWVyL0xheWVyTGlzdC5qcyIsInNyYy9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbi5qcyIsInNyYy9sYXllci9pbWFnZS9JbWFnZUVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvbnVsbF9lbGVtZW50L051bGxFbGVtZW50LmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlRmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyb3VwLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUmVjdGFuZ2xlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlU3Ryb2tlLmpzIiwic3JjL2xheWVyL3NvbGlkL1NvbGlkRWxlbWVudC5qcyIsInNyYy9sYXllci90ZXh0L1RleHQuanMiLCJzcmMvbGF5ZXIvdHJhbnNmb3JtL1RyYW5zZm9ybS5qcyIsInNyYy9wcm9wZXJ0eS9Qcm9wZXJ0eS5qcyIsInNyYy9yZW5kZXJlci9SZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlbmRlcmVyID0gcmVxdWlyZSgnLi4vcmVuZGVyZXIvUmVuZGVyZXInKTtcclxuXHJcbmZ1bmN0aW9uIEFuaW1hdGlvbkl0ZW1GYWN0b3J5KGFuaW1hdGlvbikge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRhbmltYXRpb246IGFuaW1hdGlvbixcclxuXHRcdGVsZW1lbnRzOiBhbmltYXRpb24ucmVuZGVyZXIuX2JyIHx8IGFuaW1hdGlvbi5yZW5kZXJlci5lbGVtZW50c1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0Q3VycmVudEZyYW1lKCkge1xyXG5cdFx0cmV0dXJuIGFuaW1hdGlvbi5jdXJyZW50RnJhbWU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRDdXJyZW50VGltZSgpIHtcclxuXHRcdHJldHVybiBhbmltYXRpb24uY3VycmVudEZyYW1lIC8gYW5pbWF0aW9uLmZyYW1lUmF0ZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZFZhbHVlQ2FsbGJhY2socHJvcGVydGllcywgdmFsdWUpIHtcclxuXHRcdHZhciBpLCBsZW4gPSBwcm9wZXJ0aWVzLmxlbmd0aDtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xyXG5cdFx0XHRwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7XHJcblx0XHRnZXRDdXJyZW50RnJhbWU6IGdldEN1cnJlbnRGcmFtZSxcclxuXHRcdGdldEN1cnJlbnRUaW1lOiBnZXRDdXJyZW50VGltZSxcclxuXHRcdGFkZFZhbHVlQ2FsbGJhY2s6IGFkZFZhbHVlQ2FsbGJhY2tcclxuXHR9LCBSZW5kZXJlcihzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbkl0ZW1GYWN0b3J5OyIsIm1vZHVsZS5leHBvcnRzID0gJywnOyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdCAwOiAwLFxyXG5cdCAxOiAxLFxyXG5cdCAyOiAyLFxyXG5cdCAzOiAzLFxyXG5cdCA0OiA0LFxyXG5cdCA1OiA1LFxyXG5cdCAxMzogMTMsXHJcblx0J2NvbXAnOiAwLFxyXG5cdCdjb21wb3NpdGlvbic6IDAsXHJcblx0J3NvbGlkJzogMSxcclxuXHQnaW1hZ2UnOiAyLFxyXG5cdCdudWxsJzogMyxcclxuXHQnc2hhcGUnOiA0LFxyXG5cdCd0ZXh0JzogNSxcclxuXHQnY2FtZXJhJzogMTNcclxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdExBWUVSX1RSQU5TRk9STTogJ3RyYW5zZm9ybSdcclxufSIsInZhciBrZXlfcGF0aF9zZXBhcmF0b3IgPSByZXF1aXJlKCcuLi9lbnVtcy9rZXlfcGF0aF9zZXBhcmF0b3InKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwcm9wZXJ0eVBhdGgpIHtcclxuXHR2YXIga2V5UGF0aFNwbGl0ID0gcHJvcGVydHlQYXRoLnNwbGl0KGtleV9wYXRoX3NlcGFyYXRvcik7XHJcblx0dmFyIHNlbGVjdG9yID0ga2V5UGF0aFNwbGl0LnNoaWZ0KCk7XHJcblx0cmV0dXJuIHtcclxuXHRcdHNlbGVjdG9yOiBzZWxlY3RvcixcclxuXHRcdHByb3BlcnR5UGF0aDoga2V5UGF0aFNwbGl0LmpvaW4oa2V5X3BhdGhfc2VwYXJhdG9yKVxyXG5cdH1cclxufSIsInZhciBUZXh0RWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL3RleHQvVGV4dCcpO1xyXG52YXIgU2hhcGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvc2hhcGUvU2hhcGUnKTtcclxudmFyIE51bGxFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvbnVsbF9lbGVtZW50L051bGxFbGVtZW50Jyk7XHJcbnZhciBTb2xpZEVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9zb2xpZC9Tb2xpZEVsZW1lbnQnKTtcclxudmFyIEltYWdlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL2ltYWdlL0ltYWdlRWxlbWVudCcpO1xyXG52YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJCYXNlJyk7XHJcbnZhciBDb21wb3NpdGlvbiA9IHJlcXVpcmUoJy4uL2xheWVyL2NvbXBvc2l0aW9uL0NvbXBvc2l0aW9uJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldExheWVyQXBpKGVsZW1lbnQpIHtcclxuXHR2YXIgbGF5ZXJUeXBlID0gZWxlbWVudC5kYXRhLnR5O1xyXG5cdHN3aXRjaChsYXllclR5cGUpIHtcclxuXHRcdGNhc2UgMDpcclxuXHRcdHJldHVybiBDb21wb3NpdGlvbihlbGVtZW50KTtcclxuXHRcdGNhc2UgMTpcclxuXHRcdHJldHVybiBTb2xpZEVsZW1lbnQoZWxlbWVudCk7XHJcblx0XHRjYXNlIDI6XHJcblx0XHRyZXR1cm4gSW1hZ2VFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSAzOlxyXG5cdFx0cmV0dXJuIE51bGxFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSA0OlxyXG5cdFx0cmV0dXJuIFNoYXBlRWxlbWVudChlbGVtZW50KTtcclxuXHRcdGNhc2UgNTpcclxuXHRcdHJldHVybiBUZXh0RWxlbWVudChlbGVtZW50KTtcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRyZXR1cm4gTGF5ZXJCYXNlKGVsZW1lbnQpO1xyXG5cdH1cclxufSIsImZ1bmN0aW9uIHNhbml0aXplU3RyaW5nKHN0cmluZykge1xyXG5cdHJldHVybiBzdHJpbmcudHJpbSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbml0aXplU3RyaW5nIiwidmFyIEFuaW1hdGlvbkl0ZW0gPSByZXF1aXJlKCcuL2FuaW1hdGlvbi9BbmltYXRpb25JdGVtJyk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVBbmltYXRpb25BcGkoYW5pbSkge1xyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBBbmltYXRpb25JdGVtKGFuaW0pKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Y3JlYXRlQW5pbWF0aW9uQXBpIDogY3JlYXRlQW5pbWF0aW9uQXBpXHJcbn0iLCJ2YXIga2V5UGF0aEJ1aWxkZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2tleVBhdGhCdWlsZGVyJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG52YXIgc2FuaXRpemVTdHJpbmcgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3N0cmluZ1Nhbml0aXplcicpO1xyXG52YXIgbGF5ZXJfdHlwZXMgPSByZXF1aXJlKCcuLi9lbnVtcy9sYXllcl90eXBlcycpO1xyXG5cclxuZnVuY3Rpb24gS2V5UGF0aExpc3QoZWxlbWVudHMsIG5vZGVfdHlwZSkge1xyXG5cclxuXHRmdW5jdGlvbiBfZ2V0TGVuZ3RoKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmxlbmd0aDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgdHlwZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEudHkgPT09IGxheWVyX3R5cGVzW3R5cGVdO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIG5hbWUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLm5tID09PSBuYW1lO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVByb3BlcnR5KGVsZW1lbnRzLCBuYW1lKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0dmFyIGxheWVyQVBJID0gbGF5ZXJfYXBpKGVsZW1lbnQpO1xyXG5cdFx0XHRpZihsYXllckFQSS5oYXNQcm9wZXJ0eShuYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiBsYXllckFQSS5nZXRQcm9wZXJ0eShuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5VHlwZShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgc2VsZWN0b3IpLCAnbGF5ZXInKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5TmFtZShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgc2VsZWN0b3IpLCAnbGF5ZXInKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnRpZXNCeVNlbGVjdG9yKHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5oYXNQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHR9KS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHR9KSwgJ3Byb3BlcnR5Jyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllclByb3BlcnR5KHNlbGVjdG9yKSB7XHJcblx0XHR2YXIgbGF5ZXJzID0gX2ZpbHRlckxheWVyQnlQcm9wZXJ0eShlbGVtZW50cywgc2VsZWN0b3IpO1xyXG5cdFx0dmFyIHByb3BlcnRpZXMgPSBsYXllcnMubWFwKGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0XHRyZXR1cm4gbGF5ZXJfYXBpKGVsZW1lbnQpLmdldFByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QocHJvcGVydGllcywgJ3Byb3BlcnR5Jyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRLZXlQYXRoKHByb3BlcnR5UGF0aCkge1xyXG5cdFx0dmFyIGtleVBhdGhEYXRhID0ga2V5UGF0aEJ1aWxkZXIocHJvcGVydHlQYXRoKTtcclxuXHRcdHZhciBzZWxlY3RvciA9IHNhbml0aXplU3RyaW5nKGtleVBhdGhEYXRhLnNlbGVjdG9yKTtcclxuXHRcdHZhciBub2Rlc0J5TmFtZSwgbm9kZXNCeVR5cGUsIHNlbGVjdGVkTm9kZXM7XHJcblx0XHRpZiAobm9kZV90eXBlID09PSAncmVuZGVyZXInIHx8IG5vZGVfdHlwZSA9PT0gJ2xheWVyJykge1xyXG5cdFx0XHRub2Rlc0J5TmFtZSA9IGdldExheWVyc0J5TmFtZShzZWxlY3Rvcik7XHJcblx0XHRcdG5vZGVzQnlUeXBlID0gZ2V0TGF5ZXJzQnlUeXBlKHNlbGVjdG9yKTtcclxuXHRcdFx0aWYgKG5vZGVzQnlOYW1lLmxlbmd0aCA9PT0gMCAmJiBub2Rlc0J5VHlwZS5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRzZWxlY3RlZE5vZGVzID0gZ2V0TGF5ZXJQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZWN0ZWROb2RlcyA9IG5vZGVzQnlOYW1lLmNvbmNhdChub2Rlc0J5VHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGtleVBhdGhEYXRhLnByb3BlcnR5UGF0aCkge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzLmdldEtleVBhdGgoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2RlcztcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmKG5vZGVfdHlwZSA9PT0gJ3Byb3BlcnR5Jykge1xyXG5cdFx0XHRzZWxlY3RlZE5vZGVzID0gZ2V0UHJvcGVydGllc0J5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0XHRpZiAoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXMuZ2V0S2V5UGF0aChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25jYXQobm9kZXMpIHtcclxuXHRcdHZhciBub2Rlc0VsZW1lbnRzID0gbm9kZXMuZ2V0RWxlbWVudHMoKTtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChlbGVtZW50cy5jb25jYXQobm9kZXNFbGVtZW50cyksIG5vZGVfdHlwZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRFbGVtZW50cygpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5QXRJbmRleChpbmRleCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzW2luZGV4XTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0S2V5UGF0aDogZ2V0S2V5UGF0aCxcclxuXHRcdGNvbmNhdDogY29uY2F0LFxyXG5cdFx0Z2V0RWxlbWVudHM6IGdldEVsZW1lbnRzLFxyXG5cdFx0Z2V0UHJvcGVydHlBdEluZGV4OiBnZXRQcm9wZXJ0eUF0SW5kZXhcclxuXHR9XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbGVuZ3RoJywge1xyXG5cdFx0Z2V0OiBfZ2V0TGVuZ3RoXHJcblx0fSk7XHJcblxyXG5cdHJldHVybiBtZXRob2RzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleVBhdGhMaXN0OyIsInZhciBrZXlfcGF0aF9zZXBhcmF0b3IgPSByZXF1aXJlKCcuLi9lbnVtcy9rZXlfcGF0aF9zZXBhcmF0b3InKTtcclxudmFyIHByb3BlcnR5X25hbWVzID0gcmVxdWlyZSgnLi4vZW51bXMvcHJvcGVydHlfbmFtZXMnKTtcclxuXHJcbmZ1bmN0aW9uIEtleVBhdGhOb2RlKHN0YXRlLCBub2RlX3R5cGUpIHtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IsIHByb3BlcnR5UGF0aCkge1xyXG5cdFx0dmFyIGluc3RhbmNlUHJvcGVydGllcyA9IHN0YXRlLnByb3BlcnRpZXMgfHwgW107XHJcblx0XHR2YXIgaSA9IDAsIGxlbiA9IGluc3RhbmNlUHJvcGVydGllcy5sZW5ndGg7XHJcblx0XHR3aGlsZShpIDwgbGVuKSB7XHJcblx0XHRcdGlmKGluc3RhbmNlUHJvcGVydGllc1tpXS5uYW1lID09PSBzZWxlY3Rvcikge1xyXG5cdFx0XHRcdHJldHVybiBpbnN0YW5jZVByb3BlcnRpZXNbaV0udmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0aSArPSAxO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaGFzUHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiAhIWdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5KHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IpO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRoYXNQcm9wZXJ0eTogaGFzUHJvcGVydHksXHJcblx0XHRnZXRQcm9wZXJ0eTogZ2V0UHJvcGVydHlcclxuXHR9XHJcblxyXG5cdHJldHVybiBtZXRob2RzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleVBhdGhOb2RlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL3RyYW5zZm9ybS9UcmFuc2Zvcm0nKTtcclxuXHJcbmZ1bmN0aW9uIExheWVyQmFzZShzdGF0ZSkge1xyXG5cclxuXHR2YXIgdHJhbnNmb3JtID0gVHJhbnNmb3JtKHN0YXRlLmVsZW1lbnQpO1xyXG5cclxuXHRmdW5jdGlvbiBfZ2V0VHJhbnNmb3JtKCkge1xyXG5cdFx0cmV0dXJuIHRyYW5zZm9ybTtcclxuXHR9XHJcblxyXG5cdHN0YXRlLnByb3BlcnRpZXMucHVzaCh7XHJcblx0XHRuYW1lOiAndHJhbnNmb3JtJyxcclxuXHRcdHZhbHVlOiB0cmFuc2Zvcm1cclxuXHR9KVxyXG5cclxuXHRmdW5jdGlvbiBnZXROYW1lKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLmVsZW1lbnQuZGF0YS5ubTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFR5cGUoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudC5kYXRhLnR5O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0RHVyYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudC5kYXRhLm9wIC0gc3RhdGUuZWxlbWVudC5kYXRhLmlwO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0RWxlbWVudCgpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5lbGVtZW50O1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXROYW1lOiBnZXROYW1lLFxyXG5cdFx0Z2V0VHlwZTogZ2V0VHlwZSxcclxuXHRcdGdldER1cmF0aW9uOiBnZXREdXJhdGlvbixcclxuXHRcdGdldFRhcmdldEVsZW1lbnQ6IGdldFRhcmdldEVsZW1lbnRcclxuXHR9XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbmFtZScsIHtcclxuXHRcdGdldDogZ2V0TmFtZSxcclxuXHRcdGVudW1lcmFibGU6IHRydWVcclxuXHR9KVxyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobWV0aG9kcywgJ3RyYW5zZm9ybScsIHtcclxuXHRcdGdldDogX2dldFRyYW5zZm9ybSxcclxuXHRcdGVudW1lcmFibGU6IHRydWVcclxuXHR9KVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyQmFzZTsiLCJ2YXIgbGF5ZXJfdHlwZXMgPSByZXF1aXJlKCcuLi9lbnVtcy9sYXllcl90eXBlcycpO1xyXG52YXIgbGF5ZXJfYXBpID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXllckFQSUJ1aWxkZXInKTtcclxuXHJcbmZ1bmN0aW9uIExheWVyTGlzdChlbGVtZW50cykge1xyXG5cclxuXHRmdW5jdGlvbiBfZ2V0TGVuZ3RoKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmxlbmd0aDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgdHlwZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEudHkgPT09IGxheWVyX3R5cGVzW3R5cGVdO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIG5hbWUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLm5tID09PSBuYW1lO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnMoKSB7XHJcblx0XHQgcmV0dXJuIExheWVyTGlzdChlbGVtZW50cyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeVR5cGUodHlwZSkge1xyXG5cdFx0dmFyIGVsZW1lbnRzTGlzdCA9IF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgdHlwZSk7XHJcblx0XHRyZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzTGlzdCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeU5hbWUodHlwZSkge1xyXG5cdFx0dmFyIGVsZW1lbnRzTGlzdCA9IF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgdHlwZSk7XHJcblx0XHRyZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzTGlzdCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBsYXllcihpbmRleCkge1xyXG5cdFx0aWYgKGluZGV4ID49IGVsZW1lbnRzLmxlbmd0aCkge1xyXG5cdFx0XHRyZXR1cm4gW107XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbGF5ZXJfYXBpKGVsZW1lbnRzW3BhcnNlSW50KGluZGV4KV0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkSXRlcmF0YWJsZU1ldGhvZHMoaXRlcmF0YWJsZU1ldGhvZHMsIGxpc3QpIHtcclxuXHRcdGl0ZXJhdGFibGVNZXRob2RzLnJlZHVjZShmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUpe1xyXG5cdFx0XHR2YXIgX3ZhbHVlID0gdmFsdWU7XHJcblx0XHRcdGFjY3VtdWxhdG9yW3ZhbHVlXSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xyXG5cdFx0XHRcdHJldHVybiBlbGVtZW50cy5tYXAoZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRcdFx0XHR2YXIgbGF5ZXIgPSBsYXllcl9hcGkoZWxlbWVudCk7XHJcblx0XHRcdFx0XHRpZihsYXllcltfdmFsdWVdKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBsYXllcltfdmFsdWVdLmFwcGx5KG51bGwsIF9hcmd1bWVudHMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGFjY3VtdWxhdG9yO1xyXG5cdFx0fSwgbWV0aG9kcyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRUYXJnZXRFbGVtZW50cygpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbmNhdChsaXN0KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuY29uY2F0KGxpc3QuZ2V0VGFyZ2V0RWxlbWVudHMoKSk7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldExheWVyczogZ2V0TGF5ZXJzLFxyXG5cdFx0Z2V0TGF5ZXJzQnlUeXBlOiBnZXRMYXllcnNCeVR5cGUsXHJcblx0XHRnZXRMYXllcnNCeU5hbWU6IGdldExheWVyc0J5TmFtZSxcclxuXHRcdGxheWVyOiBsYXllcixcclxuXHRcdGNvbmNhdDogY29uY2F0LFxyXG5cdFx0Z2V0VGFyZ2V0RWxlbWVudHM6IGdldFRhcmdldEVsZW1lbnRzXHJcblx0fTtcclxuXHJcblx0YWRkSXRlcmF0YWJsZU1ldGhvZHMoWydzZXRUcmFuc2xhdGUnLCAnZ2V0VHlwZScsICdnZXREdXJhdGlvbiddKTtcclxuXHRhZGRJdGVyYXRhYmxlTWV0aG9kcyhbJ3NldFRleHQnLCAnZ2V0VGV4dCcsICdzZXREb2N1bWVudERhdGEnLCAnY2FuUmVzaXplRm9udCcsICdzZXRNaW5pbXVtRm9udFNpemUnXSk7XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbGVuZ3RoJywge1xyXG5cdFx0Z2V0OiBfZ2V0TGVuZ3RoXHJcblx0fSk7XHJcblx0cmV0dXJuIG1ldGhvZHM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJMaXN0OyIsInZhciBMYXllckxpc3QgPSByZXF1aXJlKCcuLi9MYXllckxpc3QnKTtcclxudmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG5cclxuZnVuY3Rpb24gQ29tcG9zaXRpb24oc3RhdGUpIHtcclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fVxyXG5cdFx0LCBMYXllckxpc3Qoc3RhdGUuZWxlbWVudHMpXHJcblx0XHQsIExheWVyQmFzZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0aW9uOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIEltYWdlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJCYXNlKGVsZW1lbnQpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZTsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBOdWxsRWxlbWVudCgpIHtcclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJCYXNlKGVsZW1lbnQpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOdWxsRWxlbWVudDsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBTaGFwZUdyb3VwID0gcmVxdWlyZSgnLi9TaGFwZUdyb3VwJyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZShlbGVtZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpIHtcclxuXHRcdHZhciBvYiA9IHtcclxuXHRcdFx0bmFtZTogc2hhcGUubm1cclxuXHRcdH1cclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYiwgJ3ZhbHVlJywge1xyXG5cdFx0ICAgZ2V0KCkgeyBcclxuXHQgICBcdFx0aWYoc2hhcGUudHkgPT09ICdncicpIHtcclxuXHQgICBcdFx0XHR2YXIgZ3JvdXAgPSBTaGFwZUdyb3VwKGVsZW1lbnQuaXRlbXNEYXRhW2luZGV4XSwgc2hhcGUpXHJcblx0ICAgXHRcdFx0cmV0dXJuIGdyb3VwXHJcblx0ICAgXHRcdH1cclxuXHRcdCAgIH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG9iXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHZhciBzaGFwZXMgPSBlbGVtZW50LmRhdGEuc2hhcGVzLm1hcChmdW5jdGlvbihzaGFwZSwgaW5kZXgpIHtcclxuXHRcdFx0cmV0dXJuIGJ1aWxkU2hhcGVPYmplY3Qoc2hhcGUsIGluZGV4KVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gc2hhcGVzXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVGaWxsKGVsZW1lbnQpIHtcclxuXHJcblx0Y29uc29sZS5sb2coZWxlbWVudClcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRDb2xvcih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5jKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdjb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdvcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUZpbGw7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFNoYXBlUmVjdGFuZ2xlID0gcmVxdWlyZSgnLi9TaGFwZVJlY3RhbmdsZScpO1xyXG52YXIgU2hhcGVGaWxsID0gcmVxdWlyZSgnLi9TaGFwZUZpbGwnKTtcclxudmFyIFNoYXBlU3Ryb2tlID0gcmVxdWlyZSgnLi9TaGFwZVN0cm9rZScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVHcm91cChlbGVtZW50LCBkYXRhKSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0ZGF0YTogZGF0YSxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkU2hhcGVPYmplY3Qoc2hhcGUsIGluZGV4KSB7XHJcblx0XHR2YXIgb2IgPSB7XHJcblx0XHRcdG5hbWU6IHNoYXBlLm5tXHJcblx0XHR9XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2IsICd2YWx1ZScsIHtcclxuXHRcdCAgIGdldCgpIHsgXHJcblx0ICAgXHRcdGlmKHNoYXBlLnR5ID09PSAncmMnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlUmVjdGFuZ2xlKGVsZW1lbnQuaXRbaW5kZXhdLCBzaGFwZSlcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnZmwnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlRmlsbChlbGVtZW50Lml0W2luZGV4XSwgc2hhcGUpXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3N0Jykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVN0cm9rZShlbGVtZW50Lml0W2luZGV4XSwgc2hhcGUpXHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3RyJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVN0cm9rZShlbGVtZW50Lml0W2luZGV4XSwgc2hhcGUpXHJcblx0ICAgXHRcdH0gZWxzZSB7XHJcblx0ICAgXHRcdFx0Y29uc29sZS5sb2coc2hhcGUudHkpXHJcblx0ICAgXHRcdH1cclxuXHRcdCAgIH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG9iXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHZhciBzaGFwZXMgPSBkYXRhLml0Lm1hcChmdW5jdGlvbihzaGFwZSwgaW5kZXgpIHtcclxuXHRcdFx0cmV0dXJuIGJ1aWxkU2hhcGVPYmplY3Qoc2hhcGUsIGluZGV4KVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gc2hhcGVzXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBLZXlQYXRoTm9kZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlR3JvdXA7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUmVjdGFuZ2xlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2l6ZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3VuZG5lc3ModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3NpemUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2l6ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdwb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdyb3VuZG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Um91bmRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVSZWN0YW5nbGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlU3Ryb2tlKGVsZW1lbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRDb2xvcih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5jKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZVdpZHRoKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LncpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdjb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdzdHJva2Ugd2lkdGgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlV2lkdGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnb3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVTdHJva2UiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBTb2xpZChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3dpZHRoJyxcclxuXHRcdFx0XHR2YWx1ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHJldHVybiAxMDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb2xpZDsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0KGVsZW1lbnQpIHtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGV4dCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LnRleHRQcm9wZXJ0eS5jdXJyZW50RGF0YS50O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0VGV4dCh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHNldERvY3VtZW50RGF0YSh7dDogdmFsdWV9LCBpbmRleCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXREb2N1bWVudERhdGEoZGF0YSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LnVwZGF0ZURvY3VtZW50RGF0YShkYXRhLCBpbmRleCk7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGNhblJlc2l6ZUZvbnQoX2NhblJlc2l6ZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuY2FuUmVzaXplRm9udChfY2FuUmVzaXplKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE1pbmltdW1Gb250U2l6ZShfZm9udFNpemUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LnNldE1pbmltdW1Gb250U2l6ZShfZm9udFNpemUpO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRUZXh0OiBnZXRUZXh0LFxyXG5cdFx0c2V0VGV4dDogc2V0VGV4dCxcclxuXHRcdGNhblJlc2l6ZUZvbnQ6IGNhblJlc2l6ZUZvbnQsXHJcblx0XHRzZXREb2N1bWVudERhdGE6IHNldERvY3VtZW50RGF0YSxcclxuXHRcdHNldE1pbmltdW1Gb250U2l6ZTogc2V0TWluaW11bUZvbnRTaXplXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJCYXNlKGVsZW1lbnQpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0OyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBUcmFuc2Zvcm0oZWxlbWVudCkge1xyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEFuY2hvclBvaW50KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmZpbmFsVHJhbnNmb3JtLm1Qcm9wLmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmZpbmFsVHJhbnNmb3JtLm1Qcm9wLnApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFNjYWxlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmZpbmFsVHJhbnNmb3JtLm1Qcm9wLnMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmZpbmFsVHJhbnNmb3JtLm1Qcm9wLnIpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuZmluYWxUcmFuc2Zvcm0ubVByb3Aubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3NjYWxlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFNjYWxlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3JvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ29wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTsiLCJmdW5jdGlvbiBQcm9wZXJ0eShwcm9wZXJ0eSkge1xyXG5cdFxyXG5cdGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlKSB7XHJcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHByb3BlcnR5LmFkZEVmZmVjdCh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnByb3BUeXBlID09PSAnbXVsdGlkaW1lbnNpb25hbCcgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5sZW5ndGggPT09IDIpIHtcclxuXHRcdFx0cHJvcGVydHkuYWRkRWZmZWN0KGZ1bmN0aW9uKCl7cmV0dXJuIHZhbHVlfSk7XHJcblx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnByb3BUeXBlID09PSAndW5pZGltZW5zaW9uYWwnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0cHJvcGVydHkuYWRkRWZmZWN0KGZ1bmN0aW9uKCl7cmV0dXJuIHZhbHVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdHNldFZhbHVlOiBzZXRWYWx1ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFByb3BlcnR5OyIsInZhciBMYXllckxpc3QgPSByZXF1aXJlKCcuLi9sYXllci9MYXllckxpc3QnKTtcclxudmFyIEtleVBhdGhMaXN0ID0gcmVxdWlyZSgnLi4va2V5X3BhdGgvS2V5UGF0aExpc3QnKTtcclxuXHJcbmZ1bmN0aW9uIFJlbmRlcmVyKHN0YXRlKSB7XHJcblxyXG5cdHN0YXRlLl90eXBlID0gJ3JlbmRlcmVyJztcclxuXHJcblx0ZnVuY3Rpb24gZ2V0UmVuZGVyZXJUeXBlKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLmFuaW1hdGlvbi5hbmltVHlwZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHtcclxuXHRcdGdldFJlbmRlcmVyVHlwZTogZ2V0UmVuZGVyZXJUeXBlXHJcblx0fSwgTGF5ZXJMaXN0KHN0YXRlLmVsZW1lbnRzKSwgS2V5UGF0aExpc3Qoc3RhdGUuZWxlbWVudHMsICdyZW5kZXJlcicpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjsiXX0=
