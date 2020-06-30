import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
// we make use of connect function to give certain components the ability to call action creators
import * as actions from '../actions';

//const Header = () => <h2>Header</h2>;
import Header from './Header';
import Landing from './Landing' ;
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';

//const Dashboard = () => <h2>Dashboard</h2>;
//const SurveyNew = () => <h2>SurveyNew</h2>;


class App extends Component {
	
	componentDidMount(){
		this.props.fetchUser();
	}
	
	render(){
		return (
				<BrowserRouter>
					<div className="container">
						<Header />
						<Route exact={true} path="/" component={Landing} />
						<Route exact path="/surveys" component={Dashboard} />
						<Route path="/surveys/new" component={SurveyNew} />
					</div>
				</BrowserRouter>
		);
	}
}

export default connect(null, actions)(App);
// make use of connect function and actions creators and App and wire them all up
// Remember that once we pass in all of these different actions they are assigned to the App component as props. So now inside of the App component we can call our action Creator by referencing this props. 
