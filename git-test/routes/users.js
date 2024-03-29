var express = require('express');
var router = express.Router();

var passport = require('passport');
var authenticate = require('../authenticate');

const bodyParser = require('body-parser');
var User = require('../models/user');
const  cors = require('./cors');

router.use(bodyParser.json());
router.options('*',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
router.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	console.log("Getting users");
	User.find({})
    .then((users) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err) );
})

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
		User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
	  	if(err) {
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.json({err: err});
	  	}
	  	else {
			if (req.body.firstname)
        		user.firstname = req.body.firstname;
      		if (req.body.lastname)
        		user.lastname = req.body.lastname;
     		user.save((err, user) => {
				if (err) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.json({err: err});
					return ;
				}
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({success: true, status: 'Registration Successful!'});
        		});
      		});
	  	}
	});
});
  
router.post('/login', cors.corsWithOptions, /* passport.authenticate('local'), */ (req, res, next) => {

	/* Changed the display of authenticate.verifyUser */
	passport.authenticate('local', (err, user, info) => {
		if (err)          /* If there is error in login bu ouath or other */
			return next(err);

		if (!user) {       /* It the username of password is wrong */
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: false, status: 'Login Unsuccessful!', err: info});
		}

		req.logIn(user, (err) => {
		  	if (err) {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
			}
			var token = authenticate.getToken({_id: req.user._id});
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: true, token: token, status: 'You are successfully logged in!'});
		});
	}) (req,res,next);
});


/* facebook route to login or signup into account */

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
	if (req.user) {
	  var token = authenticate.getToken({_id: req.user._id});
	  res.statusCode = 200;
	  res.setHeader('Content-Type', 'application/json');
	  res.json({success: true, token: token, status: 'You are successfully logged in!'});
	}
});

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
	passport.authenticate('jwt', {session: false}, (err, user, info) => {
		if (err)
			return next(err);
	  
	  	if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			return res.json({status: 'JWT invalid!', success: false, err: info});
	  	}
		else {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			return res.json({status: 'JWT valid!', success: true, user: user});
		}
	}) (req, res);
  });

module.exports = router;
