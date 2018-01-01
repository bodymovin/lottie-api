var LayerItem = require('../LayerItem');

function Shape(element) {

	var methods = {
	}

	return Object.assign({}, LayerItem(element), methods);
}

module.exports = Shape;