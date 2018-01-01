var LayerList = require('../layer/LayerList');

function Renderer(state) {

	function getRendererType() {
		return state.animation.animType;
	}

	return Object.assign({
		getRendererType: getRendererType
	}, LayerList(state.elements));
}

module.exports = Renderer;