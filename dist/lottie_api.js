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

	return Object.assign({
		getCurrentFrame: getCurrentFrame,
		getCurrentTime: getCurrentTime
	}, Renderer(state));
}

module.exports = AnimationItemFactory;
},{"../renderer/Renderer":11}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
var AnimationItem = require('./animation/AnimationItem');

function createAnimationApi(anim) {
	return Object.assign({}, AnimationItem(anim));
}

module.exports = {
	createAnimationApi : createAnimationApi
}
},{"./animation/AnimationItem":1}],4:[function(require,module,exports){
function LayerItem(element) {

	function getName() {
		return element.data.nm;
	}

	function getType() {
		return element.data.ty;
	}

	function getDuration() {
		return element.data.op - element.data.ip;
	}

	function getTargetElement() {
		return element;
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

	return methods;
}

module.exports = LayerItem;
},{}],5:[function(require,module,exports){
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
},{"../enums/layer_types":2,"./LayerItem":4,"./composition/Composition":6,"./null_element/NullElement":7,"./shape/Shape":8,"./solid/SolidElement":9,"./text/Text":10}],6:[function(require,module,exports){
var LayerList = require('../LayerList');
var LayerItem = require('../LayerItem');

function Composition(state) {
	return Object.assign({}
		, LayerList(state.elements)
		, LayerItem(state));
}

module.exports = Composition;
},{"../LayerItem":4,"../LayerList":5}],7:[function(require,module,exports){
var LayerItem = require('../LayerItem');

function NullElement() {

	var methods = {
	}

	return Object.assign({}, LayerItem(element), methods);
}

module.exports = NullElement;
},{"../LayerItem":4}],8:[function(require,module,exports){
var LayerItem = require('../LayerItem');

function Shape(element) {

	var methods = {
	}

	return Object.assign({}, LayerItem(element), methods);
}

module.exports = Shape;
},{"../LayerItem":4}],9:[function(require,module,exports){
var LayerItem = require('../LayerItem');

function Solid(element) {

	var methods = {
	}

	return Object.assign({}, LayerItem(element), methods);
}

module.exports = Solid;
},{"../LayerItem":4}],10:[function(require,module,exports){
var LayerItem = require('../LayerItem');

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

	return Object.assign({}, LayerItem(element), methods);
}

module.exports = Text;
},{"../LayerItem":4}],11:[function(require,module,exports){
var LayerList = require('../layer/LayerList');

function Renderer(state) {

	function getRendererType() {
		return state.animation.animType;
	}

	return Object.assign({
		getRendererType: getRendererType
	}, LayerList(state.elements));
}

module.exports = Renderer;
},{"../layer/LayerList":5}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0uanMiLCJzcmMvZW51bXMvbGF5ZXJfdHlwZXMuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbGF5ZXIvTGF5ZXJJdGVtLmpzIiwic3JjL2xheWVyL0xheWVyTGlzdC5qcyIsInNyYy9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbi5qcyIsInNyYy9sYXllci9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGUuanMiLCJzcmMvbGF5ZXIvc29saWQvU29saWRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RleHQvVGV4dC5qcyIsInNyYy9yZW5kZXJlci9SZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL1JlbmRlcmVyJyk7XHJcblxyXG5mdW5jdGlvbiBBbmltYXRpb25JdGVtRmFjdG9yeShhbmltYXRpb24pIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0YW5pbWF0aW9uOiBhbmltYXRpb24sXHJcblx0XHRlbGVtZW50czogYW5pbWF0aW9uLnJlbmRlcmVyLl9iciB8fCBhbmltYXRpb24ucmVuZGVyZXIuZWxlbWVudHNcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRGcmFtZSgpIHtcclxuXHRcdHJldHVybiBhbmltYXRpb24uY3VycmVudEZyYW1lO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKSB7XHJcblx0XHRyZXR1cm4gYW5pbWF0aW9uLmN1cnJlbnRGcmFtZSAvIGFuaW1hdGlvbi5mcmFtZVJhdGU7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7XHJcblx0XHRnZXRDdXJyZW50RnJhbWU6IGdldEN1cnJlbnRGcmFtZSxcclxuXHRcdGdldEN1cnJlbnRUaW1lOiBnZXRDdXJyZW50VGltZVxyXG5cdH0sIFJlbmRlcmVyKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uSXRlbUZhY3Rvcnk7IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0IDA6IDAsXHJcblx0IDE6IDEsXHJcblx0IDI6IDIsXHJcblx0IDM6IDMsXHJcblx0IDQ6IDQsXHJcblx0IDU6IDUsXHJcblx0IDEzOiAxMyxcclxuXHQnY29tcCc6IDAsXHJcblx0J2NvbXBvc2l0aW9uJzogMCxcclxuXHQnc29saWQnOiAxLFxyXG5cdCdpbWFnZSc6IDIsXHJcblx0J251bGwnOiAzLFxyXG5cdCdzaGFwZSc6IDQsXHJcblx0J3RleHQnOiA1LFxyXG5cdCdjYW1lcmEnOiAxM1xyXG59IiwidmFyIEFuaW1hdGlvbkl0ZW0gPSByZXF1aXJlKCcuL2FuaW1hdGlvbi9BbmltYXRpb25JdGVtJyk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVBbmltYXRpb25BcGkoYW5pbSkge1xyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBBbmltYXRpb25JdGVtKGFuaW0pKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Y3JlYXRlQW5pbWF0aW9uQXBpIDogY3JlYXRlQW5pbWF0aW9uQXBpXHJcbn0iLCJmdW5jdGlvbiBMYXllckl0ZW0oZWxlbWVudCkge1xyXG5cclxuXHRmdW5jdGlvbiBnZXROYW1lKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS5ubTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFR5cGUoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLnR5O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0RHVyYXRpb24oKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLm9wIC0gZWxlbWVudC5kYXRhLmlwO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0RWxlbWVudCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50O1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXROYW1lOiBnZXROYW1lLFxyXG5cdFx0Z2V0VHlwZTogZ2V0VHlwZSxcclxuXHRcdGdldER1cmF0aW9uOiBnZXREdXJhdGlvbixcclxuXHRcdGdldFRhcmdldEVsZW1lbnQ6IGdldFRhcmdldEVsZW1lbnRcclxuXHR9XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbmFtZScsIHtcclxuXHRcdGdldDogZ2V0TmFtZSxcclxuXHRcdGVudW1lcmFibGU6IHRydWVcclxuXHR9KVxyXG5cclxuXHRyZXR1cm4gbWV0aG9kcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXllckl0ZW07IiwidmFyIGxheWVyX3R5cGVzID0gcmVxdWlyZSgnLi4vZW51bXMvbGF5ZXJfdHlwZXMnKTtcclxudmFyIFRleHRFbGVtZW50ID0gcmVxdWlyZSgnLi90ZXh0L1RleHQnKTtcclxudmFyIFNoYXBlRWxlbWVudCA9IHJlcXVpcmUoJy4vc2hhcGUvU2hhcGUnKTtcclxudmFyIE51bGxFbGVtZW50ID0gcmVxdWlyZSgnLi9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQnKTtcclxudmFyIFNvbGlkRWxlbWVudCA9IHJlcXVpcmUoJy4vc29saWQvU29saWRFbGVtZW50Jyk7XHJcbnZhciBJbWFnZUVsZW1lbnQgPSByZXF1aXJlKCcuL3NvbGlkL1NvbGlkRWxlbWVudCcpO1xyXG52YXIgTGF5ZXJJdGVtID0gcmVxdWlyZSgnLi9MYXllckl0ZW0nKTtcclxuXHJcbmZ1bmN0aW9uIExheWVyTGlzdChlbGVtZW50cykge1xyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllckFwaShlbGVtZW50KSB7XHJcblx0XHQvL1RPRE8gc2VhcmNoIGEgc29sdXRpb24gZm9yIHRoaXMgcmVjdXJzaXZlIGNhc2U6IGEgQ29tcG9zaXRpb24gaXMgYSBMYXllckxpc3QgYnV0IGFsc28gYSBMYXllckxpc3QgY2FuIHJldHVybiBhIENvbXBvc2l0aW9uXHJcblx0XHR2YXIgQ29tcG9zaXRpb24gPSByZXF1aXJlKCcuL2NvbXBvc2l0aW9uL0NvbXBvc2l0aW9uJyk7XHJcblx0XHR2YXIgbGF5ZXJUeXBlID0gZWxlbWVudC5kYXRhLnR5O1xyXG5cdFx0c3dpdGNoKGxheWVyVHlwZSkge1xyXG5cdFx0XHRjYXNlIDA6XHJcblx0XHRcdHJldHVybiBDb21wb3NpdGlvbihlbGVtZW50KTtcclxuXHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRyZXR1cm4gU29saWRFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0XHRjYXNlIDI6XHJcblx0XHRcdHJldHVybiBJbWFnZUVsZW1lbnQoZWxlbWVudCk7XHJcblx0XHRcdGNhc2UgMzpcclxuXHRcdFx0cmV0dXJuIE51bGxFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0XHRjYXNlIDQ6XHJcblx0XHRcdHJldHVybiBTaGFwZUVsZW1lbnQoZWxlbWVudCk7XHJcblx0XHRcdGNhc2UgNTpcclxuXHRcdFx0cmV0dXJuIFRleHRFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRyZXR1cm4gTGF5ZXJJdGVtKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2dldExlbmd0aCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5sZW5ndGg7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLnR5ID09PSBsYXllcl90eXBlc1t0eXBlXTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCBuYW1lKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS5ubSA9PT0gbmFtZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzKCkge1xyXG5cdFx0IHJldHVybiBMYXllckxpc3QoZWxlbWVudHMpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlUeXBlKHR5cGUpIHtcclxuXHRcdHZhciBlbGVtZW50c0xpc3QgPSBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpO1xyXG5cdFx0cmV0dXJuIExheWVyTGlzdChlbGVtZW50c0xpc3QpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlOYW1lKHR5cGUpIHtcclxuXHRcdHZhciBlbGVtZW50c0xpc3QgPSBfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIHR5cGUpO1xyXG5cdFx0cmV0dXJuIExheWVyTGlzdChlbGVtZW50c0xpc3QpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbGF5ZXIoaW5kZXgpIHtcclxuXHRcdGlmIChpbmRleCA+PSBlbGVtZW50cy5sZW5ndGgpIHtcclxuXHRcdFx0cmV0dXJuIFtdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGdldExheWVyQXBpKGVsZW1lbnRzW3BhcnNlSW50KGluZGV4KV0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkSXRlcmF0YWJsZU1ldGhvZHMoaXRlcmF0YWJsZU1ldGhvZHMsIGxpc3QpIHtcclxuXHRcdGl0ZXJhdGFibGVNZXRob2RzLnJlZHVjZShmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUpe1xyXG5cdFx0XHR2YXIgX3ZhbHVlID0gdmFsdWU7XHJcblx0XHRcdGFjY3VtdWxhdG9yW3ZhbHVlXSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xyXG5cdFx0XHRcdHJldHVybiBlbGVtZW50cy5tYXAoZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRcdFx0XHRpZihnZXRMYXllckFwaShlbGVtZW50KVtfdmFsdWVdKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBnZXRMYXllckFwaShlbGVtZW50KVtfdmFsdWVdLmFwcGx5KG51bGwsIF9hcmd1bWVudHMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGFjY3VtdWxhdG9yO1xyXG5cdFx0fSwgbWV0aG9kcyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRUYXJnZXRFbGVtZW50cygpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cztcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0TGF5ZXJzOiBnZXRMYXllcnMsXHJcblx0XHRnZXRMYXllcnNCeVR5cGU6IGdldExheWVyc0J5VHlwZSxcclxuXHRcdGdldExheWVyc0J5TmFtZTogZ2V0TGF5ZXJzQnlOYW1lLFxyXG5cdFx0bGF5ZXI6IGxheWVyLFxyXG5cdFx0Z2V0VGFyZ2V0RWxlbWVudHM6IGdldFRhcmdldEVsZW1lbnRzXHJcblx0fTtcclxuXHJcblx0YWRkSXRlcmF0YWJsZU1ldGhvZHMoWydzZXRUZXh0JywgJ2dldFRleHQnLCAnc2V0RG9jdW1lbnREYXRhJywgJ2NhblJlc2l6ZUZvbnQnLCAnc2V0TWluaW11bUZvbnRTaXplJywgJ2dldFR5cGUnLCAnZ2V0RHVyYXRpb24nXSk7XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbGVuZ3RoJywge1xyXG5cdFx0Z2V0OiBfZ2V0TGVuZ3RoXHJcblx0fSk7XHJcblx0cmV0dXJuIG1ldGhvZHM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJMaXN0OyIsInZhciBMYXllckxpc3QgPSByZXF1aXJlKCcuLi9MYXllckxpc3QnKTtcclxudmFyIExheWVySXRlbSA9IHJlcXVpcmUoJy4uL0xheWVySXRlbScpO1xyXG5cclxuZnVuY3Rpb24gQ29tcG9zaXRpb24oc3RhdGUpIHtcclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fVxyXG5cdFx0LCBMYXllckxpc3Qoc3RhdGUuZWxlbWVudHMpXHJcblx0XHQsIExheWVySXRlbShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0aW9uOyIsInZhciBMYXllckl0ZW0gPSByZXF1aXJlKCcuLi9MYXllckl0ZW0nKTtcclxuXHJcbmZ1bmN0aW9uIE51bGxFbGVtZW50KCkge1xyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBMYXllckl0ZW0oZWxlbWVudCksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE51bGxFbGVtZW50OyIsInZhciBMYXllckl0ZW0gPSByZXF1aXJlKCcuLi9MYXllckl0ZW0nKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJJdGVtKGVsZW1lbnQpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTsiLCJ2YXIgTGF5ZXJJdGVtID0gcmVxdWlyZSgnLi4vTGF5ZXJJdGVtJyk7XHJcblxyXG5mdW5jdGlvbiBTb2xpZChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIExheWVySXRlbShlbGVtZW50KSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29saWQ7IiwidmFyIExheWVySXRlbSA9IHJlcXVpcmUoJy4uL0xheWVySXRlbScpO1xyXG5cclxuZnVuY3Rpb24gVGV4dChlbGVtZW50KSB7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRleHQoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC50ZXh0UHJvcGVydHkuY3VycmVudERhdGEudDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFRleHQodmFsdWUsIGluZGV4KSB7XHJcblx0XHRzZXREb2N1bWVudERhdGEoe3Q6IHZhbHVlfSwgaW5kZXgpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RG9jdW1lbnREYXRhKGRhdGEsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC51cGRhdGVEb2N1bWVudERhdGEoZGF0YSwgaW5kZXgpO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBjYW5SZXNpemVGb250KF9jYW5SZXNpemUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmNhblJlc2l6ZUZvbnQoX2NhblJlc2l6ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5zZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGV4dDogZ2V0VGV4dCxcclxuXHRcdHNldFRleHQ6IHNldFRleHQsXHJcblx0XHRjYW5SZXNpemVGb250OiBjYW5SZXNpemVGb250LFxyXG5cdFx0c2V0RG9jdW1lbnREYXRhOiBzZXREb2N1bWVudERhdGEsXHJcblx0XHRzZXRNaW5pbXVtRm9udFNpemU6IHNldE1pbmltdW1Gb250U2l6ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIExheWVySXRlbShlbGVtZW50KSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dDsiLCJ2YXIgTGF5ZXJMaXN0ID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJMaXN0Jyk7XHJcblxyXG5mdW5jdGlvbiBSZW5kZXJlcihzdGF0ZSkge1xyXG5cclxuXHRmdW5jdGlvbiBnZXRSZW5kZXJlclR5cGUoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuYW5pbWF0aW9uLmFuaW1UeXBlO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe1xyXG5cdFx0Z2V0UmVuZGVyZXJUeXBlOiBnZXRSZW5kZXJlclR5cGVcclxuXHR9LCBMYXllckxpc3Qoc3RhdGUuZWxlbWVudHMpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjsiXX0=
