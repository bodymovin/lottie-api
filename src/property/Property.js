var KeyPathNode = require('../key_path/KeyPathNode');
var ValueProperty = require('./ValueProperty');

function Property(property, parent) {
	var state = {
		property: property,
		parent: parent
	}

	var methods = {}

	return Object.assign({}, methods, ValueProperty(state), KeyPathNode(state));
}

module.exports = Property;