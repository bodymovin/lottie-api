(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lottie_api = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Renderer = require('../renderer/Renderer');
var layer_api = require('../helpers/layerAPIBuilder');

function AnimationItemFactory(animation) {

	var state = {
		animation: animation,
		elements: animation.renderer.elements.map(function (item) {
			return layer_api(item, animation);
		}),
		boundingRect: null,
		scaleData: null
	};

	function getCurrentFrame() {
		return animation.currentFrame;
	}

	function getCurrentTime() {
		return animation.currentFrame / animation.frameRate;
	}

	function addValueCallback(properties, value) {
		var i,
		    len = properties.length;
		for (i = 0; i < len; i += 1) {
			properties.getPropertyAtIndex(i).setValue(value);
		}
	}

	function toKeypathLayerPoint(properties, point) {
		var i,
		    len = properties.length;
		var points = [];
		for (i = 0; i < len; i += 1) {
			points.push(properties.getPropertyAtIndex(i).toKeypathLayerPoint(point));
		}
		if (points.length === 1) {
			return points[0];
		}
		return points;
	}

	function fromKeypathLayerPoint(properties, point) {
		var i,
		    len = properties.length;
		var points = [];
		for (i = 0; i < len; i += 1) {
			points.push(properties.getPropertyAtIndex(i).fromKeypathLayerPoint(point));
		}
		if (points.length === 1) {
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
		var scale, scaleXOffset, scaleYOffset;
		var xAlignment, yAlignment, scaleMode;
		var aspectRatio = animation.renderer.renderConfig.preserveAspectRatio.split(' ');
		if (aspectRatio[1] === 'meet') {
			scale = elementRel > compRel ? elementHeight / compHeight : elementWidth / compWidth;
		} else {
			scale = elementRel > compRel ? elementWidth / compWidth : elementHeight / compHeight;
		}
		xAlignment = aspectRatio[0].substr(0, 4);
		yAlignment = aspectRatio[0].substr(4);
		if (xAlignment === 'xMin') {
			scaleXOffset = 0;
		} else if (xAlignment === 'xMid') {
			scaleXOffset = (elementWidth - compWidth * scale) / 2;
		} else {
			scaleXOffset = elementWidth - compWidth * scale;
		}

		if (yAlignment === 'YMin') {
			scaleYOffset = 0;
		} else if (yAlignment === 'YMid') {
			scaleYOffset = (elementHeight - compHeight * scale) / 2;
		} else {
			scaleYOffset = elementHeight - compHeight * scale;
		}
		return {
			scaleYOffset: scaleYOffset,
			scaleXOffset: scaleXOffset,
			scale: scale
		};
	}

	function recalculateSize(container) {
		var container = animation.wrapper;
		state.boundingRect = container.getBoundingClientRect();
		state.scaleData = calculateScaleData(state.boundingRect);
	}

	function toContainerPoint(point) {
		if (!animation.wrapper || !animation.wrapper.getBoundingClientRect) {
			return point;
		}
		if (!state.boundingRect) {
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
		if (!animation.wrapper || !animation.wrapper.getBoundingClientRect) {
			return point;
		}
		if (!state.boundingRect) {
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
	};

	return Object.assign({}, Renderer(state), methods);
}

module.exports = AnimationItemFactory;

},{"../helpers/layerAPIBuilder":6,"../renderer/Renderer":42}],2:[function(require,module,exports){
'use strict';

module.exports = ',';

},{}],3:[function(require,module,exports){
'use strict';

module.exports = {
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	13: 13,
	'comp': 0,
	'composition': 0,
	'solid': 1,
	'image': 2,
	'null': 3,
	'shape': 4,
	'text': 5,
	'camera': 13
};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = {
	LAYER_TRANSFORM: 'transform'
};

},{}],5:[function(require,module,exports){
'use strict';

var key_path_separator = require('../enums/key_path_separator');
var sanitizeString = require('./stringSanitizer');

module.exports = function (propertyPath) {
	var keyPathSplit = propertyPath.split(key_path_separator);
	var selector = keyPathSplit.shift();
	return {
		selector: sanitizeString(selector),
		propertyPath: keyPathSplit.join(key_path_separator)
	};
};

},{"../enums/key_path_separator":2,"./stringSanitizer":7}],6:[function(require,module,exports){
'use strict';

var TextElement = require('../layer/text/TextElement');
var ShapeElement = require('../layer/shape/Shape');
var NullElement = require('../layer/null_element/NullElement');
var SolidElement = require('../layer/solid/SolidElement');
var ImageElement = require('../layer/image/ImageElement');
var CameraElement = require('../layer/camera/Camera');
var LayerBase = require('../layer/LayerBase');

module.exports = function getLayerApi(element, parent) {
	var layerType = element.data.ty;
	var Composition = require('../layer/composition/Composition');
	switch (layerType) {
		case 0:
			return Composition(element, parent);
		case 1:
			return SolidElement(element, parent);
		case 2:
			return ImageElement(element, parent);
		case 3:
			return NullElement(element, parent);
		case 4:
			return ShapeElement(element, parent, element.data.shapes, element.itemsData);
		case 5:
			return TextElement(element, parent);
		case 13:
			return CameraElement(element, parent);
		default:
			return LayerBase(element, parent);
	}
};

},{"../layer/LayerBase":13,"../layer/camera/Camera":15,"../layer/composition/Composition":16,"../layer/image/ImageElement":20,"../layer/null_element/NullElement":21,"../layer/shape/Shape":22,"../layer/solid/SolidElement":35,"../layer/text/TextElement":38}],7:[function(require,module,exports){
"use strict";

function sanitizeString(string) {
	return string.trim();
}

module.exports = sanitizeString;

},{}],8:[function(require,module,exports){
'use strict';

var createTypedArray = require('./typedArrays');

/*!
 Transformation Matrix v2.0
 (c) Epistemex 2014-2015
 www.epistemex.com
 By Ken Fyrstenberg
 Contributions by leeoniya.
 License: MIT, header required.
 */

/**
 * 2D transformation matrix object initialized with identity matrix.
 *
 * The matrix can synchronize a canvas context by supplying the context
 * as an argument, or later apply current absolute transform to an
 * existing context.
 *
 * All values are handled as floating point values.
 *
 * @param {CanvasRenderingContext2D} [context] - Optional context to sync with Matrix
 * @prop {number} a - scale x
 * @prop {number} b - shear y
 * @prop {number} c - shear x
 * @prop {number} d - scale y
 * @prop {number} e - translate x
 * @prop {number} f - translate y
 * @prop {CanvasRenderingContext2D|null} [context=null] - set or get current canvas context
 * @constructor
 */

var Matrix = function () {

    var _cos = Math.cos;
    var _sin = Math.sin;
    var _tan = Math.tan;
    var _rnd = Math.round;

    function reset() {
        this.props[0] = 1;
        this.props[1] = 0;
        this.props[2] = 0;
        this.props[3] = 0;
        this.props[4] = 0;
        this.props[5] = 1;
        this.props[6] = 0;
        this.props[7] = 0;
        this.props[8] = 0;
        this.props[9] = 0;
        this.props[10] = 1;
        this.props[11] = 0;
        this.props[12] = 0;
        this.props[13] = 0;
        this.props[14] = 0;
        this.props[15] = 1;
        return this;
    }

    function rotate(angle) {
        if (angle === 0) {
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    function rotateX(angle) {
        if (angle === 0) {
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1);
    }

    function rotateY(angle) {
        if (angle === 0) {
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, 0, mSin, 0, 0, 1, 0, 0, -mSin, 0, mCos, 0, 0, 0, 0, 1);
    }

    function rotateZ(angle) {
        if (angle === 0) {
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    function shear(sx, sy) {
        return this._t(1, sy, sx, 1, 0, 0);
    }

    function skew(ax, ay) {
        return this.shear(_tan(ax), _tan(ay));
    }

    function skewFromAxis(ax, angle) {
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, mSin, 0, 0, -mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, _tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        //return this._t(mCos, mSin, -mSin, mCos, 0, 0)._t(1, 0, _tan(ax), 1, 0, 0)._t(mCos, -mSin, mSin, mCos, 0, 0);
    }

    function scale(sx, sy, sz) {
        sz = isNaN(sz) ? 1 : sz;
        if (sx == 1 && sy == 1 && sz == 1) {
            return this;
        }
        return this._t(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
    }

    function setTransform(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        this.props[0] = a;
        this.props[1] = b;
        this.props[2] = c;
        this.props[3] = d;
        this.props[4] = e;
        this.props[5] = f;
        this.props[6] = g;
        this.props[7] = h;
        this.props[8] = i;
        this.props[9] = j;
        this.props[10] = k;
        this.props[11] = l;
        this.props[12] = m;
        this.props[13] = n;
        this.props[14] = o;
        this.props[15] = p;
        return this;
    }

    function translate(tx, ty, tz) {
        tz = tz || 0;
        if (tx !== 0 || ty !== 0 || tz !== 0) {
            return this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
        }
        return this;
    }

    function transform(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2) {

        var _p = this.props;

        if (a2 === 1 && b2 === 0 && c2 === 0 && d2 === 0 && e2 === 0 && f2 === 1 && g2 === 0 && h2 === 0 && i2 === 0 && j2 === 0 && k2 === 1 && l2 === 0) {
            //NOTE: commenting this condition because TurboFan deoptimizes code when present
            //if(m2 !== 0 || n2 !== 0 || o2 !== 0){
            _p[12] = _p[12] * a2 + _p[15] * m2;
            _p[13] = _p[13] * f2 + _p[15] * n2;
            _p[14] = _p[14] * k2 + _p[15] * o2;
            _p[15] = _p[15] * p2;
            //}
            this._identityCalculated = false;
            return this;
        }

        var a1 = _p[0];
        var b1 = _p[1];
        var c1 = _p[2];
        var d1 = _p[3];
        var e1 = _p[4];
        var f1 = _p[5];
        var g1 = _p[6];
        var h1 = _p[7];
        var i1 = _p[8];
        var j1 = _p[9];
        var k1 = _p[10];
        var l1 = _p[11];
        var m1 = _p[12];
        var n1 = _p[13];
        var o1 = _p[14];
        var p1 = _p[15];

        /* matrix order (canvas compatible):
         * ace
         * bdf
         * 001
         */
        _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2;
        _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2;
        _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2;
        _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2;

        _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2;
        _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2;
        _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2;
        _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2;

        _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2;
        _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2;
        _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2;
        _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2;

        _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2;
        _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2;
        _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2;
        _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2;

        this._identityCalculated = false;
        return this;
    }

    function isIdentity() {
        if (!this._identityCalculated) {
            this._identity = !(this.props[0] !== 1 || this.props[1] !== 0 || this.props[2] !== 0 || this.props[3] !== 0 || this.props[4] !== 0 || this.props[5] !== 1 || this.props[6] !== 0 || this.props[7] !== 0 || this.props[8] !== 0 || this.props[9] !== 0 || this.props[10] !== 1 || this.props[11] !== 0 || this.props[12] !== 0 || this.props[13] !== 0 || this.props[14] !== 0 || this.props[15] !== 1);
            this._identityCalculated = true;
        }
        return this._identity;
    }

    function equals(matr) {
        var i = 0;
        while (i < 16) {
            if (matr.props[i] !== this.props[i]) {
                return false;
            }
            i += 1;
        }
        return true;
    }

    function clone(matr) {
        var i;
        for (i = 0; i < 16; i += 1) {
            matr.props[i] = this.props[i];
        }
    }

    function cloneFromProps(props) {
        var i;
        for (i = 0; i < 16; i += 1) {
            this.props[i] = props[i];
        }
    }

    function applyToPoint(x, y, z) {

        return {
            x: x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12],
            y: x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13],
            z: x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]
        };
        /*return {
         x: x * me.a + y * me.c + me.e,
         y: x * me.b + y * me.d + me.f
         };*/
    }
    function applyToX(x, y, z) {
        return x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12];
    }
    function applyToY(x, y, z) {
        return x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13];
    }
    function applyToZ(x, y, z) {
        return x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14];
    }

    function inversePoint(pt) {
        var determinant = this.props[0] * this.props[5] - this.props[1] * this.props[4];
        var a = this.props[5] / determinant;
        var b = -this.props[1] / determinant;
        var c = -this.props[4] / determinant;
        var d = this.props[0] / determinant;
        var e = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / determinant;
        var f = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / determinant;
        return [pt[0] * a + pt[1] * c + e, pt[0] * b + pt[1] * d + f, 0];
    }

    function inversePoints(pts) {
        var i,
            len = pts.length,
            retPts = [];
        for (i = 0; i < len; i += 1) {
            retPts[i] = inversePoint(pts[i]);
        }
        return retPts;
    }

    function applyToTriplePoints(pt1, pt2, pt3) {
        var arr = createTypedArray('float32', 6);
        if (this.isIdentity()) {
            arr[0] = pt1[0];
            arr[1] = pt1[1];
            arr[2] = pt2[0];
            arr[3] = pt2[1];
            arr[4] = pt3[0];
            arr[5] = pt3[1];
        } else {
            var p0 = this.props[0],
                p1 = this.props[1],
                p4 = this.props[4],
                p5 = this.props[5],
                p12 = this.props[12],
                p13 = this.props[13];
            arr[0] = pt1[0] * p0 + pt1[1] * p4 + p12;
            arr[1] = pt1[0] * p1 + pt1[1] * p5 + p13;
            arr[2] = pt2[0] * p0 + pt2[1] * p4 + p12;
            arr[3] = pt2[0] * p1 + pt2[1] * p5 + p13;
            arr[4] = pt3[0] * p0 + pt3[1] * p4 + p12;
            arr[5] = pt3[0] * p1 + pt3[1] * p5 + p13;
        }
        return arr;
    }

    function applyToPointArray(x, y, z) {
        var arr;
        if (this.isIdentity()) {
            arr = [x, y, z];
        } else {
            arr = [x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12], x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13], x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]];
        }
        return arr;
    }

    function applyToPointStringified(x, y) {
        if (this.isIdentity()) {
            return x + ',' + y;
        }
        return x * this.props[0] + y * this.props[4] + this.props[12] + ',' + (x * this.props[1] + y * this.props[5] + this.props[13]);
    }

    function toCSS() {
        //Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
        /*if(this.isIdentity()) {
            return '';
        }*/
        var i = 0;
        var props = this.props;
        var cssValue = 'matrix3d(';
        var v = 10000;
        while (i < 16) {
            cssValue += _rnd(props[i] * v) / v;
            cssValue += i === 15 ? ')' : ',';
            i += 1;
        }
        return cssValue;
    }

    function to2dCSS() {
        //Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
        /*if(this.isIdentity()) {
            return '';
        }*/
        var v = 10000;
        var props = this.props;
        return "matrix(" + _rnd(props[0] * v) / v + ',' + _rnd(props[1] * v) / v + ',' + _rnd(props[4] * v) / v + ',' + _rnd(props[5] * v) / v + ',' + _rnd(props[12] * v) / v + ',' + _rnd(props[13] * v) / v + ")";
    }

    function MatrixInstance() {
        this.reset = reset;
        this.rotate = rotate;
        this.rotateX = rotateX;
        this.rotateY = rotateY;
        this.rotateZ = rotateZ;
        this.skew = skew;
        this.skewFromAxis = skewFromAxis;
        this.shear = shear;
        this.scale = scale;
        this.setTransform = setTransform;
        this.translate = translate;
        this.transform = transform;
        this.applyToPoint = applyToPoint;
        this.applyToX = applyToX;
        this.applyToY = applyToY;
        this.applyToZ = applyToZ;
        this.applyToPointArray = applyToPointArray;
        this.applyToTriplePoints = applyToTriplePoints;
        this.applyToPointStringified = applyToPointStringified;
        this.toCSS = toCSS;
        this.to2dCSS = to2dCSS;
        this.clone = clone;
        this.cloneFromProps = cloneFromProps;
        this.equals = equals;
        this.inversePoints = inversePoints;
        this.inversePoint = inversePoint;
        this._t = this.transform;
        this.isIdentity = isIdentity;
        this._identity = true;
        this._identityCalculated = false;

        this.props = createTypedArray('float32', 16);
        this.reset();
    };

    return function () {
        return new MatrixInstance();
    };
}();

