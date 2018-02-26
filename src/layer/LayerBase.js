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