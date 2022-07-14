import React, { useState, useEffect } from 'react'
import { Button, Input, Row, Col, Form, Carousel } from 'antd'
import {
    UserOutlined,
    LockOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons'
import { message } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'
import { actionTypes } from '@/reducers/user/index'
import axios from 'axios'
import randomName from '@/utils/nickname'
import './Login.less'

export const Login: React.FC = () => {
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()
    const { type } = queryString.parse(location.search)
    const isRegis = type == 'regis'

    const [form] = Form.useForm()

    const [captchaUrl, setCaptchaUrl] = useState<string>(
        '/rapi/user/getCaptcha?tt=1652668597423'
    )
    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 2000,
        autoplay: true,
    }
    useEffect(() => {
        window.$('.view1').jParticle({
            background: 'rgba(0,0,0,0)', //背景颜色
            color: '#fff', //粒子和连线的颜色
            particlesNumber: 100, //粒子数量
            //disableLinks:true,//禁止粒子间连线
            //disableMouse:true,//禁止粒子间连线(鼠标)
            particle: {
                minSize: 1, //最小粒子
                maxSize: 3, //最大粒子
                speed: 30, //粒子的动画速度
            },
        })
    }, [])

    useEffect(() => {
        form.resetFields()
    }, [isRegis])

    const regis = async (values: any) => {
        const result = await axios.post('/rapi/user/regis', {
            username: values.username,
            password: values.password,
            checkcode: values.checkcode,
            nickname: randomName.getNickName(),
        })
        if (result.data.code == 0) {
            message.success('注册成功，请登陆')
            history.push('/login')
        } else {
            message.error(result.data.message)
        }
    }

    const login = async (values: any) => {
        const result = await axios.post('/rapi/user/login', {
            username: values.username,
            password: values.password,
            checkcode: values.checkcode,
        })
        if (result.data.code == 0) {
            localStorage.setItem('token', result.data.data.access_token)

            dispatch({
                type: actionTypes.SET_USER,
                data: result.data.data.user,
            })
            history.push('/')
        } else {
            message.error(result.data.message)
        }
    }

    const onFinish = async (values: any) => {
        if (isRegis) {
            regis(values)
        } else {
            login(values)
        }
    }

    return (
        <div className="login-content">
            <div className="login-box">
                <div className="title">
                    {isRegis ? '用户注册' : '欢迎登陆-Report Monitor统计平台'}
                </div>
                <Row>
                    <Col span={24}>
                        <Form
                            form={form}
                            name="basic"
                            className="form"
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            onFinish={onFinish}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label=""
                                name="username"
                                rules={[
                                    { required: true, message: '请输入用户名' },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                    }
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label=""
                                name="password"
                                rules={[
                                    { required: true, message: '请输入密码' },
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined />}
                                />
                            </Form.Item>
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        label=""
                                        name="checkcode"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入验证码',
                                            },
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            prefix={
                                                <SafetyCertificateOutlined />
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <img
                                        src={captchaUrl}
                                        className="captcha-img"
                                        onClick={() => {
                                            setCaptchaUrl(
                                                captchaUrl.replace(
                                                    'tt=',
                                                    'tt=' + Date.now()
                                                )
                                            )
                                        }}
                                    ></img>
                                </Col>
                            </Row>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    width: '100%',
                                    backgroundColor: '#009688',
                                    borderColor: '#009688',
                                }}
                                size={'large'}
                            >
                                {isRegis ? '立即注册' : '立即登陆'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
                {!isRegis ? (
                    <div
                        className="regis-btn"
                        onClick={() => history.push('/login?type=regis')}
                    >
                        立即注册
                    </div>
                ) : null}
            </div>
            <Carousel className="carousel" {...settings}>
                <div>
                    <div
                        className="view view1"
                        style={{ height: window.innerHeight + 'px' }}
                    ></div>
                </div>
                <div>
                    <div
                        className="view view2"
                        style={{ height: window.innerHeight + 'px' }}
                    >
                        <div className="illusory">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </Carousel>
        </div>
    )
}