module.exports = Matrix;

},{"./typedArrays":9}],9:[function(require,module,exports){
'use strict';

var createTypedArray = function () {
	function createRegularArray(type, len) {
		var i = 0,
		    arr = [],
		    value;
		switch (type) {
			case 'int16':
			case 'uint8c':
				value = 1;
				break;
			default:
				value = 1.1;
				break;
		}
		for (i = 0; i < len; i += 1) {
			arr.push(value);
		}
		return arr;
	}
	function createTypedArray(type, len) {
		if (type === 'float32') {
			return new Float32Array(len);
		} else if (type === 'int16') {
			return new Int16Array(len);
		} else if (type === 'uint8c') {
			return new Uint8ClampedArray(len);
		}
	}
	if (typeof Uint8ClampedArray === 'function' && typeof Float32Array === 'function') {
		return createTypedArray;
	} else {
		return createRegularArray;
	}
}();

module.exports = createTypedArray;

},{}],10:[function(require,module,exports){
'use strict';

var AnimationItem = require('./animation/AnimationItem');

function createAnimationApi(anim) {
	return Object.assign({}, AnimationItem(anim));
}

module.exports = {
	createAnimationApi: createAnimationApi
};

},{"./animation/AnimationItem":1}],11:[function(require,module,exports){
'use strict';

var keyPathBuilder = require('../helpers/keyPathBuilder');
var layer_types = require('../enums/layer_types');

function KeyPathList(elements, node_type) {

	function _getLength() {
		return elements.length;
	}

	function _filterLayerByType(elements, type) {
		return elements.filter(function (element) {
			return element.getTargetLayer().data.ty === layer_types[type];
		});
	}

	function _filterLayerByName(elements, name) {
		return elements.filter(function (element) {
			return element.getTargetLayer().data.nm === name;
		});
	}

	function _filterLayerByProperty(elements, name) {
		return elements.filter(function (element) {
			if (element.hasProperty(name)) {
				return element.getProperty(name);
			}
			return false;
		});
	}

	function getLayersByType(selector) {
		return KeyPathList(_filterLayerByType(elements, selector), 'layer');
	}

	function getLayersByName(selector) {
		return KeyPathList(_filterLayerByName(elements, selector), 'layer');
	}

	function getPropertiesBySelector(selector) {
		return KeyPathList(elements.filter(function (element) {
			return element.hasProperty(selector);
		}).map(function (element) {
			return element.getProperty(selector);
		}), 'property');
	}

	function getLayerProperty(selector) {
		var layers = _filterLayerByProperty(elements, selector);
		var properties = layers.map(function (element) {
			return element.getProperty(selector);
		});
		return KeyPathList(properties, 'property');
	}

	function getKeyPath(propertyPath) {
		var keyPathData = keyPathBuilder(propertyPath);
		var selector = keyPathData.selector;
		var nodesByName, nodesByType, selectedNodes;
		if (node_type === 'renderer' || node_type === 'layer') {
			nodesByName = getLayersByName(selector);
			nodesByType = getLayersByType(selector);
			if (nodesByName.length === 0 && nodesByType.length === 0) {
				selectedNodes = getLayerProperty(selector);
			} else {
				selectedNodes = nodesByName.concat(nodesByType);
			}
			if (keyPathData.propertyPath) {
				return selectedNodes.getKeyPath(keyPathData.propertyPath);
			} else {
				return selectedNodes;
			}
		} else if (node_type === 'property') {
			selectedNodes = getPropertiesBySelector(selector);
			if (keyPathData.propertyPath) {
				return selectedNodes.getKeyPath(keyPathData.propertyPath);
			} else {
				return selectedNodes;
			}
		}
	}

	function concat(nodes) {
		var nodesElements = nodes.getElements();
		return KeyPathList(elements.concat(nodesElements), node_type);
	}

	function getElements() {
		return elements;
	}

	function getPropertyAtIndex(index) {
		return elements[index];
	}

	var methods = {
		getKeyPath: getKeyPath,
		concat: concat,
		getElements: getElements,
		getPropertyAtIndex: getPropertyAtIndex
	};

	Object.defineProperty(methods, 'length', {
		get: _getLength
	});

	return methods;
}

module.exports = KeyPathList;

},{"../enums/layer_types":3,"../helpers/keyPathBuilder":5}],12:[function(require,module,exports){
'use strict';

var key_path_separator = require('../enums/key_path_separator');
var property_names = require('../enums/property_names');

function KeyPathNode(state) {

	function getPropertyByPath(selector, propertyPath) {
		var instanceProperties = state.properties || [];
		var i = 0,
		    len = instanceProperties.length;
		while (i < len) {
			if (instanceProperties[i].name === selector) {
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
	};
	return methods;
}

module.exports = KeyPathNode;

},{"../enums/key_path_separator":2,"../enums/property_names":4}],13:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../key_path/KeyPathNode');
var Transform = require('./transform/Transform');
var Effects = require('./effects/Effects');
var Matrix = require('../helpers/transformationMatrix');

function LayerBase(state) {

	var transform = Transform(state.element.finalTransform.mProp, state);
	var effects = Effects(state.element.effectsManager.effectElements || [], state);

	function _buildPropertyMap() {
		state.properties.push({
			name: 'transform',
			value: transform
		}, {
			name: 'Transform',
			value: transform
		}, {
			name: 'Effects',
			value: effects
		}, {
			name: 'effects',
			value: effects
		});
	}

	function getElementToPoint(point) {}

	function toKeypathLayerPoint(point) {
		var element = state.element;
		if (state.parent.toKeypathLayerPoint) {
			point = state.parent.toKeypathLayerPoint(point);
		}
		var toWorldMat = Matrix();
		var transformMat = state.getProperty('Transform').getTargetTransform();
		transformMat.applyToMatrix(toWorldMat);
		if (element.hierarchy && element.hierarchy.length) {
			var i,
			    len = element.hierarchy.length;
			for (i = 0; i < len; i += 1) {
				element.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
			}
		}
		return toWorldMat.inversePoint(point);
	}

	function fromKeypathLayerPoint(point) {
		var element = state.element;
		var toWorldMat = Matrix();
		var transformMat = state.getProperty('Transform').getTargetTransform();
		transformMat.applyToMatrix(toWorldMat);
		if (element.hierarchy && element.hierarchy.length) {
			var i,
			    len = element.hierarchy.length;
			for (i = 0; i < len; i += 1) {
				element.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
			}
		}
		point = toWorldMat.applyToPointArray(point[0], point[1], point[2] || 0);
		if (state.parent.fromKeypathLayerPoint) {
			return state.parent.fromKeypathLayerPoint(point);
		} else {
			return point;
		}
	}

	function getTargetLayer() {
		return state.element;
	}

	var methods = {
		getTargetLayer: getTargetLayer,
		toKeypathLayerPoint: toKeypathLayerPoint,
		fromKeypathLayerPoint: fromKeypathLayerPoint
	};

	_buildPropertyMap();

	return Object.assign(state, KeyPathNode(state), methods);
}

module.exports = LayerBase;

},{"../helpers/transformationMatrix":8,"../key_path/KeyPathNode":12,"./effects/Effects":19,"./transform/Transform":39}],14:[function(require,module,exports){
'use strict';

var layer_types = require('../enums/layer_types');
var layer_api = require('../helpers/layerAPIBuilder');

function LayerList(elements) {

	function _getLength() {
		return elements.length;
	}

	function _filterLayerByType(elements, type) {
		return elements.filter(function (element) {
			return element.data.ty === layer_types[type];
		});
	}

	function _filterLayerByName(elements, name) {
		return elements.filter(function (element) {
			return element.data.nm === name;
		});
	}

	function getLayers() {
		return LayerList(elements);
	}

	function getLayersByType(type) {
		var elementsList = _filterLayerByType(elements, type);
		return LayerList(elementsList);
	}

	function getLayersByName(type) {
		var elementsList = _filterLayerByName(elements, type);
		return LayerList(elementsList);
	}

	function layer(index) {
		if (index >= elements.length) {
			return [];
		}
		return layer_api(elements[parseInt(index)]);
	}

	function addIteratableMethods(iteratableMethods, list) {
		iteratableMethods.reduce(function (accumulator, value) {
			var _value = value;
			accumulator[value] = function () {
				var _arguments = arguments;
				return elements.map(function (element) {
					var layer = layer_api(element);
					if (layer[_value]) {
						return layer[_value].apply(null, _arguments);
					}
					return null;
				});
			};
			return accumulator;
		}, methods);
	}

	function getTargetElements() {
		return elements;
	}

	function concat(list) {
		return elements.concat(list.getTargetElements());
	}

	var methods = {
		getLayers: getLayers,
		getLayersByType: getLayersByType,
		getLayersByName: getLayersByName,
		layer: layer,
		concat: concat,
		getTargetElements: getTargetElements
	};

	addIteratableMethods(['setTranslate', 'getType', 'getDuration']);
	addIteratableMethods(['setText', 'getText', 'setDocumentData', 'canResizeFont', 'setMinimumFontSize']);

	Object.defineProperty(methods, 'length', {
		get: _getLength
	});
	return methods;
}

module.exports = LayerList;

},{"../enums/layer_types":3,"../helpers/layerAPIBuilder":6}],15:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Camera(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Point of Interest',
			value: Property(element.a, parent)
		}, {
			name: 'Zoom',
			value: Property(element.pe, parent)
		}, {
			name: 'Position',
			value: Property(element.p, parent)
		}, {
			name: 'X Rotation',
			value: Property(element.rx, parent)
		}, {
			name: 'Y Rotation',
			value: Property(element.ry, parent)
		}, {
			name: 'Z Rotation',
			value: Property(element.rz, parent)
		}, {
			name: 'Orientation',
			value: Property(element.or, parent)
		}];
	}

	function getTargetLayer() {
		return state.element;
	}

	var methods = {
		getTargetLayer: getTargetLayer
	};

	return Object.assign(instance, KeyPathNode(state), methods);
}

module.exports = Camera;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],16:[function(require,module,exports){
'use strict';

var KeyPathList = require('../../key_path/KeyPathList');
var LayerBase = require('../LayerBase');
var layer_api = require('../../helpers/layerAPIBuilder');
var Property = require('../../property/Property');
var TimeRemap = require('./TimeRemap');

function Composition(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	};

	function buildLayerApi(layer, index) {
		var _layerApi = null;
		var ob = {
			name: layer.nm
		};

		function getLayerApi() {
			if (!_layerApi) {
				_layerApi = layer_api(element.elements[index], state);
			}
			return _layerApi;
		}

		Object.defineProperty(ob, 'value', {
			get: getLayerApi
		});
		return ob;
	}

	function _buildPropertyMap() {
		var compositionLayers = element.layers.map(buildLayerApi);
		return [{
			name: 'Time Remap',
			value: TimeRemap(element.tm)
		}].concat(compositionLayers);
	}

	var methods = {};

	return Object.assign(instance, LayerBase(state), KeyPathList(state.elements, 'layer'), methods);
}

module.exports = Composition;

},{"../../helpers/layerAPIBuilder":6,"../../key_path/KeyPathList":11,"../../property/Property":40,"../LayerBase":13,"./TimeRemap":17}],17:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var ValueProperty = require('../../property/ValueProperty');

function TimeRemap(property, parent) {
	var state = {
		property: property,
		parent: parent
	};

	var _isCallbackAdded = false;
	var currentSegmentInit = 0;
	var currentSegmentEnd = 0;
	var previousTime = 0,
	    currentTime = 0;
	var initTime = 0;
	var _loop = true;
	var _loopCount = 0;
	var _speed = 1;
	var _paused = false;
	var _isDebugging = false;
	var queuedSegments = [];
	var _destroyFunction;
	var enterFrameCallback = null;
	var enterFrameEvent = {
		time: -1
	};

	function playSegment(init, end, clear) {
		_paused = false;
		if (clear) {
			clearQueue();
			currentTime = init;
		}
		if (_isDebugging) {
			console.log(init, end);
		}
		_loopCount = 0;
		previousTime = Date.now();
		currentSegmentInit = init;
		currentSegmentEnd = end;
		addCallback();
	}

	function playQueuedSegment() {
		var newSegment = queuedSegments.shift();
		playSegment(newSegment[0], newSegment[1]);
	}

	function queueSegment(init, end) {
		queuedSegments.push([init, end]);
	}

	function clearQueue() {
		queuedSegments.length = 0;
	}

	function _segmentPlayer(currentValue) {
		if (currentSegmentInit === currentSegmentEnd) {
			currentTime = currentSegmentInit;
		} else if (!_paused) {
			var nowTime = Date.now();
			var elapsedTime = _speed * (nowTime - previousTime) / 1000;
			previousTime = nowTime;
			if (currentSegmentInit < currentSegmentEnd) {
				currentTime += elapsedTime;
				if (currentTime > currentSegmentEnd) {
					_loopCount += 1;
					if (queuedSegments.length) {
						playQueuedSegment();
					} else if (!_loop) {
						currentTime = currentSegmentEnd;
					} else {
						/*currentTime -= Math.floor(currentTime / (currentSegmentEnd - currentSegmentInit)) * (currentSegmentEnd - currentSegmentInit);
      currentTime = currentSegmentInit + currentTime;*/
						currentTime = currentTime % (currentSegmentEnd - currentSegmentInit);
						//currentTime = currentSegmentInit + (currentTime);
						//currentTime = currentSegmentInit + (currentTime - currentSegmentEnd);
						//console.log('CT: ', currentTime) 
					}
				}
			} else {
				currentTime -= elapsedTime;
				if (currentTime < currentSegmentEnd) {
					_loopCount += 1;
					if (queuedSegments.length) {
						playQueuedSegment();
					} else if (!_loop) {
						currentTime = currentSegmentEnd;
					} else {
						currentTime = currentSegmentInit - (currentSegmentEnd - currentTime);
					}
				}
			}
			if (_isDebugging) {
				console.log(currentTime);
			}
		}
		if (instance.onEnterFrame && enterFrameEvent.time !== currentTime) {
			enterFrameEvent.time = currentTime;
			instance.onEnterFrame(enterFrameEvent);
		}
		return currentTime;
	}

	function addCallback() {
		if (!_isCallbackAdded) {
			_isCallbackAdded = true;
			_destroyFunction = instance.setValue(_segmentPlayer, _isDebugging);
		}
	}

	function playTo(end, clear) {
		_paused = false;
		if (clear) {
			clearQueue();
		}
		addCallback();
		currentSegmentEnd = end;
	}

	function getCurrentTime() {
		if (_isCallbackAdded) {
			return currentTime;
		} else {
			return property.v / property.mult;
		}
	}

	function setLoop(flag) {
		_loop = flag;
	}

	function setSpeed(value) {
		_speed = value;
	}

	function setDebugging(flag) {
		_isDebugging = flag;
	}

	function pause() {
		_paused = true;
	}

	function destroy() {
		if (_destroyFunction) {
			_destroyFunction();
			state.property = null;
			state.parent = null;
		}
	}

	var methods = {
		playSegment: playSegment,
		playTo: playTo,
		queueSegment: queueSegment,
		clearQueue: clearQueue,
		setLoop: setLoop,
		setSpeed: setSpeed,
		pause: pause,
		setDebugging: setDebugging,
		getCurrentTime: getCurrentTime,
		onEnterFrame: null,
		destroy: destroy
	};

	var instance = {};

	return Object.assign(instance, methods, ValueProperty(state), KeyPathNode(state));
}

module.exports = TimeRemap;

},{"../../key_path/KeyPathNode":12,"../../property/ValueProperty":41}],18:[function(require,module,exports){
'use strict';

var Property = require('../../property/Property');

function EffectElement(effect, parent) {

	return Property(effect.p, parent);
}

module.exports = EffectElement;

},{"../../property/Property":40}],19:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var EffectElement = require('./EffectElement');

function Effects(effects, parent) {

	var state = {
		parent: parent,
		properties: buildProperties()
	};

	function getValue(effectData, index) {
		var nm = effectData.data ? effectData.data.nm : index.toString();
		var effectElement = effectData.data ? Effects(effectData.effectElements, parent) : Property(effectData.p, parent);
		return {
			name: nm,
			value: effectElement
		};
	}

	function buildProperties() {
		var i,
		    len = effects.length;
		var arr = [];
		for (i = 0; i < len; i += 1) {
			arr.push(getValue(effects[i], i));
		}
		return arr;
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Effects;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40,"./EffectElement":18}],20:[function(require,module,exports){
'use strict';

var LayerBase = require('../LayerBase');

function Image(element) {

	var methods = {};

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = Image;

},{"../LayerBase":13}],21:[function(require,module,exports){
'use strict';

var LayerBase = require('../LayerBase');

function NullElement(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [];
	}

	var methods = {};

	return Object.assign(instance, LayerBase(state), methods);
}

module.exports = NullElement;

},{"../LayerBase":13}],22:[function(require,module,exports){
'use strict';

var LayerBase = require('../LayerBase');
var ShapeContents = require('./ShapeContents');

function Shape(element, parent) {

	var state = {
		properties: [],
		parent: parent,
		element: element
	};
	var shapeContents = ShapeContents(element.data.shapes, element.itemsData, state);

	function _buildPropertyMap() {
		state.properties.push({
			name: 'Contents',
			value: shapeContents
		});
	}

	var methods = {};

	_buildPropertyMap();

	return Object.assign(state, LayerBase(state), methods);
}

module.exports = Shape;

},{"../LayerBase":13,"./ShapeContents":23}],23:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var ShapeRectangle = require('./ShapeRectangle');
var ShapeFill = require('./ShapeFill');
var ShapeStroke = require('./ShapeStroke');
var ShapeEllipse = require('./ShapeEllipse');
var ShapeGradientFill = require('./ShapeGradientFill');
var ShapeGradientStroke = require('./ShapeGradientStroke');
var ShapeTrimPaths = require('./ShapeTrimPaths');
var ShapeRepeater = require('./ShapeRepeater');
var ShapePolystar = require('./ShapePolystar');
var ShapeRoundCorners = require('./ShapeRoundCorners');
var ShapePath = require('./ShapePath');
var Transform = require('../transform/Transform');
var Matrix = require('../../helpers/transformationMatrix');

function ShapeContents(shapesData, shapes, parent) {
	var state = {
		properties: _buildPropertyMap(),
		parent: parent
	};

	var cachedShapeProperties = [];

	function buildShapeObject(shape, index) {
		var ob = {
			name: shape.nm
		};
		Object.defineProperty(ob, 'value', {
			get: function get() {
				if (cachedShapeProperties[index]) {
					return cachedShapeProperties[index];
				} else {
					var property;
				}
				if (shape.ty === 'gr') {
					property = ShapeContents(shapesData[index].it, shapes[index].it, state);
				} else if (shape.ty === 'rc') {
					property = ShapeRectangle(shapes[index], state);
				} else if (shape.ty === 'el') {
					property = ShapeEllipse(shapes[index], state);
				} else if (shape.ty === 'fl') {
					property = ShapeFill(shapes[index], state);
				} else if (shape.ty === 'st') {
					property = ShapeStroke(shapes[index], state);
				} else if (shape.ty === 'gf') {
					property = ShapeGradientFill(shapes[index], state);
				} else if (shape.ty === 'gs') {
					property = ShapeGradientStroke(shapes[index], state);
				} else if (shape.ty === 'tm') {
					property = ShapeTrimPaths(shapes[index], state);
				} else if (shape.ty === 'rp') {
					property = ShapeRepeater(shapes[index], state);
				} else if (shape.ty === 'sr') {
					property = ShapePolystar(shapes[index], state);
				} else if (shape.ty === 'rd') {
					property = ShapeRoundCorners(shapes[index], state);
				} else if (shape.ty === 'sh') {
					property = ShapePath(shapes[index], state);
				} else if (shape.ty === 'tr') {
					property = Transform(shapes[index].transform.mProps, state);
				} else {
					console.log(shape.ty);
				}
				cachedShapeProperties[index] = property;
				return property;
			}
		});
		return ob;
	}

	function _buildPropertyMap() {
		return shapesData.map(function (shape, index) {
			return buildShapeObject(shape, index);
		});
	}

	function fromKeypathLayerPoint(point) {
		if (state.hasProperty('Transform')) {
			var toWorldMat = Matrix();
			var transformMat = state.getProperty('Transform').getTargetTransform();
			transformMat.applyToMatrix(toWorldMat);
			point = toWorldMat.applyToPointArray(point[0], point[1], point[2] || 0);
		}
		return state.parent.fromKeypathLayerPoint(point);
	}

	function toKeypathLayerPoint(point) {
		point = state.parent.toKeypathLayerPoint(point);
		if (state.hasProperty('Transform')) {
			var toWorldMat = Matrix();
			var transformMat = state.getProperty('Transform').getTargetTransform();
			transformMat.applyToMatrix(toWorldMat);
			point = toWorldMat.inversePoint(point);
		}
		return point;
	}

	var methods = {
		fromKeypathLayerPoint: fromKeypathLayerPoint,
		toKeypathLayerPoint: toKeypathLayerPoint

		//state.properties = _buildPropertyMap();

	};return Object.assign(state, KeyPathNode(state), methods);
}

