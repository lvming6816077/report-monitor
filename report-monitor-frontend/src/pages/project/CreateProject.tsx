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
    Tabs,
} from 'antd'
import { message } from 'antd'
import axios from 'axios'
import './CreateProject.less'
import { Link, useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
export type TypeItem = {
    text: string
    value: string
}
const CreateProject: React.FC = () => {

    const history = useHistory()
    const location = useLocation()
    const { projectCode } = queryString.parse(location.search)

    const [typeList, setTypeList] = useState<TypeItem[]>([{ text: 'PC网页', value: 'PC' }, { text: '移动端', value: 'MOBILE' }])


    const [form] = Form.useForm()
    const [projectForm] = Form.useForm()

    useEffect(()=>{
        projectForm.setFieldsValue({
            code:projectCode
        })
    },[])

    const onFinish = async (values: any) => {
        const result = await axios.post('/rapi/project/create', {
            name: values.name,
            type: values.type,
            desc: values.desc
        })
        if (result.data.code == 0) {
            message.success('保存成功')
            window.location.href = '/'
        } else {
            message.error('保存失败')
        }
    }
    const onFinishProject = async (values: any) => {

        const result = await axios.post('/rapi/project/bind', {
            code:values.code
        })
        if (result.data.code == 0) {
            message.success('绑定成功')
            window.location.href = '/'
        } else {
            message.error('绑定失败')
        }
    }
    
    const onFinishFailed = () => { }


    const createjsx: JSX.Element = (<div>

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
    </div>)

    const bindjsx:JSX.Element = (<div>

        <Row justify="center" align="middle" gutter={[16, 24]}>
            <Col span={20}>
                <Form
                    form={projectForm}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinishProject}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="项目CODE"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: '请输入项目CODE',
                            },
                        ]}
                    >
                        <Input placeholder="请输入项目CODE" />
                    </Form.Item>


                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    </div>)

    return (
        <>
            <div className="create-project-content">
                <h2 style={{ textAlign: 'center', marginBottom: '30px' ,marginTop:'-60px'}}>项目初始化</h2>
                <Tabs>
                    <Tabs.TabPane tab="创建新项目" key="111" forceRender>
                        {createjsx}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="绑定已有项目" key="222" forceRender>
                        {bindjsx}
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </>
    )
}
export default CreateProject