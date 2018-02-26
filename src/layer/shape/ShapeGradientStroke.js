var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientStroke(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: Property(element.s, parent)
			},
			{
				name: 'End Point',
				value: Property(element.e, parent)
			},
			{
				name: 'Opacity',
				value: Property(element.o, parent)
			},
			{
				name: 'Highlight Length',
				value: Property(element.h, parent)
			},
			{
				name: 'Highlight Angle',
				value: Property(element.a, parent)
			},
			{
				name: 'Colors',
				value: Property(element.g.prop, parent)
			},
			{
				name: 'Stroke Width',
				value: Property(element.w, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientStroke;