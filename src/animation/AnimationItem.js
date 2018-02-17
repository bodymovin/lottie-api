var Renderer = require('../renderer/Renderer');

function AnimationItemFactory(animation) {

	var state = {
		animation: animation,
		elements: animation.renderer._br || animation.renderer.elements
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

	return Object.assign({
		getCurrentFrame: getCurrentFrame,
		getCurrentTime: getCurrentTime,
		addValueCallback: addValueCallback,
		toKeypathLayerPoint: toKeypathLayerPoint,
		fromKeypathLayerPoint: fromKeypathLayerPoint
	}, Renderer(state));
}

module.exports = AnimationItemFactory;