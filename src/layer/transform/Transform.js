var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Transform(props) {
	var state = {
		properties: _buildPropertyMap()
	}

	function setAnchorPoint(value) {
		Property(props.a).setValue(value);
	}

	function setPosition(value) {
		Property(props.p).setValue(value);
	}

	function setScale(value) {
		Property(props.s).setValue(value);
	}

	function setRotation(value) {
		Property(props.r).setValue(value);
	}

	function setXRotation(value) {
		Property(props.rx).setValue(value);
	}

	function setYRotation(value) {
		Property(props.ry).setValue(value);
	}

	function setZRotation(value) {
		Property(props.rz).setValue(value);
	}

	function setXPosition(value) {
		Property(props.px).setValue(value);
	}

	function setYPosition(value) {
		Property(props.py).setValue(value);
	}

	function setZPosition(value) {
		Property(props.pz).setValue(value);
	}

	function setOpacity(value) {
		Property(props.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'Scale',
				value: {
					setValue: setScale
				}
			},
			{
				name: 'Rotation',
				value: {
					setValue: setRotation
				}
			},
			{
				name: 'X Position',
				value: {
					setValue: setXPosition
				}
			},
			{
				name: 'Y Position',
				value: {
					setValue: setYPosition
				}
			},
			{
				name: 'Z Position',
				value: {
					setValue: setZPosition
				}
			},
			{
				name: 'X Rotation',
				value: {
					setValue: setXRotation
				}
			},
			{
				name: 'Y Rotation',
				value: {
					setValue: setYRotation
				}
			},
			{
				name: 'Z Rotation',
				value: {
					setValue: setZRotation
				}
			},
			{
				name: 'Opacity',
				value: {
					setValue: setOpacity
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Transform;