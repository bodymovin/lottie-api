var TextElement = require('../layer/text/Text');
var ShapeElement = require('../layer/shape/Shape');
var NullElement = require('../layer/null_element/NullElement');
var SolidElement = require('../layer/solid/SolidElement');
var ImageElement = require('../layer/image/ImageElement');
var LayerBase = require('../layer/LayerBase');
var Composition = require('../layer/composition/Composition');

module.exports = function getLayerApi(element) {
	var layerType = element.data.ty;
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
		return ShapeElement(element);
		case 5:
		return TextElement(element);
		default:
		return LayerBase(element);
	}
}