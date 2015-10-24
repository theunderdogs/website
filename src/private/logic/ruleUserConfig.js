var rules = require('./rules.js');

module.exports = {
	ADMIN : [
		rules.saveNewPet//,
		//rules.canAddUser
	],
	ANON : []
}