import * as TYPES from './types'

export const pageChange = (name) => (dispatch) => {
    dispatch({type: TYPES.PAGE_CHANGE,  payload: name})
} 