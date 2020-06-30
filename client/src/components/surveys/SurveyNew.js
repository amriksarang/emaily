import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component{
	/*
	constructor(props){
		super(props);
		
		this.state = { showFormReview : false };
	}*/
	// Because of create-react-app that has a babel plugin we can write above constructor code as below
	state = { showFormReview : false };
	
	renderContent(){
		if(this.state.showFormReview){
			return <SurveyFormReview 
						onCancel={ () => this.setState( { showFormReview : false }) }
					/>;
		}
		
		return <SurveyForm 
					onSurveySubmit={ () => this.setState({ showFormReview: true }) }
				/>;
	}
	
	render(){
		return (
			<div>
				{ this.renderContent() }
			</div>
		);
	}
}

export default reduxForm({
	form: 'surveyForm'
})(SurveyNew);