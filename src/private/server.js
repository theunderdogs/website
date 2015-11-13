var express = require('express')
    ,app = express()
    ,mongoose = require('mongoose')
	,passport = require('passport')
	,passHttp = require('passport-http').BasicStrategy
	,fs = require('fs')
	,bodyParser = require("body-parser")
	,expressSession = require("express-session")
	,Promise = require('promise/lib/es6-extensions')
	,qt = require('quickthumb');


//set model directory
fs.readdirSync(__dirname + '/models').forEach(function(filename){
	//console.log(__dirname + '/private/models/' + filename);
	require(__dirname + '/models/' + filename);
});   

mongoose.connect('mongodb://localhost:27017/underdogsdb');

//html directory
app.use(express.static(__dirname + "/../public"));

//set view engnes for res.render(html path)
// app.engine('html', require('ejs').renderFile);
// app.set('views', __dirname + '/../public/app');
// app.set('view engine', 'html');

//app.set('view engine', 'jade');

//parse JSON data in post request 
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use(expressSession({ secret: 'secret' /*machine ey*/,
//		resave: false,
//		saveUninitialized: false 
//}));

//passport config here
require("./logic/passportConfig.js")(passport, app);

var loginRouter = express.Router();
require("./routes/loginRouter.js")(loginRouter, passport);
app.use('/', loginRouter);

var secureRouter = express.Router();
require("./routes/secureRouter.js")(secureRouter, passport);
app.use('/secure', secureRouter);

//passport.authenticate('basic')


app.get('/setup', function(req, res) {
  var User = mongoose.model('User'),
      Animal = mongoose.model('Animal'),
      DataType = mongoose.model('DataType');
  
  var datatypes = [ new DataType({ 
				    type: 'animalKind', 
				    order : 2,
					optionValue: 'Dog',
					code : 'DOG'
				  }),
				  new DataType({ 
				    type: 'animalKind', 
				    order : 1,
					optionValue: 'Cat',
					code: 'CAT'
				  }),
				  new DataType({ 
				    type: 'animalKind', 
				    order : 3,
					optionValue: 'Other',
					code : 'OTHER'
				  }),

				  new DataType({ 
				    type: 'userRole', 
				    order : 1,
				    optionValue: 'Anonymous',
					code: 'ANON'
				  }),
				  new DataType({ 
				    type: 'userRole', 
				    order : 2,
					optionValue: 'Administrator',
					code: 'ADMIN'
				  }),

				  new DataType({ 
				    type: 'gender', 
				    order : 1,
					optionValue: 'Male',
					code: 'MALE'
				  }),
				  new DataType({ 
				    type: 'gender', 
				    order : 2,
					optionValue: 'Female',
					code: 'FEMALE'
				  }),
				  new DataType({ 
				    type: 'gender', 
				    order : 3,
					optionValue: 'Unknown',
					code: 'UNKNOWN'
				  }),


				  new DataType({ 
				    type: 'applicationStatus', 
				    order : 1,
					optionValue: 'New applications',
					code: 'NEWAPPLICATION'
				  }),
				  new DataType({ 
				    type: 'applicationStatus', 
				    order : 1,
					optionValue: 'Accepted for trial',
					code: 'TRIAL'
				  }),
				  new DataType({ 
				    type: 'applicationStatus', 
				    order : 2,
					optionValue: 'Adopted',
					code: 'ADOPTED'
				  }),
				  new DataType({ 
				    type: 'applicationStatus', 
				    order : 3,
					optionValue: 'Rejected',
					code: 'REJECTED'
				  })				
	];

	// create a sample user
  var dataTypePromises = [];

  for(var i = 0; i < datatypes.length; i++){
  	dataTypePromises.push(datatypes[i].save());
  }

  Promise.all(dataTypePromises)
  .then(function(resultArray){
  		var role;

  		for(var i = 0; i < resultArray.length; i++){
  			if(resultArray[i].code === 'ADMIN'){
  				role = resultArray[i];
  				break;
  			}
  		}

  		return new User({ 
		    firstname: 'kiran', 
			lastname: 'deore', 
			username: 'kirandeore',
		    password: 'password',
		    phone: '4053388406',
		    email: 'kirandeore@gmail.com',
		    photo: 'cdn\\protected\\thumbnails\\RcBZIYBjS2L2PLfMdq5fNZsn.jpeg', 
		    role: role,
		    secret: 'heyya'
		  }).save();
   })
  .then(function(user){
  	console.log('user added', user);
  })
  .catch(function(err){
  		console.log('Error:', err);
  });

});

app.listen(3000);
console.log("server started on port 3000");


/**
bearer authentication

https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

**/