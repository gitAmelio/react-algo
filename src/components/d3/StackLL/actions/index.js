import * as TYPES from './types'

export const push = (paused) => ( dispatch, getState )=> {
    const {stackLLInputs: input} = getState()
    
    if(paused){
        dispatch({type: TYPES.SLL_PUSH_NODE, payload:  {[input.index]:  {value: input.value,  step: 0, end: 3 }} })
    }else{
        dispatch({type: TYPES.SLL_PUSH_NODE, payload:  {[input.index]:  {value: input.value,  step: 3, end: 3 }} })
    }
    dispatch({type: TYPES.SLL_CLEAR_ON_INC, payload: { index: input.index+1, value: ''} })

}

export const pop = (e) => ( dispatch, getState )=> {
    const {stackLL, stackLLInputs : input} = getState()
    
    if(stackLL[input.index-1] === undefined) return;
    dispatch({type: TYPES.SLL_POP_NODE, payload: input.index-1 })
    if(input.index === 0) return;
    dispatch({type: TYPES.SLL_CLEAR_ON_DEC, payload: { index: input.index-1, value: ''} })
}

export const clearAll = () => ( dispatch, getState )=> {
    
    dispatch({type: TYPES.SLL_CLEAR_STACKLL })
    dispatch({type: TYPES.SLL_CLEAR_INPUT, payload: { index: 0, value: ''} })
}


export const textChanged = (input) => (dispatch, getState) => {
    const { stackLLInputs } = getState()
    let name;
    let value;

    if(input.currentTarget){
        name = input.currentTarget.name
        value = input.currentTarget.value;
    }else{
        name = input.name;
        value = input.value;
    }
    
    const validInput = (value.length <= 4)
    
    if(!validInput) return  
        
    stackLLInputs[name] = value;

    dispatch({type: TYPES.SLL_ON_NODE_CHANGE, payload: stackLLInputs })
}