module.exports = ShapeContents;

},{"../../helpers/transformationMatrix":8,"../../key_path/KeyPathNode":12,"../../property/Property":40,"../transform/Transform":39,"./ShapeEllipse":24,"./ShapeFill":25,"./ShapeGradientFill":26,"./ShapeGradientStroke":27,"./ShapePath":28,"./ShapePolystar":29,"./ShapeRectangle":30,"./ShapeRepeater":31,"./ShapeRoundCorners":32,"./ShapeStroke":33,"./ShapeTrimPaths":34}],24:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeEllipse(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Size',
			value: Property(element.sh.s, parent)
		}, {
			name: 'Position',
			value: Property(element.sh.p, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeEllipse;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],25:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeFill(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Color',
			value: Property(element.c, parent)
		}, {
			name: 'Opacity',
			value: {
				setValue: Property(element.o, parent)
			}
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeFill;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],26:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientFill(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Start Point',
			value: Property(element.s, parent)
		}, {
			name: 'End Point',
			value: Property(element.s, parent)
		}, {
			name: 'Opacity',
			value: Property(element.o, parent)
		}, {
			name: 'Highlight Length',
			value: Property(element.h, parent)
		}, {
			name: 'Highlight Angle',
			value: Property(element.a, parent)
		}, {
			name: 'Colors',
			value: Property(element.g.prop, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientFill;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],27:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientStroke(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Start Point',
			value: Property(element.s, parent)
		}, {
			name: 'End Point',
			value: Property(element.e, parent)
		}, {
			name: 'Opacity',
			value: Property(element.o, parent)
		}, {
			name: 'Highlight Length',
			value: Property(element.h, parent)
		}, {
			name: 'Highlight Angle',
			value: Property(element.a, parent)
		}, {
			name: 'Colors',
			value: Property(element.g.prop, parent)
		}, {
			name: 'Stroke Width',
			value: Property(element.w, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientStroke;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],28:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePath(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function setPath(value) {
		Property(element.sh).setValue(value);
	}

	function _buildPropertyMap() {
		return [{
			name: 'path',
			value: Property(element.sh, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePath;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],29:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePolystar(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Points',
			value: Property(element.sh.pt, parent)
		}, {
			name: 'Position',
			value: Property(element.sh.p, parent)
		}, {
			name: 'Rotation',
			value: Property(element.sh.r, parent)
		}, {
			name: 'Inner Radius',
			value: Property(element.sh.ir, parent)
		}, {
			name: 'Outer Radius',
			value: Property(element.sh.or, parent)
		}, {
			name: 'Inner Roundness',
			value: Property(element.sh.is, parent)
		}, {
			name: 'Outer Roundness',
			value: Property(element.sh.os, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePolystar;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],30:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRectangle(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Size',
			value: Property(element.sh.s, parent)
		}, {
			name: 'Position',
			value: Property(element.sh.p, parent)
		}, {
			name: 'Roundness',
			value: Property(element.sh.r, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRectangle;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],31:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var Transform = require('../transform/Transform');

function ShapeRepeater(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Copies',
			value: Property(element.c, parent)
		}, {
			name: 'Offset',
			value: Property(element.o, parent)
		}, {
			name: 'Transform',
			value: Transform(element.tr, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRepeater;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40,"../transform/Transform":39}],32:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRoundCorners(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Radius',
			value: Property(element.rd, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRoundCorners;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],33:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeStroke(element, parent) {
	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'color',
			value: Property(element.c, parent)
		}, {
			name: 'stroke width',
			value: Property(element.w, parent)
		}, {
			name: 'opacity',
			value: Property(element.o, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeStroke;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],34:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeTrimPaths(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Start',
			value: Property(element.s, parent)
		}, {
			name: 'End',
			value: Property(element.e, parent)
		}, {
			name: 'Offset',
			value: Property(element.o, parent)
		}];
	}

	var methods = {};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeTrimPaths;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],35:[function(require,module,exports){
'use strict';

var LayerBase = require('../LayerBase');

function Solid(element, parent) {

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [];
	}

	var methods = {};

	return Object.assign({}, LayerBase(state), methods);
}

module.exports = Solid;

},{"../LayerBase":13}],36:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var TextAnimator = require('./TextAnimator');

function Text(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	};

	function setDocumentData(_function) {
		var previousValue;
		setInterval(function () {
			var newValue = _function(element.textProperty.currentData);
			if (previousValue !== newValue) {
				element.updateDocumentData(newValue);
			}
		}, 500);
		console.log(element);
	}

	function addAnimators() {
		var animatorProperties = [];
		var animators = element.textAnimator._animatorsData;
		var i,
		    len = animators.length;
		var textAnimator;
		for (i = 0; i < len; i += 1) {
			textAnimator = TextAnimator(animators[i]);
			animatorProperties.push({
				name: element.textAnimator._textData.a[i].nm || 'Animator ' + (i + 1), //Fallback for old animations
				value: textAnimator
			});
		}
		return animatorProperties;
	}

	function _buildPropertyMap() {
		return [{
			name: 'Source',
			value: {
				setValue: setDocumentData
			}
		}].concat(addAnimators());
	}

	var methods = {};

	return Object.assign(instance, methods, KeyPathNode(state));
}

module.exports = Text;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40,"./TextAnimator":37}],37:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function TextAnimator(animator) {

	var instance = {};

	var state = {
		properties: _buildPropertyMap()
	};

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
		return [{
			name: 'Anchor Point',
			value: {
				setValue: setAnchorPoint
			}
		}, {
			name: 'Fill Brightness',
			value: {
				setValue: setFillBrightness
			}
		}, {
			name: 'Fill Color',
			value: {
				setValue: setFillColor
			}
		}, {
			name: 'Fill Hue',
			value: {
				setValue: setFillHue
			}
		}, {
			name: 'Fill Saturation',
			value: {
				setValue: setFillSaturation
			}
		}, {
			name: 'Fill Opacity',
			value: {
				setValue: setFillOpacity
			}
		}, {
			name: 'Opacity',
			value: {
				setValue: setOpacity
			}
		}, {
			name: 'Position',
			value: {
				setValue: setPosition
			}
		}, {
			name: 'Rotation X',
			value: {
				setValue: setRotationX
			}
		}, {
			name: 'Rotation Y',
			value: {
				setValue: setRotationY
			}
		}, {
			name: 'Scale',
			value: {
				setValue: setScale
			}
		}, {
			name: 'Skew Axis',
			value: {
				setValue: setSkewAxis
			}
		}, {
			name: 'Stroke Color',
			value: {
				setValue: setStrokeColor
			}
		}, {
			name: 'Skew',
			value: {
				setValue: setSkew
			}
		}, {
			name: 'Stroke Width',
			value: {
				setValue: setStrokeWidth
			}
		}, {
			name: 'Tracking Amount',
			value: {
				setValue: setTrackingAmount
			}
		}, {
			name: 'Stroke Opacity',
			value: {
				setValue: setStrokeOpacity
			}
		}, {
			name: 'Stroke Brightness',
			value: {
				setValue: setStrokeBrightness
			}
		}, {
			name: 'Stroke Saturation',
			value: {
				setValue: setStrokeSaturation
			}
		}, {
			name: 'Stroke Hue',
			value: {
				setValue: setStrokeHue
			}
		}];
	}

	var methods = {};

	return Object.assign(instance, methods, KeyPathNode(state));
}

module.exports = TextAnimator;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],38:[function(require,module,exports){
'use strict';

var LayerBase = require('../LayerBase');
var Text = require('./Text');

function TextElement(element) {

	var instance = {};

	var TextProperty = Text(element);
	var state = {
		element: element,
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'text',
			value: TextProperty
		}, {
			name: 'Text',
			value: TextProperty
		}];
	}

	function getText() {
		return element.textProperty.currentData.t;
	}

	function setText(value, index) {
		setDocumentData({ t: value }, index);
	}

	function setDocumentData(data, index) {
		return element.updateDocumentData(data, index);
	}

	function canResizeFont(_canResize) {
		return element.canResizeFont(_canResize);
	}

	function setMinimumFontSize(_fontSize) {
		return element.setMinimumFontSize(_fontSize);
	}

	var methods = {
		getText: getText,
		setText: setText,
		canResizeFont: canResizeFont,
		setDocumentData: setDocumentData,
		setMinimumFontSize: setMinimumFontSize
	};

	return Object.assign(instance, LayerBase(state), methods);
}

module.exports = TextElement;

},{"../LayerBase":13,"./Text":36}],39:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Transform(props, parent) {
	var state = {
		properties: _buildPropertyMap()
	};

	function _buildPropertyMap() {
		return [{
			name: 'Anchor Point',
			value: Property(props.a, parent)
		}, {
			name: 'Point of Interest',
			value: Property(props.a, parent)
		}, {
			name: 'Position',
			value: Property(props.p, parent)
		}, {
			name: 'Scale',
			value: Property(props.s, parent)
		}, {
			name: 'Rotation',
			value: Property(props.r, parent)
		}, {
			name: 'X Position',
			value: Property(props.px, parent)
		}, {
			name: 'Y Position',
			value: Property(props.py, parent)
		}, {
			name: 'Z Position',
			value: Property(props.pz, parent)
		}, {
			name: 'X Rotation',
			value: Property(props.rx, parent)
		}, {
			name: 'Y Rotation',
			value: Property(props.ry, parent)
		}, {
			name: 'Z Rotation',
			value: Property(props.rz, parent)
		}, {
			name: 'Opacity',
			value: Property(props.o, parent)
		}];
	}

	function getTargetTransform() {
		return props;
	}

	var methods = {
		getTargetTransform: getTargetTransform
	};

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Transform;

},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],40:[function(require,module,exports){
'use strict';

var KeyPathNode = require('../key_path/KeyPathNode');
var ValueProperty = require('./ValueProperty');

function Property(property, parent) {
	var state = {
		property: property,
		parent: parent
	};

	function destroy() {
		state.property = null;
		state.parent = null;
	}

	var methods = {
		destroy: destroy
	};

	return Object.assign({}, methods, ValueProperty(state), KeyPathNode(state));
}

module.exports = Property;

},{"../key_path/KeyPathNode":12,"./ValueProperty":41}],41:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function ValueProperty(state) {

	function setValue(value) {
		var property = state.property;
		if (!property || !property.addEffect) {
			return;
		}
		if (typeof value === 'function') {
			return property.addEffect(value);
		} else if (property.propType === 'multidimensional' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.length === 2) {
			return property.addEffect(function () {
				return value;
			});
		} else if (property.propType === 'unidimensional' && typeof value === 'number') {
			return property.addEffect(function () {
				return value;
			});
		}
	}

	function getValue() {
		return state.property.v;
	}

	var methods = {
		setValue: setValue,
		getValue: getValue
	};

	return methods;
}

