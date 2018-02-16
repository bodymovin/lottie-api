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