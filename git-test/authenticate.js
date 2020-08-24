var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');


var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');
const { NotExtended } = require('http-errors');

exports.getToken = function(user /* payload */) {  /* Create a token */
    return jwt.sign(user /* payload */ , config.secretKey /* Secret key */,
        {expiresIn: 3600  /* (in sec) how long it will valid */ });
};


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
}));

exports.verifyAdmin= (req,res,next) => {
    console.log(req.user.admin);
    if(req.user.admin){
        next();
    }
    else{
        err = new Error(' You are not Authorized to perform this operation! ');
        err.status = 403;
        return next(err);
    }
}

exports.verifyUser = passport.authenticate('jwt', {session: false});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());