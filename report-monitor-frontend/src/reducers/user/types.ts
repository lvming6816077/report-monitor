import { SET_USER,REMOVE_USER } from './actionTypes'
export type userInfoType = {
    username:string|undefined,
    level:number[]|undefined
}
interface SetUserAction {
  type: typeof SET_USER|typeof REMOVE_USER,
  data?:userInfoType
}

export type UserActionTypes = SetUserAction

