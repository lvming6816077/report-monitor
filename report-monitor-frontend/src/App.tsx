import React, { Component, ElementType, ReactNode } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { MenuBar } from './components/menubar/MenuBar'
import { NavBar } from './components/header/NavBar'
import { useHistory, useLocation } from 'react-router-dom'
import routes from './router'
import { useSelector, useDispatch } from 'react-redux';

import './App.less'
import { RootState } from './store'
import { userInfoType } from './reducers/user/types'
import { Alert } from 'antd'
// type Props = {
//     path:string,
//     name: string,
//     component: JSX.Element,
//     auth: boolean,
//     routes?:Props[]
// }

const RequireAuth = ({ children, auth }: { children: JSX.Element, auth: number[] }) => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    if (auth.every((o) => userInfo.level?.includes(o))) {
        return children
    } else {
        // window.location.href = '/login'
        return <Alert
            message="无权限"
            description="对比起，您没有权限访问这个页面"
            type="error"
            showIcon
        />
    }
}
const App: React.FC = () => {

    const location = useLocation()

    const isLogin = location.pathname == '/login'
    return (
        <div className="container">
            {isLogin ? null : <div className='nav-bar'>
                <NavBar></NavBar>
            </div>}
            {isLogin ? null : <div className='left-bar'>
                <MenuBar></MenuBar>
            </div>}
            <div className={isLogin ? 'main-content all' : 'main-content'}>
                <Switch>
                    {routes.map((route, i) => <Route path={route.path} exact key={i}><RequireAuth auth={route.auth}><route.component /></RequireAuth></Route>)}
                </Switch>
            </div>

        </div>
    )
}

export default App
