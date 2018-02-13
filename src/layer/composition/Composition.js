var LayerList = require('../LayerList');
var LayerBase = require('../LayerBase');

function Composition(state) {
	return Object.assign({}
		, LayerList(state.elements)
		, LayerBase(state));
}

module.exports = Composition;