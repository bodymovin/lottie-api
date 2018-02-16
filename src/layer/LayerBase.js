var KeyPathNode = require('../key_path/KeyPathNode');
var Transform = require('./transform/Transform');
var Effects = require('./effects/Effects');

function LayerBase(state) {

	var transform = Transform(state.element.finalTransform.mProp);
	var effects = Effects(state.element.effectsManager.effectElements);

	function _buildPropertyMap() {
		state.properties.push({
			name: 'transform',
			value: transform
		},{
			name: 'Transform',
			value: transform
		},{
			name: 'Effects',
			value: effects
		},{
			name: 'effects',
			value: effects
		})
	}

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

	_buildPropertyMap();

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = LayerBase;