import React, { useState, useEffect } from 'react'
import {
    Button,
    Col,
    Row,
    Select,
    Form,
    Input,
    Typography,
    Tooltip,
} from 'antd'
import { message } from 'antd'
import axios from 'axios'
import './CreateSpeed.less'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export const CreateSpeed: React.FC = () => {
    type Item = {
        code: string
        _id: string
        desc: string
    }
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    
    const [tagList, setTagList] = useState<Item[]>([])
    const [curPoint, setPoint] = useState<Item>()

    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        const result = await axios.post('/rapi/speed/create', {
            projectId:userInfo.activePid,
            desc: values.desc,
            tagId: values.tagId,
        })
        if (result.data.code == 0) {
            message.success('保存成功')
            setPoint(result.data.data)

            form.resetFields()
        } else {
            message.error('保存失败')
        }
    }
    const onFinishFailed = () => {}

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('/rapi/speed/getTags?projectId='+userInfo.activePid)
            setTagList(result.data.data)
        }
        fetchData()
    }, [])

    return (
        <>
            <div className="page-title">创建数据点</div>
            <div className="create-speed-content">
                <Row justify="center" align="middle">
                    <Col span={20}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            {tagList.length == 0 ? (
                                <div className="tips">
                                    还没有类目，先去
                                    <Link to={'/speed/createtag'}>创建</Link>?
                                </div>
                            ) : null}
                            <Form.Item
                                label="类目名称"
                                name="tagId"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择类目名称',
                                    },
                                ]}
                            >
                                <Select placeholder="请选择类目">
                                    {tagList.map((o) => {
                                        return (
                                            <Select.Option key={o._id}>
                                                {o.desc}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="测速点名称"
                                name="desc"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入测速点名称',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入测速点名称" />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    保存
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                {curPoint ? (
                    <div>
                        <div>上报地址：</div>
                        <pre className="pre">
                            https://
                            {window.location.host + '/rapi/report/createspeed?code='}
                            {curPoint.code}
                            {'&d=${dis}'}
                        </pre>
                    </div>
                ) : null}
            </div>
        </>
    )
}
