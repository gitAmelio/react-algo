import * as TYPES from '../actions/types'

const page = (p = {name: '' }, action) => {
    switch (action.type) {
        case TYPES.PAGE_CHANGE:
            return {...p, name: action.payload}
        default:
            return p
    }
}                

export default { page }