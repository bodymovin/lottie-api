var LayerItem = require('../LayerItem');

function Solid(element) {

	var methods = {
	}

	return Object.assign({}, LayerItem(element), methods);
}

module.exports = Solid;