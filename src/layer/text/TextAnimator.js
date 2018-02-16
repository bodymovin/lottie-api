var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function TextAnimator(animator) {

	var instance = {}

	var state = {
		properties: _buildPropertyMap()
	}

	function setAnchorPoint(value) {
		Property(animator.a.a).setValue(value);
	}

	function setFillBrightness(value) {
		Property(animator.a.fb).setValue(value);
	}

	function setFillColor(value) {
		Property(animator.a.fc).setValue(value);
	}

	function setFillHue(value) {
		Property(animator.a.fh).setValue(value);
	}

	function setFillSaturation(value) {
		Property(animator.a.fs).setValue(value);
	}

	function setFillOpacity(value) {
		Property(animator.a.fo).setValue(value);
	}

	function setOpacity(value) {
		Property(animator.a.o).setValue(value);
	}

	function setPosition(value) {
		Property(animator.a.p).setValue(value);
	}

	function setRotation(value) {
		Property(animator.a.r).setValue(value);
	}

	function setRotationX(value) {
		Property(animator.a.rx).setValue(value);
	}

	function setRotationY(value) {
		Property(animator.a.ry).setValue(value);
	}

	function setScale(value) {
		Property(animator.a.s).setValue(value);
	}

	function setSkewAxis(value) {
		Property(animator.a.sa).setValue(value);
	}

	function setStrokeColor(value) {
		Property(animator.a.sc).setValue(value);
	}

	function setSkew(value) {
		Property(animator.a.sk).setValue(value);
	}

	function setStrokeOpacity(value) {
		Property(animator.a.so).setValue(value);
	}

	function setStrokeWidth(value) {
		Property(animator.a.sw).setValue(value);
	}

	function setStrokeBrightness(value) {
		Property(animator.a.sb).setValue(value);
	}

	function setStrokeHue(value) {
		Property(animator.a.sh).setValue(value);
	}

	function setStrokeSaturation(value) {
		Property(animator.a.ss).setValue(value);
	}

	function setTrackingAmount(value) {
		Property(animator.a.t).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name:'Anchor Point',
				value: {
					setValue: setAnchorPoint
				}
			},
			{
				name:'Fill Brightness',
				value: {
					setValue: setFillBrightness
				}
			},
			{
				name:'Fill Color',
				value: {
					setValue: setFillColor
				}
			},
			{
				name:'Fill Hue',
				value: {
					setValue: setFillHue
				}
			},
			{
				name:'Fill Saturation',
				value: {
					setValue: setFillSaturation
				}
			},
			{
				name:'Fill Opacity',
				value: {
					setValue: setFillOpacity
				}
			},
			{
				name:'Opacity',
				value: {
					setValue: setOpacity
				}
			},
			{
				name:'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name:'Rotation X',
				value: {
					setValue: setRotationX
				}
			},
			{
				name:'Rotation Y',
				value: {
					setValue: setRotationY
				}
			},
			{
				name:'Scale',
				value: {
					setValue: setScale
				}
			},
			{
				name:'Skew Axis',
				value: {
					setValue: setSkewAxis
				}
			},
			{
				name:'Stroke Color',
				value: {
					setValue: setStrokeColor
				}
			},
			{
				name:'Skew',
				value: {
					setValue: setSkew
				}
			},
			{
				name:'Stroke Width',
				value: {
					setValue: setStrokeWidth
				}
			},
			{
				name:'Tracking Amount',
				value: {
					setValue: setTrackingAmount
				}
			},
			{
				name:'Stroke Opacity',
				value: {
					setValue: setStrokeOpacity
				}
			},
			{
				name:'Stroke Brightness',
				value: {
					setValue: setStrokeBrightness
				}
			},
			{
				name:'Stroke Saturation',
				value: {
					setValue: setStrokeSaturation
				}
			},
			{
				name:'Stroke Hue',
				value: {
					setValue: setStrokeHue
				}
			},
			
		]
	}

	var methods = {
	}

	return Object.assign(instance, methods, KeyPathNode(state));

}

module.exports = TextAnimator;