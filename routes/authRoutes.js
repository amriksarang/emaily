const passport = require('passport');

module.exports = (app) => {
	app.get(
		'/auth/google',
		passport.authenticate('google', {
			scope: ['profile', 'email']
		})
	)
//We are kind of passing control of the user to the passport authenticate function right here.	
// second time when passport.authenticate is called it will see the 'code' parameter and will know that this request needs to be handled differently and will use 'code' to get actual user profile
	app.get('/auth/google/callback', 
			passport.authenticate('google') , 
			(req, res) => {
				res.redirect('/surveys');
			}
	); 
	
	app.get('/api/logout', (req, res) => {
			req.logout();
			res.redirect('/');
	})
	
	app.get('/api/current_user', (req, res) => {
		console.log(req.user);
		res.send(req.user);
	})
}
