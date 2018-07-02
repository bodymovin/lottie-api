var KeyPathNode = require('../key_path/KeyPathNode');
var ValueProperty = require('./ValueProperty');

function Property(property, parent) {
	var state = {
		property: property,
		parent: parent
	}

	function destroy() {
		state.property = null;
		state.parent = null;
	}

	var methods = {
		destroy: destroy
	}

	return Object.assign({}, methods, ValueProperty(state), KeyPathNode(state));
}

module.exports = Property;