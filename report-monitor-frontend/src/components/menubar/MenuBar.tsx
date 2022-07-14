import React, { useCallback, useMemo } from 'react'
import type { MenuProps } from 'antd'
import { Menu, Switch } from 'antd'
import {
    HomeOutlined,
    PartitionOutlined,
    SettingOutlined,
} from '@ant-design/icons'
import { useHistory, useLocation } from 'react-router-dom'
import { IRoute, routes } from '@/router'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
type MenuItem = Required<MenuProps>['items'][number]

// function getItem(
//     label?: React.ReactNode,
//     key?: React.Key | null,
//     icon?: React.ReactNode,
//     children?: MenuItem[],
//     type?: 'group',
//     path?: string,
// ): MenuItem {

//     return {
//         key,
//         icon,
//         children,
//         label,
//         type,
//         path,
//     } as MenuItem;
// }

const iconMap: { [key: string]: JSX.Element } = {
    HomeOutlined: <HomeOutlined />,
    PartitionOutlined: <PartitionOutlined />,
    SettingOutlined: <SettingOutlined />,
}

export const MenuBar: React.FC = () => {
    // const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
    // 根据路由生成菜单（过滤权限和非菜单路由）
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const getMenuFromRoutes = () => {
        // loop会修改原routers对象，将router复制一下
        const copyRoutes: IRoute[] = JSON.parse(JSON.stringify(routes))

        const loop = (_routes: IRoute[]) => {
            let res: IRoute[] = []
            _routes.forEach((item) => {
                let addFlag = true
                if (item.menu == false) {
                    addFlag = false
                }
                if (
                    item.auth &&
                    !item.auth.every((o) => userInfo.level?.includes(o))
                ) {
                    addFlag = false
                }

                if (addFlag) {
                    if (item.icon) {
                        let key = item.icon
                        item.icon = iconMap[key as string]
                    }

                    res.push(item)
                }
                if (item.children && item.children.length) {
                    item.children = loop(item.children)
                }
            })
            return res
        }

        return loop(copyRoutes) as MenuItem[]
    }

    const items: MenuItem[] = useMemo(() => getMenuFromRoutes(), [userInfo])

    const history = useHistory()
    const location = useLocation()
    const [current, setCurrent] = React.useState(location.pathname)

    const onClick: MenuProps['onClick'] = (e) => {
        history.push(e.key)

        setCurrent(e.key)
    }

    const getParentKey = useCallback(
        (_items: any[]): string => {
            let res = ''
            var loop = (__items: any[], pkey: string) => {
                for (var i = 0; i < __items.length; i++) {
                    let cur = __items[i]
                    if (cur.key == location.pathname) {
                        res = pkey
                        break
                    }
                    if (cur.children?.length) {
                        loop(cur.children, cur.key)
                    }
                }
            }
            loop(_items, '')

            return res
        },
        [location.pathname]
    )
    return (
        <>
            <Menu
                theme={'light'}
                onClick={(item) => onClick(item)}
                style={{ width: 201, height: '100%' }}
                defaultOpenKeys={[getParentKey(items)]}
                selectedKeys={[current]}
                mode="inline"
                items={items}
            />
        </>
    )
}
