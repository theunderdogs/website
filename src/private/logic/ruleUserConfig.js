var rules = require('./rules.js');

module.exports = {
	ADMIN : {
			allowed : [
				rules.saveNewPet,
			],
			notAllowed : []
	},
	POWERUSER : {
			allowed : [
				rules.saveNewPet,
			],
			notAllowed : []
	},
	ANON : {
			allowed : [],
			notAllowed : []
	}
}