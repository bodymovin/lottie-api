var LayerList = require('../LayerList');
var LayerItem = require('../LayerItem');

function Composition(state) {
	return Object.assign({}
		, LayerList(state.elements)
		, LayerItem(state));
}

module.exports = Composition;