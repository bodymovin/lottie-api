function ValueProperty(state) {
	
	function setValue(value) {
		var property = state.property;
		if(!property || !property.addEffect) {
			return;
		}
		if (typeof value === 'function') {
			return property.addEffect(value);
		} else if (property.propType === 'multidimensional' && typeof value === 'object' && value.length === 2) {
			return property.addEffect(function(){return value});
		} else if (property.propType === 'unidimensional' && typeof value === 'number') {
			return property.addEffect(function(){return value});
		}
	}

	function getValue() {
		return state.property.v;
	}

	var methods = {
		setValue: setValue,
		getValue: getValue
	}

	return methods;
}

module.exports = ValueProperty;