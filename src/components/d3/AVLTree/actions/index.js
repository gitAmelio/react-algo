import * as TYPES from './types'

import {stepInsert}  from '../steps/insert'
import {stepBalance} from '../steps/balance'
import {stepDelete}  from '../steps/delete'
import * as stepper  from '../steps/stepper'

import { duplicateRoot } from '../AVLTreeDS-helpers'
import { findRoot }      from '../steps/step-helper'

const dispatchPayload = (payload, type, dispatch ) => {
    dispatch({type, payload})
}

const insertUpdate = (avl, dispatch) => {
    dispatchPayload({...avl, root: duplicateRoot(avl.root)}, TYPES.AVLTREE_INSERT_ROOT, dispatch)
}

const balanceUpdate = (avl, dispatch) => {
    dispatchPayload({...avl, root: duplicateRoot(avl.root)}, TYPES.AVLTREE_BALANCE_ROOT, dispatch)
    if(avl.done) {
        dispatch({type: TYPES.AVLTREE_CLEAR_INSERT_INPUT_CHANGED})
        dispatch({type: TYPES.AVLTREE_CLEAR_DELETE_INPUT})
    }    
}

const deleteUpdate = (avl, dispatch) => {
    dispatchPayload({...avl, root: duplicateRoot(avl.root)}, TYPES.AVLTREE_BALANCE_ROOT, dispatch)
}

const updateMode = (mode, dispatch) => {
    dispatchPayload({mode, done: false}, TYPES.AVLTREE_SET_MODE, dispatch)
}

export const disableControls = (dispatch) => {
    dispatch({type: TYPES.AVLTREE_DISABLE_CONTROLS})
}

export const avlSetMode = (mode) => dispatch => {
    updateMode(mode, dispatch)
}

const updateHistory = ( history, update)  => { 
    return { ...history, ...update }
}

const _avlBalance = (avl, value, step, dispatch) => {

    if(!avl.root){
        dispatch({type: TYPES.AVLTREE_CLEAR_INSERT_INPUT_CHANGED})
        dispatch({type: TYPES.AVLTREE_CLEAR_DELETE_INPUT})
        return
    }

    const { history, mainStep, mode, index } = avl
    
    if(mode !== 'balance' ) return 

    const result = stepBalance(avl.root, {value}, step)

    const status = result.taskDone
                        ? {mode:'', prevMode:mode, modeStep: 0, done: true} 
                        : {mode:'balance', prevMode: mode, modeStep: step+1, done: false} 

    const updatedHistory = updateHistory( history, {[mainStep]: {...status, index}} )

    balanceUpdate({
        ...avl, 
        ...result, 
        ...status,
        history: updatedHistory, 
        mainStep: mainStep+1,
        stepIndex: mainStep,
    }, dispatch)

}

export const avlBalance = (value, step) => (dispatch, getState) => {
    
    const {avl} = getState()

    const newValue = value || avl.focusValue
    const modeStep = step  || avl.modeStep

    _avlBalance(avl, newValue, modeStep, dispatch)
   
}

export const avlInsert = () => ( dispatch, getState )=> {
    
    const { value } = getState().avl
    const { avl }   = getState()
    const { history, mainStep, modeStep, mode, prevMode, done, index } = avl
    
    if(mode === 'balance') return _avlBalance(avl, value, modeStep, dispatch)

    if(mode !== 'insert' ) return 
    
    const result = stepInsert(avl.root, {value, index}, modeStep)
    
    const {exist} = result
    
    if(exist && done){
       return null 
    } 
    
    const status = result.done 
    ? { focusValue: value, mode:'balance', prevMode: 'insert', modeStep: 0,          insertButtonPressed: false, done: false } 
    : { focusValue: value, mode:'insert',  prevMode: mode,     modeStep: modeStep+1, insertButtonPressed: true }

    const updatedHistory = updateHistory( history, {[mainStep]: {
        ...status, 
        index: prevMode !== 'insert' ? index+1 : index
    }} )

    if( !isNaN(value) ){
        insertUpdate({
                ...avl, 
                ...result, 
                ...status, 
                history: updatedHistory, 
                mainStep: mainStep+1,
                stepIndex: mainStep,
                index: prevMode !== 'insert' ? index+1 : index
            }, 
            dispatch
        )
    }
    
}

