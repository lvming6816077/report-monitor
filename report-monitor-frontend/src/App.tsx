import React, { Component, ElementType, ReactNode, useEffect, useMemo } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { MenuBar } from './components/menubar/MenuBar'
import { NavBar } from './components/header/NavBar'
import { useHistory, useLocation } from 'react-router-dom'
import { routes, flatRoute, IRoute } from './router'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes } from '@/reducers/user/index'
import axios from 'axios'
import queryString from 'query-string'

import './App.less'
import { RootState } from './store'
import { userInfoType } from './reducers/user/types'
import { Alert } from 'antd'
import { setProjectListAction } from './reducers/project'


type IUser ={
    name: string
    age: number
    department: string
}

type optional = Partial<IUser>


type PickUser = Pick<IUser, "age" | "name">;

const RequireAuth = ({
    children,
    auth,
}: {
    children: JSX.Element
    auth: number[]
}) => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const projectList: [] = useSelector((state: RootState) => state.project.projectList)
    const location = useLocation()
    const { projectCode } = queryString.parse(location.search)

    // // 没有绑定项目 重定向取创建项目或者绑定
    // if (projectList.length == 0 && window.location.pathname != '/createproject' && userInfo.nickname) {
    //     window.location.href = '/createproject?projectCode='+projectCode
    //     return null
    // }

    if (auth.every((o) => userInfo.level?.includes(o))) {
        return children
    } else {
        if (window.location.pathname == '/') {
            window.location.href = '/login'
            return null
        }

        return (
            <Alert
                message="无权限"
                description="对比起，您没有权限访问这个页面"
                type="error"
                showIcon
            />
        )
    }
}

const App: React.FC = () => {
    const location = useLocation()
    const dispatch = useDispatch()

    const isLogin = location.pathname == '/login'||location.pathname =='/createproject'

    const flatRoutes: IRoute[] = useMemo(() => flatRoute(routes), [routes])

    const noNeedAuthRoutes = flatRoutes.filter(
        (i: IRoute) => i.auth?.length == 0
    )
    const needAuthRoutes = flatRoutes.filter((i: IRoute) => i.auth?.length != 0)
    const userInfo = useSelector((state: RootState) => state.user.userInfo)

    useEffect(()=>{
        dispatch(setProjectListAction(userInfo))
    },[])

    return (
        <div className="container">
            {isLogin ? null : (
                <div className="nav-bar">
                    <NavBar></NavBar>
                </div>
            )}
            {isLogin ? null : (
                <div className="left-bar">
                    <MenuBar></MenuBar>
                </div>
            )}
            <div className={isLogin ? 'main-content all' : 'main-content'}>
                <Switch>
                    {noNeedAuthRoutes.map((route, i) => (
                        <Route
                            path={route.key}
                            exact
                            key={i}
                            component={route.component}
                        ></Route>
                    ))}
                    {needAuthRoutes.map((route, i) => (
                        <Route path={route.key} exact key={i}>
                            <RequireAuth auth={route.auth || []}>
                                <route.component />
                            </RequireAuth>
                        </Route>
                    ))}
                </Switch>
            </div>
        </div>
    )
}

export default App
