var Property = require('../../property/Property');

function EffectElement(effect, parent) {

	return Property(effect.p, parent);
}

module.exports = EffectElement;