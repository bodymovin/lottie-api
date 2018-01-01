var LayerItem = require('../LayerItem');

function NullElement() {

	var methods = {
	}

	return Object.assign({}, LayerItem(element), methods);
}

module.exports = NullElement;