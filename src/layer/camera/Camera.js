var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Camera(element) {
	console.log('element: ', element)

	var instance = {};

	var state = {
		element: element,
		properties: _buildPropertyMap()
	}

	function setPointOfInterest(value) {
		Property(element.a).setValue(value);
	}

	function setZoom(value) {
		Property(element.pe).setValue(value);
	}

	function setPosition(value) {
		Property(element.p).setValue(value);
	}

	function setXRotation(value) {
		Property(element.rx).setValue(value);
	}

	function setYRotation(value) {
		Property(element.ry).setValue(value);
	}

	function setZRotation(value) {
		Property(element.rz).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Point of Interest',
				value: {
					setValue: setPointOfInterest
				}
			},
			{
				name: 'Zoom',
				value: {
					setValue: setZoom
				}
			},
			{
				name: 'Position',
				value: {
					setValue: setPosition
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
			}
		]
	}

	var methods = {
	}

	return Object.assign(instance, KeyPathNode(state), methods);
}

module.exports = Camera;