import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table } from 'antd'
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'

import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { PlusSquareOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { RootState } from '@/store'

type DataType = {
    desc?: string
    create?: string
    city?:string
    ip?:string
    province?:string
    _id: string
}
type Props = {
    timeEnd: string
    timeStart: string
    code:string
}
export const DetailTable: React.FC<Props> = React.memo(({ timeEnd, timeStart,code}) => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const columns: ColumnsType<DataType> = [

        {
            title: '创建时间',
            dataIndex: 'create',
            render: (v) => moment(v).format('YYYY-MM-DD HH:mm:ss'),

        },

        {
            title: '城市-地区',
            dataIndex: 'code',
            render: (v,r) => r.city ? r.province+'-'+r.city :'',
            width:120
        },
        {
            title: '浏览器',
            dataIndex: 'browser',
        },
        {
            title: '操作系统',
            dataIndex: 'os',
        },
        {
            title: 'ip',
            dataIndex: 'ip',
        },
        {
            title: 'ua',
            dataIndex: 'ua',
        },
        {
            title: '其他数据',
            dataIndex: 'meta',
            render: (v,r) => JSON.stringify(v),
        },
        // {
        //     title: '操作',
        //     dataIndex: 'action',
        //     render: (v, item) => {
        //         return <a onClick={() => deleteTag(item)}>删除</a>
        //     },
        // },
    ]

    const [dataSource, setDateSource] = useState<[]>([])
    const history = useHistory()
    const [modal, contextHolder] = Modal.useModal()

    const [page, setPage] = useState<PageType>({
        pageStart: 1,
        pageSize: 10,
        total: 0,
    })

    const paginationProps = {
        current: page.pageStart, //当前页码
        pageSize: page.pageSize, // 每页数据条数
        total: page.total, // 总条数
        onChange: (current: any, pageSize: any) => {
            setPage({
                ...page,
                pageStart: current,
                pageSize: pageSize,
            })
        }, //改变页码的函数
        hideOnSinglePage: false,
        showSizeChanger: false,
    }

    useEffect(() => {
        ;(async function fn() {
            await getList()
        })()
    }, [page.pageSize, page.pageStart])


    const getList = async (params = {}, isReset = false) => {
        const p = isReset
            ? {
                  pageSize: 10,
                  pageStart: 1,
              }
            : page
        const result = await axios.get(
            '/rapi/report/getReportsByPage?pointCode='+code+'&projectId='+userInfo.activePid+'&pageStart=' +
                p.pageStart +
                '&pageSize=' +
                p.pageSize +
                '&timeStart=' +
                timeStart +
                '&timeEnd='+
                timeEnd,
            {
                params: {
                    ...params,
                },
            }
        )
        if (isReset) {
            setPage({
                ...p,
                total: result.data.data.totalDocs,
            })
        } else {
            setPage({
                ...page,
                total: result.data.data.totalDocs,
            })
        }
        setDateSource(result.data.data.docs)
    }

    const resetList = () => {
        getList({}, true)
    }
    useEffect(()=>{
        resetList()
    },[timeEnd,timeStart])


    return (
        <>
            <div className="table-content">
                <Table
                    size={'small'}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={paginationProps}
                    rowKey={'_id'}
                    scroll={{x:1300}}
                />
            </div>
        </>
    )
})
