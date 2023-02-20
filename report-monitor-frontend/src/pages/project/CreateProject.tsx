import React, { useState, useEffect } from 'react'
import {
    Button,
    Col,
    Row,
    Select,
    Form,
    Input,
    Typography,
    Modal,
    Tabs,
    Space,
    Popconfirm,
} from 'antd'
import { message } from 'antd'
import axios from 'axios'
import './CreateProject.less'
import { Link, useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { ExclamationCircleFilled } from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux'


import { SET_USER } from '@/reducers/user/actionTypes'
import { RootState } from '@/store'


export type TypeItem = {
    text: string
    value: string
}
const CreateProject: React.FC = () => {

    const dispatch = useDispatch()
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const location = useLocation()
    const { projectCode, bindFlag,projectId } = queryString.parse(location.search)
    const [ptype, setPType] = useState('PC')
    const [activeKey, setActiveKey] = useState('111')
    const [modal, contextHolder] = Modal.useModal();

    const [typeList, setTypeList] = useState<TypeItem[]>([{ text: 'PC网页', value: 'PC' }, { text: '移动端', value: 'MOBILE' }])


    const [form] = Form.useForm()
    const [projectForm] = Form.useForm()

    useEffect(() => {
        (async function c(){
            if (bindFlag) {
                setActiveKey('222')
            } else {
                setActiveKey('111')
            }
            let _projectCode = projectCode
            if (projectId) {
                const ret = await axios.get('/rapi/project/getProjectDetail', {
                    params:{id: projectId},
                })
                _projectCode = ret.data.data.projectCode
            }
            projectForm.setFieldsValue({
                code: _projectCode
            })
        })()
        
    }, [])

    const onFinish = async (values: any) => {
        const result = await axios.post('/rapi/project/create', {
            ...values
        })
        dispatch({
            type: SET_USER,
            data: {
                ...userInfo,
                activePid: result.data.data._id
            },
        })
        if (result.data.code == 0) {
            message.success('保存成功')
            window.location.href = '/'
        } else {
            message.error('保存失败')
        }
    }
    const onValuesChange = (changedValues: any) => {
        if (changedValues.type) {
            setPType(changedValues.type)
        }
    }
    
    const onFinishProject =  (values: any) => {
        
        modal.confirm({
            title: '是否确认操作?',
            icon: <ExclamationCircleFilled />,
            // content: '是否确认操作',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: async ()=> {
                let result = null
                if (bindFlag == 'unbind') {
                    result = await axios.post('/rapi/project/unbind', {
                        code: values.code
                    })
                } else {
                    result = await axios.post('/rapi/project/bind', {
                        code: values.code
                    })
                }
                

                dispatch({
                    type: SET_USER,
                    data: {
                        ...userInfo,
                        activePid: result.data.data
                    },
                })

                // return
                
                if (result.data.code == 0) {
                    message.success('操作成功')
                    window.location.href = '/'
                } else {
                    message.error('操作失败')
                }
            },
            onCancel() {

            },
        });

    }

    const onFinishFailed = () => { }


    const createjsx: JSX.Element = (<div>

        <Row justify="center" align="middle" gutter={[16, 24]}>
            <Col span={20}>
                <Form
                    form={form}
                    onValuesChange={onValuesChange}
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
                    {ptype == 'PC' ?
                        <Form.Item
                            label="项目域名"
                            name="host"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入项目域名',
                                },
                            ]}
                        >
                            <Input placeholder="格式：www.xxx.com" />
                        </Form.Item>
                        : null}
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

    const bindjsx: JSX.Element = (<div>

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
                        <Space>
                            {bindFlag == 'unbind' ? <Button type="primary" htmlType="submit" danger>
                                解绑项目
                            </Button> : 
                            <Button type="primary" htmlType="submit" >
                                绑定
                            </Button>
                            }

                        </Space>
                    </Form.Item>
                </Form>
            </Col>
            {contextHolder}
        </Row>
    </div>)

    return (
        <>
            <div className="create-project-content">
                <h2 className='title'>项目初始化</h2>
                <Tabs activeKey={activeKey} onChange={(k)=>setActiveKey(k)}>
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