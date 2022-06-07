import React, { useState, useEffect, useRef } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, Tag, Avatar, Alert } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { message } from 'antd';
import axios from 'axios'
import moment from 'moment';
import './UserInfo.less'
import { useHistory } from 'react-router-dom';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';



export const UserInfo: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const nickname = userInfo?.nickname || 'T'
    const shortUsername = nickname[0]


    const history = useHistory()

    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const result = await axios.post('/rapi/user/update', {
            ...values,
            userid:userInfo.userid
        });

        if (result.data.code == 0) {
            message.success('修改成功')
        }

    }

    const getData = () => {
        const fetchData = async () => {

            const result = await axios.get('/rapi/user/getUserById', {
                params:{
                    id:userInfo.userid
                }
            });


            const u = result.data.data

            form.setFieldsValue({
                ...u
            })

        }
        fetchData()

    }
    useEffect(  ()=>{
        getData()
    },[])

    return (
        <>
            <div className='page-title'>个人中心</div>
            <div className='userinfo-content'>
                <div style={{marginTop:20}}>
                    <Alert message="个人信息可能会在告警邮件中提示使用，请确保信息真实完整。" type="info" showIcon />
                </div>
                <div className='userinfo-inner'>

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
                            <Col span={20}><Form.Item
                                label="头像"
                            >
                                <Avatar className='avatar' size={'default'} >
                                    {shortUsername}
                                </Avatar>
                            </Form.Item></Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <Form.Item
                                    label="手机"
                                    name="phone"
                                    rules={[{ required: false, },{pattern:/^1[3456789]\d{9}$/,message:'请输入合法手机号'}]}

                                >
                                    <Input placeholder={'请输入手机号'} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <Form.Item
                                    label="邮箱"
                                    name="email"
                                    rules={[{ required: false, },{type:'email',message:'请输入合法邮箱号'}]}
                                >
                                    <Input placeholder={'请输入邮箱号'} />
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
