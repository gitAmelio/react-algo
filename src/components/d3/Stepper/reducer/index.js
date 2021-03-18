const reduceAction = (state, action) => ({ ...state, ...action.payload })
const reducedTabel = {
    PAUSE: reduceAction, 
    FORWARD: reduceAction, 
    BACKWARD: reduceAction, 
    UPDATE_STEP: reduceAction, 
}

//Stepper must be called by another reducer 
export const stepper =  (nodes={}, action) => {
    return reducedTabel[action.type]
        ? reducedTabel[action.type](nodes, action)
        : false;
}