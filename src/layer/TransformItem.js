function TransformItem(state) {

	function setTranslate(x, y) {
		state.element.finalTransform.mProp.p.v[0] = 0;
		state.element.finalTransform.mProp.p.v[1] = 0;
		state.element.finalTransform.mProp.getValue(true);
		state.element.finalTransform.mProp._mdf = true;
		state.element.renderTransform();
		state.element.renderFrame();
	}

	var methods = {
		setTranslate: setTranslate
	}

	return methods;
}

module.exports = TransformItem;