var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var EffectElement = require('./EffectElement');

function Effects(effects, parent) {

	var state = {
		parent: parent,
		properties: buildProperties()
	}

	function getValue(effectData, index) {
		var nm = effectData.data ? effectData.data.nm : index.toString();
		var effectElement = effectData.data ? Effects(effectData.effectElements, parent) : Property(effectData.p, parent);
		return {
			name: nm,
			value: effectElement
		}
	}

	function buildProperties() {
		var i, len = effects.length;
		var arr = [];
		for (i = 0; i < len; i += 1) {
			arr.push(getValue(effects[i], i));
		}
		return arr;
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Effects;