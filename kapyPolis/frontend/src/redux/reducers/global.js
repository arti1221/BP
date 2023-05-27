import {SET_ENTERED, SET_LOGGED_IN, SET_NAME, SET_NUMBER_ROLLED, SET_HAS_ROLLED, SET_HAS_ROLLS, SET_FIRST_ROLL, SET_SECOND_ROLL, SET_LAST_ROLLED, SET_IS_ROLLING, SET_SHOW_SHOP, SET_WINNER, SET_WIN_AMT, SET_WIN_TYPE1, SET_WIN_TYPE2, SET_HAS_WINNER} from '../actions/action'

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
        case SET_IS_ROLLING:
            return {
                ...state, isRolling:action.value
            }
        case SET_SHOW_SHOP:
            return {
                ...state, showShopModal:action.value
            }
        case SET_WINNER:
            return {
                ...state, winner:action.value
            }
        case SET_WIN_AMT:
            return {
                ...state, winningAmt:action.value
            }
        case SET_WIN_TYPE1:
            return {
                ...state, wintype1:action.value
            }
        case SET_WIN_TYPE2:
            return {
                ...state, wintype2:action.value
            }
        case SET_HAS_WINNER:
            return {
                ...state, hasWinner:action.value
            }
        default:
            return state
    }

}