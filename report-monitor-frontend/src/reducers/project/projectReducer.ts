/* eslint-disable @typescript-eslint/default-param-last */

import { SET_PROJECT_LIST } from './actionTypes'

type initialStateType = {
    projectList: []
}

const initialState: initialStateType = {
    projectList:[]
}

export default (
    state = initialState,
    action: any
): initialStateType => {
    switch (action.type) {
        case SET_PROJECT_LIST:
            const u = {
                ...state,
                projectList:action.data
            }
            return u

        default:
            return state
    }
}
