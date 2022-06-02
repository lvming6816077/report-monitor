import React, { useCallback } from 'react'
import type { MenuProps } from 'antd';
import { Menu, Switch } from 'antd';
import { HomeOutlined, PartitionOutlined, SettingOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom'
type MenuItem = Required<MenuProps>['items'][number];

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



const items: MenuItem[] = [
    {
        label: '首页',
        key: 'item-1', 
        children: [
            { label: '数据展示', key: '/',},
        ],
        icon:<HomeOutlined />
    },
    {
        label: '数据点', 
        key: 'item-2', 
        children: [
            { label: '数据点管理', key: '/pointlist',},
            { label: '类目管理', key: '/taglist',},
        ],
        icon:<PartitionOutlined />
    },
    {
        label: '设置', 
        key: 'item-3', 
        children: [
            { label: '数据点预设', key: '/pointset'},
            { label: '数据点管理(admin)', key: '/pointalllist'},
            
            { label: '用户管理', key: '/userlist'},
        ],
        icon:<SettingOutlined />
    },
];



export const MenuBar: React.FC = () => {
    // const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

    const history  = useHistory()
    const location = useLocation()
    const [current, setCurrent] = React.useState(location.pathname);


    const onClick: MenuProps['onClick'] = e => {

        history.push(e.key)

        setCurrent(e.key);
    };

    const getParentKey = useCallback((_items:any[]):string=>{
        let res = ''
        var loop = (__items:any[],pkey:string)=>{
            for (var i = 0 ; i < __items.length ; i++ ) {
                let cur = __items[i]
                if (cur.key == location.pathname) {
                    res = pkey
                    break
                }
                if (cur.children?.length) {
                    loop(cur.children,cur.key)
                }
            }
        }
        loop(_items,'')
        
        return res
    },[location.pathname])
    return (
        <>
            <Menu
                theme={'light'}
                onClick={(item) => onClick(item)}
                style={{ width: 201,height:'100%' }}
                defaultOpenKeys={[getParentKey(items)]}
                selectedKeys={[current]}
                mode="inline"
                items={items}
            />
        </>
    );
}
