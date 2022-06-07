/* eslint-disable @typescript-eslint/default-param-last */

import { SET_USER, REMOVE_USER } from './actionTypes'
import { UserActionTypes, userInfoType } from './types'


type initialStateType = {
    userInfo: userInfoType
}
const cuser = localStorage.getItem('cuser')
const initialState: initialStateType = cuser ? JSON.parse(cuser) : {
    userInfo: { username: '',level:[],nickname:'' },
}

export default (state = initialState, action: UserActionTypes):initialStateType => {

    switch (action.type) {
        case SET_USER:
            const u = { ...state, userInfo: { username: action.data?.username,level:action.data?.level,nickname:action.data?.nickname,userid:action.data?.userid } }
            localStorage.setItem('cuser', JSON.stringify(u))
            return u

        case REMOVE_USER:
            localStorage.removeItem('cuser');
            return state

        default:
            return state
    }
}
