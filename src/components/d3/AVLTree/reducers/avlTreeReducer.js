import * as TYPES from '../actions/types'

const reset = {
    dsName: 'avl',
    root: null,
    history: {},
    mainStep: 0,
    modeStep: 0,
    message: '',
    value: '',
    deleteValue: '',
    index: 0,
    stepIndex: 0,
    stepping: false,
    stepRoot: null,
    taskDone: true,
    taskComplete: true,
    done: true
}

export const avl = (state = { ...reset }, action) => {
    switch (action.type) {
        case TYPES.AVLTREE_INSERT_ROOT:
            return action.payload
        case TYPES.AVLTREE_BALANCE_ROOT:
            return action.payload
        case TYPES.AVLTREE_DELETE_ROOT:
            return action.payload

        case TYPES.AVLTREE_SET_MODE:
            return { ...state, ...action.payload }
        case TYPES.AVLTREE_CLEAR_MODE:
            return { ...state, mode: '', done: true }

        case TYPES.AVLTREE_INSERT_INPUT_CHANGED:
            return action.payload
        case TYPES.AVLTREE_CLEAR_INSERT_INPUT_CHANGED:
            return { ...state, value: '', canInsert: false }
        case TYPES.AVLTREE_DELETE_INPUT_CHANGED:
            return action.payload
        case TYPES.AVLTREE_CLEAR_DELETE_INPUT:
            return { ...state, deleteValue: '', canDelete: false, done: true }

        case TYPES.AVLTREE_CLEAR_ALL:
            return { ...reset }

        case TYPES.AVLTREE_ENABLE_CONTROLS:
            return { ...state, inputsDisabled: false }
        case TYPES.AVLTREE_DISABLE_CONTROLS:
            return { ...state, inputsDisabled: true }

        case TYPES.AVLTREE_ENABLE_INSERT:
            return { ...state, insertDisabled: false }
        case TYPES.AVLTREE_DISABLE_INSERT:
            return { ...state, insertDisabled: true }

        case TYPES.AVLTREE_ENABLE_DELETE:
            return { ...state, deleteDisabled: false }
        case TYPES.AVLTREE_DISABLE_DELETE:
            return { ...state, deleteDisabled: true }

        case TYPES.AVLTREE_UPDATE_MSG:
            return action.payload
        case TYPES.AVLTREE_CLEAR_MSG:
            return action.payload

        case TYPES.AVLTREE_STEP_UP:
            return action.payload
        case TYPES.AVLTREE_STEP_DOWN:
            return action.payload
        case TYPES.AVLTREE_TOGGLE_STEPPING:
            return action.payload

        default:
            return state
    }
}

