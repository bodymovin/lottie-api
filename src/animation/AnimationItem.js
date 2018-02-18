var Renderer = require('../renderer/Renderer');
var layer_api = require('../helpers/layerAPIBuilder');

function AnimationItemFactory(animation) {

	var state = {
		animation: animation,
		elements: animation.renderer.elements.map((item) => layer_api(item))
	}

	function getCurrentFrame() {
		return animation.currentFrame;
	}

	function getCurrentTime() {
		return animation.currentFrame / animation.frameRate;
	}

	function addValueCallback(properties, value) {
		var i, len = properties.length;
		for (i = 0; i < len; i += 1) {
			properties.getPropertyAtIndex(i).setValue(value);
		}
	}

	function toKeypathLayerPoint(properties, point) {
		var i, len = properties.length;
		for (i = 0; i < len; i += 1) {
			return properties.getPropertyAtIndex(i).toKeypathLayerPoint(point);
		}
	}

	function fromKeypathLayerPoint(properties, point) {
		var i, len = properties.length;
		for (i = 0; i < len; i += 1) {
			return properties.getPropertyAtIndex(i).fromKeypathLayerPoint(point);
		}
	}

	function getKeyPath() {

	}

	var methods = {
		getCurrentFrame: getCurrentFrame,
		getKeyPath: getKeyPath,
		getCurrentTime: getCurrentTime,
		addValueCallback: addValueCallback,
		toKeypathLayerPoint: toKeypathLayerPoint,
		fromKeypathLayerPoint: fromKeypathLayerPoint
	}

	return Object.assign({}, Renderer(state), methods);
}

module.exports = AnimationItemFactory;