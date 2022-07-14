import { Home } from './pages/home/Home'
import { CreateTag } from './pages/point/CreateTag'
import { CreatePoint } from './pages/point/CreatePoint'
import { PointList } from './pages/point/pointlist/PointList'
import { UserList } from './pages/setting/user/UserList'
import { TagList } from './pages/point/TagList'
import { PointSet } from './pages/setting/point/PointSet'
import { PointAllList } from './pages/setting/point/PointAllList'
import { Login } from './pages/login/Login'
import { UserInfo } from './pages/setting/user/UserInfo'
import {
    HomeOutlined,
    PartitionOutlined,
    SettingOutlined,
} from '@ant-design/icons'

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
        label: '首页',
        key: '/dashboard',
        children: [
            {
                label: '数据展示',
                key: '/',
                name: 'home',
                auth: [1],
                component: Home,
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
        label: '设置',
        key: '/setting',
        children: [
            {
                label: '个人中心',
                key: '/setting/userinfo',
                name: 'userinfo',
                component: UserInfo,
                auth: [1],
            },
            {
                label: '数据点预设',
                key: '/setting/pointset',
                name: 'pointset',
                component: PointSet,
                auth: [1],
            },
            {
                label: '数据点管理(admin)',
                key: '/setting/pointalllist',
                name: 'pointalllist',
                component: PointAllList,
                auth: [1, 0],
            },
            {
                label: '用户管理(admin)',
                key: '/setting/userlist',
                name: 'userlist',
                component: UserList,
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
