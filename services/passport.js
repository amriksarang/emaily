const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// use user.id as the user identifying piece of information that is sent to browser . This user id is saved in a cookie
passport.serializeUser( (user, done) => {
	done(null, user.id);  // this id is not the google profile id. It is the id of the user record in mongodb and is created by mongodb
})

// the user identifying piece of information (user.id) that is sent from browser is used to retrieve the user from database. In other words the id is retrieved from the cookie . The user is pulled from DB and is added to the request as req.user
passport.deserializeUser( (id, done) => {
	User.findById(id)
		.then( user => {
			done(null, user);
		})
})

passport.use(
	new GoogleStrategy(
	  {
		clientID: keys.googleClientID,
		clientSecret: keys.googleClientSecret,
		callbackURL: '/auth/google/callback',
		proxy: true
	  }, 
	  async (accessToken, refreshToken, profile, done) => { // this callback is called when user profile has been received
		const existingUser = await User.findOne({googleId: profile.id});
		
		if(existingUser){
			return done(null, existingUser);
		}
		
		const user = await new User({ googleId : profile.id}).save();
		done(null, user);
		
	  }	
	)
);
