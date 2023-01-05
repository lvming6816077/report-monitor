import React, { useState, useEffect, useRef } from 'react'
import {
    Button,
    Col,
    Row,
    Modal,
    Form,
    Input,
    Table,
    Tag,
    Avatar,
    Alert,
} from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import './UserInfo.less'
import { useHistory } from 'react-router-dom'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export const UserInfo: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const nickname = userInfo?.nickname || 'T'
    const shortUsername = nickname[0]

    const history = useHistory()

    const [form] = Form.useForm()
    const [formEmail] = Form.useForm()
    const [email, setEmail] = useState('')

    const onFinish = async (values: any) => {
        const result = await axios.post('/rapi/user/update', {
            ...values,
            userid: userInfo.userid,
        })

        if (result.data.code == 0) {
            message.success('修改成功')
        }
    }

    const getData = () => {
        const fetchData = async () => {
            const result = await axios.get('/rapi/user/getUserById', {
                params: {
                    id: userInfo.userid,
                },
            })

            const u = result.data.data

            form.setFieldsValue({
                ...u,
            })

            setEmail(u.email || null)
        }
        fetchData()
    }
    useEffect(() => {
        getData()
    }, [])

    const addEmail = () => {
        setIsModalVisible(true)
        clearInterval(activeTimer.current)
        setTime(60)
        setIsShowCode(false)
        formEmail.resetFields()
    }
    let activeTimer: any = useRef()
    const sendEmail = async () => {
        const fileds = await formEmail.validateFields(['email'])

        if (isShowCode) {
            // 倒计时未结束,不能重复点击
            return
        }

        const result = await axios.get('/rapi/user/sendEmailCode', {
            params: {
                email: fileds.email,
            },
        })

        if (result.data.code == 0) {
            message.success('发送成功')
            setIsShowCode(true)

            activeTimer.current = setInterval(() => {
                setTime((preSecond) => {
                    if (preSecond <= 1) {
                        setIsShowCode(false)
                        clearInterval(activeTimer.current)
                        // 重置秒数
                        return 60
                    }
                    return preSecond - 1
                })
            }, 1000)
        } else {
            message.error(result.data.message)
        }
    }

    const [isModalVisible, setIsModalVisible] = useState(false)

    const [isShowCode, setIsShowCode] = useState(false)
    const [time, setTime] = useState(60)

    const handleOk = async () => {
        const values = await formEmail.validateFields()
        const result = await axios.post('/rapi/user/updateEmail', {
            email: values.email,
            code: values.code,
        })

        if (result.data.code == 0) {
            message.success('绑定成功')
            getData()
        }

        handleCancel()
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        clearInterval(activeTimer.current)

        setIsShowCode(false)
        formEmail.resetFields()
    }

    return (
        <>
            <div className="page-title">个人中心</div>
            <div className="userinfo-content">
                <div style={{ marginTop: 20 }}>
                    <Alert
                        message="个人信息可能会在告警邮件中提示使用，请确保信息真实完整。"
                        type="info"
                        showIcon
                    />
                </div>
                <div className="userinfo-inner">
                    <Form
                        form={form}
                        name="basic"
                        labelAlign={'left'}
                        colon={false}
                        onFinish={onFinish}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 10 }}
                        autoComplete="off"
                    >
                        <Row>
                            <Col span={20}>
                                <Form.Item label="头像">
                                    <Avatar className="avatar" size={'default'}>
                                        {shortUsername}
                                    </Avatar>
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col span={20}>
                                <Form.Item
                                    label="手机"
                                    name="phone"
                                    rules={[{ required: false, }, { pattern: /^1[3456789]\d{9}$/, message: '请输入合法手机号' }]}

                                >
                                    <Input placeholder={'请输入手机号'} />
                                </Form.Item>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col span={20}>
                                <Form.Item
                                    label="昵称"
                                    name="nickname"
                                    rules={[{ required: false }]}
                                >
                                    <Input placeholder={'请输入昵称'} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <Form.Item label="邮箱" name="email">
                                    {email ? (
                                        <>
                                            {email}
                                            <a style={{ marginLeft: 20 }}>
                                                已绑定
                                            </a>
                                        </>
                                    ) : (
                                        <a onClick={addEmail}>点击绑定</a>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Row>
                    </Form>
                    <Modal
                        title="绑定邮箱"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Row justify="center" align="middle">
                            <Col span={20}>
                                <Form
                                    form={formEmail}
                                    name="basic"
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 16 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="邮箱账号"
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入合法邮箱号',
                                            },
                                            {
                                                type: 'email',
                                                message: '请输入合法邮箱号',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="请输入邮箱账号" />
                                    </Form.Item>
                                    <Form.Item
                                        label="验证码"
                                        name="code"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入验证码',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="请输入验证码"
                                            maxLength={6}
                                            suffix={
                                                <a onClick={() => sendEmail()}>
                                                    {isShowCode
                                                        ? `${time}秒后重新发送`
                                                        : '发送验证码'}
                                                </a>
                                            }
                                        />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default UserInfo