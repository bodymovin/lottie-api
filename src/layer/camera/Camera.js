var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Camera(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Point of Interest',
				value: Property(element.a, parent)
			},
			{
				name: 'Zoom',
				value: Property(element.pe, parent)
			},
			{
				name: 'Position',
				value: Property(element.p, parent)
			},
			{
				name: 'X Rotation',
				value: Property(element.rx, parent)
			},
			{
				name: 'Y Rotation',
				value: Property(element.ry, parent)
			},
			{
				name: 'Z Rotation',
				value: Property(element.rz, parent)
			},
			{
				name: 'Orientation',
				value: Property(element.or, parent)
			}
		]
	}

	function getTargetLayer() {
		return state.element;
	}

	var methods = {
		getTargetLayer: getTargetLayer
	}

	return Object.assign(instance, KeyPathNode(state), methods);
}

module.exports = Camera;