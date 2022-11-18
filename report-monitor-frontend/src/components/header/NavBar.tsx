import React from 'react'
import { Avatar, Dropdown, Menu, MenuProps } from 'antd'
import {
    LogoutOutlined,
    BarChartOutlined,
    AreaChartOutlined,
    UserOutlined,
    DownOutlined,
    PlusSquareOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import randomName from '@/utils/nickname'

import './NavBar.less'
import { useHistory } from 'react-router-dom'

export const NavBar: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const projectList = useSelector((state: RootState) => state.project.projectList)
    const dispatch = useDispatch()
    const history = useHistory()

    const logout = () => {
        dispatch({ type: 'REMOVE_USER' })
        window.location.href = '/login'
    }

    const nickname = userInfo?.nickname || randomName.getNickName()
    const shortUsername = nickname[0]

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key == 'logout') {
            logout()
            return
        }

        history.push(e.key)
    }

    const menu = (
        <Menu
            onClick={handleMenuClick}
            items={[
                {
                    label: '创建数据点',
                    key: '/point/createpoint',
                    icon: <PlusSquareOutlined />,
                },
                {
                    label: '创建类目',
                    key: '/point/createtag',
                    icon: <PlusSquareOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    label: '修改密码',
                    key: '/setting/changepass',
                    icon: <LogoutOutlined />,
                },
                {
                    label: '退出登陆',
                    key: 'logout',
                    icon: <LogoutOutlined />,
                },
            ]}
        />
    )

    const projectItems = projectList.map((d:any)=>{
        return {
            label:d.name,
            key:d.id,
            active:d.active
        }
    })

    const menuProject = (
        
        <Menu
            onClick={handleMenuClick}
            items={projectItems}
        />
    )

    return (
        <div className="navbar">
            <div className="logo">
                <AreaChartOutlined className="icon" />
                Report Monitor
            </div>
            <div className='change-project'>
                <Dropdown overlay={menuProject}>
                    <div className="right-avatar">
                        {projectItems.find((r=>r.active))?.label}  &nbsp;&nbsp;&nbsp;<DownOutlined className=''/>
                    </div>
                </Dropdown>
            </div>
            <div className="right-content">
                <Dropdown overlay={menu}>
                    <div className="right-avatar">
                        <Avatar className="avatar" size={'default'}>
                            {shortUsername}
                        </Avatar>
                        <span className="username">{nickname}</span>
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}
