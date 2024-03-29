import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import './UserList.less'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { PlusSquareOutlined } from '@ant-design/icons'
import { UserModal } from './UserModal'
import { useDebounce, useScreen, useScroll, useThrottle } from '@/utils/hooks'

const roleMap = {
    '1': '普通用户',
    '0': '管理员',
}
export type DataType = {
    username: string
    nickname: string
    level: number[]
    _id: string
    userid: string
}
const UserList: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '用户账号',
            dataIndex: 'username',
        },
        {
            title: '用户昵称',
            dataIndex: 'nickname',
        },
        {
            title: '用户权限',
            dataIndex: 'level',
            render: (v: []) => {
                return v?.map((i) => <Tag key={i}>{roleMap[i]}</Tag>)
            },
        },
        {
            title: '用户邮箱',
            dataIndex: 'email',
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
                return <a onClick={() => updateUser(item)}>编辑</a>
            },
        },
    ]

    const [dataSource, setDateSource] = useState<[]>([])
    const history = useHistory()

    const [page, setPage] = useState<PageType>({
        pageStart: 1,
        pageSize: 20,
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

    const updateUser = async (item: DataType) => {
        childRef.current.showModal(item)
    }
    const getList = async (params = {}, isReset = false) => {
        const p = isReset
            ? {
                  pageSize: 20,
                  pageStart: 1,
              }
            : page
        const result = await axios.get(
            '/rapi/user/getUsersList?pageStart=' +
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

    const childRef = useRef<any>()
    const updateCallback = () => {
        message.success('修改成功')
        resetList()
    }

    const [value, setValue] = useState<string>('')
    const debouncedValue = useDebounce<string>(value, 500)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    useEffect(() => {}, [debouncedValue])

    const screen = useScreen()

    // useEffect(()=>{
    //     console.log(screen?.width)
    // },[screen])

    const scrollTop = useScroll()

    const throttleValue = useThrottle<number>(scrollTop, 500)

    // useEffect(()=>{
    //     console.log(throttleValue)
    // },[throttleValue])

    useEffect(() => {
        console.log(scrollTop)
    }, [scrollTop])

    return (
        <>
            <div className="page-title">用户管理</div>
            <div className="userlist-content">
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
                                <Form.Item label="用户账号" name="username">
                                    <Input placeholder={'请输入用户账号'} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="用户昵称" name="nickname">
                                    <Input
                                        placeholder={'请输入用户账号'}
                                        onChange={handleChange}
                                    />
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
                    <UserModal
                        onRef={childRef}
                        updateCallback={updateCallback}
                    ></UserModal>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={paginationProps}
                        rowKey={'_id'}
                    />
                </div>
            </div>
        </>
    )
}
export default UserList