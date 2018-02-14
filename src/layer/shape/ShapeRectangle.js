var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRectangle(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setSize(value) {
		Property(element.sh.s).setValue(value);
	}

	function setPosition(value) {
		Property(element.sh.p).setValue(value);
	}

	function setRoundness(value) {
		Property(element.sh.r).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: {
					setValue: setSize
				}
			},
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'Roundness',
				value: {
					setValue: setRoundness
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRectangle;