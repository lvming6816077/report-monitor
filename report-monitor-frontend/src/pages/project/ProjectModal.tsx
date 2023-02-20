import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, Tag, Select } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { PlusSquareOutlined } from '@ant-design/icons'
import { DataType } from './ProjectList'
import { TypeItem } from './CreateProject'


type Props = {
    code?: string
    onRef?: any
    updateCallback: () => void
}

export const ProjectModal: React.FC<Props> = ({ updateCallback, onRef }) => {
    const history = useHistory()
    const [ptype,setPType] = useState('PC')


    const [form] = Form.useForm()
    const [projectid,setProjectid] = useState<string>('')
    const [typeList, setTypeList] = useState<TypeItem[]>([{ text: 'PC网页', value: 'PC' }, { text: '移动端', value: 'MOBILE' }])

    useImperativeHandle(onRef, () => ({
        showModal,
    }))

    const [isModalVisible, setIsModalVisible] = useState(false)

    const showModal = (item: DataType) => {
        form.resetFields()
        setIsModalVisible(true)
        setProjectid(item._id)

        form.setFieldsValue({
            ...item,
        })
    }
    const onValuesChange = (changedValues:any)=>{
        if (changedValues.type) {
            setPType(changedValues.type)
        }
    }

    const handleOk = async () => {
        const values = await form.validateFields()

        const result = await axios.post('/rapi/project/update', {
            ...values,
            projectid:projectid
        })
        if (result.data.code == 0) {
            updateCallback()
        }
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    return (
        <>
            <Modal
                title="编辑项目"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Row justify="center" align="middle">
                    <Col span={20}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                            onValuesChange={onValuesChange}
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
                                <Input placeholder=""  />
                            </Form.Item>
                            <Form.Item
                                label="项目描述"
                                name="desc"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="请输入项目描述" />
                            </Form.Item>
                            <Form.Item
                                label="项目code"
                                name="projectCode"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="请输入项目code" disabled/>
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
                            :null}
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
                        </Form>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}
