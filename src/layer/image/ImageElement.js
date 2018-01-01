var LayerItem = require('../LayerItem');

function Image(element) {

	var methods = {
	}

	return Object.assign({}, LayerItem(element), methods);
}

module.exports = Image;