import React from 'react'
import { Avatar } from 'antd';
import { LogoutOutlined,BarChartOutlined,AreaChartOutlined } from '@ant-design/icons'
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '@/store'

import './NavBar.less'

export const NavBar: React.FC = () => {
    const userInfo = useSelector((state:RootState) => state.user.userInfo);
    const dispatch = useDispatch()

    const logout = ()=>{
        dispatch({type:'REMOVE_USER'})
        window.location.href = '/login'
    }
    const shortUsername = userInfo?.username ? userInfo?.username[0]:''
    const username = userInfo?.username

    return (
        <div className='navbar'>
            <div className='logo'>
                <AreaChartOutlined className='icon' />Report Monitor
            </div>
            <div className='right-content'>
                <Avatar className='avatar' size="large" >
                    {shortUsername}
                </Avatar>
                <span className='username'>{username}</span>
                <LogoutOutlined style={{fontSize:18,cursor:'pointer'}} onClick={logout}/>
            </div>

        </div>
    )
}