module.exports = ValueProperty;

},{}],42:[function(require,module,exports){
'use strict';

var LayerList = require('../layer/LayerList');
var KeyPathList = require('../key_path/KeyPathList');

function Renderer(state) {

	state._type = 'renderer';

	function getRendererType() {
		return state.animation.animType;
	}

	return Object.assign({
		getRendererType: getRendererType
	}, LayerList(state.elements), KeyPathList(state.elements, 'renderer'));
}

module.exports = Renderer;

},{"../key_path/KeyPathList":11,"../layer/LayerList":14}]},{},[10])(10)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGFuaW1hdGlvblxcQW5pbWF0aW9uSXRlbS5qcyIsInNyY1xcZW51bXNcXGtleV9wYXRoX3NlcGFyYXRvci5qcyIsInNyY1xcZW51bXNcXGxheWVyX3R5cGVzLmpzIiwic3JjXFxlbnVtc1xccHJvcGVydHlfbmFtZXMuanMiLCJzcmNcXGhlbHBlcnNcXGtleVBhdGhCdWlsZGVyLmpzIiwic3JjXFxoZWxwZXJzXFxsYXllckFQSUJ1aWxkZXIuanMiLCJzcmNcXGhlbHBlcnNcXHN0cmluZ1Nhbml0aXplci5qcyIsInNyY1xcaGVscGVyc1xcdHJhbnNmb3JtYXRpb25NYXRyaXguanMiLCJzcmNcXGhlbHBlcnNcXHR5cGVkQXJyYXlzLmpzIiwic3JjXFxpbmRleC5qcyIsInNyY1xca2V5X3BhdGhcXEtleVBhdGhMaXN0LmpzIiwic3JjXFxrZXlfcGF0aFxcS2V5UGF0aE5vZGUuanMiLCJzcmNcXGxheWVyXFxMYXllckJhc2UuanMiLCJzcmNcXGxheWVyXFxMYXllckxpc3QuanMiLCJzcmNcXGxheWVyXFxjYW1lcmFcXENhbWVyYS5qcyIsInNyY1xcbGF5ZXJcXGNvbXBvc2l0aW9uXFxDb21wb3NpdGlvbi5qcyIsInNyY1xcbGF5ZXJcXGNvbXBvc2l0aW9uXFxUaW1lUmVtYXAuanMiLCJzcmNcXGxheWVyXFxlZmZlY3RzXFxFZmZlY3RFbGVtZW50LmpzIiwic3JjXFxsYXllclxcZWZmZWN0c1xcRWZmZWN0cy5qcyIsInNyY1xcbGF5ZXJcXGltYWdlXFxJbWFnZUVsZW1lbnQuanMiLCJzcmNcXGxheWVyXFxudWxsX2VsZW1lbnRcXE51bGxFbGVtZW50LmpzIiwic3JjXFxsYXllclxcc2hhcGVcXFNoYXBlLmpzIiwic3JjXFxsYXllclxcc2hhcGVcXFNoYXBlQ29udGVudHMuanMiLCJzcmNcXGxheWVyXFxzaGFwZVxcU2hhcGVFbGxpcHNlLmpzIiwic3JjXFxsYXllclxcc2hhcGVcXFNoYXBlRmlsbC5qcyIsInNyY1xcbGF5ZXJcXHNoYXBlXFxTaGFwZUdyYWRpZW50RmlsbC5qcyIsInNyY1xcbGF5ZXJcXHNoYXBlXFxTaGFwZUdyYWRpZW50U3Ryb2tlLmpzIiwic3JjXFxsYXllclxcc2hhcGVcXFNoYXBlUGF0aC5qcyIsInNyY1xcbGF5ZXJcXHNoYXBlXFxTaGFwZVBvbHlzdGFyLmpzIiwic3JjXFxsYXllclxcc2hhcGVcXFNoYXBlUmVjdGFuZ2xlLmpzIiwic3JjXFxsYXllclxcc2hhcGVcXFNoYXBlUmVwZWF0ZXIuanMiLCJzcmNcXGxheWVyXFxzaGFwZVxcU2hhcGVSb3VuZENvcm5lcnMuanMiLCJzcmNcXGxheWVyXFxzaGFwZVxcU2hhcGVTdHJva2UuanMiLCJzcmNcXGxheWVyXFxzaGFwZVxcU2hhcGVUcmltUGF0aHMuanMiLCJzcmNcXGxheWVyXFxzb2xpZFxcU29saWRFbGVtZW50LmpzIiwic3JjXFxsYXllclxcdGV4dFxcVGV4dC5qcyIsInNyY1xcbGF5ZXJcXHRleHRcXFRleHRBbmltYXRvci5qcyIsInNyY1xcbGF5ZXJcXHRleHRcXFRleHRFbGVtZW50LmpzIiwic3JjXFxsYXllclxcdHJhbnNmb3JtXFxUcmFuc2Zvcm0uanMiLCJzcmNcXHByb3BlcnR5XFxQcm9wZXJ0eS5qcyIsInNyY1xccHJvcGVydHlcXFZhbHVlUHJvcGVydHkuanMiLCJzcmNcXHJlbmRlcmVyXFxSZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxXQUFXLFFBQVEsc0JBQVIsQ0FBZjtBQUNBLElBQUksWUFBWSxRQUFRLDRCQUFSLENBQWhCOztBQUVBLFNBQVMsb0JBQVQsQ0FBOEIsU0FBOUIsRUFBeUM7O0FBRXhDLEtBQUksUUFBUTtBQUNYLGFBQVcsU0FEQTtBQUVYLFlBQVUsVUFBVSxRQUFWLENBQW1CLFFBQW5CLENBQTRCLEdBQTVCLENBQWdDLFVBQUMsSUFBRDtBQUFBLFVBQVUsVUFBVSxJQUFWLEVBQWdCLFNBQWhCLENBQVY7QUFBQSxHQUFoQyxD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LEtBQWlCLENBQTlGLEVBQWlHO0FBQ3ZHLFVBQU8sU0FBUyxTQUFULENBQW1CLFlBQVU7QUFBQyxXQUFPLEtBQVA7QUFBYSxJQUEzQyxDQUFQO0FBQ0EsR0FGTSxNQUVBLElBQUksU0FBUyxRQUFULEtBQXNCLGdCQUF0QixJQUEwQyxPQUFPLEtBQVAsS0FBaUIsUUFBL0QsRUFBeUU7QUFDL0UsVUFBTyxTQUFTLFNBQVQsQ0FBbUIsWUFBVTtBQUFDLFdBQU8sS0FBUDtBQUFhLElBQTNDLENBQVA7QUFDQTtBQUNEOztBQUVELFVBQVMsUUFBVCxHQUFvQjtBQUNuQixTQUFPLE1BQU0sUUFBTixDQUFlLENBQXRCO0FBQ0E7O0FBRUQsS0FBSSxVQUFVO0FBQ2IsWUFBVSxRQURHO0FBRWIsWUFBVTtBQUZHLEVBQWQ7O0FBS0EsUUFBTyxPQUFQO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGFBQWpCOzs7OztBQzVCQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFoQjtBQUNBLElBQUksY0FBYyxRQUFRLHlCQUFSLENBQWxCOztBQUVBLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5Qjs7QUFFeEIsT0FBTSxLQUFOLEdBQWMsVUFBZDs7QUFFQSxVQUFTLGVBQVQsR0FBMkI7QUFDMUIsU0FBTyxNQUFNLFNBQU4sQ0FBZ0IsUUFBdkI7QUFDQTs7QUFFRCxRQUFPLE9BQU8sTUFBUCxDQUFjO0FBQ3BCLG1CQUFpQjtBQURHLEVBQWQsRUFFSixVQUFVLE1BQU0sUUFBaEIsQ0FGSSxFQUV1QixZQUFZLE1BQU0sUUFBbEIsRUFBNEIsVUFBNUIsQ0FGdkIsQ0FBUDtBQUdBOztBQUVELE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVuZGVyZXIgPSByZXF1aXJlKCcuLi9yZW5kZXJlci9SZW5kZXJlcicpO1xyXG52YXIgbGF5ZXJfYXBpID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXllckFQSUJ1aWxkZXInKTtcclxuXHJcbmZ1bmN0aW9uIEFuaW1hdGlvbkl0ZW1GYWN0b3J5KGFuaW1hdGlvbikge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRhbmltYXRpb246IGFuaW1hdGlvbixcclxuXHRcdGVsZW1lbnRzOiBhbmltYXRpb24ucmVuZGVyZXIuZWxlbWVudHMubWFwKChpdGVtKSA9PiBsYXllcl9hcGkoaXRlbSwgYW5pbWF0aW9uKSksXHJcblx0XHRib3VuZGluZ1JlY3Q6IG51bGwsXHJcblx0XHRzY2FsZURhdGE6IG51bGxcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRGcmFtZSgpIHtcclxuXHRcdHJldHVybiBhbmltYXRpb24uY3VycmVudEZyYW1lO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKSB7XHJcblx0XHRyZXR1cm4gYW5pbWF0aW9uLmN1cnJlbnRGcmFtZSAvIGFuaW1hdGlvbi5mcmFtZVJhdGU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRWYWx1ZUNhbGxiYWNrKHByb3BlcnRpZXMsIHZhbHVlKSB7XHJcblx0XHR2YXIgaSwgbGVuID0gcHJvcGVydGllcy5sZW5ndGg7XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0cHJvcGVydGllcy5nZXRQcm9wZXJ0eUF0SW5kZXgoaSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gdG9LZXlwYXRoTGF5ZXJQb2ludChwcm9wZXJ0aWVzLCBwb2ludCkge1xyXG5cdFx0dmFyIGksIGxlbiA9IHByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0dmFyIHBvaW50cyA9IFtdO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdHBvaW50cy5wdXNoKHByb3BlcnRpZXMuZ2V0UHJvcGVydHlBdEluZGV4KGkpLnRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpKTtcclxuXHRcdH1cclxuXHRcdGlmKHBvaW50cy5sZW5ndGggPT09IDEpIHtcclxuXHRcdFx0cmV0dXJuIHBvaW50c1swXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBwb2ludHM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmcm9tS2V5cGF0aExheWVyUG9pbnQocHJvcGVydGllcywgcG9pbnQpIHtcclxuXHRcdHZhciBpLCBsZW4gPSBwcm9wZXJ0aWVzLmxlbmd0aDtcclxuXHRcdHZhciBwb2ludHMgPSBbXTtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xyXG5cdFx0XHRwb2ludHMucHVzaChwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS5mcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpKTtcclxuXHRcdH1cclxuXHRcdGlmKHBvaW50cy5sZW5ndGggPT09IDEpIHtcclxuXHRcdFx0cmV0dXJuIHBvaW50c1swXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBwb2ludHM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjYWxjdWxhdGVTY2FsZURhdGEoYm91bmRpbmdSZWN0KSB7XHJcblx0XHR2YXIgY29tcFdpZHRoID0gYW5pbWF0aW9uLmFuaW1hdGlvbkRhdGEudztcclxuICAgICAgICB2YXIgY29tcEhlaWdodCA9IGFuaW1hdGlvbi5hbmltYXRpb25EYXRhLmg7XHJcblx0XHR2YXIgY29tcFJlbCA9IGNvbXBXaWR0aCAvIGNvbXBIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcclxuICAgICAgICB2YXIgZWxlbWVudEhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRSZWwgPSBlbGVtZW50V2lkdGggLyBlbGVtZW50SGVpZ2h0O1xyXG4gICAgICAgIHZhciBzY2FsZSxzY2FsZVhPZmZzZXQsc2NhbGVZT2Zmc2V0O1xyXG4gICAgICAgIHZhciB4QWxpZ25tZW50LCB5QWxpZ25tZW50LCBzY2FsZU1vZGU7XHJcbiAgICAgICAgdmFyIGFzcGVjdFJhdGlvID0gYW5pbWF0aW9uLnJlbmRlcmVyLnJlbmRlckNvbmZpZy5wcmVzZXJ2ZUFzcGVjdFJhdGlvLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgaWYoYXNwZWN0UmF0aW9bMV0gPT09ICdtZWV0Jykge1xyXG4gICAgICAgIFx0c2NhbGUgPSBlbGVtZW50UmVsID4gY29tcFJlbCA/IGVsZW1lbnRIZWlnaHQgLyBjb21wSGVpZ2h0IDogZWxlbWVudFdpZHRoIC8gY29tcFdpZHRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgXHRzY2FsZSA9IGVsZW1lbnRSZWwgPiBjb21wUmVsID8gZWxlbWVudFdpZHRoIC8gY29tcFdpZHRoIDogZWxlbWVudEhlaWdodCAvIGNvbXBIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHhBbGlnbm1lbnQgPSBhc3BlY3RSYXRpb1swXS5zdWJzdHIoMCw0KTtcclxuICAgICAgICB5QWxpZ25tZW50ID0gYXNwZWN0UmF0aW9bMF0uc3Vic3RyKDQpO1xyXG4gICAgICAgIGlmKHhBbGlnbm1lbnQgPT09ICd4TWluJykge1xyXG4gICAgICAgIFx0c2NhbGVYT2Zmc2V0ID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYoeEFsaWdubWVudCA9PT0gJ3hNaWQnKSB7XHJcbiAgICAgICAgXHRzY2FsZVhPZmZzZXQgPSAoZWxlbWVudFdpZHRoIC0gY29tcFdpZHRoICogc2NhbGUpIC8gMjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFx0c2NhbGVYT2Zmc2V0ID0gKGVsZW1lbnRXaWR0aCAtIGNvbXBXaWR0aCAqIHNjYWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHlBbGlnbm1lbnQgPT09ICdZTWluJykge1xyXG5cdCAgICAgICAgc2NhbGVZT2Zmc2V0ID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYoeUFsaWdubWVudCA9PT0gJ1lNaWQnKSB7XHJcblx0ICAgICAgICBzY2FsZVlPZmZzZXQgPSAoZWxlbWVudEhlaWdodCAtIGNvbXBIZWlnaHQgKiBzY2FsZSkgLyAyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblx0ICAgICAgICBzY2FsZVlPZmZzZXQgPSAoZWxlbWVudEhlaWdodCAtIGNvbXBIZWlnaHQgKiBzY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgXHRzY2FsZVlPZmZzZXQ6IHNjYWxlWU9mZnNldCxcclxuICAgICAgICBcdHNjYWxlWE9mZnNldDogc2NhbGVYT2Zmc2V0LFxyXG4gICAgICAgIFx0c2NhbGU6IHNjYWxlXHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVjYWxjdWxhdGVTaXplKGNvbnRhaW5lcikge1xyXG5cdFx0dmFyIGNvbnRhaW5lciA9IGFuaW1hdGlvbi53cmFwcGVyO1xyXG5cdFx0c3RhdGUuYm91bmRpbmdSZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0c3RhdGUuc2NhbGVEYXRhID0gY2FsY3VsYXRlU2NhbGVEYXRhKHN0YXRlLmJvdW5kaW5nUmVjdCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB0b0NvbnRhaW5lclBvaW50KHBvaW50KSB7XHJcblx0XHRpZighYW5pbWF0aW9uLndyYXBwZXIgfHwgIWFuaW1hdGlvbi53cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCkge1xyXG5cdFx0XHRyZXR1cm4gcG9pbnQ7XHJcblx0XHR9XHJcblx0XHRpZighc3RhdGUuYm91bmRpbmdSZWN0KSB7XHJcblx0XHRcdHJlY2FsY3VsYXRlU2l6ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBib3VuZGluZ1JlY3QgPSBzdGF0ZS5ib3VuZGluZ1JlY3Q7XHJcblx0XHR2YXIgbmV3UG9pbnQgPSBbcG9pbnRbMF0gLSBib3VuZGluZ1JlY3QubGVmdCwgcG9pbnRbMV0gLSBib3VuZGluZ1JlY3QudG9wXTtcclxuXHRcdHZhciBzY2FsZURhdGEgPSBzdGF0ZS5zY2FsZURhdGE7XHJcblxyXG4gICAgICAgIG5ld1BvaW50WzBdID0gKG5ld1BvaW50WzBdIC0gc2NhbGVEYXRhLnNjYWxlWE9mZnNldCkgLyBzY2FsZURhdGEuc2NhbGU7XHJcbiAgICAgICAgbmV3UG9pbnRbMV0gPSAobmV3UG9pbnRbMV0gLSBzY2FsZURhdGEuc2NhbGVZT2Zmc2V0KSAvIHNjYWxlRGF0YS5zY2FsZTtcclxuXHJcblx0XHRyZXR1cm4gbmV3UG9pbnQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmcm9tQ29udGFpbmVyUG9pbnQocG9pbnQpIHtcclxuXHRcdGlmKCFhbmltYXRpb24ud3JhcHBlciB8fCAhYW5pbWF0aW9uLndyYXBwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XHJcblx0XHRcdHJldHVybiBwb2ludDtcclxuXHRcdH1cclxuXHRcdGlmKCFzdGF0ZS5ib3VuZGluZ1JlY3QpIHtcclxuXHRcdFx0cmVjYWxjdWxhdGVTaXplKCk7XHJcblx0XHR9XHJcblx0XHR2YXIgYm91bmRpbmdSZWN0ID0gc3RhdGUuYm91bmRpbmdSZWN0O1xyXG5cdFx0dmFyIHNjYWxlRGF0YSA9IHN0YXRlLnNjYWxlRGF0YTtcclxuXHJcblx0XHR2YXIgbmV3UG9pbnQgPSBbcG9pbnRbMF0gKiBzY2FsZURhdGEuc2NhbGUgKyBzY2FsZURhdGEuc2NhbGVYT2Zmc2V0LCBwb2ludFsxXSAqIHNjYWxlRGF0YS5zY2FsZSArIHNjYWxlRGF0YS5zY2FsZVlPZmZzZXRdO1xyXG5cclxuXHRcdHZhciBuZXdQb2ludCA9IFtuZXdQb2ludFswXSArIGJvdW5kaW5nUmVjdC5sZWZ0LCBuZXdQb2ludFsxXSArIGJvdW5kaW5nUmVjdC50b3BdO1xyXG5cdFx0cmV0dXJuIG5ld1BvaW50O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0U2NhbGVEYXRhKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLnNjYWxlRGF0YTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0cmVjYWxjdWxhdGVTaXplOiByZWNhbGN1bGF0ZVNpemUsXHJcblx0XHRnZXRTY2FsZURhdGE6IGdldFNjYWxlRGF0YSxcclxuXHRcdHRvQ29udGFpbmVyUG9pbnQ6IHRvQ29udGFpbmVyUG9pbnQsXHJcblx0XHRmcm9tQ29udGFpbmVyUG9pbnQ6IGZyb21Db250YWluZXJQb2ludCxcclxuXHRcdGdldEN1cnJlbnRGcmFtZTogZ2V0Q3VycmVudEZyYW1lLFxyXG5cdFx0Z2V0Q3VycmVudFRpbWU6IGdldEN1cnJlbnRUaW1lLFxyXG5cdFx0YWRkVmFsdWVDYWxsYmFjazogYWRkVmFsdWVDYWxsYmFjayxcclxuXHRcdHRvS2V5cGF0aExheWVyUG9pbnQ6IHRvS2V5cGF0aExheWVyUG9pbnQsXHJcblx0XHRmcm9tS2V5cGF0aExheWVyUG9pbnQ6IGZyb21LZXlwYXRoTGF5ZXJQb2ludFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIFJlbmRlcmVyKHN0YXRlKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uSXRlbUZhY3Rvcnk7IiwibW9kdWxlLmV4cG9ydHMgPSAnLCc7IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0IDA6IDAsXHJcblx0IDE6IDEsXHJcblx0IDI6IDIsXHJcblx0IDM6IDMsXHJcblx0IDQ6IDQsXHJcblx0IDU6IDUsXHJcblx0IDEzOiAxMyxcclxuXHQnY29tcCc6IDAsXHJcblx0J2NvbXBvc2l0aW9uJzogMCxcclxuXHQnc29saWQnOiAxLFxyXG5cdCdpbWFnZSc6IDIsXHJcblx0J251bGwnOiAzLFxyXG5cdCdzaGFwZSc6IDQsXHJcblx0J3RleHQnOiA1LFxyXG5cdCdjYW1lcmEnOiAxM1xyXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0TEFZRVJfVFJBTlNGT1JNOiAndHJhbnNmb3JtJ1xyXG59IiwidmFyIGtleV9wYXRoX3NlcGFyYXRvciA9IHJlcXVpcmUoJy4uL2VudW1zL2tleV9wYXRoX3NlcGFyYXRvcicpO1xyXG52YXIgc2FuaXRpemVTdHJpbmcgPSByZXF1aXJlKCcuL3N0cmluZ1Nhbml0aXplcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwcm9wZXJ0eVBhdGgpIHtcclxuXHR2YXIga2V5UGF0aFNwbGl0ID0gcHJvcGVydHlQYXRoLnNwbGl0KGtleV9wYXRoX3NlcGFyYXRvcik7XHJcblx0dmFyIHNlbGVjdG9yID0ga2V5UGF0aFNwbGl0LnNoaWZ0KCk7XHJcblx0cmV0dXJuIHtcclxuXHRcdHNlbGVjdG9yOiBzYW5pdGl6ZVN0cmluZyhzZWxlY3RvciksXHJcblx0XHRwcm9wZXJ0eVBhdGg6IGtleVBhdGhTcGxpdC5qb2luKGtleV9wYXRoX3NlcGFyYXRvcilcclxuXHR9XHJcbn0iLCJ2YXIgVGV4dEVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci90ZXh0L1RleHRFbGVtZW50Jyk7XHJcbnZhciBTaGFwZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9zaGFwZS9TaGFwZScpO1xyXG52YXIgTnVsbEVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQnKTtcclxudmFyIFNvbGlkRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL3NvbGlkL1NvbGlkRWxlbWVudCcpO1xyXG52YXIgSW1hZ2VFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvaW1hZ2UvSW1hZ2VFbGVtZW50Jyk7XHJcbnZhciBDYW1lcmFFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvY2FtZXJhL0NhbWVyYScpO1xyXG52YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJCYXNlJyk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRMYXllckFwaShlbGVtZW50LCBwYXJlbnQpIHtcclxuXHR2YXIgbGF5ZXJUeXBlID0gZWxlbWVudC5kYXRhLnR5O1xyXG5cdHZhciBDb21wb3NpdGlvbiA9IHJlcXVpcmUoJy4uL2xheWVyL2NvbXBvc2l0aW9uL0NvbXBvc2l0aW9uJyk7XHJcblx0c3dpdGNoKGxheWVyVHlwZSkge1xyXG5cdFx0Y2FzZSAwOlxyXG5cdFx0cmV0dXJuIENvbXBvc2l0aW9uKGVsZW1lbnQsIHBhcmVudCk7XHJcblx0XHRjYXNlIDE6XHJcblx0XHRyZXR1cm4gU29saWRFbGVtZW50KGVsZW1lbnQsIHBhcmVudCk7XHJcblx0XHRjYXNlIDI6XHJcblx0XHRyZXR1cm4gSW1hZ2VFbGVtZW50KGVsZW1lbnQsIHBhcmVudCk7XHJcblx0XHRjYXNlIDM6XHJcblx0XHRyZXR1cm4gTnVsbEVsZW1lbnQoZWxlbWVudCwgcGFyZW50KTtcclxuXHRcdGNhc2UgNDpcclxuXHRcdHJldHVybiBTaGFwZUVsZW1lbnQoZWxlbWVudCwgcGFyZW50LCBlbGVtZW50LmRhdGEuc2hhcGVzLCBlbGVtZW50Lml0ZW1zRGF0YSk7XHJcblx0XHRjYXNlIDU6XHJcblx0XHRyZXR1cm4gVGV4dEVsZW1lbnQoZWxlbWVudCwgcGFyZW50KTtcclxuXHRcdGNhc2UgMTM6XHJcblx0XHRyZXR1cm4gQ2FtZXJhRWxlbWVudChlbGVtZW50LCBwYXJlbnQpO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdHJldHVybiBMYXllckJhc2UoZWxlbWVudCwgcGFyZW50KTtcclxuXHR9XHJcbn0iLCJmdW5jdGlvbiBzYW5pdGl6ZVN0cmluZyhzdHJpbmcpIHtcclxuXHRyZXR1cm4gc3RyaW5nLnRyaW0oKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW5pdGl6ZVN0cmluZyIsInZhciBjcmVhdGVUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi90eXBlZEFycmF5cycpXHJcblxyXG4vKiFcclxuIFRyYW5zZm9ybWF0aW9uIE1hdHJpeCB2Mi4wXHJcbiAoYykgRXBpc3RlbWV4IDIwMTQtMjAxNVxyXG4gd3d3LmVwaXN0ZW1leC5jb21cclxuIEJ5IEtlbiBGeXJzdGVuYmVyZ1xyXG4gQ29udHJpYnV0aW9ucyBieSBsZWVvbml5YS5cclxuIExpY2Vuc2U6IE1JVCwgaGVhZGVyIHJlcXVpcmVkLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiAyRCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggb2JqZWN0IGluaXRpYWxpemVkIHdpdGggaWRlbnRpdHkgbWF0cml4LlxyXG4gKlxyXG4gKiBUaGUgbWF0cml4IGNhbiBzeW5jaHJvbml6ZSBhIGNhbnZhcyBjb250ZXh0IGJ5IHN1cHBseWluZyB0aGUgY29udGV4dFxyXG4gKiBhcyBhbiBhcmd1bWVudCwgb3IgbGF0ZXIgYXBwbHkgY3VycmVudCBhYnNvbHV0ZSB0cmFuc2Zvcm0gdG8gYW5cclxuICogZXhpc3RpbmcgY29udGV4dC5cclxuICpcclxuICogQWxsIHZhbHVlcyBhcmUgaGFuZGxlZCBhcyBmbG9hdGluZyBwb2ludCB2YWx1ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBbY29udGV4dF0gLSBPcHRpb25hbCBjb250ZXh0IHRvIHN5bmMgd2l0aCBNYXRyaXhcclxuICogQHByb3Age251bWJlcn0gYSAtIHNjYWxlIHhcclxuICogQHByb3Age251bWJlcn0gYiAtIHNoZWFyIHlcclxuICogQHByb3Age251bWJlcn0gYyAtIHNoZWFyIHhcclxuICogQHByb3Age251bWJlcn0gZCAtIHNjYWxlIHlcclxuICogQHByb3Age251bWJlcn0gZSAtIHRyYW5zbGF0ZSB4XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGYgLSB0cmFuc2xhdGUgeVxyXG4gKiBAcHJvcCB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfG51bGx9IFtjb250ZXh0PW51bGxdIC0gc2V0IG9yIGdldCBjdXJyZW50IGNhbnZhcyBjb250ZXh0XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuXHJcbnZhciBNYXRyaXggPSAoZnVuY3Rpb24oKXtcclxuXHJcbiAgICB2YXIgX2NvcyA9IE1hdGguY29zO1xyXG4gICAgdmFyIF9zaW4gPSBNYXRoLnNpbjtcclxuICAgIHZhciBfdGFuID0gTWF0aC50YW47XHJcbiAgICB2YXIgX3JuZCA9IE1hdGgucm91bmQ7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzZXQoKXtcclxuICAgICAgICB0aGlzLnByb3BzWzBdID0gMTtcclxuICAgICAgICB0aGlzLnByb3BzWzFdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzJdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzNdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzRdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzVdID0gMTtcclxuICAgICAgICB0aGlzLnByb3BzWzZdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzddID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzhdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzldID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzEwXSA9IDE7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMV0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTJdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzEzXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxNF0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByb3RhdGUoYW5nbGUpIHtcclxuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QobUNvcywgLW1TaW4sICAwLCAwLCBtU2luLCAgbUNvcywgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByb3RhdGVYKGFuZ2xlKXtcclxuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QoMSwgMCwgMCwgMCwgMCwgbUNvcywgLW1TaW4sIDAsIDAsIG1TaW4sICBtQ29zLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByb3RhdGVZKGFuZ2xlKXtcclxuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QobUNvcywgIDAsICBtU2luLCAwLCAwLCAxLCAwLCAwLCAtbVNpbiwgIDAsICBtQ29zLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByb3RhdGVaKGFuZ2xlKXtcclxuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QobUNvcywgLW1TaW4sICAwLCAwLCBtU2luLCAgbUNvcywgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaGVhcihzeCxzeSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QoMSwgc3ksIHN4LCAxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBza2V3KGF4LCBheSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hlYXIoX3RhbihheCksIF90YW4oYXkpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBza2V3RnJvbUF4aXMoYXgsIGFuZ2xlKXtcclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QobUNvcywgbVNpbiwgIDAsIDAsIC1tU2luLCAgbUNvcywgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKVxyXG4gICAgICAgICAgICAuX3QoMSwgMCwgIDAsIDAsIF90YW4oYXgpLCAgMSwgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKVxyXG4gICAgICAgICAgICAuX3QobUNvcywgLW1TaW4sICAwLCAwLCBtU2luLCAgbUNvcywgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgICAgICAvL3JldHVybiB0aGlzLl90KG1Db3MsIG1TaW4sIC1tU2luLCBtQ29zLCAwLCAwKS5fdCgxLCAwLCBfdGFuKGF4KSwgMSwgMCwgMCkuX3QobUNvcywgLW1TaW4sIG1TaW4sIG1Db3MsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNjYWxlKHN4LCBzeSwgc3opIHtcclxuICAgICAgICBzeiA9IGlzTmFOKHN6KSA/IDEgOiBzejtcclxuICAgICAgICBpZihzeCA9PSAxICYmIHN5ID09IDEgJiYgc3ogPT0gMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdChzeCwgMCwgMCwgMCwgMCwgc3ksIDAsIDAsIDAsIDAsIHN6LCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRUcmFuc2Zvcm0oYSwgYiwgYywgZCwgZSwgZiwgZywgaCwgaSwgaiwgaywgbCwgbSwgbiwgbywgcCkge1xyXG4gICAgICAgIHRoaXMucHJvcHNbMF0gPSBhO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMV0gPSBiO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMl0gPSBjO1xyXG4gICAgICAgIHRoaXMucHJvcHNbM10gPSBkO1xyXG4gICAgICAgIHRoaXMucHJvcHNbNF0gPSBlO1xyXG4gICAgICAgIHRoaXMucHJvcHNbNV0gPSBmO1xyXG4gICAgICAgIHRoaXMucHJvcHNbNl0gPSBnO1xyXG4gICAgICAgIHRoaXMucHJvcHNbN10gPSBoO1xyXG4gICAgICAgIHRoaXMucHJvcHNbOF0gPSBpO1xyXG4gICAgICAgIHRoaXMucHJvcHNbOV0gPSBqO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTBdID0gaztcclxuICAgICAgICB0aGlzLnByb3BzWzExXSA9IGw7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMl0gPSBtO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTNdID0gbjtcclxuICAgICAgICB0aGlzLnByb3BzWzE0XSA9IG87XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxNV0gPSBwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSh0eCwgdHksIHR6KSB7XHJcbiAgICAgICAgdHogPSB0eiB8fCAwO1xyXG4gICAgICAgIGlmKHR4ICE9PSAwIHx8IHR5ICE9PSAwIHx8IHR6ICE9PSAwKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3QoMSwwLDAsMCwwLDEsMCwwLDAsMCwxLDAsdHgsdHksdHosMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybShhMiwgYjIsIGMyLCBkMiwgZTIsIGYyLCBnMiwgaDIsIGkyLCBqMiwgazIsIGwyLCBtMiwgbjIsIG8yLCBwMikge1xyXG5cclxuICAgICAgICB2YXIgX3AgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBpZihhMiA9PT0gMSAmJiBiMiA9PT0gMCAmJiBjMiA9PT0gMCAmJiBkMiA9PT0gMCAmJiBlMiA9PT0gMCAmJiBmMiA9PT0gMSAmJiBnMiA9PT0gMCAmJiBoMiA9PT0gMCAmJiBpMiA9PT0gMCAmJiBqMiA9PT0gMCAmJiBrMiA9PT0gMSAmJiBsMiA9PT0gMCl7XHJcbiAgICAgICAgICAgIC8vTk9URTogY29tbWVudGluZyB0aGlzIGNvbmRpdGlvbiBiZWNhdXNlIFR1cmJvRmFuIGRlb3B0aW1pemVzIGNvZGUgd2hlbiBwcmVzZW50XHJcbiAgICAgICAgICAgIC8vaWYobTIgIT09IDAgfHwgbjIgIT09IDAgfHwgbzIgIT09IDApe1xyXG4gICAgICAgICAgICAgICAgX3BbMTJdID0gX3BbMTJdICogYTIgKyBfcFsxNV0gKiBtMjtcclxuICAgICAgICAgICAgICAgIF9wWzEzXSA9IF9wWzEzXSAqIGYyICsgX3BbMTVdICogbjI7XHJcbiAgICAgICAgICAgICAgICBfcFsxNF0gPSBfcFsxNF0gKiBrMiArIF9wWzE1XSAqIG8yO1xyXG4gICAgICAgICAgICAgICAgX3BbMTVdID0gX3BbMTVdICogcDI7XHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICB0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYTEgPSBfcFswXTtcclxuICAgICAgICB2YXIgYjEgPSBfcFsxXTtcclxuICAgICAgICB2YXIgYzEgPSBfcFsyXTtcclxuICAgICAgICB2YXIgZDEgPSBfcFszXTtcclxuICAgICAgICB2YXIgZTEgPSBfcFs0XTtcclxuICAgICAgICB2YXIgZjEgPSBfcFs1XTtcclxuICAgICAgICB2YXIgZzEgPSBfcFs2XTtcclxuICAgICAgICB2YXIgaDEgPSBfcFs3XTtcclxuICAgICAgICB2YXIgaTEgPSBfcFs4XTtcclxuICAgICAgICB2YXIgajEgPSBfcFs5XTtcclxuICAgICAgICB2YXIgazEgPSBfcFsxMF07XHJcbiAgICAgICAgdmFyIGwxID0gX3BbMTFdO1xyXG4gICAgICAgIHZhciBtMSA9IF9wWzEyXTtcclxuICAgICAgICB2YXIgbjEgPSBfcFsxM107XHJcbiAgICAgICAgdmFyIG8xID0gX3BbMTRdO1xyXG4gICAgICAgIHZhciBwMSA9IF9wWzE1XTtcclxuXHJcbiAgICAgICAgLyogbWF0cml4IG9yZGVyIChjYW52YXMgY29tcGF0aWJsZSk6XHJcbiAgICAgICAgICogYWNlXHJcbiAgICAgICAgICogYmRmXHJcbiAgICAgICAgICogMDAxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgX3BbMF0gPSBhMSAqIGEyICsgYjEgKiBlMiArIGMxICogaTIgKyBkMSAqIG0yO1xyXG4gICAgICAgIF9wWzFdID0gYTEgKiBiMiArIGIxICogZjIgKyBjMSAqIGoyICsgZDEgKiBuMiA7XHJcbiAgICAgICAgX3BbMl0gPSBhMSAqIGMyICsgYjEgKiBnMiArIGMxICogazIgKyBkMSAqIG8yIDtcclxuICAgICAgICBfcFszXSA9IGExICogZDIgKyBiMSAqIGgyICsgYzEgKiBsMiArIGQxICogcDIgO1xyXG5cclxuICAgICAgICBfcFs0XSA9IGUxICogYTIgKyBmMSAqIGUyICsgZzEgKiBpMiArIGgxICogbTIgO1xyXG4gICAgICAgIF9wWzVdID0gZTEgKiBiMiArIGYxICogZjIgKyBnMSAqIGoyICsgaDEgKiBuMiA7XHJcbiAgICAgICAgX3BbNl0gPSBlMSAqIGMyICsgZjEgKiBnMiArIGcxICogazIgKyBoMSAqIG8yIDtcclxuICAgICAgICBfcFs3XSA9IGUxICogZDIgKyBmMSAqIGgyICsgZzEgKiBsMiArIGgxICogcDIgO1xyXG5cclxuICAgICAgICBfcFs4XSA9IGkxICogYTIgKyBqMSAqIGUyICsgazEgKiBpMiArIGwxICogbTIgO1xyXG4gICAgICAgIF9wWzldID0gaTEgKiBiMiArIGoxICogZjIgKyBrMSAqIGoyICsgbDEgKiBuMiA7XHJcbiAgICAgICAgX3BbMTBdID0gaTEgKiBjMiArIGoxICogZzIgKyBrMSAqIGsyICsgbDEgKiBvMiA7XHJcbiAgICAgICAgX3BbMTFdID0gaTEgKiBkMiArIGoxICogaDIgKyBrMSAqIGwyICsgbDEgKiBwMiA7XHJcblxyXG4gICAgICAgIF9wWzEyXSA9IG0xICogYTIgKyBuMSAqIGUyICsgbzEgKiBpMiArIHAxICogbTIgO1xyXG4gICAgICAgIF9wWzEzXSA9IG0xICogYjIgKyBuMSAqIGYyICsgbzEgKiBqMiArIHAxICogbjIgO1xyXG4gICAgICAgIF9wWzE0XSA9IG0xICogYzIgKyBuMSAqIGcyICsgbzEgKiBrMiArIHAxICogbzIgO1xyXG4gICAgICAgIF9wWzE1XSA9IG0xICogZDIgKyBuMSAqIGgyICsgbzEgKiBsMiArIHAxICogcDIgO1xyXG5cclxuICAgICAgICB0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc0lkZW50aXR5KCkge1xyXG4gICAgICAgIGlmKCF0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQpe1xyXG4gICAgICAgICAgICB0aGlzLl9pZGVudGl0eSA9ICEodGhpcy5wcm9wc1swXSAhPT0gMSB8fCB0aGlzLnByb3BzWzFdICE9PSAwIHx8IHRoaXMucHJvcHNbMl0gIT09IDAgfHwgdGhpcy5wcm9wc1szXSAhPT0gMCB8fCB0aGlzLnByb3BzWzRdICE9PSAwIHx8IHRoaXMucHJvcHNbNV0gIT09IDEgfHwgdGhpcy5wcm9wc1s2XSAhPT0gMCB8fCB0aGlzLnByb3BzWzddICE9PSAwIHx8IHRoaXMucHJvcHNbOF0gIT09IDAgfHwgdGhpcy5wcm9wc1s5XSAhPT0gMCB8fCB0aGlzLnByb3BzWzEwXSAhPT0gMSB8fCB0aGlzLnByb3BzWzExXSAhPT0gMCB8fCB0aGlzLnByb3BzWzEyXSAhPT0gMCB8fCB0aGlzLnByb3BzWzEzXSAhPT0gMCB8fCB0aGlzLnByb3BzWzE0XSAhPT0gMCB8fCB0aGlzLnByb3BzWzE1XSAhPT0gMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lkZW50aXR5Q2FsY3VsYXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9pZGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlcXVhbHMobWF0cil7XHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHdoaWxlIChpIDwgMTYpIHtcclxuICAgICAgICAgICAgaWYobWF0ci5wcm9wc1tpXSAhPT0gdGhpcy5wcm9wc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrPTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb25lKG1hdHIpe1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIGZvcihpPTA7aTwxNjtpKz0xKXtcclxuICAgICAgICAgICAgbWF0ci5wcm9wc1tpXSA9IHRoaXMucHJvcHNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb25lRnJvbVByb3BzKHByb3BzKXtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICBmb3IoaT0wO2k8MTY7aSs9MSl7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcHNbaV0gPSBwcm9wc1tpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1BvaW50KHgsIHksIHopIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCAqIHRoaXMucHJvcHNbMF0gKyB5ICogdGhpcy5wcm9wc1s0XSArIHogKiB0aGlzLnByb3BzWzhdICsgdGhpcy5wcm9wc1sxMl0sXHJcbiAgICAgICAgICAgIHk6IHggKiB0aGlzLnByb3BzWzFdICsgeSAqIHRoaXMucHJvcHNbNV0gKyB6ICogdGhpcy5wcm9wc1s5XSArIHRoaXMucHJvcHNbMTNdLFxyXG4gICAgICAgICAgICB6OiB4ICogdGhpcy5wcm9wc1syXSArIHkgKiB0aGlzLnByb3BzWzZdICsgeiAqIHRoaXMucHJvcHNbMTBdICsgdGhpcy5wcm9wc1sxNF1cclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qcmV0dXJuIHtcclxuICAgICAgICAgeDogeCAqIG1lLmEgKyB5ICogbWUuYyArIG1lLmUsXHJcbiAgICAgICAgIHk6IHggKiBtZS5iICsgeSAqIG1lLmQgKyBtZS5mXHJcbiAgICAgICAgIH07Ki9cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9YKHgsIHksIHopIHtcclxuICAgICAgICByZXR1cm4geCAqIHRoaXMucHJvcHNbMF0gKyB5ICogdGhpcy5wcm9wc1s0XSArIHogKiB0aGlzLnByb3BzWzhdICsgdGhpcy5wcm9wc1sxMl07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBhcHBseVRvWSh4LCB5LCB6KSB7XHJcbiAgICAgICAgcmV0dXJuIHggKiB0aGlzLnByb3BzWzFdICsgeSAqIHRoaXMucHJvcHNbNV0gKyB6ICogdGhpcy5wcm9wc1s5XSArIHRoaXMucHJvcHNbMTNdO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1ooeCwgeSwgeikge1xyXG4gICAgICAgIHJldHVybiB4ICogdGhpcy5wcm9wc1syXSArIHkgKiB0aGlzLnByb3BzWzZdICsgeiAqIHRoaXMucHJvcHNbMTBdICsgdGhpcy5wcm9wc1sxNF07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW52ZXJzZVBvaW50KHB0KSB7XHJcbiAgICAgICAgdmFyIGRldGVybWluYW50ID0gdGhpcy5wcm9wc1swXSAqIHRoaXMucHJvcHNbNV0gLSB0aGlzLnByb3BzWzFdICogdGhpcy5wcm9wc1s0XTtcclxuICAgICAgICB2YXIgYSA9IHRoaXMucHJvcHNbNV0vZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgdmFyIGIgPSAtIHRoaXMucHJvcHNbMV0vZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgdmFyIGMgPSAtIHRoaXMucHJvcHNbNF0vZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgdmFyIGQgPSB0aGlzLnByb3BzWzBdL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBlID0gKHRoaXMucHJvcHNbNF0gKiB0aGlzLnByb3BzWzEzXSAtIHRoaXMucHJvcHNbNV0gKiB0aGlzLnByb3BzWzEyXSkvZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgdmFyIGYgPSAtICh0aGlzLnByb3BzWzBdICogdGhpcy5wcm9wc1sxM10gLSB0aGlzLnByb3BzWzFdICogdGhpcy5wcm9wc1sxMl0pL2RldGVybWluYW50O1xyXG4gICAgICAgIHJldHVybiBbcHRbMF0gKiBhICsgcHRbMV0gKiBjICsgZSwgcHRbMF0gKiBiICsgcHRbMV0gKiBkICsgZiwgMF07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW52ZXJzZVBvaW50cyhwdHMpe1xyXG4gICAgICAgIHZhciBpLCBsZW4gPSBwdHMubGVuZ3RoLCByZXRQdHMgPSBbXTtcclxuICAgICAgICBmb3IoaT0wO2k8bGVuO2krPTEpe1xyXG4gICAgICAgICAgICByZXRQdHNbaV0gPSBpbnZlcnNlUG9pbnQocHRzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldFB0cztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseVRvVHJpcGxlUG9pbnRzKHB0MSwgcHQyLCBwdDMpIHtcclxuICAgICAgICB2YXIgYXJyID0gY3JlYXRlVHlwZWRBcnJheSgnZmxvYXQzMicsIDYpO1xyXG4gICAgICAgIGlmKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgICAgIGFyclswXSA9IHB0MVswXTtcclxuICAgICAgICAgICAgYXJyWzFdID0gcHQxWzFdO1xyXG4gICAgICAgICAgICBhcnJbMl0gPSBwdDJbMF07XHJcbiAgICAgICAgICAgIGFyclszXSA9IHB0MlsxXTtcclxuICAgICAgICAgICAgYXJyWzRdID0gcHQzWzBdO1xyXG4gICAgICAgICAgICBhcnJbNV0gPSBwdDNbMV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHAwID0gdGhpcy5wcm9wc1swXSwgcDEgPSB0aGlzLnByb3BzWzFdLCBwNCA9IHRoaXMucHJvcHNbNF0sIHA1ID0gdGhpcy5wcm9wc1s1XSwgcDEyID0gdGhpcy5wcm9wc1sxMl0sIHAxMyA9IHRoaXMucHJvcHNbMTNdO1xyXG4gICAgICAgICAgICBhcnJbMF0gPSBwdDFbMF0gKiBwMCArIHB0MVsxXSAqIHA0ICsgcDEyO1xyXG4gICAgICAgICAgICBhcnJbMV0gPSBwdDFbMF0gKiBwMSArIHB0MVsxXSAqIHA1ICsgcDEzO1xyXG4gICAgICAgICAgICBhcnJbMl0gPSBwdDJbMF0gKiBwMCArIHB0MlsxXSAqIHA0ICsgcDEyO1xyXG4gICAgICAgICAgICBhcnJbM10gPSBwdDJbMF0gKiBwMSArIHB0MlsxXSAqIHA1ICsgcDEzO1xyXG4gICAgICAgICAgICBhcnJbNF0gPSBwdDNbMF0gKiBwMCArIHB0M1sxXSAqIHA0ICsgcDEyO1xyXG4gICAgICAgICAgICBhcnJbNV0gPSBwdDNbMF0gKiBwMSArIHB0M1sxXSAqIHA1ICsgcDEzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9Qb2ludEFycmF5KHgseSx6KXtcclxuICAgICAgICB2YXIgYXJyO1xyXG4gICAgICAgIGlmKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgICAgIGFyciA9IFt4LHksel07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXJyID0gW3ggKiB0aGlzLnByb3BzWzBdICsgeSAqIHRoaXMucHJvcHNbNF0gKyB6ICogdGhpcy5wcm9wc1s4XSArIHRoaXMucHJvcHNbMTJdLHggKiB0aGlzLnByb3BzWzFdICsgeSAqIHRoaXMucHJvcHNbNV0gKyB6ICogdGhpcy5wcm9wc1s5XSArIHRoaXMucHJvcHNbMTNdLHggKiB0aGlzLnByb3BzWzJdICsgeSAqIHRoaXMucHJvcHNbNl0gKyB6ICogdGhpcy5wcm9wc1sxMF0gKyB0aGlzLnByb3BzWzE0XV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1BvaW50U3RyaW5naWZpZWQoeCwgeSkge1xyXG4gICAgICAgIGlmKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4ICsgJywnICsgeTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICh4ICogdGhpcy5wcm9wc1swXSArIHkgKiB0aGlzLnByb3BzWzRdICsgdGhpcy5wcm9wc1sxMl0pKycsJysoeCAqIHRoaXMucHJvcHNbMV0gKyB5ICogdGhpcy5wcm9wc1s1XSArIHRoaXMucHJvcHNbMTNdKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b0NTUygpIHtcclxuICAgICAgICAvL0RvZXNuJ3QgbWFrZSBtdWNoIHNlbnNlIHRvIGFkZCB0aGlzIG9wdGltaXphdGlvbi4gSWYgaXQgaXMgYW4gaWRlbnRpdHkgbWF0cml4LCBpdCdzIHZlcnkgbGlrZWx5IHRoaXMgd2lsbCBnZXQgY2FsbGVkIG9ubHkgb25jZSBzaW5jZSBpdCB3b24ndCBiZSBrZXlmcmFtZWQuXHJcbiAgICAgICAgLyppZih0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHZhciBwcm9wcyA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgdmFyIGNzc1ZhbHVlID0gJ21hdHJpeDNkKCc7XHJcbiAgICAgICAgdmFyIHYgPSAxMDAwMDtcclxuICAgICAgICB3aGlsZShpPDE2KXtcclxuICAgICAgICAgICAgY3NzVmFsdWUgKz0gX3JuZChwcm9wc1tpXSp2KS92O1xyXG4gICAgICAgICAgICBjc3NWYWx1ZSArPSBpID09PSAxNSA/ICcpJzonLCc7XHJcbiAgICAgICAgICAgIGkgKz0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNzc1ZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvMmRDU1MoKSB7XHJcbiAgICAgICAgLy9Eb2Vzbid0IG1ha2UgbXVjaCBzZW5zZSB0byBhZGQgdGhpcyBvcHRpbWl6YXRpb24uIElmIGl0IGlzIGFuIGlkZW50aXR5IG1hdHJpeCwgaXQncyB2ZXJ5IGxpa2VseSB0aGlzIHdpbGwgZ2V0IGNhbGxlZCBvbmx5IG9uY2Ugc2luY2UgaXQgd29uJ3QgYmUga2V5ZnJhbWVkLlxyXG4gICAgICAgIC8qaWYodGhpcy5pc0lkZW50aXR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHZhciB2ID0gMTAwMDA7XHJcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJtYXRyaXgoXCIgKyBfcm5kKHByb3BzWzBdKnYpL3YgKyAnLCcgKyBfcm5kKHByb3BzWzFdKnYpL3YgKyAnLCcgKyBfcm5kKHByb3BzWzRdKnYpL3YgKyAnLCcgKyBfcm5kKHByb3BzWzVdKnYpL3YgKyAnLCcgKyBfcm5kKHByb3BzWzEyXSp2KS92ICsgJywnICsgX3JuZChwcm9wc1sxM10qdikvdiArIFwiKVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIE1hdHJpeEluc3RhbmNlKCl7XHJcbiAgICAgICAgdGhpcy5yZXNldCA9IHJlc2V0O1xyXG4gICAgICAgIHRoaXMucm90YXRlID0gcm90YXRlO1xyXG4gICAgICAgIHRoaXMucm90YXRlWCA9IHJvdGF0ZVg7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVZID0gcm90YXRlWTtcclxuICAgICAgICB0aGlzLnJvdGF0ZVogPSByb3RhdGVaO1xyXG4gICAgICAgIHRoaXMuc2tldyA9IHNrZXc7XHJcbiAgICAgICAgdGhpcy5za2V3RnJvbUF4aXMgPSBza2V3RnJvbUF4aXM7XHJcbiAgICAgICAgdGhpcy5zaGVhciA9IHNoZWFyO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybSA9IHNldFRyYW5zZm9ybTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuICAgICAgICB0aGlzLmFwcGx5VG9Qb2ludCA9IGFwcGx5VG9Qb2ludDtcclxuICAgICAgICB0aGlzLmFwcGx5VG9YID0gYXBwbHlUb1g7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvWSA9IGFwcGx5VG9ZO1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1ogPSBhcHBseVRvWjtcclxuICAgICAgICB0aGlzLmFwcGx5VG9Qb2ludEFycmF5ID0gYXBwbHlUb1BvaW50QXJyYXk7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvVHJpcGxlUG9pbnRzID0gYXBwbHlUb1RyaXBsZVBvaW50cztcclxuICAgICAgICB0aGlzLmFwcGx5VG9Qb2ludFN0cmluZ2lmaWVkID0gYXBwbHlUb1BvaW50U3RyaW5naWZpZWQ7XHJcbiAgICAgICAgdGhpcy50b0NTUyA9IHRvQ1NTO1xyXG4gICAgICAgIHRoaXMudG8yZENTUyA9IHRvMmRDU1M7XHJcbiAgICAgICAgdGhpcy5jbG9uZSA9IGNsb25lO1xyXG4gICAgICAgIHRoaXMuY2xvbmVGcm9tUHJvcHMgPSBjbG9uZUZyb21Qcm9wcztcclxuICAgICAgICB0aGlzLmVxdWFscyA9IGVxdWFscztcclxuICAgICAgICB0aGlzLmludmVyc2VQb2ludHMgPSBpbnZlcnNlUG9pbnRzO1xyXG4gICAgICAgIHRoaXMuaW52ZXJzZVBvaW50ID0gaW52ZXJzZVBvaW50O1xyXG4gICAgICAgIHRoaXMuX3QgPSB0aGlzLnRyYW5zZm9ybTtcclxuICAgICAgICB0aGlzLmlzSWRlbnRpdHkgPSBpc0lkZW50aXR5O1xyXG4gICAgICAgIHRoaXMuX2lkZW50aXR5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcyA9IGNyZWF0ZVR5cGVkQXJyYXkoJ2Zsb2F0MzInLCAxNik7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXhJbnN0YW5jZSgpXHJcbiAgICB9XHJcbn0oKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDsiLCJ2YXIgY3JlYXRlVHlwZWRBcnJheSA9IChmdW5jdGlvbigpe1xyXG5cdGZ1bmN0aW9uIGNyZWF0ZVJlZ3VsYXJBcnJheSh0eXBlLCBsZW4pe1xyXG5cdFx0dmFyIGkgPSAwLCBhcnIgPSBbXSwgdmFsdWU7XHJcblx0XHRzd2l0Y2godHlwZSkge1xyXG5cdFx0XHRjYXNlICdpbnQxNic6XHJcblx0XHRcdGNhc2UgJ3VpbnQ4Yyc6XHJcblx0XHRcdFx0dmFsdWUgPSAxO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHZhbHVlID0gMS4xO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0YXJyLnB1c2godmFsdWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFycjtcclxuXHR9XHJcblx0ZnVuY3Rpb24gY3JlYXRlVHlwZWRBcnJheSh0eXBlLCBsZW4pe1xyXG5cdFx0aWYodHlwZSA9PT0gJ2Zsb2F0MzInKSB7XHJcblx0XHRcdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGxlbik7XHJcblx0XHR9IGVsc2UgaWYodHlwZSA9PT0gJ2ludDE2Jykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEludDE2QXJyYXkobGVuKTtcclxuXHRcdH0gZWxzZSBpZih0eXBlID09PSAndWludDhjJykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGxlbik7XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmKHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgRmxvYXQzMkFycmF5ID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRyZXR1cm4gY3JlYXRlVHlwZWRBcnJheTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIGNyZWF0ZVJlZ3VsYXJBcnJheTtcclxuXHR9XHJcbn0oKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVR5cGVkQXJyYXk7XHJcbiIsInZhciBBbmltYXRpb25JdGVtID0gcmVxdWlyZSgnLi9hbmltYXRpb24vQW5pbWF0aW9uSXRlbScpO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uQXBpKGFuaW0pIHtcclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgQW5pbWF0aW9uSXRlbShhbmltKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGNyZWF0ZUFuaW1hdGlvbkFwaSA6IGNyZWF0ZUFuaW1hdGlvbkFwaVxyXG59IiwidmFyIGtleVBhdGhCdWlsZGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9rZXlQYXRoQnVpbGRlcicpO1xyXG52YXIgbGF5ZXJfdHlwZXMgPSByZXF1aXJlKCcuLi9lbnVtcy9sYXllcl90eXBlcycpO1xyXG5cclxuZnVuY3Rpb24gS2V5UGF0aExpc3QoZWxlbWVudHMsIG5vZGVfdHlwZSkge1xyXG5cclxuXHRmdW5jdGlvbiBfZ2V0TGVuZ3RoKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmxlbmd0aDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgdHlwZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldFRhcmdldExheWVyKCkuZGF0YS50eSA9PT0gbGF5ZXJfdHlwZXNbdHlwZV07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgbmFtZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldFRhcmdldExheWVyKCkuZGF0YS5ubSA9PT0gbmFtZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlQcm9wZXJ0eShlbGVtZW50cywgbmFtZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdGlmKGVsZW1lbnQuaGFzUHJvcGVydHkobmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRQcm9wZXJ0eShuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5VHlwZShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgc2VsZWN0b3IpLCAnbGF5ZXInKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5TmFtZShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgc2VsZWN0b3IpLCAnbGF5ZXInKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnRpZXNCeVNlbGVjdG9yKHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuaGFzUHJvcGVydHkoc2VsZWN0b3IpO1xyXG5cdFx0fSkubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0UHJvcGVydHkoc2VsZWN0b3IpO1xyXG5cdFx0fSksICdwcm9wZXJ0eScpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJQcm9wZXJ0eShzZWxlY3Rvcikge1xyXG5cdFx0dmFyIGxheWVycyA9IF9maWx0ZXJMYXllckJ5UHJvcGVydHkoZWxlbWVudHMsIHNlbGVjdG9yKTtcclxuXHRcdHZhciBwcm9wZXJ0aWVzID0gbGF5ZXJzLm1hcChmdW5jdGlvbihlbGVtZW50KXtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0UHJvcGVydHkoc2VsZWN0b3IpO1xyXG5cdFx0fSlcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChwcm9wZXJ0aWVzLCAncHJvcGVydHknKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEtleVBhdGgocHJvcGVydHlQYXRoKSB7XHJcblx0XHR2YXIga2V5UGF0aERhdGEgPSBrZXlQYXRoQnVpbGRlcihwcm9wZXJ0eVBhdGgpO1xyXG5cdFx0dmFyIHNlbGVjdG9yID0ga2V5UGF0aERhdGEuc2VsZWN0b3I7XHJcblx0XHR2YXIgbm9kZXNCeU5hbWUsIG5vZGVzQnlUeXBlLCBzZWxlY3RlZE5vZGVzO1xyXG5cdFx0aWYgKG5vZGVfdHlwZSA9PT0gJ3JlbmRlcmVyJyB8fCBub2RlX3R5cGUgPT09ICdsYXllcicpIHtcclxuXHRcdFx0bm9kZXNCeU5hbWUgPSBnZXRMYXllcnNCeU5hbWUoc2VsZWN0b3IpO1xyXG5cdFx0XHRub2Rlc0J5VHlwZSA9IGdldExheWVyc0J5VHlwZShzZWxlY3Rvcik7XHJcblx0XHRcdGlmIChub2Rlc0J5TmFtZS5sZW5ndGggPT09IDAgJiYgbm9kZXNCeVR5cGUubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0c2VsZWN0ZWROb2RlcyA9IGdldExheWVyUHJvcGVydHkoc2VsZWN0b3IpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNlbGVjdGVkTm9kZXMgPSBub2Rlc0J5TmFtZS5jb25jYXQobm9kZXNCeVR5cGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2Rlcy5nZXRLZXlQYXRoKGtleVBhdGhEYXRhLnByb3BlcnR5UGF0aCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXM7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZihub2RlX3R5cGUgPT09ICdwcm9wZXJ0eScpIHtcclxuXHRcdFx0c2VsZWN0ZWROb2RlcyA9IGdldFByb3BlcnRpZXNCeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0aWYgKGtleVBhdGhEYXRhLnByb3BlcnR5UGF0aCkge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzLmdldEtleVBhdGgoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2RlcztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY29uY2F0KG5vZGVzKSB7XHJcblx0XHR2YXIgbm9kZXNFbGVtZW50cyA9IG5vZGVzLmdldEVsZW1lbnRzKCk7XHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoZWxlbWVudHMuY29uY2F0KG5vZGVzRWxlbWVudHMpLCBub2RlX3R5cGUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0RWxlbWVudHMoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRQcm9wZXJ0eUF0SW5kZXgoaW5kZXgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50c1tpbmRleF07XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldEtleVBhdGg6IGdldEtleVBhdGgsXHJcblx0XHRjb25jYXQ6IGNvbmNhdCxcclxuXHRcdGdldEVsZW1lbnRzOiBnZXRFbGVtZW50cyxcclxuXHRcdGdldFByb3BlcnR5QXRJbmRleDogZ2V0UHJvcGVydHlBdEluZGV4XHJcblx0fVxyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobWV0aG9kcywgJ2xlbmd0aCcsIHtcclxuXHRcdGdldDogX2dldExlbmd0aFxyXG5cdH0pO1xyXG5cclxuXHRyZXR1cm4gbWV0aG9kcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlQYXRoTGlzdDsiLCJ2YXIga2V5X3BhdGhfc2VwYXJhdG9yID0gcmVxdWlyZSgnLi4vZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yJyk7XHJcbnZhciBwcm9wZXJ0eV9uYW1lcyA9IHJlcXVpcmUoJy4uL2VudW1zL3Byb3BlcnR5X25hbWVzJyk7XHJcblxyXG5mdW5jdGlvbiBLZXlQYXRoTm9kZShzdGF0ZSkge1xyXG5cclxuXHRmdW5jdGlvbiBnZXRQcm9wZXJ0eUJ5UGF0aChzZWxlY3RvciwgcHJvcGVydHlQYXRoKSB7XHJcblx0XHR2YXIgaW5zdGFuY2VQcm9wZXJ0aWVzID0gc3RhdGUucHJvcGVydGllcyB8fCBbXTtcclxuXHRcdHZhciBpID0gMCwgbGVuID0gaW5zdGFuY2VQcm9wZXJ0aWVzLmxlbmd0aDtcclxuXHRcdHdoaWxlKGkgPCBsZW4pIHtcclxuXHRcdFx0aWYoaW5zdGFuY2VQcm9wZXJ0aWVzW2ldLm5hbWUgPT09IHNlbGVjdG9yKSB7XHJcblx0XHRcdFx0cmV0dXJuIGluc3RhbmNlUHJvcGVydGllc1tpXS52YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpICs9IDE7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBoYXNQcm9wZXJ0eShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuICEhZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBnZXRQcm9wZXJ0eUJ5UGF0aChzZWxlY3Rvcik7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5wYXJlbnQuZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5wYXJlbnQudG9LZXlwYXRoTGF5ZXJQb2ludChwb2ludCk7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGhhc1Byb3BlcnR5OiBoYXNQcm9wZXJ0eSxcclxuXHRcdGdldFByb3BlcnR5OiBnZXRQcm9wZXJ0eSxcclxuXHRcdGZyb21LZXlwYXRoTGF5ZXJQb2ludDogZnJvbUtleXBhdGhMYXllclBvaW50LFxyXG5cdFx0dG9LZXlwYXRoTGF5ZXJQb2ludDogdG9LZXlwYXRoTGF5ZXJQb2ludFxyXG5cdH1cclxuXHRyZXR1cm4gbWV0aG9kcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlQYXRoTm9kZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi90cmFuc2Zvcm0vVHJhbnNmb3JtJyk7XHJcbnZhciBFZmZlY3RzID0gcmVxdWlyZSgnLi9lZmZlY3RzL0VmZmVjdHMnKTtcclxudmFyIE1hdHJpeCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdHJhbnNmb3JtYXRpb25NYXRyaXgnKTtcclxuXHJcbmZ1bmN0aW9uIExheWVyQmFzZShzdGF0ZSkge1xyXG5cclxuXHR2YXIgdHJhbnNmb3JtID0gVHJhbnNmb3JtKHN0YXRlLmVsZW1lbnQuZmluYWxUcmFuc2Zvcm0ubVByb3AsIHN0YXRlKTtcclxuXHR2YXIgZWZmZWN0cyA9IEVmZmVjdHMoc3RhdGUuZWxlbWVudC5lZmZlY3RzTWFuYWdlci5lZmZlY3RFbGVtZW50cyB8fCBbXSwgc3RhdGUpO1xyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHN0YXRlLnByb3BlcnRpZXMucHVzaCh7XHJcblx0XHRcdG5hbWU6ICd0cmFuc2Zvcm0nLFxyXG5cdFx0XHR2YWx1ZTogdHJhbnNmb3JtXHJcblx0XHR9LHtcclxuXHRcdFx0bmFtZTogJ1RyYW5zZm9ybScsXHJcblx0XHRcdHZhbHVlOiB0cmFuc2Zvcm1cclxuXHRcdH0se1xyXG5cdFx0XHRuYW1lOiAnRWZmZWN0cycsXHJcblx0XHRcdHZhbHVlOiBlZmZlY3RzXHJcblx0XHR9LHtcclxuXHRcdFx0bmFtZTogJ2VmZmVjdHMnLFxyXG5cdFx0XHR2YWx1ZTogZWZmZWN0c1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudFRvUG9pbnQocG9pbnQpIHtcclxuICAgIH1cclxuXHJcblx0ZnVuY3Rpb24gdG9LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkge1xyXG5cdFx0dmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50O1xyXG4gICAgXHRpZihzdGF0ZS5wYXJlbnQudG9LZXlwYXRoTGF5ZXJQb2ludCkge1xyXG4gICAgICAgIFx0cG9pbnQgPSBzdGF0ZS5wYXJlbnQudG9LZXlwYXRoTGF5ZXJQb2ludChwb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgXHR2YXIgdG9Xb3JsZE1hdCA9IE1hdHJpeCgpO1xyXG4gICAgICAgIHZhciB0cmFuc2Zvcm1NYXQgPSBzdGF0ZS5nZXRQcm9wZXJ0eSgnVHJhbnNmb3JtJykuZ2V0VGFyZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdHJhbnNmb3JtTWF0LmFwcGx5VG9NYXRyaXgodG9Xb3JsZE1hdCk7XHJcbiAgICAgICAgaWYoZWxlbWVudC5oaWVyYXJjaHkgJiYgZWxlbWVudC5oaWVyYXJjaHkubGVuZ3RoKXtcclxuICAgICAgICAgICAgdmFyIGksIGxlbiA9IGVsZW1lbnQuaGllcmFyY2h5Lmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yKGk9MDtpPGxlbjtpKz0xKXtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuaGllcmFyY2h5W2ldLmZpbmFsVHJhbnNmb3JtLm1Qcm9wLmFwcGx5VG9NYXRyaXgodG9Xb3JsZE1hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvV29ybGRNYXQuaW52ZXJzZVBvaW50KHBvaW50KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkge1xyXG5cdFx0dmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50O1xyXG5cdFx0dmFyIHRvV29ybGRNYXQgPSBNYXRyaXgoKTtcclxuICAgICAgICB2YXIgdHJhbnNmb3JtTWF0ID0gc3RhdGUuZ2V0UHJvcGVydHkoJ1RyYW5zZm9ybScpLmdldFRhcmdldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIGlmKGVsZW1lbnQuaGllcmFyY2h5ICYmIGVsZW1lbnQuaGllcmFyY2h5Lmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHZhciBpLCBsZW4gPSBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmhpZXJhcmNoeVtpXS5maW5hbFRyYW5zZm9ybS5tUHJvcC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvaW50ID0gdG9Xb3JsZE1hdC5hcHBseVRvUG9pbnRBcnJheShwb2ludFswXSxwb2ludFsxXSxwb2ludFsyXXx8MCk7XHJcbiAgICAgICAgaWYoc3RhdGUucGFyZW50LmZyb21LZXlwYXRoTGF5ZXJQb2ludCkge1xyXG4gICAgICAgIFx0cmV0dXJuIHN0YXRlLnBhcmVudC5mcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgXHRyZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0TGF5ZXIoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudDtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGFyZ2V0TGF5ZXI6IGdldFRhcmdldExheWVyLFxyXG5cdFx0dG9LZXlwYXRoTGF5ZXJQb2ludDogdG9LZXlwYXRoTGF5ZXJQb2ludCxcclxuXHRcdGZyb21LZXlwYXRoTGF5ZXJQb2ludDogZnJvbUtleXBhdGhMYXllclBvaW50XHJcblx0fVxyXG5cclxuXHRfYnVpbGRQcm9wZXJ0eU1hcCgpO1xyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSwgS2V5UGF0aE5vZGUoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXllckJhc2U7IiwidmFyIGxheWVyX3R5cGVzID0gcmVxdWlyZSgnLi4vZW51bXMvbGF5ZXJfdHlwZXMnKTtcclxudmFyIGxheWVyX2FwaSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5ZXJBUElCdWlsZGVyJyk7XHJcblxyXG5mdW5jdGlvbiBMYXllckxpc3QoZWxlbWVudHMpIHtcclxuXHJcblx0ZnVuY3Rpb24gX2dldExlbmd0aCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5sZW5ndGg7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLnR5ID09PSBsYXllcl90eXBlc1t0eXBlXTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCBuYW1lKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS5ubSA9PT0gbmFtZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzKCkge1xyXG5cdFx0IHJldHVybiBMYXllckxpc3QoZWxlbWVudHMpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlUeXBlKHR5cGUpIHtcclxuXHRcdHZhciBlbGVtZW50c0xpc3QgPSBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpO1xyXG5cdFx0cmV0dXJuIExheWVyTGlzdChlbGVtZW50c0xpc3QpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlOYW1lKHR5cGUpIHtcclxuXHRcdHZhciBlbGVtZW50c0xpc3QgPSBfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIHR5cGUpO1xyXG5cdFx0cmV0dXJuIExheWVyTGlzdChlbGVtZW50c0xpc3QpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbGF5ZXIoaW5kZXgpIHtcclxuXHRcdGlmIChpbmRleCA+PSBlbGVtZW50cy5sZW5ndGgpIHtcclxuXHRcdFx0cmV0dXJuIFtdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGxheWVyX2FwaShlbGVtZW50c1twYXJzZUludChpbmRleCldKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZEl0ZXJhdGFibGVNZXRob2RzKGl0ZXJhdGFibGVNZXRob2RzLCBsaXN0KSB7XHJcblx0XHRpdGVyYXRhYmxlTWV0aG9kcy5yZWR1Y2UoZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlKXtcclxuXHRcdFx0dmFyIF92YWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRhY2N1bXVsYXRvclt2YWx1ZV0gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcclxuXHRcdFx0XHRyZXR1cm4gZWxlbWVudHMubWFwKGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0XHRcdFx0dmFyIGxheWVyID0gbGF5ZXJfYXBpKGVsZW1lbnQpO1xyXG5cdFx0XHRcdFx0aWYobGF5ZXJbX3ZhbHVlXSkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbGF5ZXJbX3ZhbHVlXS5hcHBseShudWxsLCBfYXJndW1lbnRzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBhY2N1bXVsYXRvcjtcclxuXHRcdH0sIG1ldGhvZHMpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0RWxlbWVudHMoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25jYXQobGlzdCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmNvbmNhdChsaXN0LmdldFRhcmdldEVsZW1lbnRzKCkpO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRMYXllcnM6IGdldExheWVycyxcclxuXHRcdGdldExheWVyc0J5VHlwZTogZ2V0TGF5ZXJzQnlUeXBlLFxyXG5cdFx0Z2V0TGF5ZXJzQnlOYW1lOiBnZXRMYXllcnNCeU5hbWUsXHJcblx0XHRsYXllcjogbGF5ZXIsXHJcblx0XHRjb25jYXQ6IGNvbmNhdCxcclxuXHRcdGdldFRhcmdldEVsZW1lbnRzOiBnZXRUYXJnZXRFbGVtZW50c1xyXG5cdH07XHJcblxyXG5cdGFkZEl0ZXJhdGFibGVNZXRob2RzKFsnc2V0VHJhbnNsYXRlJywgJ2dldFR5cGUnLCAnZ2V0RHVyYXRpb24nXSk7XHJcblx0YWRkSXRlcmF0YWJsZU1ldGhvZHMoWydzZXRUZXh0JywgJ2dldFRleHQnLCAnc2V0RG9jdW1lbnREYXRhJywgJ2NhblJlc2l6ZUZvbnQnLCAnc2V0TWluaW11bUZvbnRTaXplJ10pO1xyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobWV0aG9kcywgJ2xlbmd0aCcsIHtcclxuXHRcdGdldDogX2dldExlbmd0aFxyXG5cdH0pO1xyXG5cdHJldHVybiBtZXRob2RzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyTGlzdDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gQ2FtZXJhKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1BvaW50IG9mIEludGVyZXN0JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5hLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnWm9vbScsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucGUsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnJ4LCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnWSBSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucnksIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdaIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5yeiwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09yaWVudGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5vciwgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRUYXJnZXRMYXllcigpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5lbGVtZW50O1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRUYXJnZXRMYXllcjogZ2V0VGFyZ2V0TGF5ZXJcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBLZXlQYXRoTm9kZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYTsiLCJ2YXIgS2V5UGF0aExpc3QgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTGlzdCcpO1xyXG52YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG52YXIgVGltZVJlbWFwID0gcmVxdWlyZSgnLi9UaW1lUmVtYXAnKTtcclxuXHJcbmZ1bmN0aW9uIENvbXBvc2l0aW9uKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRMYXllckFwaShsYXllciwgaW5kZXgpIHtcclxuXHRcdHZhciBfbGF5ZXJBcGkgPSBudWxsO1xyXG5cdFx0dmFyIG9iID0ge1xyXG5cdFx0XHRuYW1lOiBsYXllci5ubVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGdldExheWVyQXBpKCkge1xyXG5cdFx0XHRpZighX2xheWVyQXBpKSB7XHJcblx0XHRcdFx0X2xheWVyQXBpID0gbGF5ZXJfYXBpKGVsZW1lbnQuZWxlbWVudHNbaW5kZXhdLCBzdGF0ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gX2xheWVyQXBpXHJcblx0XHR9XHJcblxyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iLCAndmFsdWUnLCB7XHJcblx0XHRcdGdldCA6IGdldExheWVyQXBpXHJcblx0XHR9KVxyXG5cdFx0cmV0dXJuIG9iO1xyXG5cdH1cclxuXHJcblx0XHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHR2YXIgY29tcG9zaXRpb25MYXllcnMgPSBlbGVtZW50LmxheWVycy5tYXAoYnVpbGRMYXllckFwaSlcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnVGltZSBSZW1hcCcsXHJcblx0XHRcdFx0dmFsdWU6IFRpbWVSZW1hcChlbGVtZW50LnRtKVxyXG5cdFx0XHR9XHJcblx0XHRdLmNvbmNhdChjb21wb3NpdGlvbkxheWVycylcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIExheWVyQmFzZShzdGF0ZSksIEtleVBhdGhMaXN0KHN0YXRlLmVsZW1lbnRzLCAnbGF5ZXInKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRpb247IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFZhbHVlUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9WYWx1ZVByb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBUaW1lUmVtYXAocHJvcGVydHksIHBhcmVudCkge1xyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnR5OiBwcm9wZXJ0eSxcclxuXHRcdHBhcmVudDogcGFyZW50XHJcblx0fVxyXG5cclxuXHR2YXIgX2lzQ2FsbGJhY2tBZGRlZCA9IGZhbHNlO1xyXG5cdHZhciBjdXJyZW50U2VnbWVudEluaXQgPSAwO1xyXG5cdHZhciBjdXJyZW50U2VnbWVudEVuZCA9IDA7XHJcblx0dmFyIHByZXZpb3VzVGltZSA9IDAsIGN1cnJlbnRUaW1lID0gMDtcclxuXHR2YXIgaW5pdFRpbWUgPSAwO1xyXG5cdHZhciBfbG9vcCA9IHRydWU7XHJcblx0dmFyIF9sb29wQ291bnQgPSAwO1xyXG5cdHZhciBfc3BlZWQgPSAxO1xyXG5cdHZhciBfcGF1c2VkID0gZmFsc2U7XHJcblx0dmFyIF9pc0RlYnVnZ2luZyA9IGZhbHNlO1xyXG5cdHZhciBxdWV1ZWRTZWdtZW50cyA9IFtdO1xyXG5cdHZhciBfZGVzdHJveUZ1bmN0aW9uO1xyXG5cdHZhciBlbnRlckZyYW1lQ2FsbGJhY2sgPSBudWxsO1xyXG5cdHZhciBlbnRlckZyYW1lRXZlbnQgPSB7XHJcblx0XHR0aW1lOiAtMVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcGxheVNlZ21lbnQoaW5pdCwgZW5kLCBjbGVhcikge1xyXG5cdFx0X3BhdXNlZCA9IGZhbHNlO1xyXG5cdFx0aWYoY2xlYXIpIHtcclxuXHRcdFx0Y2xlYXJRdWV1ZSgpO1xyXG5cdFx0XHRjdXJyZW50VGltZSA9IGluaXQ7XHJcblx0XHR9XHJcblx0XHRpZihfaXNEZWJ1Z2dpbmcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coaW5pdCwgZW5kKTtcclxuXHRcdH1cclxuXHRcdF9sb29wQ291bnQgPSAwO1xyXG5cdFx0cHJldmlvdXNUaW1lID0gRGF0ZS5ub3coKTtcclxuXHRcdGN1cnJlbnRTZWdtZW50SW5pdCA9IGluaXQ7XHJcblx0XHRjdXJyZW50U2VnbWVudEVuZCA9IGVuZDtcclxuXHRcdGFkZENhbGxiYWNrKCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwbGF5UXVldWVkU2VnbWVudCgpIHtcclxuXHRcdHZhciBuZXdTZWdtZW50ID0gcXVldWVkU2VnbWVudHMuc2hpZnQoKTtcclxuXHRcdHBsYXlTZWdtZW50KG5ld1NlZ21lbnRbMF0sIG5ld1NlZ21lbnRbMV0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcXVldWVTZWdtZW50KGluaXQsIGVuZCkge1xyXG5cdFx0cXVldWVkU2VnbWVudHMucHVzaChbaW5pdCwgZW5kXSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjbGVhclF1ZXVlKCkge1xyXG5cdFx0cXVldWVkU2VnbWVudHMubGVuZ3RoID0gMDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9zZWdtZW50UGxheWVyKGN1cnJlbnRWYWx1ZSkge1xyXG5cdFx0aWYoY3VycmVudFNlZ21lbnRJbml0ID09PSBjdXJyZW50U2VnbWVudEVuZCkge1xyXG5cdFx0XHRjdXJyZW50VGltZSA9IGN1cnJlbnRTZWdtZW50SW5pdDtcclxuXHRcdH0gZWxzZSBpZighX3BhdXNlZCkge1xyXG5cdFx0XHR2YXIgbm93VGltZSA9IERhdGUubm93KCk7XHJcblx0XHRcdHZhciBlbGFwc2VkVGltZSA9IF9zcGVlZCAqIChub3dUaW1lIC0gcHJldmlvdXNUaW1lKSAvIDEwMDA7XHJcblx0XHRcdHByZXZpb3VzVGltZSA9IG5vd1RpbWU7XHJcblx0XHRcdGlmKGN1cnJlbnRTZWdtZW50SW5pdCA8IGN1cnJlbnRTZWdtZW50RW5kKSB7XHJcblx0XHRcdFx0Y3VycmVudFRpbWUgKz0gZWxhcHNlZFRpbWU7XHJcblx0XHRcdFx0aWYoY3VycmVudFRpbWUgPiBjdXJyZW50U2VnbWVudEVuZCkge1xyXG5cdFx0XHRcdFx0X2xvb3BDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0aWYocXVldWVkU2VnbWVudHMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdHBsYXlRdWV1ZWRTZWdtZW50KCk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYoIV9sb29wKSB7XHJcblx0XHRcdFx0XHRcdGN1cnJlbnRUaW1lID0gY3VycmVudFNlZ21lbnRFbmQ7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvKmN1cnJlbnRUaW1lIC09IE1hdGguZmxvb3IoY3VycmVudFRpbWUgLyAoY3VycmVudFNlZ21lbnRFbmQgLSBjdXJyZW50U2VnbWVudEluaXQpKSAqIChjdXJyZW50U2VnbWVudEVuZCAtIGN1cnJlbnRTZWdtZW50SW5pdCk7XHJcblx0XHRcdFx0XHRcdGN1cnJlbnRUaW1lID0gY3VycmVudFNlZ21lbnRJbml0ICsgY3VycmVudFRpbWU7Ki9cclxuXHRcdFx0XHRcdFx0Y3VycmVudFRpbWUgPSBjdXJyZW50VGltZSAlIChjdXJyZW50U2VnbWVudEVuZCAtIGN1cnJlbnRTZWdtZW50SW5pdCk7XHJcblx0XHRcdFx0XHRcdC8vY3VycmVudFRpbWUgPSBjdXJyZW50U2VnbWVudEluaXQgKyAoY3VycmVudFRpbWUpO1xyXG5cdFx0XHRcdFx0XHQvL2N1cnJlbnRUaW1lID0gY3VycmVudFNlZ21lbnRJbml0ICsgKGN1cnJlbnRUaW1lIC0gY3VycmVudFNlZ21lbnRFbmQpO1xyXG5cdFx0XHRcdFx0XHQgLy9jb25zb2xlLmxvZygnQ1Q6ICcsIGN1cnJlbnRUaW1lKSBcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3VycmVudFRpbWUgLT0gZWxhcHNlZFRpbWU7XHJcblx0XHRcdFx0aWYoY3VycmVudFRpbWUgPCBjdXJyZW50U2VnbWVudEVuZCkge1xyXG5cdFx0XHRcdFx0X2xvb3BDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0aWYocXVldWVkU2VnbWVudHMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdHBsYXlRdWV1ZWRTZWdtZW50KCk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYoIV9sb29wKSB7XHJcblx0XHRcdFx0XHRcdGN1cnJlbnRUaW1lID0gY3VycmVudFNlZ21lbnRFbmQ7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjdXJyZW50VGltZSA9IGN1cnJlbnRTZWdtZW50SW5pdCAtIChjdXJyZW50U2VnbWVudEVuZCAtIGN1cnJlbnRUaW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoX2lzRGVidWdnaW5nKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coY3VycmVudFRpbWUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmKGluc3RhbmNlLm9uRW50ZXJGcmFtZSAmJiBlbnRlckZyYW1lRXZlbnQudGltZSAhPT0gY3VycmVudFRpbWUpIHtcclxuXHRcdFx0ZW50ZXJGcmFtZUV2ZW50LnRpbWUgPSBjdXJyZW50VGltZTtcclxuXHRcdFx0aW5zdGFuY2Uub25FbnRlckZyYW1lKGVudGVyRnJhbWVFdmVudCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY3VycmVudFRpbWU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRDYWxsYmFjaygpIHtcclxuXHRcdGlmKCFfaXNDYWxsYmFja0FkZGVkKSB7XHJcblx0XHRcdF9pc0NhbGxiYWNrQWRkZWQgPSB0cnVlO1xyXG5cdFx0XHRfZGVzdHJveUZ1bmN0aW9uID0gaW5zdGFuY2Uuc2V0VmFsdWUoX3NlZ21lbnRQbGF5ZXIsIF9pc0RlYnVnZ2luZylcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHBsYXlUbyhlbmQsIGNsZWFyKSB7XHJcblx0XHRfcGF1c2VkID0gZmFsc2U7XHJcblx0XHRpZihjbGVhcikge1xyXG5cdFx0XHRjbGVhclF1ZXVlKCk7XHJcblx0XHR9XHJcblx0XHRhZGRDYWxsYmFjaygpO1xyXG5cdFx0Y3VycmVudFNlZ21lbnRFbmQgPSBlbmQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRDdXJyZW50VGltZSgpIHtcclxuXHRcdGlmKF9pc0NhbGxiYWNrQWRkZWQpIHtcclxuXHRcdFx0cmV0dXJuIGN1cnJlbnRUaW1lO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHByb3BlcnR5LnYgLyBwcm9wZXJ0eS5tdWx0O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0TG9vcChmbGFnKSB7XHJcblx0XHRfbG9vcCA9IGZsYWc7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTcGVlZCh2YWx1ZSkge1xyXG5cdFx0X3NwZWVkID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXREZWJ1Z2dpbmcoZmxhZykge1xyXG5cdFx0X2lzRGVidWdnaW5nID0gZmxhZztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHBhdXNlKCkge1xyXG5cdFx0X3BhdXNlZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkZXN0cm95KCkge1xyXG5cdFx0aWYoX2Rlc3Ryb3lGdW5jdGlvbikge1xyXG5cdFx0XHRfZGVzdHJveUZ1bmN0aW9uKCk7XHJcblx0XHRcdHN0YXRlLnByb3BlcnR5ID0gbnVsbDtcclxuXHRcdFx0c3RhdGUucGFyZW50ID0gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0cGxheVNlZ21lbnQ6IHBsYXlTZWdtZW50LFxyXG5cdFx0cGxheVRvOiBwbGF5VG8sXHJcblx0XHRxdWV1ZVNlZ21lbnQ6IHF1ZXVlU2VnbWVudCxcclxuXHRcdGNsZWFyUXVldWU6IGNsZWFyUXVldWUsXHJcblx0XHRzZXRMb29wOiBzZXRMb29wLFxyXG5cdFx0c2V0U3BlZWQ6IHNldFNwZWVkLFxyXG5cdFx0cGF1c2U6IHBhdXNlLFxyXG5cdFx0c2V0RGVidWdnaW5nOiBzZXREZWJ1Z2dpbmcsXHJcblx0XHRnZXRDdXJyZW50VGltZTogZ2V0Q3VycmVudFRpbWUsXHJcblx0XHRvbkVudGVyRnJhbWU6IG51bGwsXHJcblx0XHRkZXN0cm95OiBkZXN0cm95XHJcblx0fVxyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgbWV0aG9kcywgVmFsdWVQcm9wZXJ0eShzdGF0ZSksIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZVJlbWFwOyIsInZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBFZmZlY3RFbGVtZW50KGVmZmVjdCwgcGFyZW50KSB7XHJcblxyXG5cdHJldHVybiBQcm9wZXJ0eShlZmZlY3QucCwgcGFyZW50KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFZmZlY3RFbGVtZW50OyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcbnZhciBFZmZlY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9FZmZlY3RFbGVtZW50Jyk7XHJcblxyXG5mdW5jdGlvbiBFZmZlY3RzKGVmZmVjdHMsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IGJ1aWxkUHJvcGVydGllcygpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRWYWx1ZShlZmZlY3REYXRhLCBpbmRleCkge1xyXG5cdFx0dmFyIG5tID0gZWZmZWN0RGF0YS5kYXRhID8gZWZmZWN0RGF0YS5kYXRhLm5tIDogaW5kZXgudG9TdHJpbmcoKTtcclxuXHRcdHZhciBlZmZlY3RFbGVtZW50ID0gZWZmZWN0RGF0YS5kYXRhID8gRWZmZWN0cyhlZmZlY3REYXRhLmVmZmVjdEVsZW1lbnRzLCBwYXJlbnQpIDogUHJvcGVydHkoZWZmZWN0RGF0YS5wLCBwYXJlbnQpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogbm0sXHJcblx0XHRcdHZhbHVlOiBlZmZlY3RFbGVtZW50XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZFByb3BlcnRpZXMoKSB7XHJcblx0XHR2YXIgaSwgbGVuID0gZWZmZWN0cy5sZW5ndGg7XHJcblx0XHR2YXIgYXJyID0gW107XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0YXJyLnB1c2goZ2V0VmFsdWUoZWZmZWN0c1tpXSwgaSkpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFycjtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFZmZlY3RzOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIEltYWdlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJCYXNlKGVsZW1lbnQpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZTsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBOdWxsRWxlbWVudChlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE51bGxFbGVtZW50OyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxudmFyIFNoYXBlQ29udGVudHMgPSByZXF1aXJlKCcuL1NoYXBlQ29udGVudHMnKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBbXSxcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0ZWxlbWVudDogZWxlbWVudFxyXG5cdH1cclxuXHR2YXIgc2hhcGVDb250ZW50cyA9IFNoYXBlQ29udGVudHMoZWxlbWVudC5kYXRhLnNoYXBlcywgZWxlbWVudC5pdGVtc0RhdGEsIHN0YXRlKTtcclxuXHJcblx0XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0c3RhdGUucHJvcGVydGllcy5wdXNoKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0NvbnRlbnRzJyxcclxuXHRcdFx0XHR2YWx1ZTogc2hhcGVDb250ZW50c1xyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdF9idWlsZFByb3BlcnR5TWFwKCk7XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlLCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG52YXIgU2hhcGVSZWN0YW5nbGUgPSByZXF1aXJlKCcuL1NoYXBlUmVjdGFuZ2xlJyk7XHJcbnZhciBTaGFwZUZpbGwgPSByZXF1aXJlKCcuL1NoYXBlRmlsbCcpO1xyXG52YXIgU2hhcGVTdHJva2UgPSByZXF1aXJlKCcuL1NoYXBlU3Ryb2tlJyk7XHJcbnZhciBTaGFwZUVsbGlwc2UgPSByZXF1aXJlKCcuL1NoYXBlRWxsaXBzZScpO1xyXG52YXIgU2hhcGVHcmFkaWVudEZpbGwgPSByZXF1aXJlKCcuL1NoYXBlR3JhZGllbnRGaWxsJyk7XHJcbnZhciBTaGFwZUdyYWRpZW50U3Ryb2tlID0gcmVxdWlyZSgnLi9TaGFwZUdyYWRpZW50U3Ryb2tlJyk7XHJcbnZhciBTaGFwZVRyaW1QYXRocyA9IHJlcXVpcmUoJy4vU2hhcGVUcmltUGF0aHMnKTtcclxudmFyIFNoYXBlUmVwZWF0ZXIgPSByZXF1aXJlKCcuL1NoYXBlUmVwZWF0ZXInKTtcclxudmFyIFNoYXBlUG9seXN0YXIgPSByZXF1aXJlKCcuL1NoYXBlUG9seXN0YXInKTtcclxudmFyIFNoYXBlUm91bmRDb3JuZXJzID0gcmVxdWlyZSgnLi9TaGFwZVJvdW5kQ29ybmVycycpO1xyXG52YXIgU2hhcGVQYXRoID0gcmVxdWlyZSgnLi9TaGFwZVBhdGgnKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybS9UcmFuc2Zvcm0nKTtcclxudmFyIE1hdHJpeCA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvdHJhbnNmb3JtYXRpb25NYXRyaXgnKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlQ29udGVudHMoc2hhcGVzRGF0YSwgc2hhcGVzLCBwYXJlbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpLFxyXG5cdFx0cGFyZW50OiBwYXJlbnRcclxuXHR9XHJcblxyXG5cdHZhciBjYWNoZWRTaGFwZVByb3BlcnRpZXMgPSBbXTtcclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpIHtcclxuXHRcdHZhciBvYiA9IHtcclxuXHRcdFx0bmFtZTogc2hhcGUubm1cclxuXHRcdH1cclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYiwgJ3ZhbHVlJywge1xyXG5cdFx0ICAgZ2V0KCkge1xyXG5cdFx0ICAgXHRpZihjYWNoZWRTaGFwZVByb3BlcnRpZXNbaW5kZXhdKSB7XHJcblx0XHQgICBcdFx0cmV0dXJuIGNhY2hlZFNoYXBlUHJvcGVydGllc1tpbmRleF07XHJcblx0XHQgICBcdH0gZWxzZSB7XHJcblx0XHQgICBcdFx0dmFyIHByb3BlcnR5O1xyXG5cdFx0ICAgXHR9XHJcblx0ICAgXHRcdGlmKHNoYXBlLnR5ID09PSAnZ3InKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZUNvbnRlbnRzKHNoYXBlc0RhdGFbaW5kZXhdLml0LCBzaGFwZXNbaW5kZXhdLml0LCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3JjJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVSZWN0YW5nbGUoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdlbCcpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlRWxsaXBzZShzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2ZsJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVGaWxsKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnc3QnKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVN0cm9rZShzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2dmJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVHcmFkaWVudEZpbGwoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdncycpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlR3JhZGllbnRTdHJva2Uoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICd0bScpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlVHJpbVBhdGhzKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAncnAnKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVJlcGVhdGVyKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnc3InKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVBvbHlzdGFyKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAncmQnKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVJvdW5kQ29ybmVycyhzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3NoJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVQYXRoKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAndHInKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBUcmFuc2Zvcm0oc2hhcGVzW2luZGV4XS50cmFuc2Zvcm0ubVByb3BzLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSB7XHJcblx0ICAgXHRcdFx0Y29uc29sZS5sb2coc2hhcGUudHkpO1xyXG5cdCAgIFx0XHR9XHJcblx0ICAgXHRcdGNhY2hlZFNoYXBlUHJvcGVydGllc1tpbmRleF0gPSBwcm9wZXJ0eTtcclxuXHQgICBcdFx0cmV0dXJuIHByb3BlcnR5O1xyXG5cdFx0ICAgfVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb2JcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIHNoYXBlc0RhdGEubWFwKGZ1bmN0aW9uKHNoYXBlLCBpbmRleCkge1xyXG5cdFx0XHRyZXR1cm4gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkge1xyXG5cdFx0aWYoc3RhdGUuaGFzUHJvcGVydHkoJ1RyYW5zZm9ybScpKSB7XHJcbiAgICBcdFx0dmFyIHRvV29ybGRNYXQgPSBNYXRyaXgoKTtcclxuICAgICAgICBcdHZhciB0cmFuc2Zvcm1NYXQgPSBzdGF0ZS5nZXRQcm9wZXJ0eSgnVHJhbnNmb3JtJykuZ2V0VGFyZ2V0VHJhbnNmb3JtKCk7XHJcblx0XHRcdHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIFx0cG9pbnQgPSB0b1dvcmxkTWF0LmFwcGx5VG9Qb2ludEFycmF5KHBvaW50WzBdLHBvaW50WzFdLHBvaW50WzJdfHwwKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBzdGF0ZS5wYXJlbnQuZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHBvaW50ID0gc3RhdGUucGFyZW50LnRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xyXG5cdFx0aWYoc3RhdGUuaGFzUHJvcGVydHkoJ1RyYW5zZm9ybScpKSB7XHJcbiAgICBcdFx0dmFyIHRvV29ybGRNYXQgPSBNYXRyaXgoKTtcclxuICAgICAgICBcdHZhciB0cmFuc2Zvcm1NYXQgPSBzdGF0ZS5nZXRQcm9wZXJ0eSgnVHJhbnNmb3JtJykuZ2V0VGFyZ2V0VHJhbnNmb3JtKCk7XHJcblx0XHRcdHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIFx0cG9pbnQgPSB0b1dvcmxkTWF0LmludmVyc2VQb2ludChwb2ludCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcG9pbnQ7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGZyb21LZXlwYXRoTGF5ZXJQb2ludDogZnJvbUtleXBhdGhMYXllclBvaW50LFxyXG5cdFx0dG9LZXlwYXRoTGF5ZXJQb2ludDogdG9LZXlwYXRoTGF5ZXJQb2ludFxyXG5cdH1cclxuXHJcblx0Ly9zdGF0ZS5wcm9wZXJ0aWVzID0gX2J1aWxkUHJvcGVydHlNYXAoKTtcclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUsIEtleVBhdGhOb2RlKHN0YXRlKSwgbWV0aG9kcylcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUNvbnRlbnRzOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUVsbGlwc2UoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1NpemUnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2gucCwgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVFbGxpcHNlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUZpbGwoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0NvbG9yJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5jLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUZpbGw7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlR3JhZGllbnRGaWxsKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdGFydCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgTGVuZ3RoJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5oLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IEFuZ2xlJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5hLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQ29sb3JzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5nLnByb3AsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlR3JhZGllbnRGaWxsOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUdyYWRpZW50U3Ryb2tlKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdGFydCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuZSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgTGVuZ3RoJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5oLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IEFuZ2xlJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5hLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQ29sb3JzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5nLnByb3AsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdHJva2UgV2lkdGgnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LncsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlR3JhZGllbnRTdHJva2U7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUGF0aChlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQYXRoKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAncGF0aCcsXHJcblx0XHRcdFx0dmFsdWU6UHJvcGVydHkoZWxlbWVudC5zaCwgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVQYXRoOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVBvbHlzdGFyKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb2ludHMnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnB0LCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnAsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2guciwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0lubmVyIFJhZGl1cycsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2guaXIsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPdXRlciBSYWRpdXMnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLm9yLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSW5uZXIgUm91bmRuZXNzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5pcywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ091dGVyIFJvdW5kbmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2gub3MsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUG9seXN0YXI7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUmVjdGFuZ2xlKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTaXplJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5zLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnAsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3VuZG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnIsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUmVjdGFuZ2xlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuLi90cmFuc2Zvcm0vVHJhbnNmb3JtJyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVJlcGVhdGVyKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdDb3BpZXMnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LmMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPZmZzZXQnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdUcmFuc2Zvcm0nLFxyXG5cdFx0XHRcdHZhbHVlOiBUcmFuc2Zvcm0oZWxlbWVudC50ciwgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVSZXBlYXRlcjsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVSb3VuZENvcm5lcnMoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JhZGl1cycsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucmQsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUm91bmRDb3JuZXJzOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVN0cm9rZShlbGVtZW50LCBwYXJlbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdjb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3N0cm9rZSB3aWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQudywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ29wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlU3Ryb2tlIiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlVHJpbVBhdGhzKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdGFydCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuZSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09mZnNldCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQubywgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVUcmltUGF0aHM7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG5cclxuZnVuY3Rpb24gU29saWQoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNvbGlkOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcbnZhciBUZXh0QW5pbWF0b3IgPSByZXF1aXJlKCcuL1RleHRBbmltYXRvcicpO1xyXG5cclxuZnVuY3Rpb24gVGV4dChlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge31cclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RG9jdW1lbnREYXRhKF9mdW5jdGlvbikge1xyXG5cdFx0dmFyIHByZXZpb3VzVmFsdWU7XHJcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIG5ld1ZhbHVlID0gX2Z1bmN0aW9uKGVsZW1lbnQudGV4dFByb3BlcnR5LmN1cnJlbnREYXRhKTtcclxuXHRcdFx0aWYgKHByZXZpb3VzVmFsdWUgIT09IG5ld1ZhbHVlKSB7XHJcblx0XHRcdFx0ZWxlbWVudC51cGRhdGVEb2N1bWVudERhdGEobmV3VmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdH0sIDUwMClcclxuXHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRBbmltYXRvcnMoKSB7XHJcblx0XHR2YXIgYW5pbWF0b3JQcm9wZXJ0aWVzID0gW107XHJcblx0XHR2YXIgYW5pbWF0b3JzID0gZWxlbWVudC50ZXh0QW5pbWF0b3IuX2FuaW1hdG9yc0RhdGE7XHJcblx0XHR2YXIgaSwgbGVuID0gYW5pbWF0b3JzLmxlbmd0aDtcclxuXHRcdHZhciB0ZXh0QW5pbWF0b3I7XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0dGV4dEFuaW1hdG9yID0gVGV4dEFuaW1hdG9yKGFuaW1hdG9yc1tpXSlcclxuXHRcdFx0YW5pbWF0b3JQcm9wZXJ0aWVzLnB1c2goe1xyXG5cdFx0XHRcdG5hbWU6IGVsZW1lbnQudGV4dEFuaW1hdG9yLl90ZXh0RGF0YS5hW2ldLm5tIHx8ICdBbmltYXRvciAnICsgKGkrMSksIC8vRmFsbGJhY2sgZm9yIG9sZCBhbmltYXRpb25zXHJcblx0XHRcdFx0dmFsdWU6IHRleHRBbmltYXRvclxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFuaW1hdG9yUHJvcGVydGllcztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NvdXJjZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXREb2N1bWVudERhdGFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF0uY29uY2F0KGFkZEFuaW1hdG9ycygpKVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgbWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gVGV4dEFuaW1hdG9yKGFuaW1hdG9yKSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEFuY2hvclBvaW50KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxCcmlnaHRuZXNzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZiKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRGaWxsQ29sb3IodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZmMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxIdWUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZmgpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxTYXR1cmF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZzKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRGaWxsT3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5mbykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5yKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvblgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucngpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJvdGF0aW9uWSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5yeSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2NhbGUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2tld0F4aXModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc2EpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZUNvbG9yKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNjKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTa2V3KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNrKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNvKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VXaWR0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zdykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlQnJpZ2h0bmVzcyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zYikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlSHVlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNoKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VTYXR1cmF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNzKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRUcmFja2luZ0Ftb3VudCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS50KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidBbmNob3IgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0QW5jaG9yUG9pbnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIEJyaWdodG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbEJyaWdodG5lc3NcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIENvbG9yJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J0ZpbGwgSHVlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxIdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIFNhdHVyYXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbFNhdHVyYXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIE9wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1JvdGF0aW9uIFgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Um90YXRpb25YXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonUm90YXRpb24gWScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSb3RhdGlvbllcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTY2FsZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTY2FsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NrZXcgQXhpcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTa2V3QXhpc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBDb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NrZXcnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2tld1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBXaWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VXaWR0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1RyYWNraW5nIEFtb3VudCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRUcmFja2luZ0Ftb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZU9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTdHJva2UgQnJpZ2h0bmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VCcmlnaHRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU3Ryb2tlIFNhdHVyYXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlU2F0dXJhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBIdWUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlSHVlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRBbmltYXRvcjsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBUZXh0ID0gcmVxdWlyZSgnLi9UZXh0Jyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0RWxlbWVudChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgVGV4dFByb3BlcnR5ID0gVGV4dChlbGVtZW50KTtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3RleHQnLFxyXG5cdFx0XHRcdHZhbHVlOiBUZXh0UHJvcGVydHlcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdUZXh0JyxcclxuXHRcdFx0XHR2YWx1ZTogVGV4dFByb3BlcnR5XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRleHQoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC50ZXh0UHJvcGVydHkuY3VycmVudERhdGEudDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFRleHQodmFsdWUsIGluZGV4KSB7XHJcblx0XHRzZXREb2N1bWVudERhdGEoe3Q6IHZhbHVlfSwgaW5kZXgpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RG9jdW1lbnREYXRhKGRhdGEsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC51cGRhdGVEb2N1bWVudERhdGEoZGF0YSwgaW5kZXgpO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBjYW5SZXNpemVGb250KF9jYW5SZXNpemUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmNhblJlc2l6ZUZvbnQoX2NhblJlc2l6ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5zZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGV4dDogZ2V0VGV4dCxcclxuXHRcdHNldFRleHQ6IHNldFRleHQsXHJcblx0XHRjYW5SZXNpemVGb250OiBjYW5SZXNpemVGb250LFxyXG5cdFx0c2V0RG9jdW1lbnREYXRhOiBzZXREb2N1bWVudERhdGEsXHJcblx0XHRzZXRNaW5pbXVtRm9udFNpemU6IHNldE1pbmltdW1Gb250U2l6ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0RWxlbWVudDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gVHJhbnNmb3JtKHByb3BzLCBwYXJlbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQW5jaG9yIFBvaW50JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMuYSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1BvaW50IG9mIEludGVyZXN0JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMuYSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1NjYWxlJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMuciwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5weCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5weSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5weiwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5yeCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5yeSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5yeiwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5vLCBwYXJlbnQpXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRhcmdldFRyYW5zZm9ybSgpIHtcclxuXHRcdHJldHVybiBwcm9wcztcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGFyZ2V0VHJhbnNmb3JtOiBnZXRUYXJnZXRUcmFuc2Zvcm1cclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJhbnNmb3JtOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBWYWx1ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9WYWx1ZVByb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBQcm9wZXJ0eShwcm9wZXJ0eSwgcGFyZW50KSB7XHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydHk6IHByb3BlcnR5LFxyXG5cdFx0cGFyZW50OiBwYXJlbnRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcblx0XHRzdGF0ZS5wcm9wZXJ0eSA9IG51bGw7XHJcblx0XHRzdGF0ZS5wYXJlbnQgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRkZXN0cm95OiBkZXN0cm95XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgbWV0aG9kcywgVmFsdWVQcm9wZXJ0eShzdGF0ZSksIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJvcGVydHk7IiwiZnVuY3Rpb24gVmFsdWVQcm9wZXJ0eShzdGF0ZSkge1xyXG5cdFxyXG5cdGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlKSB7XHJcblx0XHR2YXIgcHJvcGVydHkgPSBzdGF0ZS5wcm9wZXJ0eTtcclxuXHRcdGlmKCFwcm9wZXJ0eSB8fCAhcHJvcGVydHkuYWRkRWZmZWN0KSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0cmV0dXJuIHByb3BlcnR5LmFkZEVmZmVjdCh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnByb3BUeXBlID09PSAnbXVsdGlkaW1lbnNpb25hbCcgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5sZW5ndGggPT09IDIpIHtcclxuXHRcdFx0cmV0dXJuIHByb3BlcnR5LmFkZEVmZmVjdChmdW5jdGlvbigpe3JldHVybiB2YWx1ZX0pO1xyXG5cdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS5wcm9wVHlwZSA9PT0gJ3VuaWRpbWVuc2lvbmFsJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XHJcblx0XHRcdHJldHVybiBwcm9wZXJ0eS5hZGRFZmZlY3QoZnVuY3Rpb24oKXtyZXR1cm4gdmFsdWV9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFZhbHVlKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLnByb3BlcnR5LnY7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdHNldFZhbHVlOiBzZXRWYWx1ZSxcclxuXHRcdGdldFZhbHVlOiBnZXRWYWx1ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG1ldGhvZHM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmFsdWVQcm9wZXJ0eTsiLCJ2YXIgTGF5ZXJMaXN0ID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJMaXN0Jyk7XHJcbnZhciBLZXlQYXRoTGlzdCA9IHJlcXVpcmUoJy4uL2tleV9wYXRoL0tleVBhdGhMaXN0Jyk7XHJcblxyXG5mdW5jdGlvbiBSZW5kZXJlcihzdGF0ZSkge1xyXG5cclxuXHRzdGF0ZS5fdHlwZSA9ICdyZW5kZXJlcic7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFJlbmRlcmVyVHlwZSgpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5hbmltYXRpb24uYW5pbVR5cGU7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7XHJcblx0XHRnZXRSZW5kZXJlclR5cGU6IGdldFJlbmRlcmVyVHlwZVxyXG5cdH0sIExheWVyTGlzdChzdGF0ZS5lbGVtZW50cyksIEtleVBhdGhMaXN0KHN0YXRlLmVsZW1lbnRzLCAncmVuZGVyZXInKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyZXI7Il19
