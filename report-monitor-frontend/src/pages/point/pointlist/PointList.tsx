import React, { useState, useEffect, useRef } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, Space } from 'antd'
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import './PointList.less'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { PlusSquareOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { WarningModal, WarningType } from './WarningModal'
import { RootState } from '@/store'

export type DataType = {
    desc: string
    code: string
    create: string
    warning: WarningType
    _id: string
}
export const PointList: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const columns: ColumnsType<DataType> = [
        {
            title: '数据点名称',
            dataIndex: 'desc',
        },
        {
            title: '数据点code',
            dataIndex: 'code',
        },
        {
            title: '所属类目',
            dataIndex: ['tag', 'desc'],
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
                return (
                    <Space>
                        <a onClick={()=>history.push('/point/pointdetail?code='+(item.code||''))}>查看</a>
                        <a onClick={() => deletePoint(item)}>删除</a>{' '}
                        <a onClick={() => warningPoint(item)}>告警规则</a>
                    </Space>
                )
            },
        },
    ]

    const [dataSource, setDateSource] = useState<[]>([])
    const history = useHistory()
    const [modal, contextHolder] = Modal.useModal()
    const [loading, setLoading] = useState(false)

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

    const deletePoint = async (item: DataType) => {
        modal.confirm({
            title: '确认删除?',
            content: '删除该数据点会一并删除相关上报数据和告警设置',
            onOk: async () => {
                const result = await axios.get(
                    '/rapi/point/deletePoint/' + item._id
                )
                if (result.data.code == 0) {
                    message.success('删除成功')
                    resetList()
                }
            },
        })
    }

    const childRef = useRef<any>()
    const updateCallback = () => {
        message.success('修改成功')
        resetList()
    }

    const warningPoint = async (item: DataType) => {
        childRef.current.showModal(item)
    }
    const getList = async (params = {}, isReset = false) => {
        setLoading(true)
        const p = isReset
            ? {
                  pageSize: 10,
                  pageStart: 1,
              }
            : page
        const result = await axios.get(
            '/rapi/point/getPointsList?projectId='+userInfo.activePid+'&pageStart=' +
                p.pageStart +
                '&pageSize=' +
                p.pageSize,
            {
                params: {
                    ...params,
                },
            }
        )
        setLoading(false)
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

    const onFinish = async (values: any) => {
        getList(values)
    }

    const resetList = () => {
        getList({}, true)
        form.resetFields()
    }

    return (
        <>
            <div className="page-title">数据点管理</div>
            <div className="point-content">
                <div className="query-content">
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row justify="center" align="middle">
                            <Col span={8}>
                                <Form.Item label="数据点名称" name="desc">
                                    <Input placeholder={'请输入数据点名称'} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="数据code" name="code">
                                    <Input placeholder={'请输入数据code'} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit">
                                        搜索
                                    </Button>
                                    <Button
                                        onClick={resetList}
                                        style={{ marginLeft: 5 }}
                                    >
                                        重置
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="table-content">
                    <div className="btn-content">
                        <Button
                            type="primary"
                            icon={<PlusSquareOutlined />}
                            onClick={() => {
                                history.push('/point/createpoint')
                            }}
                        >
                            创建数据点
                        </Button>

                        <Button
                            type="primary"
                            icon={<PlusSquareOutlined />}
                            onClick={() => {
                                history.push('/point/createtag')
                            }}
                            style={{ marginLeft: 20 }}
                        >
                            创建类目
                        </Button>
                        <pre className="tips">
                            上报地址：https://
                            {window.location.host +
                                '/rapi/report/create?code=xxxx'}
                        </pre>
                    </div>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={paginationProps}
                        rowKey={'code'}
                        loading={loading}
                    />
                </div>
                <WarningModal
                    onRef={childRef}
                    updateCallback={updateCallback}
                ></WarningModal>
                {contextHolder}
            </div>
        </>
    )
}
