(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lottie_api = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../helpers/layerAPIBuilder":6,"../renderer/Renderer":40}],2:[function(require,module,exports){
module.exports = ',';
},{}],3:[function(require,module,exports){
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
}
},{}],4:[function(require,module,exports){
module.exports = {
	LAYER_TRANSFORM: 'transform'
}
},{}],5:[function(require,module,exports){
var key_path_separator = require('../enums/key_path_separator');
var sanitizeString = require('./stringSanitizer');

module.exports = function(propertyPath) {
	var keyPathSplit = propertyPath.split(key_path_separator);
	var selector = keyPathSplit.shift();
	return {
		selector: sanitizeString(selector),
		propertyPath: keyPathSplit.join(key_path_separator)
	}
}
},{"../enums/key_path_separator":2,"./stringSanitizer":7}],6:[function(require,module,exports){
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
	switch(layerType) {
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
}
},{"../layer/LayerBase":13,"../layer/camera/Camera":15,"../layer/composition/Composition":16,"../layer/image/ImageElement":19,"../layer/null_element/NullElement":20,"../layer/shape/Shape":21,"../layer/solid/SolidElement":34,"../layer/text/TextElement":37}],7:[function(require,module,exports){
function sanitizeString(string) {
	return string.trim();
}

module.exports = sanitizeString
},{}],8:[function(require,module,exports){
var createTypedArray = require('./typedArrays')

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

var Matrix = (function(){

    var _cos = Math.cos;
    var _sin = Math.sin;
    var _tan = Math.tan;
    var _rnd = Math.round;

    function reset(){
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
        if(angle === 0){
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, -mSin,  0, 0, mSin,  mCos, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1);
    }

    function rotateX(angle){
        if(angle === 0){
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin,  mCos, 0, 0, 0, 0, 1);
    }

    function rotateY(angle){
        if(angle === 0){
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos,  0,  mSin, 0, 0, 1, 0, 0, -mSin,  0,  mCos, 0, 0, 0, 0, 1);
    }

    function rotateZ(angle){
        if(angle === 0){
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, -mSin,  0, 0, mSin,  mCos, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1);
    }

    function shear(sx,sy){
        return this._t(1, sy, sx, 1, 0, 0);
    }

    function skew(ax, ay){
        return this.shear(_tan(ax), _tan(ay));
    }

    function skewFromAxis(ax, angle){
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, mSin,  0, 0, -mSin,  mCos, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1)
            ._t(1, 0,  0, 0, _tan(ax),  1, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1)
            ._t(mCos, -mSin,  0, 0, mSin,  mCos, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1);
        //return this._t(mCos, mSin, -mSin, mCos, 0, 0)._t(1, 0, _tan(ax), 1, 0, 0)._t(mCos, -mSin, mSin, mCos, 0, 0);
    }

    function scale(sx, sy, sz) {
        sz = isNaN(sz) ? 1 : sz;
        if(sx == 1 && sy == 1 && sz == 1){
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
        if(tx !== 0 || ty !== 0 || tz !== 0){
            return this._t(1,0,0,0,0,1,0,0,0,0,1,0,tx,ty,tz,1);
        }
        return this;
    }

    function transform(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2) {

        var _p = this.props;

        if(a2 === 1 && b2 === 0 && c2 === 0 && d2 === 0 && e2 === 0 && f2 === 1 && g2 === 0 && h2 === 0 && i2 === 0 && j2 === 0 && k2 === 1 && l2 === 0){
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
        _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2 ;
        _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2 ;
        _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2 ;

        _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2 ;
        _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2 ;
        _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2 ;
        _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2 ;

        _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2 ;
        _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2 ;
        _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2 ;
        _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2 ;

        _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2 ;
        _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2 ;
        _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2 ;
        _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2 ;

        this._identityCalculated = false;
        return this;
    }

    function isIdentity() {
        if(!this._identityCalculated){
            this._identity = !(this.props[0] !== 1 || this.props[1] !== 0 || this.props[2] !== 0 || this.props[3] !== 0 || this.props[4] !== 0 || this.props[5] !== 1 || this.props[6] !== 0 || this.props[7] !== 0 || this.props[8] !== 0 || this.props[9] !== 0 || this.props[10] !== 1 || this.props[11] !== 0 || this.props[12] !== 0 || this.props[13] !== 0 || this.props[14] !== 0 || this.props[15] !== 1);
            this._identityCalculated = true;
        }
        return this._identity;
    }

    function equals(matr){
        var i = 0;
        while (i < 16) {
            if(matr.props[i] !== this.props[i]) {
                return false;
            }
            i+=1;
        }
        return true;
    }

    function clone(matr){
        var i;
        for(i=0;i<16;i+=1){
            matr.props[i] = this.props[i];
        }
    }

    function cloneFromProps(props){
        var i;
        for(i=0;i<16;i+=1){
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
        var a = this.props[5]/determinant;
        var b = - this.props[1]/determinant;
        var c = - this.props[4]/determinant;
        var d = this.props[0]/determinant;
        var e = (this.props[4] * this.props[13] - this.props[5] * this.props[12])/determinant;
        var f = - (this.props[0] * this.props[13] - this.props[1] * this.props[12])/determinant;
        return [pt[0] * a + pt[1] * c + e, pt[0] * b + pt[1] * d + f, 0];
    }

    function inversePoints(pts){
        var i, len = pts.length, retPts = [];
        for(i=0;i<len;i+=1){
            retPts[i] = inversePoint(pts[i]);
        }
        return retPts;
    }

    function applyToTriplePoints(pt1, pt2, pt3) {
        var arr = createTypedArray('float32', 6);
        if(this.isIdentity()) {
            arr[0] = pt1[0];
            arr[1] = pt1[1];
            arr[2] = pt2[0];
            arr[3] = pt2[1];
            arr[4] = pt3[0];
            arr[5] = pt3[1];
        } else {
            var p0 = this.props[0], p1 = this.props[1], p4 = this.props[4], p5 = this.props[5], p12 = this.props[12], p13 = this.props[13];
            arr[0] = pt1[0] * p0 + pt1[1] * p4 + p12;
            arr[1] = pt1[0] * p1 + pt1[1] * p5 + p13;
            arr[2] = pt2[0] * p0 + pt2[1] * p4 + p12;
            arr[3] = pt2[0] * p1 + pt2[1] * p5 + p13;
            arr[4] = pt3[0] * p0 + pt3[1] * p4 + p12;
            arr[5] = pt3[0] * p1 + pt3[1] * p5 + p13;
        }
        return arr;
    }

    function applyToPointArray(x,y,z){
        var arr;
        if(this.isIdentity()) {
            arr = [x,y,z];
        } else {
            arr = [x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12],x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13],x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]];
        }
        return arr;
    }

    function applyToPointStringified(x, y) {
        if(this.isIdentity()) {
            return x + ',' + y;
        }
        return (x * this.props[0] + y * this.props[4] + this.props[12])+','+(x * this.props[1] + y * this.props[5] + this.props[13]);
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
        while(i<16){
            cssValue += _rnd(props[i]*v)/v;
            cssValue += i === 15 ? ')':',';
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
        return "matrix(" + _rnd(props[0]*v)/v + ',' + _rnd(props[1]*v)/v + ',' + _rnd(props[4]*v)/v + ',' + _rnd(props[5]*v)/v + ',' + _rnd(props[12]*v)/v + ',' + _rnd(props[13]*v)/v + ")";
    }

    function MatrixInstance(){
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

    return function() {
        return new MatrixInstance()
    }
}());

module.exports = Matrix;
},{"./typedArrays":9}],9:[function(require,module,exports){
var createTypedArray = (function(){
	function createRegularArray(type, len){
		var i = 0, arr = [], value;
		switch(type) {
			case 'int16':
			case 'uint8c':
				value = 1;
				break;
			default:
				value = 1.1;
				break;
		}
		for(i = 0; i < len; i += 1) {
			arr.push(value);
		}
		return arr;
	}
	function createTypedArray(type, len){
		if(type === 'float32') {
			return new Float32Array(len);
		} else if(type === 'int16') {
			return new Int16Array(len);
		} else if(type === 'uint8c') {
			return new Uint8ClampedArray(len);
		}
	}
	if(typeof Uint8ClampedArray === 'function' && typeof Float32Array === 'function') {
		return createTypedArray;
	} else {
		return createRegularArray;
	}
}());

module.exports = createTypedArray;

},{}],10:[function(require,module,exports){
var AnimationItem = require('./animation/AnimationItem');

function createAnimationApi(anim) {
	return Object.assign({}, AnimationItem(anim));
}

module.exports = {
	createAnimationApi : createAnimationApi
}
},{"./animation/AnimationItem":1}],11:[function(require,module,exports){
var keyPathBuilder = require('../helpers/keyPathBuilder');
var layer_types = require('../enums/layer_types');

function KeyPathList(elements, node_type) {

	function _getLength() {
		return elements.length;
	}

	function _filterLayerByType(elements, type) {
		return elements.filter(function(element) {
			return element.getTargetLayer().data.ty === layer_types[type];
		});
	}

	function _filterLayerByName(elements, name) {
		return elements.filter(function(element) {
			return element.getTargetLayer().data.nm === name;
		});
	}

	function _filterLayerByProperty(elements, name) {
		return elements.filter(function(element) {
			if(element.hasProperty(name)) {
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
		return KeyPathList(elements.filter(function(element) {
			return element.hasProperty(selector);
		}).map(function(element) {
			return element.getProperty(selector);
		}), 'property');
	}

	function getLayerProperty(selector) {
		var layers = _filterLayerByProperty(elements, selector);
		var properties = layers.map(function(element){
			return element.getProperty(selector);
		})
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
		} else if(node_type === 'property') {
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
	}

	Object.defineProperty(methods, 'length', {
		get: _getLength
	});

	return methods;
}

module.exports = KeyPathList;
},{"../enums/layer_types":3,"../helpers/keyPathBuilder":5}],12:[function(require,module,exports){
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

	return Object.assign(state, methods);
}

module.exports = KeyPathNode;
},{"../enums/key_path_separator":2,"../enums/property_names":4}],13:[function(require,module,exports){
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
		},{
			name: 'Transform',
			value: transform
		},{
			name: 'Effects',
			value: effects
		},{
			name: 'effects',
			value: effects
		})
	}

    function getElementToPoint(point) {
    }

	function toKeypathLayerPoint(point) {
		var element = state.element;
    	if(state.parent.toKeypathLayerPoint) {
        	point = state.parent.toKeypathLayerPoint(point);
        }
    	var toWorldMat = Matrix();
        var transformMat = state.getProperty('Transform').getTargetTransform();
        transformMat.applyToMatrix(toWorldMat);
        if(element.hierarchy && element.hierarchy.length){
            var i, len = element.hierarchy.length;
            for(i=0;i<len;i+=1){
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
        if(element.hierarchy && element.hierarchy.length){
            var i, len = element.hierarchy.length;
            for(i=0;i<len;i+=1){
                element.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
            }
        }
        point = toWorldMat.applyToPointArray(point[0],point[1],point[2]||0);
        if(state.parent.fromKeypathLayerPoint) {
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
	}

	_buildPropertyMap();

	return Object.assign(state, KeyPathNode(state), methods);
}

module.exports = LayerBase;
},{"../helpers/transformationMatrix":8,"../key_path/KeyPathNode":12,"./effects/Effects":18,"./transform/Transform":38}],14:[function(require,module,exports){
var layer_types = require('../enums/layer_types');
var layer_api = require('../helpers/layerAPIBuilder');

function LayerList(elements) {

	function _getLength() {
		return elements.length;
	}

	function _filterLayerByType(elements, type) {
		return elements.filter(function(element) {
			return element.data.ty === layer_types[type];
		});
	}

	function _filterLayerByName(elements, name) {
		return elements.filter(function(element) {
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
		iteratableMethods.reduce(function(accumulator, value){
			var _value = value;
			accumulator[value] = function() {
				var _arguments = arguments;
				return elements.map(function(element){
					var layer = layer_api(element);
					if(layer[_value]) {
						return layer[_value].apply(null, _arguments);
					}
					return null;
				});
			}
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
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Camera(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Point of Interest',
				value: Property(element.a, parent)
			},
			{
				name: 'Zoom',
				value: Property(element.pe, parent)
			},
			{
				name: 'Position',
				value: Property(element.p, parent)
			},
			{
				name: 'X Rotation',
				value: Property(element.rx, parent)
			},
			{
				name: 'Y Rotation',
				value: Property(element.ry, parent)
			},
			{
				name: 'Z Rotation',
				value: Property(element.rz, parent)
			}
		]
	}

	function getTargetLayer() {
		return state.element;
	}

	var methods = {
		getTargetLayer: getTargetLayer
	}

	return Object.assign(instance, KeyPathNode(state), methods);
}

module.exports = Camera;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],16:[function(require,module,exports){
var KeyPathList = require('../../key_path/KeyPathList');
var LayerBase = require('../LayerBase');
var layer_api = require('../../helpers/layerAPIBuilder');
var Property = require('../../property/Property');

function Composition(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function setTimeRemap(value) {
		Property(element.tm).setValue(value);
	}

	function buildLayerApi(layer, index) {
		var _layerApi = null;
		var ob = {
			name: layer.nm
		}

		function getLayerApi() {
			if(!_layerApi) {
				_layerApi = layer_api(element.elements[index], state)
			}
			return _layerApi
		}

		Object.defineProperty(ob, 'value', {
			get : getLayerApi
		})
		return ob;
	}

	
	function _buildPropertyMap() {
		var compositionLayers = element.layers.map(buildLayerApi)
		return [
			{
				name: 'Time Remap',
				value: {
					setValue: setTimeRemap
				}
			}
		].concat(compositionLayers)
	}

	var methods = {
	}

	return Object.assign(instance, LayerBase(state), KeyPathList(state.elements, 'layer'), methods);
}

module.exports = Composition;
},{"../../helpers/layerAPIBuilder":6,"../../key_path/KeyPathList":11,"../../property/Property":39,"../LayerBase":13}],17:[function(require,module,exports){
var Property = require('../../property/Property');

function EffectElement(effect, parent) {

	return Property(effect.p, parent);
}

module.exports = EffectElement;
},{"../../property/Property":39}],18:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var EffectElement = require('./EffectElement');

function Effects(effects, parent) {

	var state = {
		parent: parent,
		properties: buildProperties()
	}

	function getValue(effectData, index) {
		var nm = effectData.data ? effectData.data.nm : index.toString();
		var effectElement = effectData.data ? Effects(effectData.effectElements, parent) : Property(effectData.p, parent);
		return {
			name: nm,
			value: effectElement
		}
	}

	function buildProperties() {
		var i, len = effects.length;
		var arr = [];
		for (i = 0; i < len; i += 1) {
			arr.push(getValue(effects[i], i));
		}
		return arr;
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Effects;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39,"./EffectElement":17}],19:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Image(element) {

	var methods = {
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = Image;
},{"../LayerBase":13}],20:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function NullElement(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
		]
	}

	var methods = {
	}

	return Object.assign(instance, LayerBase(state), methods);
}

module.exports = NullElement;
},{"../LayerBase":13}],21:[function(require,module,exports){
var LayerBase = require('../LayerBase');
var ShapeContents = require('./ShapeContents');

function Shape(element, parent) {

	var state = {
		properties: [],
		parent: parent,
		element: element
	}
	var shapeContents = ShapeContents(element.data.shapes, element.itemsData, state);

	

	function _buildPropertyMap() {
		state.properties.push(
			{
				name: 'Contents',
				value: shapeContents
			}
		)
	}

	var methods = {
	}

	_buildPropertyMap();

	return Object.assign(state, LayerBase(state), methods);
}

module.exports = Shape;
},{"../LayerBase":13,"./ShapeContents":22}],22:[function(require,module,exports){
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
	}

	var cachedShapeProperties = [];

	function buildShapeObject(shape, index) {
		var ob = {
			name: shape.nm
		}
		Object.defineProperty(ob, 'value', {
		   get() {
		   	if(cachedShapeProperties[index]) {
		   		return cachedShapeProperties[index];
		   	} else {
		   		var property;
		   	}
	   		if(shape.ty === 'gr') {
	   			property = ShapeContents(shapesData[index].it, shapes[index].it, state);
	   		} else if(shape.ty === 'rc') {
	   			property = ShapeRectangle(shapes[index], state);
	   		} else if(shape.ty === 'el') {
	   			property = ShapeEllipse(shapes[index], state);
	   		} else if(shape.ty === 'fl') {
	   			property = ShapeFill(shapes[index], state);
	   		} else if(shape.ty === 'st') {
	   			property = ShapeStroke(shapes[index], state);
	   		} else if(shape.ty === 'gf') {
	   			property = ShapeGradientFill(shapes[index], state);
	   		} else if(shape.ty === 'gs') {
	   			property = ShapeGradientStroke(shapes[index], state);
	   		} else if(shape.ty === 'tm') {
	   			property = ShapeTrimPaths(shapes[index], state);
	   		} else if(shape.ty === 'rp') {
	   			property = ShapeRepeater(shapes[index], state);
	   		} else if(shape.ty === 'sr') {
	   			property = ShapePolystar(shapes[index], state);
	   		} else if(shape.ty === 'rd') {
	   			property = ShapeRoundCorners(shapes[index], state);
	   		} else if(shape.ty === 'sh') {
	   			property = ShapePath(shapes[index], state);
	   		} else if(shape.ty === 'tr') {
	   			property = Transform(shapes[index].transform.mProps, state);
	   		} else {
	   			console.log(shape.ty);
	   		}
	   		cachedShapeProperties[index] = property;
	   		return property;
		   }
		});
		return ob
	}

	function _buildPropertyMap() {
		return shapesData.map(function(shape, index) {
			return buildShapeObject(shape, index)
		});
	}

	function fromKeypathLayerPoint(point) {
		if(state.hasProperty('Transform')) {
    		var toWorldMat = Matrix();
        	var transformMat = state.getProperty('Transform').getTargetTransform();
			transformMat.applyToMatrix(toWorldMat);
        	point = toWorldMat.applyToPointArray(point[0],point[1],point[2]||0);
		}
		return state.parent.fromKeypathLayerPoint(point);
	}

	function toKeypathLayerPoint(point) {
		point = state.parent.toKeypathLayerPoint(point);
		if(state.hasProperty('Transform')) {
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
	}

	//state.properties = _buildPropertyMap();

	return Object.assign(state, KeyPathNode(state), methods)
}

module.exports = ShapeContents;
},{"../../helpers/transformationMatrix":8,"../../key_path/KeyPathNode":12,"../../property/Property":39,"../transform/Transform":38,"./ShapeEllipse":23,"./ShapeFill":24,"./ShapeGradientFill":25,"./ShapeGradientStroke":26,"./ShapePath":27,"./ShapePolystar":28,"./ShapeRectangle":29,"./ShapeRepeater":30,"./ShapeRoundCorners":31,"./ShapeStroke":32,"./ShapeTrimPaths":33}],23:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeEllipse(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: Property(element.sh.s, parent)
			},
			{
				name: 'Position',
				value: Property(element.sh.p, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeEllipse;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],24:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeFill(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Color',
				value: Property(element.c, parent)
			},
			{
				name: 'Opacity',
				value: {
					setValue: Property(element.o, parent)
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeFill;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],25:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientFill(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: Property(element.s, parent)
			},
			{
				name: 'End Point',
				value: Property(element.s, parent)
			},
			{
				name: 'Opacity',
				value: Property(element.o, parent)
			},
			{
				name: 'Highlight Length',
				value: Property(element.h, parent)
			},
			{
				name: 'Highlight Angle',
				value: Property(element.a, parent)
			},
			{
				name: 'Colors',
				value: Property(element.g.prop, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientFill;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],26:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientStroke(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: Property(element.s, parent)
			},
			{
				name: 'End Point',
				value: Property(element.e, parent)
			},
			{
				name: 'Opacity',
				value: Property(element.o, parent)
			},
			{
				name: 'Highlight Length',
				value: Property(element.h, parent)
			},
			{
				name: 'Highlight Angle',
				value: Property(element.a, parent)
			},
			{
				name: 'Colors',
				value: Property(element.g.prop, parent)
			},
			{
				name: 'Stroke Width',
				value: Property(element.w, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientStroke;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],27:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePath(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function setPath(value) {
		Property(element.sh).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'path',
				value:Property(element.sh, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePath;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],28:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePolystar(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Points',
				value: Property(element.sh.pt, parent)
			},
			{
				name: 'Position',
				value: Property(element.sh.p, parent)
			},
			{
				name: 'Rotation',
				value: Property(element.sh.r, parent)
			},
			{
				name: 'Inner Radius',
				value: Property(element.sh.ir, parent)
			},
			{
				name: 'Outer Radius',
				value: Property(element.sh.or, parent)
			},
			{
				name: 'Inner Roundness',
				value: Property(element.sh.is, parent)
			},
			{
				name: 'Outer Roundness',
				value: Property(element.sh.os, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePolystar;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],29:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRectangle(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: Property(element.sh.s, parent)
			},
			{
				name: 'Position',
				value: Property(element.sh.p, parent)
			},
			{
				name: 'Roundness',
				value: Property(element.sh.r, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRectangle;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],30:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var Transform = require('../transform/Transform');

function ShapeRepeater(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Copies',
				value: Property(element.c, parent)
			},
			{
				name: 'Offset',
				value: Property(element.o, parent)
			},
			{
				name: 'Transform',
				value: Transform(element.tr, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRepeater;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39,"../transform/Transform":38}],31:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRoundCorners(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Radius',
				value: Property(element.rd, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRoundCorners;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],32:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeStroke(element, parent) {
	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'color',
				value: Property(element.c, parent)
			},
			{
				name: 'stroke width',
				value: Property(element.w, parent)
			},
			{
				name: 'opacity',
				value: Property(element.o, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeStroke
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],33:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeTrimPaths(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start',
				value: Property(element.s, parent)
			},
			{
				name: 'End',
				value: Property(element.e, parent)
			},
			{
				name: 'Offset',
				value: Property(element.o, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeTrimPaths;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],34:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Solid(element, parent) {

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
		]
	}

	var methods = {
	}

	return Object.assign({}, LayerBase(state), methods);
}

module.exports = Solid;
},{"../LayerBase":13}],35:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var TextAnimator = require('./TextAnimator');

function Text(element, parent) {

	var instance = {}

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function setDocumentData(_function) {
		var previousValue;
		setInterval(function() {
			var newValue = _function(element.textProperty.currentData);
			if (previousValue !== newValue) {
				element.updateDocumentData(newValue)
			}
		}, 500)
		console.log(element)
	}

	function addAnimators() {
		var animatorProperties = [];
		var animators = element.textAnimator._animatorsData;
		var i, len = animators.length;
		var textAnimator;
		for (i = 0; i < len; i += 1) {
			textAnimator = TextAnimator(animators[i])
			animatorProperties.push({
				name: element.textAnimator._textData.a[i].nm || 'Animator ' + (i+1), //Fallback for old animations
				value: textAnimator
			})
		}
		return animatorProperties;
	}

	function _buildPropertyMap() {
		return [
			{
				name:'Source',
				value: {
					setValue: setDocumentData
				}
			}
		].concat(addAnimators())
	}

	var methods = {
	}

	return Object.assign(instance, methods, KeyPathNode(state));

}

module.exports = Text;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39,"./TextAnimator":36}],36:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],37:[function(require,module,exports){
var LayerBase = require('../LayerBase');
var Text = require('./Text');

function TextElement(element) {

	var instance = {};

	var TextProperty = Text(element);
	var state = {
		element: element,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'text',
				value: TextProperty
			},
			{
				name: 'Text',
				value: TextProperty
			}
		]
	}

	function getText() {
		return element.textProperty.currentData.t;
	}

	function setText(value, index) {
		setDocumentData({t: value}, index);
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
	}

	return Object.assign(instance, LayerBase(state), methods);

}

module.exports = TextElement;
},{"../LayerBase":13,"./Text":35}],38:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Transform(props, parent) {
	var state = {
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Anchor Point',
				value: Property(props.a, parent)
			},
			{
				name: 'Point of Interest',
				value: Property(props.a, parent)
			},
			{
				name: 'Position',
				value: Property(props.p, parent)
			},
			{
				name: 'Scale',
				value: Property(props.s, parent)
			},
			{
				name: 'Rotation',
				value: Property(props.r, parent)
			},
			{
				name: 'X Position',
				value: Property(props.px, parent)
			},
			{
				name: 'Y Position',
				value: Property(props.py, parent)
			},
			{
				name: 'Z Position',
				value: Property(props.pz, parent)
			},
			{
				name: 'X Rotation',
				value: Property(props.rx, parent)
			},
			{
				name: 'Y Rotation',
				value: Property(props.ry, parent)
			},
			{
				name: 'Z Rotation',
				value: Property(props.rz, parent)
			},
			{
				name: 'Opacity',
				value: Property(props.po, parent)
			}
		]
	}

	function getTargetTransform() {
		return props;
	}

	var methods = {
		getTargetTransform: getTargetTransform
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Transform;
},{"../../key_path/KeyPathNode":12,"../../property/Property":39}],39:[function(require,module,exports){
var KeyPathNode = require('../key_path/KeyPathNode');

function Property(property, parent) {
	var state = {
		property: property,
		parent: parent
	}
	
	function setValue(value) {
		var property = state.property;
		if(!property || !property.addEffect) {
			return;
		}
		if (typeof value === 'function') {
			property.addEffect(value);
		} else if (property.propType === 'multidimensional' && typeof value === 'object' && value.length === 2) {
			property.addEffect(function(){return value});
		} else if (property.propType === 'unidimensional' && typeof value === 'number') {
			property.addEffect(function(){return value});
		}
	}

	function getValue() {
		return property.v;
	}

	var methods = {
		setValue: setValue,
		getValue: getValue
	}

	return Object.assign(state, methods, KeyPathNode(state));
}

module.exports = Property;
},{"../key_path/KeyPathNode":12}],40:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0uanMiLCJzcmMvZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yLmpzIiwic3JjL2VudW1zL2xheWVyX3R5cGVzLmpzIiwic3JjL2VudW1zL3Byb3BlcnR5X25hbWVzLmpzIiwic3JjL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9sYXllckFQSUJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9zdHJpbmdTYW5pdGl6ZXIuanMiLCJzcmMvaGVscGVycy90cmFuc2Zvcm1hdGlvbk1hdHJpeC5qcyIsInNyYy9oZWxwZXJzL3R5cGVkQXJyYXlzLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhMaXN0LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhOb2RlLmpzIiwic3JjL2xheWVyL0xheWVyQmFzZS5qcyIsInNyYy9sYXllci9MYXllckxpc3QuanMiLCJzcmMvbGF5ZXIvY2FtZXJhL0NhbWVyYS5qcyIsInNyYy9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbi5qcyIsInNyYy9sYXllci9lZmZlY3RzL0VmZmVjdEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvZWZmZWN0cy9FZmZlY3RzLmpzIiwic3JjL2xheWVyL2ltYWdlL0ltYWdlRWxlbWVudC5qcyIsInNyYy9sYXllci9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGUuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVDb250ZW50cy5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUVsbGlwc2UuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVGaWxsLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlR3JhZGllbnRGaWxsLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlR3JhZGllbnRTdHJva2UuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVQYXRoLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUG9seXN0YXIuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVSZWN0YW5nbGUuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVSZXBlYXRlci5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVJvdW5kQ29ybmVycy5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVN0cm9rZS5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVRyaW1QYXRocy5qcyIsInNyYy9sYXllci9zb2xpZC9Tb2xpZEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvdGV4dC9UZXh0LmpzIiwic3JjL2xheWVyL3RleHQvVGV4dEFuaW1hdG9yLmpzIiwic3JjL2xheWVyL3RleHQvVGV4dEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvdHJhbnNmb3JtL1RyYW5zZm9ybS5qcyIsInNyYy9wcm9wZXJ0eS9Qcm9wZXJ0eS5qcyIsInNyYy9yZW5kZXJlci9SZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL1JlbmRlcmVyJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG5cclxuZnVuY3Rpb24gQW5pbWF0aW9uSXRlbUZhY3RvcnkoYW5pbWF0aW9uKSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uLFxyXG5cdFx0ZWxlbWVudHM6IGFuaW1hdGlvbi5yZW5kZXJlci5lbGVtZW50cy5tYXAoKGl0ZW0pID0+IGxheWVyX2FwaShpdGVtLCBhbmltYXRpb24pKSxcclxuXHRcdGJvdW5kaW5nUmVjdDogbnVsbCxcclxuXHRcdHNjYWxlRGF0YTogbnVsbFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0Q3VycmVudEZyYW1lKCkge1xyXG5cdFx0cmV0dXJuIGFuaW1hdGlvbi5jdXJyZW50RnJhbWU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRDdXJyZW50VGltZSgpIHtcclxuXHRcdHJldHVybiBhbmltYXRpb24uY3VycmVudEZyYW1lIC8gYW5pbWF0aW9uLmZyYW1lUmF0ZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZFZhbHVlQ2FsbGJhY2socHJvcGVydGllcywgdmFsdWUpIHtcclxuXHRcdHZhciBpLCBsZW4gPSBwcm9wZXJ0aWVzLmxlbmd0aDtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xyXG5cdFx0XHRwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB0b0tleXBhdGhMYXllclBvaW50KHByb3BlcnRpZXMsIHBvaW50KSB7XHJcblx0XHR2YXIgaSwgbGVuID0gcHJvcGVydGllcy5sZW5ndGg7XHJcblx0XHR2YXIgcG9pbnRzID0gW107XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0cG9pbnRzLnB1c2gocHJvcGVydGllcy5nZXRQcm9wZXJ0eUF0SW5kZXgoaSkudG9LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkpO1xyXG5cdFx0fVxyXG5cdFx0aWYocG9pbnRzLmxlbmd0aCA9PT0gMSkge1xyXG5cdFx0XHRyZXR1cm4gcG9pbnRzWzBdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBvaW50cztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZyb21LZXlwYXRoTGF5ZXJQb2ludChwcm9wZXJ0aWVzLCBwb2ludCkge1xyXG5cdFx0dmFyIGksIGxlbiA9IHByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0dmFyIHBvaW50cyA9IFtdO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdHBvaW50cy5wdXNoKHByb3BlcnRpZXMuZ2V0UHJvcGVydHlBdEluZGV4KGkpLmZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkpO1xyXG5cdFx0fVxyXG5cdFx0aWYocG9pbnRzLmxlbmd0aCA9PT0gMSkge1xyXG5cdFx0XHRyZXR1cm4gcG9pbnRzWzBdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBvaW50cztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlRGF0YShib3VuZGluZ1JlY3QpIHtcclxuXHRcdHZhciBjb21wV2lkdGggPSBhbmltYXRpb24uYW5pbWF0aW9uRGF0YS53O1xyXG4gICAgICAgIHZhciBjb21wSGVpZ2h0ID0gYW5pbWF0aW9uLmFuaW1hdGlvbkRhdGEuaDtcclxuXHRcdHZhciBjb21wUmVsID0gY29tcFdpZHRoIC8gY29tcEhlaWdodDtcclxuICAgICAgICB2YXIgZWxlbWVudFdpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xyXG4gICAgICAgIHZhciBlbGVtZW50SGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcclxuICAgICAgICB2YXIgZWxlbWVudFJlbCA9IGVsZW1lbnRXaWR0aCAvIGVsZW1lbnRIZWlnaHQ7XHJcbiAgICAgICAgdmFyIHNjYWxlLHNjYWxlWE9mZnNldCxzY2FsZVlPZmZzZXQ7XHJcbiAgICAgICAgdmFyIHhBbGlnbm1lbnQsIHlBbGlnbm1lbnQsIHNjYWxlTW9kZTtcclxuICAgICAgICB2YXIgYXNwZWN0UmF0aW8gPSBhbmltYXRpb24ucmVuZGVyZXIucmVuZGVyQ29uZmlnLnByZXNlcnZlQXNwZWN0UmF0aW8uc3BsaXQoJyAnKTtcclxuICAgICAgICBpZihhc3BlY3RSYXRpb1sxXSA9PT0gJ21lZXQnKSB7XHJcbiAgICAgICAgXHRzY2FsZSA9IGVsZW1lbnRSZWwgPiBjb21wUmVsID8gZWxlbWVudEhlaWdodCAvIGNvbXBIZWlnaHQgOiBlbGVtZW50V2lkdGggLyBjb21wV2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICBcdHNjYWxlID0gZWxlbWVudFJlbCA+IGNvbXBSZWwgPyBlbGVtZW50V2lkdGggLyBjb21wV2lkdGggOiBlbGVtZW50SGVpZ2h0IC8gY29tcEhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgeEFsaWdubWVudCA9IGFzcGVjdFJhdGlvWzBdLnN1YnN0cigwLDQpO1xyXG4gICAgICAgIHlBbGlnbm1lbnQgPSBhc3BlY3RSYXRpb1swXS5zdWJzdHIoNCk7XHJcbiAgICAgICAgaWYoeEFsaWdubWVudCA9PT0gJ3hNaW4nKSB7XHJcbiAgICAgICAgXHRzY2FsZVhPZmZzZXQgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZih4QWxpZ25tZW50ID09PSAneE1pZCcpIHtcclxuICAgICAgICBcdHNjYWxlWE9mZnNldCA9IChlbGVtZW50V2lkdGggLSBjb21wV2lkdGggKiBzY2FsZSkgLyAyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgXHRzY2FsZVhPZmZzZXQgPSAoZWxlbWVudFdpZHRoIC0gY29tcFdpZHRoICogc2NhbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoeUFsaWdubWVudCA9PT0gJ1lNaW4nKSB7XHJcblx0ICAgICAgICBzY2FsZVlPZmZzZXQgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZih5QWxpZ25tZW50ID09PSAnWU1pZCcpIHtcclxuXHQgICAgICAgIHNjYWxlWU9mZnNldCA9IChlbGVtZW50SGVpZ2h0IC0gY29tcEhlaWdodCAqIHNjYWxlKSAvIDI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHQgICAgICAgIHNjYWxlWU9mZnNldCA9IChlbGVtZW50SGVpZ2h0IC0gY29tcEhlaWdodCAqIHNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICBcdHNjYWxlWU9mZnNldDogc2NhbGVZT2Zmc2V0LFxyXG4gICAgICAgIFx0c2NhbGVYT2Zmc2V0OiBzY2FsZVhPZmZzZXQsXHJcbiAgICAgICAgXHRzY2FsZTogc2NhbGVcclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByZWNhbGN1bGF0ZVNpemUoY29udGFpbmVyKSB7XHJcblx0XHR2YXIgY29udGFpbmVyID0gYW5pbWF0aW9uLndyYXBwZXI7XHJcblx0XHRzdGF0ZS5ib3VuZGluZ1JlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRzdGF0ZS5zY2FsZURhdGEgPSBjYWxjdWxhdGVTY2FsZURhdGEoc3RhdGUuYm91bmRpbmdSZWN0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHRvQ29udGFpbmVyUG9pbnQocG9pbnQpIHtcclxuXHRcdGlmKCFhbmltYXRpb24ud3JhcHBlciB8fCAhYW5pbWF0aW9uLndyYXBwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XHJcblx0XHRcdHJldHVybiBwb2ludDtcclxuXHRcdH1cclxuXHRcdGlmKCFzdGF0ZS5ib3VuZGluZ1JlY3QpIHtcclxuXHRcdFx0cmVjYWxjdWxhdGVTaXplKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGJvdW5kaW5nUmVjdCA9IHN0YXRlLmJvdW5kaW5nUmVjdDtcclxuXHRcdHZhciBuZXdQb2ludCA9IFtwb2ludFswXSAtIGJvdW5kaW5nUmVjdC5sZWZ0LCBwb2ludFsxXSAtIGJvdW5kaW5nUmVjdC50b3BdO1xyXG5cdFx0dmFyIHNjYWxlRGF0YSA9IHN0YXRlLnNjYWxlRGF0YTtcclxuXHJcbiAgICAgICAgbmV3UG9pbnRbMF0gPSAobmV3UG9pbnRbMF0gLSBzY2FsZURhdGEuc2NhbGVYT2Zmc2V0KSAvIHNjYWxlRGF0YS5zY2FsZTtcclxuICAgICAgICBuZXdQb2ludFsxXSA9IChuZXdQb2ludFsxXSAtIHNjYWxlRGF0YS5zY2FsZVlPZmZzZXQpIC8gc2NhbGVEYXRhLnNjYWxlO1xyXG5cclxuXHRcdHJldHVybiBuZXdQb2ludDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZyb21Db250YWluZXJQb2ludChwb2ludCkge1xyXG5cdFx0aWYoIWFuaW1hdGlvbi53cmFwcGVyIHx8ICFhbmltYXRpb24ud3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcclxuXHRcdFx0cmV0dXJuIHBvaW50O1xyXG5cdFx0fVxyXG5cdFx0aWYoIXN0YXRlLmJvdW5kaW5nUmVjdCkge1xyXG5cdFx0XHRyZWNhbGN1bGF0ZVNpemUoKTtcclxuXHRcdH1cclxuXHRcdHZhciBib3VuZGluZ1JlY3QgPSBzdGF0ZS5ib3VuZGluZ1JlY3Q7XHJcblx0XHR2YXIgc2NhbGVEYXRhID0gc3RhdGUuc2NhbGVEYXRhO1xyXG5cclxuXHRcdHZhciBuZXdQb2ludCA9IFtwb2ludFswXSAqIHNjYWxlRGF0YS5zY2FsZSArIHNjYWxlRGF0YS5zY2FsZVhPZmZzZXQsIHBvaW50WzFdICogc2NhbGVEYXRhLnNjYWxlICsgc2NhbGVEYXRhLnNjYWxlWU9mZnNldF07XHJcblxyXG5cdFx0dmFyIG5ld1BvaW50ID0gW25ld1BvaW50WzBdICsgYm91bmRpbmdSZWN0LmxlZnQsIG5ld1BvaW50WzFdICsgYm91bmRpbmdSZWN0LnRvcF07XHJcblx0XHRyZXR1cm4gbmV3UG9pbnQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRTY2FsZURhdGEoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuc2NhbGVEYXRhO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRyZWNhbGN1bGF0ZVNpemU6IHJlY2FsY3VsYXRlU2l6ZSxcclxuXHRcdGdldFNjYWxlRGF0YTogZ2V0U2NhbGVEYXRhLFxyXG5cdFx0dG9Db250YWluZXJQb2ludDogdG9Db250YWluZXJQb2ludCxcclxuXHRcdGZyb21Db250YWluZXJQb2ludDogZnJvbUNvbnRhaW5lclBvaW50LFxyXG5cdFx0Z2V0Q3VycmVudEZyYW1lOiBnZXRDdXJyZW50RnJhbWUsXHJcblx0XHRnZXRDdXJyZW50VGltZTogZ2V0Q3VycmVudFRpbWUsXHJcblx0XHRhZGRWYWx1ZUNhbGxiYWNrOiBhZGRWYWx1ZUNhbGxiYWNrLFxyXG5cdFx0dG9LZXlwYXRoTGF5ZXJQb2ludDogdG9LZXlwYXRoTGF5ZXJQb2ludCxcclxuXHRcdGZyb21LZXlwYXRoTGF5ZXJQb2ludDogZnJvbUtleXBhdGhMYXllclBvaW50XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgUmVuZGVyZXIoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb25JdGVtRmFjdG9yeTsiLCJtb2R1bGUuZXhwb3J0cyA9ICcsJzsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHQgMDogMCxcclxuXHQgMTogMSxcclxuXHQgMjogMixcclxuXHQgMzogMyxcclxuXHQgNDogNCxcclxuXHQgNTogNSxcclxuXHQgMTM6IDEzLFxyXG5cdCdjb21wJzogMCxcclxuXHQnY29tcG9zaXRpb24nOiAwLFxyXG5cdCdzb2xpZCc6IDEsXHJcblx0J2ltYWdlJzogMixcclxuXHQnbnVsbCc6IDMsXHJcblx0J3NoYXBlJzogNCxcclxuXHQndGV4dCc6IDUsXHJcblx0J2NhbWVyYSc6IDEzXHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRMQVlFUl9UUkFOU0ZPUk06ICd0cmFuc2Zvcm0nXHJcbn0iLCJ2YXIga2V5X3BhdGhfc2VwYXJhdG9yID0gcmVxdWlyZSgnLi4vZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yJyk7XHJcbnZhciBzYW5pdGl6ZVN0cmluZyA9IHJlcXVpcmUoJy4vc3RyaW5nU2FuaXRpemVyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHByb3BlcnR5UGF0aCkge1xyXG5cdHZhciBrZXlQYXRoU3BsaXQgPSBwcm9wZXJ0eVBhdGguc3BsaXQoa2V5X3BhdGhfc2VwYXJhdG9yKTtcclxuXHR2YXIgc2VsZWN0b3IgPSBrZXlQYXRoU3BsaXQuc2hpZnQoKTtcclxuXHRyZXR1cm4ge1xyXG5cdFx0c2VsZWN0b3I6IHNhbml0aXplU3RyaW5nKHNlbGVjdG9yKSxcclxuXHRcdHByb3BlcnR5UGF0aDoga2V5UGF0aFNwbGl0LmpvaW4oa2V5X3BhdGhfc2VwYXJhdG9yKVxyXG5cdH1cclxufSIsInZhciBUZXh0RWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL3RleHQvVGV4dEVsZW1lbnQnKTtcclxudmFyIFNoYXBlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL3NoYXBlL1NoYXBlJyk7XHJcbnZhciBOdWxsRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL251bGxfZWxlbWVudC9OdWxsRWxlbWVudCcpO1xyXG52YXIgU29saWRFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvc29saWQvU29saWRFbGVtZW50Jyk7XHJcbnZhciBJbWFnZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9pbWFnZS9JbWFnZUVsZW1lbnQnKTtcclxudmFyIENhbWVyYUVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9jYW1lcmEvQ2FtZXJhJyk7XHJcbnZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9sYXllci9MYXllckJhc2UnKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldExheWVyQXBpKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cdHZhciBsYXllclR5cGUgPSBlbGVtZW50LmRhdGEudHk7XHJcblx0dmFyIENvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi4vbGF5ZXIvY29tcG9zaXRpb24vQ29tcG9zaXRpb24nKTtcclxuXHRzd2l0Y2gobGF5ZXJUeXBlKSB7XHJcblx0XHRjYXNlIDA6XHJcblx0XHRyZXR1cm4gQ29tcG9zaXRpb24oZWxlbWVudCwgcGFyZW50KTtcclxuXHRcdGNhc2UgMTpcclxuXHRcdHJldHVybiBTb2xpZEVsZW1lbnQoZWxlbWVudCwgcGFyZW50KTtcclxuXHRcdGNhc2UgMjpcclxuXHRcdHJldHVybiBJbWFnZUVsZW1lbnQoZWxlbWVudCwgcGFyZW50KTtcclxuXHRcdGNhc2UgMzpcclxuXHRcdHJldHVybiBOdWxsRWxlbWVudChlbGVtZW50LCBwYXJlbnQpO1xyXG5cdFx0Y2FzZSA0OlxyXG5cdFx0cmV0dXJuIFNoYXBlRWxlbWVudChlbGVtZW50LCBwYXJlbnQsIGVsZW1lbnQuZGF0YS5zaGFwZXMsIGVsZW1lbnQuaXRlbXNEYXRhKTtcclxuXHRcdGNhc2UgNTpcclxuXHRcdHJldHVybiBUZXh0RWxlbWVudChlbGVtZW50LCBwYXJlbnQpO1xyXG5cdFx0Y2FzZSAxMzpcclxuXHRcdHJldHVybiBDYW1lcmFFbGVtZW50KGVsZW1lbnQsIHBhcmVudCk7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0cmV0dXJuIExheWVyQmFzZShlbGVtZW50LCBwYXJlbnQpO1xyXG5cdH1cclxufSIsImZ1bmN0aW9uIHNhbml0aXplU3RyaW5nKHN0cmluZykge1xyXG5cdHJldHVybiBzdHJpbmcudHJpbSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhbml0aXplU3RyaW5nIiwidmFyIGNyZWF0ZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL3R5cGVkQXJyYXlzJylcclxuXHJcbi8qIVxyXG4gVHJhbnNmb3JtYXRpb24gTWF0cml4IHYyLjBcclxuIChjKSBFcGlzdGVtZXggMjAxNC0yMDE1XHJcbiB3d3cuZXBpc3RlbWV4LmNvbVxyXG4gQnkgS2VuIEZ5cnN0ZW5iZXJnXHJcbiBDb250cmlidXRpb25zIGJ5IGxlZW9uaXlhLlxyXG4gTGljZW5zZTogTUlULCBoZWFkZXIgcmVxdWlyZWQuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIDJEIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBvYmplY3QgaW5pdGlhbGl6ZWQgd2l0aCBpZGVudGl0eSBtYXRyaXguXHJcbiAqXHJcbiAqIFRoZSBtYXRyaXggY2FuIHN5bmNocm9uaXplIGEgY2FudmFzIGNvbnRleHQgYnkgc3VwcGx5aW5nIHRoZSBjb250ZXh0XHJcbiAqIGFzIGFuIGFyZ3VtZW50LCBvciBsYXRlciBhcHBseSBjdXJyZW50IGFic29sdXRlIHRyYW5zZm9ybSB0byBhblxyXG4gKiBleGlzdGluZyBjb250ZXh0LlxyXG4gKlxyXG4gKiBBbGwgdmFsdWVzIGFyZSBoYW5kbGVkIGFzIGZsb2F0aW5nIHBvaW50IHZhbHVlcy5cclxuICpcclxuICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IFtjb250ZXh0XSAtIE9wdGlvbmFsIGNvbnRleHQgdG8gc3luYyB3aXRoIE1hdHJpeFxyXG4gKiBAcHJvcCB7bnVtYmVyfSBhIC0gc2NhbGUgeFxyXG4gKiBAcHJvcCB7bnVtYmVyfSBiIC0gc2hlYXIgeVxyXG4gKiBAcHJvcCB7bnVtYmVyfSBjIC0gc2hlYXIgeFxyXG4gKiBAcHJvcCB7bnVtYmVyfSBkIC0gc2NhbGUgeVxyXG4gKiBAcHJvcCB7bnVtYmVyfSBlIC0gdHJhbnNsYXRlIHhcclxuICogQHByb3Age251bWJlcn0gZiAtIHRyYW5zbGF0ZSB5XHJcbiAqIEBwcm9wIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR8bnVsbH0gW2NvbnRleHQ9bnVsbF0gLSBzZXQgb3IgZ2V0IGN1cnJlbnQgY2FudmFzIGNvbnRleHRcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5cclxudmFyIE1hdHJpeCA9IChmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBfY29zID0gTWF0aC5jb3M7XHJcbiAgICB2YXIgX3NpbiA9IE1hdGguc2luO1xyXG4gICAgdmFyIF90YW4gPSBNYXRoLnRhbjtcclxuICAgIHZhciBfcm5kID0gTWF0aC5yb3VuZDtcclxuXHJcbiAgICBmdW5jdGlvbiByZXNldCgpe1xyXG4gICAgICAgIHRoaXMucHJvcHNbMF0gPSAxO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMV0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMl0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbM10gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbNF0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbNV0gPSAxO1xyXG4gICAgICAgIHRoaXMucHJvcHNbNl0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbN10gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbOF0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbOV0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTBdID0gMTtcclxuICAgICAgICB0aGlzLnByb3BzWzExXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMl0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTNdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzE0XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGF0ZShhbmdsZSkge1xyXG4gICAgICAgIGlmKGFuZ2xlID09PSAwKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBtQ29zID0gX2NvcyhhbmdsZSk7XHJcbiAgICAgICAgdmFyIG1TaW4gPSBfc2luKGFuZ2xlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdChtQ29zLCAtbVNpbiwgIDAsIDAsIG1TaW4sICBtQ29zLCAwLCAwLCAwLCAgMCwgIDEsIDAsIDAsIDAsIDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGF0ZVgoYW5nbGUpe1xyXG4gICAgICAgIGlmKGFuZ2xlID09PSAwKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBtQ29zID0gX2NvcyhhbmdsZSk7XHJcbiAgICAgICAgdmFyIG1TaW4gPSBfc2luKGFuZ2xlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdCgxLCAwLCAwLCAwLCAwLCBtQ29zLCAtbVNpbiwgMCwgMCwgbVNpbiwgIG1Db3MsIDAsIDAsIDAsIDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGF0ZVkoYW5nbGUpe1xyXG4gICAgICAgIGlmKGFuZ2xlID09PSAwKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBtQ29zID0gX2NvcyhhbmdsZSk7XHJcbiAgICAgICAgdmFyIG1TaW4gPSBfc2luKGFuZ2xlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdChtQ29zLCAgMCwgIG1TaW4sIDAsIDAsIDEsIDAsIDAsIC1tU2luLCAgMCwgIG1Db3MsIDAsIDAsIDAsIDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGF0ZVooYW5nbGUpe1xyXG4gICAgICAgIGlmKGFuZ2xlID09PSAwKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBtQ29zID0gX2NvcyhhbmdsZSk7XHJcbiAgICAgICAgdmFyIG1TaW4gPSBfc2luKGFuZ2xlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdChtQ29zLCAtbVNpbiwgIDAsIDAsIG1TaW4sICBtQ29zLCAwLCAwLCAwLCAgMCwgIDEsIDAsIDAsIDAsIDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNoZWFyKHN4LHN5KXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdCgxLCBzeSwgc3gsIDEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNrZXcoYXgsIGF5KXtcclxuICAgICAgICByZXR1cm4gdGhpcy5zaGVhcihfdGFuKGF4KSwgX3RhbihheSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNrZXdGcm9tQXhpcyhheCwgYW5nbGUpe1xyXG4gICAgICAgIHZhciBtQ29zID0gX2NvcyhhbmdsZSk7XHJcbiAgICAgICAgdmFyIG1TaW4gPSBfc2luKGFuZ2xlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdChtQ29zLCBtU2luLCAgMCwgMCwgLW1TaW4sICBtQ29zLCAwLCAwLCAwLCAgMCwgIDEsIDAsIDAsIDAsIDAsIDEpXHJcbiAgICAgICAgICAgIC5fdCgxLCAwLCAgMCwgMCwgX3RhbihheCksICAxLCAwLCAwLCAwLCAgMCwgIDEsIDAsIDAsIDAsIDAsIDEpXHJcbiAgICAgICAgICAgIC5fdChtQ29zLCAtbVNpbiwgIDAsIDAsIG1TaW4sICBtQ29zLCAwLCAwLCAwLCAgMCwgIDEsIDAsIDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIC8vcmV0dXJuIHRoaXMuX3QobUNvcywgbVNpbiwgLW1TaW4sIG1Db3MsIDAsIDApLl90KDEsIDAsIF90YW4oYXgpLCAxLCAwLCAwKS5fdChtQ29zLCAtbVNpbiwgbVNpbiwgbUNvcywgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2NhbGUoc3gsIHN5LCBzeikge1xyXG4gICAgICAgIHN6ID0gaXNOYU4oc3opID8gMSA6IHN6O1xyXG4gICAgICAgIGlmKHN4ID09IDEgJiYgc3kgPT0gMSAmJiBzeiA9PSAxKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl90KHN4LCAwLCAwLCAwLCAwLCBzeSwgMCwgMCwgMCwgMCwgc3osIDAsIDAsIDAsIDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldFRyYW5zZm9ybShhLCBiLCBjLCBkLCBlLCBmLCBnLCBoLCBpLCBqLCBrLCBsLCBtLCBuLCBvLCBwKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wc1swXSA9IGE7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxXSA9IGI7XHJcbiAgICAgICAgdGhpcy5wcm9wc1syXSA9IGM7XHJcbiAgICAgICAgdGhpcy5wcm9wc1szXSA9IGQ7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s0XSA9IGU7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s1XSA9IGY7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s2XSA9IGc7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s3XSA9IGg7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s4XSA9IGk7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s5XSA9IGo7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMF0gPSBrO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTFdID0gbDtcclxuICAgICAgICB0aGlzLnByb3BzWzEyXSA9IG07XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxM10gPSBuO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTRdID0gbztcclxuICAgICAgICB0aGlzLnByb3BzWzE1XSA9IHA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKHR4LCB0eSwgdHopIHtcclxuICAgICAgICB0eiA9IHR6IHx8IDA7XHJcbiAgICAgICAgaWYodHggIT09IDAgfHwgdHkgIT09IDAgfHwgdHogIT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdCgxLDAsMCwwLDAsMSwwLDAsMCwwLDEsMCx0eCx0eSx0eiwxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtKGEyLCBiMiwgYzIsIGQyLCBlMiwgZjIsIGcyLCBoMiwgaTIsIGoyLCBrMiwgbDIsIG0yLCBuMiwgbzIsIHAyKSB7XHJcblxyXG4gICAgICAgIHZhciBfcCA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGlmKGEyID09PSAxICYmIGIyID09PSAwICYmIGMyID09PSAwICYmIGQyID09PSAwICYmIGUyID09PSAwICYmIGYyID09PSAxICYmIGcyID09PSAwICYmIGgyID09PSAwICYmIGkyID09PSAwICYmIGoyID09PSAwICYmIGsyID09PSAxICYmIGwyID09PSAwKXtcclxuICAgICAgICAgICAgLy9OT1RFOiBjb21tZW50aW5nIHRoaXMgY29uZGl0aW9uIGJlY2F1c2UgVHVyYm9GYW4gZGVvcHRpbWl6ZXMgY29kZSB3aGVuIHByZXNlbnRcclxuICAgICAgICAgICAgLy9pZihtMiAhPT0gMCB8fCBuMiAhPT0gMCB8fCBvMiAhPT0gMCl7XHJcbiAgICAgICAgICAgICAgICBfcFsxMl0gPSBfcFsxMl0gKiBhMiArIF9wWzE1XSAqIG0yO1xyXG4gICAgICAgICAgICAgICAgX3BbMTNdID0gX3BbMTNdICogZjIgKyBfcFsxNV0gKiBuMjtcclxuICAgICAgICAgICAgICAgIF9wWzE0XSA9IF9wWzE0XSAqIGsyICsgX3BbMTVdICogbzI7XHJcbiAgICAgICAgICAgICAgICBfcFsxNV0gPSBfcFsxNV0gKiBwMjtcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgIHRoaXMuX2lkZW50aXR5Q2FsY3VsYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhMSA9IF9wWzBdO1xyXG4gICAgICAgIHZhciBiMSA9IF9wWzFdO1xyXG4gICAgICAgIHZhciBjMSA9IF9wWzJdO1xyXG4gICAgICAgIHZhciBkMSA9IF9wWzNdO1xyXG4gICAgICAgIHZhciBlMSA9IF9wWzRdO1xyXG4gICAgICAgIHZhciBmMSA9IF9wWzVdO1xyXG4gICAgICAgIHZhciBnMSA9IF9wWzZdO1xyXG4gICAgICAgIHZhciBoMSA9IF9wWzddO1xyXG4gICAgICAgIHZhciBpMSA9IF9wWzhdO1xyXG4gICAgICAgIHZhciBqMSA9IF9wWzldO1xyXG4gICAgICAgIHZhciBrMSA9IF9wWzEwXTtcclxuICAgICAgICB2YXIgbDEgPSBfcFsxMV07XHJcbiAgICAgICAgdmFyIG0xID0gX3BbMTJdO1xyXG4gICAgICAgIHZhciBuMSA9IF9wWzEzXTtcclxuICAgICAgICB2YXIgbzEgPSBfcFsxNF07XHJcbiAgICAgICAgdmFyIHAxID0gX3BbMTVdO1xyXG5cclxuICAgICAgICAvKiBtYXRyaXggb3JkZXIgKGNhbnZhcyBjb21wYXRpYmxlKTpcclxuICAgICAgICAgKiBhY2VcclxuICAgICAgICAgKiBiZGZcclxuICAgICAgICAgKiAwMDFcclxuICAgICAgICAgKi9cclxuICAgICAgICBfcFswXSA9IGExICogYTIgKyBiMSAqIGUyICsgYzEgKiBpMiArIGQxICogbTI7XHJcbiAgICAgICAgX3BbMV0gPSBhMSAqIGIyICsgYjEgKiBmMiArIGMxICogajIgKyBkMSAqIG4yIDtcclxuICAgICAgICBfcFsyXSA9IGExICogYzIgKyBiMSAqIGcyICsgYzEgKiBrMiArIGQxICogbzIgO1xyXG4gICAgICAgIF9wWzNdID0gYTEgKiBkMiArIGIxICogaDIgKyBjMSAqIGwyICsgZDEgKiBwMiA7XHJcblxyXG4gICAgICAgIF9wWzRdID0gZTEgKiBhMiArIGYxICogZTIgKyBnMSAqIGkyICsgaDEgKiBtMiA7XHJcbiAgICAgICAgX3BbNV0gPSBlMSAqIGIyICsgZjEgKiBmMiArIGcxICogajIgKyBoMSAqIG4yIDtcclxuICAgICAgICBfcFs2XSA9IGUxICogYzIgKyBmMSAqIGcyICsgZzEgKiBrMiArIGgxICogbzIgO1xyXG4gICAgICAgIF9wWzddID0gZTEgKiBkMiArIGYxICogaDIgKyBnMSAqIGwyICsgaDEgKiBwMiA7XHJcblxyXG4gICAgICAgIF9wWzhdID0gaTEgKiBhMiArIGoxICogZTIgKyBrMSAqIGkyICsgbDEgKiBtMiA7XHJcbiAgICAgICAgX3BbOV0gPSBpMSAqIGIyICsgajEgKiBmMiArIGsxICogajIgKyBsMSAqIG4yIDtcclxuICAgICAgICBfcFsxMF0gPSBpMSAqIGMyICsgajEgKiBnMiArIGsxICogazIgKyBsMSAqIG8yIDtcclxuICAgICAgICBfcFsxMV0gPSBpMSAqIGQyICsgajEgKiBoMiArIGsxICogbDIgKyBsMSAqIHAyIDtcclxuXHJcbiAgICAgICAgX3BbMTJdID0gbTEgKiBhMiArIG4xICogZTIgKyBvMSAqIGkyICsgcDEgKiBtMiA7XHJcbiAgICAgICAgX3BbMTNdID0gbTEgKiBiMiArIG4xICogZjIgKyBvMSAqIGoyICsgcDEgKiBuMiA7XHJcbiAgICAgICAgX3BbMTRdID0gbTEgKiBjMiArIG4xICogZzIgKyBvMSAqIGsyICsgcDEgKiBvMiA7XHJcbiAgICAgICAgX3BbMTVdID0gbTEgKiBkMiArIG4xICogaDIgKyBvMSAqIGwyICsgcDEgKiBwMiA7XHJcblxyXG4gICAgICAgIHRoaXMuX2lkZW50aXR5Q2FsY3VsYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzSWRlbnRpdHkoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuX2lkZW50aXR5Q2FsY3VsYXRlZCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2lkZW50aXR5ID0gISh0aGlzLnByb3BzWzBdICE9PSAxIHx8IHRoaXMucHJvcHNbMV0gIT09IDAgfHwgdGhpcy5wcm9wc1syXSAhPT0gMCB8fCB0aGlzLnByb3BzWzNdICE9PSAwIHx8IHRoaXMucHJvcHNbNF0gIT09IDAgfHwgdGhpcy5wcm9wc1s1XSAhPT0gMSB8fCB0aGlzLnByb3BzWzZdICE9PSAwIHx8IHRoaXMucHJvcHNbN10gIT09IDAgfHwgdGhpcy5wcm9wc1s4XSAhPT0gMCB8fCB0aGlzLnByb3BzWzldICE9PSAwIHx8IHRoaXMucHJvcHNbMTBdICE9PSAxIHx8IHRoaXMucHJvcHNbMTFdICE9PSAwIHx8IHRoaXMucHJvcHNbMTJdICE9PSAwIHx8IHRoaXMucHJvcHNbMTNdICE9PSAwIHx8IHRoaXMucHJvcHNbMTRdICE9PSAwIHx8IHRoaXMucHJvcHNbMTVdICE9PSAxKTtcclxuICAgICAgICAgICAgdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVxdWFscyhtYXRyKXtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGkgPCAxNikge1xyXG4gICAgICAgICAgICBpZihtYXRyLnByb3BzW2ldICE9PSB0aGlzLnByb3BzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSs9MTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvbmUobWF0cil7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZm9yKGk9MDtpPDE2O2krPTEpe1xyXG4gICAgICAgICAgICBtYXRyLnByb3BzW2ldID0gdGhpcy5wcm9wc1tpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvbmVGcm9tUHJvcHMocHJvcHMpe1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIGZvcihpPTA7aTwxNjtpKz0xKXtcclxuICAgICAgICAgICAgdGhpcy5wcm9wc1tpXSA9IHByb3BzW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseVRvUG9pbnQoeCwgeSwgeikge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiB4ICogdGhpcy5wcm9wc1swXSArIHkgKiB0aGlzLnByb3BzWzRdICsgeiAqIHRoaXMucHJvcHNbOF0gKyB0aGlzLnByb3BzWzEyXSxcclxuICAgICAgICAgICAgeTogeCAqIHRoaXMucHJvcHNbMV0gKyB5ICogdGhpcy5wcm9wc1s1XSArIHogKiB0aGlzLnByb3BzWzldICsgdGhpcy5wcm9wc1sxM10sXHJcbiAgICAgICAgICAgIHo6IHggKiB0aGlzLnByb3BzWzJdICsgeSAqIHRoaXMucHJvcHNbNl0gKyB6ICogdGhpcy5wcm9wc1sxMF0gKyB0aGlzLnByb3BzWzE0XVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLypyZXR1cm4ge1xyXG4gICAgICAgICB4OiB4ICogbWUuYSArIHkgKiBtZS5jICsgbWUuZSxcclxuICAgICAgICAgeTogeCAqIG1lLmIgKyB5ICogbWUuZCArIG1lLmZcclxuICAgICAgICAgfTsqL1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1goeCwgeSwgeikge1xyXG4gICAgICAgIHJldHVybiB4ICogdGhpcy5wcm9wc1swXSArIHkgKiB0aGlzLnByb3BzWzRdICsgeiAqIHRoaXMucHJvcHNbOF0gKyB0aGlzLnByb3BzWzEyXTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9ZKHgsIHksIHopIHtcclxuICAgICAgICByZXR1cm4geCAqIHRoaXMucHJvcHNbMV0gKyB5ICogdGhpcy5wcm9wc1s1XSArIHogKiB0aGlzLnByb3BzWzldICsgdGhpcy5wcm9wc1sxM107XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBhcHBseVRvWih4LCB5LCB6KSB7XHJcbiAgICAgICAgcmV0dXJuIHggKiB0aGlzLnByb3BzWzJdICsgeSAqIHRoaXMucHJvcHNbNl0gKyB6ICogdGhpcy5wcm9wc1sxMF0gKyB0aGlzLnByb3BzWzE0XTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbnZlcnNlUG9pbnQocHQpIHtcclxuICAgICAgICB2YXIgZGV0ZXJtaW5hbnQgPSB0aGlzLnByb3BzWzBdICogdGhpcy5wcm9wc1s1XSAtIHRoaXMucHJvcHNbMV0gKiB0aGlzLnByb3BzWzRdO1xyXG4gICAgICAgIHZhciBhID0gdGhpcy5wcm9wc1s1XS9kZXRlcm1pbmFudDtcclxuICAgICAgICB2YXIgYiA9IC0gdGhpcy5wcm9wc1sxXS9kZXRlcm1pbmFudDtcclxuICAgICAgICB2YXIgYyA9IC0gdGhpcy5wcm9wc1s0XS9kZXRlcm1pbmFudDtcclxuICAgICAgICB2YXIgZCA9IHRoaXMucHJvcHNbMF0vZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgdmFyIGUgPSAodGhpcy5wcm9wc1s0XSAqIHRoaXMucHJvcHNbMTNdIC0gdGhpcy5wcm9wc1s1XSAqIHRoaXMucHJvcHNbMTJdKS9kZXRlcm1pbmFudDtcclxuICAgICAgICB2YXIgZiA9IC0gKHRoaXMucHJvcHNbMF0gKiB0aGlzLnByb3BzWzEzXSAtIHRoaXMucHJvcHNbMV0gKiB0aGlzLnByb3BzWzEyXSkvZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgcmV0dXJuIFtwdFswXSAqIGEgKyBwdFsxXSAqIGMgKyBlLCBwdFswXSAqIGIgKyBwdFsxXSAqIGQgKyBmLCAwXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbnZlcnNlUG9pbnRzKHB0cyl7XHJcbiAgICAgICAgdmFyIGksIGxlbiA9IHB0cy5sZW5ndGgsIHJldFB0cyA9IFtdO1xyXG4gICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XHJcbiAgICAgICAgICAgIHJldFB0c1tpXSA9IGludmVyc2VQb2ludChwdHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0UHRzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9UcmlwbGVQb2ludHMocHQxLCBwdDIsIHB0Mykge1xyXG4gICAgICAgIHZhciBhcnIgPSBjcmVhdGVUeXBlZEFycmF5KCdmbG9hdDMyJywgNik7XHJcbiAgICAgICAgaWYodGhpcy5pc0lkZW50aXR5KCkpIHtcclxuICAgICAgICAgICAgYXJyWzBdID0gcHQxWzBdO1xyXG4gICAgICAgICAgICBhcnJbMV0gPSBwdDFbMV07XHJcbiAgICAgICAgICAgIGFyclsyXSA9IHB0MlswXTtcclxuICAgICAgICAgICAgYXJyWzNdID0gcHQyWzFdO1xyXG4gICAgICAgICAgICBhcnJbNF0gPSBwdDNbMF07XHJcbiAgICAgICAgICAgIGFycls1XSA9IHB0M1sxXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcDAgPSB0aGlzLnByb3BzWzBdLCBwMSA9IHRoaXMucHJvcHNbMV0sIHA0ID0gdGhpcy5wcm9wc1s0XSwgcDUgPSB0aGlzLnByb3BzWzVdLCBwMTIgPSB0aGlzLnByb3BzWzEyXSwgcDEzID0gdGhpcy5wcm9wc1sxM107XHJcbiAgICAgICAgICAgIGFyclswXSA9IHB0MVswXSAqIHAwICsgcHQxWzFdICogcDQgKyBwMTI7XHJcbiAgICAgICAgICAgIGFyclsxXSA9IHB0MVswXSAqIHAxICsgcHQxWzFdICogcDUgKyBwMTM7XHJcbiAgICAgICAgICAgIGFyclsyXSA9IHB0MlswXSAqIHAwICsgcHQyWzFdICogcDQgKyBwMTI7XHJcbiAgICAgICAgICAgIGFyclszXSA9IHB0MlswXSAqIHAxICsgcHQyWzFdICogcDUgKyBwMTM7XHJcbiAgICAgICAgICAgIGFycls0XSA9IHB0M1swXSAqIHAwICsgcHQzWzFdICogcDQgKyBwMTI7XHJcbiAgICAgICAgICAgIGFycls1XSA9IHB0M1swXSAqIHAxICsgcHQzWzFdICogcDUgKyBwMTM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1BvaW50QXJyYXkoeCx5LHope1xyXG4gICAgICAgIHZhciBhcnI7XHJcbiAgICAgICAgaWYodGhpcy5pc0lkZW50aXR5KCkpIHtcclxuICAgICAgICAgICAgYXJyID0gW3gseSx6XTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhcnIgPSBbeCAqIHRoaXMucHJvcHNbMF0gKyB5ICogdGhpcy5wcm9wc1s0XSArIHogKiB0aGlzLnByb3BzWzhdICsgdGhpcy5wcm9wc1sxMl0seCAqIHRoaXMucHJvcHNbMV0gKyB5ICogdGhpcy5wcm9wc1s1XSArIHogKiB0aGlzLnByb3BzWzldICsgdGhpcy5wcm9wc1sxM10seCAqIHRoaXMucHJvcHNbMl0gKyB5ICogdGhpcy5wcm9wc1s2XSArIHogKiB0aGlzLnByb3BzWzEwXSArIHRoaXMucHJvcHNbMTRdXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseVRvUG9pbnRTdHJpbmdpZmllZCh4LCB5KSB7XHJcbiAgICAgICAgaWYodGhpcy5pc0lkZW50aXR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHggKyAnLCcgKyB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKHggKiB0aGlzLnByb3BzWzBdICsgeSAqIHRoaXMucHJvcHNbNF0gKyB0aGlzLnByb3BzWzEyXSkrJywnKyh4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgdGhpcy5wcm9wc1sxM10pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvQ1NTKCkge1xyXG4gICAgICAgIC8vRG9lc24ndCBtYWtlIG11Y2ggc2Vuc2UgdG8gYWRkIHRoaXMgb3B0aW1pemF0aW9uLiBJZiBpdCBpcyBhbiBpZGVudGl0eSBtYXRyaXgsIGl0J3MgdmVyeSBsaWtlbHkgdGhpcyB3aWxsIGdldCBjYWxsZWQgb25seSBvbmNlIHNpbmNlIGl0IHdvbid0IGJlIGtleWZyYW1lZC5cclxuICAgICAgICAvKmlmKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9Ki9cclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcztcclxuICAgICAgICB2YXIgY3NzVmFsdWUgPSAnbWF0cml4M2QoJztcclxuICAgICAgICB2YXIgdiA9IDEwMDAwO1xyXG4gICAgICAgIHdoaWxlKGk8MTYpe1xyXG4gICAgICAgICAgICBjc3NWYWx1ZSArPSBfcm5kKHByb3BzW2ldKnYpL3Y7XHJcbiAgICAgICAgICAgIGNzc1ZhbHVlICs9IGkgPT09IDE1ID8gJyknOicsJztcclxuICAgICAgICAgICAgaSArPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3NzVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG8yZENTUygpIHtcclxuICAgICAgICAvL0RvZXNuJ3QgbWFrZSBtdWNoIHNlbnNlIHRvIGFkZCB0aGlzIG9wdGltaXphdGlvbi4gSWYgaXQgaXMgYW4gaWRlbnRpdHkgbWF0cml4LCBpdCdzIHZlcnkgbGlrZWx5IHRoaXMgd2lsbCBnZXQgY2FsbGVkIG9ubHkgb25jZSBzaW5jZSBpdCB3b24ndCBiZSBrZXlmcmFtZWQuXHJcbiAgICAgICAgLyppZih0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgdmFyIHYgPSAxMDAwMDtcclxuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiBcIm1hdHJpeChcIiArIF9ybmQocHJvcHNbMF0qdikvdiArICcsJyArIF9ybmQocHJvcHNbMV0qdikvdiArICcsJyArIF9ybmQocHJvcHNbNF0qdikvdiArICcsJyArIF9ybmQocHJvcHNbNV0qdikvdiArICcsJyArIF9ybmQocHJvcHNbMTJdKnYpL3YgKyAnLCcgKyBfcm5kKHByb3BzWzEzXSp2KS92ICsgXCIpXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gTWF0cml4SW5zdGFuY2UoKXtcclxuICAgICAgICB0aGlzLnJlc2V0ID0gcmVzZXQ7XHJcbiAgICAgICAgdGhpcy5yb3RhdGUgPSByb3RhdGU7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVYID0gcm90YXRlWDtcclxuICAgICAgICB0aGlzLnJvdGF0ZVkgPSByb3RhdGVZO1xyXG4gICAgICAgIHRoaXMucm90YXRlWiA9IHJvdGF0ZVo7XHJcbiAgICAgICAgdGhpcy5za2V3ID0gc2tldztcclxuICAgICAgICB0aGlzLnNrZXdGcm9tQXhpcyA9IHNrZXdGcm9tQXhpcztcclxuICAgICAgICB0aGlzLnNoZWFyID0gc2hlYXI7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xyXG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtID0gc2V0VHJhbnNmb3JtO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlID0gdHJhbnNsYXRlO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1BvaW50ID0gYXBwbHlUb1BvaW50O1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1ggPSBhcHBseVRvWDtcclxuICAgICAgICB0aGlzLmFwcGx5VG9ZID0gYXBwbHlUb1k7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvWiA9IGFwcGx5VG9aO1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1BvaW50QXJyYXkgPSBhcHBseVRvUG9pbnRBcnJheTtcclxuICAgICAgICB0aGlzLmFwcGx5VG9UcmlwbGVQb2ludHMgPSBhcHBseVRvVHJpcGxlUG9pbnRzO1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1BvaW50U3RyaW5naWZpZWQgPSBhcHBseVRvUG9pbnRTdHJpbmdpZmllZDtcclxuICAgICAgICB0aGlzLnRvQ1NTID0gdG9DU1M7XHJcbiAgICAgICAgdGhpcy50bzJkQ1NTID0gdG8yZENTUztcclxuICAgICAgICB0aGlzLmNsb25lID0gY2xvbmU7XHJcbiAgICAgICAgdGhpcy5jbG9uZUZyb21Qcm9wcyA9IGNsb25lRnJvbVByb3BzO1xyXG4gICAgICAgIHRoaXMuZXF1YWxzID0gZXF1YWxzO1xyXG4gICAgICAgIHRoaXMuaW52ZXJzZVBvaW50cyA9IGludmVyc2VQb2ludHM7XHJcbiAgICAgICAgdGhpcy5pbnZlcnNlUG9pbnQgPSBpbnZlcnNlUG9pbnQ7XHJcbiAgICAgICAgdGhpcy5fdCA9IHRoaXMudHJhbnNmb3JtO1xyXG4gICAgICAgIHRoaXMuaXNJZGVudGl0eSA9IGlzSWRlbnRpdHk7XHJcbiAgICAgICAgdGhpcy5faWRlbnRpdHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2lkZW50aXR5Q2FsY3VsYXRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzID0gY3JlYXRlVHlwZWRBcnJheSgnZmxvYXQzMicsIDE2KTtcclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeEluc3RhbmNlKClcclxuICAgIH1cclxufSgpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0cml4OyIsInZhciBjcmVhdGVUeXBlZEFycmF5ID0gKGZ1bmN0aW9uKCl7XHJcblx0ZnVuY3Rpb24gY3JlYXRlUmVndWxhckFycmF5KHR5cGUsIGxlbil7XHJcblx0XHR2YXIgaSA9IDAsIGFyciA9IFtdLCB2YWx1ZTtcclxuXHRcdHN3aXRjaCh0eXBlKSB7XHJcblx0XHRcdGNhc2UgJ2ludDE2JzpcclxuXHRcdFx0Y2FzZSAndWludDhjJzpcclxuXHRcdFx0XHR2YWx1ZSA9IDE7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dmFsdWUgPSAxLjE7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xyXG5cdFx0XHRhcnIucHVzaCh2YWx1ZSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYXJyO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBjcmVhdGVUeXBlZEFycmF5KHR5cGUsIGxlbil7XHJcblx0XHRpZih0eXBlID09PSAnZmxvYXQzMicpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkobGVuKTtcclxuXHRcdH0gZWxzZSBpZih0eXBlID09PSAnaW50MTYnKSB7XHJcblx0XHRcdHJldHVybiBuZXcgSW50MTZBcnJheShsZW4pO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGUgPT09ICd1aW50OGMnKSB7XHJcblx0XHRcdHJldHVybiBuZXcgVWludDhDbGFtcGVkQXJyYXkobGVuKTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYodHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBGbG9hdDMyQXJyYXkgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdHJldHVybiBjcmVhdGVUeXBlZEFycmF5O1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gY3JlYXRlUmVndWxhckFycmF5O1xyXG5cdH1cclxufSgpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlVHlwZWRBcnJheTtcclxuIiwidmFyIEFuaW1hdGlvbkl0ZW0gPSByZXF1aXJlKCcuL2FuaW1hdGlvbi9BbmltYXRpb25JdGVtJyk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVBbmltYXRpb25BcGkoYW5pbSkge1xyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBBbmltYXRpb25JdGVtKGFuaW0pKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Y3JlYXRlQW5pbWF0aW9uQXBpIDogY3JlYXRlQW5pbWF0aW9uQXBpXHJcbn0iLCJ2YXIga2V5UGF0aEJ1aWxkZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2tleVBhdGhCdWlsZGVyJyk7XHJcbnZhciBsYXllcl90eXBlcyA9IHJlcXVpcmUoJy4uL2VudW1zL2xheWVyX3R5cGVzJyk7XHJcblxyXG5mdW5jdGlvbiBLZXlQYXRoTGlzdChlbGVtZW50cywgbm9kZV90eXBlKSB7XHJcblxyXG5cdGZ1bmN0aW9uIF9nZXRMZW5ndGgoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0VGFyZ2V0TGF5ZXIoKS5kYXRhLnR5ID09PSBsYXllcl90eXBlc1t0eXBlXTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCBuYW1lKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0VGFyZ2V0TGF5ZXIoKS5kYXRhLm5tID09PSBuYW1lO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVByb3BlcnR5KGVsZW1lbnRzLCBuYW1lKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0aWYoZWxlbWVudC5oYXNQcm9wZXJ0eShuYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiBlbGVtZW50LmdldFByb3BlcnR5KG5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlUeXBlKHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCBzZWxlY3RvciksICdsYXllcicpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlOYW1lKHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCBzZWxlY3RvciksICdsYXllcicpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydGllc0J5U2VsZWN0b3Ioc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5oYXNQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHR9KS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHR9KSwgJ3Byb3BlcnR5Jyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllclByb3BlcnR5KHNlbGVjdG9yKSB7XHJcblx0XHR2YXIgbGF5ZXJzID0gX2ZpbHRlckxheWVyQnlQcm9wZXJ0eShlbGVtZW50cywgc2VsZWN0b3IpO1xyXG5cdFx0dmFyIHByb3BlcnRpZXMgPSBsYXllcnMubWFwKGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHR9KVxyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KHByb3BlcnRpZXMsICdwcm9wZXJ0eScpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0S2V5UGF0aChwcm9wZXJ0eVBhdGgpIHtcclxuXHRcdHZhciBrZXlQYXRoRGF0YSA9IGtleVBhdGhCdWlsZGVyKHByb3BlcnR5UGF0aCk7XHJcblx0XHR2YXIgc2VsZWN0b3IgPSBrZXlQYXRoRGF0YS5zZWxlY3RvcjtcclxuXHRcdHZhciBub2Rlc0J5TmFtZSwgbm9kZXNCeVR5cGUsIHNlbGVjdGVkTm9kZXM7XHJcblx0XHRpZiAobm9kZV90eXBlID09PSAncmVuZGVyZXInIHx8IG5vZGVfdHlwZSA9PT0gJ2xheWVyJykge1xyXG5cdFx0XHRub2Rlc0J5TmFtZSA9IGdldExheWVyc0J5TmFtZShzZWxlY3Rvcik7XHJcblx0XHRcdG5vZGVzQnlUeXBlID0gZ2V0TGF5ZXJzQnlUeXBlKHNlbGVjdG9yKTtcclxuXHRcdFx0aWYgKG5vZGVzQnlOYW1lLmxlbmd0aCA9PT0gMCAmJiBub2Rlc0J5VHlwZS5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRzZWxlY3RlZE5vZGVzID0gZ2V0TGF5ZXJQcm9wZXJ0eShzZWxlY3Rvcik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZWN0ZWROb2RlcyA9IG5vZGVzQnlOYW1lLmNvbmNhdChub2Rlc0J5VHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGtleVBhdGhEYXRhLnByb3BlcnR5UGF0aCkge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzLmdldEtleVBhdGgoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2RlcztcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmKG5vZGVfdHlwZSA9PT0gJ3Byb3BlcnR5Jykge1xyXG5cdFx0XHRzZWxlY3RlZE5vZGVzID0gZ2V0UHJvcGVydGllc0J5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0XHRpZiAoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXMuZ2V0S2V5UGF0aChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25jYXQobm9kZXMpIHtcclxuXHRcdHZhciBub2Rlc0VsZW1lbnRzID0gbm9kZXMuZ2V0RWxlbWVudHMoKTtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChlbGVtZW50cy5jb25jYXQobm9kZXNFbGVtZW50cyksIG5vZGVfdHlwZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRFbGVtZW50cygpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5QXRJbmRleChpbmRleCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzW2luZGV4XTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0S2V5UGF0aDogZ2V0S2V5UGF0aCxcclxuXHRcdGNvbmNhdDogY29uY2F0LFxyXG5cdFx0Z2V0RWxlbWVudHM6IGdldEVsZW1lbnRzLFxyXG5cdFx0Z2V0UHJvcGVydHlBdEluZGV4OiBnZXRQcm9wZXJ0eUF0SW5kZXhcclxuXHR9XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbGVuZ3RoJywge1xyXG5cdFx0Z2V0OiBfZ2V0TGVuZ3RoXHJcblx0fSk7XHJcblxyXG5cdHJldHVybiBtZXRob2RzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleVBhdGhMaXN0OyIsInZhciBrZXlfcGF0aF9zZXBhcmF0b3IgPSByZXF1aXJlKCcuLi9lbnVtcy9rZXlfcGF0aF9zZXBhcmF0b3InKTtcclxudmFyIHByb3BlcnR5X25hbWVzID0gcmVxdWlyZSgnLi4vZW51bXMvcHJvcGVydHlfbmFtZXMnKTtcclxuXHJcbmZ1bmN0aW9uIEtleVBhdGhOb2RlKHN0YXRlKSB7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yLCBwcm9wZXJ0eVBhdGgpIHtcclxuXHRcdHZhciBpbnN0YW5jZVByb3BlcnRpZXMgPSBzdGF0ZS5wcm9wZXJ0aWVzIHx8IFtdO1xyXG5cdFx0dmFyIGkgPSAwLCBsZW4gPSBpbnN0YW5jZVByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0d2hpbGUoaSA8IGxlbikge1xyXG5cdFx0XHRpZihpbnN0YW5jZVByb3BlcnRpZXNbaV0ubmFtZSA9PT0gc2VsZWN0b3IpIHtcclxuXHRcdFx0XHRyZXR1cm4gaW5zdGFuY2VQcm9wZXJ0aWVzW2ldLnZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGkgKz0gMTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGhhc1Byb3BlcnR5KHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gISFnZXRQcm9wZXJ0eUJ5UGF0aChzZWxlY3Rvcik7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRQcm9wZXJ0eShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIGdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLnBhcmVudC5mcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gdG9LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLnBhcmVudC50b0tleXBhdGhMYXllclBvaW50KHBvaW50KTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0aGFzUHJvcGVydHk6IGhhc1Byb3BlcnR5LFxyXG5cdFx0Z2V0UHJvcGVydHk6IGdldFByb3BlcnR5LFxyXG5cdFx0ZnJvbUtleXBhdGhMYXllclBvaW50OiBmcm9tS2V5cGF0aExheWVyUG9pbnQsXHJcblx0XHR0b0tleXBhdGhMYXllclBvaW50OiB0b0tleXBhdGhMYXllclBvaW50XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5UGF0aE5vZGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtL1RyYW5zZm9ybScpO1xyXG52YXIgRWZmZWN0cyA9IHJlcXVpcmUoJy4vZWZmZWN0cy9FZmZlY3RzJyk7XHJcbnZhciBNYXRyaXggPSByZXF1aXJlKCcuLi9oZWxwZXJzL3RyYW5zZm9ybWF0aW9uTWF0cml4Jyk7XHJcblxyXG5mdW5jdGlvbiBMYXllckJhc2Uoc3RhdGUpIHtcclxuXHJcblx0dmFyIHRyYW5zZm9ybSA9IFRyYW5zZm9ybShzdGF0ZS5lbGVtZW50LmZpbmFsVHJhbnNmb3JtLm1Qcm9wLCBzdGF0ZSk7XHJcblx0dmFyIGVmZmVjdHMgPSBFZmZlY3RzKHN0YXRlLmVsZW1lbnQuZWZmZWN0c01hbmFnZXIuZWZmZWN0RWxlbWVudHMgfHwgW10sIHN0YXRlKTtcclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRzdGF0ZS5wcm9wZXJ0aWVzLnB1c2goe1xyXG5cdFx0XHRuYW1lOiAndHJhbnNmb3JtJyxcclxuXHRcdFx0dmFsdWU6IHRyYW5zZm9ybVxyXG5cdFx0fSx7XHJcblx0XHRcdG5hbWU6ICdUcmFuc2Zvcm0nLFxyXG5cdFx0XHR2YWx1ZTogdHJhbnNmb3JtXHJcblx0XHR9LHtcclxuXHRcdFx0bmFtZTogJ0VmZmVjdHMnLFxyXG5cdFx0XHR2YWx1ZTogZWZmZWN0c1xyXG5cdFx0fSx7XHJcblx0XHRcdG5hbWU6ICdlZmZlY3RzJyxcclxuXHRcdFx0dmFsdWU6IGVmZmVjdHNcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRUb1BvaW50KHBvaW50KSB7XHJcbiAgICB9XHJcblxyXG5cdGZ1bmN0aW9uIHRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudDtcclxuICAgIFx0aWYoc3RhdGUucGFyZW50LnRvS2V5cGF0aExheWVyUG9pbnQpIHtcclxuICAgICAgICBcdHBvaW50ID0gc3RhdGUucGFyZW50LnRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgIFx0dmFyIHRvV29ybGRNYXQgPSBNYXRyaXgoKTtcclxuICAgICAgICB2YXIgdHJhbnNmb3JtTWF0ID0gc3RhdGUuZ2V0UHJvcGVydHkoJ1RyYW5zZm9ybScpLmdldFRhcmdldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIGlmKGVsZW1lbnQuaGllcmFyY2h5ICYmIGVsZW1lbnQuaGllcmFyY2h5Lmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHZhciBpLCBsZW4gPSBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmhpZXJhcmNoeVtpXS5maW5hbFRyYW5zZm9ybS5tUHJvcC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b1dvcmxkTWF0LmludmVyc2VQb2ludChwb2ludCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudDtcclxuXHRcdHZhciB0b1dvcmxkTWF0ID0gTWF0cml4KCk7XHJcbiAgICAgICAgdmFyIHRyYW5zZm9ybU1hdCA9IHN0YXRlLmdldFByb3BlcnR5KCdUcmFuc2Zvcm0nKS5nZXRUYXJnZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICB0cmFuc2Zvcm1NYXQuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICBpZihlbGVtZW50LmhpZXJhcmNoeSAmJiBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGgpe1xyXG4gICAgICAgICAgICB2YXIgaSwgbGVuID0gZWxlbWVudC5oaWVyYXJjaHkubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IoaT0wO2k8bGVuO2krPTEpe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5oaWVyYXJjaHlbaV0uZmluYWxUcmFuc2Zvcm0ubVByb3AuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludCA9IHRvV29ybGRNYXQuYXBwbHlUb1BvaW50QXJyYXkocG9pbnRbMF0scG9pbnRbMV0scG9pbnRbMl18fDApO1xyXG4gICAgICAgIGlmKHN0YXRlLnBhcmVudC5mcm9tS2V5cGF0aExheWVyUG9pbnQpIHtcclxuICAgICAgICBcdHJldHVybiBzdGF0ZS5wYXJlbnQuZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFx0cmV0dXJuIHBvaW50O1xyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRhcmdldExheWVyKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLmVsZW1lbnQ7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldFRhcmdldExheWVyOiBnZXRUYXJnZXRMYXllcixcclxuXHRcdHRvS2V5cGF0aExheWVyUG9pbnQ6IHRvS2V5cGF0aExheWVyUG9pbnQsXHJcblx0XHRmcm9tS2V5cGF0aExheWVyUG9pbnQ6IGZyb21LZXlwYXRoTGF5ZXJQb2ludFxyXG5cdH1cclxuXHJcblx0X2J1aWxkUHJvcGVydHlNYXAoKTtcclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUsIEtleVBhdGhOb2RlKHN0YXRlKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJCYXNlOyIsInZhciBsYXllcl90eXBlcyA9IHJlcXVpcmUoJy4uL2VudW1zL2xheWVyX3R5cGVzJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG5cclxuZnVuY3Rpb24gTGF5ZXJMaXN0KGVsZW1lbnRzKSB7XHJcblxyXG5cdGZ1bmN0aW9uIF9nZXRMZW5ndGgoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS50eSA9PT0gbGF5ZXJfdHlwZXNbdHlwZV07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgbmFtZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEubm0gPT09IG5hbWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVycygpIHtcclxuXHRcdCByZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5VHlwZSh0eXBlKSB7XHJcblx0XHR2YXIgZWxlbWVudHNMaXN0ID0gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKTtcclxuXHRcdHJldHVybiBMYXllckxpc3QoZWxlbWVudHNMaXN0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5TmFtZSh0eXBlKSB7XHJcblx0XHR2YXIgZWxlbWVudHNMaXN0ID0gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCB0eXBlKTtcclxuXHRcdHJldHVybiBMYXllckxpc3QoZWxlbWVudHNMaXN0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxheWVyKGluZGV4KSB7XHJcblx0XHRpZiAoaW5kZXggPj0gZWxlbWVudHMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiBbXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBsYXllcl9hcGkoZWxlbWVudHNbcGFyc2VJbnQoaW5kZXgpXSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRJdGVyYXRhYmxlTWV0aG9kcyhpdGVyYXRhYmxlTWV0aG9kcywgbGlzdCkge1xyXG5cdFx0aXRlcmF0YWJsZU1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSl7XHJcblx0XHRcdHZhciBfdmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0YWNjdW11bGF0b3JbdmFsdWVdID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XHJcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnRzLm1hcChmdW5jdGlvbihlbGVtZW50KXtcclxuXHRcdFx0XHRcdHZhciBsYXllciA9IGxheWVyX2FwaShlbGVtZW50KTtcclxuXHRcdFx0XHRcdGlmKGxheWVyW192YWx1ZV0pIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyW192YWx1ZV0uYXBwbHkobnVsbCwgX2FyZ3VtZW50cyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gYWNjdW11bGF0b3I7XHJcblx0XHR9LCBtZXRob2RzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRhcmdldEVsZW1lbnRzKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY29uY2F0KGxpc3QpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5jb25jYXQobGlzdC5nZXRUYXJnZXRFbGVtZW50cygpKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0TGF5ZXJzOiBnZXRMYXllcnMsXHJcblx0XHRnZXRMYXllcnNCeVR5cGU6IGdldExheWVyc0J5VHlwZSxcclxuXHRcdGdldExheWVyc0J5TmFtZTogZ2V0TGF5ZXJzQnlOYW1lLFxyXG5cdFx0bGF5ZXI6IGxheWVyLFxyXG5cdFx0Y29uY2F0OiBjb25jYXQsXHJcblx0XHRnZXRUYXJnZXRFbGVtZW50czogZ2V0VGFyZ2V0RWxlbWVudHNcclxuXHR9O1xyXG5cclxuXHRhZGRJdGVyYXRhYmxlTWV0aG9kcyhbJ3NldFRyYW5zbGF0ZScsICdnZXRUeXBlJywgJ2dldER1cmF0aW9uJ10pO1xyXG5cdGFkZEl0ZXJhdGFibGVNZXRob2RzKFsnc2V0VGV4dCcsICdnZXRUZXh0JywgJ3NldERvY3VtZW50RGF0YScsICdjYW5SZXNpemVGb250JywgJ3NldE1pbmltdW1Gb250U2l6ZSddKTtcclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1ldGhvZHMsICdsZW5ndGgnLCB7XHJcblx0XHRnZXQ6IF9nZXRMZW5ndGhcclxuXHR9KTtcclxuXHRyZXR1cm4gbWV0aG9kcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXllckxpc3Q7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIENhbWVyYShlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb2ludCBvZiBJbnRlcmVzdCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1pvb20nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnBlLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnAsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdYIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5yeCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnJ5LCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnWiBSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucnosIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0TGF5ZXIoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudDtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGFyZ2V0TGF5ZXI6IGdldFRhcmdldExheWVyXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgS2V5UGF0aE5vZGUoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmE7IiwidmFyIEtleVBhdGhMaXN0ID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aExpc3QnKTtcclxudmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG52YXIgbGF5ZXJfYXBpID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9sYXllckFQSUJ1aWxkZXInKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIENvbXBvc2l0aW9uKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0VGltZVJlbWFwKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnRtKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZExheWVyQXBpKGxheWVyLCBpbmRleCkge1xyXG5cdFx0dmFyIF9sYXllckFwaSA9IG51bGw7XHJcblx0XHR2YXIgb2IgPSB7XHJcblx0XHRcdG5hbWU6IGxheWVyLm5tXHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0TGF5ZXJBcGkoKSB7XHJcblx0XHRcdGlmKCFfbGF5ZXJBcGkpIHtcclxuXHRcdFx0XHRfbGF5ZXJBcGkgPSBsYXllcl9hcGkoZWxlbWVudC5lbGVtZW50c1tpbmRleF0sIHN0YXRlKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBfbGF5ZXJBcGlcclxuXHRcdH1cclxuXHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2IsICd2YWx1ZScsIHtcclxuXHRcdFx0Z2V0IDogZ2V0TGF5ZXJBcGlcclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gb2I7XHJcblx0fVxyXG5cclxuXHRcclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHZhciBjb21wb3NpdGlvbkxheWVycyA9IGVsZW1lbnQubGF5ZXJzLm1hcChidWlsZExheWVyQXBpKVxyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdUaW1lIFJlbWFwJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFRpbWVSZW1hcFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XS5jb25jYXQoY29tcG9zaXRpb25MYXllcnMpXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBLZXlQYXRoTGlzdChzdGF0ZS5lbGVtZW50cywgJ2xheWVyJyksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0aW9uOyIsInZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBFZmZlY3RFbGVtZW50KGVmZmVjdCwgcGFyZW50KSB7XHJcblxyXG5cdHJldHVybiBQcm9wZXJ0eShlZmZlY3QucCwgcGFyZW50KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFZmZlY3RFbGVtZW50OyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcbnZhciBFZmZlY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9FZmZlY3RFbGVtZW50Jyk7XHJcblxyXG5mdW5jdGlvbiBFZmZlY3RzKGVmZmVjdHMsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IGJ1aWxkUHJvcGVydGllcygpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRWYWx1ZShlZmZlY3REYXRhLCBpbmRleCkge1xyXG5cdFx0dmFyIG5tID0gZWZmZWN0RGF0YS5kYXRhID8gZWZmZWN0RGF0YS5kYXRhLm5tIDogaW5kZXgudG9TdHJpbmcoKTtcclxuXHRcdHZhciBlZmZlY3RFbGVtZW50ID0gZWZmZWN0RGF0YS5kYXRhID8gRWZmZWN0cyhlZmZlY3REYXRhLmVmZmVjdEVsZW1lbnRzLCBwYXJlbnQpIDogUHJvcGVydHkoZWZmZWN0RGF0YS5wLCBwYXJlbnQpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZTogbm0sXHJcblx0XHRcdHZhbHVlOiBlZmZlY3RFbGVtZW50XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZFByb3BlcnRpZXMoKSB7XHJcblx0XHR2YXIgaSwgbGVuID0gZWZmZWN0cy5sZW5ndGg7XHJcblx0XHR2YXIgYXJyID0gW107XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0YXJyLnB1c2goZ2V0VmFsdWUoZWZmZWN0c1tpXSwgaSkpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFycjtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFZmZlY3RzOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIEltYWdlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJCYXNlKGVsZW1lbnQpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZTsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBOdWxsRWxlbWVudChlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE51bGxFbGVtZW50OyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxudmFyIFNoYXBlQ29udGVudHMgPSByZXF1aXJlKCcuL1NoYXBlQ29udGVudHMnKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBbXSxcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0ZWxlbWVudDogZWxlbWVudFxyXG5cdH1cclxuXHR2YXIgc2hhcGVDb250ZW50cyA9IFNoYXBlQ29udGVudHMoZWxlbWVudC5kYXRhLnNoYXBlcywgZWxlbWVudC5pdGVtc0RhdGEsIHN0YXRlKTtcclxuXHJcblx0XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0c3RhdGUucHJvcGVydGllcy5wdXNoKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0NvbnRlbnRzJyxcclxuXHRcdFx0XHR2YWx1ZTogc2hhcGVDb250ZW50c1xyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdF9idWlsZFByb3BlcnR5TWFwKCk7XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlLCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG52YXIgU2hhcGVSZWN0YW5nbGUgPSByZXF1aXJlKCcuL1NoYXBlUmVjdGFuZ2xlJyk7XHJcbnZhciBTaGFwZUZpbGwgPSByZXF1aXJlKCcuL1NoYXBlRmlsbCcpO1xyXG52YXIgU2hhcGVTdHJva2UgPSByZXF1aXJlKCcuL1NoYXBlU3Ryb2tlJyk7XHJcbnZhciBTaGFwZUVsbGlwc2UgPSByZXF1aXJlKCcuL1NoYXBlRWxsaXBzZScpO1xyXG52YXIgU2hhcGVHcmFkaWVudEZpbGwgPSByZXF1aXJlKCcuL1NoYXBlR3JhZGllbnRGaWxsJyk7XHJcbnZhciBTaGFwZUdyYWRpZW50U3Ryb2tlID0gcmVxdWlyZSgnLi9TaGFwZUdyYWRpZW50U3Ryb2tlJyk7XHJcbnZhciBTaGFwZVRyaW1QYXRocyA9IHJlcXVpcmUoJy4vU2hhcGVUcmltUGF0aHMnKTtcclxudmFyIFNoYXBlUmVwZWF0ZXIgPSByZXF1aXJlKCcuL1NoYXBlUmVwZWF0ZXInKTtcclxudmFyIFNoYXBlUG9seXN0YXIgPSByZXF1aXJlKCcuL1NoYXBlUG9seXN0YXInKTtcclxudmFyIFNoYXBlUm91bmRDb3JuZXJzID0gcmVxdWlyZSgnLi9TaGFwZVJvdW5kQ29ybmVycycpO1xyXG52YXIgU2hhcGVQYXRoID0gcmVxdWlyZSgnLi9TaGFwZVBhdGgnKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybS9UcmFuc2Zvcm0nKTtcclxudmFyIE1hdHJpeCA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvdHJhbnNmb3JtYXRpb25NYXRyaXgnKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlQ29udGVudHMoc2hhcGVzRGF0YSwgc2hhcGVzLCBwYXJlbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpLFxyXG5cdFx0cGFyZW50OiBwYXJlbnRcclxuXHR9XHJcblxyXG5cdHZhciBjYWNoZWRTaGFwZVByb3BlcnRpZXMgPSBbXTtcclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpIHtcclxuXHRcdHZhciBvYiA9IHtcclxuXHRcdFx0bmFtZTogc2hhcGUubm1cclxuXHRcdH1cclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYiwgJ3ZhbHVlJywge1xyXG5cdFx0ICAgZ2V0KCkge1xyXG5cdFx0ICAgXHRpZihjYWNoZWRTaGFwZVByb3BlcnRpZXNbaW5kZXhdKSB7XHJcblx0XHQgICBcdFx0cmV0dXJuIGNhY2hlZFNoYXBlUHJvcGVydGllc1tpbmRleF07XHJcblx0XHQgICBcdH0gZWxzZSB7XHJcblx0XHQgICBcdFx0dmFyIHByb3BlcnR5O1xyXG5cdFx0ICAgXHR9XHJcblx0ICAgXHRcdGlmKHNoYXBlLnR5ID09PSAnZ3InKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZUNvbnRlbnRzKHNoYXBlc0RhdGFbaW5kZXhdLml0LCBzaGFwZXNbaW5kZXhdLml0LCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3JjJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVSZWN0YW5nbGUoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdlbCcpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlRWxsaXBzZShzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2ZsJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVGaWxsKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnc3QnKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVN0cm9rZShzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2dmJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVHcmFkaWVudEZpbGwoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdncycpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlR3JhZGllbnRTdHJva2Uoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICd0bScpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlVHJpbVBhdGhzKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAncnAnKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVJlcGVhdGVyKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnc3InKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVBvbHlzdGFyKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAncmQnKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVJvdW5kQ29ybmVycyhzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3NoJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVQYXRoKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAndHInKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBUcmFuc2Zvcm0oc2hhcGVzW2luZGV4XS50cmFuc2Zvcm0ubVByb3BzLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSB7XHJcblx0ICAgXHRcdFx0Y29uc29sZS5sb2coc2hhcGUudHkpO1xyXG5cdCAgIFx0XHR9XHJcblx0ICAgXHRcdGNhY2hlZFNoYXBlUHJvcGVydGllc1tpbmRleF0gPSBwcm9wZXJ0eTtcclxuXHQgICBcdFx0cmV0dXJuIHByb3BlcnR5O1xyXG5cdFx0ICAgfVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb2JcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIHNoYXBlc0RhdGEubWFwKGZ1bmN0aW9uKHNoYXBlLCBpbmRleCkge1xyXG5cdFx0XHRyZXR1cm4gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkge1xyXG5cdFx0aWYoc3RhdGUuaGFzUHJvcGVydHkoJ1RyYW5zZm9ybScpKSB7XHJcbiAgICBcdFx0dmFyIHRvV29ybGRNYXQgPSBNYXRyaXgoKTtcclxuICAgICAgICBcdHZhciB0cmFuc2Zvcm1NYXQgPSBzdGF0ZS5nZXRQcm9wZXJ0eSgnVHJhbnNmb3JtJykuZ2V0VGFyZ2V0VHJhbnNmb3JtKCk7XHJcblx0XHRcdHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIFx0cG9pbnQgPSB0b1dvcmxkTWF0LmFwcGx5VG9Qb2ludEFycmF5KHBvaW50WzBdLHBvaW50WzFdLHBvaW50WzJdfHwwKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBzdGF0ZS5wYXJlbnQuZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHBvaW50ID0gc3RhdGUucGFyZW50LnRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xyXG5cdFx0aWYoc3RhdGUuaGFzUHJvcGVydHkoJ1RyYW5zZm9ybScpKSB7XHJcbiAgICBcdFx0dmFyIHRvV29ybGRNYXQgPSBNYXRyaXgoKTtcclxuICAgICAgICBcdHZhciB0cmFuc2Zvcm1NYXQgPSBzdGF0ZS5nZXRQcm9wZXJ0eSgnVHJhbnNmb3JtJykuZ2V0VGFyZ2V0VHJhbnNmb3JtKCk7XHJcblx0XHRcdHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIFx0cG9pbnQgPSB0b1dvcmxkTWF0LmludmVyc2VQb2ludChwb2ludCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcG9pbnQ7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGZyb21LZXlwYXRoTGF5ZXJQb2ludDogZnJvbUtleXBhdGhMYXllclBvaW50LFxyXG5cdFx0dG9LZXlwYXRoTGF5ZXJQb2ludDogdG9LZXlwYXRoTGF5ZXJQb2ludFxyXG5cdH1cclxuXHJcblx0Ly9zdGF0ZS5wcm9wZXJ0aWVzID0gX2J1aWxkUHJvcGVydHlNYXAoKTtcclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUsIEtleVBhdGhOb2RlKHN0YXRlKSwgbWV0aG9kcylcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUNvbnRlbnRzOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUVsbGlwc2UoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1NpemUnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2gucCwgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVFbGxpcHNlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUZpbGwoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0NvbG9yJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5jLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUZpbGw7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlR3JhZGllbnRGaWxsKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdGFydCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgTGVuZ3RoJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5oLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IEFuZ2xlJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5hLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQ29sb3JzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5nLnByb3AsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlR3JhZGllbnRGaWxsOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUdyYWRpZW50U3Ryb2tlKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdGFydCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuZSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgTGVuZ3RoJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5oLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IEFuZ2xlJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5hLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQ29sb3JzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5nLnByb3AsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdHJva2UgV2lkdGgnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LncsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlR3JhZGllbnRTdHJva2U7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUGF0aChlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQYXRoKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAncGF0aCcsXHJcblx0XHRcdFx0dmFsdWU6UHJvcGVydHkoZWxlbWVudC5zaCwgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVQYXRoOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVBvbHlzdGFyKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb2ludHMnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnB0LCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnAsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2guciwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0lubmVyIFJhZGl1cycsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2guaXIsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPdXRlciBSYWRpdXMnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLm9yLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSW5uZXIgUm91bmRuZXNzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5pcywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ091dGVyIFJvdW5kbmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2gub3MsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUG9seXN0YXI7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUmVjdGFuZ2xlKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTaXplJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5zLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnAsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3VuZG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnIsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUmVjdGFuZ2xlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuLi90cmFuc2Zvcm0vVHJhbnNmb3JtJyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVJlcGVhdGVyKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdDb3BpZXMnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LmMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPZmZzZXQnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdUcmFuc2Zvcm0nLFxyXG5cdFx0XHRcdHZhbHVlOiBUcmFuc2Zvcm0oZWxlbWVudC50ciwgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVSZXBlYXRlcjsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVSb3VuZENvcm5lcnMoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JhZGl1cycsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucmQsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUm91bmRDb3JuZXJzOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVN0cm9rZShlbGVtZW50LCBwYXJlbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdjb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3N0cm9rZSB3aWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQudywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ29wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlU3Ryb2tlIiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlVHJpbVBhdGhzKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdGFydCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuZSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09mZnNldCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQubywgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVUcmltUGF0aHM7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG5cclxuZnVuY3Rpb24gU29saWQoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNvbGlkOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcbnZhciBUZXh0QW5pbWF0b3IgPSByZXF1aXJlKCcuL1RleHRBbmltYXRvcicpO1xyXG5cclxuZnVuY3Rpb24gVGV4dChlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge31cclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RG9jdW1lbnREYXRhKF9mdW5jdGlvbikge1xyXG5cdFx0dmFyIHByZXZpb3VzVmFsdWU7XHJcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIG5ld1ZhbHVlID0gX2Z1bmN0aW9uKGVsZW1lbnQudGV4dFByb3BlcnR5LmN1cnJlbnREYXRhKTtcclxuXHRcdFx0aWYgKHByZXZpb3VzVmFsdWUgIT09IG5ld1ZhbHVlKSB7XHJcblx0XHRcdFx0ZWxlbWVudC51cGRhdGVEb2N1bWVudERhdGEobmV3VmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdH0sIDUwMClcclxuXHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRBbmltYXRvcnMoKSB7XHJcblx0XHR2YXIgYW5pbWF0b3JQcm9wZXJ0aWVzID0gW107XHJcblx0XHR2YXIgYW5pbWF0b3JzID0gZWxlbWVudC50ZXh0QW5pbWF0b3IuX2FuaW1hdG9yc0RhdGE7XHJcblx0XHR2YXIgaSwgbGVuID0gYW5pbWF0b3JzLmxlbmd0aDtcclxuXHRcdHZhciB0ZXh0QW5pbWF0b3I7XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0dGV4dEFuaW1hdG9yID0gVGV4dEFuaW1hdG9yKGFuaW1hdG9yc1tpXSlcclxuXHRcdFx0YW5pbWF0b3JQcm9wZXJ0aWVzLnB1c2goe1xyXG5cdFx0XHRcdG5hbWU6IGVsZW1lbnQudGV4dEFuaW1hdG9yLl90ZXh0RGF0YS5hW2ldLm5tIHx8ICdBbmltYXRvciAnICsgKGkrMSksIC8vRmFsbGJhY2sgZm9yIG9sZCBhbmltYXRpb25zXHJcblx0XHRcdFx0dmFsdWU6IHRleHRBbmltYXRvclxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFuaW1hdG9yUHJvcGVydGllcztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NvdXJjZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXREb2N1bWVudERhdGFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF0uY29uY2F0KGFkZEFuaW1hdG9ycygpKVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgbWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gVGV4dEFuaW1hdG9yKGFuaW1hdG9yKSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEFuY2hvclBvaW50KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxCcmlnaHRuZXNzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZiKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRGaWxsQ29sb3IodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZmMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxIdWUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZmgpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxTYXR1cmF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZzKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRGaWxsT3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5mbykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5yKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvblgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucngpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJvdGF0aW9uWSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5yeSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2NhbGUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2tld0F4aXModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc2EpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZUNvbG9yKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNjKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTa2V3KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNrKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNvKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VXaWR0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zdykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlQnJpZ2h0bmVzcyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zYikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlSHVlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNoKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VTYXR1cmF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNzKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRUcmFja2luZ0Ftb3VudCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS50KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidBbmNob3IgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0QW5jaG9yUG9pbnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIEJyaWdodG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbEJyaWdodG5lc3NcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIENvbG9yJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J0ZpbGwgSHVlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxIdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIFNhdHVyYXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbFNhdHVyYXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIE9wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1JvdGF0aW9uIFgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Um90YXRpb25YXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonUm90YXRpb24gWScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSb3RhdGlvbllcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTY2FsZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTY2FsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NrZXcgQXhpcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTa2V3QXhpc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBDb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NrZXcnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2tld1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBXaWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VXaWR0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1RyYWNraW5nIEFtb3VudCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRUcmFja2luZ0Ftb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZU9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTdHJva2UgQnJpZ2h0bmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VCcmlnaHRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU3Ryb2tlIFNhdHVyYXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlU2F0dXJhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBIdWUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlSHVlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRBbmltYXRvcjsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBUZXh0ID0gcmVxdWlyZSgnLi9UZXh0Jyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0RWxlbWVudChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgVGV4dFByb3BlcnR5ID0gVGV4dChlbGVtZW50KTtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3RleHQnLFxyXG5cdFx0XHRcdHZhbHVlOiBUZXh0UHJvcGVydHlcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdUZXh0JyxcclxuXHRcdFx0XHR2YWx1ZTogVGV4dFByb3BlcnR5XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRleHQoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC50ZXh0UHJvcGVydHkuY3VycmVudERhdGEudDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFRleHQodmFsdWUsIGluZGV4KSB7XHJcblx0XHRzZXREb2N1bWVudERhdGEoe3Q6IHZhbHVlfSwgaW5kZXgpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RG9jdW1lbnREYXRhKGRhdGEsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC51cGRhdGVEb2N1bWVudERhdGEoZGF0YSwgaW5kZXgpO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBjYW5SZXNpemVGb250KF9jYW5SZXNpemUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmNhblJlc2l6ZUZvbnQoX2NhblJlc2l6ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5zZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGV4dDogZ2V0VGV4dCxcclxuXHRcdHNldFRleHQ6IHNldFRleHQsXHJcblx0XHRjYW5SZXNpemVGb250OiBjYW5SZXNpemVGb250LFxyXG5cdFx0c2V0RG9jdW1lbnREYXRhOiBzZXREb2N1bWVudERhdGEsXHJcblx0XHRzZXRNaW5pbXVtRm9udFNpemU6IHNldE1pbmltdW1Gb250U2l6ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0RWxlbWVudDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gVHJhbnNmb3JtKHByb3BzLCBwYXJlbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQW5jaG9yIFBvaW50JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMuYSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1BvaW50IG9mIEludGVyZXN0JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMuYSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1NjYWxlJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMuciwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5weCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5weSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5weiwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5yeCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5yeSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5yeiwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5wbywgcGFyZW50KVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRUYXJnZXRUcmFuc2Zvcm0oKSB7XHJcblx0XHRyZXR1cm4gcHJvcHM7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldFRhcmdldFRyYW5zZm9ybTogZ2V0VGFyZ2V0VHJhbnNmb3JtXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG5cclxuZnVuY3Rpb24gUHJvcGVydHkocHJvcGVydHksIHBhcmVudCkge1xyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnR5OiBwcm9wZXJ0eSxcclxuXHRcdHBhcmVudDogcGFyZW50XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlKSB7XHJcblx0XHR2YXIgcHJvcGVydHkgPSBzdGF0ZS5wcm9wZXJ0eTtcclxuXHRcdGlmKCFwcm9wZXJ0eSB8fCAhcHJvcGVydHkuYWRkRWZmZWN0KSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0cHJvcGVydHkuYWRkRWZmZWN0KHZhbHVlKTtcclxuXHRcdH0gZWxzZSBpZiAocHJvcGVydHkucHJvcFR5cGUgPT09ICdtdWx0aWRpbWVuc2lvbmFsJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRwcm9wZXJ0eS5hZGRFZmZlY3QoZnVuY3Rpb24oKXtyZXR1cm4gdmFsdWV9KTtcclxuXHRcdH0gZWxzZSBpZiAocHJvcGVydHkucHJvcFR5cGUgPT09ICd1bmlkaW1lbnNpb25hbCcgJiYgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHRwcm9wZXJ0eS5hZGRFZmZlY3QoZnVuY3Rpb24oKXtyZXR1cm4gdmFsdWV9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFZhbHVlKCkge1xyXG5cdFx0cmV0dXJuIHByb3BlcnR5LnY7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdHNldFZhbHVlOiBzZXRWYWx1ZSxcclxuXHRcdGdldFZhbHVlOiBnZXRWYWx1ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUsIG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJvcGVydHk7IiwidmFyIExheWVyTGlzdCA9IHJlcXVpcmUoJy4uL2xheWVyL0xheWVyTGlzdCcpO1xyXG52YXIgS2V5UGF0aExpc3QgPSByZXF1aXJlKCcuLi9rZXlfcGF0aC9LZXlQYXRoTGlzdCcpO1xyXG5cclxuZnVuY3Rpb24gUmVuZGVyZXIoc3RhdGUpIHtcclxuXHJcblx0c3RhdGUuX3R5cGUgPSAncmVuZGVyZXInO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRSZW5kZXJlclR5cGUoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuYW5pbWF0aW9uLmFuaW1UeXBlO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe1xyXG5cdFx0Z2V0UmVuZGVyZXJUeXBlOiBnZXRSZW5kZXJlclR5cGVcclxuXHR9LCBMYXllckxpc3Qoc3RhdGUuZWxlbWVudHMpLCBLZXlQYXRoTGlzdChzdGF0ZS5lbGVtZW50cywgJ3JlbmRlcmVyJykpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlbmRlcmVyOyJdfQ==
