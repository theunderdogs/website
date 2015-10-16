var express = require('express')
    ,app = express()
    ,mongoose = require('mongoose')
	,passport = require('passport')
	,passHttp = require('passport-http').BasicStrategy
	,fs = require('fs')
	,bodyParser = require("body-parser")
	,expressSession = require("express-session")
	,Promise = require('promise/lib/es6-extensions');

//set model directory
fs.readdirSync(__dirname + '/models').forEach(function(filename){
	//console.log(__dirname + '/private/models/' + filename);
	require(__dirname + '/models/' + filename);
});   

mongoose.connect('mongodb://localhost:27017/underdogsdb');

//html directory
app.use(express.static(__dirname + "/../public/"));

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
      Animal = mongoose.model('Animal');
  // create a sample user
  var kiran = new User({ 
    firstname: 'kiran', 
	lastname: 'deore', 
	username: 'kirandeore',
    password: 'password',
    phone: '4053388406',
    email: 'kirandeore@gmail.com',
    photo: '/cdn/image.jpg', 
    role: 'ADMIN',
    secret: 'heyya'
  });


  var userPromise = new Promise(function(resolve, reject){
  	  // save the sample user
	  kiran.save(function(err) {
		    if (err) {
		    	return reject(err);
		    	//throw err;
		    }

	    	console.log('User saved successfully');
	    	return resolve(kiran);
	  });
  });

  userPromise.then(function(user){
	var dog = new Animal({ 
	    kind: 'dog', 
		name: 'rambo', 
		user: user
	  });

	dog.save(function(err) {
	    if (err) throw err;

	    console.log('Animal saved successfully');
	    res.json({ success: true });
	  });

  });

});

app.listen(3000);
console.log("server started on port 3000");


/**
bearer authentication

https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

**/