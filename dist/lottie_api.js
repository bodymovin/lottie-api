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
},{"../helpers/layerAPIBuilder":6,"../renderer/Renderer":42}],2:[function(require,module,exports){
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
},{"../layer/LayerBase":13,"../layer/camera/Camera":15,"../layer/composition/Composition":16,"../layer/image/ImageElement":20,"../layer/null_element/NullElement":21,"../layer/shape/Shape":22,"../layer/solid/SolidElement":35,"../layer/text/TextElement":38}],7:[function(require,module,exports){
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
	return methods;
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
},{"../helpers/transformationMatrix":8,"../key_path/KeyPathNode":12,"./effects/Effects":19,"./transform/Transform":39}],14:[function(require,module,exports){
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
			},
			{
				name: 'Orientation',
				value: Property(element.or, parent)
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],16:[function(require,module,exports){
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
				value: TimeRemap(element.tm)
			}
		].concat(compositionLayers)
	}

	var methods = {
	}

	return Object.assign(instance, LayerBase(state), KeyPathList(state.elements, 'layer'), methods);
}

module.exports = Composition;
},{"../../helpers/layerAPIBuilder":6,"../../key_path/KeyPathList":11,"../../property/Property":40,"../LayerBase":13,"./TimeRemap":17}],17:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var ValueProperty = require('../../property/ValueProperty');

