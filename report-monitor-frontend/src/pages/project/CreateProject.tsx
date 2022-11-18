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
import './CreateProject.less'
import { Link, useHistory } from 'react-router-dom'

export const CreateProject: React.FC = () => {
    type TypeItem = {
        text: string
        value: string
    }
    const history = useHistory()

    const [typeList, setTypeList] = useState<TypeItem[]>([{text:'PC网页',value:'PC'},{text:'移动端',value:'MOBILE'}])
    // const [curPoint, setPoint] = useState<Item>()

    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        const result = await axios.post('/rapi/project/create', {
            name: values.name,
            type: values.type,
            desc: values.desc
        })
        if (result.data.code == 0) {
            message.success('保存成功')
            history.push('/')
        } else {
            message.error('保存失败')
        }
    }
    const onFinishFailed = () => {}



    return (
        <>
            <div className="create-project-content">
                <h2 style={{textAlign:'center',marginBottom:'30px'}}>创建新项目</h2>
                <Row justify="center" align="middle" gutter={[16, 24]}>
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
                            <Form.Item
                                label="项目名称"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入项目名称',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入项目名称" />
                            </Form.Item>
                            <Form.Item
                                label="项目类型"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择项目类型',
                                    },
                                ]}
                            >
                                <Select placeholder="请选择类目">
                                    {typeList.map((o) => {
                                        return (
                                            <Select.Option key={o.value}>
                                                {o.text}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="项目描述"
                                name="desc"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入项目描述',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="请输入项目描述"
                                    style={{ height: 100 }}
                                    
                                />
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
