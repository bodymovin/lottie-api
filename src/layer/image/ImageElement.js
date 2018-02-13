var LayerBase = require('../LayerBase');

function Image(element) {

	var methods = {
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = Image;