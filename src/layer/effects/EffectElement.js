var Property = require('../../property/Property');

function EffectElement(effect) {

	function setValue(value) {
		Property(effect.p).setValue(value)
	}

	return {
		setValue: setValue
	}
}

module.exports = EffectElement;