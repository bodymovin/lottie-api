var LayerBase = require('../LayerBase');

function NullElement() {

	var methods = {
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = NullElement;