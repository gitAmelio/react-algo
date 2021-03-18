import * as TYPES from './types'
import * as H from '../../../../Utils/helpers'

export const pause = (bufferedData) => (dispatch, getState) => {
    const {stackLL} = getState();
    
    if(!H.empty(bufferedData)){
        let startIndex = +Math.max(Object.keys(stackLL))
        for(let node of bufferedData){
            startIndex++
            const {value} = node
            stackLL[startIndex] =  {value, step: 3, end: 3}
        }
    }

    const updates = H.updateNodes(stackLL, {step:3, end:3})
    
    dispatch( {type: TYPES.PAUSE, payload: {  ...stackLL, ...updates }} )

}
export const forward = (index) => (dispatch, getState) =>  {
    const {stackLL} = getState();
    const node = stackLL[index];

    if(node && node.step> -1 && node.step < node.end){
        node.step += 1;
        dispatch({type: TYPES.FORWARD, paylaod: {...node}})
       
    }
}
export const backward = (index) => (dispatch, getState) =>  {
    const {stackLL} = getState();
    const node = stackLL[index];

    if(node && node.step > -1 && node.step > 0){
        node.step -= 1;
        dispatch({type: TYPES.BACKWARD, paylaod: {...node}})
        
    }
}
export const updateStep = (index, step) => (dispatch, getState) =>  {
    const {stackLL} = getState();
    const node = stackLL[index];

    if(!node) return
    dispatch({ type: TYPES.UPDATE_STEP, payload: {[index]: {...node, ...step}}  })
}