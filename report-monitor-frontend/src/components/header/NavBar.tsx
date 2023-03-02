import React, { useEffect, useState } from 'react'
import { Avatar, Dropdown, Menu, MenuProps, Switch } from 'antd'
import {
    LogoutOutlined,
    BarChartOutlined,
    AreaChartOutlined,
    UserOutlined,
    MinusSquareOutlined,
    DownOutlined,
    PlusSquareOutlined,
    UnlockOutlined,
    BlockOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import randomName from '@/utils/nickname'

import './NavBar.less'
import { useHistory } from 'react-router-dom'
import { SET_USER } from '@/reducers/user/actionTypes'
import axios from 'axios'

type ProjectItem = {
    _id: string,
    name: string,
    projectCode:string
}

export const NavBar: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const projectList: ProjectItem[] = useSelector((state: RootState) => state.project.projectList)
    const dispatch = useDispatch()
    const history = useHistory()

    const [activeName, setActiveName] = useState<string>('')

    const logout = () => {
        dispatch({ type: 'REMOVE_USER' })
        window.location.href = '/login'
    }

    const nickname = userInfo?.nickname || randomName.getNickName()
    const shortUsername = nickname[0]

    const handleMenuClick: MenuProps['onClick'] =  (e) => {

        if (e.key == 'logout') {
            logout()
            return
        }

        history.push(e.key)
    }
    const handleProjectClick: MenuProps['onClick'] = async (e) => {
        let activePid = e.key
        const ret = await axios.post('/rapi/user/setUserActiveProject', {
            activePid: activePid,
        })
        if (ret.data.data == 'success') {
            dispatch({
                type: SET_USER,
                data: {
                    ...userInfo,
                    activePid: activePid
                },
            })
            setTimeout(() => {
                window.location.href = '/'
            })
        }
    }

    useEffect(() => {
        let activePid = userInfo.activePid
        let name = ''
        if (activePid) {
            let n = projectList.find(r => r._id == activePid)

            name = n ? n.name+'（'+n.projectCode+'）' : ''
        } else {
            name = projectList[0]?.name+'（'+projectList[0]?.projectCode+'）'
        }
        // console.log(name,activePid)
        setActiveName(name)
    }, [projectList, userInfo])

    const goProject = ()=>{
        history.push('/createproject?projectCode=')
    }
    const changeDark = (flag:boolean)=>{
        // console.log(flag)
        dispatch({
            type: SET_USER,
            data: {
                ...userInfo,
                theme: flag ? 'antd-dark':'antd-default'
            },
        })
    }


    const menu = (
        <Menu
            onClick={handleMenuClick}
            items={[

                {
                    label: '创建项目',
                    key: '/createproject',
                    icon: <PlusSquareOutlined />,
                },
                // {
                //     label: '解绑项目',
                //     key: '/createproject?projectId='+userInfo.activePid+'&bindFlag=unbind',
                //     icon: <MinusSquareOutlined />,
                // },
                {
                    label: '绑定项目',
                    key: '/createproject?&bindFlag=bind',
                    icon: <BlockOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    label: '修改密码',
                    key: '/setting/changepass',
                    icon: <UnlockOutlined />,
                },
                {
                    label: '退出登陆',
                    key: 'logout',
                    icon: <LogoutOutlined />,
                },
            ]}
        />
    )

    const projectItems = projectList.map((d: ProjectItem) => {
        return {
            label: d.name,
            key: d._id,
        }
    })
    const menuProject = (

        <Menu
            onClick={handleProjectClick}
            items={projectItems}
        />
    )

    return (
        <div className="navbar">
            <div className="logo">
                <AreaChartOutlined className="icon" />
                Report Monitor
            </div>
            {projectList.length > 0 ? <div className='change-project'>
                <Dropdown overlay={menuProject}>
                    <div className="right-avatar">
                        {activeName}  &nbsp;&nbsp;&nbsp;<DownOutlined className='' />
                    </div>
                </Dropdown>
            </div> :
                <a className='go-project' onClick={goProject}>请先创建项目&gt;</a>
            }
            <div className="right-content">
                <Dropdown overlay={menu}>
                    <div className="right-avatar">
                        <Avatar className="avatar" size={'default'}>
                            {shortUsername}
                        </Avatar>
                        <span className="username">{nickname}</span>
                    </div>
                </Dropdown>
                <Switch
                    checkedChildren={'🌜'}
                    unCheckedChildren={'🌞'}
                    defaultChecked={userInfo.theme == 'antd-dark'}
                    onChange={changeDark}
                />
            </div>
            
        </div>
    )
}
