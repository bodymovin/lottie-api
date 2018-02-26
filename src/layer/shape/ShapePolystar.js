var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePolystar(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Points',
				value: Property(element.sh.pt, parent)
			},
			{
				name: 'Position',
				value: Property(element.sh.p, parent)
			},
			{
				name: 'Rotation',
				value: Property(element.sh.r, parent)
			},
			{
				name: 'Inner Radius',
				value: Property(element.sh.ir, parent)
			},
			{
				name: 'Outer Radius',
				value: Property(element.sh.or, parent)
			},
			{
				name: 'Inner Roundness',
				value: Property(element.sh.is, parent)
			},
			{
				name: 'Outer Roundness',
				value: Property(element.sh.os, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePolystar;