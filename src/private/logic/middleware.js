var rules = require('./rules.js'),
	ruleUserConfig = require('./ruleUserConfig.js');

module.exports = {
	hasPermission : function (permission) {
	  return function(req, res, next) {

	  	if(!ruleUserConfig.hasOwnProperty(req.appData.user.role)){
	  		throw new Error('Role doesnt exists');
	  	}

	  	if(!permission){
	  		throw new Error('Permission doesnt exists');
	  	}

	  	var permissionsForRole = ruleUserConfig[req.appData.user.role];

	  	var isAuthenticated = false;
	  	for(var i = 0; i < permissionsForRole.length; i++){
	  		if(permissionsForRole[i] == permission){
	  			isAuthenticated = true;
	  			break;
	  		}
	  	}

	  	if (!isAuthenticated) 
    	{
    		//throw new Error('Permission doesnt exists');
    		res.statusCode = 401;
			res.json({ success  : false, message: 'You are not allowed' });
			res.end();	
    	}
	    else next();
	  };
	},
}