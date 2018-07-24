var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Transform(props, parent) {
	var state = {
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Anchor Point',
				value: Property(props.a, parent)
			},
			{
				name: 'Point of Interest',
				value: Property(props.a, parent)
			},
			{
				name: 'Position',
				value: Property(props.p, parent)
			},
			{
				name: 'Scale',
				value: Property(props.s, parent)
			},
			{
				name: 'Rotation',
				value: Property(props.r, parent)
			},
			{
				name: 'X Position',
				value: Property(props.px, parent)
			},
			{
				name: 'Y Position',
				value: Property(props.py, parent)
			},
			{
				name: 'Z Position',
				value: Property(props.pz, parent)
			},
			{
				name: 'X Rotation',
				value: Property(props.rx, parent)
			},
			{
				name: 'Y Rotation',
				value: Property(props.ry, parent)
			},
			{
				name: 'Z Rotation',
				value: Property(props.rz, parent)
			},
			{
				name: 'Opacity',
				value: Property(props.o, parent)
			}
		]
	}

	function getTargetTransform() {
		return props;
	}

	var methods = {
		getTargetTransform: getTargetTransform
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Transform;