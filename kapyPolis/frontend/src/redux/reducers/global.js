import {SET_ENTERED, SET_LOGGED_IN, SET_NAME, SET_NUMBER_ROLLED, SET_HAS_ROLLED, SET_HAS_ROLLS, SET_FIRST_ROLL, SET_SECOND_ROLL, SET_LAST_ROLLED} from '../actions/action'

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
        case SET_NAME:
            return {
                ...state, name:action.value
            }
        case SET_NUMBER_ROLLED:
            return {
                ...state, numberRolled:action.value
            }
        case SET_HAS_ROLLED:
            return {
                ...state, hasRolled:action.value
            }
        case SET_HAS_ROLLS:
            return {
                ...state, hasRolls:action.value
            }
        case SET_FIRST_ROLL:
            return {
                ...state, firstRoll:action.value
            }
        case SET_SECOND_ROLL:
            return {
                ...state, secondRoll:action.value
            }
        case SET_LAST_ROLLED:
            return {
                ...state, secondRoll:action.value
            }
        default:
            return state
    }

}