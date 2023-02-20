import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table } from 'antd'
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import './SpeedTagList.less'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { PlusSquareOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { RootState } from '@/store'

type DataType = {
    desc: string
    create: string
    _id: string
}
export const SpeedTagList: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const columns: ColumnsType<DataType> = [
        {
            title: '类目名称',
            dataIndex: 'desc',
        },
        {
            title: '类目code',
            dataIndex: 'code',
        },
        {
            title: '创建时间',
            dataIndex: 'create',
            render: (v) => moment(v).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (v, item) => {
                return <a onClick={() => deleteTag(item)}>删除</a>
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

    const deleteTag = async (item: any) => {
        modal.confirm({
            title: '确认删除?',
            onOk: async () => {
                const result = await axios.get(
                    '/rapi/speed/deleteTag/' + item._id
                )
                if (result.data.code == 0) {
                    message.success('删除成功')
                    resetList()
                }
            },
        })
    }
    const getList = async (params = {}, isReset = false) => {
        const p = isReset
            ? {
                  pageSize: 10,
                  pageStart: 1,
              }
            : page
        const result = await axios.get(
            '/rapi/speed/getTagsList?projectId='+userInfo.activePid+'&pageStart=' +
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

    const onFinish = async (values: any) => {
        getList(values)
    }

    const resetList = () => {
        getList({}, true)
        form.resetFields()
    }

    return (
        <>
            <div className="page-title">类目管理</div>
            <div className="taglist-content">
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
                                <Form.Item label="类目名称" name="desc">
                                    <Input placeholder={'请输入类目名称'} />
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
                                history.push('/speed/createspeedtag')
                            }}
                            style={{ marginLeft: 20 }}
                        >
                            创建类目
                        </Button>
                    </div>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={paginationProps}
                        rowKey={'_id'}
                    />
                </div>
                {contextHolder}
            </div>
        </>
    )
}