function TimeRemap(property, parent) {
	var state = {
		property: property,
		parent: parent
	}

	var _isCallbackAdded = false;
	var currentSegmentInit = 0;
	var currentSegmentEnd = 0;
	var previousTime = 0, currentTime = 0;
	var initTime = 0;
	var _loop = true;
	var _loopCount = 0;
	var _speed = 1;
	var _paused = false;
	var _isDebugging = false;
	var queuedSegments = [];

	function playSegment(init, end, clear) {
		_paused = false;
		if(clear) {
			clearQueue();
			currentTime = init;
		}
		if(_isDebugging) {
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
		if(currentSegmentInit === currentSegmentEnd) {
			currentTime = currentSegmentInit;
		} else if(!_paused) {
			var nowTime = Date.now();
			var elapsedTime = _speed * (nowTime - previousTime) / 1000;
			previousTime = nowTime;
			if(currentSegmentInit < currentSegmentEnd) {
				currentTime += elapsedTime;
				if(currentTime > currentSegmentEnd) {
					_loopCount += 1;
					if(queuedSegments.length) {
						playQueuedSegment();
					} else if(!_loop) {
						currentTime = currentSegmentEnd;
					} else {
						currentTime = currentSegmentInit + (currentTime - currentSegmentEnd);
					}
				}
			} else {
				currentTime -= elapsedTime;
				if(currentTime < currentSegmentEnd) {
					_loopCount += 1;
					if(queuedSegments.length) {
						playQueuedSegment();
					} else if(!_loop) {
						currentTime = currentSegmentEnd;
					} else {
						currentTime = currentSegmentInit - (currentSegmentEnd - currentTime);
					}
				}
			}
			if(_isDebugging) {
				console.log(currentTime)
			}
		}
		return currentTime;
	}

	function addCallback() {
		if(!_isCallbackAdded) {
			_isCallbackAdded = true;
			instance.setValue(_segmentPlayer, _isDebugging)
		}
	}

	function playTo(end, clear) {
		_paused = false;
		if(clear) {
			clearQueue();
		}
		addCallback();
		currentSegmentEnd = end;
	}

	function getCurrentTime() {
		if(_isCallbackAdded) {
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

	var methods = {
		playSegment: playSegment,
		playTo: playTo,
		queueSegment: queueSegment,
		clearQueue: clearQueue,
		setLoop: setLoop,
		setSpeed: setSpeed,
		pause: pause,
		setDebugging: setDebugging,
		getCurrentTime: getCurrentTime
	}

	var instance = {}

	return Object.assign(instance, methods, ValueProperty(state), KeyPathNode(state));
}

module.exports = TimeRemap;
},{"../../key_path/KeyPathNode":12,"../../property/ValueProperty":41}],18:[function(require,module,exports){
var Property = require('../../property/Property');

function EffectElement(effect, parent) {

	return Property(effect.p, parent);
}

module.exports = EffectElement;
},{"../../property/Property":40}],19:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40,"./EffectElement":18}],20:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Image(element) {

	var methods = {
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = Image;
},{"../LayerBase":13}],21:[function(require,module,exports){
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
},{"../LayerBase":13}],22:[function(require,module,exports){
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
},{"../LayerBase":13,"./ShapeContents":23}],23:[function(require,module,exports){
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
},{"../../helpers/transformationMatrix":8,"../../key_path/KeyPathNode":12,"../../property/Property":40,"../transform/Transform":39,"./ShapeEllipse":24,"./ShapeFill":25,"./ShapeGradientFill":26,"./ShapeGradientStroke":27,"./ShapePath":28,"./ShapePolystar":29,"./ShapeRectangle":30,"./ShapeRepeater":31,"./ShapeRoundCorners":32,"./ShapeStroke":33,"./ShapeTrimPaths":34}],24:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],25:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],26:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],27:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],28:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],29:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],30:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],31:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40,"../transform/Transform":39}],32:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],33:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],34:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],35:[function(require,module,exports){
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
},{"../LayerBase":13}],36:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40,"./TextAnimator":37}],37:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],38:[function(require,module,exports){
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
},{"../LayerBase":13,"./Text":36}],39:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],40:[function(require,module,exports){
var KeyPathNode = require('../key_path/KeyPathNode');
var ValueProperty = require('./ValueProperty');

function Property(property, parent) {
	var state = {
		property: property,
		parent: parent
	}

	var methods = {}

	return Object.assign({}, methods, ValueProperty(state), KeyPathNode(state));
}

module.exports = Property;
},{"../key_path/KeyPathNode":12,"./ValueProperty":41}],41:[function(require,module,exports){
function ValueProperty(state) {
	
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
		return state.property.v;
	}

	var methods = {
		setValue: setValue,
		getValue: getValue
	}

	return methods;
}

module.exports = ValueProperty;
},{}],42:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0uanMiLCJzcmMvZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yLmpzIiwic3JjL2VudW1zL2xheWVyX3R5cGVzLmpzIiwic3JjL2VudW1zL3Byb3BlcnR5X25hbWVzLmpzIiwic3JjL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9sYXllckFQSUJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9zdHJpbmdTYW5pdGl6ZXIuanMiLCJzcmMvaGVscGVycy90cmFuc2Zvcm1hdGlvbk1hdHJpeC5qcyIsInNyYy9oZWxwZXJzL3R5cGVkQXJyYXlzLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhMaXN0LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhOb2RlLmpzIiwic3JjL2xheWVyL0xheWVyQmFzZS5qcyIsInNyYy9sYXllci9MYXllckxpc3QuanMiLCJzcmMvbGF5ZXIvY2FtZXJhL0NhbWVyYS5qcyIsInNyYy9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbi5qcyIsInNyYy9sYXllci9jb21wb3NpdGlvbi9UaW1lUmVtYXAuanMiLCJzcmMvbGF5ZXIvZWZmZWN0cy9FZmZlY3RFbGVtZW50LmpzIiwic3JjL2xheWVyL2VmZmVjdHMvRWZmZWN0cy5qcyIsInNyYy9sYXllci9pbWFnZS9JbWFnZUVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvbnVsbF9lbGVtZW50L051bGxFbGVtZW50LmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlQ29udGVudHMuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVFbGxpcHNlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlRmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50RmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50U3Ryb2tlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUGF0aC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVBvbHlzdGFyLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUmVjdGFuZ2xlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUmVwZWF0ZXIuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVSb3VuZENvcm5lcnMuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVTdHJva2UuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVUcmltUGF0aHMuanMiLCJzcmMvbGF5ZXIvc29saWQvU29saWRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RleHQvVGV4dC5qcyIsInNyYy9sYXllci90ZXh0L1RleHRBbmltYXRvci5qcyIsInNyYy9sYXllci90ZXh0L1RleHRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RyYW5zZm9ybS9UcmFuc2Zvcm0uanMiLCJzcmMvcHJvcGVydHkvUHJvcGVydHkuanMiLCJzcmMvcHJvcGVydHkvVmFsdWVQcm9wZXJ0eS5qcyIsInNyYy9yZW5kZXJlci9SZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlbmRlcmVyID0gcmVxdWlyZSgnLi4vcmVuZGVyZXIvUmVuZGVyZXInKTtcclxudmFyIGxheWVyX2FwaSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5ZXJBUElCdWlsZGVyJyk7XHJcblxyXG5mdW5jdGlvbiBBbmltYXRpb25JdGVtRmFjdG9yeShhbmltYXRpb24pIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0YW5pbWF0aW9uOiBhbmltYXRpb24sXHJcblx0XHRlbGVtZW50czogYW5pbWF0aW9uLnJlbmRlcmVyLmVsZW1lbnRzLm1hcCgoaXRlbSkgPT4gbGF5ZXJfYXBpKGl0ZW0sIGFuaW1hdGlvbikpLFxyXG5cdFx0Ym91bmRpbmdSZWN0OiBudWxsLFxyXG5cdFx0c2NhbGVEYXRhOiBudWxsXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRDdXJyZW50RnJhbWUoKSB7XHJcblx0XHRyZXR1cm4gYW5pbWF0aW9uLmN1cnJlbnRGcmFtZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCkge1xyXG5cdFx0cmV0dXJuIGFuaW1hdGlvbi5jdXJyZW50RnJhbWUgLyBhbmltYXRpb24uZnJhbWVSYXRlO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkVmFsdWVDYWxsYmFjayhwcm9wZXJ0aWVzLCB2YWx1ZSkge1xyXG5cdFx0dmFyIGksIGxlbiA9IHByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdHByb3BlcnRpZXMuZ2V0UHJvcGVydHlBdEluZGV4KGkpLnNldFZhbHVlKHZhbHVlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHRvS2V5cGF0aExheWVyUG9pbnQocHJvcGVydGllcywgcG9pbnQpIHtcclxuXHRcdHZhciBpLCBsZW4gPSBwcm9wZXJ0aWVzLmxlbmd0aDtcclxuXHRcdHZhciBwb2ludHMgPSBbXTtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xyXG5cdFx0XHRwb2ludHMucHVzaChwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS50b0tleXBhdGhMYXllclBvaW50KHBvaW50KSk7XHJcblx0XHR9XHJcblx0XHRpZihwb2ludHMubGVuZ3RoID09PSAxKSB7XHJcblx0XHRcdHJldHVybiBwb2ludHNbMF07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcG9pbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZnJvbUtleXBhdGhMYXllclBvaW50KHByb3BlcnRpZXMsIHBvaW50KSB7XHJcblx0XHR2YXIgaSwgbGVuID0gcHJvcGVydGllcy5sZW5ndGg7XHJcblx0XHR2YXIgcG9pbnRzID0gW107XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0cG9pbnRzLnB1c2gocHJvcGVydGllcy5nZXRQcm9wZXJ0eUF0SW5kZXgoaSkuZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KSk7XHJcblx0XHR9XHJcblx0XHRpZihwb2ludHMubGVuZ3RoID09PSAxKSB7XHJcblx0XHRcdHJldHVybiBwb2ludHNbMF07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcG9pbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2FsY3VsYXRlU2NhbGVEYXRhKGJvdW5kaW5nUmVjdCkge1xyXG5cdFx0dmFyIGNvbXBXaWR0aCA9IGFuaW1hdGlvbi5hbmltYXRpb25EYXRhLnc7XHJcbiAgICAgICAgdmFyIGNvbXBIZWlnaHQgPSBhbmltYXRpb24uYW5pbWF0aW9uRGF0YS5oO1xyXG5cdFx0dmFyIGNvbXBSZWwgPSBjb21wV2lkdGggLyBjb21wSGVpZ2h0O1xyXG4gICAgICAgIHZhciBlbGVtZW50V2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xyXG4gICAgICAgIHZhciBlbGVtZW50UmVsID0gZWxlbWVudFdpZHRoIC8gZWxlbWVudEhlaWdodDtcclxuICAgICAgICB2YXIgc2NhbGUsc2NhbGVYT2Zmc2V0LHNjYWxlWU9mZnNldDtcclxuICAgICAgICB2YXIgeEFsaWdubWVudCwgeUFsaWdubWVudCwgc2NhbGVNb2RlO1xyXG4gICAgICAgIHZhciBhc3BlY3RSYXRpbyA9IGFuaW1hdGlvbi5yZW5kZXJlci5yZW5kZXJDb25maWcucHJlc2VydmVBc3BlY3RSYXRpby5zcGxpdCgnICcpO1xyXG4gICAgICAgIGlmKGFzcGVjdFJhdGlvWzFdID09PSAnbWVldCcpIHtcclxuICAgICAgICBcdHNjYWxlID0gZWxlbWVudFJlbCA+IGNvbXBSZWwgPyBlbGVtZW50SGVpZ2h0IC8gY29tcEhlaWdodCA6IGVsZW1lbnRXaWR0aCAvIGNvbXBXaWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFx0c2NhbGUgPSBlbGVtZW50UmVsID4gY29tcFJlbCA/IGVsZW1lbnRXaWR0aCAvIGNvbXBXaWR0aCA6IGVsZW1lbnRIZWlnaHQgLyBjb21wSGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB4QWxpZ25tZW50ID0gYXNwZWN0UmF0aW9bMF0uc3Vic3RyKDAsNCk7XHJcbiAgICAgICAgeUFsaWdubWVudCA9IGFzcGVjdFJhdGlvWzBdLnN1YnN0cig0KTtcclxuICAgICAgICBpZih4QWxpZ25tZW50ID09PSAneE1pbicpIHtcclxuICAgICAgICBcdHNjYWxlWE9mZnNldCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmKHhBbGlnbm1lbnQgPT09ICd4TWlkJykge1xyXG4gICAgICAgIFx0c2NhbGVYT2Zmc2V0ID0gKGVsZW1lbnRXaWR0aCAtIGNvbXBXaWR0aCAqIHNjYWxlKSAvIDI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICBcdHNjYWxlWE9mZnNldCA9IChlbGVtZW50V2lkdGggLSBjb21wV2lkdGggKiBzY2FsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih5QWxpZ25tZW50ID09PSAnWU1pbicpIHtcclxuXHQgICAgICAgIHNjYWxlWU9mZnNldCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmKHlBbGlnbm1lbnQgPT09ICdZTWlkJykge1xyXG5cdCAgICAgICAgc2NhbGVZT2Zmc2V0ID0gKGVsZW1lbnRIZWlnaHQgLSBjb21wSGVpZ2h0ICogc2NhbGUpIC8gMjtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cdCAgICAgICAgc2NhbGVZT2Zmc2V0ID0gKGVsZW1lbnRIZWlnaHQgLSBjb21wSGVpZ2h0ICogc2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgIFx0c2NhbGVZT2Zmc2V0OiBzY2FsZVlPZmZzZXQsXHJcbiAgICAgICAgXHRzY2FsZVhPZmZzZXQ6IHNjYWxlWE9mZnNldCxcclxuICAgICAgICBcdHNjYWxlOiBzY2FsZVxyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJlY2FsY3VsYXRlU2l6ZShjb250YWluZXIpIHtcclxuXHRcdHZhciBjb250YWluZXIgPSBhbmltYXRpb24ud3JhcHBlcjtcclxuXHRcdHN0YXRlLmJvdW5kaW5nUmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdHN0YXRlLnNjYWxlRGF0YSA9IGNhbGN1bGF0ZVNjYWxlRGF0YShzdGF0ZS5ib3VuZGluZ1JlY3QpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gdG9Db250YWluZXJQb2ludChwb2ludCkge1xyXG5cdFx0aWYoIWFuaW1hdGlvbi53cmFwcGVyIHx8ICFhbmltYXRpb24ud3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcclxuXHRcdFx0cmV0dXJuIHBvaW50O1xyXG5cdFx0fVxyXG5cdFx0aWYoIXN0YXRlLmJvdW5kaW5nUmVjdCkge1xyXG5cdFx0XHRyZWNhbGN1bGF0ZVNpemUoKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYm91bmRpbmdSZWN0ID0gc3RhdGUuYm91bmRpbmdSZWN0O1xyXG5cdFx0dmFyIG5ld1BvaW50ID0gW3BvaW50WzBdIC0gYm91bmRpbmdSZWN0LmxlZnQsIHBvaW50WzFdIC0gYm91bmRpbmdSZWN0LnRvcF07XHJcblx0XHR2YXIgc2NhbGVEYXRhID0gc3RhdGUuc2NhbGVEYXRhO1xyXG5cclxuICAgICAgICBuZXdQb2ludFswXSA9IChuZXdQb2ludFswXSAtIHNjYWxlRGF0YS5zY2FsZVhPZmZzZXQpIC8gc2NhbGVEYXRhLnNjYWxlO1xyXG4gICAgICAgIG5ld1BvaW50WzFdID0gKG5ld1BvaW50WzFdIC0gc2NhbGVEYXRhLnNjYWxlWU9mZnNldCkgLyBzY2FsZURhdGEuc2NhbGU7XHJcblxyXG5cdFx0cmV0dXJuIG5ld1BvaW50O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZnJvbUNvbnRhaW5lclBvaW50KHBvaW50KSB7XHJcblx0XHRpZighYW5pbWF0aW9uLndyYXBwZXIgfHwgIWFuaW1hdGlvbi53cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCkge1xyXG5cdFx0XHRyZXR1cm4gcG9pbnQ7XHJcblx0XHR9XHJcblx0XHRpZighc3RhdGUuYm91bmRpbmdSZWN0KSB7XHJcblx0XHRcdHJlY2FsY3VsYXRlU2l6ZSgpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGJvdW5kaW5nUmVjdCA9IHN0YXRlLmJvdW5kaW5nUmVjdDtcclxuXHRcdHZhciBzY2FsZURhdGEgPSBzdGF0ZS5zY2FsZURhdGE7XHJcblxyXG5cdFx0dmFyIG5ld1BvaW50ID0gW3BvaW50WzBdICogc2NhbGVEYXRhLnNjYWxlICsgc2NhbGVEYXRhLnNjYWxlWE9mZnNldCwgcG9pbnRbMV0gKiBzY2FsZURhdGEuc2NhbGUgKyBzY2FsZURhdGEuc2NhbGVZT2Zmc2V0XTtcclxuXHJcblx0XHR2YXIgbmV3UG9pbnQgPSBbbmV3UG9pbnRbMF0gKyBib3VuZGluZ1JlY3QubGVmdCwgbmV3UG9pbnRbMV0gKyBib3VuZGluZ1JlY3QudG9wXTtcclxuXHRcdHJldHVybiBuZXdQb2ludDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFNjYWxlRGF0YSgpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5zY2FsZURhdGE7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdHJlY2FsY3VsYXRlU2l6ZTogcmVjYWxjdWxhdGVTaXplLFxyXG5cdFx0Z2V0U2NhbGVEYXRhOiBnZXRTY2FsZURhdGEsXHJcblx0XHR0b0NvbnRhaW5lclBvaW50OiB0b0NvbnRhaW5lclBvaW50LFxyXG5cdFx0ZnJvbUNvbnRhaW5lclBvaW50OiBmcm9tQ29udGFpbmVyUG9pbnQsXHJcblx0XHRnZXRDdXJyZW50RnJhbWU6IGdldEN1cnJlbnRGcmFtZSxcclxuXHRcdGdldEN1cnJlbnRUaW1lOiBnZXRDdXJyZW50VGltZSxcclxuXHRcdGFkZFZhbHVlQ2FsbGJhY2s6IGFkZFZhbHVlQ2FsbGJhY2ssXHJcblx0XHR0b0tleXBhdGhMYXllclBvaW50OiB0b0tleXBhdGhMYXllclBvaW50LFxyXG5cdFx0ZnJvbUtleXBhdGhMYXllclBvaW50OiBmcm9tS2V5cGF0aExheWVyUG9pbnRcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBSZW5kZXJlcihzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbkl0ZW1GYWN0b3J5OyIsIm1vZHVsZS5leHBvcnRzID0gJywnOyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdCAwOiAwLFxyXG5cdCAxOiAxLFxyXG5cdCAyOiAyLFxyXG5cdCAzOiAzLFxyXG5cdCA0OiA0LFxyXG5cdCA1OiA1LFxyXG5cdCAxMzogMTMsXHJcblx0J2NvbXAnOiAwLFxyXG5cdCdjb21wb3NpdGlvbic6IDAsXHJcblx0J3NvbGlkJzogMSxcclxuXHQnaW1hZ2UnOiAyLFxyXG5cdCdudWxsJzogMyxcclxuXHQnc2hhcGUnOiA0LFxyXG5cdCd0ZXh0JzogNSxcclxuXHQnY2FtZXJhJzogMTNcclxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdExBWUVSX1RSQU5TRk9STTogJ3RyYW5zZm9ybSdcclxufSIsInZhciBrZXlfcGF0aF9zZXBhcmF0b3IgPSByZXF1aXJlKCcuLi9lbnVtcy9rZXlfcGF0aF9zZXBhcmF0b3InKTtcclxudmFyIHNhbml0aXplU3RyaW5nID0gcmVxdWlyZSgnLi9zdHJpbmdTYW5pdGl6ZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHJvcGVydHlQYXRoKSB7XHJcblx0dmFyIGtleVBhdGhTcGxpdCA9IHByb3BlcnR5UGF0aC5zcGxpdChrZXlfcGF0aF9zZXBhcmF0b3IpO1xyXG5cdHZhciBzZWxlY3RvciA9IGtleVBhdGhTcGxpdC5zaGlmdCgpO1xyXG5cdHJldHVybiB7XHJcblx0XHRzZWxlY3Rvcjogc2FuaXRpemVTdHJpbmcoc2VsZWN0b3IpLFxyXG5cdFx0cHJvcGVydHlQYXRoOiBrZXlQYXRoU3BsaXQuam9pbihrZXlfcGF0aF9zZXBhcmF0b3IpXHJcblx0fVxyXG59IiwidmFyIFRleHRFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvdGV4dC9UZXh0RWxlbWVudCcpO1xyXG52YXIgU2hhcGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvc2hhcGUvU2hhcGUnKTtcclxudmFyIE51bGxFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvbnVsbF9lbGVtZW50L051bGxFbGVtZW50Jyk7XHJcbnZhciBTb2xpZEVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9zb2xpZC9Tb2xpZEVsZW1lbnQnKTtcclxudmFyIEltYWdlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL2ltYWdlL0ltYWdlRWxlbWVudCcpO1xyXG52YXIgQ2FtZXJhRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL2NhbWVyYS9DYW1lcmEnKTtcclxudmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL2xheWVyL0xheWVyQmFzZScpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TGF5ZXJBcGkoZWxlbWVudCwgcGFyZW50KSB7XHJcblx0dmFyIGxheWVyVHlwZSA9IGVsZW1lbnQuZGF0YS50eTtcclxuXHR2YXIgQ29tcG9zaXRpb24gPSByZXF1aXJlKCcuLi9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbicpO1xyXG5cdHN3aXRjaChsYXllclR5cGUpIHtcclxuXHRcdGNhc2UgMDpcclxuXHRcdHJldHVybiBDb21wb3NpdGlvbihlbGVtZW50LCBwYXJlbnQpO1xyXG5cdFx0Y2FzZSAxOlxyXG5cdFx0cmV0dXJuIFNvbGlkRWxlbWVudChlbGVtZW50LCBwYXJlbnQpO1xyXG5cdFx0Y2FzZSAyOlxyXG5cdFx0cmV0dXJuIEltYWdlRWxlbWVudChlbGVtZW50LCBwYXJlbnQpO1xyXG5cdFx0Y2FzZSAzOlxyXG5cdFx0cmV0dXJuIE51bGxFbGVtZW50KGVsZW1lbnQsIHBhcmVudCk7XHJcblx0XHRjYXNlIDQ6XHJcblx0XHRyZXR1cm4gU2hhcGVFbGVtZW50KGVsZW1lbnQsIHBhcmVudCwgZWxlbWVudC5kYXRhLnNoYXBlcywgZWxlbWVudC5pdGVtc0RhdGEpO1xyXG5cdFx0Y2FzZSA1OlxyXG5cdFx0cmV0dXJuIFRleHRFbGVtZW50KGVsZW1lbnQsIHBhcmVudCk7XHJcblx0XHRjYXNlIDEzOlxyXG5cdFx0cmV0dXJuIENhbWVyYUVsZW1lbnQoZWxlbWVudCwgcGFyZW50KTtcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRyZXR1cm4gTGF5ZXJCYXNlKGVsZW1lbnQsIHBhcmVudCk7XHJcblx0fVxyXG59IiwiZnVuY3Rpb24gc2FuaXRpemVTdHJpbmcoc3RyaW5nKSB7XHJcblx0cmV0dXJuIHN0cmluZy50cmltKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FuaXRpemVTdHJpbmciLCJ2YXIgY3JlYXRlVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vdHlwZWRBcnJheXMnKVxyXG5cclxuLyohXHJcbiBUcmFuc2Zvcm1hdGlvbiBNYXRyaXggdjIuMFxyXG4gKGMpIEVwaXN0ZW1leCAyMDE0LTIwMTVcclxuIHd3dy5lcGlzdGVtZXguY29tXHJcbiBCeSBLZW4gRnlyc3RlbmJlcmdcclxuIENvbnRyaWJ1dGlvbnMgYnkgbGVlb25peWEuXHJcbiBMaWNlbnNlOiBNSVQsIGhlYWRlciByZXF1aXJlZC5cclxuICovXHJcblxyXG4vKipcclxuICogMkQgdHJhbnNmb3JtYXRpb24gbWF0cml4IG9iamVjdCBpbml0aWFsaXplZCB3aXRoIGlkZW50aXR5IG1hdHJpeC5cclxuICpcclxuICogVGhlIG1hdHJpeCBjYW4gc3luY2hyb25pemUgYSBjYW52YXMgY29udGV4dCBieSBzdXBwbHlpbmcgdGhlIGNvbnRleHRcclxuICogYXMgYW4gYXJndW1lbnQsIG9yIGxhdGVyIGFwcGx5IGN1cnJlbnQgYWJzb2x1dGUgdHJhbnNmb3JtIHRvIGFuXHJcbiAqIGV4aXN0aW5nIGNvbnRleHQuXHJcbiAqXHJcbiAqIEFsbCB2YWx1ZXMgYXJlIGhhbmRsZWQgYXMgZmxvYXRpbmcgcG9pbnQgdmFsdWVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gW2NvbnRleHRdIC0gT3B0aW9uYWwgY29udGV4dCB0byBzeW5jIHdpdGggTWF0cml4XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGEgLSBzY2FsZSB4XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGIgLSBzaGVhciB5XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGMgLSBzaGVhciB4XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGQgLSBzY2FsZSB5XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGUgLSB0cmFuc2xhdGUgeFxyXG4gKiBAcHJvcCB7bnVtYmVyfSBmIC0gdHJhbnNsYXRlIHlcclxuICogQHByb3Age0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRHxudWxsfSBbY29udGV4dD1udWxsXSAtIHNldCBvciBnZXQgY3VycmVudCBjYW52YXMgY29udGV4dFxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcblxyXG52YXIgTWF0cml4ID0gKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIF9jb3MgPSBNYXRoLmNvcztcclxuICAgIHZhciBfc2luID0gTWF0aC5zaW47XHJcbiAgICB2YXIgX3RhbiA9IE1hdGgudGFuO1xyXG4gICAgdmFyIF9ybmQgPSBNYXRoLnJvdW5kO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2V0KCl7XHJcbiAgICAgICAgdGhpcy5wcm9wc1swXSA9IDE7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1syXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1szXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s0XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s1XSA9IDE7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s2XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s3XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s4XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s5XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMF0gPSAxO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTFdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzEyXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxM10gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTRdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlKGFuZ2xlKSB7XHJcbiAgICAgICAgaWYoYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KG1Db3MsIC1tU2luLCAgMCwgMCwgbVNpbiwgIG1Db3MsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlWChhbmdsZSl7XHJcbiAgICAgICAgaWYoYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KDEsIDAsIDAsIDAsIDAsIG1Db3MsIC1tU2luLCAwLCAwLCBtU2luLCAgbUNvcywgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlWShhbmdsZSl7XHJcbiAgICAgICAgaWYoYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KG1Db3MsICAwLCAgbVNpbiwgMCwgMCwgMSwgMCwgMCwgLW1TaW4sICAwLCAgbUNvcywgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlWihhbmdsZSl7XHJcbiAgICAgICAgaWYoYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KG1Db3MsIC1tU2luLCAgMCwgMCwgbVNpbiwgIG1Db3MsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2hlYXIoc3gsc3kpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KDEsIHN5LCBzeCwgMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2tldyhheCwgYXkpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNoZWFyKF90YW4oYXgpLCBfdGFuKGF5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2tld0Zyb21BeGlzKGF4LCBhbmdsZSl7XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KG1Db3MsIG1TaW4sICAwLCAwLCAtbVNpbiwgIG1Db3MsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSlcclxuICAgICAgICAgICAgLl90KDEsIDAsICAwLCAwLCBfdGFuKGF4KSwgIDEsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSlcclxuICAgICAgICAgICAgLl90KG1Db3MsIC1tU2luLCAgMCwgMCwgbVNpbiwgIG1Db3MsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5fdChtQ29zLCBtU2luLCAtbVNpbiwgbUNvcywgMCwgMCkuX3QoMSwgMCwgX3RhbihheCksIDEsIDAsIDApLl90KG1Db3MsIC1tU2luLCBtU2luLCBtQ29zLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzY2FsZShzeCwgc3ksIHN6KSB7XHJcbiAgICAgICAgc3ogPSBpc05hTihzeikgPyAxIDogc3o7XHJcbiAgICAgICAgaWYoc3ggPT0gMSAmJiBzeSA9PSAxICYmIHN6ID09IDEpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Qoc3gsIDAsIDAsIDAsIDAsIHN5LCAwLCAwLCAwLCAwLCBzeiwgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0VHJhbnNmb3JtKGEsIGIsIGMsIGQsIGUsIGYsIGcsIGgsIGksIGosIGssIGwsIG0sIG4sIG8sIHApIHtcclxuICAgICAgICB0aGlzLnByb3BzWzBdID0gYTtcclxuICAgICAgICB0aGlzLnByb3BzWzFdID0gYjtcclxuICAgICAgICB0aGlzLnByb3BzWzJdID0gYztcclxuICAgICAgICB0aGlzLnByb3BzWzNdID0gZDtcclxuICAgICAgICB0aGlzLnByb3BzWzRdID0gZTtcclxuICAgICAgICB0aGlzLnByb3BzWzVdID0gZjtcclxuICAgICAgICB0aGlzLnByb3BzWzZdID0gZztcclxuICAgICAgICB0aGlzLnByb3BzWzddID0gaDtcclxuICAgICAgICB0aGlzLnByb3BzWzhdID0gaTtcclxuICAgICAgICB0aGlzLnByb3BzWzldID0gajtcclxuICAgICAgICB0aGlzLnByb3BzWzEwXSA9IGs7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMV0gPSBsO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTJdID0gbTtcclxuICAgICAgICB0aGlzLnByb3BzWzEzXSA9IG47XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxNF0gPSBvO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTVdID0gcDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUodHgsIHR5LCB0eikge1xyXG4gICAgICAgIHR6ID0gdHogfHwgMDtcclxuICAgICAgICBpZih0eCAhPT0gMCB8fCB0eSAhPT0gMCB8fCB0eiAhPT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90KDEsMCwwLDAsMCwxLDAsMCwwLDAsMSwwLHR4LHR5LHR6LDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm0oYTIsIGIyLCBjMiwgZDIsIGUyLCBmMiwgZzIsIGgyLCBpMiwgajIsIGsyLCBsMiwgbTIsIG4yLCBvMiwgcDIpIHtcclxuXHJcbiAgICAgICAgdmFyIF9wID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgaWYoYTIgPT09IDEgJiYgYjIgPT09IDAgJiYgYzIgPT09IDAgJiYgZDIgPT09IDAgJiYgZTIgPT09IDAgJiYgZjIgPT09IDEgJiYgZzIgPT09IDAgJiYgaDIgPT09IDAgJiYgaTIgPT09IDAgJiYgajIgPT09IDAgJiYgazIgPT09IDEgJiYgbDIgPT09IDApe1xyXG4gICAgICAgICAgICAvL05PVEU6IGNvbW1lbnRpbmcgdGhpcyBjb25kaXRpb24gYmVjYXVzZSBUdXJib0ZhbiBkZW9wdGltaXplcyBjb2RlIHdoZW4gcHJlc2VudFxyXG4gICAgICAgICAgICAvL2lmKG0yICE9PSAwIHx8IG4yICE9PSAwIHx8IG8yICE9PSAwKXtcclxuICAgICAgICAgICAgICAgIF9wWzEyXSA9IF9wWzEyXSAqIGEyICsgX3BbMTVdICogbTI7XHJcbiAgICAgICAgICAgICAgICBfcFsxM10gPSBfcFsxM10gKiBmMiArIF9wWzE1XSAqIG4yO1xyXG4gICAgICAgICAgICAgICAgX3BbMTRdID0gX3BbMTRdICogazIgKyBfcFsxNV0gKiBvMjtcclxuICAgICAgICAgICAgICAgIF9wWzE1XSA9IF9wWzE1XSAqIHAyO1xyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGExID0gX3BbMF07XHJcbiAgICAgICAgdmFyIGIxID0gX3BbMV07XHJcbiAgICAgICAgdmFyIGMxID0gX3BbMl07XHJcbiAgICAgICAgdmFyIGQxID0gX3BbM107XHJcbiAgICAgICAgdmFyIGUxID0gX3BbNF07XHJcbiAgICAgICAgdmFyIGYxID0gX3BbNV07XHJcbiAgICAgICAgdmFyIGcxID0gX3BbNl07XHJcbiAgICAgICAgdmFyIGgxID0gX3BbN107XHJcbiAgICAgICAgdmFyIGkxID0gX3BbOF07XHJcbiAgICAgICAgdmFyIGoxID0gX3BbOV07XHJcbiAgICAgICAgdmFyIGsxID0gX3BbMTBdO1xyXG4gICAgICAgIHZhciBsMSA9IF9wWzExXTtcclxuICAgICAgICB2YXIgbTEgPSBfcFsxMl07XHJcbiAgICAgICAgdmFyIG4xID0gX3BbMTNdO1xyXG4gICAgICAgIHZhciBvMSA9IF9wWzE0XTtcclxuICAgICAgICB2YXIgcDEgPSBfcFsxNV07XHJcblxyXG4gICAgICAgIC8qIG1hdHJpeCBvcmRlciAoY2FudmFzIGNvbXBhdGlibGUpOlxyXG4gICAgICAgICAqIGFjZVxyXG4gICAgICAgICAqIGJkZlxyXG4gICAgICAgICAqIDAwMVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF9wWzBdID0gYTEgKiBhMiArIGIxICogZTIgKyBjMSAqIGkyICsgZDEgKiBtMjtcclxuICAgICAgICBfcFsxXSA9IGExICogYjIgKyBiMSAqIGYyICsgYzEgKiBqMiArIGQxICogbjIgO1xyXG4gICAgICAgIF9wWzJdID0gYTEgKiBjMiArIGIxICogZzIgKyBjMSAqIGsyICsgZDEgKiBvMiA7XHJcbiAgICAgICAgX3BbM10gPSBhMSAqIGQyICsgYjEgKiBoMiArIGMxICogbDIgKyBkMSAqIHAyIDtcclxuXHJcbiAgICAgICAgX3BbNF0gPSBlMSAqIGEyICsgZjEgKiBlMiArIGcxICogaTIgKyBoMSAqIG0yIDtcclxuICAgICAgICBfcFs1XSA9IGUxICogYjIgKyBmMSAqIGYyICsgZzEgKiBqMiArIGgxICogbjIgO1xyXG4gICAgICAgIF9wWzZdID0gZTEgKiBjMiArIGYxICogZzIgKyBnMSAqIGsyICsgaDEgKiBvMiA7XHJcbiAgICAgICAgX3BbN10gPSBlMSAqIGQyICsgZjEgKiBoMiArIGcxICogbDIgKyBoMSAqIHAyIDtcclxuXHJcbiAgICAgICAgX3BbOF0gPSBpMSAqIGEyICsgajEgKiBlMiArIGsxICogaTIgKyBsMSAqIG0yIDtcclxuICAgICAgICBfcFs5XSA9IGkxICogYjIgKyBqMSAqIGYyICsgazEgKiBqMiArIGwxICogbjIgO1xyXG4gICAgICAgIF9wWzEwXSA9IGkxICogYzIgKyBqMSAqIGcyICsgazEgKiBrMiArIGwxICogbzIgO1xyXG4gICAgICAgIF9wWzExXSA9IGkxICogZDIgKyBqMSAqIGgyICsgazEgKiBsMiArIGwxICogcDIgO1xyXG5cclxuICAgICAgICBfcFsxMl0gPSBtMSAqIGEyICsgbjEgKiBlMiArIG8xICogaTIgKyBwMSAqIG0yIDtcclxuICAgICAgICBfcFsxM10gPSBtMSAqIGIyICsgbjEgKiBmMiArIG8xICogajIgKyBwMSAqIG4yIDtcclxuICAgICAgICBfcFsxNF0gPSBtMSAqIGMyICsgbjEgKiBnMiArIG8xICogazIgKyBwMSAqIG8yIDtcclxuICAgICAgICBfcFsxNV0gPSBtMSAqIGQyICsgbjEgKiBoMiArIG8xICogbDIgKyBwMSAqIHAyIDtcclxuXHJcbiAgICAgICAgdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXNJZGVudGl0eSgpIHtcclxuICAgICAgICBpZighdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkKXtcclxuICAgICAgICAgICAgdGhpcy5faWRlbnRpdHkgPSAhKHRoaXMucHJvcHNbMF0gIT09IDEgfHwgdGhpcy5wcm9wc1sxXSAhPT0gMCB8fCB0aGlzLnByb3BzWzJdICE9PSAwIHx8IHRoaXMucHJvcHNbM10gIT09IDAgfHwgdGhpcy5wcm9wc1s0XSAhPT0gMCB8fCB0aGlzLnByb3BzWzVdICE9PSAxIHx8IHRoaXMucHJvcHNbNl0gIT09IDAgfHwgdGhpcy5wcm9wc1s3XSAhPT0gMCB8fCB0aGlzLnByb3BzWzhdICE9PSAwIHx8IHRoaXMucHJvcHNbOV0gIT09IDAgfHwgdGhpcy5wcm9wc1sxMF0gIT09IDEgfHwgdGhpcy5wcm9wc1sxMV0gIT09IDAgfHwgdGhpcy5wcm9wc1sxMl0gIT09IDAgfHwgdGhpcy5wcm9wc1sxM10gIT09IDAgfHwgdGhpcy5wcm9wc1sxNF0gIT09IDAgfHwgdGhpcy5wcm9wc1sxNV0gIT09IDEpO1xyXG4gICAgICAgICAgICB0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5faWRlbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZXF1YWxzKG1hdHIpe1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB3aGlsZSAoaSA8IDE2KSB7XHJcbiAgICAgICAgICAgIGlmKG1hdHIucHJvcHNbaV0gIT09IHRoaXMucHJvcHNbaV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKz0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9uZShtYXRyKXtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICBmb3IoaT0wO2k8MTY7aSs9MSl7XHJcbiAgICAgICAgICAgIG1hdHIucHJvcHNbaV0gPSB0aGlzLnByb3BzW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9uZUZyb21Qcm9wcyhwcm9wcyl7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZm9yKGk9MDtpPDE2O2krPTEpe1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzW2ldID0gcHJvcHNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9Qb2ludCh4LCB5LCB6KSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IHggKiB0aGlzLnByb3BzWzBdICsgeSAqIHRoaXMucHJvcHNbNF0gKyB6ICogdGhpcy5wcm9wc1s4XSArIHRoaXMucHJvcHNbMTJdLFxyXG4gICAgICAgICAgICB5OiB4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgeiAqIHRoaXMucHJvcHNbOV0gKyB0aGlzLnByb3BzWzEzXSxcclxuICAgICAgICAgICAgejogeCAqIHRoaXMucHJvcHNbMl0gKyB5ICogdGhpcy5wcm9wc1s2XSArIHogKiB0aGlzLnByb3BzWzEwXSArIHRoaXMucHJvcHNbMTRdXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKnJldHVybiB7XHJcbiAgICAgICAgIHg6IHggKiBtZS5hICsgeSAqIG1lLmMgKyBtZS5lLFxyXG4gICAgICAgICB5OiB4ICogbWUuYiArIHkgKiBtZS5kICsgbWUuZlxyXG4gICAgICAgICB9OyovXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBhcHBseVRvWCh4LCB5LCB6KSB7XHJcbiAgICAgICAgcmV0dXJuIHggKiB0aGlzLnByb3BzWzBdICsgeSAqIHRoaXMucHJvcHNbNF0gKyB6ICogdGhpcy5wcm9wc1s4XSArIHRoaXMucHJvcHNbMTJdO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1koeCwgeSwgeikge1xyXG4gICAgICAgIHJldHVybiB4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgeiAqIHRoaXMucHJvcHNbOV0gKyB0aGlzLnByb3BzWzEzXTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9aKHgsIHksIHopIHtcclxuICAgICAgICByZXR1cm4geCAqIHRoaXMucHJvcHNbMl0gKyB5ICogdGhpcy5wcm9wc1s2XSArIHogKiB0aGlzLnByb3BzWzEwXSArIHRoaXMucHJvcHNbMTRdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGludmVyc2VQb2ludChwdCkge1xyXG4gICAgICAgIHZhciBkZXRlcm1pbmFudCA9IHRoaXMucHJvcHNbMF0gKiB0aGlzLnByb3BzWzVdIC0gdGhpcy5wcm9wc1sxXSAqIHRoaXMucHJvcHNbNF07XHJcbiAgICAgICAgdmFyIGEgPSB0aGlzLnByb3BzWzVdL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBiID0gLSB0aGlzLnByb3BzWzFdL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBjID0gLSB0aGlzLnByb3BzWzRdL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBkID0gdGhpcy5wcm9wc1swXS9kZXRlcm1pbmFudDtcclxuICAgICAgICB2YXIgZSA9ICh0aGlzLnByb3BzWzRdICogdGhpcy5wcm9wc1sxM10gLSB0aGlzLnByb3BzWzVdICogdGhpcy5wcm9wc1sxMl0pL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBmID0gLSAodGhpcy5wcm9wc1swXSAqIHRoaXMucHJvcHNbMTNdIC0gdGhpcy5wcm9wc1sxXSAqIHRoaXMucHJvcHNbMTJdKS9kZXRlcm1pbmFudDtcclxuICAgICAgICByZXR1cm4gW3B0WzBdICogYSArIHB0WzFdICogYyArIGUsIHB0WzBdICogYiArIHB0WzFdICogZCArIGYsIDBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGludmVyc2VQb2ludHMocHRzKXtcclxuICAgICAgICB2YXIgaSwgbGVuID0gcHRzLmxlbmd0aCwgcmV0UHRzID0gW107XHJcbiAgICAgICAgZm9yKGk9MDtpPGxlbjtpKz0xKXtcclxuICAgICAgICAgICAgcmV0UHRzW2ldID0gaW52ZXJzZVBvaW50KHB0c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXRQdHM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1RyaXBsZVBvaW50cyhwdDEsIHB0MiwgcHQzKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IGNyZWF0ZVR5cGVkQXJyYXkoJ2Zsb2F0MzInLCA2KTtcclxuICAgICAgICBpZih0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgICAgICBhcnJbMF0gPSBwdDFbMF07XHJcbiAgICAgICAgICAgIGFyclsxXSA9IHB0MVsxXTtcclxuICAgICAgICAgICAgYXJyWzJdID0gcHQyWzBdO1xyXG4gICAgICAgICAgICBhcnJbM10gPSBwdDJbMV07XHJcbiAgICAgICAgICAgIGFycls0XSA9IHB0M1swXTtcclxuICAgICAgICAgICAgYXJyWzVdID0gcHQzWzFdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBwMCA9IHRoaXMucHJvcHNbMF0sIHAxID0gdGhpcy5wcm9wc1sxXSwgcDQgPSB0aGlzLnByb3BzWzRdLCBwNSA9IHRoaXMucHJvcHNbNV0sIHAxMiA9IHRoaXMucHJvcHNbMTJdLCBwMTMgPSB0aGlzLnByb3BzWzEzXTtcclxuICAgICAgICAgICAgYXJyWzBdID0gcHQxWzBdICogcDAgKyBwdDFbMV0gKiBwNCArIHAxMjtcclxuICAgICAgICAgICAgYXJyWzFdID0gcHQxWzBdICogcDEgKyBwdDFbMV0gKiBwNSArIHAxMztcclxuICAgICAgICAgICAgYXJyWzJdID0gcHQyWzBdICogcDAgKyBwdDJbMV0gKiBwNCArIHAxMjtcclxuICAgICAgICAgICAgYXJyWzNdID0gcHQyWzBdICogcDEgKyBwdDJbMV0gKiBwNSArIHAxMztcclxuICAgICAgICAgICAgYXJyWzRdID0gcHQzWzBdICogcDAgKyBwdDNbMV0gKiBwNCArIHAxMjtcclxuICAgICAgICAgICAgYXJyWzVdID0gcHQzWzBdICogcDEgKyBwdDNbMV0gKiBwNSArIHAxMztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseVRvUG9pbnRBcnJheSh4LHkseil7XHJcbiAgICAgICAgdmFyIGFycjtcclxuICAgICAgICBpZih0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgICAgICBhcnIgPSBbeCx5LHpdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFyciA9IFt4ICogdGhpcy5wcm9wc1swXSArIHkgKiB0aGlzLnByb3BzWzRdICsgeiAqIHRoaXMucHJvcHNbOF0gKyB0aGlzLnByb3BzWzEyXSx4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgeiAqIHRoaXMucHJvcHNbOV0gKyB0aGlzLnByb3BzWzEzXSx4ICogdGhpcy5wcm9wc1syXSArIHkgKiB0aGlzLnByb3BzWzZdICsgeiAqIHRoaXMucHJvcHNbMTBdICsgdGhpcy5wcm9wc1sxNF1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9Qb2ludFN0cmluZ2lmaWVkKHgsIHkpIHtcclxuICAgICAgICBpZih0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geCArICcsJyArIHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoeCAqIHRoaXMucHJvcHNbMF0gKyB5ICogdGhpcy5wcm9wc1s0XSArIHRoaXMucHJvcHNbMTJdKSsnLCcrKHggKiB0aGlzLnByb3BzWzFdICsgeSAqIHRoaXMucHJvcHNbNV0gKyB0aGlzLnByb3BzWzEzXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9DU1MoKSB7XHJcbiAgICAgICAgLy9Eb2Vzbid0IG1ha2UgbXVjaCBzZW5zZSB0byBhZGQgdGhpcyBvcHRpbWl6YXRpb24uIElmIGl0IGlzIGFuIGlkZW50aXR5IG1hdHJpeCwgaXQncyB2ZXJ5IGxpa2VseSB0aGlzIHdpbGwgZ2V0IGNhbGxlZCBvbmx5IG9uY2Ugc2luY2UgaXQgd29uJ3QgYmUga2V5ZnJhbWVkLlxyXG4gICAgICAgIC8qaWYodGhpcy5pc0lkZW50aXR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHZhciBjc3NWYWx1ZSA9ICdtYXRyaXgzZCgnO1xyXG4gICAgICAgIHZhciB2ID0gMTAwMDA7XHJcbiAgICAgICAgd2hpbGUoaTwxNil7XHJcbiAgICAgICAgICAgIGNzc1ZhbHVlICs9IF9ybmQocHJvcHNbaV0qdikvdjtcclxuICAgICAgICAgICAgY3NzVmFsdWUgKz0gaSA9PT0gMTUgPyAnKSc6JywnO1xyXG4gICAgICAgICAgICBpICs9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjc3NWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0bzJkQ1NTKCkge1xyXG4gICAgICAgIC8vRG9lc24ndCBtYWtlIG11Y2ggc2Vuc2UgdG8gYWRkIHRoaXMgb3B0aW1pemF0aW9uLiBJZiBpdCBpcyBhbiBpZGVudGl0eSBtYXRyaXgsIGl0J3MgdmVyeSBsaWtlbHkgdGhpcyB3aWxsIGdldCBjYWxsZWQgb25seSBvbmNlIHNpbmNlIGl0IHdvbid0IGJlIGtleWZyYW1lZC5cclxuICAgICAgICAvKmlmKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9Ki9cclxuICAgICAgICB2YXIgdiA9IDEwMDAwO1xyXG4gICAgICAgIHZhciBwcm9wcyA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFwibWF0cml4KFwiICsgX3JuZChwcm9wc1swXSp2KS92ICsgJywnICsgX3JuZChwcm9wc1sxXSp2KS92ICsgJywnICsgX3JuZChwcm9wc1s0XSp2KS92ICsgJywnICsgX3JuZChwcm9wc1s1XSp2KS92ICsgJywnICsgX3JuZChwcm9wc1sxMl0qdikvdiArICcsJyArIF9ybmQocHJvcHNbMTNdKnYpL3YgKyBcIilcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBNYXRyaXhJbnN0YW5jZSgpe1xyXG4gICAgICAgIHRoaXMucmVzZXQgPSByZXNldDtcclxuICAgICAgICB0aGlzLnJvdGF0ZSA9IHJvdGF0ZTtcclxuICAgICAgICB0aGlzLnJvdGF0ZVggPSByb3RhdGVYO1xyXG4gICAgICAgIHRoaXMucm90YXRlWSA9IHJvdGF0ZVk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVaID0gcm90YXRlWjtcclxuICAgICAgICB0aGlzLnNrZXcgPSBza2V3O1xyXG4gICAgICAgIHRoaXMuc2tld0Zyb21BeGlzID0gc2tld0Zyb21BeGlzO1xyXG4gICAgICAgIHRoaXMuc2hlYXIgPSBzaGVhcjtcclxuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm0gPSBzZXRUcmFuc2Zvcm07XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XHJcbiAgICAgICAgdGhpcy5hcHBseVRvUG9pbnQgPSBhcHBseVRvUG9pbnQ7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvWCA9IGFwcGx5VG9YO1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1kgPSBhcHBseVRvWTtcclxuICAgICAgICB0aGlzLmFwcGx5VG9aID0gYXBwbHlUb1o7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvUG9pbnRBcnJheSA9IGFwcGx5VG9Qb2ludEFycmF5O1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1RyaXBsZVBvaW50cyA9IGFwcGx5VG9UcmlwbGVQb2ludHM7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvUG9pbnRTdHJpbmdpZmllZCA9IGFwcGx5VG9Qb2ludFN0cmluZ2lmaWVkO1xyXG4gICAgICAgIHRoaXMudG9DU1MgPSB0b0NTUztcclxuICAgICAgICB0aGlzLnRvMmRDU1MgPSB0bzJkQ1NTO1xyXG4gICAgICAgIHRoaXMuY2xvbmUgPSBjbG9uZTtcclxuICAgICAgICB0aGlzLmNsb25lRnJvbVByb3BzID0gY2xvbmVGcm9tUHJvcHM7XHJcbiAgICAgICAgdGhpcy5lcXVhbHMgPSBlcXVhbHM7XHJcbiAgICAgICAgdGhpcy5pbnZlcnNlUG9pbnRzID0gaW52ZXJzZVBvaW50cztcclxuICAgICAgICB0aGlzLmludmVyc2VQb2ludCA9IGludmVyc2VQb2ludDtcclxuICAgICAgICB0aGlzLl90ID0gdGhpcy50cmFuc2Zvcm07XHJcbiAgICAgICAgdGhpcy5pc0lkZW50aXR5ID0gaXNJZGVudGl0eTtcclxuICAgICAgICB0aGlzLl9pZGVudGl0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMgPSBjcmVhdGVUeXBlZEFycmF5KCdmbG9hdDMyJywgMTYpO1xyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4SW5zdGFuY2UoKVxyXG4gICAgfVxyXG59KCkpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg7IiwidmFyIGNyZWF0ZVR5cGVkQXJyYXkgPSAoZnVuY3Rpb24oKXtcclxuXHRmdW5jdGlvbiBjcmVhdGVSZWd1bGFyQXJyYXkodHlwZSwgbGVuKXtcclxuXHRcdHZhciBpID0gMCwgYXJyID0gW10sIHZhbHVlO1xyXG5cdFx0c3dpdGNoKHR5cGUpIHtcclxuXHRcdFx0Y2FzZSAnaW50MTYnOlxyXG5cdFx0XHRjYXNlICd1aW50OGMnOlxyXG5cdFx0XHRcdHZhbHVlID0gMTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR2YWx1ZSA9IDEuMTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdGFyci5wdXNoKHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhcnI7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGNyZWF0ZVR5cGVkQXJyYXkodHlwZSwgbGVuKXtcclxuXHRcdGlmKHR5cGUgPT09ICdmbG9hdDMyJykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShsZW4pO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGUgPT09ICdpbnQxNicpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBJbnQxNkFycmF5KGxlbik7XHJcblx0XHR9IGVsc2UgaWYodHlwZSA9PT0gJ3VpbnQ4YycpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBVaW50OENsYW1wZWRBcnJheShsZW4pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZih0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIEZsb2F0MzJBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0cmV0dXJuIGNyZWF0ZVR5cGVkQXJyYXk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiBjcmVhdGVSZWd1bGFyQXJyYXk7XHJcblx0fVxyXG59KCkpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUeXBlZEFycmF5O1xyXG4iLCJ2YXIgQW5pbWF0aW9uSXRlbSA9IHJlcXVpcmUoJy4vYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0nKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUFuaW1hdGlvbkFwaShhbmltKSB7XHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIEFuaW1hdGlvbkl0ZW0oYW5pbSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRjcmVhdGVBbmltYXRpb25BcGkgOiBjcmVhdGVBbmltYXRpb25BcGlcclxufSIsInZhciBrZXlQYXRoQnVpbGRlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXInKTtcclxudmFyIGxheWVyX3R5cGVzID0gcmVxdWlyZSgnLi4vZW51bXMvbGF5ZXJfdHlwZXMnKTtcclxuXHJcbmZ1bmN0aW9uIEtleVBhdGhMaXN0KGVsZW1lbnRzLCBub2RlX3R5cGUpIHtcclxuXHJcblx0ZnVuY3Rpb24gX2dldExlbmd0aCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5sZW5ndGg7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRUYXJnZXRMYXllcigpLmRhdGEudHkgPT09IGxheWVyX3R5cGVzW3R5cGVdO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIG5hbWUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRUYXJnZXRMYXllcigpLmRhdGEubm0gPT09IG5hbWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5UHJvcGVydHkoZWxlbWVudHMsIG5hbWUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRpZihlbGVtZW50Lmhhc1Byb3BlcnR5KG5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0UHJvcGVydHkobmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeVR5cGUoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHNlbGVjdG9yKSwgJ2xheWVyJyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeU5hbWUoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIHNlbGVjdG9yKSwgJ2xheWVyJyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRQcm9wZXJ0aWVzQnlTZWxlY3RvcihzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50Lmhhc1Byb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldFByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pLCAncHJvcGVydHknKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyUHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHZhciBsYXllcnMgPSBfZmlsdGVyTGF5ZXJCeVByb3BlcnR5KGVsZW1lbnRzLCBzZWxlY3Rvcik7XHJcblx0XHR2YXIgcHJvcGVydGllcyA9IGxheWVycy5tYXAoZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldFByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QocHJvcGVydGllcywgJ3Byb3BlcnR5Jyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRLZXlQYXRoKHByb3BlcnR5UGF0aCkge1xyXG5cdFx0dmFyIGtleVBhdGhEYXRhID0ga2V5UGF0aEJ1aWxkZXIocHJvcGVydHlQYXRoKTtcclxuXHRcdHZhciBzZWxlY3RvciA9IGtleVBhdGhEYXRhLnNlbGVjdG9yO1xyXG5cdFx0dmFyIG5vZGVzQnlOYW1lLCBub2Rlc0J5VHlwZSwgc2VsZWN0ZWROb2RlcztcclxuXHRcdGlmIChub2RlX3R5cGUgPT09ICdyZW5kZXJlcicgfHwgbm9kZV90eXBlID09PSAnbGF5ZXInKSB7XHJcblx0XHRcdG5vZGVzQnlOYW1lID0gZ2V0TGF5ZXJzQnlOYW1lKHNlbGVjdG9yKTtcclxuXHRcdFx0bm9kZXNCeVR5cGUgPSBnZXRMYXllcnNCeVR5cGUoc2VsZWN0b3IpO1xyXG5cdFx0XHRpZiAobm9kZXNCeU5hbWUubGVuZ3RoID09PSAwICYmIG5vZGVzQnlUeXBlLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdHNlbGVjdGVkTm9kZXMgPSBnZXRMYXllclByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZWxlY3RlZE5vZGVzID0gbm9kZXNCeU5hbWUuY29uY2F0KG5vZGVzQnlUeXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXMuZ2V0S2V5UGF0aChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYobm9kZV90eXBlID09PSAncHJvcGVydHknKSB7XHJcblx0XHRcdHNlbGVjdGVkTm9kZXMgPSBnZXRQcm9wZXJ0aWVzQnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdGlmIChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2Rlcy5nZXRLZXlQYXRoKGtleVBhdGhEYXRhLnByb3BlcnR5UGF0aCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbmNhdChub2Rlcykge1xyXG5cdFx0dmFyIG5vZGVzRWxlbWVudHMgPSBub2Rlcy5nZXRFbGVtZW50cygpO1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KGVsZW1lbnRzLmNvbmNhdChub2Rlc0VsZW1lbnRzKSwgbm9kZV90eXBlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEVsZW1lbnRzKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHlBdEluZGV4KGluZGV4KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHNbaW5kZXhdO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRLZXlQYXRoOiBnZXRLZXlQYXRoLFxyXG5cdFx0Y29uY2F0OiBjb25jYXQsXHJcblx0XHRnZXRFbGVtZW50czogZ2V0RWxlbWVudHMsXHJcblx0XHRnZXRQcm9wZXJ0eUF0SW5kZXg6IGdldFByb3BlcnR5QXRJbmRleFxyXG5cdH1cclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1ldGhvZHMsICdsZW5ndGgnLCB7XHJcblx0XHRnZXQ6IF9nZXRMZW5ndGhcclxuXHR9KTtcclxuXHJcblx0cmV0dXJuIG1ldGhvZHM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5UGF0aExpc3Q7IiwidmFyIGtleV9wYXRoX3NlcGFyYXRvciA9IHJlcXVpcmUoJy4uL2VudW1zL2tleV9wYXRoX3NlcGFyYXRvcicpO1xyXG52YXIgcHJvcGVydHlfbmFtZXMgPSByZXF1aXJlKCcuLi9lbnVtcy9wcm9wZXJ0eV9uYW1lcycpO1xyXG5cclxuZnVuY3Rpb24gS2V5UGF0aE5vZGUoc3RhdGUpIHtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IsIHByb3BlcnR5UGF0aCkge1xyXG5cdFx0dmFyIGluc3RhbmNlUHJvcGVydGllcyA9IHN0YXRlLnByb3BlcnRpZXMgfHwgW107XHJcblx0XHR2YXIgaSA9IDAsIGxlbiA9IGluc3RhbmNlUHJvcGVydGllcy5sZW5ndGg7XHJcblx0XHR3aGlsZShpIDwgbGVuKSB7XHJcblx0XHRcdGlmKGluc3RhbmNlUHJvcGVydGllc1tpXS5uYW1lID09PSBzZWxlY3Rvcikge1xyXG5cdFx0XHRcdHJldHVybiBpbnN0YW5jZVByb3BlcnRpZXNbaV0udmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0aSArPSAxO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaGFzUHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiAhIWdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5KHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KSB7XHJcblx0XHRyZXR1cm4gc3RhdGUucGFyZW50LmZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB0b0tleXBhdGhMYXllclBvaW50KHBvaW50KSB7XHJcblx0XHRyZXR1cm4gc3RhdGUucGFyZW50LnRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRoYXNQcm9wZXJ0eTogaGFzUHJvcGVydHksXHJcblx0XHRnZXRQcm9wZXJ0eTogZ2V0UHJvcGVydHksXHJcblx0XHRmcm9tS2V5cGF0aExheWVyUG9pbnQ6IGZyb21LZXlwYXRoTGF5ZXJQb2ludCxcclxuXHRcdHRvS2V5cGF0aExheWVyUG9pbnQ6IHRvS2V5cGF0aExheWVyUG9pbnRcclxuXHR9XHJcblx0cmV0dXJuIG1ldGhvZHM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5UGF0aE5vZGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtL1RyYW5zZm9ybScpO1xyXG52YXIgRWZmZWN0cyA9IHJlcXVpcmUoJy4vZWZmZWN0cy9FZmZlY3RzJyk7XHJcbnZhciBNYXRyaXggPSByZXF1aXJlKCcuLi9oZWxwZXJzL3RyYW5zZm9ybWF0aW9uTWF0cml4Jyk7XHJcblxyXG5mdW5jdGlvbiBMYXllckJhc2Uoc3RhdGUpIHtcclxuXHJcblx0dmFyIHRyYW5zZm9ybSA9IFRyYW5zZm9ybShzdGF0ZS5lbGVtZW50LmZpbmFsVHJhbnNmb3JtLm1Qcm9wLCBzdGF0ZSk7XHJcblx0dmFyIGVmZmVjdHMgPSBFZmZlY3RzKHN0YXRlLmVsZW1lbnQuZWZmZWN0c01hbmFnZXIuZWZmZWN0RWxlbWVudHMgfHwgW10sIHN0YXRlKTtcclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRzdGF0ZS5wcm9wZXJ0aWVzLnB1c2goe1xyXG5cdFx0XHRuYW1lOiAndHJhbnNmb3JtJyxcclxuXHRcdFx0dmFsdWU6IHRyYW5zZm9ybVxyXG5cdFx0fSx7XHJcblx0XHRcdG5hbWU6ICdUcmFuc2Zvcm0nLFxyXG5cdFx0XHR2YWx1ZTogdHJhbnNmb3JtXHJcblx0XHR9LHtcclxuXHRcdFx0bmFtZTogJ0VmZmVjdHMnLFxyXG5cdFx0XHR2YWx1ZTogZWZmZWN0c1xyXG5cdFx0fSx7XHJcblx0XHRcdG5hbWU6ICdlZmZlY3RzJyxcclxuXHRcdFx0dmFsdWU6IGVmZmVjdHNcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRUb1BvaW50KHBvaW50KSB7XHJcbiAgICB9XHJcblxyXG5cdGZ1bmN0aW9uIHRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudDtcclxuICAgIFx0aWYoc3RhdGUucGFyZW50LnRvS2V5cGF0aExheWVyUG9pbnQpIHtcclxuICAgICAgICBcdHBvaW50ID0gc3RhdGUucGFyZW50LnRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgIFx0dmFyIHRvV29ybGRNYXQgPSBNYXRyaXgoKTtcclxuICAgICAgICB2YXIgdHJhbnNmb3JtTWF0ID0gc3RhdGUuZ2V0UHJvcGVydHkoJ1RyYW5zZm9ybScpLmdldFRhcmdldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIGlmKGVsZW1lbnQuaGllcmFyY2h5ICYmIGVsZW1lbnQuaGllcmFyY2h5Lmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHZhciBpLCBsZW4gPSBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmhpZXJhcmNoeVtpXS5maW5hbFRyYW5zZm9ybS5tUHJvcC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b1dvcmxkTWF0LmludmVyc2VQb2ludChwb2ludCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudDtcclxuXHRcdHZhciB0b1dvcmxkTWF0ID0gTWF0cml4KCk7XHJcbiAgICAgICAgdmFyIHRyYW5zZm9ybU1hdCA9IHN0YXRlLmdldFByb3BlcnR5KCdUcmFuc2Zvcm0nKS5nZXRUYXJnZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICB0cmFuc2Zvcm1NYXQuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICBpZihlbGVtZW50LmhpZXJhcmNoeSAmJiBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGgpe1xyXG4gICAgICAgICAgICB2YXIgaSwgbGVuID0gZWxlbWVudC5oaWVyYXJjaHkubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IoaT0wO2k8bGVuO2krPTEpe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5oaWVyYXJjaHlbaV0uZmluYWxUcmFuc2Zvcm0ubVByb3AuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludCA9IHRvV29ybGRNYXQuYXBwbHlUb1BvaW50QXJyYXkocG9pbnRbMF0scG9pbnRbMV0scG9pbnRbMl18fDApO1xyXG4gICAgICAgIGlmKHN0YXRlLnBhcmVudC5mcm9tS2V5cGF0aExheWVyUG9pbnQpIHtcclxuICAgICAgICBcdHJldHVybiBzdGF0ZS5wYXJlbnQuZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFx0cmV0dXJuIHBvaW50O1xyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRhcmdldExheWVyKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLmVsZW1lbnQ7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldFRhcmdldExheWVyOiBnZXRUYXJnZXRMYXllcixcclxuXHRcdHRvS2V5cGF0aExheWVyUG9pbnQ6IHRvS2V5cGF0aExheWVyUG9pbnQsXHJcblx0XHRmcm9tS2V5cGF0aExheWVyUG9pbnQ6IGZyb21LZXlwYXRoTGF5ZXJQb2ludFxyXG5cdH1cclxuXHJcblx0X2J1aWxkUHJvcGVydHlNYXAoKTtcclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUsIEtleVBhdGhOb2RlKHN0YXRlKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJCYXNlOyIsInZhciBsYXllcl90eXBlcyA9IHJlcXVpcmUoJy4uL2VudW1zL2xheWVyX3R5cGVzJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG5cclxuZnVuY3Rpb24gTGF5ZXJMaXN0KGVsZW1lbnRzKSB7XHJcblxyXG5cdGZ1bmN0aW9uIF9nZXRMZW5ndGgoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS50eSA9PT0gbGF5ZXJfdHlwZXNbdHlwZV07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgbmFtZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEubm0gPT09IG5hbWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVycygpIHtcclxuXHRcdCByZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5VHlwZSh0eXBlKSB7XHJcblx0XHR2YXIgZWxlbWVudHNMaXN0ID0gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKTtcclxuXHRcdHJldHVybiBMYXllckxpc3QoZWxlbWVudHNMaXN0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5TmFtZSh0eXBlKSB7XHJcblx0XHR2YXIgZWxlbWVudHNMaXN0ID0gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCB0eXBlKTtcclxuXHRcdHJldHVybiBMYXllckxpc3QoZWxlbWVudHNMaXN0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxheWVyKGluZGV4KSB7XHJcblx0XHRpZiAoaW5kZXggPj0gZWxlbWVudHMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiBbXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBsYXllcl9hcGkoZWxlbWVudHNbcGFyc2VJbnQoaW5kZXgpXSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRJdGVyYXRhYmxlTWV0aG9kcyhpdGVyYXRhYmxlTWV0aG9kcywgbGlzdCkge1xyXG5cdFx0aXRlcmF0YWJsZU1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSl7XHJcblx0XHRcdHZhciBfdmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0YWNjdW11bGF0b3JbdmFsdWVdID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XHJcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnRzLm1hcChmdW5jdGlvbihlbGVtZW50KXtcclxuXHRcdFx0XHRcdHZhciBsYXllciA9IGxheWVyX2FwaShlbGVtZW50KTtcclxuXHRcdFx0XHRcdGlmKGxheWVyW192YWx1ZV0pIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyW192YWx1ZV0uYXBwbHkobnVsbCwgX2FyZ3VtZW50cyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gYWNjdW11bGF0b3I7XHJcblx0XHR9LCBtZXRob2RzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRhcmdldEVsZW1lbnRzKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY29uY2F0KGxpc3QpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5jb25jYXQobGlzdC5nZXRUYXJnZXRFbGVtZW50cygpKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0TGF5ZXJzOiBnZXRMYXllcnMsXHJcblx0XHRnZXRMYXllcnNCeVR5cGU6IGdldExheWVyc0J5VHlwZSxcclxuXHRcdGdldExheWVyc0J5TmFtZTogZ2V0TGF5ZXJzQnlOYW1lLFxyXG5cdFx0bGF5ZXI6IGxheWVyLFxyXG5cdFx0Y29uY2F0OiBjb25jYXQsXHJcblx0XHRnZXRUYXJnZXRFbGVtZW50czogZ2V0VGFyZ2V0RWxlbWVudHNcclxuXHR9O1xyXG5cclxuXHRhZGRJdGVyYXRhYmxlTWV0aG9kcyhbJ3NldFRyYW5zbGF0ZScsICdnZXRUeXBlJywgJ2dldER1cmF0aW9uJ10pO1xyXG5cdGFkZEl0ZXJhdGFibGVNZXRob2RzKFsnc2V0VGV4dCcsICdnZXRUZXh0JywgJ3NldERvY3VtZW50RGF0YScsICdjYW5SZXNpemVGb250JywgJ3NldE1pbmltdW1Gb250U2l6ZSddKTtcclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1ldGhvZHMsICdsZW5ndGgnLCB7XHJcblx0XHRnZXQ6IF9nZXRMZW5ndGhcclxuXHR9KTtcclxuXHRyZXR1cm4gbWV0aG9kcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXllckxpc3Q7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIENhbWVyYShlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb2ludCBvZiBJbnRlcmVzdCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1pvb20nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnBlLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnAsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdYIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5yeCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnJ5LCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnWiBSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucnosIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPcmllbnRhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQub3IsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0TGF5ZXIoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudDtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGFyZ2V0TGF5ZXI6IGdldFRhcmdldExheWVyXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgS2V5UGF0aE5vZGUoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmE7IiwidmFyIEtleVBhdGhMaXN0ID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aExpc3QnKTtcclxudmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG52YXIgbGF5ZXJfYXBpID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9sYXllckFQSUJ1aWxkZXInKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxudmFyIFRpbWVSZW1hcCA9IHJlcXVpcmUoJy4vVGltZVJlbWFwJyk7XHJcblxyXG5mdW5jdGlvbiBDb21wb3NpdGlvbihlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkTGF5ZXJBcGkobGF5ZXIsIGluZGV4KSB7XHJcblx0XHR2YXIgX2xheWVyQXBpID0gbnVsbDtcclxuXHRcdHZhciBvYiA9IHtcclxuXHRcdFx0bmFtZTogbGF5ZXIubm1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBnZXRMYXllckFwaSgpIHtcclxuXHRcdFx0aWYoIV9sYXllckFwaSkge1xyXG5cdFx0XHRcdF9sYXllckFwaSA9IGxheWVyX2FwaShlbGVtZW50LmVsZW1lbnRzW2luZGV4XSwgc3RhdGUpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIF9sYXllckFwaVxyXG5cdFx0fVxyXG5cclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYiwgJ3ZhbHVlJywge1xyXG5cdFx0XHRnZXQgOiBnZXRMYXllckFwaVxyXG5cdFx0fSlcclxuXHRcdHJldHVybiBvYjtcclxuXHR9XHJcblxyXG5cdFxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0dmFyIGNvbXBvc2l0aW9uTGF5ZXJzID0gZWxlbWVudC5sYXllcnMubWFwKGJ1aWxkTGF5ZXJBcGkpXHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1RpbWUgUmVtYXAnLFxyXG5cdFx0XHRcdHZhbHVlOiBUaW1lUmVtYXAoZWxlbWVudC50bSlcclxuXHRcdFx0fVxyXG5cdFx0XS5jb25jYXQoY29tcG9zaXRpb25MYXllcnMpXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBLZXlQYXRoTGlzdChzdGF0ZS5lbGVtZW50cywgJ2xheWVyJyksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0aW9uOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBWYWx1ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvVmFsdWVQcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gVGltZVJlbWFwKHByb3BlcnR5LCBwYXJlbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0eTogcHJvcGVydHksXHJcblx0XHRwYXJlbnQ6IHBhcmVudFxyXG5cdH1cclxuXHJcblx0dmFyIF9pc0NhbGxiYWNrQWRkZWQgPSBmYWxzZTtcclxuXHR2YXIgY3VycmVudFNlZ21lbnRJbml0ID0gMDtcclxuXHR2YXIgY3VycmVudFNlZ21lbnRFbmQgPSAwO1xyXG5cdHZhciBwcmV2aW91c1RpbWUgPSAwLCBjdXJyZW50VGltZSA9IDA7XHJcblx0dmFyIGluaXRUaW1lID0gMDtcclxuXHR2YXIgX2xvb3AgPSB0cnVlO1xyXG5cdHZhciBfbG9vcENvdW50ID0gMDtcclxuXHR2YXIgX3NwZWVkID0gMTtcclxuXHR2YXIgX3BhdXNlZCA9IGZhbHNlO1xyXG5cdHZhciBfaXNEZWJ1Z2dpbmcgPSBmYWxzZTtcclxuXHR2YXIgcXVldWVkU2VnbWVudHMgPSBbXTtcclxuXHJcblx0ZnVuY3Rpb24gcGxheVNlZ21lbnQoaW5pdCwgZW5kLCBjbGVhcikge1xyXG5cdFx0X3BhdXNlZCA9IGZhbHNlO1xyXG5cdFx0aWYoY2xlYXIpIHtcclxuXHRcdFx0Y2xlYXJRdWV1ZSgpO1xyXG5cdFx0XHRjdXJyZW50VGltZSA9IGluaXQ7XHJcblx0XHR9XHJcblx0XHRpZihfaXNEZWJ1Z2dpbmcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coaW5pdCwgZW5kKTtcclxuXHRcdH1cclxuXHRcdF9sb29wQ291bnQgPSAwO1xyXG5cdFx0cHJldmlvdXNUaW1lID0gRGF0ZS5ub3coKTtcclxuXHRcdGN1cnJlbnRTZWdtZW50SW5pdCA9IGluaXQ7XHJcblx0XHRjdXJyZW50U2VnbWVudEVuZCA9IGVuZDtcclxuXHRcdGFkZENhbGxiYWNrKCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwbGF5UXVldWVkU2VnbWVudCgpIHtcclxuXHRcdHZhciBuZXdTZWdtZW50ID0gcXVldWVkU2VnbWVudHMuc2hpZnQoKTtcclxuXHRcdHBsYXlTZWdtZW50KG5ld1NlZ21lbnRbMF0sIG5ld1NlZ21lbnRbMV0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcXVldWVTZWdtZW50KGluaXQsIGVuZCkge1xyXG5cdFx0cXVldWVkU2VnbWVudHMucHVzaChbaW5pdCwgZW5kXSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjbGVhclF1ZXVlKCkge1xyXG5cdFx0cXVldWVkU2VnbWVudHMubGVuZ3RoID0gMDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9zZWdtZW50UGxheWVyKGN1cnJlbnRWYWx1ZSkge1xyXG5cdFx0aWYoY3VycmVudFNlZ21lbnRJbml0ID09PSBjdXJyZW50U2VnbWVudEVuZCkge1xyXG5cdFx0XHRjdXJyZW50VGltZSA9IGN1cnJlbnRTZWdtZW50SW5pdDtcclxuXHRcdH0gZWxzZSBpZighX3BhdXNlZCkge1xyXG5cdFx0XHR2YXIgbm93VGltZSA9IERhdGUubm93KCk7XHJcblx0XHRcdHZhciBlbGFwc2VkVGltZSA9IF9zcGVlZCAqIChub3dUaW1lIC0gcHJldmlvdXNUaW1lKSAvIDEwMDA7XHJcblx0XHRcdHByZXZpb3VzVGltZSA9IG5vd1RpbWU7XHJcblx0XHRcdGlmKGN1cnJlbnRTZWdtZW50SW5pdCA8IGN1cnJlbnRTZWdtZW50RW5kKSB7XHJcblx0XHRcdFx0Y3VycmVudFRpbWUgKz0gZWxhcHNlZFRpbWU7XHJcblx0XHRcdFx0aWYoY3VycmVudFRpbWUgPiBjdXJyZW50U2VnbWVudEVuZCkge1xyXG5cdFx0XHRcdFx0X2xvb3BDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0aWYocXVldWVkU2VnbWVudHMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdHBsYXlRdWV1ZWRTZWdtZW50KCk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYoIV9sb29wKSB7XHJcblx0XHRcdFx0XHRcdGN1cnJlbnRUaW1lID0gY3VycmVudFNlZ21lbnRFbmQ7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjdXJyZW50VGltZSA9IGN1cnJlbnRTZWdtZW50SW5pdCArIChjdXJyZW50VGltZSAtIGN1cnJlbnRTZWdtZW50RW5kKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3VycmVudFRpbWUgLT0gZWxhcHNlZFRpbWU7XHJcblx0XHRcdFx0aWYoY3VycmVudFRpbWUgPCBjdXJyZW50U2VnbWVudEVuZCkge1xyXG5cdFx0XHRcdFx0X2xvb3BDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0aWYocXVldWVkU2VnbWVudHMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdHBsYXlRdWV1ZWRTZWdtZW50KCk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYoIV9sb29wKSB7XHJcblx0XHRcdFx0XHRcdGN1cnJlbnRUaW1lID0gY3VycmVudFNlZ21lbnRFbmQ7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjdXJyZW50VGltZSA9IGN1cnJlbnRTZWdtZW50SW5pdCAtIChjdXJyZW50U2VnbWVudEVuZCAtIGN1cnJlbnRUaW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoX2lzRGVidWdnaW5nKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coY3VycmVudFRpbWUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjdXJyZW50VGltZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZENhbGxiYWNrKCkge1xyXG5cdFx0aWYoIV9pc0NhbGxiYWNrQWRkZWQpIHtcclxuXHRcdFx0X2lzQ2FsbGJhY2tBZGRlZCA9IHRydWU7XHJcblx0XHRcdGluc3RhbmNlLnNldFZhbHVlKF9zZWdtZW50UGxheWVyLCBfaXNEZWJ1Z2dpbmcpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwbGF5VG8oZW5kLCBjbGVhcikge1xyXG5cdFx0X3BhdXNlZCA9IGZhbHNlO1xyXG5cdFx0aWYoY2xlYXIpIHtcclxuXHRcdFx0Y2xlYXJRdWV1ZSgpO1xyXG5cdFx0fVxyXG5cdFx0YWRkQ2FsbGJhY2soKTtcclxuXHRcdGN1cnJlbnRTZWdtZW50RW5kID0gZW5kO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKSB7XHJcblx0XHRpZihfaXNDYWxsYmFja0FkZGVkKSB7XHJcblx0XHRcdHJldHVybiBjdXJyZW50VGltZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBwcm9wZXJ0eS52IC8gcHJvcGVydHkubXVsdDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldExvb3AoZmxhZykge1xyXG5cdFx0X2xvb3AgPSBmbGFnO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3BlZWQodmFsdWUpIHtcclxuXHRcdF9zcGVlZCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RGVidWdnaW5nKGZsYWcpIHtcclxuXHRcdF9pc0RlYnVnZ2luZyA9IGZsYWc7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwYXVzZSgpIHtcclxuXHRcdF9wYXVzZWQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRwbGF5U2VnbWVudDogcGxheVNlZ21lbnQsXHJcblx0XHRwbGF5VG86IHBsYXlUbyxcclxuXHRcdHF1ZXVlU2VnbWVudDogcXVldWVTZWdtZW50LFxyXG5cdFx0Y2xlYXJRdWV1ZTogY2xlYXJRdWV1ZSxcclxuXHRcdHNldExvb3A6IHNldExvb3AsXHJcblx0XHRzZXRTcGVlZDogc2V0U3BlZWQsXHJcblx0XHRwYXVzZTogcGF1c2UsXHJcblx0XHRzZXREZWJ1Z2dpbmc6IHNldERlYnVnZ2luZyxcclxuXHRcdGdldEN1cnJlbnRUaW1lOiBnZXRDdXJyZW50VGltZVxyXG5cdH1cclxuXHJcblx0dmFyIGluc3RhbmNlID0ge31cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG1ldGhvZHMsIFZhbHVlUHJvcGVydHkoc3RhdGUpLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVSZW1hcDsiLCJ2YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gRWZmZWN0RWxlbWVudChlZmZlY3QsIHBhcmVudCkge1xyXG5cclxuXHRyZXR1cm4gUHJvcGVydHkoZWZmZWN0LnAsIHBhcmVudCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWZmZWN0RWxlbWVudDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG52YXIgRWZmZWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vRWZmZWN0RWxlbWVudCcpO1xyXG5cclxuZnVuY3Rpb24gRWZmZWN0cyhlZmZlY3RzLCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBidWlsZFByb3BlcnRpZXMoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VmFsdWUoZWZmZWN0RGF0YSwgaW5kZXgpIHtcclxuXHRcdHZhciBubSA9IGVmZmVjdERhdGEuZGF0YSA/IGVmZmVjdERhdGEuZGF0YS5ubSA6IGluZGV4LnRvU3RyaW5nKCk7XHJcblx0XHR2YXIgZWZmZWN0RWxlbWVudCA9IGVmZmVjdERhdGEuZGF0YSA/IEVmZmVjdHMoZWZmZWN0RGF0YS5lZmZlY3RFbGVtZW50cywgcGFyZW50KSA6IFByb3BlcnR5KGVmZmVjdERhdGEucCwgcGFyZW50KTtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG5hbWU6IG5tLFxyXG5cdFx0XHR2YWx1ZTogZWZmZWN0RWxlbWVudFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRQcm9wZXJ0aWVzKCkge1xyXG5cdFx0dmFyIGksIGxlbiA9IGVmZmVjdHMubGVuZ3RoO1xyXG5cdFx0dmFyIGFyciA9IFtdO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdGFyci5wdXNoKGdldFZhbHVlKGVmZmVjdHNbaV0sIGkpKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhcnI7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWZmZWN0czsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBJbWFnZShlbGVtZW50KSB7XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIExheWVyQmFzZShlbGVtZW50KSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW1hZ2U7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG5cclxuZnVuY3Rpb24gTnVsbEVsZW1lbnQoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOdWxsRWxlbWVudDsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBTaGFwZUNvbnRlbnRzID0gcmVxdWlyZSgnLi9TaGFwZUNvbnRlbnRzJyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZShlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogW10sXHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnRcclxuXHR9XHJcblx0dmFyIHNoYXBlQ29udGVudHMgPSBTaGFwZUNvbnRlbnRzKGVsZW1lbnQuZGF0YS5zaGFwZXMsIGVsZW1lbnQuaXRlbXNEYXRhLCBzdGF0ZSk7XHJcblxyXG5cdFxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHN0YXRlLnByb3BlcnRpZXMucHVzaChcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdDb250ZW50cycsXHJcblx0XHRcdFx0dmFsdWU6IHNoYXBlQ29udGVudHNcclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRfYnVpbGRQcm9wZXJ0eU1hcCgpO1xyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSwgTGF5ZXJCYXNlKHN0YXRlKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxudmFyIFNoYXBlUmVjdGFuZ2xlID0gcmVxdWlyZSgnLi9TaGFwZVJlY3RhbmdsZScpO1xyXG52YXIgU2hhcGVGaWxsID0gcmVxdWlyZSgnLi9TaGFwZUZpbGwnKTtcclxudmFyIFNoYXBlU3Ryb2tlID0gcmVxdWlyZSgnLi9TaGFwZVN0cm9rZScpO1xyXG52YXIgU2hhcGVFbGxpcHNlID0gcmVxdWlyZSgnLi9TaGFwZUVsbGlwc2UnKTtcclxudmFyIFNoYXBlR3JhZGllbnRGaWxsID0gcmVxdWlyZSgnLi9TaGFwZUdyYWRpZW50RmlsbCcpO1xyXG52YXIgU2hhcGVHcmFkaWVudFN0cm9rZSA9IHJlcXVpcmUoJy4vU2hhcGVHcmFkaWVudFN0cm9rZScpO1xyXG52YXIgU2hhcGVUcmltUGF0aHMgPSByZXF1aXJlKCcuL1NoYXBlVHJpbVBhdGhzJyk7XHJcbnZhciBTaGFwZVJlcGVhdGVyID0gcmVxdWlyZSgnLi9TaGFwZVJlcGVhdGVyJyk7XHJcbnZhciBTaGFwZVBvbHlzdGFyID0gcmVxdWlyZSgnLi9TaGFwZVBvbHlzdGFyJyk7XHJcbnZhciBTaGFwZVJvdW5kQ29ybmVycyA9IHJlcXVpcmUoJy4vU2hhcGVSb3VuZENvcm5lcnMnKTtcclxudmFyIFNoYXBlUGF0aCA9IHJlcXVpcmUoJy4vU2hhcGVQYXRoJyk7XHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuLi90cmFuc2Zvcm0vVHJhbnNmb3JtJyk7XHJcbnZhciBNYXRyaXggPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL3RyYW5zZm9ybWF0aW9uTWF0cml4Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUNvbnRlbnRzKHNoYXBlc0RhdGEsIHNoYXBlcywgcGFyZW50KSB7XHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKSxcclxuXHRcdHBhcmVudDogcGFyZW50XHJcblx0fVxyXG5cclxuXHR2YXIgY2FjaGVkU2hhcGVQcm9wZXJ0aWVzID0gW107XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkU2hhcGVPYmplY3Qoc2hhcGUsIGluZGV4KSB7XHJcblx0XHR2YXIgb2IgPSB7XHJcblx0XHRcdG5hbWU6IHNoYXBlLm5tXHJcblx0XHR9XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2IsICd2YWx1ZScsIHtcclxuXHRcdCAgIGdldCgpIHtcclxuXHRcdCAgIFx0aWYoY2FjaGVkU2hhcGVQcm9wZXJ0aWVzW2luZGV4XSkge1xyXG5cdFx0ICAgXHRcdHJldHVybiBjYWNoZWRTaGFwZVByb3BlcnRpZXNbaW5kZXhdO1xyXG5cdFx0ICAgXHR9IGVsc2Uge1xyXG5cdFx0ICAgXHRcdHZhciBwcm9wZXJ0eTtcclxuXHRcdCAgIFx0fVxyXG5cdCAgIFx0XHRpZihzaGFwZS50eSA9PT0gJ2dyJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVDb250ZW50cyhzaGFwZXNEYXRhW2luZGV4XS5pdCwgc2hhcGVzW2luZGV4XS5pdCwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdyYycpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlUmVjdGFuZ2xlKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnZWwnKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZUVsbGlwc2Uoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdmbCcpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlRmlsbChzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3N0Jykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVTdHJva2Uoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdnZicpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlR3JhZGllbnRGaWxsKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnZ3MnKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZUdyYWRpZW50U3Ryb2tlKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAndG0nKSB7XHJcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVRyaW1QYXRocyhzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3JwJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVSZXBlYXRlcihzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3NyJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVQb2x5c3RhcihzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3JkJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVSb3VuZENvcm5lcnMoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdzaCcpIHtcclxuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlUGF0aChzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3RyJykge1xyXG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gVHJhbnNmb3JtKHNoYXBlc1tpbmRleF0udHJhbnNmb3JtLm1Qcm9wcywgc3RhdGUpO1xyXG5cdCAgIFx0XHR9IGVsc2Uge1xyXG5cdCAgIFx0XHRcdGNvbnNvbGUubG9nKHNoYXBlLnR5KTtcclxuXHQgICBcdFx0fVxyXG5cdCAgIFx0XHRjYWNoZWRTaGFwZVByb3BlcnRpZXNbaW5kZXhdID0gcHJvcGVydHk7XHJcblx0ICAgXHRcdHJldHVybiBwcm9wZXJ0eTtcclxuXHRcdCAgIH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG9iXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBzaGFwZXNEYXRhLm1hcChmdW5jdGlvbihzaGFwZSwgaW5kZXgpIHtcclxuXHRcdFx0cmV0dXJuIGJ1aWxkU2hhcGVPYmplY3Qoc2hhcGUsIGluZGV4KVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdGlmKHN0YXRlLmhhc1Byb3BlcnR5KCdUcmFuc2Zvcm0nKSkge1xyXG4gICAgXHRcdHZhciB0b1dvcmxkTWF0ID0gTWF0cml4KCk7XHJcbiAgICAgICAgXHR2YXIgdHJhbnNmb3JtTWF0ID0gc3RhdGUuZ2V0UHJvcGVydHkoJ1RyYW5zZm9ybScpLmdldFRhcmdldFRyYW5zZm9ybSgpO1xyXG5cdFx0XHR0cmFuc2Zvcm1NYXQuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICBcdHBvaW50ID0gdG9Xb3JsZE1hdC5hcHBseVRvUG9pbnRBcnJheShwb2ludFswXSxwb2ludFsxXSxwb2ludFsyXXx8MCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gc3RhdGUucGFyZW50LmZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB0b0tleXBhdGhMYXllclBvaW50KHBvaW50KSB7XHJcblx0XHRwb2ludCA9IHN0YXRlLnBhcmVudC50b0tleXBhdGhMYXllclBvaW50KHBvaW50KTtcclxuXHRcdGlmKHN0YXRlLmhhc1Byb3BlcnR5KCdUcmFuc2Zvcm0nKSkge1xyXG4gICAgXHRcdHZhciB0b1dvcmxkTWF0ID0gTWF0cml4KCk7XHJcbiAgICAgICAgXHR2YXIgdHJhbnNmb3JtTWF0ID0gc3RhdGUuZ2V0UHJvcGVydHkoJ1RyYW5zZm9ybScpLmdldFRhcmdldFRyYW5zZm9ybSgpO1xyXG5cdFx0XHR0cmFuc2Zvcm1NYXQuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICBcdHBvaW50ID0gdG9Xb3JsZE1hdC5pbnZlcnNlUG9pbnQocG9pbnQpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBvaW50O1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRmcm9tS2V5cGF0aExheWVyUG9pbnQ6IGZyb21LZXlwYXRoTGF5ZXJQb2ludCxcclxuXHRcdHRvS2V5cGF0aExheWVyUG9pbnQ6IHRvS2V5cGF0aExheWVyUG9pbnRcclxuXHR9XHJcblxyXG5cdC8vc3RhdGUucHJvcGVydGllcyA9IF9idWlsZFByb3BlcnR5TWFwKCk7XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlLCBLZXlQYXRoTm9kZShzdGF0ZSksIG1ldGhvZHMpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVDb250ZW50czsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVFbGxpcHNlKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTaXplJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5zLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnAsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlRWxsaXBzZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVGaWxsKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdDb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogUHJvcGVydHkoZWxlbWVudC5vLCBwYXJlbnQpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVGaWxsOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUdyYWRpZW50RmlsbChlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU3RhcnQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdFbmQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5vLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IExlbmd0aCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuaCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBBbmdsZScsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0NvbG9ycycsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuZy5wcm9wLCBwYXJlbnQpXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUdyYWRpZW50RmlsbDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVHcmFkaWVudFN0cm9rZShlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU3RhcnQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdFbmQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LmUsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5vLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IExlbmd0aCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuaCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBBbmdsZScsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYSwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0NvbG9ycycsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuZy5wcm9wLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU3Ryb2tlIFdpZHRoJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC53LCBwYXJlbnQpXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUdyYWRpZW50U3Ryb2tlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVBhdGgoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHBhcmVudDogcGFyZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UGF0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3BhdGgnLFxyXG5cdFx0XHRcdHZhbHVlOlByb3BlcnR5KGVsZW1lbnQuc2gsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUGF0aDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVQb2x5c3RhcihlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9pbnRzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5wdCwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5wLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnIsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdJbm5lciBSYWRpdXMnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLmlyLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT3V0ZXIgUmFkaXVzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5vciwgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0lubmVyIFJvdW5kbmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2guaXMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPdXRlciBSb3VuZG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLm9zLCBwYXJlbnQpXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVBvbHlzdGFyOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVJlY3RhbmdsZShlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU2l6ZScsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2gucywgcGFyZW50KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5wLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUm91bmRuZXNzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5yLCBwYXJlbnQpXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVJlY3RhbmdsZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi4vdHJhbnNmb3JtL1RyYW5zZm9ybScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVSZXBlYXRlcihlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQ29waWVzJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5jLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT2Zmc2V0JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5vLCBwYXJlbnQpXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnVHJhbnNmb3JtJyxcclxuXHRcdFx0XHR2YWx1ZTogVHJhbnNmb3JtKGVsZW1lbnQudHIsIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUmVwZWF0ZXI7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUm91bmRDb3JuZXJzKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSYWRpdXMnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnJkLCBwYXJlbnQpXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVJvdW5kQ29ybmVyczsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVTdHJva2UoZWxlbWVudCwgcGFyZW50KSB7XHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnY29sb3InLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LmMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdzdHJva2Ugd2lkdGgnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LncsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdvcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5vLCBwYXJlbnQpXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVN0cm9rZSIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVRyaW1QYXRocyhlbGVtZW50LCBwYXJlbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU3RhcnQnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdFbmQnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LmUsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPZmZzZXQnLFxyXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlVHJpbVBhdGhzOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIFNvbGlkKGVsZW1lbnQsIHBhcmVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cGFyZW50OiBwYXJlbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb2xpZDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG52YXIgVGV4dEFuaW1hdG9yID0gcmVxdWlyZSgnLi9UZXh0QW5pbWF0b3InKTtcclxuXHJcbmZ1bmN0aW9uIFRleHQoZWxlbWVudCwgcGFyZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwYXJlbnQ6IHBhcmVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldERvY3VtZW50RGF0YShfZnVuY3Rpb24pIHtcclxuXHRcdHZhciBwcmV2aW91c1ZhbHVlO1xyXG5cdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBuZXdWYWx1ZSA9IF9mdW5jdGlvbihlbGVtZW50LnRleHRQcm9wZXJ0eS5jdXJyZW50RGF0YSk7XHJcblx0XHRcdGlmIChwcmV2aW91c1ZhbHVlICE9PSBuZXdWYWx1ZSkge1xyXG5cdFx0XHRcdGVsZW1lbnQudXBkYXRlRG9jdW1lbnREYXRhKG5ld1ZhbHVlKVxyXG5cdFx0XHR9XHJcblx0XHR9LCA1MDApXHJcblx0XHRjb25zb2xlLmxvZyhlbGVtZW50KVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkQW5pbWF0b3JzKCkge1xyXG5cdFx0dmFyIGFuaW1hdG9yUHJvcGVydGllcyA9IFtdO1xyXG5cdFx0dmFyIGFuaW1hdG9ycyA9IGVsZW1lbnQudGV4dEFuaW1hdG9yLl9hbmltYXRvcnNEYXRhO1xyXG5cdFx0dmFyIGksIGxlbiA9IGFuaW1hdG9ycy5sZW5ndGg7XHJcblx0XHR2YXIgdGV4dEFuaW1hdG9yO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdHRleHRBbmltYXRvciA9IFRleHRBbmltYXRvcihhbmltYXRvcnNbaV0pXHJcblx0XHRcdGFuaW1hdG9yUHJvcGVydGllcy5wdXNoKHtcclxuXHRcdFx0XHRuYW1lOiBlbGVtZW50LnRleHRBbmltYXRvci5fdGV4dERhdGEuYVtpXS5ubSB8fCAnQW5pbWF0b3IgJyArIChpKzEpLCAvL0ZhbGxiYWNrIGZvciBvbGQgYW5pbWF0aW9uc1xyXG5cdFx0XHRcdHZhbHVlOiB0ZXh0QW5pbWF0b3JcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHRcdHJldHVybiBhbmltYXRvclByb3BlcnRpZXM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTb3VyY2UnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RG9jdW1lbnREYXRhXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdLmNvbmNhdChhZGRBbmltYXRvcnMoKSlcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHQ7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFRleHRBbmltYXRvcihhbmltYXRvcikge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fVxyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRBbmNob3JQb2ludCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5hKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRGaWxsQnJpZ2h0bmVzcyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5mYikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RmlsbENvbG9yKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZjKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRGaWxsSHVlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZoKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRGaWxsU2F0dXJhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5mcykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RmlsbE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9zaXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Um90YXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Um90YXRpb25YKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnJ4KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvblkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucnkpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFNjYWxlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFNrZXdBeGlzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNhKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VDb2xvcih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zYykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2tldyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zaykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlT3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zbykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlV2lkdGgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc3cpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZUJyaWdodG5lc3ModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc2IpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZUh1ZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zaCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlU2F0dXJhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zcykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0VHJhY2tpbmdBbW91bnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEudCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonQW5jaG9yIFBvaW50JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEFuY2hvclBvaW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonRmlsbCBCcmlnaHRuZXNzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxCcmlnaHRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonRmlsbCBDb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRGaWxsQ29sb3JcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIEh1ZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRGaWxsSHVlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonRmlsbCBTYXR1cmF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxTYXR1cmF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonRmlsbCBPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonT3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UG9zaXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidSb3RhdGlvbiBYJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFJvdGF0aW9uWFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1JvdGF0aW9uIFknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Um90YXRpb25ZXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU2NhbGUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2NhbGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTa2V3IEF4aXMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2tld0F4aXNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTdHJva2UgQ29sb3InLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlQ29sb3JcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTa2V3JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFNrZXdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTdHJva2UgV2lkdGgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlV2lkdGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidUcmFja2luZyBBbW91bnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0VHJhY2tpbmdBbW91bnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTdHJva2UgT3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU3Ryb2tlIEJyaWdodG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlQnJpZ2h0bmVzc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBTYXR1cmF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZVNhdHVyYXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTdHJva2UgSHVlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZUh1ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0QW5pbWF0b3I7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG52YXIgVGV4dCA9IHJlcXVpcmUoJy4vVGV4dCcpO1xyXG5cclxuZnVuY3Rpb24gVGV4dEVsZW1lbnQoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIFRleHRQcm9wZXJ0eSA9IFRleHQoZWxlbWVudCk7XHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICd0ZXh0JyxcclxuXHRcdFx0XHR2YWx1ZTogVGV4dFByb3BlcnR5XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnVGV4dCcsXHJcblx0XHRcdFx0dmFsdWU6IFRleHRQcm9wZXJ0eVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRUZXh0KCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQudGV4dFByb3BlcnR5LmN1cnJlbnREYXRhLnQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRUZXh0KHZhbHVlLCBpbmRleCkge1xyXG5cdFx0c2V0RG9jdW1lbnREYXRhKHt0OiB2YWx1ZX0sIGluZGV4KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldERvY3VtZW50RGF0YShkYXRhLCBpbmRleCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQudXBkYXRlRG9jdW1lbnREYXRhKGRhdGEsIGluZGV4KTtcclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gY2FuUmVzaXplRm9udChfY2FuUmVzaXplKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5jYW5SZXNpemVGb250KF9jYW5SZXNpemUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0TWluaW11bUZvbnRTaXplKF9mb250U2l6ZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuc2V0TWluaW11bUZvbnRTaXplKF9mb250U2l6ZSk7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldFRleHQ6IGdldFRleHQsXHJcblx0XHRzZXRUZXh0OiBzZXRUZXh0LFxyXG5cdFx0Y2FuUmVzaXplRm9udDogY2FuUmVzaXplRm9udCxcclxuXHRcdHNldERvY3VtZW50RGF0YTogc2V0RG9jdW1lbnREYXRhLFxyXG5cdFx0c2V0TWluaW11bUZvbnRTaXplOiBzZXRNaW5pbXVtRm9udFNpemVcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dEVsZW1lbnQ7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFRyYW5zZm9ybShwcm9wcywgcGFyZW50KSB7XHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0FuY2hvciBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLmEsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb2ludCBvZiBJbnRlcmVzdCcsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLmEsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLnAsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTY2FsZScsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLnMsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLnIsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdYIFBvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucHgsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdZIFBvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucHksIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdaIFBvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucHosIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdYIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucngsIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdZIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucnksIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdaIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucnosIHBhcmVudClcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucG8sIHBhcmVudClcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0VHJhbnNmb3JtKCkge1xyXG5cdFx0cmV0dXJuIHByb3BzO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRUYXJnZXRUcmFuc2Zvcm06IGdldFRhcmdldFRyYW5zZm9ybVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2Zvcm07IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFZhbHVlUHJvcGVydHkgPSByZXF1aXJlKCcuL1ZhbHVlUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFByb3BlcnR5KHByb3BlcnR5LCBwYXJlbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0eTogcHJvcGVydHksXHJcblx0XHRwYXJlbnQ6IHBhcmVudFxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgbWV0aG9kcywgVmFsdWVQcm9wZXJ0eShzdGF0ZSksIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJvcGVydHk7IiwiZnVuY3Rpb24gVmFsdWVQcm9wZXJ0eShzdGF0ZSkge1xyXG5cdFxyXG5cdGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlKSB7XHJcblx0XHR2YXIgcHJvcGVydHkgPSBzdGF0ZS5wcm9wZXJ0eTtcclxuXHRcdGlmKCFwcm9wZXJ0eSB8fCAhcHJvcGVydHkuYWRkRWZmZWN0KSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0cHJvcGVydHkuYWRkRWZmZWN0KHZhbHVlKTtcclxuXHRcdH0gZWxzZSBpZiAocHJvcGVydHkucHJvcFR5cGUgPT09ICdtdWx0aWRpbWVuc2lvbmFsJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRwcm9wZXJ0eS5hZGRFZmZlY3QoZnVuY3Rpb24oKXtyZXR1cm4gdmFsdWV9KTtcclxuXHRcdH0gZWxzZSBpZiAocHJvcGVydHkucHJvcFR5cGUgPT09ICd1bmlkaW1lbnNpb25hbCcgJiYgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHRwcm9wZXJ0eS5hZGRFZmZlY3QoZnVuY3Rpb24oKXtyZXR1cm4gdmFsdWV9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFZhbHVlKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLnByb3BlcnR5LnY7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdHNldFZhbHVlOiBzZXRWYWx1ZSxcclxuXHRcdGdldFZhbHVlOiBnZXRWYWx1ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG1ldGhvZHM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmFsdWVQcm9wZXJ0eTsiLCJ2YXIgTGF5ZXJMaXN0ID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJMaXN0Jyk7XHJcbnZhciBLZXlQYXRoTGlzdCA9IHJlcXVpcmUoJy4uL2tleV9wYXRoL0tleVBhdGhMaXN0Jyk7XHJcblxyXG5mdW5jdGlvbiBSZW5kZXJlcihzdGF0ZSkge1xyXG5cclxuXHRzdGF0ZS5fdHlwZSA9ICdyZW5kZXJlcic7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFJlbmRlcmVyVHlwZSgpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5hbmltYXRpb24uYW5pbVR5cGU7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7XHJcblx0XHRnZXRSZW5kZXJlclR5cGU6IGdldFJlbmRlcmVyVHlwZVxyXG5cdH0sIExheWVyTGlzdChzdGF0ZS5lbGVtZW50cyksIEtleVBhdGhMaXN0KHN0YXRlLmVsZW1lbnRzLCAncmVuZGVyZXInKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyZXI7Il19
