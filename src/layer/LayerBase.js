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