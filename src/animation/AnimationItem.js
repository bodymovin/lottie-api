var Renderer = require('../renderer/Renderer');
var layer_api = require('../helpers/layerAPIBuilder');

function AnimationItemFactory(animation) {

	var state = {
		animation: animation,
		elements: animation.renderer.elements.map((item) => layer_api(item, animation)),
		boundingRect: null,
		scaleData: null
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
		var points = [];
		for (i = 0; i < len; i += 1) {
			points.push(properties.getPropertyAtIndex(i).toKeypathLayerPoint(point));
		}
		if(points.length === 1) {
			return points[0];
		}
		return points;
	}

	function fromKeypathLayerPoint(properties, point) {
		var i, len = properties.length;
		var points = [];
		for (i = 0; i < len; i += 1) {
			points.push(properties.getPropertyAtIndex(i).fromKeypathLayerPoint(point));
		}
		if(points.length === 1) {
			return points[0];
		}
		return points;
	}

	function calculateScaleData(boundingRect) {
		var compWidth = animation.animationData.w;
        var compHeight = animation.animationData.h;
		var compRel = compWidth / compHeight;
        var elementWidth = boundingRect.width;
        var elementHeight = boundingRect.height;
        var elementRel = elementWidth / elementHeight;
        var scale,scaleXOffset,scaleYOffset;
        var xAlignment, yAlignment, scaleMode;
        var aspectRatio = animation.renderer.renderConfig.preserveAspectRatio.split(' ');
        if(aspectRatio[1] === 'meet') {
        	scale = elementRel > compRel ? elementHeight / compHeight : elementWidth / compWidth;
        } else {
        	scale = elementRel > compRel ? elementWidth / compWidth : elementHeight / compHeight;
        }
        xAlignment = aspectRatio[0].substr(0,4);
        yAlignment = aspectRatio[0].substr(4);
        if(xAlignment === 'xMin') {
        	scaleXOffset = 0;
        } else if(xAlignment === 'xMid') {
        	scaleXOffset = (elementWidth - compWidth * scale) / 2;
        } else {
        	scaleXOffset = (elementWidth - compWidth * scale);
        }

        if(yAlignment === 'YMin') {
	        scaleYOffset = 0;
        } else if(yAlignment === 'YMid') {
	        scaleYOffset = (elementHeight - compHeight * scale) / 2;
        } else {
	        scaleYOffset = (elementHeight - compHeight * scale);
        }
        return {
        	scaleYOffset: scaleYOffset,
        	scaleXOffset: scaleXOffset,
        	scale: scale
        }
	}

	function recalculateSize(container) {
		var container = animation.wrapper;
		state.boundingRect = container.getBoundingClientRect();
		state.scaleData = calculateScaleData(state.boundingRect);
	}

	function toContainerPoint(point) {
		if(!animation.wrapper || !animation.wrapper.getBoundingClientRect) {
			return point;
		}
		if(!state.boundingRect) {
			recalculateSize();
		}

		var boundingRect = state.boundingRect;
		var newPoint = [point[0] - boundingRect.left, point[1] - boundingRect.top];
		var scaleData = state.scaleData;

        newPoint[0] = (newPoint[0] - scaleData.scaleXOffset) / scaleData.scale;
        newPoint[1] = (newPoint[1] - scaleData.scaleYOffset) / scaleData.scale;

		return newPoint;
	}

	function fromContainerPoint(point) {
		if(!animation.wrapper || !animation.wrapper.getBoundingClientRect) {
			return point;
		}
		if(!state.boundingRect) {
			recalculateSize();
		}
		var boundingRect = state.boundingRect;
		var scaleData = state.scaleData;

		var newPoint = [point[0] * scaleData.scale + scaleData.scaleXOffset, point[1] * scaleData.scale + scaleData.scaleYOffset];

		var newPoint = [newPoint[0] + boundingRect.left, newPoint[1] + boundingRect.top];
		return newPoint;
	}

	function getScaleData() {
		return state.scaleData;
	}

	var methods = {
		recalculateSize: recalculateSize,
		getScaleData: getScaleData,
		toContainerPoint: toContainerPoint,
		fromContainerPoint: fromContainerPoint,
		getCurrentFrame: getCurrentFrame,
		getCurrentTime: getCurrentTime,
		addValueCallback: addValueCallback,
		toKeypathLayerPoint: toKeypathLayerPoint,
		fromKeypathLayerPoint: fromKeypathLayerPoint
	}

	return Object.assign({}, Renderer(state), methods);
}

module.exports = AnimationItemFactory;