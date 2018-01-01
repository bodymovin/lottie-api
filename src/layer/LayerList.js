var layer_types = require('../enums/layer_types');
var TextElement = require('./text/Text');
var ShapeElement = require('./shape/Shape');
var NullElement = require('./null_element/NullElement');
var SolidElement = require('./solid/SolidElement');
var ImageElement = require('./solid/SolidElement');
var LayerItem = require('./LayerItem');

function LayerList(elements) {

	function getLayerApi(element) {
		//TODO search a solution for this recursive case: a Composition is a LayerList but also a LayerList can return a Composition
		var Composition = require('./composition/Composition');
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
			return LayerItem(element);
		}
	}

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
		return getLayerApi(elements[parseInt(index)]);
	}

	function addIteratableMethods(iteratableMethods, list) {
		iteratableMethods.reduce(function(accumulator, value){
			var _value = value;
			accumulator[value] = function() {
				var _arguments = arguments;
				return elements.map(function(element){
					if(getLayerApi(element)[_value]) {
						return getLayerApi(element)[_value].apply(null, _arguments);
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

	var methods = {
		getLayers: getLayers,
		getLayersByType: getLayersByType,
		getLayersByName: getLayersByName,
		layer: layer,
		getTargetElements: getTargetElements
	};

	addIteratableMethods(['setText', 'getText', 'setDocumentData', 'canResizeFont', 'setMinimumFontSize', 'getType', 'getDuration']);

	Object.defineProperty(methods, 'length', {
		get: _getLength
	});
	return methods;
}

module.exports = LayerList;