import {SET_ENTERED, SET_LOGGED_IN} from '../actions/action'

// reducer that handles events defined in actions. In the case that 2 reducers are created and same event is passed - both 
// reducers handle the event!
export function globalReducer(state, action) {
    
    switch (action.type) { 
        case SET_ENTERED:
            return {
                ...state, entered:action.value
            }
        case SET_LOGGED_IN:
            return {
                ...state, isLoggedIn:action.value
            }
        default:
            return state
    }

}