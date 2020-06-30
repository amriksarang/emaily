import { FETCH_USER } from '../actions/types';

export default function(state = null, action){
	//make sure that the data that says whether or not our user is actually logged in gets communicated to the reducer.
	switch(action.type){
		case FETCH_USER:
			return action.payload || false; // if user is not logged in action.payload will be an empty string which is a flase value. This will cause the expression to return false
		default:
			return state;
	}
}