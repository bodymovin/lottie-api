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
	var _destroyFunction;
	var enterFrameCallback = null;
	var enterFrameEvent = {
		time: -1
	}

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
		if(instance.onEnterFrame && enterFrameEvent.time !== currentTime) {
			enterFrameEvent.time = currentTime;
			instance.onEnterFrame(enterFrameEvent);
		}
		return currentTime;
	}

	function addCallback() {
		if(!_isCallbackAdded) {
			_isCallbackAdded = true;
			_destroyFunction = instance.setValue(_segmentPlayer, _isDebugging)
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

	function destroy() {
		if(_destroyFunction) {
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
	}

	var instance = {}

	return Object.assign(instance, methods, ValueProperty(state), KeyPathNode(state));
}

module.exports = TimeRemap;