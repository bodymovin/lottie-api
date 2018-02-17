(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lottie_api = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../renderer/Renderer":39}],2:[function(require,module,exports){
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
var key_path_separator = require('../enums/key_path_separator')

module.exports = function(propertyPath) {
	var keyPathSplit = propertyPath.split(key_path_separator);
	var selector = keyPathSplit.shift();
	return {
		selector: selector,
		propertyPath: keyPathSplit.join(key_path_separator)
	}
}
},{"../enums/key_path_separator":2}],6:[function(require,module,exports){
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
var layer_api = require('../helpers/layerAPIBuilder');
var sanitizeString = require('../helpers/stringSanitizer');
var layer_types = require('../enums/layer_types');

function KeyPathList(elements, node_type) {

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

	function _filterLayerByProperty(elements, name) {
		return elements.filter(function(element) {
			var layerAPI = layer_api(element);
			if(layerAPI.hasProperty(name)) {
				return layerAPI.getProperty(name);
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
			return layer_api(element).getProperty(selector);
		})
		return KeyPathList(properties, 'property');
	}

	function getKeyPath(propertyPath) {
		var keyPathData = keyPathBuilder(propertyPath);
		var selector = sanitizeString(keyPathData.selector);
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
		console.log('node_type: ', node_type)
		if(node_type === 'layer') {
			return layer_api(elements[index]);
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
},{"../enums/layer_types":3,"../helpers/keyPathBuilder":5,"../helpers/layerAPIBuilder":6,"../helpers/stringSanitizer":7}],12:[function(require,module,exports){
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

	function getTargetElement() {
		return state.element;
	}

	/*
	function fromWorld(arr, time){
        var toWorldMat = new Matrix();
        toWorldMat.reset();
        var transformMat;
        if(time) {
            //Todo implement value at time on transform properties
            //transformMat = this._elem.finalTransform.mProp.getValueAtTime(time);
            transformMat = this._elem.finalTransform.mProp;
        } else {
            transformMat = this._elem.finalTransform.mProp;
        }
        transformMat.applyToMatrix(toWorldMat);
        if(this._elem.hierarchy && this._elem.hierarchy.length){
            var i, len = this._elem.hierarchy.length;
            for(i=0;i<len;i+=1){
                this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
            }
            return toWorldMat.inversePoint(arr);
        }
        return toWorldMat.inversePoint(arr);
    }*/

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

	var methods = {
		getTargetElement: getTargetElement,
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

	
	function _buildPropertyMap() {
		var compositionLayers = element.layers.map(function(layer, index) {
			return {
				name: layer.nm,
				value: layer_api(element.elements[index])
			};
		})
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0uanMiLCJzcmMvZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yLmpzIiwic3JjL2VudW1zL2xheWVyX3R5cGVzLmpzIiwic3JjL2VudW1zL3Byb3BlcnR5X25hbWVzLmpzIiwic3JjL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9sYXllckFQSUJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9zdHJpbmdTYW5pdGl6ZXIuanMiLCJzcmMvaGVscGVycy90cmFuc2Zvcm1hdGlvbk1hdHJpeC5qcyIsInNyYy9oZWxwZXJzL3R5cGVkQXJyYXlzLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhMaXN0LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhOb2RlLmpzIiwic3JjL2xheWVyL0xheWVyQmFzZS5qcyIsInNyYy9sYXllci9MYXllckxpc3QuanMiLCJzcmMvbGF5ZXIvY2FtZXJhL0NhbWVyYS5qcyIsInNyYy9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbi5qcyIsInNyYy9sYXllci9lZmZlY3RzL0VmZmVjdEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvZWZmZWN0cy9FZmZlY3RzLmpzIiwic3JjL2xheWVyL2ltYWdlL0ltYWdlRWxlbWVudC5qcyIsInNyYy9sYXllci9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGUuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVFbGxpcHNlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlRmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50RmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50U3Ryb2tlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUGF0aC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVBvbHlzdGFyLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUmVjdGFuZ2xlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUmVwZWF0ZXIuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVSb3VuZENvcm5lcnMuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVTdHJva2UuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVUcmltUGF0aHMuanMiLCJzcmMvbGF5ZXIvc29saWQvU29saWRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RleHQvVGV4dC5qcyIsInNyYy9sYXllci90ZXh0L1RleHRBbmltYXRvci5qcyIsInNyYy9sYXllci90ZXh0L1RleHRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RyYW5zZm9ybS9UcmFuc2Zvcm0uanMiLCJzcmMvcHJvcGVydHkvUHJvcGVydHkuanMiLCJzcmMvcmVuZGVyZXIvUmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL1JlbmRlcmVyJyk7XHJcblxyXG5mdW5jdGlvbiBBbmltYXRpb25JdGVtRmFjdG9yeShhbmltYXRpb24pIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0YW5pbWF0aW9uOiBhbmltYXRpb24sXHJcblx0XHRlbGVtZW50czogYW5pbWF0aW9uLnJlbmRlcmVyLl9iciB8fCBhbmltYXRpb24ucmVuZGVyZXIuZWxlbWVudHNcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRGcmFtZSgpIHtcclxuXHRcdHJldHVybiBhbmltYXRpb24uY3VycmVudEZyYW1lO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKSB7XHJcblx0XHRyZXR1cm4gYW5pbWF0aW9uLmN1cnJlbnRGcmFtZSAvIGFuaW1hdGlvbi5mcmFtZVJhdGU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRWYWx1ZUNhbGxiYWNrKHByb3BlcnRpZXMsIHZhbHVlKSB7XHJcblx0XHR2YXIgaSwgbGVuID0gcHJvcGVydGllcy5sZW5ndGg7XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0cHJvcGVydGllcy5nZXRQcm9wZXJ0eUF0SW5kZXgoaSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gdG9LZXlwYXRoTGF5ZXJQb2ludChwcm9wZXJ0aWVzLCBwb2ludCkge1xyXG5cdFx0dmFyIGksIGxlbiA9IHByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdHJldHVybiBwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS50b0tleXBhdGhMYXllclBvaW50KHBvaW50KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZyb21LZXlwYXRoTGF5ZXJQb2ludChwcm9wZXJ0aWVzLCBwb2ludCkge1xyXG5cdFx0dmFyIGksIGxlbiA9IHByb3BlcnRpZXMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcblx0XHRcdHJldHVybiBwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS5mcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe1xyXG5cdFx0Z2V0Q3VycmVudEZyYW1lOiBnZXRDdXJyZW50RnJhbWUsXHJcblx0XHRnZXRDdXJyZW50VGltZTogZ2V0Q3VycmVudFRpbWUsXHJcblx0XHRhZGRWYWx1ZUNhbGxiYWNrOiBhZGRWYWx1ZUNhbGxiYWNrLFxyXG5cdFx0dG9LZXlwYXRoTGF5ZXJQb2ludDogdG9LZXlwYXRoTGF5ZXJQb2ludCxcclxuXHRcdGZyb21LZXlwYXRoTGF5ZXJQb2ludDogZnJvbUtleXBhdGhMYXllclBvaW50XHJcblx0fSwgUmVuZGVyZXIoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb25JdGVtRmFjdG9yeTsiLCJtb2R1bGUuZXhwb3J0cyA9ICcsJzsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHQgMDogMCxcclxuXHQgMTogMSxcclxuXHQgMjogMixcclxuXHQgMzogMyxcclxuXHQgNDogNCxcclxuXHQgNTogNSxcclxuXHQgMTM6IDEzLFxyXG5cdCdjb21wJzogMCxcclxuXHQnY29tcG9zaXRpb24nOiAwLFxyXG5cdCdzb2xpZCc6IDEsXHJcblx0J2ltYWdlJzogMixcclxuXHQnbnVsbCc6IDMsXHJcblx0J3NoYXBlJzogNCxcclxuXHQndGV4dCc6IDUsXHJcblx0J2NhbWVyYSc6IDEzXHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRMQVlFUl9UUkFOU0ZPUk06ICd0cmFuc2Zvcm0nXHJcbn0iLCJ2YXIga2V5X3BhdGhfc2VwYXJhdG9yID0gcmVxdWlyZSgnLi4vZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHJvcGVydHlQYXRoKSB7XHJcblx0dmFyIGtleVBhdGhTcGxpdCA9IHByb3BlcnR5UGF0aC5zcGxpdChrZXlfcGF0aF9zZXBhcmF0b3IpO1xyXG5cdHZhciBzZWxlY3RvciA9IGtleVBhdGhTcGxpdC5zaGlmdCgpO1xyXG5cdHJldHVybiB7XHJcblx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXHJcblx0XHRwcm9wZXJ0eVBhdGg6IGtleVBhdGhTcGxpdC5qb2luKGtleV9wYXRoX3NlcGFyYXRvcilcclxuXHR9XHJcbn0iLCJ2YXIgVGV4dEVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci90ZXh0L1RleHRFbGVtZW50Jyk7XHJcbnZhciBTaGFwZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9zaGFwZS9TaGFwZScpO1xyXG52YXIgTnVsbEVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9udWxsX2VsZW1lbnQvTnVsbEVsZW1lbnQnKTtcclxudmFyIFNvbGlkRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL3NvbGlkL1NvbGlkRWxlbWVudCcpO1xyXG52YXIgSW1hZ2VFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvaW1hZ2UvSW1hZ2VFbGVtZW50Jyk7XHJcbnZhciBDYW1lcmFFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvY2FtZXJhL0NhbWVyYScpO1xyXG52YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJCYXNlJyk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRMYXllckFwaShlbGVtZW50KSB7XHJcblx0dmFyIGxheWVyVHlwZSA9IGVsZW1lbnQuZGF0YS50eTtcclxuXHR2YXIgQ29tcG9zaXRpb24gPSByZXF1aXJlKCcuLi9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbicpO1xyXG5cdHN3aXRjaChsYXllclR5cGUpIHtcclxuXHRcdGNhc2UgMDpcclxuXHRcdHJldHVybiBDb21wb3NpdGlvbihlbGVtZW50KTtcclxuXHRcdGNhc2UgMTpcclxuXHRcdHJldHVybiBTb2xpZEVsZW1lbnQoZWxlbWVudCk7XHJcblx0XHRjYXNlIDI6XHJcblx0XHRyZXR1cm4gSW1hZ2VFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSAzOlxyXG5cdFx0cmV0dXJuIE51bGxFbGVtZW50KGVsZW1lbnQpO1xyXG5cdFx0Y2FzZSA0OlxyXG5cdFx0cmV0dXJuIFNoYXBlRWxlbWVudChlbGVtZW50LCBlbGVtZW50LmRhdGEuc2hhcGVzLCBlbGVtZW50Lml0ZW1zRGF0YSk7XHJcblx0XHRjYXNlIDU6XHJcblx0XHRyZXR1cm4gVGV4dEVsZW1lbnQoZWxlbWVudCk7XHJcblx0XHRjYXNlIDEzOlxyXG5cdFx0cmV0dXJuIENhbWVyYUVsZW1lbnQoZWxlbWVudCk7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0cmV0dXJuIExheWVyQmFzZShlbGVtZW50KTtcclxuXHR9XHJcbn0iLCJmdW5jdGlvbiBzYW5pdGl6ZVN0cmluZyhzdHJpbmcpIHtcclxuXHRyZXR1cm4gc3RyaW5nLnRyaW0oKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYW5pdGl6ZVN0cmluZyIsInZhciBjcmVhdGVUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi90eXBlZEFycmF5cycpXHJcblxyXG4vKiFcclxuIFRyYW5zZm9ybWF0aW9uIE1hdHJpeCB2Mi4wXHJcbiAoYykgRXBpc3RlbWV4IDIwMTQtMjAxNVxyXG4gd3d3LmVwaXN0ZW1leC5jb21cclxuIEJ5IEtlbiBGeXJzdGVuYmVyZ1xyXG4gQ29udHJpYnV0aW9ucyBieSBsZWVvbml5YS5cclxuIExpY2Vuc2U6IE1JVCwgaGVhZGVyIHJlcXVpcmVkLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiAyRCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggb2JqZWN0IGluaXRpYWxpemVkIHdpdGggaWRlbnRpdHkgbWF0cml4LlxyXG4gKlxyXG4gKiBUaGUgbWF0cml4IGNhbiBzeW5jaHJvbml6ZSBhIGNhbnZhcyBjb250ZXh0IGJ5IHN1cHBseWluZyB0aGUgY29udGV4dFxyXG4gKiBhcyBhbiBhcmd1bWVudCwgb3IgbGF0ZXIgYXBwbHkgY3VycmVudCBhYnNvbHV0ZSB0cmFuc2Zvcm0gdG8gYW5cclxuICogZXhpc3RpbmcgY29udGV4dC5cclxuICpcclxuICogQWxsIHZhbHVlcyBhcmUgaGFuZGxlZCBhcyBmbG9hdGluZyBwb2ludCB2YWx1ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBbY29udGV4dF0gLSBPcHRpb25hbCBjb250ZXh0IHRvIHN5bmMgd2l0aCBNYXRyaXhcclxuICogQHByb3Age251bWJlcn0gYSAtIHNjYWxlIHhcclxuICogQHByb3Age251bWJlcn0gYiAtIHNoZWFyIHlcclxuICogQHByb3Age251bWJlcn0gYyAtIHNoZWFyIHhcclxuICogQHByb3Age251bWJlcn0gZCAtIHNjYWxlIHlcclxuICogQHByb3Age251bWJlcn0gZSAtIHRyYW5zbGF0ZSB4XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGYgLSB0cmFuc2xhdGUgeVxyXG4gKiBAcHJvcCB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfG51bGx9IFtjb250ZXh0PW51bGxdIC0gc2V0IG9yIGdldCBjdXJyZW50IGNhbnZhcyBjb250ZXh0XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuXHJcbnZhciBNYXRyaXggPSAoZnVuY3Rpb24oKXtcclxuXHJcbiAgICB2YXIgX2NvcyA9IE1hdGguY29zO1xyXG4gICAgdmFyIF9zaW4gPSBNYXRoLnNpbjtcclxuICAgIHZhciBfdGFuID0gTWF0aC50YW47XHJcbiAgICB2YXIgX3JuZCA9IE1hdGgucm91bmQ7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzZXQoKXtcclxuICAgICAgICB0aGlzLnByb3BzWzBdID0gMTtcclxuICAgICAgICB0aGlzLnByb3BzWzFdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzJdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzNdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzRdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzVdID0gMTtcclxuICAgICAgICB0aGlzLnByb3BzWzZdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzddID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzhdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzldID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzEwXSA9IDE7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMV0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTJdID0gMDtcclxuICAgICAgICB0aGlzLnByb3BzWzEzXSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxNF0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByb3RhdGUoYW5nbGUpIHtcclxuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QobUNvcywgLW1TaW4sICAwLCAwLCBtU2luLCAgbUNvcywgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByb3RhdGVYKGFuZ2xlKXtcclxuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QoMSwgMCwgMCwgMCwgMCwgbUNvcywgLW1TaW4sIDAsIDAsIG1TaW4sICBtQ29zLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByb3RhdGVZKGFuZ2xlKXtcclxuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QobUNvcywgIDAsICBtU2luLCAwLCAwLCAxLCAwLCAwLCAtbVNpbiwgIDAsICBtQ29zLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByb3RhdGVaKGFuZ2xlKXtcclxuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QobUNvcywgLW1TaW4sICAwLCAwLCBtU2luLCAgbUNvcywgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaGVhcihzeCxzeSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QoMSwgc3ksIHN4LCAxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBza2V3KGF4LCBheSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hlYXIoX3RhbihheCksIF90YW4oYXkpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBza2V3RnJvbUF4aXMoYXgsIGFuZ2xlKXtcclxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xyXG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QobUNvcywgbVNpbiwgIDAsIDAsIC1tU2luLCAgbUNvcywgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKVxyXG4gICAgICAgICAgICAuX3QoMSwgMCwgIDAsIDAsIF90YW4oYXgpLCAgMSwgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKVxyXG4gICAgICAgICAgICAuX3QobUNvcywgLW1TaW4sICAwLCAwLCBtU2luLCAgbUNvcywgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKTtcclxuICAgICAgICAvL3JldHVybiB0aGlzLl90KG1Db3MsIG1TaW4sIC1tU2luLCBtQ29zLCAwLCAwKS5fdCgxLCAwLCBfdGFuKGF4KSwgMSwgMCwgMCkuX3QobUNvcywgLW1TaW4sIG1TaW4sIG1Db3MsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNjYWxlKHN4LCBzeSwgc3opIHtcclxuICAgICAgICBzeiA9IGlzTmFOKHN6KSA/IDEgOiBzejtcclxuICAgICAgICBpZihzeCA9PSAxICYmIHN5ID09IDEgJiYgc3ogPT0gMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdChzeCwgMCwgMCwgMCwgMCwgc3ksIDAsIDAsIDAsIDAsIHN6LCAwLCAwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRUcmFuc2Zvcm0oYSwgYiwgYywgZCwgZSwgZiwgZywgaCwgaSwgaiwgaywgbCwgbSwgbiwgbywgcCkge1xyXG4gICAgICAgIHRoaXMucHJvcHNbMF0gPSBhO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMV0gPSBiO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMl0gPSBjO1xyXG4gICAgICAgIHRoaXMucHJvcHNbM10gPSBkO1xyXG4gICAgICAgIHRoaXMucHJvcHNbNF0gPSBlO1xyXG4gICAgICAgIHRoaXMucHJvcHNbNV0gPSBmO1xyXG4gICAgICAgIHRoaXMucHJvcHNbNl0gPSBnO1xyXG4gICAgICAgIHRoaXMucHJvcHNbN10gPSBoO1xyXG4gICAgICAgIHRoaXMucHJvcHNbOF0gPSBpO1xyXG4gICAgICAgIHRoaXMucHJvcHNbOV0gPSBqO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTBdID0gaztcclxuICAgICAgICB0aGlzLnByb3BzWzExXSA9IGw7XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxMl0gPSBtO1xyXG4gICAgICAgIHRoaXMucHJvcHNbMTNdID0gbjtcclxuICAgICAgICB0aGlzLnByb3BzWzE0XSA9IG87XHJcbiAgICAgICAgdGhpcy5wcm9wc1sxNV0gPSBwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSh0eCwgdHksIHR6KSB7XHJcbiAgICAgICAgdHogPSB0eiB8fCAwO1xyXG4gICAgICAgIGlmKHR4ICE9PSAwIHx8IHR5ICE9PSAwIHx8IHR6ICE9PSAwKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3QoMSwwLDAsMCwwLDEsMCwwLDAsMCwxLDAsdHgsdHksdHosMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybShhMiwgYjIsIGMyLCBkMiwgZTIsIGYyLCBnMiwgaDIsIGkyLCBqMiwgazIsIGwyLCBtMiwgbjIsIG8yLCBwMikge1xyXG5cclxuICAgICAgICB2YXIgX3AgPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICBpZihhMiA9PT0gMSAmJiBiMiA9PT0gMCAmJiBjMiA9PT0gMCAmJiBkMiA9PT0gMCAmJiBlMiA9PT0gMCAmJiBmMiA9PT0gMSAmJiBnMiA9PT0gMCAmJiBoMiA9PT0gMCAmJiBpMiA9PT0gMCAmJiBqMiA9PT0gMCAmJiBrMiA9PT0gMSAmJiBsMiA9PT0gMCl7XHJcbiAgICAgICAgICAgIC8vTk9URTogY29tbWVudGluZyB0aGlzIGNvbmRpdGlvbiBiZWNhdXNlIFR1cmJvRmFuIGRlb3B0aW1pemVzIGNvZGUgd2hlbiBwcmVzZW50XHJcbiAgICAgICAgICAgIC8vaWYobTIgIT09IDAgfHwgbjIgIT09IDAgfHwgbzIgIT09IDApe1xyXG4gICAgICAgICAgICAgICAgX3BbMTJdID0gX3BbMTJdICogYTIgKyBfcFsxNV0gKiBtMjtcclxuICAgICAgICAgICAgICAgIF9wWzEzXSA9IF9wWzEzXSAqIGYyICsgX3BbMTVdICogbjI7XHJcbiAgICAgICAgICAgICAgICBfcFsxNF0gPSBfcFsxNF0gKiBrMiArIF9wWzE1XSAqIG8yO1xyXG4gICAgICAgICAgICAgICAgX3BbMTVdID0gX3BbMTVdICogcDI7XHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICB0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYTEgPSBfcFswXTtcclxuICAgICAgICB2YXIgYjEgPSBfcFsxXTtcclxuICAgICAgICB2YXIgYzEgPSBfcFsyXTtcclxuICAgICAgICB2YXIgZDEgPSBfcFszXTtcclxuICAgICAgICB2YXIgZTEgPSBfcFs0XTtcclxuICAgICAgICB2YXIgZjEgPSBfcFs1XTtcclxuICAgICAgICB2YXIgZzEgPSBfcFs2XTtcclxuICAgICAgICB2YXIgaDEgPSBfcFs3XTtcclxuICAgICAgICB2YXIgaTEgPSBfcFs4XTtcclxuICAgICAgICB2YXIgajEgPSBfcFs5XTtcclxuICAgICAgICB2YXIgazEgPSBfcFsxMF07XHJcbiAgICAgICAgdmFyIGwxID0gX3BbMTFdO1xyXG4gICAgICAgIHZhciBtMSA9IF9wWzEyXTtcclxuICAgICAgICB2YXIgbjEgPSBfcFsxM107XHJcbiAgICAgICAgdmFyIG8xID0gX3BbMTRdO1xyXG4gICAgICAgIHZhciBwMSA9IF9wWzE1XTtcclxuXHJcbiAgICAgICAgLyogbWF0cml4IG9yZGVyIChjYW52YXMgY29tcGF0aWJsZSk6XHJcbiAgICAgICAgICogYWNlXHJcbiAgICAgICAgICogYmRmXHJcbiAgICAgICAgICogMDAxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgX3BbMF0gPSBhMSAqIGEyICsgYjEgKiBlMiArIGMxICogaTIgKyBkMSAqIG0yO1xyXG4gICAgICAgIF9wWzFdID0gYTEgKiBiMiArIGIxICogZjIgKyBjMSAqIGoyICsgZDEgKiBuMiA7XHJcbiAgICAgICAgX3BbMl0gPSBhMSAqIGMyICsgYjEgKiBnMiArIGMxICogazIgKyBkMSAqIG8yIDtcclxuICAgICAgICBfcFszXSA9IGExICogZDIgKyBiMSAqIGgyICsgYzEgKiBsMiArIGQxICogcDIgO1xyXG5cclxuICAgICAgICBfcFs0XSA9IGUxICogYTIgKyBmMSAqIGUyICsgZzEgKiBpMiArIGgxICogbTIgO1xyXG4gICAgICAgIF9wWzVdID0gZTEgKiBiMiArIGYxICogZjIgKyBnMSAqIGoyICsgaDEgKiBuMiA7XHJcbiAgICAgICAgX3BbNl0gPSBlMSAqIGMyICsgZjEgKiBnMiArIGcxICogazIgKyBoMSAqIG8yIDtcclxuICAgICAgICBfcFs3XSA9IGUxICogZDIgKyBmMSAqIGgyICsgZzEgKiBsMiArIGgxICogcDIgO1xyXG5cclxuICAgICAgICBfcFs4XSA9IGkxICogYTIgKyBqMSAqIGUyICsgazEgKiBpMiArIGwxICogbTIgO1xyXG4gICAgICAgIF9wWzldID0gaTEgKiBiMiArIGoxICogZjIgKyBrMSAqIGoyICsgbDEgKiBuMiA7XHJcbiAgICAgICAgX3BbMTBdID0gaTEgKiBjMiArIGoxICogZzIgKyBrMSAqIGsyICsgbDEgKiBvMiA7XHJcbiAgICAgICAgX3BbMTFdID0gaTEgKiBkMiArIGoxICogaDIgKyBrMSAqIGwyICsgbDEgKiBwMiA7XHJcblxyXG4gICAgICAgIF9wWzEyXSA9IG0xICogYTIgKyBuMSAqIGUyICsgbzEgKiBpMiArIHAxICogbTIgO1xyXG4gICAgICAgIF9wWzEzXSA9IG0xICogYjIgKyBuMSAqIGYyICsgbzEgKiBqMiArIHAxICogbjIgO1xyXG4gICAgICAgIF9wWzE0XSA9IG0xICogYzIgKyBuMSAqIGcyICsgbzEgKiBrMiArIHAxICogbzIgO1xyXG4gICAgICAgIF9wWzE1XSA9IG0xICogZDIgKyBuMSAqIGgyICsgbzEgKiBsMiArIHAxICogcDIgO1xyXG5cclxuICAgICAgICB0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc0lkZW50aXR5KCkge1xyXG4gICAgICAgIGlmKCF0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQpe1xyXG4gICAgICAgICAgICB0aGlzLl9pZGVudGl0eSA9ICEodGhpcy5wcm9wc1swXSAhPT0gMSB8fCB0aGlzLnByb3BzWzFdICE9PSAwIHx8IHRoaXMucHJvcHNbMl0gIT09IDAgfHwgdGhpcy5wcm9wc1szXSAhPT0gMCB8fCB0aGlzLnByb3BzWzRdICE9PSAwIHx8IHRoaXMucHJvcHNbNV0gIT09IDEgfHwgdGhpcy5wcm9wc1s2XSAhPT0gMCB8fCB0aGlzLnByb3BzWzddICE9PSAwIHx8IHRoaXMucHJvcHNbOF0gIT09IDAgfHwgdGhpcy5wcm9wc1s5XSAhPT0gMCB8fCB0aGlzLnByb3BzWzEwXSAhPT0gMSB8fCB0aGlzLnByb3BzWzExXSAhPT0gMCB8fCB0aGlzLnByb3BzWzEyXSAhPT0gMCB8fCB0aGlzLnByb3BzWzEzXSAhPT0gMCB8fCB0aGlzLnByb3BzWzE0XSAhPT0gMCB8fCB0aGlzLnByb3BzWzE1XSAhPT0gMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lkZW50aXR5Q2FsY3VsYXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9pZGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlcXVhbHMobWF0cil7XHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHdoaWxlIChpIDwgMTYpIHtcclxuICAgICAgICAgICAgaWYobWF0ci5wcm9wc1tpXSAhPT0gdGhpcy5wcm9wc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrPTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb25lKG1hdHIpe1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIGZvcihpPTA7aTwxNjtpKz0xKXtcclxuICAgICAgICAgICAgbWF0ci5wcm9wc1tpXSA9IHRoaXMucHJvcHNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb25lRnJvbVByb3BzKHByb3BzKXtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICBmb3IoaT0wO2k8MTY7aSs9MSl7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcHNbaV0gPSBwcm9wc1tpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1BvaW50KHgsIHksIHopIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCAqIHRoaXMucHJvcHNbMF0gKyB5ICogdGhpcy5wcm9wc1s0XSArIHogKiB0aGlzLnByb3BzWzhdICsgdGhpcy5wcm9wc1sxMl0sXHJcbiAgICAgICAgICAgIHk6IHggKiB0aGlzLnByb3BzWzFdICsgeSAqIHRoaXMucHJvcHNbNV0gKyB6ICogdGhpcy5wcm9wc1s5XSArIHRoaXMucHJvcHNbMTNdLFxyXG4gICAgICAgICAgICB6OiB4ICogdGhpcy5wcm9wc1syXSArIHkgKiB0aGlzLnByb3BzWzZdICsgeiAqIHRoaXMucHJvcHNbMTBdICsgdGhpcy5wcm9wc1sxNF1cclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qcmV0dXJuIHtcclxuICAgICAgICAgeDogeCAqIG1lLmEgKyB5ICogbWUuYyArIG1lLmUsXHJcbiAgICAgICAgIHk6IHggKiBtZS5iICsgeSAqIG1lLmQgKyBtZS5mXHJcbiAgICAgICAgIH07Ki9cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9YKHgsIHksIHopIHtcclxuICAgICAgICByZXR1cm4geCAqIHRoaXMucHJvcHNbMF0gKyB5ICogdGhpcy5wcm9wc1s0XSArIHogKiB0aGlzLnByb3BzWzhdICsgdGhpcy5wcm9wc1sxMl07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBhcHBseVRvWSh4LCB5LCB6KSB7XHJcbiAgICAgICAgcmV0dXJuIHggKiB0aGlzLnByb3BzWzFdICsgeSAqIHRoaXMucHJvcHNbNV0gKyB6ICogdGhpcy5wcm9wc1s5XSArIHRoaXMucHJvcHNbMTNdO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1ooeCwgeSwgeikge1xyXG4gICAgICAgIHJldHVybiB4ICogdGhpcy5wcm9wc1syXSArIHkgKiB0aGlzLnByb3BzWzZdICsgeiAqIHRoaXMucHJvcHNbMTBdICsgdGhpcy5wcm9wc1sxNF07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW52ZXJzZVBvaW50KHB0KSB7XHJcbiAgICAgICAgdmFyIGRldGVybWluYW50ID0gdGhpcy5wcm9wc1swXSAqIHRoaXMucHJvcHNbNV0gLSB0aGlzLnByb3BzWzFdICogdGhpcy5wcm9wc1s0XTtcclxuICAgICAgICB2YXIgYSA9IHRoaXMucHJvcHNbNV0vZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgdmFyIGIgPSAtIHRoaXMucHJvcHNbMV0vZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgdmFyIGMgPSAtIHRoaXMucHJvcHNbNF0vZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgdmFyIGQgPSB0aGlzLnByb3BzWzBdL2RldGVybWluYW50O1xyXG4gICAgICAgIHZhciBlID0gKHRoaXMucHJvcHNbNF0gKiB0aGlzLnByb3BzWzEzXSAtIHRoaXMucHJvcHNbNV0gKiB0aGlzLnByb3BzWzEyXSkvZGV0ZXJtaW5hbnQ7XHJcbiAgICAgICAgdmFyIGYgPSAtICh0aGlzLnByb3BzWzBdICogdGhpcy5wcm9wc1sxM10gLSB0aGlzLnByb3BzWzFdICogdGhpcy5wcm9wc1sxMl0pL2RldGVybWluYW50O1xyXG4gICAgICAgIHJldHVybiBbcHRbMF0gKiBhICsgcHRbMV0gKiBjICsgZSwgcHRbMF0gKiBiICsgcHRbMV0gKiBkICsgZiwgMF07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW52ZXJzZVBvaW50cyhwdHMpe1xyXG4gICAgICAgIHZhciBpLCBsZW4gPSBwdHMubGVuZ3RoLCByZXRQdHMgPSBbXTtcclxuICAgICAgICBmb3IoaT0wO2k8bGVuO2krPTEpe1xyXG4gICAgICAgICAgICByZXRQdHNbaV0gPSBpbnZlcnNlUG9pbnQocHRzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldFB0cztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseVRvVHJpcGxlUG9pbnRzKHB0MSwgcHQyLCBwdDMpIHtcclxuICAgICAgICB2YXIgYXJyID0gY3JlYXRlVHlwZWRBcnJheSgnZmxvYXQzMicsIDYpO1xyXG4gICAgICAgIGlmKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgICAgIGFyclswXSA9IHB0MVswXTtcclxuICAgICAgICAgICAgYXJyWzFdID0gcHQxWzFdO1xyXG4gICAgICAgICAgICBhcnJbMl0gPSBwdDJbMF07XHJcbiAgICAgICAgICAgIGFyclszXSA9IHB0MlsxXTtcclxuICAgICAgICAgICAgYXJyWzRdID0gcHQzWzBdO1xyXG4gICAgICAgICAgICBhcnJbNV0gPSBwdDNbMV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHAwID0gdGhpcy5wcm9wc1swXSwgcDEgPSB0aGlzLnByb3BzWzFdLCBwNCA9IHRoaXMucHJvcHNbNF0sIHA1ID0gdGhpcy5wcm9wc1s1XSwgcDEyID0gdGhpcy5wcm9wc1sxMl0sIHAxMyA9IHRoaXMucHJvcHNbMTNdO1xyXG4gICAgICAgICAgICBhcnJbMF0gPSBwdDFbMF0gKiBwMCArIHB0MVsxXSAqIHA0ICsgcDEyO1xyXG4gICAgICAgICAgICBhcnJbMV0gPSBwdDFbMF0gKiBwMSArIHB0MVsxXSAqIHA1ICsgcDEzO1xyXG4gICAgICAgICAgICBhcnJbMl0gPSBwdDJbMF0gKiBwMCArIHB0MlsxXSAqIHA0ICsgcDEyO1xyXG4gICAgICAgICAgICBhcnJbM10gPSBwdDJbMF0gKiBwMSArIHB0MlsxXSAqIHA1ICsgcDEzO1xyXG4gICAgICAgICAgICBhcnJbNF0gPSBwdDNbMF0gKiBwMCArIHB0M1sxXSAqIHA0ICsgcDEyO1xyXG4gICAgICAgICAgICBhcnJbNV0gPSBwdDNbMF0gKiBwMSArIHB0M1sxXSAqIHA1ICsgcDEzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGx5VG9Qb2ludEFycmF5KHgseSx6KXtcclxuICAgICAgICB2YXIgYXJyO1xyXG4gICAgICAgIGlmKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgICAgIGFyciA9IFt4LHksel07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXJyID0gW3ggKiB0aGlzLnByb3BzWzBdICsgeSAqIHRoaXMucHJvcHNbNF0gKyB6ICogdGhpcy5wcm9wc1s4XSArIHRoaXMucHJvcHNbMTJdLHggKiB0aGlzLnByb3BzWzFdICsgeSAqIHRoaXMucHJvcHNbNV0gKyB6ICogdGhpcy5wcm9wc1s5XSArIHRoaXMucHJvcHNbMTNdLHggKiB0aGlzLnByb3BzWzJdICsgeSAqIHRoaXMucHJvcHNbNl0gKyB6ICogdGhpcy5wcm9wc1sxMF0gKyB0aGlzLnByb3BzWzE0XV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlUb1BvaW50U3RyaW5naWZpZWQoeCwgeSkge1xyXG4gICAgICAgIGlmKHRoaXMuaXNJZGVudGl0eSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4ICsgJywnICsgeTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICh4ICogdGhpcy5wcm9wc1swXSArIHkgKiB0aGlzLnByb3BzWzRdICsgdGhpcy5wcm9wc1sxMl0pKycsJysoeCAqIHRoaXMucHJvcHNbMV0gKyB5ICogdGhpcy5wcm9wc1s1XSArIHRoaXMucHJvcHNbMTNdKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b0NTUygpIHtcclxuICAgICAgICAvL0RvZXNuJ3QgbWFrZSBtdWNoIHNlbnNlIHRvIGFkZCB0aGlzIG9wdGltaXphdGlvbi4gSWYgaXQgaXMgYW4gaWRlbnRpdHkgbWF0cml4LCBpdCdzIHZlcnkgbGlrZWx5IHRoaXMgd2lsbCBnZXQgY2FsbGVkIG9ubHkgb25jZSBzaW5jZSBpdCB3b24ndCBiZSBrZXlmcmFtZWQuXHJcbiAgICAgICAgLyppZih0aGlzLmlzSWRlbnRpdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHZhciBwcm9wcyA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgdmFyIGNzc1ZhbHVlID0gJ21hdHJpeDNkKCc7XHJcbiAgICAgICAgdmFyIHYgPSAxMDAwMDtcclxuICAgICAgICB3aGlsZShpPDE2KXtcclxuICAgICAgICAgICAgY3NzVmFsdWUgKz0gX3JuZChwcm9wc1tpXSp2KS92O1xyXG4gICAgICAgICAgICBjc3NWYWx1ZSArPSBpID09PSAxNSA/ICcpJzonLCc7XHJcbiAgICAgICAgICAgIGkgKz0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNzc1ZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvMmRDU1MoKSB7XHJcbiAgICAgICAgLy9Eb2Vzbid0IG1ha2UgbXVjaCBzZW5zZSB0byBhZGQgdGhpcyBvcHRpbWl6YXRpb24uIElmIGl0IGlzIGFuIGlkZW50aXR5IG1hdHJpeCwgaXQncyB2ZXJ5IGxpa2VseSB0aGlzIHdpbGwgZ2V0IGNhbGxlZCBvbmx5IG9uY2Ugc2luY2UgaXQgd29uJ3QgYmUga2V5ZnJhbWVkLlxyXG4gICAgICAgIC8qaWYodGhpcy5pc0lkZW50aXR5KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHZhciB2ID0gMTAwMDA7XHJcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gXCJtYXRyaXgoXCIgKyBfcm5kKHByb3BzWzBdKnYpL3YgKyAnLCcgKyBfcm5kKHByb3BzWzFdKnYpL3YgKyAnLCcgKyBfcm5kKHByb3BzWzRdKnYpL3YgKyAnLCcgKyBfcm5kKHByb3BzWzVdKnYpL3YgKyAnLCcgKyBfcm5kKHByb3BzWzEyXSp2KS92ICsgJywnICsgX3JuZChwcm9wc1sxM10qdikvdiArIFwiKVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIE1hdHJpeEluc3RhbmNlKCl7XHJcbiAgICAgICAgdGhpcy5yZXNldCA9IHJlc2V0O1xyXG4gICAgICAgIHRoaXMucm90YXRlID0gcm90YXRlO1xyXG4gICAgICAgIHRoaXMucm90YXRlWCA9IHJvdGF0ZVg7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVZID0gcm90YXRlWTtcclxuICAgICAgICB0aGlzLnJvdGF0ZVogPSByb3RhdGVaO1xyXG4gICAgICAgIHRoaXMuc2tldyA9IHNrZXc7XHJcbiAgICAgICAgdGhpcy5za2V3RnJvbUF4aXMgPSBza2V3RnJvbUF4aXM7XHJcbiAgICAgICAgdGhpcy5zaGVhciA9IHNoZWFyO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuICAgICAgICB0aGlzLnNldFRyYW5zZm9ybSA9IHNldFRyYW5zZm9ybTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuICAgICAgICB0aGlzLmFwcGx5VG9Qb2ludCA9IGFwcGx5VG9Qb2ludDtcclxuICAgICAgICB0aGlzLmFwcGx5VG9YID0gYXBwbHlUb1g7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvWSA9IGFwcGx5VG9ZO1xyXG4gICAgICAgIHRoaXMuYXBwbHlUb1ogPSBhcHBseVRvWjtcclxuICAgICAgICB0aGlzLmFwcGx5VG9Qb2ludEFycmF5ID0gYXBwbHlUb1BvaW50QXJyYXk7XHJcbiAgICAgICAgdGhpcy5hcHBseVRvVHJpcGxlUG9pbnRzID0gYXBwbHlUb1RyaXBsZVBvaW50cztcclxuICAgICAgICB0aGlzLmFwcGx5VG9Qb2ludFN0cmluZ2lmaWVkID0gYXBwbHlUb1BvaW50U3RyaW5naWZpZWQ7XHJcbiAgICAgICAgdGhpcy50b0NTUyA9IHRvQ1NTO1xyXG4gICAgICAgIHRoaXMudG8yZENTUyA9IHRvMmRDU1M7XHJcbiAgICAgICAgdGhpcy5jbG9uZSA9IGNsb25lO1xyXG4gICAgICAgIHRoaXMuY2xvbmVGcm9tUHJvcHMgPSBjbG9uZUZyb21Qcm9wcztcclxuICAgICAgICB0aGlzLmVxdWFscyA9IGVxdWFscztcclxuICAgICAgICB0aGlzLmludmVyc2VQb2ludHMgPSBpbnZlcnNlUG9pbnRzO1xyXG4gICAgICAgIHRoaXMuaW52ZXJzZVBvaW50ID0gaW52ZXJzZVBvaW50O1xyXG4gICAgICAgIHRoaXMuX3QgPSB0aGlzLnRyYW5zZm9ybTtcclxuICAgICAgICB0aGlzLmlzSWRlbnRpdHkgPSBpc0lkZW50aXR5O1xyXG4gICAgICAgIHRoaXMuX2lkZW50aXR5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9pZGVudGl0eUNhbGN1bGF0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcyA9IGNyZWF0ZVR5cGVkQXJyYXkoJ2Zsb2F0MzInLCAxNik7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXhJbnN0YW5jZSgpXHJcbiAgICB9XHJcbn0oKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDsiLCJ2YXIgY3JlYXRlVHlwZWRBcnJheSA9IChmdW5jdGlvbigpe1xyXG5cdGZ1bmN0aW9uIGNyZWF0ZVJlZ3VsYXJBcnJheSh0eXBlLCBsZW4pe1xyXG5cdFx0dmFyIGkgPSAwLCBhcnIgPSBbXSwgdmFsdWU7XHJcblx0XHRzd2l0Y2godHlwZSkge1xyXG5cdFx0XHRjYXNlICdpbnQxNic6XHJcblx0XHRcdGNhc2UgJ3VpbnQ4Yyc6XHJcblx0XHRcdFx0dmFsdWUgPSAxO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHZhbHVlID0gMS4xO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0YXJyLnB1c2godmFsdWUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFycjtcclxuXHR9XHJcblx0ZnVuY3Rpb24gY3JlYXRlVHlwZWRBcnJheSh0eXBlLCBsZW4pe1xyXG5cdFx0aWYodHlwZSA9PT0gJ2Zsb2F0MzInKSB7XHJcblx0XHRcdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGxlbik7XHJcblx0XHR9IGVsc2UgaWYodHlwZSA9PT0gJ2ludDE2Jykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEludDE2QXJyYXkobGVuKTtcclxuXHRcdH0gZWxzZSBpZih0eXBlID09PSAndWludDhjJykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGxlbik7XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmKHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgRmxvYXQzMkFycmF5ID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRyZXR1cm4gY3JlYXRlVHlwZWRBcnJheTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIGNyZWF0ZVJlZ3VsYXJBcnJheTtcclxuXHR9XHJcbn0oKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVR5cGVkQXJyYXk7XHJcbiIsInZhciBBbmltYXRpb25JdGVtID0gcmVxdWlyZSgnLi9hbmltYXRpb24vQW5pbWF0aW9uSXRlbScpO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uQXBpKGFuaW0pIHtcclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgQW5pbWF0aW9uSXRlbShhbmltKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGNyZWF0ZUFuaW1hdGlvbkFwaSA6IGNyZWF0ZUFuaW1hdGlvbkFwaVxyXG59IiwidmFyIGtleVBhdGhCdWlsZGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9rZXlQYXRoQnVpbGRlcicpO1xyXG52YXIgbGF5ZXJfYXBpID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXllckFQSUJ1aWxkZXInKTtcclxudmFyIHNhbml0aXplU3RyaW5nID0gcmVxdWlyZSgnLi4vaGVscGVycy9zdHJpbmdTYW5pdGl6ZXInKTtcclxudmFyIGxheWVyX3R5cGVzID0gcmVxdWlyZSgnLi4vZW51bXMvbGF5ZXJfdHlwZXMnKTtcclxuXHJcbmZ1bmN0aW9uIEtleVBhdGhMaXN0KGVsZW1lbnRzLCBub2RlX3R5cGUpIHtcclxuXHJcblx0ZnVuY3Rpb24gX2dldExlbmd0aCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5sZW5ndGg7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLnR5ID09PSBsYXllcl90eXBlc1t0eXBlXTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCBuYW1lKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS5ubSA9PT0gbmFtZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlQcm9wZXJ0eShlbGVtZW50cywgbmFtZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHZhciBsYXllckFQSSA9IGxheWVyX2FwaShlbGVtZW50KTtcclxuXHRcdFx0aWYobGF5ZXJBUEkuaGFzUHJvcGVydHkobmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gbGF5ZXJBUEkuZ2V0UHJvcGVydHkobmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeVR5cGUoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHNlbGVjdG9yKSwgJ2xheWVyJyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeU5hbWUoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIHNlbGVjdG9yKSwgJ2xheWVyJyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRQcm9wZXJ0aWVzQnlTZWxlY3RvcihzZWxlY3Rvcikge1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50Lmhhc1Byb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldFByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdH0pLCAncHJvcGVydHknKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExheWVyUHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHZhciBsYXllcnMgPSBfZmlsdGVyTGF5ZXJCeVByb3BlcnR5KGVsZW1lbnRzLCBzZWxlY3Rvcik7XHJcblx0XHR2YXIgcHJvcGVydGllcyA9IGxheWVycy5tYXAoZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRcdHJldHVybiBsYXllcl9hcGkoZWxlbWVudCkuZ2V0UHJvcGVydHkoc2VsZWN0b3IpO1xyXG5cdFx0fSlcclxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChwcm9wZXJ0aWVzLCAncHJvcGVydHknKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEtleVBhdGgocHJvcGVydHlQYXRoKSB7XHJcblx0XHR2YXIga2V5UGF0aERhdGEgPSBrZXlQYXRoQnVpbGRlcihwcm9wZXJ0eVBhdGgpO1xyXG5cdFx0dmFyIHNlbGVjdG9yID0gc2FuaXRpemVTdHJpbmcoa2V5UGF0aERhdGEuc2VsZWN0b3IpO1xyXG5cdFx0dmFyIG5vZGVzQnlOYW1lLCBub2Rlc0J5VHlwZSwgc2VsZWN0ZWROb2RlcztcclxuXHRcdGlmIChub2RlX3R5cGUgPT09ICdyZW5kZXJlcicgfHwgbm9kZV90eXBlID09PSAnbGF5ZXInKSB7XHJcblx0XHRcdG5vZGVzQnlOYW1lID0gZ2V0TGF5ZXJzQnlOYW1lKHNlbGVjdG9yKTtcclxuXHRcdFx0bm9kZXNCeVR5cGUgPSBnZXRMYXllcnNCeVR5cGUoc2VsZWN0b3IpO1xyXG5cdFx0XHRpZiAobm9kZXNCeU5hbWUubGVuZ3RoID09PSAwICYmIG5vZGVzQnlUeXBlLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdHNlbGVjdGVkTm9kZXMgPSBnZXRMYXllclByb3BlcnR5KHNlbGVjdG9yKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZWxlY3RlZE5vZGVzID0gbm9kZXNCeU5hbWUuY29uY2F0KG5vZGVzQnlUeXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoa2V5UGF0aERhdGEucHJvcGVydHlQYXRoKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXMuZ2V0S2V5UGF0aChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVzO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYobm9kZV90eXBlID09PSAncHJvcGVydHknKSB7XHJcblx0XHRcdHNlbGVjdGVkTm9kZXMgPSBnZXRQcm9wZXJ0aWVzQnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdGlmIChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2Rlcy5nZXRLZXlQYXRoKGtleVBhdGhEYXRhLnByb3BlcnR5UGF0aCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbmNhdChub2Rlcykge1xyXG5cdFx0dmFyIG5vZGVzRWxlbWVudHMgPSBub2Rlcy5nZXRFbGVtZW50cygpO1xyXG5cdFx0cmV0dXJuIEtleVBhdGhMaXN0KGVsZW1lbnRzLmNvbmNhdChub2Rlc0VsZW1lbnRzKSwgbm9kZV90eXBlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEVsZW1lbnRzKCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHlBdEluZGV4KGluZGV4KSB7XHJcblx0XHRjb25zb2xlLmxvZygnbm9kZV90eXBlOiAnLCBub2RlX3R5cGUpXHJcblx0XHRpZihub2RlX3R5cGUgPT09ICdsYXllcicpIHtcclxuXHRcdFx0cmV0dXJuIGxheWVyX2FwaShlbGVtZW50c1tpbmRleF0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnRzW2luZGV4XTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0S2V5UGF0aDogZ2V0S2V5UGF0aCxcclxuXHRcdGNvbmNhdDogY29uY2F0LFxyXG5cdFx0Z2V0RWxlbWVudHM6IGdldEVsZW1lbnRzLFxyXG5cdFx0Z2V0UHJvcGVydHlBdEluZGV4OiBnZXRQcm9wZXJ0eUF0SW5kZXhcclxuXHR9XHJcblxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbGVuZ3RoJywge1xyXG5cdFx0Z2V0OiBfZ2V0TGVuZ3RoXHJcblx0fSk7XHJcblxyXG5cdHJldHVybiBtZXRob2RzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleVBhdGhMaXN0OyIsInZhciBrZXlfcGF0aF9zZXBhcmF0b3IgPSByZXF1aXJlKCcuLi9lbnVtcy9rZXlfcGF0aF9zZXBhcmF0b3InKTtcclxudmFyIHByb3BlcnR5X25hbWVzID0gcmVxdWlyZSgnLi4vZW51bXMvcHJvcGVydHlfbmFtZXMnKTtcclxuXHJcbmZ1bmN0aW9uIEtleVBhdGhOb2RlKHN0YXRlLCBub2RlX3R5cGUpIHtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IsIHByb3BlcnR5UGF0aCkge1xyXG5cdFx0dmFyIGluc3RhbmNlUHJvcGVydGllcyA9IHN0YXRlLnByb3BlcnRpZXMgfHwgW107XHJcblx0XHR2YXIgaSA9IDAsIGxlbiA9IGluc3RhbmNlUHJvcGVydGllcy5sZW5ndGg7XHJcblx0XHR3aGlsZShpIDwgbGVuKSB7XHJcblx0XHRcdGlmKGluc3RhbmNlUHJvcGVydGllc1tpXS5uYW1lID09PSBzZWxlY3Rvcikge1xyXG5cdFx0XHRcdHJldHVybiBpbnN0YW5jZVByb3BlcnRpZXNbaV0udmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0aSArPSAxO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaGFzUHJvcGVydHkoc2VsZWN0b3IpIHtcclxuXHRcdHJldHVybiAhIWdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5KHNlbGVjdG9yKSB7XHJcblx0XHRyZXR1cm4gZ2V0UHJvcGVydHlCeVBhdGgoc2VsZWN0b3IpO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRoYXNQcm9wZXJ0eTogaGFzUHJvcGVydHksXHJcblx0XHRnZXRQcm9wZXJ0eTogZ2V0UHJvcGVydHlcclxuXHR9XHJcblxyXG5cdHJldHVybiBtZXRob2RzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleVBhdGhOb2RlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL3RyYW5zZm9ybS9UcmFuc2Zvcm0nKTtcclxudmFyIEVmZmVjdHMgPSByZXF1aXJlKCcuL2VmZmVjdHMvRWZmZWN0cycpO1xyXG52YXIgTWF0cml4ID0gcmVxdWlyZSgnLi4vaGVscGVycy90cmFuc2Zvcm1hdGlvbk1hdHJpeCcpO1xyXG5cclxuZnVuY3Rpb24gTGF5ZXJCYXNlKHN0YXRlKSB7XHJcblxyXG5cdHZhciB0cmFuc2Zvcm0gPSBUcmFuc2Zvcm0oc3RhdGUuZWxlbWVudC5maW5hbFRyYW5zZm9ybS5tUHJvcCk7XHJcblx0dmFyIGVmZmVjdHMgPSBFZmZlY3RzKHN0YXRlLmVsZW1lbnQuZWZmZWN0c01hbmFnZXIuZWZmZWN0RWxlbWVudHMpO1xyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHN0YXRlLnByb3BlcnRpZXMucHVzaCh7XHJcblx0XHRcdG5hbWU6ICd0cmFuc2Zvcm0nLFxyXG5cdFx0XHR2YWx1ZTogdHJhbnNmb3JtXHJcblx0XHR9LHtcclxuXHRcdFx0bmFtZTogJ1RyYW5zZm9ybScsXHJcblx0XHRcdHZhbHVlOiB0cmFuc2Zvcm1cclxuXHRcdH0se1xyXG5cdFx0XHRuYW1lOiAnRWZmZWN0cycsXHJcblx0XHRcdHZhbHVlOiBlZmZlY3RzXHJcblx0XHR9LHtcclxuXHRcdFx0bmFtZTogJ2VmZmVjdHMnLFxyXG5cdFx0XHR2YWx1ZTogZWZmZWN0c1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRhcmdldEVsZW1lbnQoKSB7XHJcblx0XHRyZXR1cm4gc3RhdGUuZWxlbWVudDtcclxuXHR9XHJcblxyXG5cdC8qXHJcblx0ZnVuY3Rpb24gZnJvbVdvcmxkKGFyciwgdGltZSl7XHJcbiAgICAgICAgdmFyIHRvV29ybGRNYXQgPSBuZXcgTWF0cml4KCk7XHJcbiAgICAgICAgdG9Xb3JsZE1hdC5yZXNldCgpO1xyXG4gICAgICAgIHZhciB0cmFuc2Zvcm1NYXQ7XHJcbiAgICAgICAgaWYodGltZSkge1xyXG4gICAgICAgICAgICAvL1RvZG8gaW1wbGVtZW50IHZhbHVlIGF0IHRpbWUgb24gdHJhbnNmb3JtIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgLy90cmFuc2Zvcm1NYXQgPSB0aGlzLl9lbGVtLmZpbmFsVHJhbnNmb3JtLm1Qcm9wLmdldFZhbHVlQXRUaW1lKHRpbWUpO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1NYXQgPSB0aGlzLl9lbGVtLmZpbmFsVHJhbnNmb3JtLm1Qcm9wO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybU1hdCA9IHRoaXMuX2VsZW0uZmluYWxUcmFuc2Zvcm0ubVByb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIGlmKHRoaXMuX2VsZW0uaGllcmFyY2h5ICYmIHRoaXMuX2VsZW0uaGllcmFyY2h5Lmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHZhciBpLCBsZW4gPSB0aGlzLl9lbGVtLmhpZXJhcmNoeS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtLmhpZXJhcmNoeVtpXS5maW5hbFRyYW5zZm9ybS5tUHJvcC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b1dvcmxkTWF0LmludmVyc2VQb2ludChhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG9Xb3JsZE1hdC5pbnZlcnNlUG9pbnQoYXJyKTtcclxuICAgIH0qL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRUb1BvaW50KGVsZW1lbnQsIHBvaW50KSB7XHJcbiAgICAgICAgaWYoZWxlbWVudC5jb21wICYmIGVsZW1lbnQuY29tcC5maW5hbFRyYW5zZm9ybSkge1xyXG4gICAgICAgIFx0cG9pbnQgPSBnZXRFbGVtZW50VG9Qb2ludChlbGVtZW50LmNvbXAsIHBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICBcdHZhciB0b1dvcmxkTWF0ID0gTWF0cml4KCk7XHJcbiAgICAgICAgdmFyIHRyYW5zZm9ybU1hdDtcclxuICAgICAgICB0cmFuc2Zvcm1NYXQgPSBlbGVtZW50LmZpbmFsVHJhbnNmb3JtLm1Qcm9wO1xyXG4gICAgICAgIHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgIGlmKGVsZW1lbnQuaGllcmFyY2h5ICYmIGVsZW1lbnQuaGllcmFyY2h5Lmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHZhciBpLCBsZW4gPSBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmhpZXJhcmNoeVtpXS5maW5hbFRyYW5zZm9ybS5tUHJvcC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b1dvcmxkTWF0LmludmVyc2VQb2ludChwb2ludCk7XHJcbiAgICB9XHJcblxyXG5cdGZ1bmN0aW9uIHRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHJldHVybiBnZXRFbGVtZW50VG9Qb2ludChzdGF0ZS5lbGVtZW50LCBwb2ludCk7XHJcblx0fVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRGcm9tUG9pbnQoZWxlbWVudCwgcG9pbnQpIHtcclxuICAgIFx0dmFyIHRvV29ybGRNYXQgPSBNYXRyaXgoKTtcclxuICAgICAgICB2YXIgdHJhbnNmb3JtTWF0ID0gZWxlbWVudC5maW5hbFRyYW5zZm9ybS5tUHJvcDtcclxuICAgICAgICB0cmFuc2Zvcm1NYXQuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICBpZihlbGVtZW50LmhpZXJhcmNoeSAmJiBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGgpe1xyXG4gICAgICAgICAgICB2YXIgaSwgbGVuID0gZWxlbWVudC5oaWVyYXJjaHkubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IoaT0wO2k8bGVuO2krPTEpe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5oaWVyYXJjaHlbaV0uZmluYWxUcmFuc2Zvcm0ubVByb3AuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludCA9IHRvV29ybGRNYXQuYXBwbHlUb1BvaW50QXJyYXkocG9pbnRbMF0scG9pbnRbMV0scG9pbnRbMl18fDApO1xyXG4gICAgICAgIGlmKGVsZW1lbnQuY29tcCAmJiBlbGVtZW50LmNvbXAuZmluYWxUcmFuc2Zvcm0pIHtcclxuICAgICAgICBcdHBvaW50ID0gZ2V0RWxlbWVudEZyb21Qb2ludChlbGVtZW50LmNvbXAsIHBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBvaW50O1xyXG4gICAgfVxyXG5cclxuXHRmdW5jdGlvbiBmcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcclxuXHRcdHJldHVybiBnZXRFbGVtZW50RnJvbVBvaW50KHN0YXRlLmVsZW1lbnQsIHBvaW50KTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGFyZ2V0RWxlbWVudDogZ2V0VGFyZ2V0RWxlbWVudCxcclxuXHRcdHRvS2V5cGF0aExheWVyUG9pbnQ6IHRvS2V5cGF0aExheWVyUG9pbnQsXHJcblx0XHRmcm9tS2V5cGF0aExheWVyUG9pbnQ6IGZyb21LZXlwYXRoTGF5ZXJQb2ludFxyXG5cdH1cclxuXHJcblx0X2J1aWxkUHJvcGVydHlNYXAoKTtcclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXllckJhc2U7IiwidmFyIGxheWVyX3R5cGVzID0gcmVxdWlyZSgnLi4vZW51bXMvbGF5ZXJfdHlwZXMnKTtcclxudmFyIGxheWVyX2FwaSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5ZXJBUElCdWlsZGVyJyk7XHJcblxyXG5mdW5jdGlvbiBMYXllckxpc3QoZWxlbWVudHMpIHtcclxuXHJcblx0ZnVuY3Rpb24gX2dldExlbmd0aCgpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5sZW5ndGg7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLnR5ID09PSBsYXllcl90eXBlc1t0eXBlXTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCBuYW1lKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZGF0YS5ubSA9PT0gbmFtZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzKCkge1xyXG5cdFx0IHJldHVybiBMYXllckxpc3QoZWxlbWVudHMpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlUeXBlKHR5cGUpIHtcclxuXHRcdHZhciBlbGVtZW50c0xpc3QgPSBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpO1xyXG5cdFx0cmV0dXJuIExheWVyTGlzdChlbGVtZW50c0xpc3QpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlOYW1lKHR5cGUpIHtcclxuXHRcdHZhciBlbGVtZW50c0xpc3QgPSBfZmlsdGVyTGF5ZXJCeU5hbWUoZWxlbWVudHMsIHR5cGUpO1xyXG5cdFx0cmV0dXJuIExheWVyTGlzdChlbGVtZW50c0xpc3QpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbGF5ZXIoaW5kZXgpIHtcclxuXHRcdGlmIChpbmRleCA+PSBlbGVtZW50cy5sZW5ndGgpIHtcclxuXHRcdFx0cmV0dXJuIFtdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGxheWVyX2FwaShlbGVtZW50c1twYXJzZUludChpbmRleCldKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZEl0ZXJhdGFibGVNZXRob2RzKGl0ZXJhdGFibGVNZXRob2RzLCBsaXN0KSB7XHJcblx0XHRpdGVyYXRhYmxlTWV0aG9kcy5yZWR1Y2UoZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlKXtcclxuXHRcdFx0dmFyIF92YWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRhY2N1bXVsYXRvclt2YWx1ZV0gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcclxuXHRcdFx0XHRyZXR1cm4gZWxlbWVudHMubWFwKGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0XHRcdFx0dmFyIGxheWVyID0gbGF5ZXJfYXBpKGVsZW1lbnQpO1xyXG5cdFx0XHRcdFx0aWYobGF5ZXJbX3ZhbHVlXSkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbGF5ZXJbX3ZhbHVlXS5hcHBseShudWxsLCBfYXJndW1lbnRzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBhY2N1bXVsYXRvcjtcclxuXHRcdH0sIG1ldGhvZHMpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0RWxlbWVudHMoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudHM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25jYXQobGlzdCkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmNvbmNhdChsaXN0LmdldFRhcmdldEVsZW1lbnRzKCkpO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRnZXRMYXllcnM6IGdldExheWVycyxcclxuXHRcdGdldExheWVyc0J5VHlwZTogZ2V0TGF5ZXJzQnlUeXBlLFxyXG5cdFx0Z2V0TGF5ZXJzQnlOYW1lOiBnZXRMYXllcnNCeU5hbWUsXHJcblx0XHRsYXllcjogbGF5ZXIsXHJcblx0XHRjb25jYXQ6IGNvbmNhdCxcclxuXHRcdGdldFRhcmdldEVsZW1lbnRzOiBnZXRUYXJnZXRFbGVtZW50c1xyXG5cdH07XHJcblxyXG5cdGFkZEl0ZXJhdGFibGVNZXRob2RzKFsnc2V0VHJhbnNsYXRlJywgJ2dldFR5cGUnLCAnZ2V0RHVyYXRpb24nXSk7XHJcblx0YWRkSXRlcmF0YWJsZU1ldGhvZHMoWydzZXRUZXh0JywgJ2dldFRleHQnLCAnc2V0RG9jdW1lbnREYXRhJywgJ2NhblJlc2l6ZUZvbnQnLCAnc2V0TWluaW11bUZvbnRTaXplJ10pO1xyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobWV0aG9kcywgJ2xlbmd0aCcsIHtcclxuXHRcdGdldDogX2dldExlbmd0aFxyXG5cdH0pO1xyXG5cdHJldHVybiBtZXRob2RzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyTGlzdDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gQ2FtZXJhKGVsZW1lbnQpIHtcclxuXHRjb25zb2xlLmxvZygnZWxlbWVudDogJywgZWxlbWVudClcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb2ludE9mSW50ZXJlc3QodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuYSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Wm9vbSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5wZSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9zaXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0WFJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnJ4KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRZUm90YXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucnkpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFpSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5yeikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1BvaW50IG9mIEludGVyZXN0JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvaW50T2ZJbnRlcmVzdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdab29tJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFpvb21cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UG9zaXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnWCBSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRYUm90YXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnWSBSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRZUm90YXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnWiBSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRaUm90YXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIEtleVBhdGhOb2RlKHN0YXRlKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhOyIsInZhciBLZXlQYXRoTGlzdCA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhMaXN0Jyk7XHJcbnZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxudmFyIGxheWVyX2FwaSA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvbGF5ZXJBUElCdWlsZGVyJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBDb21wb3NpdGlvbihlbGVtZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0VGltZVJlbWFwKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnRtKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRcclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHZhciBjb21wb3NpdGlvbkxheWVycyA9IGVsZW1lbnQubGF5ZXJzLm1hcChmdW5jdGlvbihsYXllciwgaW5kZXgpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRuYW1lOiBsYXllci5ubSxcclxuXHRcdFx0XHR2YWx1ZTogbGF5ZXJfYXBpKGVsZW1lbnQuZWxlbWVudHNbaW5kZXhdKVxyXG5cdFx0XHR9O1xyXG5cdFx0fSlcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnVGltZSBSZW1hcCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRUaW1lUmVtYXBcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF0uY29uY2F0KGNvbXBvc2l0aW9uTGF5ZXJzKVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgTGF5ZXJCYXNlKHN0YXRlKSwgS2V5UGF0aExpc3Qoc3RhdGUuZWxlbWVudHMsICdsYXllcicpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NpdGlvbjsiLCJ2YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gRWZmZWN0RWxlbWVudChlZmZlY3QpIHtcclxuXHJcblx0ZnVuY3Rpb24gc2V0VmFsdWUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVmZmVjdC5wKS5zZXRWYWx1ZSh2YWx1ZSlcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRzZXRWYWx1ZTogc2V0VmFsdWVcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWZmZWN0RWxlbWVudDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG52YXIgRWZmZWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vRWZmZWN0RWxlbWVudCcpO1xyXG5cclxuZnVuY3Rpb24gRWZmZWN0cyhlZmZlY3RzKSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IGJ1aWxkUHJvcGVydGllcygpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRWYWx1ZShlZmZlY3REYXRhLCBpbmRleCkge1xyXG5cdFx0dmFyIG5tID0gZWZmZWN0RGF0YS5kYXRhID8gZWZmZWN0RGF0YS5kYXRhLm5tIDogaW5kZXgudG9TdHJpbmcoKTtcclxuXHRcdHZhciBlZmZlY3RFbGVtZW50ID0gZWZmZWN0RGF0YS5kYXRhID8gRWZmZWN0cyhlZmZlY3REYXRhLmVmZmVjdEVsZW1lbnRzKSA6IEVmZmVjdEVsZW1lbnQoZWZmZWN0RGF0YSk7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lOiBubSxcclxuXHRcdFx0dmFsdWU6IGVmZmVjdEVsZW1lbnRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkUHJvcGVydGllcygpIHtcclxuXHRcdHZhciBpLCBsZW4gPSBlZmZlY3RzLmxlbmd0aDtcclxuXHRcdHZhciBhcnIgPSBbXTtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xyXG5cdFx0XHRhcnIucHVzaChnZXRWYWx1ZShlZmZlY3RzW2ldLCBpKSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYXJyO1xyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVmZmVjdHM7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xyXG5cclxuZnVuY3Rpb24gSW1hZ2UoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBMYXllckJhc2UoZWxlbWVudCksIG1ldGhvZHMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcclxuXHJcbmZ1bmN0aW9uIE51bGxFbGVtZW50KGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge307XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBMYXllckJhc2Uoc3RhdGUpLCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOdWxsRWxlbWVudDsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBTaGFwZVJlY3RhbmdsZSA9IHJlcXVpcmUoJy4vU2hhcGVSZWN0YW5nbGUnKTtcclxudmFyIFNoYXBlRmlsbCA9IHJlcXVpcmUoJy4vU2hhcGVGaWxsJyk7XHJcbnZhciBTaGFwZVN0cm9rZSA9IHJlcXVpcmUoJy4vU2hhcGVTdHJva2UnKTtcclxudmFyIFNoYXBlRWxsaXBzZSA9IHJlcXVpcmUoJy4vU2hhcGVFbGxpcHNlJyk7XHJcbnZhciBTaGFwZUdyYWRpZW50RmlsbCA9IHJlcXVpcmUoJy4vU2hhcGVHcmFkaWVudEZpbGwnKTtcclxudmFyIFNoYXBlR3JhZGllbnRTdHJva2UgPSByZXF1aXJlKCcuL1NoYXBlR3JhZGllbnRTdHJva2UnKTtcclxudmFyIFNoYXBlVHJpbVBhdGhzID0gcmVxdWlyZSgnLi9TaGFwZVRyaW1QYXRocycpO1xyXG52YXIgU2hhcGVSZXBlYXRlciA9IHJlcXVpcmUoJy4vU2hhcGVSZXBlYXRlcicpO1xyXG52YXIgU2hhcGVQb2x5c3RhciA9IHJlcXVpcmUoJy4vU2hhcGVQb2x5c3RhcicpO1xyXG52YXIgU2hhcGVSb3VuZENvcm5lcnMgPSByZXF1aXJlKCcuL1NoYXBlUm91bmRDb3JuZXJzJyk7XHJcbnZhciBTaGFwZVBhdGggPSByZXF1aXJlKCcuL1NoYXBlUGF0aCcpO1xyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi4vdHJhbnNmb3JtL1RyYW5zZm9ybScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGUoZWxlbWVudCwgc2hhcGVzRGF0YSwgc2hhcGVzKSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpLFxyXG5cdFx0ZWxlbWVudDogZWxlbWVudFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpIHtcclxuXHRcdHZhciBvYiA9IHtcclxuXHRcdFx0bmFtZTogc2hhcGUubm1cclxuXHRcdH1cclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYiwgJ3ZhbHVlJywge1xyXG5cdFx0ICAgZ2V0KCkgeyBcclxuXHQgICBcdFx0aWYoc2hhcGUudHkgPT09ICdncicpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGUoZWxlbWVudCwgc2hhcGVzRGF0YVtpbmRleF0uaXQsIHNoYXBlc1tpbmRleF0uaXQpO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdyYycpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVSZWN0YW5nbGUoc2hhcGVzW2luZGV4XSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2VsJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZUVsbGlwc2Uoc2hhcGVzW2luZGV4XSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2ZsJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZUZpbGwoc2hhcGVzW2luZGV4XSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3N0Jykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVN0cm9rZShzaGFwZXNbaW5kZXhdKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnZ2YnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlR3JhZGllbnRGaWxsKHNoYXBlc1tpbmRleF0pO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdncycpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVHcmFkaWVudFN0cm9rZShzaGFwZXNbaW5kZXhdKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAndG0nKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlVHJpbVBhdGhzKHNoYXBlc1tpbmRleF0pO1xyXG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdycCcpIHtcclxuXHQgICBcdFx0XHRyZXR1cm4gU2hhcGVSZXBlYXRlcihzaGFwZXNbaW5kZXhdKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnc3InKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlUG9seXN0YXIoc2hhcGVzW2luZGV4XSk7XHJcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3JkJykge1xyXG5cdCAgIFx0XHRcdHJldHVybiBTaGFwZVJvdW5kQ29ybmVycyhzaGFwZXNbaW5kZXhdKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnc2gnKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFNoYXBlUGF0aChzaGFwZXNbaW5kZXhdKTtcclxuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAndHInKSB7XHJcblx0ICAgXHRcdFx0cmV0dXJuIFRyYW5zZm9ybShzaGFwZXNbaW5kZXhdLnRyYW5zZm9ybS5tUHJvcHMpO1xyXG5cdCAgIFx0XHR9IGVsc2Uge1xyXG5cdCAgIFx0XHRcdGNvbnNvbGUubG9nKHNoYXBlLnR5KTtcclxuXHQgICBcdFx0fVxyXG5cdFx0ICAgfVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb2JcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0dmFyIHNoYXBlcyA9IHNoYXBlc0RhdGEubWFwKGZ1bmN0aW9uKHNoYXBlLCBpbmRleCkge1xyXG5cdFx0XHRyZXR1cm4gYnVpbGRTaGFwZU9iamVjdChzaGFwZSwgaW5kZXgpXHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBzaGFwZXNcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0dmFyIGluc3RhbmNlID0gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJCYXNlKHN0YXRlKSwgbWV0aG9kcyk7XHJcblx0Y29uc29sZS5sb2coJ2luc3RhbmNlOiAnLCBpbnN0YW5jZSlcclxuXHRyZXR1cm4gaW5zdGFuY2U7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlRWxsaXBzZShlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFNpemUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9zaXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1NpemUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2l6ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlRWxsaXBzZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVGaWxsKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Q29sb3IodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuYykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnY29sb3InLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Q29sb3JcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnb3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVGaWxsOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUdyYWRpZW50RmlsbChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0YXJ0UG9pbnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RW5kUG9pbnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuZSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRIaWdobGlnaHRMZW5ndGgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuaCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SGlnaGxpZ2h0QW5nbGUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuYSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Q29sb3JzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LmcucHJvcCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1N0YXJ0IFBvaW50JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0YXJ0UG9pbnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnRW5kIFBvaW50JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEVuZFBvaW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3BhY2l0eVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgTGVuZ3RoJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEhpZ2hsaWdodExlbmd0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdIaWdobGlnaHQgQW5nbGUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0SGlnaGxpZ2h0QW5nbGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQ29sb3JzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldENvbG9yc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlR3JhZGllbnRGaWxsOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZUdyYWRpZW50U3Ryb2tlKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3RhcnRQb2ludCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRFbmRQb2ludCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5lKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEhpZ2hsaWdodExlbmd0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5oKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRIaWdobGlnaHRBbmdsZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5hKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRDb2xvcnModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuZy5wcm9wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VXaWR0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC53KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnU3RhcnQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3RhcnRQb2ludFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdFbmQgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RW5kUG9pbnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBMZW5ndGgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0SGlnaGxpZ2h0TGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBBbmdsZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRIaWdobGlnaHRBbmdsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdDb2xvcnMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Q29sb3JzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1N0cm9rZSBXaWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VXaWR0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlR3JhZGllbnRTdHJva2U7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUGF0aChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBhdGgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdwYXRoJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBhdGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVBhdGg7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlUG9seXN0YXIoZWxlbWVudCkge1xyXG5cdGNvbnNvbGUubG9nKGVsZW1lbnQpO1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb2ludHModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucHQpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLnApLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJvdGF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLnIpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldElubmVyUmFkaXVzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLmlyKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPdXRlclJhZGl1cyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaC5vcikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SW5uZXJSb3VuZG5lc3ModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2guaXMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE91dGVyUm91bmRuZXNzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLm9zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9pbnRzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFBvaW50c1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdJbm5lciBSYWRpdXMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0SW5uZXJSYWRpdXNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnT3V0ZXIgUmFkaXVzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE91dGVyUmFkaXVzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0lubmVyIFJvdW5kbmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRJbm5lclJvdW5kbmVzc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPdXRlciBSb3VuZG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T3V0ZXJSb3VuZG5lc3NcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVBvbHlzdGFyOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVJlY3RhbmdsZShlbGVtZW50KSB7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFNpemUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UG9zaXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuc2gucCkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Um91bmRuZXNzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LnNoLnIpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTaXplJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFNpemVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UG9zaXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUm91bmRuZXNzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFJvdW5kbmVzc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUmVjdGFuZ2xlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XHJcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XHJcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuLi90cmFuc2Zvcm0vVHJhbnNmb3JtJyk7XHJcblxyXG5mdW5jdGlvbiBTaGFwZVJlcGVhdGVyKGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Q29waWVzKHZhbHVlKSB7XHJcblx0XHRjb25zb2xlLmxvZygnc2V0Q29waWVzJylcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuYykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T2Zmc2V0KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9mZnNldCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnQ29waWVzJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldENvcGllc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPZmZzZXQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0T2Zmc2V0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ1RyYW5zZm9ybScsXHJcblx0XHRcdFx0dmFsdWU6IFRyYW5zZm9ybShlbGVtZW50LnRyKVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVSZXBlYXRlcjsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVSb3VuZENvcm5lcnMoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSYWRpdXModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQucmQpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSYWRpdXMnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0UmFkaXVzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVSb3VuZENvcm5lcnM7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxuXHJcbmZ1bmN0aW9uIFNoYXBlU3Ryb2tlKGVsZW1lbnQpIHtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRDb2xvcih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5jKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZVdpZHRoKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50LncpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdjb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdzdHJva2Ugd2lkdGgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlV2lkdGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnb3BhY2l0eScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPcGFjaXR5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0fVxyXG5cclxuXHR2YXIgbWV0aG9kcyA9IHtcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcGVTdHJva2UiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gU2hhcGVUcmltUGF0aHMoZWxlbWVudCkge1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdGFydCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoZWxlbWVudC5zKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRFbmQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGVsZW1lbnQuZSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T2Zmc2V0KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShlbGVtZW50Lm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTdGFydCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdGFydFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdFbmQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RW5kXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ09mZnNldCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRPZmZzZXRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVRyaW1QYXRoczsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcblxyXG5mdW5jdGlvbiBTb2xpZChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgTGF5ZXJCYXNlKHN0YXRlKSwgbWV0aG9kcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29saWQ7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcclxudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcclxudmFyIFRleHRBbmltYXRvciA9IHJlcXVpcmUoJy4vVGV4dEFuaW1hdG9yJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0KGVsZW1lbnQpIHtcclxuXHJcblx0dmFyIGluc3RhbmNlID0ge31cclxuXHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RG9jdW1lbnREYXRhKF9mdW5jdGlvbikge1xyXG5cdFx0dmFyIHByZXZpb3VzVmFsdWU7XHJcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIG5ld1ZhbHVlID0gX2Z1bmN0aW9uKGVsZW1lbnQudGV4dFByb3BlcnR5LmN1cnJlbnREYXRhKTtcclxuXHRcdFx0aWYgKHByZXZpb3VzVmFsdWUgIT09IG5ld1ZhbHVlKSB7XHJcblx0XHRcdFx0ZWxlbWVudC51cGRhdGVEb2N1bWVudERhdGEobmV3VmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdH0sIDUwMClcclxuXHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRBbmltYXRvcnMoKSB7XHJcblx0XHR2YXIgYW5pbWF0b3JQcm9wZXJ0aWVzID0gW107XHJcblx0XHR2YXIgYW5pbWF0b3JzID0gZWxlbWVudC50ZXh0QW5pbWF0b3IuX2FuaW1hdG9yc0RhdGE7XHJcblx0XHR2YXIgaSwgbGVuID0gYW5pbWF0b3JzLmxlbmd0aDtcclxuXHRcdHZhciB0ZXh0QW5pbWF0b3I7XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcclxuXHRcdFx0dGV4dEFuaW1hdG9yID0gVGV4dEFuaW1hdG9yKGFuaW1hdG9yc1tpXSlcclxuXHRcdFx0YW5pbWF0b3JQcm9wZXJ0aWVzLnB1c2goe1xyXG5cdFx0XHRcdG5hbWU6IGVsZW1lbnQudGV4dEFuaW1hdG9yLl90ZXh0RGF0YS5hW2ldLm5tIHx8ICdBbmltYXRvciAnICsgKGkrMSksIC8vRmFsbGJhY2sgZm9yIG9sZCBhbmltYXRpb25zXHJcblx0XHRcdFx0dmFsdWU6IHRleHRBbmltYXRvclxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFuaW1hdG9yUHJvcGVydGllcztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NvdXJjZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXREb2N1bWVudERhdGFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF0uY29uY2F0KGFkZEFuaW1hdG9ycygpKVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgbWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gVGV4dEFuaW1hdG9yKGFuaW1hdG9yKSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9XHJcblxyXG5cdHZhciBzdGF0ZSA9IHtcclxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEFuY2hvclBvaW50KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxCcmlnaHRuZXNzKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZiKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRGaWxsQ29sb3IodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZmMpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxIdWUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZmgpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEZpbGxTYXR1cmF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZzKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRGaWxsT3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5mbykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0T3BhY2l0eSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5vKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5yKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvblgodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucngpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFJvdGF0aW9uWSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5yeSkuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2NhbGUodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2tld0F4aXModmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc2EpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFN0cm9rZUNvbG9yKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNjKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTa2V3KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNrKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VPcGFjaXR5KHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNvKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VXaWR0aCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zdykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlQnJpZ2h0bmVzcyh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zYikuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U3Ryb2tlSHVlKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNoKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTdHJva2VTYXR1cmF0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNzKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRUcmFja2luZ0Ftb3VudCh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS50KS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidBbmNob3IgUG9pbnQnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0QW5jaG9yUG9pbnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIEJyaWdodG5lc3MnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbEJyaWdodG5lc3NcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIENvbG9yJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J0ZpbGwgSHVlJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxIdWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIFNhdHVyYXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbFNhdHVyYXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidGaWxsIE9wYWNpdHknLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1JvdGF0aW9uIFgnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Um90YXRpb25YXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonUm90YXRpb24gWScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSb3RhdGlvbllcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTY2FsZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTY2FsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NrZXcgQXhpcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTa2V3QXhpc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBDb2xvcicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VDb2xvclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1NrZXcnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2tld1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBXaWR0aCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VXaWR0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1RyYWNraW5nIEFtb3VudCcsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRUcmFja2luZ0Ftb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZU9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOidTdHJva2UgQnJpZ2h0bmVzcycsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VCcmlnaHRuZXNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTonU3Ryb2tlIFNhdHVyYXRpb24nLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlU2F0dXJhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBIdWUnLFxyXG5cdFx0XHRcdHZhbHVlOiB7XHJcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlSHVlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRBbmltYXRvcjsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XHJcbnZhciBUZXh0ID0gcmVxdWlyZSgnLi9UZXh0Jyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0RWxlbWVudChlbGVtZW50KSB7XHJcblxyXG5cdHZhciBpbnN0YW5jZSA9IHt9O1xyXG5cclxuXHR2YXIgVGV4dFByb3BlcnR5ID0gVGV4dChlbGVtZW50KTtcclxuXHR2YXIgc3RhdGUgPSB7XHJcblx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XHJcblx0XHRyZXR1cm4gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ3RleHQnLFxyXG5cdFx0XHRcdHZhbHVlOiBUZXh0UHJvcGVydHlcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdUZXh0JyxcclxuXHRcdFx0XHR2YWx1ZTogVGV4dFByb3BlcnR5XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRleHQoKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC50ZXh0UHJvcGVydHkuY3VycmVudERhdGEudDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFRleHQodmFsdWUsIGluZGV4KSB7XHJcblx0XHRzZXREb2N1bWVudERhdGEoe3Q6IHZhbHVlfSwgaW5kZXgpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0RG9jdW1lbnREYXRhKGRhdGEsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC51cGRhdGVEb2N1bWVudERhdGEoZGF0YSwgaW5kZXgpO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBjYW5SZXNpemVGb250KF9jYW5SZXNpemUpIHtcclxuXHRcdHJldHVybiBlbGVtZW50LmNhblJlc2l6ZUZvbnQoX2NhblJlc2l6ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5zZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKTtcclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdFx0Z2V0VGV4dDogZ2V0VGV4dCxcclxuXHRcdHNldFRleHQ6IHNldFRleHQsXHJcblx0XHRjYW5SZXNpemVGb250OiBjYW5SZXNpemVGb250LFxyXG5cdFx0c2V0RG9jdW1lbnREYXRhOiBzZXREb2N1bWVudERhdGEsXHJcblx0XHRzZXRNaW5pbXVtRm9udFNpemU6IHNldE1pbmltdW1Gb250U2l6ZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0RWxlbWVudDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xyXG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xyXG5cclxuZnVuY3Rpb24gVHJhbnNmb3JtKHByb3BzKSB7XHJcblx0dmFyIHN0YXRlID0ge1xyXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0QW5jaG9yUG9pbnQodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KHByb3BzLmEpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XHJcblx0XHRQcm9wZXJ0eShwcm9wcy5wKS5zZXRWYWx1ZSh2YWx1ZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTY2FsZSh2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucykuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0Um90YXRpb24odmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KHByb3BzLnIpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFhSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucngpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFlSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucnkpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFpSb3RhdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucnopLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFhQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucHgpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFlQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucHkpLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFpQb3NpdGlvbih2YWx1ZSkge1xyXG5cdFx0UHJvcGVydHkocHJvcHMucHopLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcclxuXHRcdFByb3BlcnR5KHByb3BzLm8pLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdTY2FsZScsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTY2FsZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdSb3RhdGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHtcclxuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdYIFBvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFhQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdZIFBvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFlQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdaIFBvc2l0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFpQb3NpdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdYIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFhSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdZIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFlSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdaIFJvdGF0aW9uJyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFpSb3RhdGlvblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5JyxcclxuXHRcdFx0XHR2YWx1ZToge1xyXG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9XHJcblxyXG5cdHZhciBtZXRob2RzID0ge1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2Zvcm07IiwiZnVuY3Rpb24gUHJvcGVydHkocHJvcGVydHkpIHtcclxuXHRcclxuXHRmdW5jdGlvbiBzZXRWYWx1ZSh2YWx1ZSkge1xyXG5cdFx0aWYoIXByb3BlcnR5IHx8ICFwcm9wZXJ0eS5hZGRFZmZlY3QpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRwcm9wZXJ0eS5hZGRFZmZlY3QodmFsdWUpO1xyXG5cdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS5wcm9wVHlwZSA9PT0gJ211bHRpZGltZW5zaW9uYWwnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUubGVuZ3RoID09PSAyKSB7XHJcblx0XHRcdHByb3BlcnR5LmFkZEVmZmVjdChmdW5jdGlvbigpe3JldHVybiB2YWx1ZX0pO1xyXG5cdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS5wcm9wVHlwZSA9PT0gJ3VuaWRpbWVuc2lvbmFsJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XHJcblx0XHRcdHByb3BlcnR5LmFkZEVmZmVjdChmdW5jdGlvbigpe3JldHVybiB2YWx1ZX0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIG1ldGhvZHMgPSB7XHJcblx0XHRzZXRWYWx1ZTogc2V0VmFsdWVcclxuXHR9XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBtZXRob2RzKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcm9wZXJ0eTsiLCJ2YXIgTGF5ZXJMaXN0ID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJMaXN0Jyk7XHJcbnZhciBLZXlQYXRoTGlzdCA9IHJlcXVpcmUoJy4uL2tleV9wYXRoL0tleVBhdGhMaXN0Jyk7XHJcblxyXG5mdW5jdGlvbiBSZW5kZXJlcihzdGF0ZSkge1xyXG5cclxuXHRzdGF0ZS5fdHlwZSA9ICdyZW5kZXJlcic7XHJcblxyXG5cdGZ1bmN0aW9uIGdldFJlbmRlcmVyVHlwZSgpIHtcclxuXHRcdHJldHVybiBzdGF0ZS5hbmltYXRpb24uYW5pbVR5cGU7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7XHJcblx0XHRnZXRSZW5kZXJlclR5cGU6IGdldFJlbmRlcmVyVHlwZVxyXG5cdH0sIExheWVyTGlzdChzdGF0ZS5lbGVtZW50cyksIEtleVBhdGhMaXN0KHN0YXRlLmVsZW1lbnRzLCAncmVuZGVyZXInKSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyZXI7Il19
