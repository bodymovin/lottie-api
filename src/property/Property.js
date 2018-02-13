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