import {globalReducer} from './global'

export const getDefaultGlobalStructure = () => {
    return {
        entered:false,
        isLoggedIn:false,
        name:null,
    }
}

const defaultState = {
    global: getDefaultGlobalStructure()
};

function root(state = defaultState, action) {
    const global = globalReducer(state.global, action);

    return {
        global
    }
}

export default root;