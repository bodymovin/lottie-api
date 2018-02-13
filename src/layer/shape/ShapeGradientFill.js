var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientFill(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setStartPoint(value) {
		Property(element.s).setValue(value);
	}

	function setEndPoint(value) {
		Property(element.e).setValue(value);
	}

	function setOpacity(value) {
		Property(element.o).setValue(value);
	}

	function setHighlightLength(value) {
		Property(element.h).setValue(value);
	}

	function setHighlightAngle(value) {
		Property(element.a).setValue(value);
	}

	function setColors(value) {
		Property(element.g.prop).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: {
					setValue: setStartPoint
				}
			},
			{
				name: 'End Point',
				value: {
					setValue: setEndPoint
				}
			},
			{
				name: 'Opacity',
				value: {
					setValue: setOpacity
				}
			},
			{
				name: 'Highlight Length',
				value: {
					setValue: setHighlightLength
				}
			},
			{
				name: 'Highlight Angle',
				value: {
					setValue: setHighlightAngle
				}
			},
			{
				name: 'Colors',
				value: {
					setValue: setColors
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientFill;