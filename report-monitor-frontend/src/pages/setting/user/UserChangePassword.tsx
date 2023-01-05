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
import './UserChangePassword.less'
import { useHistory } from 'react-router-dom'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'

const UserChangePassword: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)



    const history = useHistory()

    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const logout = () => {
        dispatch({ type: 'REMOVE_USER' })
        window.location.href = '/login'
    }

    const onFinish = async (values: any) => {
        const result = await axios.post('/rapi/user/updatePass', {
            ...values,
        })

        if (result.data.code == 0) {
            message.success('修改成功')
            logout()
        }
    }



    return (
        <>
            <div className="page-title">修改密码</div>
            <div className="userinfo-content-pass">

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
                                <Form.Item
                                    label="旧密码"
                                    name="oldpassword"
                                    rules={[{ required: true }]}
                                >
                                    <Input.Password placeholder={'请输入旧密码'} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <Form.Item
                                    label="新密码"
                                    name="newpassword"
                                    rules={[{ required: true }]}
                                >
                                    <Input.Password placeholder={'请输入新密码'} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Row>
                    </Form>
                </div>
            </div>
        </>
    )
}
export default UserChangePassword