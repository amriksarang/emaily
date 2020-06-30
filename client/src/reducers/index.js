import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';

export default combineReducers({
	auth: authReducer, // authReducer is assigned to auth property
	form: reduxForm
});