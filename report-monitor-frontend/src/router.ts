import React, { Suspense, lazy } from 'react';
import { Home } from './pages/home/Home'
import { CreateTag } from './pages/point/CreateTag'
import { CreatePoint } from './pages/point/CreatePoint'
import { PointList } from './pages/point/pointlist/PointList'
import { TagList } from './pages/point/TagList'
import CreateProject from './pages/project/CreateProject'
import { Login } from './pages/login/Login'



import Loadable from 'react-loadable'
import { SpeedList } from './pages/speed/speedlist/SpeedList';
import { CreateSpeedTag } from './pages/speed/CreateSpeedTag';
import { CreateSpeed } from './pages/speed/CreateSpeed';
import { SpeedTagList } from './pages/speed/SpeedTagList';
import { Speed } from './pages/home/Speed';

export type IRoute = {
    label: string
    key: string
    name?: string
    component?: JSX.Element | any
    auth?: number[]
    icon?: string | JSX.Element
    children?: IRoute[]
    menu?: boolean
    redirect?: string
}

export const routes: IRoute[] = [
    {
        label: '登陆',
        key: '/login',
        name: 'login',
        component: Login,
        menu: false,
    },
    {
        label: '创建项目',
        key: '/createproject',
        name: 'createproject',
        component:  CreateProject,
        menu: false,
    },

    {
        label: '首页',
        key: '/dashboard',
        children: [
            {
                label: '数据点展示',
                key: '/',
                name: 'home',
                auth: [1],
                component: Home,
            },
            {
                label: '测速点展示',
                key: '/speedhome',
                name: 'speedhome',
                auth: [1],
                component: Speed,
            },
        ],
        icon: 'HomeOutlined',
    },
    {
        label: '数据点',
        key: '/point',
        children: [
            {
                label: '创建类目',
                key: '/point/createtag',
                name: 'createtag',
                component: CreateTag,
                menu: false,
                auth: [1],
            },
            {
                label: '数据点管理',
                key: '/point/pointlist',
                name: 'pointlist',
                component: PointList,
                auth: [1],
            },
            {
                label: '类目管理',
                key: '/point/taglist',
                name: 'taglist',
                component: TagList,
                auth: [1],
            },
            {
                label: '创建数据点',
                key: '/point/createpoint',
                name: 'createpoint',
                menu: false,
                component: CreatePoint,
                auth: [1],
            },
        ],
        icon: 'PartitionOutlined',
    },
    {
        label: '测速点',
        key: '/speed',
        children: [
            {
                label: '创建类目',
                key: '/speed/createspeedtag',
                name: 'createspeedtag',
                component: CreateSpeedTag,
                menu: false,
                auth: [1],
            },
            {
                label: '测速点管理',
                key: '/speed/speedlist',
                name: 'speedlist',
                component: SpeedList,
                auth: [1],
            },
            {
                label: '类目管理',
                key: '/speed/speedtaglist',
                name: 'speedtaglist',
                component: SpeedTagList,
                auth: [1],
            },
            {
                label: '创建测速点',
                key: '/speed/createspeed',
                name: 'createspeed',
                menu: false,
                component: CreateSpeed,
                auth: [1],
            },
        ],
        icon: 'ThunderboltOutlined',
    },
    {
        label: '日志',
        key: '/log',
        children: [
            {
                label: '日志管理',
                key: '/log/list',
                name: 'loglist',
                component:  Loadable({
                    loader: () => import('./pages/log/LogList'),
                    loading: () => null
                }),
                auth: [1],
            },

        ],
        icon: 'ProfileOutlined',
    },
    {
        label: '设置',
        key: '/setting',
        children: [
            {
                label: '个人中心',
                key: '/setting/userinfo',
                name: 'userinfo',
                component:  Loadable({
                    loader: () => import('./pages/setting/user/UserInfo'),
                    loading: () => null
                }),
                auth: [1],
            },
            {
                label: '修改密码',
                key: '/setting/changepass',
                name: 'changepass',
                menu: false,
                component:  Loadable({
                    loader: () => import('./pages/setting/user/UserChangePassword'),
                    loading: () => null
                }),
                auth: [1],
            },
            {
                label: '数据点预设',
                key: '/setting/pointset',
                name: 'pointset',
                component:  Loadable({
                    loader: () => import('./pages/setting/point/PointSet'),
                    loading: () => null
                }),
                auth: [1],
            },
            {
                label: '测速点预设',
                key: '/setting/speedset',
                name: 'speedset',
                component:  Loadable({
                    loader: () => import('./pages/setting/speed/SpeedSet'),
                    loading: () => null
                }),
                auth: [1],
            },
            {
                label: '数据点管理(admin)',
                key: '/setting/pointalllist',
                name: 'pointalllist',
                component:  Loadable({
                    loader: () => import('./pages/setting/point/PointAllList'),
                    loading: () => null
                }),
                auth: [1, 0],
            },
            {
                label: '用户管理(admin)',
                key: '/setting/userlist',
                name: 'userlist',
                component:  Loadable({
                    loader: () => import('./pages/setting/user/UserList'),
                    loading: () => null
                }),
                auth: [1, 0],
            },
            {
                label: '项目管理(admin)',
                key: '/setting/projectlist',
                name: 'projectlist',
                component:  Loadable({
                    loader: () => import('./pages/project/ProjectList'),
                    loading: () => null
                }),
                
                auth: [1, 0],
            },
        ],
        icon: 'SettingOutlined',
    },
]

export const flatRoute = (routes: IRoute[]) => {
    const _flatRoute = (_routes: any) => {
        return _routes.reduce((pre: IRoute[], cur: IRoute) => {
            return cur.children &&
                Array.isArray(cur.children) &&
                cur.children.length
                ? [
                      ...pre,
                      ..._flatRoute(cur.children),
                      { ...cur, children: null },
                  ]
                : [...pre, cur]
        }, [])
    }

    return _flatRoute(routes).filter((i: IRoute) => i.component)
}
