var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var Transform = require('../transform/Transform');

function ShapeRepeater(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setCopies(value) {
		console.log('setCopies')
		Property(element.c).setValue(value);
	}

	function setOffset(value) {
		Property(element.o).setValue(value);
	}

	function setOffset(value) {
		Property(element.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Copies',
				value: {
					setValue: setCopies
				}
			},
			{
				name: 'Offset',
				value: {
					setValue: setOffset
				}
			},
			{
				name: 'Transform',
				value: Transform(element.tr)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRepeater;