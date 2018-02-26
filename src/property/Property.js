var KeyPathNode = require('../key_path/KeyPathNode');

function Property(property, parent) {

	var state = {
		property: property,
		parent: parent
	}
	
	function setValue(value) {
		var property = state.property;
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

	function getValue() {
		return property.v;
	}

	var methods = {
		setValue: setValue,
		getValue: getValue
	}

	return Object.assign(state, methods, KeyPathNode(state));
}

module.exports = Property;