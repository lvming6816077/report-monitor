import * as projectActionTypes from './actionTypes'
import axios from 'axios'
import { userInfoType } from '../user/types'
import { Dispatch } from 'redux'
import { SET_USER } from '../user/actionTypes'

export { default as ProjectReducer } from './projectReducer'
export { projectActionTypes }

export const setProjectListAction = (userInfo:userInfoType)=>{
    return async (dispatch:Dispatch)=>{

        if (!userInfo.userid) {
            dispatch({
                type: projectActionTypes.SET_PROJECT_LIST,
                data: [],
            })
            return
        }

        const projectList = await axios.get('/rapi/user/getUserProjects?id='+userInfo.userid)
        if (projectList.data.code == 0) {

            dispatch({
                type: projectActionTypes.SET_PROJECT_LIST,
                data: projectList.data.data,
            })
            // let activePid = projectList.data.data.filter((r:any)=>r.active == true)[0]?._id
            // // 设置当前id
            // dispatch({
            //     type: SET_USER,
            //     data: {
            //         ...userInfo,
            //         activePid:activePid
            //     },
            // })
        }
    }
}