export const avlDelete = () => (dispatch, getState) => {
    
    const { avl } = getState()

    const {
        history, mainStep, modeStep, 
        mode, done, 
        deleteValue, deleteIndex
    } = avl
    
    if(mode === 'balance') return _avlBalance(avl, deleteValue, modeStep, dispatch)
    
    if(!deleteIndex && mode !== 'delete') return null

    if(mode !== undefined && mode !== '' && mode !== 'delete' ) return 
    
    const result = stepDelete(avl.root, {deleteValue, deleteIndex}, modeStep)
    
    const {exist} = result
    
    if(exist && done){
        return null 
     } 
    
    const status = result.done 
        ? { focusValue: deleteValue, mode:'balance', modeStep: 0, done: false} 
        : { focusValue: deleteValue, mode:'delete', modeStep: modeStep+1}

    const updatedHistory = updateHistory( history, {[mainStep]: {...status, deleteIndex}} )
    
    if(!isNaN(deleteValue)){
        deleteUpdate({
                ...avl, 
                ...result, 
                ...status, 
                history: updatedHistory, 
                mainStep: mainStep+1,
                stepIndex: mainStep,
                deleteIndex 
            }, 
            dispatch
        )
    } 
}

export const deleteTextChanged = (input) => (dispatch, getState) => {
    const { avl } = getState()
    let target;
    
    if(input.currentTarget){
        target = input.currentTarget
    }else{
        target = input
    }

    if(isNaN( target.value )) return;

    avl.canDelete = (!isNaN( target.value ) && target.value.length <= 5 && target.value.length !== 0)

    avl[target.name] = target.value !== '' ?  +target.value : ''

    const targetExist = findRoot(avl.root, +target.value)

    if(targetExist){
        avl.deleteIndex = targetExist.index
    }

    dispatch( {type: TYPES.AVLTREE_DELETE_INPUT_CHANGED, payload: { ...avl } } )
}

export const clearDeleteText = () => (dispatch) => {
    dispatch({type: TYPES.AVLTREE_CLEAR_DELETE_INPUT})
}

export const textChanged = (input) => (dispatch, getState) => {

    const { avl } = getState()
    
    let target;
    if(input.currentTarget){
        target = input.currentTarget
    }else{
        target = input
    }
      
    avl.canInsert = (!isNaN( target.value ) && target.value.length <= 5 && target.value.length !== 0)

    if(isNaN( target.value )) return; 

    avl[target.name] = target.value !== '' ?  +target.value : ''

    dispatch( {type: TYPES.AVLTREE_INSERT_INPUT_CHANGED, payload: {...avl } } )

}

export const clearInsertInput = () => (dispatch) => {
    dispatch({type:TYPES.AVLTREE_CLEAR_INSERT_INPUT_CHANGED})
}

export const clearAll = () => ( dispatch, getState )=> {
    dispatch({type: TYPES.AVLTREE_CLEAR_ALL})
}

export const stepUp = () => (dispatch, getState) => {
    const { avl } = getState()
    const { stepIndex, history} = avl
    const canStepUp = stepIndex+1 < Object.keys(history).length 
    const newStepIndex = canStepUp ? stepIndex + 1 : stepIndex

    dispatch({ 
        type:TYPES.AVLTREE_STEP_UP, 
        payload: {
            ...avl, 
            stepIndex: newStepIndex,
            stepRoot: stepper.steps(avl)
        } 
    })
}

export const stepDown = () => (dispatch, getState) => {
    const { avl } = getState()
    const { stepIndex } = avl
    const canStepUp = stepIndex-1 > 0
    const newStepIndex = canStepUp ? stepIndex - 1 : stepIndex

    dispatch({ 
        type:TYPES.AVLTREE_STEP_DOWN, 
        payload: {
            ...avl, 
            stepIndex: newStepIndex,
            stepRoot: stepper.steps(avl)
        } })
}

export const toggleStepping = () => (dispatch, getState) => {

    const { avl } = getState()
    const { stepping, stepIndex, history } = avl
    const { maxIndex } = stepper.compactHistory(history)
    const selectedIndex = stepIndex > maxIndex ? maxIndex : stepIndex  

    dispatch({ 
        type: TYPES.AVLTREE_TOGGLE_STEPPING, 
        payload: { 
            ...avl, 
            stepIndex: selectedIndex,
            stepping: !stepping,
            stepRoot: stepper.steps(avl)
        }
    })

} 


 