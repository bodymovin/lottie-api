var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeEllipse(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setSize(value) {
		Property(element.sh.s).setValue(value);
	}

	function setPosition(value) {
		Property(element.sh.p).setValue(value);
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
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeEllipse;