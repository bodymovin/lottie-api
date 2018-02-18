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