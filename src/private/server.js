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

  var dataTypePromises = [];

   for(var i = 0; i < datatypes.length; i++){
   		dataTypePromises.push(
	   		new Promise(function(resolve, reject){ 
	   			datatypes[i].save(function(err) {
			    if (err) throw err;

			    console.log('Data type saved successfully');
			     resolve();//res.json({ success: true });
			  });
	   		})
   		);
   }

  // create a sample user
  var kiran = new User({ 
    firstname: 'kiran', 
	lastname: 'deore', 
	username: 'kirandeore',
    password: 'password',
    phone: '4053388406',
    email: 'kirandeore@gmail.com',
    photo: 'C:\\_node\\underdogs\\code\\build\\private\\logic\\..\\..\\public\\cdn\\protected\\RcBZIYBjS2L2PLfMdq5fNZsn.jpeg', 
    role: 'ADMIN',
    secret: 'heyya'
  });

  var userPromise = new Promise(function(resolve, reject){
  	  // save the sample user
	  kiran.save(function(err) {
		    if (err) {
		    	console.log(err);
		    	return reject(err);
		    }

	    	console.log('User saved successfully');
	    	resolve(kiran);
	  });
  });

 //  Promise.all(dataTypePromises)
 //  .then(function(){
 //  	return userPromise;
 //  })
 //  .then(function(user){
 //  	return Promise.resolve(true);
	// // var dog = new Animal({ 
	// //     kind: datatypes[0], 
	// // 	name: 'rambo', 
	// // 	user: user
	// //   });

	// // return new Promise(function(resolve, reject){
	// // 	dog.save(function(err) {
	// // 	    if (err) {
	// // 	    	console.log(err);
	// // 	    	return reject(err);
	// // 	    }

	// // 	    console.log('Animal saved successfully!!');
	// // 	    resolve(true);	//res.json({ success: true });
	// // 	  });
	// // });
 //  })
 //  .then(function(){
 //  		res.json({ success: true });
 //  });
});

app.listen(3000);
console.log("server started on port 3000");


/**
bearer authentication

https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

**/