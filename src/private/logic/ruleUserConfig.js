var rules = require('./rules.js');

module.exports = {
	ADMIN : {
			allowed : [
				rules.saveNewPet,
				rules.canAddUser
			],
			notAllowed : []
	},
	POWERUSER : {
			allowed : [
				rules.saveNewPet
			],
			notAllowed : []
	},
	ANON : {
			allowed : [],
			notAllowed : []
	}
}