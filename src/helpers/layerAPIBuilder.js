var TextElement = require('../layer/text/TextElement');
var ShapeElement = require('../layer/shape/Shape');
var NullElement = require('../layer/null_element/NullElement');
var SolidElement = require('../layer/solid/SolidElement');
var ImageElement = require('../layer/image/ImageElement');
var CameraElement = require('../layer/camera/Camera');
var LayerBase = require('../layer/LayerBase');


module.exports = function getLayerApi(element, parent) {
	var layerType = element.data.ty;
	var Composition = require('../layer/composition/Composition');
	switch(layerType) {
		case 0:
		return Composition(element, parent);
		case 1:
		return SolidElement(element, parent);
		case 2:
		return ImageElement(element, parent);
		case 3:
		return NullElement(element, parent);
		case 4:
		return ShapeElement(element, parent, element.data.shapes, element.itemsData);
		case 5:
		return TextElement(element, parent);
		case 13:
		return CameraElement(element, parent);
		default:
		return LayerBase(element, parent);
	}
}