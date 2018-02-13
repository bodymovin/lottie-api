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
		console.log('ASDASD', props.r)
		Property(props.r).setValue(value);
	}

	function setOpacity(value) {
		Property(props.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'scale',
				value: {
					setValue: setScale
				}
			},
			{
				name: 'rotation',
				value: {
					setValue: setRotation
				}
			},
			{
				name: 'opacity',
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