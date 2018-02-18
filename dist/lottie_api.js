(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lottie_api = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../helpers/layerAPIBuilder":6,"../renderer/Renderer":39}],2:[function(require,module,exports){
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


module.exports = function getLayerApi(element) {
	var layerType = element.data.ty;
	var Composition = require('../layer/composition/Composition');
	switch(layerType) {
		case 0:
		return Composition(element);
		case 1:
		return SolidElement(element);
		case 2:
		return ImageElement(element);
		case 3:
		return NullElement(element);
		case 4:
		return ShapeElement(element, element.data.shapes, element.itemsData);
		case 5:
		return TextElement(element);
		case 13:
		return CameraElement(element);
		default:
		return LayerBase(element);
	}
}
},{"../layer/LayerBase":13,"../layer/camera/Camera":15,"../layer/composition/Composition":16,"../layer/image/ImageElement":19,"../layer/null_element/NullElement":20,"../layer/shape/Shape":21,"../layer/solid/SolidElement":33,"../layer/text/TextElement":36}],7:[function(require,module,exports){
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
		if(node_type === 'layer') {
			return elements[index];
		} else {
			return elements[index];
		}
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

function KeyPathNode(state, node_type) {

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

	var methods = {
		hasProperty: hasProperty,
		getProperty: getProperty
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

	var transform = Transform(state.element.finalTransform.mProp);
	var effects = Effects(state.element.effectsManager.effectElements);

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

    function getElementToPoint(element, point) {
        if(element.comp && element.comp.finalTransform) {
        	point = getElementToPoint(element.comp, point);
        }
    	var toWorldMat = Matrix();
        var transformMat;
        transformMat = element.finalTransform.mProp;
        transformMat.applyToMatrix(toWorldMat);
        if(element.hierarchy && element.hierarchy.length){
            var i, len = element.hierarchy.length;
            for(i=0;i<len;i+=1){
                element.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
            }
        }
        return toWorldMat.inversePoint(point);
    }

	function toKeypathLayerPoint(point) {
		return getElementToPoint(state.element, point);
	}

    function getElementFromPoint(element, point) {
    	var toWorldMat = Matrix();
        var transformMat = element.finalTransform.mProp;
        transformMat.applyToMatrix(toWorldMat);
        if(element.hierarchy && element.hierarchy.length){
            var i, len = element.hierarchy.length;
            for(i=0;i<len;i+=1){
                element.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
            }
        }
        point = toWorldMat.applyToPointArray(point[0],point[1],point[2]||0);
        if(element.comp && element.comp.finalTransform) {
        	point = getElementFromPoint(element.comp, point);
        }
        return point;
    }

	function fromKeypathLayerPoint(point) {
		return getElementFromPoint(state.element, point);
	}

	function getData() {

	}

	function getTargetLayer() {
		return state.element
	}

	var methods = {
		getTargetLayer: getTargetLayer,
		toKeypathLayerPoint: toKeypathLayerPoint,
		fromKeypathLayerPoint: fromKeypathLayerPoint
	}

	_buildPropertyMap();

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = LayerBase;
},{"../helpers/transformationMatrix":8,"../key_path/KeyPathNode":12,"./effects/Effects":18,"./transform/Transform":37}],14:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],16:[function(require,module,exports){
var KeyPathList = require('../../key_path/KeyPathList');
var LayerBase = require('../LayerBase');
var layer_api = require('../../helpers/layerAPIBuilder');
var Property = require('../../property/Property');

function Composition(element) {

	var instance = {};

	var state = {
		element: element,
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
				_layerApi = layer_api(element.elements[index])
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
},{"../../helpers/layerAPIBuilder":6,"../../key_path/KeyPathList":11,"../../property/Property":38,"../LayerBase":13}],17:[function(require,module,exports){
var Property = require('../../property/Property');

function EffectElement(effect) {

	function setValue(value) {
		Property(effect.p).setValue(value)
	}

	return {
		setValue: setValue
	}
}

module.exports = EffectElement;
},{"../../property/Property":38}],18:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var EffectElement = require('./EffectElement');

function Effects(effects) {

	var state = {
		properties: buildProperties()
	}

	function getValue(effectData, index) {
		var nm = effectData.data ? effectData.data.nm : index.toString();
		var effectElement = effectData.data ? Effects(effectData.effectElements) : EffectElement(effectData);
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":38,"./EffectElement":17}],19:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Image(element) {

	var methods = {
	}

	return Object.assign({}, LayerBase(element), methods);
}

module.exports = Image;
},{"../LayerBase":13}],20:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function NullElement(element) {

	var instance = {};

	var state = {
		element: element,
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

function Shape(element, shapesData, shapes) {

	var instance = {};

	var state = {
		properties: _buildPropertyMap(),
		element: element
	}

	function buildShapeObject(shape, index) {
		var ob = {
			name: shape.nm
		}
		Object.defineProperty(ob, 'value', {
		   get() { 
	   		if(shape.ty === 'gr') {
	   			return Shape(element, shapesData[index].it, shapes[index].it);
	   		} else if(shape.ty === 'rc') {
	   			return ShapeRectangle(shapes[index]);
	   		} else if(shape.ty === 'el') {
	   			return ShapeEllipse(shapes[index]);
	   		} else if(shape.ty === 'fl') {
	   			return ShapeFill(shapes[index]);
	   		} else if(shape.ty === 'st') {
	   			return ShapeStroke(shapes[index]);
	   		} else if(shape.ty === 'gf') {
	   			return ShapeGradientFill(shapes[index]);
	   		} else if(shape.ty === 'gs') {
	   			return ShapeGradientStroke(shapes[index]);
	   		} else if(shape.ty === 'tm') {
	   			return ShapeTrimPaths(shapes[index]);
	   		} else if(shape.ty === 'rp') {
	   			return ShapeRepeater(shapes[index]);
	   		} else if(shape.ty === 'sr') {
	   			return ShapePolystar(shapes[index]);
	   		} else if(shape.ty === 'rd') {
	   			return ShapeRoundCorners(shapes[index]);
	   		} else if(shape.ty === 'sh') {
	   			return ShapePath(shapes[index]);
	   		} else if(shape.ty === 'tr') {
	   			return Transform(shapes[index].transform.mProps);
	   		} else {
	   			console.log(shape.ty);
	   		}
		   }
		});
		return ob
	}

	function _buildPropertyMap() {
		var shapes = shapesData.map(function(shape, index) {
			return buildShapeObject(shape, index)
		});
		return shapes
	}

	var methods = {
	}

	var instance = Object.assign({}, LayerBase(state), methods);
	console.log('instance: ', instance)
	return instance;
}

module.exports = Shape;
},{"../LayerBase":13,"../transform/Transform":37,"./ShapeEllipse":22,"./ShapeFill":23,"./ShapeGradientFill":24,"./ShapeGradientStroke":25,"./ShapePath":26,"./ShapePolystar":27,"./ShapeRectangle":28,"./ShapeRepeater":29,"./ShapeRoundCorners":30,"./ShapeStroke":31,"./ShapeTrimPaths":32}],22:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeEllipse(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setSize(value) {
		Property(element.sh.s).setValue(value);
	}

	function setPosition(value) {
		Property(element.sh.p).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: {
					setValue: setSize
				}
			},
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeEllipse;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],23:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeFill(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setColor(value) {
		Property(element.c).setValue(value);
	}

	function setOpacity(value) {
		Property(element.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'color',
				value: {
					setValue: setColor
				}
			},
			{
				name: 'opacity',
				value: {
					setValue: setOpacity
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeFill;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],24:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientFill(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setStartPoint(value) {
		Property(element.s).setValue(value);
	}

	function setEndPoint(value) {
		Property(element.e).setValue(value);
	}

	function setOpacity(value) {
		Property(element.o).setValue(value);
	}

	function setHighlightLength(value) {
		Property(element.h).setValue(value);
	}

	function setHighlightAngle(value) {
		Property(element.a).setValue(value);
	}

	function setColors(value) {
		Property(element.g.prop).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: {
					setValue: setStartPoint
				}
			},
			{
				name: 'End Point',
				value: {
					setValue: setEndPoint
				}
			},
			{
				name: 'Opacity',
				value: {
					setValue: setOpacity
				}
			},
			{
				name: 'Highlight Length',
				value: {
					setValue: setHighlightLength
				}
			},
			{
				name: 'Highlight Angle',
				value: {
					setValue: setHighlightAngle
				}
			},
			{
				name: 'Colors',
				value: {
					setValue: setColors
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientFill;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],25:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientStroke(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setStartPoint(value) {
		Property(element.s).setValue(value);
	}

	function setEndPoint(value) {
		Property(element.e).setValue(value);
	}

	function setOpacity(value) {
		Property(element.o).setValue(value);
	}

	function setHighlightLength(value) {
		Property(element.h).setValue(value);
	}

	function setHighlightAngle(value) {
		Property(element.a).setValue(value);
	}

	function setColors(value) {
		Property(element.g.prop).setValue(value);
	}

	function setStrokeWidth(value) {
		Property(element.w).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: {
					setValue: setStartPoint
				}
			},
			{
				name: 'End Point',
				value: {
					setValue: setEndPoint
				}
			},
			{
				name: 'Opacity',
				value: {
					setValue: setOpacity
				}
			},
			{
				name: 'Highlight Length',
				value: {
					setValue: setHighlightLength
				}
			},
			{
				name: 'Highlight Angle',
				value: {
					setValue: setHighlightAngle
				}
			},
			{
				name: 'Colors',
				value: {
					setValue: setColors
				}
			},
			{
				name: 'Stroke Width',
				value: {
					setValue: setStrokeWidth
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientStroke;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],26:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePath(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setPath(value) {
		Property(element.sh).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'path',
				value: {
					setValue: setPath
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePath;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],27:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePolystar(element) {
	console.log(element);

	var state = {
		properties: _buildPropertyMap()
	}

	function setPoints(value) {
		Property(element.sh.pt).setValue(value);
	}

	function setPosition(value) {
		Property(element.sh.p).setValue(value);
	}

	function setRotation(value) {
		Property(element.sh.r).setValue(value);
	}

	function setInnerRadius(value) {
		Property(element.sh.ir).setValue(value);
	}

	function setOuterRadius(value) {
		Property(element.sh.or).setValue(value);
	}

	function setInnerRoundness(value) {
		Property(element.sh.is).setValue(value);
	}

	function setOuterRoundness(value) {
		Property(element.sh.os).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Points',
				value: {
					setValue: setPoints
				}
			},
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'Rotation',
				value: {
					setValue: setRotation
				}
			},
			{
				name: 'Inner Radius',
				value: {
					setValue: setInnerRadius
				}
			},
			{
				name: 'Outer Radius',
				value: {
					setValue: setOuterRadius
				}
			},
			{
				name: 'Inner Roundness',
				value: {
					setValue: setInnerRoundness
				}
			},
			{
				name: 'Outer Roundness',
				value: {
					setValue: setOuterRoundness
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePolystar;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],28:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRectangle(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setSize(value) {
		Property(element.sh.s).setValue(value);
	}

	function setPosition(value) {
		Property(element.sh.p).setValue(value);
	}

	function setRoundness(value) {
		Property(element.sh.r).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: {
					setValue: setSize
				}
			},
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'Roundness',
				value: {
					setValue: setRoundness
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRectangle;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],29:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":38,"../transform/Transform":37}],30:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRoundCorners(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setRadius(value) {
		Property(element.rd).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Radius',
				value: {
					setValue: setRadius
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRoundCorners;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],31:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeStroke(element) {
	var state = {
		properties: _buildPropertyMap()
	}

	function setColor(value) {
		Property(element.c).setValue(value);
	}

	function setOpacity(value) {
		Property(element.o).setValue(value);
	}

	function setStrokeWidth(value) {
		Property(element.w).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'color',
				value: {
					setValue: setColor
				}
			},
			{
				name: 'stroke width',
				value: {
					setValue: setStrokeWidth
				}
			},
			{
				name: 'opacity',
				value: {
					setValue: setOpacity
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeStroke
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],32:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeTrimPaths(element) {

	var state = {
		properties: _buildPropertyMap()
	}

	function setStart(value) {
		Property(element.s).setValue(value);
	}

	function setEnd(value) {
		Property(element.e).setValue(value);
	}

	function setOffset(value) {
		Property(element.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start',
				value: {
					setValue: setStart
				}
			},
			{
				name: 'End',
				value: {
					setValue: setEnd
				}
			},
			{
				name: 'Offset',
				value: {
					setValue: setOffset
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeTrimPaths;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],33:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Solid(element) {

	var instance = {};

	var state = {
		element: element,
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

module.exports = Solid;
},{"../LayerBase":13}],34:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var TextAnimator = require('./TextAnimator');

function Text(element) {

	var instance = {}

	var state = {
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":38,"./TextAnimator":35}],35:[function(require,module,exports){
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
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],36:[function(require,module,exports){
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
},{"../LayerBase":13,"./Text":34}],37:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Transform(props) {
	var state = {
		properties: _buildPropertyMap()
	}

	function setAnchorPoint(value) {
		Property(props.a).setValue(value);
	}

	function setPosition(value) {
		Property(props.p).setValue(value);
	}

	function setScale(value) {
		Property(props.s).setValue(value);
	}

	function setRotation(value) {
		Property(props.r).setValue(value);
	}

	function setXRotation(value) {
		Property(props.rx).setValue(value);
	}

	function setYRotation(value) {
		Property(props.ry).setValue(value);
	}

	function setZRotation(value) {
		Property(props.rz).setValue(value);
	}

	function setXPosition(value) {
		Property(props.px).setValue(value);
	}

	function setYPosition(value) {
		Property(props.py).setValue(value);
	}

	function setZPosition(value) {
		Property(props.pz).setValue(value);
	}

	function setOpacity(value) {
		Property(props.o).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name: 'Scale',
				value: {
					setValue: setScale
				}
			},
			{
				name: 'Rotation',
				value: {
					setValue: setRotation
				}
			},
			{
				name: 'X Position',
				value: {
					setValue: setXPosition
				}
			},
			{
				name: 'Y Position',
				value: {
					setValue: setYPosition
				}
			},
			{
				name: 'Z Position',
				value: {
					setValue: setZPosition
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
			},
			{
				name: 'Opacity',
				value: {
					setValue: setOpacity
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Transform;
},{"../../key_path/KeyPathNode":12,"../../property/Property":38}],38:[function(require,module,exports){
function Property(property) {
	
	function setValue(value) {
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

	var methods = {
		setValue: setValue
	}

	return Object.assign({}, methods);
}

module.exports = Property;
},{}],39:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0uanMiLCJzcmMvZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yLmpzIiwic3JjL2VudW1zL2xheWVyX3R5cGVzLmpzIiwic3JjL2VudW1zL3Byb3BlcnR5X25hbWVzLmpzIiwic3JjL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9sYXllckFQSUJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9zdHJpbmdTYW5pdGl6ZXIuanMiLCJzcmMvaGVscGVycy90cmFuc2Zvcm1hdGlvbk1hdHJpeC5qcyIsInNyYy9oZWxwZXJzL3R5cGVkQXJyYXlzLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhMaXN0LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhOb2RlLmpzIiwic3JjL2xheWVyL0xheWVyQmFzZS5qcyIsInNyYy9sYXllci9MYXllckxpc3QuanMiLCJzcmMvbGF5ZXIvY2FtZXJhL0NhbWVyYS5qcyIsInNyYy9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbi5qcyIsInNyYy9sYXllci9lZmZlY3RzL0VmZmVjdEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvZWZmZWN0cy9FZmZlY3RzLmpzIiwic3JjL2xheWVyL2ltYWdlL0ltYWdlRWxlbWVudC5qcyIsInNyYy9sYXllci9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGUuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVFbGxpcHNlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlRmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50RmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50U3Ryb2tlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUGF0aC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVBvbHlzdGFyLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUmVjdGFuZ2xlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUmVwZWF0ZXIuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVSb3VuZENvcm5lcnMuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVTdHJva2UuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVUcmltUGF0aHMuanMiLCJzcmMvbGF5ZXIvc29saWQvU29saWRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RleHQvVGV4dC5qcyIsInNyYy9sYXllci90ZXh0L1RleHRBbmltYXRvci5qcyIsInNyYy9sYXllci90ZXh0L1RleHRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RyYW5zZm9ybS9UcmFuc2Zvcm0uanMiLCJzcmMvcHJvcGVydHkvUHJvcGVydHkuanMiLCJzcmMvcmVuZGVyZXIvUmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL1JlbmRlcmVyJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG5cclxuZnVuY3Rpb24gQW5pbWF0aW9uSXRlbUZhY3RvcnkoYW5pbWF0aW9uKSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uLFxyXG5cdFx0ZWxlbWVudHM6IGFuaW1hdGlvbi5yZW5kZXJlci5lbGVtZW50cy5tYXAoKGl0ZW0pID0+IGxheWVyX2FwaShpdGVtKSlcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRGcmFtZSgpIHtcclxuXHRcdHJldHVybiBhbmltYXRpb24uY3VycmVudEZyYW1lO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKSB7XHJcblx0XHRyZXR1cm4gYW5pbWF0aW9uLmN1cnJlbnRGcmFtZSAvIGFuaW1hdGlvbi5mcmFtZVJhdGU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRWYWx1ZUNhbGxiYWNrKHByb3BlcnRpZXMsIHZhbHVlKSB7XHJcblx0XHR2YXIgaSwgbGVuID0gcHJvcGVydGllcy5sZW5ndGg7XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0cHJvcGVydGllcy5nZXRQcm9wZXJ0eUF0SW5kZXgoaSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gdG9LZXlwYXRoTGF5ZXJQb2ludChwcm9wZXJ0aWVzLCBwb2ludCkge1xyXG5cdFx0dmFyIGksIGxlbiA9IHByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdHJldHVybiBwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS50b0tleXBhdGhMYXllclBvaW50KHBvaW50KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZyb21LZXlwYXRoTGF5ZXJQb2ludChwcm9wZXJ0aWVzLCBwb2ludCkge1xyXG5cdFx0dmFyIGksIGxlbiA9IHByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdHJldHVybiBwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS5mcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0S2V5UGF0aCgpIHtcclxuXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldEN1cnJlbnRGcmFtZTogZ2V0Q3VycmVudEZyYW1lLFxyXG5cdFx0Z2V0S2V5UGF0aDogZ2V0S2V5UGF0aCxcclxuXHRcdGdldEN1cnJlbnRUaW1lOiBnZXRDdXJyZW50VGltZSxcclxuXHRcdGFkZFZhbHVlQ2FsbGJhY2s6IGFkZFZhbHVlQ2FsbGJhY2ssXHJcblx0XHR0b0tleXBhdGhMYXllclBvaW50OiB0b0tleXBhdGhMYXllclBvaW50LFxyXG5cdFx0ZnJvbUtleXBhdGhMYXllclBvaW50OiBmcm9tS2V5cGF0aExheWVyUG9pbnRcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBSZW5kZXJlcihzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbkl0ZW1GYWN0b3J5OyIsIm1vZHVsZS5leHBvcnRzID0gJywnOyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdCAwOiAwLFxyXG5cdCAxOiAxLFxyXG5cdCAyOiAyLFxyXG5cdCAzOiAzLFxyXG5cdCA0OiA0LFxyXG5cdCA1OiA1LFxyXG5cdCAxMzogMTMsXHJcblx0J2NvbXAnOiAwLFxyXG5cdCdjb21wb3NpdGlvbic6IDAsXHJcblx0J3NvbGlkJzogMSxcclxuXHQnaW1hZ2UnOiAyLFxyXG5cdCdudWxsJzogMyxcclxuXHQnc2hhcGUnOiA0LFxyXG5cdCd0ZXh0JzogNSxcclxuXHQnY2FtZXJhJzogMTNcclxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdExBWUVSX1RSQU5TRk9STTogJ3RyYW5zZm9ybSdcclxufSIsInZhciBrZXlfcGF0aF9zZXBhcmF0b3IgPSByZXF1aXJlKCcuLi9lbnVtcy9rZXlfcGF0aF9zZXBhcmF0b3InKTtcclxudmFyIHNhbml0aXplU3RyaW5nID0gcmVxdWlyZSgnLi9zdHJpbmdTYW5pdGl6ZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHJvcGVydHlQYXRoKSB7XHJcblx0dmFyIGtleVBhdGhTcGxpdCA9IHByb3BlcnR5UGF0aC5zcGxpdChrZXlfcGF0aF9zZXBhcmF0b3IpO1xyXG5cdHZhciBzZWxlY3RvciA9IGtleVBhdGhTcGxpdC5zaGlmdCgpO1xyXG5cdHJldHVybiB7XHJcblx0XHRzZWxlY3Rvcjogc2FuaXRpemVTdHJpbmcoc2VsZWN0b3IpLFxyXG5cdFx0cHJvcGVydHlQYXRoOiBrZXlQYXRoU3BsaXQuam9pbihrZXlfcGF0aF9zZXBhcmF0b3IpXHJcblx0fVxyXG59IiwidmFyIFRleHRFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvdGV4dC9UZXh0RWxlbWVudCcpO1xyXG52YXIgU2hhcGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvc2hhcGUvU2hhcGUnKTtcclxudmFyIE51bGxFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvbnVsbF9lbGVtZW50L051bGxFbGVtZW50Jyk7XHJcbnZhciBTb2xpZEVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9zb2xpZC9Tb2xpZEVsZW1lbnQnKTtcclxudmFyIEltYWdlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL2ltYWdlL0ltYWdlRWxlbWVudCcpO1xyXG52YXIgQ2FtZXJhRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL2NhbWVyYS9DYW1lcmEnKTtcclxudmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL2xheWVyL0xheWVyQmFzZScpO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0TGF5ZXJBcGkoZWxlbWVudCkge1xyXG5cdHZhciBsYXllclR5cGUgPSBlbGVtZW50LmRhdGEudHk7XHJcblx0dmFyIENvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi4vbGF5ZXIvY29tcG9zaXRpb24vQ29tcG9zaXRpb24nKTtcclxuXHRzd2l0Y2gobGF5ZXJUeXBlKSB7XHJcblx0XHRjYXNlIDA6XHJcblx0XHRyZXR1cm4gQ29tcG9zaXRpb24oZWxlbWVudCk7XHJcblx0XHRjYXNlIDE6XHJcblx0XHRyZXR1cm4gU29saWRFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSAyOlxyXG5cdFx0cmV0dXJuIEltYWdlRWxlbWVudChlbGVtZW50KTtcclxuXHRcdGNhc2UgMzpcclxuXHRcdHJldHVybiBOdWxsRWxlbWVudChlbGVtZW50KTtcclxuXHRcdGNhc2UgNDpcclxuXHRcdHJldHVybiBTaGFwZUVsZW1lbnQoZWxlbWVudCwgZWxlbWVudC5kYXRhLnNoYXBlcywgZWxlbWVudC5pdGVtc0RhdGEpO1xyXG5cdFx0Y2FzZSA1OlxyXG5cdFx0cmV0dXJuIFRleHRFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSAxMzpcclxuXHRcdHJldHVybiBDYW1lcmFFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdHJldHVybiBMYXllckJhc2UoZWxlbWVudCk7XHJcblx0fVxyXG59IiwiZnVuY3Rpb24gc2FuaXRpemVTdHJpbmcoc3RyaW5nKSB7XHJcblx0cmV0dXJuIHN0cmluZy50cmltKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FuaXRpemVTdHJpbmciLCJ2YXIgY3JlYXRlVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vdHlwZWRBcnJheXMnKVxyXG5cclxuLyohXHJcbiBUcmFuc2Zvcm1hdGlvbiBNYXRyaXggdjIuMFxyXG4gKGMpIEVwaXN0ZW1leCAyMDE0LTIwMTVcclxuIHd3dy5lcGlzdGVtZXguY29tXHJcbiBCeSBLZW4gRnlyc3RlbmJlcmdcclxuIENvbnRyaWJ1dGlvbnMgYnkgbGVlb25peWEuXHJcbiBMaWNlbnNlOiBNSVQsIGhlYWRlciByZXF1aXJlZC5cclxuICovXHJcblxyXG4vKipcclxuICogMkQgdHJhbnNmb3JtYXRpb24gbWF0cml4IG9iamVjdCBpbml0aWFsaXplZCB3aXRoIGlkZW50aXR5IG1hdHJpeC5cclxuICpcclxuICogVGhlIG1hdHJpeCBjYW4gc3luY2hyb25pemUgYSBjYW52YXMgY29udGV4dCBieSBzdXBwbHlpbmcgdGhlIGNvbnRleHRcclxuICogYXMgYW4gYXJndW1lbnQsIG9yIGxhdGVyIGFwcGx5IGN1cnJlbnQgYWJzb2x1dGUgdHJhbnNmb3JtIHRvIGFuXHJcbiAqIGV4aXN0aW5nIGNvbnRleHQuXHJcbiAqXHJcbiAqIEFsbCB2YWx1ZXMgYXJlIGhhbmRsZWQgYXMgZmxvYXRpbmcgcG9pbnQgdmFsdWVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gW2NvbnRleHRdIC0gT3B0aW9uYWwgY29udGV4dCB0byBzeW5jIHdpdGggTWF0cml4XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGEgLSBzY2FsZSB4XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGIgLSBzaGVhciB5XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGMgLSBzaGVhciB4XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGQgLSBzY2FsZSB5XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGUgLSB0cmFuc2xhdGUgeFxyXG4gKiBAcHJvcCB7bnVtYmVyfSBmIC0gdHJhbnNsYXRlIHlcclxuICogQHByb3Age0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRHxudWxsfSBbY29udGV4dD1udWxsXSAtIHNldCBvciBnZXQgY3VycmVudCBjYW52YXMgY29udGV4dFxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcblxyXG52YXIgTWF0cml4ID0gKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIF9jb3MgPSBNYXRoLmNvcztcclxuICAgIHZhciBfc2luID0gTWF0aC5zaW47XHJcbiAgICB2YXIgX3RhbiA9IE1hdGgudGFuO1xyXG4gICAgdmFyIF9ybmQgPSBNYXRoLnJvdW5kO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2V0KCl7XHJcbiAgICAgICAgdGhpcy5wcm9wc1swXSA9IDE7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1syXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1szXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s0XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s1XSA9IDE7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s2XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s3XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s4XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1s5XSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMF0gPSAxO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTFdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzEyXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxM10gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTRdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzE1XSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlKGFuZ2xlKSB7XHJcbiAgICAgICAgaWYoYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KG1Db3MsIC1tU2luLCAgMCwgMCwgbVNpbiwgIG1Db3MsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlWChhbmdsZSl7XHJcbiAgICAgICAgaWYoYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KDEsIDAsIDAsIDAsIDAsIG1Db3MsIC1tU2luLCAwLCAwLCBtU2luLCAgbUNvcywgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlWShhbmdsZSl7XHJcbiAgICAgICAgaWYoYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KG1Db3MsICAwLCAgbVNpbiwgMCwgMCwgMSwgMCwgMCwgLW1TaW4sICAwLCAgbUNvcywgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlWihhbmdsZSl7XHJcbiAgICAgICAgaWYoYW5nbGUgPT09IDApe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KG1Db3MsIC1tU2luLCAgMCwgMCwgbVNpbiwgIG1Db3MsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2hlYXIoc3gsc3kpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KDEsIHN5LCBzeCwgMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2tldyhheCwgYXkpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNoZWFyKF90YW4oYXgpLCBfdGFuKGF5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2tld0Zyb21BeGlzKGF4LCBhbmdsZSl7XHJcbiAgICAgICAgdmFyIG1Db3MgPSBfY29zKGFuZ2xlKTtcclxuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90KG1Db3MsIG1TaW4sICAwLCAwLCAtbVNpbiwgIG1Db3MsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSlcclxuICAgICAgICAgICAgLl90KDEsIDAsICAwLCAwLCBfdGFuKGF4KSwgIDEsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSlcclxuICAgICAgICAgICAgLl90KG1Db3MsIC1tU2luLCAgMCwgMCwgbVNpbiwgIG1Db3MsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5fdChtQ29zLCBtU2luLCAtbVNpbiwgbUNvcywgMCwgMCkuX3QoMSwgMCwgX3RhbihheCksIDEsIDAsIDApLl90KG1Db3MsIC1tU2luLCBtU2luLCBtQ29zLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzY2FsZShzeCwgc3ksIHN6KSB7XHJcbiAgICAgICAgc3ogPSBpc05hTihzeikgPyAxIDogc3o7XHJcbiAgICAgICAgaWYoc3ggPT0gMSAmJiBzeSA9PSAxICYmIHN6ID09IDEpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Qoc3gsIDAsIDAsIDAsIDAsIHN5LCAwLCAwLCAwLCAwLCBzeiwgMCwgMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0VHJhbnNmb3JtKGEsIGIsIGMsIGQsIGUsIGYsIGcsIGgsIGksIGosIGssIGwsIG0sIG4sIG8sIHApIHtcclxuICAgICAgICB0aGlzLnByb3BzWzBdID0gYTtcclxuICAgICAgICB0aGlzLnByb3BzWzFdID0gYjtcclxuICAgICAgICB0aGlzLnByb3BzWzJdID0gYztcclxuICAgICAgICB0aGlzLnByb3BzWzNdID0gZDtcclxuICAgICAgICB0aGlzLnByb3BzWzRdID0gZTtcclxuICAgICAgICB0aGlzLnByb3BzWzVdID0gZjtcclxuICAgICAgICB0aGlzLnByb3BzWzZdID0gZztcclxuICAgICAgICB0aGlzLnByb3BzWzddID0gaDtcclxuICAgICAgICB0aGlzLnByb3BzWzhdID0gaTtcclxuICAgICAgICB0aGlzLnByb3BzWzldID0gajtcclxuICAgICAgICB0aGlzLnByb3BzWzEwXSA9IGs7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMV0gPSBsO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTJdID0gbTtcclxuICAgICAgICB0aGlzLnByb3BzWzEzXSA9IG47XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxNF0gPSBvO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTVdID0gcDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUodHgsIHR5LCB0eikge1xyXG4gICAgICAgIHR6ID0gdHogfHwgMDtcclxuICAgICAgICBpZih0eCAhPT0gMCB8fCB0eSAhPT0gMCB8fCB0eiAhPT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90KDEsMCwwLDAsMCwxLDAsMCwwLDAsMSwwLHR4LHR5LHR6LDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm0oYTIsIGIyLCBjMiwgZDIsIGUyLCBmMiwgZzIsIGgyLCBpMiwgajIsIGsyLCBsMiwgbTIsIG4yLCBvMiwgcDIpIHtcclxuXHJcbiAgICAgICAgdmFyIF9wID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgaWYoYTIgPT09IDEgJiYgYjIgPT09IDAgJiYgYzIgPT09IDAgJiYgZDIgPT09IDAgJiYgZTIgPT09IDAgJiYgZjIgPT09IDEgJiYgZzIgPT09IDAgJiYgaDIgPT09IDAgJiYgaTIgPT09IDAgJiYgajIgPT09IDAgJiYgazIgPT09IDEgJiYgbDIgPT09IDApe1xyXG4gICAgICAgICAgICAvL05PVEU6IGNvbW1lbnRpbmcgdGhpcyBjb25kaXRpb24gYmVjYXVzZSBUdXJib0ZhbiBkZW9wdGltaXplcyBjb2RlIHdoZW4gcHJlc2VudFxyXG4gICAgICAgICAgICAvL2lmKG0yICE9PSAwIHx8IG4yICE9PSAwIHx8IG8yICE9PSAwKXtcclxuICAgICAgICAgICAgICAgIF9wWzEyXSA9IF9wWzEyXSAqIGEyICsgX3BbMTVdICogbTI7XHJcbiAgICAgICAgICAgICAgICBfcFsxM10gPSBfcFsxM10gKiBmMiArIF9wWzE1XSAqIG4yO1xyXG4gICAgICAgICAgICAgICAgX3BbMTRdID0gX3BbMTRdICogazIgKyBfcFsxNV0gKiBvMjtcclxuICAgICAgICAgICAgICAgIF9wWzE1XSA9IF9wWzE1XSAqIHAyO1xyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGExID0gX3BbMF07XHJcbiAgICAgICAgdmFyIGIxID0gX3BbMV07XHJcbiAgICAgICAgdmFyIGMxID0gX3BbMl07XHJcbiAgICAgICAgdmFyIGQxID0gX3BbM107XHJcbiAgICAgICAgdmFyIGUxID0gX3BbNF07XHJcbiAgICAgICAgdmFyIGYxID0gX3BbNV07XHJcbiAgICAgICAgdmFyIGcxID0gX3BbNl07XHJcbiAgICAgICAgdmFyIGgxID0gX3BbN107XHJcbiAgICAgICAgdmFyIGkxID0gX3BbOF07XHJcbiAgICAgICAgdmFyIGoxID0gX3BbOV07XHJcbiAgICAgICAgdmFyIGsxID0gX3BbMTBdO1xyXG4gICAgICAgIHZhciBsMSA9IF9wWzExXTtcclxuICAgICAgICB2YXIgbTEgPSBfcFsxMl07XHJcbiAgICAgICAgdmFyIG4xID0gX3BbMTNdO1xyXG4gICAgICAgIHZhciBvMSA9IF9wWzE0XTtcclxuICAgICAgICB2YXIgcDEgPSBfcFsxNV07XHJcblxyXG4gICAgICAgIC8qIG1hdHJpeCBvcmRlciAoY2FudmFzIGNvbXBhdGlibGUpOlxyXG4gICAgICAgICAqIGFjZVxyXG4gICAgICAgICAqIGJkZlxyXG4gICAgICAgICAqIDAwMVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF9wWzBdID0gYTEgKiBhMiArIGIxICogZTIgKyBjMSAqIGkyICsgZDEgKiBtMjtcclxuICAgICAgICBfcFsxXSA9IGExICogYjIgKyBiMSAqIGYyICsgYzEgKiBqMiArIGQxICogbjIgO1xyXG4gICAgICAgIF9wWzJdID0gYTEgKiBjMiArIGIxICogZzIgKyBjMSAqIGsyICsgZDEgKiBvMiA7XHJcbiAgICAgICAgX3BbM10gPSBhMSAqIGQyICsgYjEgKiBoMiArIGMxICogbDIgKyBkMSAqIHAyIDtcclxuXHJcbiAgICAgICAgX3BbNF0gPSBlMSAqIGEyICsgZjEgKiBlMiArIGcxICogaTIgKyBoMSAqIG0yIDtcclxuICAgICAgICBfcFs1XSA9IGUxICogYjIgKyBmMSAqIGYyICsgZzEgKiBqMiArIGgxICogbjIgO1xyXG4gICAgICAgIF9wWzZdID0gZTEgKiBjMiArIGYxICogZzIgKyBnMSAqIGsyICsgaDEgKiBvMiA7XHJcbiAgICAgICAgX3BbN10gPSBlMSAqIGQyICsgZjEgKiBoMiArIGcxICogbDIgKyBoMSAqIHAyIDtcclxuXHJcbiAgICAgICAgX3BbOF0gPSBpMSAqIGEyICsgajEgKiBlMiArIGsxICogaTIgKyBsMSAqIG0yIDtcclxuICAgICAgICBfcFs5XSA9IGkxICogYjIgKyBqMSAqIGYyICsgazEgKiBqMiArIGwxICogbjIgO1xyXG4gICAgICAgIF9wWzEwXSA9IGkxICogYzIgKyBqMSAqIGcyICsgazEgKiBrMiArIGwxICogbzIgO1xyXG4gICAgICAgIF9wWzExXSA9IGkxICogZDIgKyBqMSAqIGgyICsgazEgKiBsMiArIGwxICogcDIgO1xyXG5cclxuICAgICAgICBfcFsxMl0gPSBtMSAqIGEyICsgbjEgKiBlMiArIG8xICogaTIgKyBwMSAqIG0yIDtcclxuICAgICAgICBfcFsxM10gPSBtMSAqIGIyICsgbjEgKiBmMiArIG8xICogajIgKyBwMSAqIG4yIDtcclxuICAgICAgICBfcFsxNF0gPSBtMSAqIGMyICsgbjEgKiBnMiArIG8xICogazIgKyBwMSAqIG8yIDtcclxuICAgICAgICBfcFsxNV0gPSBtMSAqIGQyICsgbjEgKiBoMiArIG8xICogbDIgKyBwMSAqIHAyIDtcclxuXHJcbiAgICAgICAgdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXNJZGVudGl0eSgpIHtcclxuICAgICAgICBpZighdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkKXtcclxuICAgICAgICAgICAgdGhpcy5faWRlbnRpdHkgPSAhKHRoaXMucHJvcHNbMF0gIT09IDEgfHwgdGhpcy5wcm9wc1sxXSAhPT0gMCB8fCB0aGlzLnByb3BzWzJdICE9PSAwIHx8IHRoaXMucHJvcHNbM10gIT09IDAgfHwgdGhpcy5wcm9wc1s0XSAhPT0gMCB8fCB0aGlzLnByb3BzWzVdICE9PSAxIHx8IHRoaXMucHJvcHNbNl0gIT09IDAgfHwgdGhpcy5wcm9wc1s3XSAhPT0gMCB8fCB0aGlzLnByb3BzWzhdICE9PSAwIHx8IHRoaXMucHJvcHNbOV0gIT09IDAgfHwgdGhpcy5wcm9wc1sxMF0gIT09IDEgfHwgdGhpcy5wcm9wc1sxMV0gIT09IDAgfHwgdGhpcy5wcm9wc1sxMl0gIT09IDAgfHwgdGhpcy5wcm9wc1sxM10gIT09IDAgfHwgdGhpcy5wcm9wc1sxNF0gIT09IDAgfHwgdGhpcy5wcm9wc1sxNV0gIT09IDEpO1xyXG4gICAgICAgICAgICB0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5faWRlbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZXF1YWxzKG1hdHIpe1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB3aGlsZSAoaSA8IDE2KSB7XHJcbiAgICAgICAgICAgIGlmKG1hdHIucHJvcHNbaV0gIT09IHRoaXMucHJvcHNbaV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKz0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9uZShtYXRyKXtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICBmb3IoaT0wO2k8MTY7aSs9MSl7XHJcbiAgICAgICAgICAgIG1hdHIucHJvcHNbaV0gPSB0aGlzLnByb3BzW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9uZUZyb21Qcm9wcyhwcm9wcyl7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZm9yKGk9MDtpPDE2O2krPTEpe1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzW2ldID0gcHJvcHNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9Qb2ludCh4LCB5LCB6KSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IHggKiB0aGlzLnByb3BzWzBdICsgeSAqIHRoaXMucHJvcHNbNF0gKyB6ICogdGhpcy5wcm9wc1s4XSArIHRoaXMucHJvcHNbMTJdLFxyXG4gICAgICAgICAgICB5OiB4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgeiAqIHRoaXMucHJvcHNbOV0gKyB0aGlzLnByb3BzWzEzXSxcclxuICAgICAgICAgICAgejogeCAqIHRoaXMucHJvcHNbMl0gKyB5ICogdGhpcy5wcm9wc1s2XSArIHogKiB0aGlzLnByb3BzWzEwXSArIHRoaXMucHJvcHNbMTRdXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKnJldHVybiB7XHJcbiAgICAgICAgIHg6IHggKiBtZS5hICsgeSAqIG1lLmMgKyBtZS5lLFxyXG4gICAgICAgICB5OiB4ICogbWUuYiArIHkgKiBtZS5kICsgbWUuZlxyXG4gICAgICAgICB9OyovXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBhcHBseVRvWCh4LCB5LCB6KSB7XHJcbiAgICAgICAgcmV0dXJuIHggKiB0aGlzLnByb3BzWzBdICsgeSAqIHRoaXMucHJvcHNbNF0gKyB6ICogdGhpcy5wcm9wc1s4XSArIHRoaXMucHJvcHNbMTJdO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1koeCwgeSwgeikge1xyXG4gICAgICAgIHJldHVybiB4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgeiAqIHRoaXMucHJvcHNbOV0gKyB0aGlzLnByb3BzWzEzXTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9aKHgsIHksIHopIHtcclxuICAgICAgICByZXR1cm4geCAqIHRoaXMucHJvcHNbMl0gKyB5ICogdGhpcy5wcm9wc1s2XSArIHogKiB0aGlzLnByb3BzWzEwXSArIHRoaXMucHJvcHNbMTRdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGludmVyc2VQb2ludChwdCkge1xyXG4gICAgICAgIHZhciBkZXRlcm1pbmFudCA9IHRoaXMucHJvcHNbMF0gKiB0aGlzLnByb3BzWzVdIC0gdGhpcy5wcm9wc1sxXSAqIHRoaXMucHJvcHNbNF07XHJcbiAgICAgICAgdmFyIGEgPSB0aGlzLnByb3BzWzVdL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBiID0gLSB0aGlzLnByb3BzWzFdL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBjID0gLSB0aGlzLnByb3BzWzRdL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBkID0gdGhpcy5wcm9wc1swXS9kZXRlcm1pbmFudDtcclxuICAgICAgICB2YXIgZSA9ICh0aGlzLnByb3BzWzRdICogdGhpcy5wcm9wc1sxM10gLSB0aGlzLnByb3BzWzVdICogdGhpcy5wcm9wc1sxMl0pL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBmID0gLSAodGhpcy5wcm9wc1swXSAqIHRoaXMucHJvcHNbMTNdIC0gdGhpcy5wcm9wc1sxXSAqIHRoaXMucHJvcHNbMTJdKS9kZXRlcm1pbmFudDtcclxuICAgICAgICByZXR1cm4gW3B0WzBdICogYSArIHB0WzFdICogYyArIGUsIHB0WzBdICogYiArIHB0WzFdICogZCArIGYsIDBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGludmVyc2VQb2ludHMocHRzKXtcclxuICAgICAgICB2YXIgaSwgbGVuID0gcHRzLmxlbmd0aCwgcmV0UHRzID0gW107XHJcbiAgICAgICAgZm9yKGk9MDtpPGxlbjtpKz0xKXtcclxuICAgICAgICAgICAgcmV0UHRzW2ldID0gaW52ZXJzZVBvaW50KHB0c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXRQdHM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1RyaXBsZVBvaW50cyhwdDEsIHB0MiwgcHQzKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IGNyZWF0ZVR5cGVkQXJyYXkoJ2Zsb2F0MzInLCA2KTtcclxuICAgICAgICBpZih0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgICAgICBhcnJbMF0gPSBwdDFbMF07XHJcbiAgICAgICAgICAgIGFyclsxXSA9IHB0MVsxXTtcclxuICAgICAgICAgICAgYXJyWzJdID0gcHQyWzBdO1xyXG4gICAgICAgICAgICBhcnJbM10gPSBwdDJbMV07XHJcbiAgICAgICAgICAgIGFycls0XSA9IHB0M1swXTtcclxuICAgICAgICAgICAgYXJyWzVdID0gcHQzWzFdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBwMCA9IHRoaXMucHJvcHNbMF0sIHAxID0gdGhpcy5wcm9wc1sxXSwgcDQgPSB0aGlzLnByb3BzWzRdLCBwNSA9IHRoaXMucHJvcHNbNV0sIHAxMiA9IHRoaXMucHJvcHNbMTJdLCBwMTMgPSB0aGlzLnByb3BzWzEzXTtcclxuICAgICAgICAgICAgYXJyWzBdID0gcHQxWzBdICogcDAgKyBwdDFbMV0gKiBwNCArIHAxMjtcclxuICAgICAgICAgICAgYXJyWzFdID0gcHQxWzBdICogcDEgKyBwdDFbMV0gKiBwNSArIHAxMztcclxuICAgICAgICAgICAgYXJyWzJdID0gcHQyWzBdICogcDAgKyBwdDJbMV0gKiBwNCArIHAxMjtcclxuICAgICAgICAgICAgYXJyWzNdID0gcHQyWzBdICogcDEgKyBwdDJbMV0gKiBwNSArIHAxMztcclxuICAgICAgICAgICAgYXJyWzRdID0gcHQzWzBdICogcDAgKyBwdDNbMV0gKiBwNCArIHAxMjtcclxuICAgICAgICAgICAgYXJyWzVdID0gcHQzWzBdICogcDEgKyBwdDNbMV0gKiBwNSArIHAxMztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseVRvUG9pbnRBcnJheSh4LHkseil7XHJcbiAgICAgICAgdmFyIGFycjtcclxuICAgICAgICBpZih0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgICAgICBhcnIgPSBbeCx5LHpdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFyciA9IFt4ICogdGhpcy5wcm9wc1swXSArIHkgKiB0aGlzLnByb3BzWzRdICsgeiAqIHRoaXMucHJvcHNbOF0gKyB0aGlzLnByb3BzWzEyXSx4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgeiAqIHRoaXMucHJvcHNbOV0gKyB0aGlzLnByb3BzWzEzXSx4ICogdGhpcy5wcm9wc1syXSArIHkgKiB0aGlzLnByb3BzWzZdICsgeiAqIHRoaXMucHJvcHNbMTBdICsgdGhpcy5wcm9wc1sxNF1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9Qb2ludFN0cmluZ2lmaWVkKHgsIHkpIHtcclxuICAgICAgICBpZih0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geCArICcsJyArIHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoeCAqIHRoaXMucHJvcHNbMF0gKyB5ICogdGhpcy5wcm9wc1s0XSArIHRoaXMucHJvcHNbMTJdKSsnLCcrKHggKiB0aGlzLnByb3BzWzFdICsgeSAqIHRoaXMucHJvcHNbNV0gKyB0aGlzLnByb3BzWzEzXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9DU1MoKSB7XHJcbiAgICAgICAgLy9Eb2Vzbid0IG1ha2UgbXVjaCBzZW5zZSB0byBhZGQgdGhpcyBvcHRpbWl6YXRpb24uIElmIGl0IGlzIGFuIGlkZW50aXR5IG1hdHJpeCwgaXQncyB2ZXJ5IGxpa2VseSB0aGlzIHdpbGwgZ2V0IGNhbGxlZCBvbmx5IG9uY2Ugc2luY2UgaXQgd29uJ3QgYmUga2V5ZnJhbWVkLlxyXG4gICAgICAgIC8qaWYodGhpcy5pc0lkZW50aXR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHZhciBjc3NWYWx1ZSA9ICdtYXRyaXgzZCgnO1xyXG4gICAgICAgIHZhciB2ID0gMTAwMDA7XHJcbiAgICAgICAgd2hpbGUoaTwxNil7XHJcbiAgICAgICAgICAgIGNzc1ZhbHVlICs9IF9ybmQocHJvcHNbaV0qdikvdjtcclxuICAgICAgICAgICAgY3NzVmFsdWUgKz0gaSA9PT0gMTUgPyAnKSc6JywnO1xyXG4gICAgICAgICAgICBpICs9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjc3NWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0bzJkQ1NTKCkge1xyXG4gICAgICAgIC8vRG9lc24ndCBtYWtlIG11Y2ggc2Vuc2UgdG8gYWRkIHRoaXMgb3B0aW1pemF0aW9uLiBJZiBpdCBpcyBhbiBpZGVudGl0eSBtYXRyaXgsIGl0J3MgdmVyeSBsaWtlbHkgdGhpcyB3aWxsIGdldCBjYWxsZWQgb25seSBvbmNlIHNpbmNlIGl0IHdvbid0IGJlIGtleWZyYW1lZC5cclxuICAgICAgICAvKmlmKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9Ki9cclxuICAgICAgICB2YXIgdiA9IDEwMDAwO1xyXG4gICAgICAgIHZhciBwcm9wcyA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIFwibWF0cml4KFwiICsgX3JuZChwcm9wc1swXSp2KS92ICsgJywnICsgX3JuZChwcm9wc1sxXSp2KS92ICsgJywnICsgX3JuZChwcm9wc1s0XSp2KS92ICsgJywnICsgX3JuZChwcm9wc1s1XSp2KS92ICsgJywnICsgX3JuZChwcm9wc1sxMl0qdikvdiArICcsJyArIF9ybmQocHJvcHNbMTNdKnYpL3YgKyBcIilcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBNYXRyaXhJbnN0YW5jZSgpe1xyXG4gICAgICAgIHRoaXMucmVzZXQgPSByZXNldDtcclxuICAgICAgICB0aGlzLnJvdGF0ZSA9IHJvdGF0ZTtcclxuICAgICAgICB0aGlzLnJvdGF0ZVggPSByb3RhdGVYO1xyXG4gICAgICAgIHRoaXMucm90YXRlWSA9IHJvdGF0ZVk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVaID0gcm90YXRlWjtcclxuICAgICAgICB0aGlzLnNrZXcgPSBza2V3O1xyXG4gICAgICAgIHRoaXMuc2tld0Zyb21BeGlzID0gc2tld0Zyb21BeGlzO1xyXG4gICAgICAgIHRoaXMuc2hlYXIgPSBzaGVhcjtcclxuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcbiAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm0gPSBzZXRUcmFuc2Zvcm07XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XHJcbiAgICAgICAgdGhpcy5hcHBseVRvUG9pbnQgPSBhcHBseVRvUG9pbnQ7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvWCA9IGFwcGx5VG9YO1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1kgPSBhcHBseVRvWTtcclxuICAgICAgICB0aGlzLmFwcGx5VG9aID0gYXBwbHlUb1o7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvUG9pbnRBcnJheSA9IGFwcGx5VG9Qb2ludEFycmF5O1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1RyaXBsZVBvaW50cyA9IGFwcGx5VG9UcmlwbGVQb2ludHM7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvUG9pbnRTdHJpbmdpZmllZCA9IGFwcGx5VG9Qb2ludFN0cmluZ2lmaWVkO1xyXG4gICAgICAgIHRoaXMudG9DU1MgPSB0b0NTUztcclxuICAgICAgICB0aGlzLnRvMmRDU1MgPSB0bzJkQ1NTO1xyXG4gICAgICAgIHRoaXMuY2xvbmUgPSBjbG9uZTtcclxuICAgICAgICB0aGlzLmNsb25lRnJvbVByb3BzID0gY2xvbmVGcm9tUHJvcHM7XHJcbiAgICAgICAgdGhpcy5lcXVhbHMgPSBlcXVhbHM7XHJcbiAgICAgICAgdGhpcy5pbnZlcnNlUG9pbnRzID0gaW52ZXJzZVBvaW50cztcclxuICAgICAgICB0aGlzLmludmVyc2VQb2ludCA9IGludmVyc2VQb2ludDtcclxuICAgICAgICB0aGlzLl90ID0gdGhpcy50cmFuc2Zvcm07XHJcbiAgICAgICAgdGhpcy5pc0lkZW50aXR5ID0gaXNJZGVudGl0eTtcclxuICAgICAgICB0aGlzLl9pZGVudGl0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMgPSBjcmVhdGVUeXBlZEFycmF5KCdmbG9hdDMyJywgMTYpO1xyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4SW5zdGFuY2UoKVxyXG4gICAgfVxyXG59KCkpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg7IiwidmFyIGNyZWF0ZVR5cGVkQXJyYXkgPSAoZnVuY3Rpb24oKXtcclxuXHRmdW5jdGlvbiBjcmVhdGVSZWd1bGFyQXJyYXkodHlwZSwgbGVuKXtcclxuXHRcdHZhciBpID0gMCwgYXJyID0gW10sIHZhbHVlO1xyXG5cdFx0c3dpdGNoKHR5cGUpIHtcclxuXHRcdFx0Y2FzZSAnaW50MTYnOlxyXG5cdFx0XHRjYXNlICd1aW50OGMnOlxyXG5cdFx0XHRcdHZhbHVlID0gMTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR2YWx1ZSA9IDEuMTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdGFyci5wdXNoKHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhcnI7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGNyZWF0ZVR5cGVkQXJyYXkodHlwZSwgbGVuKXtcclxuXHRcdGlmKHR5cGUgPT09ICdmbG9hdDMyJykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShsZW4pO1xyXG5cdFx0fSBlbHNlIGlmKHR5cGUgPT09ICdpbnQxNicpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBJbnQxNkFycmF5KGxlbik7XHJcblx0XHR9IGVsc2UgaWYodHlwZSA9PT0gJ3VpbnQ4YycpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBVaW50OENsYW1wZWRBcnJheShsZW4pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZih0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIEZsb2F0MzJBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0cmV0dXJuIGNyZWF0ZVR5cGVkQXJyYXk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiBjcmVhdGVSZWd1bGFyQXJyYXk7XHJcblx0fVxyXG59KCkpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUeXBlZEFycmF5O1xyXG4iLCJ2YXIgQW5pbWF0aW9uSXRlbSA9IHJlcXVpcmUoJy4vYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0nKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUFuaW1hdGlvbkFwaShhbmltKSB7XHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIEFuaW1hdGlvbkl0ZW0oYW5pbSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRjcmVhdGVBbmltYXRpb25BcGkgOiBjcmVhdGVBbmltYXRpb25BcGlcclxufSIsInZhciBrZXlQYXRoQnVpbGRlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXInKTtcclxudmFyIGxheWVyX3R5cGVzID0gcmVxdWlyZSgnLi4vZW51bXMvbGF5ZXJfdHlwZXMnKTtcclxuXHJcbmZ1bmN0aW9uIEtleVBhdGhMaXN0KGVsZW1lbnRzLCBub2RlX3R5cGUpIHtcclxuXHJcblx0ZnVuY3Rpb24gX2dldExlbmd0aCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5sZW5ndGg7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRUYXJnZXRMYXllcigpLmRhdGEudHkgPT09IGxheWVyX3R5cGVzW3R5cGVdO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIG5hbWUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRUYXJnZXRMYXllcigpLmRhdGEubm0gPT09IG5hbWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5UHJvcGVydHkoZWxlbWVudHMsIG5hbWUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRpZihlbGVtZW50Lmhhc1Byb3BlcnR5KG5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0UHJvcGVydHkobmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeVR5cGUoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHNlbGVjdG9yKSwgJ2xheWVyJyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeU5hbWUoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIHNlbGVjdG9yKSwgJ2xheWVyJyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRQcm9wZXJ0aWVzQnlTZWxlY3RvcihzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50Lmhhc1Byb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldFByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pLCAncHJvcGVydHknKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyUHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHZhciBsYXllcnMgPSBfZmlsdGVyTGF5ZXJCeVByb3BlcnR5KGVsZW1lbnRzLCBzZWxlY3Rvcik7XHJcblx0XHR2YXIgcHJvcGVydGllcyA9IGxheWVycy5tYXAoZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldFByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QocHJvcGVydGllcywgJ3Byb3BlcnR5Jyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRLZXlQYXRoKHByb3BlcnR5UGF0aCkge1xyXG5cdFx0dmFyIGtleVBhdGhEYXRhID0ga2V5UGF0aEJ1aWxkZXIocHJvcGVydHlQYXRoKTtcclxuXHRcdHZhciBzZWxlY3RvciA9IGtleVBhdGhEYXRhLnNlbGVjdG9yO1xyXG5cdFx0dmFyIG5vZGVzQnlOYW1lLCBub2Rlc0J5VHlwZSwgc2VsZWN0ZWROb2RlcztcclxuXHRcdGlmIChub2RlX3R5cGUgPT09ICdyZW5kZXJlcicgfHwgbm9kZV90eXBlID09PSAnbGF5ZXInKSB7XHJcblx0XHRcdG5vZGVzQnlOYW1lID0gZ2V0TGF5ZXJzQnlOYW1lKHNlbGVjdG9yKTtcclxuXHRcdFx0bm9kZXNCeVR5cGUgPSBnZXRMYXllcnNCeVR5cGUoc2VsZWN0b3IpO1xyXG5cdFx0XHRpZiAobm9kZXNCeU5hbWUubGVuZ3RoID09PSAwICYmIG5vZGVzQnlUeXBlLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdHNlbGVjdGVkTm9kZXMgPSBnZXRMYXllclByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZWxlY3RlZE5vZGVzID0gbm9kZXNCeU5hbWUuY29uY2F0KG5vZGVzQnlUeXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXMuZ2V0S2V5UGF0aChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYobm9kZV90eXBlID09PSAncHJvcGVydHknKSB7XHJcblx0XHRcdHNlbGVjdGVkTm9kZXMgPSBnZXRQcm9wZXJ0aWVzQnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdGlmIChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2Rlcy5nZXRLZXlQYXRoKGtleVBhdGhEYXRhLnByb3BlcnR5UGF0aCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbmNhdChub2Rlcykge1xyXG5cdFx0dmFyIG5vZGVzRWxlbWVudHMgPSBub2Rlcy5nZXRFbGVtZW50cygpO1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KGVsZW1lbnRzLmNvbmNhdChub2Rlc0VsZW1lbnRzKSwgbm9kZV90eXBlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEVsZW1lbnRzKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHlBdEluZGV4KGluZGV4KSB7XHJcblx0XHRpZihub2RlX3R5cGUgPT09ICdsYXllcicpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnRzW2luZGV4XTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50c1tpbmRleF07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdGdldEtleVBhdGg6IGdldEtleVBhdGgsXHJcblx0XHRjb25jYXQ6IGNvbmNhdCxcclxuXHRcdGdldEVsZW1lbnRzOiBnZXRFbGVtZW50cyxcclxuXHRcdGdldFByb3BlcnR5QXRJbmRleDogZ2V0UHJvcGVydHlBdEluZGV4XHJcblx0fVxyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobWV0aG9kcywgJ2xlbmd0aCcsIHtcclxuXHRcdGdldDogX2dldExlbmd0aFxyXG5cdH0pO1xyXG5cclxuXHRyZXR1cm4gbWV0aG9kcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlQYXRoTGlzdDsiLCJ2YXIga2V5X3BhdGhfc2VwYXJhdG9yID0gcmVxdWlyZSgnLi4vZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yJyk7XHJcbnZhciBwcm9wZXJ0eV9uYW1lcyA9IHJlcXVpcmUoJy4uL2VudW1zL3Byb3BlcnR5X25hbWVzJyk7XHJcblxyXG5mdW5jdGlvbiBLZXlQYXRoTm9kZShzdGF0ZSwgbm9kZV90eXBlKSB7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yLCBwcm9wZXJ0eVBhdGgpIHtcclxuXHRcdHZhciBpbnN0YW5jZVByb3BlcnRpZXMgPSBzdGF0ZS5wcm9wZXJ0aWVzIHx8IFtdO1xyXG5cdFx0dmFyIGkgPSAwLCBsZW4gPSBpbnN0YW5jZVByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0d2hpbGUoaSA8IGxlbikge1xyXG5cdFx0XHRpZihpbnN0YW5jZVByb3BlcnRpZXNbaV0ubmFtZSA9PT0gc2VsZWN0b3IpIHtcclxuXHRcdFx0XHRyZXR1cm4gaW5zdGFuY2VQcm9wZXJ0aWVzW2ldLnZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGkgKz0gMTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGhhc1Byb3BlcnR5KHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gISFnZXRQcm9wZXJ0eUJ5UGF0aChzZWxlY3Rvcik7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRQcm9wZXJ0eShzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIGdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0aGFzUHJvcGVydHk6IGhhc1Byb3BlcnR5LFxyXG5cdFx0Z2V0UHJvcGVydHk6IGdldFByb3BlcnR5XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbWV0aG9kcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlQYXRoTm9kZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi90cmFuc2Zvcm0vVHJhbnNmb3JtJyk7XHJcbnZhciBFZmZlY3RzID0gcmVxdWlyZSgnLi9lZmZlY3RzL0VmZmVjdHMnKTtcclxudmFyIE1hdHJpeCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdHJhbnNmb3JtYXRpb25NYXRyaXgnKTtcclxuXHJcbmZ1bmN0aW9uIExheWVyQmFzZShzdGF0ZSkge1xyXG5cclxuXHR2YXIgdHJhbnNmb3JtID0gVHJhbnNmb3JtKHN0YXRlLmVsZW1lbnQuZmluYWxUcmFuc2Zvcm0ubVByb3ApO1xyXG5cdHZhciBlZmZlY3RzID0gRWZmZWN0cyhzdGF0ZS5lbGVtZW50LmVmZmVjdHNNYW5hZ2VyLmVmZmVjdEVsZW1lbnRzKTtcclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRzdGF0ZS5wcm9wZXJ0aWVzLnB1c2goe1xyXG5cdFx0XHRuYW1lOiAndHJhbnNmb3JtJyxcclxuXHRcdFx0dmFsdWU6IHRyYW5zZm9ybVxyXG5cdFx0fSx7XHJcblx0XHRcdG5hbWU6ICdUcmFuc2Zvcm0nLFxyXG5cdFx0XHR2YWx1ZTogdHJhbnNmb3JtXHJcblx0XHR9LHtcclxuXHRcdFx0bmFtZTogJ0VmZmVjdHMnLFxyXG5cdFx0XHR2YWx1ZTogZWZmZWN0c1xyXG5cdFx0fSx7XHJcblx0XHRcdG5hbWU6ICdlZmZlY3RzJyxcclxuXHRcdFx0dmFsdWU6IGVmZmVjdHNcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRUb1BvaW50KGVsZW1lbnQsIHBvaW50KSB7XHJcbiAgICAgICAgaWYoZWxlbWVudC5jb21wICYmIGVsZW1lbnQuY29tcC5maW5hbFRyYW5zZm9ybSkge1xyXG4gICAgICAgIFx0cG9pbnQgPSBnZXRFbGVtZW50VG9Qb2ludChlbGVtZW50LmNvbXAsIHBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICBcdHZhciB0b1dvcmxkTWF0ID0gTWF0cml4KCk7XHJcbiAgICAgICAgdmFyIHRyYW5zZm9ybU1hdDtcclxuICAgICAgICB0cmFuc2Zvcm1NYXQgPSBlbGVtZW50LmZpbmFsVHJhbnNmb3JtLm1Qcm9wO1xyXG4gICAgICAgIHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIGlmKGVsZW1lbnQuaGllcmFyY2h5ICYmIGVsZW1lbnQuaGllcmFyY2h5Lmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHZhciBpLCBsZW4gPSBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmhpZXJhcmNoeVtpXS5maW5hbFRyYW5zZm9ybS5tUHJvcC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b1dvcmxkTWF0LmludmVyc2VQb2ludChwb2ludCk7XHJcbiAgICB9XHJcblxyXG5cdGZ1bmN0aW9uIHRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHJldHVybiBnZXRFbGVtZW50VG9Qb2ludChzdGF0ZS5lbGVtZW50LCBwb2ludCk7XHJcblx0fVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRGcm9tUG9pbnQoZWxlbWVudCwgcG9pbnQpIHtcclxuICAgIFx0dmFyIHRvV29ybGRNYXQgPSBNYXRyaXgoKTtcclxuICAgICAgICB2YXIgdHJhbnNmb3JtTWF0ID0gZWxlbWVudC5maW5hbFRyYW5zZm9ybS5tUHJvcDtcclxuICAgICAgICB0cmFuc2Zvcm1NYXQuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICBpZihlbGVtZW50LmhpZXJhcmNoeSAmJiBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGgpe1xyXG4gICAgICAgICAgICB2YXIgaSwgbGVuID0gZWxlbWVudC5oaWVyYXJjaHkubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IoaT0wO2k8bGVuO2krPTEpe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5oaWVyYXJjaHlbaV0uZmluYWxUcmFuc2Zvcm0ubVByb3AuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludCA9IHRvV29ybGRNYXQuYXBwbHlUb1BvaW50QXJyYXkocG9pbnRbMF0scG9pbnRbMV0scG9pbnRbMl18fDApO1xyXG4gICAgICAgIGlmKGVsZW1lbnQuY29tcCAmJiBlbGVtZW50LmNvbXAuZmluYWxUcmFuc2Zvcm0pIHtcclxuICAgICAgICBcdHBvaW50ID0gZ2V0RWxlbWVudEZyb21Qb2ludChlbGVtZW50LmNvbXAsIHBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBvaW50O1xyXG4gICAgfVxyXG5cclxuXHRmdW5jdGlvbiBmcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHJldHVybiBnZXRFbGVtZW50RnJvbVBvaW50KHN0YXRlLmVsZW1lbnQsIHBvaW50KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldERhdGEoKSB7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0TGF5ZXIoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudFxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRUYXJnZXRMYXllcjogZ2V0VGFyZ2V0TGF5ZXIsXHJcblx0XHR0b0tleXBhdGhMYXllclBvaW50OiB0b0tleXBhdGhMYXllclBvaW50LFxyXG5cdFx0ZnJvbUtleXBhdGhMYXllclBvaW50OiBmcm9tS2V5cGF0aExheWVyUG9pbnRcclxuXHR9XHJcblxyXG5cdF9idWlsZFByb3BlcnR5TWFwKCk7XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJCYXNlOyIsInZhciBsYXllcl90eXBlcyA9IHJlcXVpcmUoJy4uL2VudW1zL2xheWVyX3R5cGVzJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG5cclxuZnVuY3Rpb24gTGF5ZXJMaXN0KGVsZW1lbnRzKSB7XHJcblxyXG5cdGZ1bmN0aW9uIF9nZXRMZW5ndGgoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS50eSA9PT0gbGF5ZXJfdHlwZXNbdHlwZV07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgbmFtZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEubm0gPT09IG5hbWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVycygpIHtcclxuXHRcdCByZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5VHlwZSh0eXBlKSB7XHJcblx0XHR2YXIgZWxlbWVudHNMaXN0ID0gX2ZpbHRlckxheWVyQnlUeXBlKGVsZW1lbnRzLCB0eXBlKTtcclxuXHRcdHJldHVybiBMYXllckxpc3QoZWxlbWVudHNMaXN0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5TmFtZSh0eXBlKSB7XHJcblx0XHR2YXIgZWxlbWVudHNMaXN0ID0gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCB0eXBlKTtcclxuXHRcdHJldHVybiBMYXllckxpc3QoZWxlbWVudHNMaXN0KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxheWVyKGluZGV4KSB7XHJcblx0XHRpZiAoaW5kZXggPj0gZWxlbWVudHMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiBbXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBsYXllcl9hcGkoZWxlbWVudHNbcGFyc2VJbnQoaW5kZXgpXSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRJdGVyYXRhYmxlTWV0aG9kcyhpdGVyYXRhYmxlTWV0aG9kcywgbGlzdCkge1xyXG5cdFx0aXRlcmF0YWJsZU1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSl7XHJcblx0XHRcdHZhciBfdmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0YWNjdW11bGF0b3JbdmFsdWVdID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XHJcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnRzLm1hcChmdW5jdGlvbihlbGVtZW50KXtcclxuXHRcdFx0XHRcdHZhciBsYXllciA9IGxheWVyX2FwaShlbGVtZW50KTtcclxuXHRcdFx0XHRcdGlmKGxheWVyW192YWx1ZV0pIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGxheWVyW192YWx1ZV0uYXBwbHkobnVsbCwgX2FyZ3VtZW50cyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gYWNjdW11bGF0b3I7XHJcblx0XHR9LCBtZXRob2RzKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRhcmdldEVsZW1lbnRzKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY29uY2F0KGxpc3QpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5jb25jYXQobGlzdC5nZXRUYXJnZXRFbGVtZW50cygpKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0TGF5ZXJzOiBnZXRMYXllcnMsXHJcblx0XHRnZXRMYXllcnNCeVR5cGU6IGdldExheWVyc0J5VHlwZSxcclxuXHRcdGdldExheWVyc0J5TmFtZTogZ2V0TGF5ZXJzQnlOYW1lLFxyXG5cdFx0bGF5ZXI6IGxheWVyLFxyXG5cdFx0Y29uY2F0OiBjb25jYXQsXHJcblx0XHRnZXRUYXJnZXRFbGVtZW50czogZ2V0VGFyZ2V0RWxlbWVudHNcclxuXHR9O1xyXG5cclxuXHRhZGRJdGVyYXRhYmxlTWV0aG9kcyhbJ3NldFRyYW5zbGF0ZScsICdnZXRUeXBlJywgJ2dldER1cmF0aW9uJ10pO1xyXG5cdGFkZEl0ZXJhdGFibGVNZXRob2RzKFsnc2V0VGV4dCcsICdnZXRUZXh0JywgJ3NldERvY3VtZW50RGF0YScsICdjYW5SZXNpemVGb250JywgJ3NldE1pbmltdW1Gb250U2l6ZSddKTtcclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1ldGhvZHMsICdsZW5ndGgnLCB7XHJcblx0XHRnZXQ6IF9nZXRMZW5ndGhcclxuXHR9KTtcclxuXHRyZXR1cm4gbWV0aG9kcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXllckxpc3Q7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIENhbWVyYShlbGVtZW50KSB7XHJcblx0Y29uc29sZS5sb2coJ2VsZW1lbnQ6ICcsIGVsZW1lbnQpXHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9pbnRPZkludGVyZXN0KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFpvb20odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucGUpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFhSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5yeCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WVJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnJ5KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRaUm90YXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucnopLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb2ludCBvZiBJbnRlcmVzdCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb2ludE9mSW50ZXJlc3RcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnWm9vbScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRab29tXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WFJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WVJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WlJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBLZXlQYXRoTm9kZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYTsiLCJ2YXIgS2V5UGF0aExpc3QgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTGlzdCcpO1xyXG52YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gQ29tcG9zaXRpb24oZWxlbWVudCkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFRpbWVSZW1hcCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC50bSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRMYXllckFwaShsYXllciwgaW5kZXgpIHtcclxuXHRcdHZhciBfbGF5ZXJBcGkgPSBudWxsO1xyXG5cdFx0dmFyIG9iID0ge1xyXG5cdFx0XHRuYW1lOiBsYXllci5ubVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGdldExheWVyQXBpKCkge1xyXG5cdFx0XHRpZighX2xheWVyQXBpKSB7XHJcblx0XHRcdFx0X2xheWVyQXBpID0gbGF5ZXJfYXBpKGVsZW1lbnQuZWxlbWVudHNbaW5kZXhdKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBfbGF5ZXJBcGlcclxuXHRcdH1cclxuXHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2IsICd2YWx1ZScsIHtcclxuXHRcdFx0Z2V0IDogZ2V0TGF5ZXJBcGlcclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gb2I7XHJcblx0fVxyXG5cclxuXHRcclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHZhciBjb21wb3NpdGlvbkxheWVycyA9IGVsZW1lbnQubGF5ZXJzLm1hcChidWlsZExheWVyQXBpKVxyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdUaW1lIFJlbWFwJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFRpbWVSZW1hcFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XS5jb25jYXQoY29tcG9zaXRpb25MYXllcnMpXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBLZXlQYXRoTGlzdChzdGF0ZS5lbGVtZW50cywgJ2xheWVyJyksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0aW9uOyIsInZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBFZmZlY3RFbGVtZW50KGVmZmVjdCkge1xyXG5cclxuXHRmdW5jdGlvbiBzZXRWYWx1ZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWZmZWN0LnApLnNldFZhbHVlKHZhbHVlKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHNldFZhbHVlOiBzZXRWYWx1ZVxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFZmZlY3RFbGVtZW50OyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcbnZhciBFZmZlY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9FZmZlY3RFbGVtZW50Jyk7XHJcblxyXG5mdW5jdGlvbiBFZmZlY3RzKGVmZmVjdHMpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogYnVpbGRQcm9wZXJ0aWVzKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFZhbHVlKGVmZmVjdERhdGEsIGluZGV4KSB7XHJcblx0XHR2YXIgbm0gPSBlZmZlY3REYXRhLmRhdGEgPyBlZmZlY3REYXRhLmRhdGEubm0gOiBpbmRleC50b1N0cmluZygpO1xyXG5cdFx0dmFyIGVmZmVjdEVsZW1lbnQgPSBlZmZlY3REYXRhLmRhdGEgPyBFZmZlY3RzKGVmZmVjdERhdGEuZWZmZWN0RWxlbWVudHMpIDogRWZmZWN0RWxlbWVudChlZmZlY3REYXRhKTtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG5hbWU6IG5tLFxyXG5cdFx0XHR2YWx1ZTogZWZmZWN0RWxlbWVudFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRQcm9wZXJ0aWVzKCkge1xyXG5cdFx0dmFyIGksIGxlbiA9IGVmZmVjdHMubGVuZ3RoO1xyXG5cdFx0dmFyIGFyciA9IFtdO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdGFyci5wdXNoKGdldFZhbHVlKGVmZmVjdHNbaV0sIGkpKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhcnI7XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWZmZWN0czsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBJbWFnZShlbGVtZW50KSB7XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIExheWVyQmFzZShlbGVtZW50KSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW1hZ2U7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG5cclxuZnVuY3Rpb24gTnVsbEVsZW1lbnQoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0ZWxlbWVudDogZWxlbWVudCxcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE51bGxFbGVtZW50OyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxudmFyIFNoYXBlUmVjdGFuZ2xlID0gcmVxdWlyZSgnLi9TaGFwZVJlY3RhbmdsZScpO1xyXG52YXIgU2hhcGVGaWxsID0gcmVxdWlyZSgnLi9TaGFwZUZpbGwnKTtcclxudmFyIFNoYXBlU3Ryb2tlID0gcmVxdWlyZSgnLi9TaGFwZVN0cm9rZScpO1xyXG52YXIgU2hhcGVFbGxpcHNlID0gcmVxdWlyZSgnLi9TaGFwZUVsbGlwc2UnKTtcclxudmFyIFNoYXBlR3JhZGllbnRGaWxsID0gcmVxdWlyZSgnLi9TaGFwZUdyYWRpZW50RmlsbCcpO1xyXG52YXIgU2hhcGVHcmFkaWVudFN0cm9rZSA9IHJlcXVpcmUoJy4vU2hhcGVHcmFkaWVudFN0cm9rZScpO1xyXG52YXIgU2hhcGVUcmltUGF0aHMgPSByZXF1aXJlKCcuL1NoYXBlVHJpbVBhdGhzJyk7XHJcbnZhciBTaGFwZVJlcGVhdGVyID0gcmVxdWlyZSgnLi9TaGFwZVJlcGVhdGVyJyk7XHJcbnZhciBTaGFwZVBvbHlzdGFyID0gcmVxdWlyZSgnLi9TaGFwZVBvbHlzdGFyJyk7XHJcbnZhciBTaGFwZVJvdW5kQ29ybmVycyA9IHJlcXVpcmUoJy4vU2hhcGVSb3VuZENvcm5lcnMnKTtcclxudmFyIFNoYXBlUGF0aCA9IHJlcXVpcmUoJy4vU2hhcGVQYXRoJyk7XHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuLi90cmFuc2Zvcm0vVHJhbnNmb3JtJyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZShlbGVtZW50LCBzaGFwZXNEYXRhLCBzaGFwZXMpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKCksXHJcblx0XHRlbGVtZW50OiBlbGVtZW50XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZFNoYXBlT2JqZWN0KHNoYXBlLCBpbmRleCkge1xyXG5cdFx0dmFyIG9iID0ge1xyXG5cdFx0XHRuYW1lOiBzaGFwZS5ubVxyXG5cdFx0fVxyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iLCAndmFsdWUnLCB7XHJcblx0XHQgICBnZXQoKSB7IFxyXG5cdCAgIFx0XHRpZihzaGFwZS50eSA9PT0gJ2dyJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZShlbGVtZW50LCBzaGFwZXNEYXRhW2luZGV4XS5pdCwgc2hhcGVzW2luZGV4XS5pdCk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3JjJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVJlY3RhbmdsZShzaGFwZXNbaW5kZXhdKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnZWwnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlRWxsaXBzZShzaGFwZXNbaW5kZXhdKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnZmwnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlRmlsbChzaGFwZXNbaW5kZXhdKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnc3QnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlU3Ryb2tlKHNoYXBlc1tpbmRleF0pO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdnZicpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVHcmFkaWVudEZpbGwoc2hhcGVzW2luZGV4XSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2dzJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZUdyYWRpZW50U3Ryb2tlKHNoYXBlc1tpbmRleF0pO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICd0bScpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVUcmltUGF0aHMoc2hhcGVzW2luZGV4XSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3JwJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVJlcGVhdGVyKHNoYXBlc1tpbmRleF0pO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdzcicpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVQb2x5c3RhcihzaGFwZXNbaW5kZXhdKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAncmQnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlUm91bmRDb3JuZXJzKHNoYXBlc1tpbmRleF0pO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdzaCcpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVQYXRoKHNoYXBlc1tpbmRleF0pO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICd0cicpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gVHJhbnNmb3JtKHNoYXBlc1tpbmRleF0udHJhbnNmb3JtLm1Qcm9wcyk7XHJcblx0ICAgXHRcdH0gZWxzZSB7XHJcblx0ICAgXHRcdFx0Y29uc29sZS5sb2coc2hhcGUudHkpO1xyXG5cdCAgIFx0XHR9XHJcblx0XHQgICB9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvYlxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHR2YXIgc2hhcGVzID0gc2hhcGVzRGF0YS5tYXAoZnVuY3Rpb24oc2hhcGUsIGluZGV4KSB7XHJcblx0XHRcdHJldHVybiBidWlsZFNoYXBlT2JqZWN0KHNoYXBlLCBpbmRleClcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHNoYXBlc1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSBPYmplY3QuYXNzaWduKHt9LCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxuXHRjb25zb2xlLmxvZygnaW5zdGFuY2U6ICcsIGluc3RhbmNlKVxyXG5cdHJldHVybiBpbnN0YW5jZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVFbGxpcHNlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2l6ZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU2l6ZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTaXplXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVFbGxpcHNlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUZpbGwoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRDb2xvcih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5jKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdjb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdvcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUZpbGw7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlR3JhZGllbnRGaWxsKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3RhcnRQb2ludCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRFbmRQb2ludCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5lKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEhpZ2hsaWdodExlbmd0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5oKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRIaWdobGlnaHRBbmdsZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5hKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRDb2xvcnModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuZy5wcm9wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU3RhcnQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3RhcnRQb2ludFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdFbmQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RW5kUG9pbnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBMZW5ndGgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0SGlnaGxpZ2h0TGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBBbmdsZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRIaWdobGlnaHRBbmdsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdDb2xvcnMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Q29sb3JzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVHcmFkaWVudEZpbGw7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlR3JhZGllbnRTdHJva2UoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdGFydFBvaW50KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEVuZFBvaW50KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmUpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SGlnaGxpZ2h0TGVuZ3RoKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmgpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEhpZ2hsaWdodEFuZ2xlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldENvbG9ycyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5nLnByb3ApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZVdpZHRoKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LncpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdGFydCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdGFydFBvaW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRFbmRQb2ludFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IExlbmd0aCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRIaWdobGlnaHRMZW5ndGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IEFuZ2xlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEhpZ2hsaWdodEFuZ2xlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0NvbG9ycycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRDb2xvcnNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU3Ryb2tlIFdpZHRoJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZVdpZHRoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVHcmFkaWVudFN0cm9rZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVQYXRoKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UGF0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3BhdGgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UGF0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUGF0aDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVQb2x5c3RhcihlbGVtZW50KSB7XHJcblx0Y29uc29sZS5sb2coZWxlbWVudCk7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvaW50cyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5wdCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9zaXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Um90YXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SW5uZXJSYWRpdXModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2guaXIpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE91dGVyUmFkaXVzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLm9yKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRJbm5lclJvdW5kbmVzcyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5pcykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3V0ZXJSb3VuZG5lc3ModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gub3MpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb2ludHMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UG9pbnRzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0lubmVyIFJhZGl1cycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRJbm5lclJhZGl1c1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPdXRlciBSYWRpdXMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3V0ZXJSYWRpdXNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnSW5uZXIgUm91bmRuZXNzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldElubmVyUm91bmRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ091dGVyIFJvdW5kbmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPdXRlclJvdW5kbmVzc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUG9seXN0YXI7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUmVjdGFuZ2xlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2l6ZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3VuZG5lc3ModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1NpemUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2l6ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3VuZG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Um91bmRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVSZWN0YW5nbGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybS9UcmFuc2Zvcm0nKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUmVwZWF0ZXIoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRDb3BpZXModmFsdWUpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdzZXRDb3BpZXMnKVxyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5jKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPZmZzZXQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T2Zmc2V0KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdDb3BpZXMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Q29waWVzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09mZnNldCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPZmZzZXRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnVHJhbnNmb3JtJyxcclxuXHRcdFx0XHR2YWx1ZTogVHJhbnNmb3JtKGVsZW1lbnQudHIpXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVJlcGVhdGVyOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVJvdW5kQ29ybmVycyhlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJhZGl1cyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5yZCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JhZGl1cycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSYWRpdXNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVJvdW5kQ29ybmVyczsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVTdHJva2UoZWxlbWVudCkge1xyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldENvbG9yKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlV2lkdGgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQudykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ2NvbG9yJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldENvbG9yXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3N0cm9rZSB3aWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VXaWR0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdvcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVN0cm9rZSIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVRyaW1QYXRocyhlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0YXJ0KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEVuZCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5lKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPZmZzZXQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1N0YXJ0JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0YXJ0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0VuZCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRFbmRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT2Zmc2V0JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9mZnNldFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlVHJpbVBhdGhzOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIFNvbGlkKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb2xpZDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG52YXIgVGV4dEFuaW1hdG9yID0gcmVxdWlyZSgnLi9UZXh0QW5pbWF0b3InKTtcclxuXHJcbmZ1bmN0aW9uIFRleHQoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgaW5zdGFuY2UgPSB7fVxyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXREb2N1bWVudERhdGEoX2Z1bmN0aW9uKSB7XHJcblx0XHR2YXIgcHJldmlvdXNWYWx1ZTtcclxuXHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgbmV3VmFsdWUgPSBfZnVuY3Rpb24oZWxlbWVudC50ZXh0UHJvcGVydHkuY3VycmVudERhdGEpO1xyXG5cdFx0XHRpZiAocHJldmlvdXNWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcclxuXHRcdFx0XHRlbGVtZW50LnVwZGF0ZURvY3VtZW50RGF0YShuZXdWYWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0fSwgNTAwKVxyXG5cdFx0Y29uc29sZS5sb2coZWxlbWVudClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZEFuaW1hdG9ycygpIHtcclxuXHRcdHZhciBhbmltYXRvclByb3BlcnRpZXMgPSBbXTtcclxuXHRcdHZhciBhbmltYXRvcnMgPSBlbGVtZW50LnRleHRBbmltYXRvci5fYW5pbWF0b3JzRGF0YTtcclxuXHRcdHZhciBpLCBsZW4gPSBhbmltYXRvcnMubGVuZ3RoO1xyXG5cdFx0dmFyIHRleHRBbmltYXRvcjtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xyXG5cdFx0XHR0ZXh0QW5pbWF0b3IgPSBUZXh0QW5pbWF0b3IoYW5pbWF0b3JzW2ldKVxyXG5cdFx0XHRhbmltYXRvclByb3BlcnRpZXMucHVzaCh7XHJcblx0XHRcdFx0bmFtZTogZWxlbWVudC50ZXh0QW5pbWF0b3IuX3RleHREYXRhLmFbaV0ubm0gfHwgJ0FuaW1hdG9yICcgKyAoaSsxKSwgLy9GYWxsYmFjayBmb3Igb2xkIGFuaW1hdGlvbnNcclxuXHRcdFx0XHR2YWx1ZTogdGV4dEFuaW1hdG9yXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYW5pbWF0b3JQcm9wZXJ0aWVzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU291cmNlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldERvY3VtZW50RGF0YVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XS5jb25jYXQoYWRkQW5pbWF0b3JzKCkpXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0OyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0QW5pbWF0b3IoYW5pbWF0b3IpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge31cclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0QW5jaG9yUG9pbnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuYSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RmlsbEJyaWdodG5lc3ModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZmIpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxDb2xvcih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5mYykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RmlsbEh1ZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5maCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RmlsbFNhdHVyYXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZnMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZvKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnIpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJvdGF0aW9uWCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5yeCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Um90YXRpb25ZKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnJ5KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTY2FsZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTa2V3QXhpcyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zYSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlQ29sb3IodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc2MpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFNrZXcodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc2spLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZU9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc28pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZVdpZHRoKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnN3KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VCcmlnaHRuZXNzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNiKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VIdWUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc2gpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZVNhdHVyYXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc3MpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFRyYWNraW5nQW1vdW50KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnQpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J0FuY2hvciBQb2ludCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRBbmNob3JQb2ludFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J0ZpbGwgQnJpZ2h0bmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRGaWxsQnJpZ2h0bmVzc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J0ZpbGwgQ29sb3InLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbENvbG9yXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonRmlsbCBIdWUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbEh1ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J0ZpbGwgU2F0dXJhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRGaWxsU2F0dXJhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J0ZpbGwgT3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRGaWxsT3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonUm90YXRpb24gWCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSb3RhdGlvblhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidSb3RhdGlvbiBZJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFJvdGF0aW9uWVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NjYWxlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFNjYWxlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU2tldyBBeGlzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFNrZXdBeGlzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU3Ryb2tlIENvbG9yJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZUNvbG9yXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU2tldycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTa2V3XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU3Ryb2tlIFdpZHRoJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZVdpZHRoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonVHJhY2tpbmcgQW1vdW50JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFRyYWNraW5nQW1vdW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU3Ryb2tlIE9wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlT3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBCcmlnaHRuZXNzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZUJyaWdodG5lc3NcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTdHJva2UgU2F0dXJhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VTYXR1cmF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU3Ryb2tlIEh1ZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VIdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdFxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgbWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dEFuaW1hdG9yOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxudmFyIFRleHQgPSByZXF1aXJlKCcuL1RleHQnKTtcclxuXHJcbmZ1bmN0aW9uIFRleHRFbGVtZW50KGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBUZXh0UHJvcGVydHkgPSBUZXh0KGVsZW1lbnQpO1xyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAndGV4dCcsXHJcblx0XHRcdFx0dmFsdWU6IFRleHRQcm9wZXJ0eVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1RleHQnLFxyXG5cdFx0XHRcdHZhbHVlOiBUZXh0UHJvcGVydHlcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGV4dCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LnRleHRQcm9wZXJ0eS5jdXJyZW50RGF0YS50O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0VGV4dCh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHNldERvY3VtZW50RGF0YSh7dDogdmFsdWV9LCBpbmRleCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXREb2N1bWVudERhdGEoZGF0YSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LnVwZGF0ZURvY3VtZW50RGF0YShkYXRhLCBpbmRleCk7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGNhblJlc2l6ZUZvbnQoX2NhblJlc2l6ZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuY2FuUmVzaXplRm9udChfY2FuUmVzaXplKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE1pbmltdW1Gb250U2l6ZShfZm9udFNpemUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LnNldE1pbmltdW1Gb250U2l6ZShfZm9udFNpemUpO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRUZXh0OiBnZXRUZXh0LFxyXG5cdFx0c2V0VGV4dDogc2V0VGV4dCxcclxuXHRcdGNhblJlc2l6ZUZvbnQ6IGNhblJlc2l6ZUZvbnQsXHJcblx0XHRzZXREb2N1bWVudERhdGE6IHNldERvY3VtZW50RGF0YSxcclxuXHRcdHNldE1pbmltdW1Gb250U2l6ZTogc2V0TWluaW11bUZvbnRTaXplXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgTGF5ZXJCYXNlKHN0YXRlKSwgbWV0aG9kcyk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRFbGVtZW50OyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBUcmFuc2Zvcm0ocHJvcHMpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRBbmNob3JQb2ludCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMuYSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9zaXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KHByb3BzLnApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFNjYWxlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WFJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5yeCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WVJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5yeSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WlJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5yeikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5weCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WVBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5weSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WlBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5weikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMubykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1NjYWxlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFNjYWxlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1JvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WFBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WVBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WlBvc2l0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ggUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WFJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1kgUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WVJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1ogUm90YXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0WlJvdGF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTsiLCJmdW5jdGlvbiBQcm9wZXJ0eShwcm9wZXJ0eSkge1xyXG5cdFxyXG5cdGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlKSB7XHJcblx0XHRpZighcHJvcGVydHkgfHwgIXByb3BlcnR5LmFkZEVmZmVjdCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHByb3BlcnR5LmFkZEVmZmVjdCh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnByb3BUeXBlID09PSAnbXVsdGlkaW1lbnNpb25hbCcgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5sZW5ndGggPT09IDIpIHtcclxuXHRcdFx0cHJvcGVydHkuYWRkRWZmZWN0KGZ1bmN0aW9uKCl7cmV0dXJuIHZhbHVlfSk7XHJcblx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnByb3BUeXBlID09PSAndW5pZGltZW5zaW9uYWwnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0cHJvcGVydHkuYWRkRWZmZWN0KGZ1bmN0aW9uKCl7cmV0dXJuIHZhbHVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHRcdHNldFZhbHVlOiBzZXRWYWx1ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFByb3BlcnR5OyIsInZhciBMYXllckxpc3QgPSByZXF1aXJlKCcuLi9sYXllci9MYXllckxpc3QnKTtcclxudmFyIEtleVBhdGhMaXN0ID0gcmVxdWlyZSgnLi4va2V5X3BhdGgvS2V5UGF0aExpc3QnKTtcclxuXHJcbmZ1bmN0aW9uIFJlbmRlcmVyKHN0YXRlKSB7XHJcblxyXG5cdHN0YXRlLl90eXBlID0gJ3JlbmRlcmVyJztcclxuXHJcblx0ZnVuY3Rpb24gZ2V0UmVuZGVyZXJUeXBlKCkge1xyXG5cdFx0cmV0dXJuIHN0YXRlLmFuaW1hdGlvbi5hbmltVHlwZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHtcclxuXHRcdGdldFJlbmRlcmVyVHlwZTogZ2V0UmVuZGVyZXJUeXBlXHJcblx0fSwgTGF5ZXJMaXN0KHN0YXRlLmVsZW1lbnRzKSwgS2V5UGF0aExpc3Qoc3RhdGUuZWxlbWVudHMsICdyZW5kZXJlcicpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjsiXX0=
