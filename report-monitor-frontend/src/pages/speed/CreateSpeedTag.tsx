import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Select, Form, Input } from 'antd'
import { message } from 'antd'
import axios from 'axios'
import './CreateSpeedTag.less'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export const CreateSpeedTag: React.FC = () => {
    type Item = {
        code: string
        _id: string
        desc: string
    }

    const userInfo = useSelector((state: RootState) => state.user.userInfo)

    const [children, setChildren] = useState<Item[]>([])
    const [codes, setCodes] = useState<string[]>()
    const [chartList, setChartList] = useState<any[][]>()

    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        const result = await axios.post('/rapi/speed/createspeedtag', {
            projectId:userInfo.activePid,
            desc: values.desc,
        })
        if (result.data.code == 0) {
            message.success('保存成功')
            form.resetFields()
        }
    }
    const onFinishFailed = () => {}



    return (
        <>
            <div className="page-title">创建类目</div>
            <div className="create-content">
                <Row justify="center" align="middle">
                    <Col span={20}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="类目名称"
                                name="desc"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入类目名称',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入类目名称" />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    保存
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    )
}
