import React, { Component, ElementType, ReactNode, useMemo } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { MenuBar } from './components/menubar/MenuBar'
import { NavBar } from './components/header/NavBar'
import { useHistory, useLocation } from 'react-router-dom'
import { routes, flatRoute, IRoute } from './router'
import { useSelector, useDispatch } from 'react-redux'

import './App.less'
import { RootState } from './store'
import { userInfoType } from './reducers/user/types'
import { Alert } from 'antd'

const RequireAuth = ({
    children,
    auth,
}: {
    children: JSX.Element
    auth: number[]
}) => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)

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

    const isLogin = location.pathname == '/login'

    const flatRoutes: IRoute[] = useMemo(() => flatRoute(routes), [routes])

    const noNeedAuthRoutes = flatRoutes.filter(
        (i: IRoute) => i.auth?.length == 0
    )
    const needAuthRoutes = flatRoutes.filter((i: IRoute) => i.auth?.length != 0)
    // console.log(needAuthRoutes)
    var a = 1

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
