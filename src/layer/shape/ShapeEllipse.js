var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeEllipse(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: Property(element.sh.s, parent)
			},
			{
				name: 'Position',
				value: Property(element.sh.p, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeEllipse;