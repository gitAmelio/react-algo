import * as TYPES from '../actions/types'
import {stepper} from '../../Stepper/reducer'

export const stackLLInputs = (inputData={index:0, value:''}, action) => {
    switch(action.type) {
        case TYPES.SLL_CLEAR_ON_INC:
            return {...inputData,  ...action.payload };
        case TYPES.SLL_CLEAR_ON_DEC:
            return {...inputData,  ...action.payload };    
        case TYPES.SLL_ON_NODE_CHANGE:    
            return {...inputData,  ...action.payload };
        case TYPES.SLL_CLEAR_INPUT:
            return { index: 0, value: '' };
        default: 
            return inputData;
    }
}

export const stackLL =  (boxes={}, action) => {
    
    const stepperResult = stepper(boxes, action);
    if(stepperResult) return {...stepperResult};

    switch(action.type) {
        case TYPES.SLL_PUSH_NODE:
            return {  ...boxes, ...action.payload };
        case TYPES.SLL_POP_NODE:
            delete(boxes[action.payload])
            return {...boxes}
        case TYPES.SLL_CLEAR_STACKLL:
            return {};      
        default: 
            return boxes;
    }
}
