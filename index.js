const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
require('./services/passport');
// No need to require RecipientSchema since its already required in Survey Schema

mongoose.connect(keys.mongoURI);

const app = express();

//express middleware is wired up to express by app.use call. In this particular case the incomming requests body will be parsed and assigned to the req object
app.use(bodyParser.json());

// cookieSession, passport.initialize(), passport.session() are all instances of the middleware that we wired up to our application
//And the purpose of middleware was to add a little bit of code that could intercept an incoming request and modify it or change it in some fashion.
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey] // multiple keys can be provided, cookieSession will randomly pick one key
	})
);

app.use(passport.initialize());
app.use(passport.session());

// both of these files export functions to which 'app' variable is passed and the functions are immediately executed 
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if(process.env.NODE_ENV === 'production'){
	//Express will serve up production assets
	//like main.js or main.css fileCreatedDate
	app.use(express.static('client/build'));
	
	//Express will serve index.html if it does not recognize the route
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000 ;

app.listen(PORT);
