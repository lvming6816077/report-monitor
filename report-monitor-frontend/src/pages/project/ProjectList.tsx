import React, { useState, useEffect, useRef } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, Switch } from 'antd'
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import './ProjectList.less'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { PlusSquareOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { WarningType } from '@/pages/point/pointlist/WarningModal'
import { ProjectModal } from './ProjectModal'

export type DataType = {
    desc: string
    projectCode: string
    create: string
    _id: string
    name: string
}
export const ProjectList: React.FC = () => {
    
    const columns: ColumnsType<DataType> = [
        {
            title: '项目名称',
            dataIndex: 'name',
        },
        {
            title: '项目code',
            dataIndex: 'projectCode',
        },
        {
            title: '项目描述',
            dataIndex: 'desc',
        },
        {
            title: '项目类型',
            dataIndex: 'type',
        },
        {
            title: '创建时间',
            dataIndex: 'create',
            render: (v, item) =>
                moment(item.create).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (v, item) => {
                return <a onClick={() => edit(item)}>编辑</a>
            },
        },
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

    const edit = async (item: DataType) => {

        childRef.current.showModal(item)
    }
    const getList = async (params = {}, isReset = false) => {
        const p = isReset
            ? {
                  pageSize: 10,
                  pageStart: 1,
              }
            : page

        const result = await axios.get(
            '/rapi/project/getProjectsList?pageStart=' +
                p.pageStart +
                '&pageSize=' +
                p.pageSize,
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

    const [form] = Form.useForm()


    const childRef = useRef<any>()
    const updateCallback = () => {
        message.success('修改成功')
        resetList()
    }
    const resetList = () => {
        getList({}, true)
        form.resetFields()
    }

    return (
        <>
            <div className="page-title">项目管理</div>
            <div className="pointalllist-content">

                <div className="table-content">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={paginationProps}
                        rowKey={'code'}
                    />
                    ;
                </div>
                {contextHolder}
            </div>
            <ProjectModal
                onRef={childRef}
                updateCallback={updateCallback}
            ></ProjectModal>
        </>
    )
}
