var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Transform(element) {
	var state = {
		properties: _buildPropertyMap()
	}

	function setAnchorPoint(value) {
		Property(element.finalTransform.mProp.a).setValue(value);
	}

	function setPosition(value) {
		Property(element.finalTransform.mProp.p).setValue(value);
	}

	function setScale(value) {
		Property(element.finalTransform.mProp.s).setValue(value);
	}

	function setRotation(value) {
		Property(element.finalTransform.mProp.r).setValue(value);
	}

	function setOpacity(value) {
		Property(element.finalTransform.mProp.o).setValue(value);
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