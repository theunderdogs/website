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

//passport config here
require("./logic/passportConfig.js")(passport, app);

var loginRouter = express.Router();
require("./routes/loginRouter.js")(loginRouter, passport);
app.use('/', loginRouter);

var secureRouter = express.Router();
require("./routes/secureRouter.js")(secureRouter, passport);
app.use('/secure', secureRouter);

//passport.authenticate('basic')


// app.get('/setup', function(req, res) {
//   var User = mongoose.model('User'),
//       Animal = mongoose.model('Animal'),
//       DataType = mongoose.model('DataType'),
//       EventLocation = mongoose.model('EventLocation'),
//       News = mongoose.model('News'),
//       AboutUs = mongoose.model('AboutUs');
  
//   var datatypes = [ new DataType({ 
// 				    type: 'animalKind', 
// 				    order : 2,
// 					optionValue: 'Dog',
// 					code : 'DOG'
// 				  }),
// 				  new DataType({ 
// 				    type: 'animalKind', 
// 				    order : 1,
// 					optionValue: 'Cat',
// 					code: 'CAT'
// 				  }),
// 				  new DataType({ 
// 				    type: 'animalKind', 
// 				    order : 3,
// 					optionValue: 'Other',
// 					code : 'OTHER'
// 				  }),

// 				  new DataType({ 
// 				    type: 'userRole', 
// 				    order : 1,
// 				    optionValue: 'Anonymous',
// 					code: 'ANON'
// 				  }),
// 				  new DataType({ 
// 				    type: 'userRole', 
// 				    order : 2,
// 				    optionValue: 'Power User',
// 					code: 'POWERUSER'
// 				  }),
// 				  new DataType({ 
// 				    type: 'userRole', 
// 				    order : 3,
// 					optionValue: 'Administrator',
// 					code: 'ADMIN'
// 				  }),

// 				  new DataType({ 
// 				    type: 'gender', 
// 				    order : 1,
// 					optionValue: 'Male',
// 					code: 'MALE'
// 				  }),
// 				  new DataType({ 
// 				    type: 'gender', 
// 				    order : 2,
// 					optionValue: 'Female',
// 					code: 'FEMALE'
// 				  }),
// 				  new DataType({ 
// 				    type: 'gender', 
// 				    order : 3,
// 					optionValue: 'Unknown',
// 					code: 'UNKNOWN'
// 				  }),


// 				  new DataType({ 
// 				    type: 'applicationStatus', 
// 				    order : 1,
// 					optionValue: 'New applications',
// 					code: 'NEWAPPLICATION'
// 				  }),
// 				  new DataType({ 
// 				    type: 'applicationStatus', 
// 				    order : 1,
// 					optionValue: 'Accepted for trial',
// 					code: 'TRIAL'
// 				  }),
// 				  new DataType({ 
// 				    type: 'applicationStatus', 
// 				    order : 2,
// 					optionValue: 'Adopted',
// 					code: 'ADOPTED'
// 				  }),
// 				  new DataType({ 
// 				    type: 'applicationStatus', 
// 				    order : 3,
// 					optionValue: 'Rejected',
// 					code: 'REJECTED'
// 				  })				
// 	];

// 	// create a sample user
//   var dataTypePromises = [];

//   for(var i = 0; i < datatypes.length; i++){
//   	dataTypePromises.push(datatypes[i].save());
//   }

//   Promise.all(dataTypePromises)
//   .then(function(resultArray){
//   		var role;

//   		for(var i = 0; i < resultArray.length; i++){
//   			if(resultArray[i].code === 'ADMIN'){
//   				role = resultArray[i];
//   				break;
//   			}
//   		}

//   		return new User({ 
// 		    firstname: 'kiran', 
// 			lastname: 'deore', 
// 			username: 'kirandeore',
// 		    password: 'password',
// 		    phone: '4053388406',
// 		    email: 'kirandeore@gmail.com',
// 		    photo: 'cdn\\protected\\thumbnails\\1.jpeg', 
// 		    role: role,
// 		    isDisabled: false,
// 		    secret: 'heyya'
// 		  }).save();
//    })
//   .then(function(user){
//   	console.log('user added', user);
//   	return new EventLocation({ 
// 		    location: '26 w colcord ave edmond ok 73003', 
// 		  }).save();
//   })
//   .then(function(){
//   	return new AboutUs({
//   		html : '<div class="row margin-bottom-30"><div class="col-md-6"><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p><ul><li>Nam liber tempor cum soluta</li><li>Mirum est notare quam</li><li>Lorem ipsum dolor sit amet</li><li>Mirum est notare quam</li></ul><blockquote><p>&quot;We are an animal action rescue group. We don&#39;t send letters to the editor, we act.&quot;</p><small>Meike Parker</small></blockquote></div><div class="col-md-6"><!-- <iframe src="http://player.vimeo.com/video/22439234" style="width:100%; height:327px;border:0" allowfullscreen></iframe> --><iframe src="https://www.youtube.com/embed/ZLft6rM8VE0" style="width:100%; height:327px;border:0" allowfullscreen></iframe></div></div><!--/row--><!-- Meer Our Team --><div class="headline"><h3>Meet Our Team</h3></div><div class="row thumbnails"><div class="col-md-3"><div class="meet-our-team"><h3>Meike Parker <small>President / CEO</small></h3><img alt="" class="img-responsive" src="https://scontent-dfw1-1.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/11013617_10153274544274266_4950043848269115551_n.jpg?oh=bde9939bcb3eedf48401f844dfd800f1&amp;oe=56D21B23" /><div class="team-info"><p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, justo sit amet risus etiam porta sem...</p><ul><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li></ul></div></div></div><div class="col-md-3"><div class="meet-our-team"><h3>Paige Nation <small>Vice president</small></h3><img alt="" class="img-responsive" src="https://scontent-dfw1-1.xx.fbcdn.net/hphotos-xfl1/v/t1.0-9/12191064_1084271894925695_5804215968042050761_n.jpg?oh=580f75a92f4dcceabfab0a8b43af06ab&amp;oe=56C88518" /><div class="team-info"><p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, justo sit amet risus etiam porta sem...</p><ul><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li></ul></div></div></div><div class="col-md-3"><div class="meet-our-team"><h3>Kiran Deore <small>Volunteer</small></h3><img alt="" class="img-responsive" src="https://scontent-dfw1-1.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/11232229_10155554850055057_5181937796337872161_n.jpg?oh=eb0c0172323ce69a764afd53e196aa69&amp;oe=56B0CB1E" /><div class="team-info"><p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, justo sit amet risus etiam porta sem...</p><ul><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li><li>&nbsp;</li></ul></div></div></div><div class="col-md-3">&nbsp;</div></div><!--/thumbnails--><!-- //End Meer Our Team --><!-- END PAGE CONTENT-->'
//   	}).save();
//   })
//   .then(function(){
//   	return new News({
//   			html : 'here will be some recent news..</h3><blockquote><p>&quot;We are an animal action rescue group. We don&#39;t send letters to the editor, we act.&quot;</p><small>Meike Parker</small></blockquote>'
//   		}).save();
//   })
//   .then(function(){
//   		res.redirect("/app/views/admin/login.html");
//   })
//   .catch(function(err){
//   		console.log('Error:', err);
//   });

// });

app.listen(3000);
console.log("server started on port 3000");


/**
bearer authentication

https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

**/