const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
	
	app.get('/api/surveys/thanks', (req, res) => {
		res.send('Thanks for voting!');		
	});
	
	app.post('/api/surveys/webhooks', (req, res) => {
		const p = new Path('/api/surveys/:surveyId/:choice');

		const events = _.map(req.body, ({ email, url }) => {
			const pathname = new URL(url).pathname;
			const match = p.test(pathname);
			console.log("************");
			console.log(match.surveyId);
			console.log(match.choice);
			if(match){
				return { email, surveyId: match.surveyId, choice: match.choice };
			}
		});
		
		const compactEvents = _.compact(events);
		const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
		
		console.log("-------------------");
		console.log(uniqueEvents);
		
		_.each(uniqueEvents, ({ surveyId, email, choice }) => {
			console.log("++++++++++++++++");
			console.log( surveyId, email, choice);
			
			Survey.updateOne( // even though this is an async operation we are not handling it as async since we don't need anything back from this query that needs to be sent to SendGrid.
				{
					_id: surveyId,
					recipients: {
						$elemMatch: {
							email: email, responded: false
						}
					}
				},
				{
					$inc : { [choice] : 1 },
					$set: { 'recipients.$.responded': true }
					
				}
			).exec();			
		});		
		
		/* Alternate way of using lodash chain 
			const events = _.chain(req.body)
							.map(({ email, url }) => {
								const pathname = new URL(url).pathname;
								const match = p.test(pathname);
								if(match){
									return { email, surveyId: match.surveyId, choice: match.choice };
								}
							})
							.compact()
							.uniqBy('email', 'surveyId')
							_.each(({ surveyId, email, choice }) => {
								Survey.updateOne(
									{
										_id: surveyId,
										recipients: {
											$elemMatch: {
												email: email, responded: false;
											}
										}
									},
									{
										$inc : { [choice] : 1 },
										$set: { 'recipients.$.responded': true }
										
									}
								).exec();			
							})
							.value();
			
		*/
		
		
		
		res.send({});
	});
	
	app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
		const { title, subject, body, recipients } = req.body;
		
		const survey = new Survey({
			title,
			subject,
			body,
			recipients: recipients.split(',').map( email => ({ email: email.trim(), responded: false }) ), // {email} is wrapped in () to avoid the confusion that the curly braces are not the start and end of function. Rather they signal the start and end of the json object 
			_user: req.user.id,
			dateSent: Date.now()
		});
		
		const mailer = new Mailer(survey, surveyTemplate(survey));
		
		try{			
			await mailer.send();
			await survey.save();
			req.user.credits -= 1;
			const user = await req.user.save();
			
			res.send(user);
		}catch(err){
			res.status(422).send(err);
		}
	});
};