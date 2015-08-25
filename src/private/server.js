var express = require('express')
    ,app = express()
    ,mongoose = require('mongoose')
	,passport = require('passport')
	,passHttp = require('passport-http').BasicStrategy
	,fs = require('fs')
	,bodyParser = require("body-parser")
	,expressSession = require("express-session"),
	bearerStrategy = require('passport-http-bearer').Strategy,
	jwt = require('jsonwebtoken');

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

//parse JSON data in post request 
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use(expressSession({ secret: 'secret' /*machine ey*/,
//		resave: false,
//		saveUninitialized: false 
//}));

app.use(passport.initialize());
//app.use(passport.session());


passport.serializeUser(function(user, done){
	done(user.id);
});

passport.deserializeUser(function(id, done){
	//query db here
	done({ id: id, username : id });
});

//http://localhost:44085/secure/getUsers?access_token=sdasd&token=eyJhbGciOiJIUzI1NiJ9.a2lyYW5kZW9yZQ.gvhPG82UBaDgSpr5UoTUiX2Jrp1_SWI-fk3n2So5168
//token bearer strategy
passport.use(new bearerStrategy({passReqToCallback: true},
function(req, token, done) { 

	if(token != 'fool'){ //?access_token=
		done(new Error('you are a fool'));
	}
  // insert your MongoDB check here. For now, just a simple hardcoded check.
  console.log("im herer", token);
  //console.log("x-access-token", req.headers['x-access-token']);
  
  var user_token = req.headers['x-access-token'] || req.body.token || req.query.token;

  console.log("user_token ", user_token);

  if (user_token) {

    // verifies secret and checks exp
    jwt.verify(user_token, 'publicsecret', function(err, decoded) {      
      if (err) {
        return done(new Error("Failed to authenticate token.")); //res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        console.log("decoded", decoded);

        //{ username: user.username, user_token: user_token }
        
        mongoose.model('User').findOne({ username: decoded.username }, function(err, user){
		     if (!user) return done(new Error("user not found for token."));
		     console.log("found user: ", user);
		     
		     jwt.verify(decoded.user_token, user.secret, function(err, decoded_user_token) { 

		     	if (err) {
        			return done(new Error("Close enough."));
        		}

        		console.log('decoded_user_token', decoded_user_token);

        		if(decoded_user_token == user.username){
        			console.log("success");
        			return done(null, user.username, { scope: 'all' });
        		}else{
        			return done(new Error("very close."));
        		}
		     });
		  }); 
      }
    });

  } else {

  	//res.status(403);
    // if there is no token
    // return an error
    //return res.status(403).send({ 
     //   success: false, 
        //message: 'No token provided.' 
    //});
    return done(new Error("No token provided."));
  }

})); /*passport end*/


var publicRouter = express.Router();

publicRouter.get('/', function(req, res){
	res.redirect("/");
});

//redirect to Login page
publicRouter.get('/login', function(req, res){
	console.info('login get');
	// res.statusCode = 200; 
 //    res.setHeader("Location", "/app/views/admin/login.html");
 //    res.end();
 	res.redirect("/app/views/admin/login.html");
});

publicRouter.get('/logout', function(req, res){
	console.info('loggng out..');
	res.logout(); 
	res.redirect("/app/views/admin/login.html");
});

//recevies credentials 
publicRouter.post('/login', function(req, res){
	console.log("login....");
	 var User = mongoose.model('User');

	 User.findOne({
	    username: req.body.username
	  }, function(err, user) {

	    if (err) throw err;

	    if (!user) {
	      res.json({ success: false, message: 'Authentication failed. User not found.' });
	    } else if (user) {

	      // check if password matches
	      if (user.password != req.body.password) {
	        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	      } else {

	        // if user is found and password is right

            var user_token = jwt.sign(user.username, 
	        	user.secret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // create a token
	        var token = jwt.sign({ username: user.username, 
	        	user_token: user_token }, 'publicsecret' , {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
});

app.use('/', publicRouter);

var secureRouter = express.Router();
require("./routes/secure.js")(secureRouter, passport);
app.use('/secure', secureRouter);

//passport.authenticate('basic')


app.get('/setup', function(req, res) {
  var User = mongoose.model('User');
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

  // save the sample user
  kiran.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

app.listen(3000);
console.log("server started on port 3000");


/**
bearer authentication

https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

**/