var key_path_separator = require('../enums/key_path_separator');
var property_names = require('../enums/property_names');

function KeyPathNode(state) {

	function getPropertyByPath(selector, propertyPath) {
		var instanceProperties = state.properties || [];
		var i = 0, len = instanceProperties.length;
		while(i < len) {
			if(instanceProperties[i].name === selector) {
				return instanceProperties[i].value;
			}
			i += 1;
		}
		return null;

	}

	function hasProperty(selector) {
		return !!getPropertyByPath(selector);
	}

	function getProperty(selector) {
		return getPropertyByPath(selector);
	}

	function fromKeypathLayerPoint(point) {
		return state.parent.fromKeypathLayerPoint(point);
	}

	function toKeypathLayerPoint(point) {
		return state.parent.toKeypathLayerPoint(point);
	}

	var methods = {
		hasProperty: hasProperty,
		getProperty: getProperty,
		fromKeypathLayerPoint: fromKeypathLayerPoint,
		toKeypathLayerPoint: toKeypathLayerPoint
	}
	return methods;
}

module.exports = KeyPathNode;