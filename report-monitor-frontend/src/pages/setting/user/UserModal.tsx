import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, Tag, Select } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { message } from 'antd';
import axios from 'axios'
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PlusSquareOutlined } from '@ant-design/icons';
import {DataType} from './UserList'


type Props = {
    code?: string;
    onRef?: any,
    updateCallback:()=>void
}

export const UserModal: React.FC<Props> = ({ updateCallback, onRef }) => {

    const history = useHistory()


    const [userid, setuserid] = useState<string>('')
    const [form] = Form.useForm();



    useImperativeHandle(onRef, () => ({
        showModal
    }));


    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (item:DataType) => {
        form.resetFields()
        setIsModalVisible(true);
        setuserid(item.userid);

        form.setFieldsValue({
            ...item,
            level:item.level?.map(d=>d.toString())
        })
    };

    const handleOk = async () => {
        const values = await form.validateFields()

        const result = await axios.post('/rapi/user/update', {
            ...values,
            username:null,
            userid
        });
        if (result.data.code == 0) {
            updateCallback()
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <>
            <Modal title="编辑用户" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Row justify="center" align="middle">
                    <Col span={20}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="用户账号"
                                name="username"
                                rules={[{ required: true, message: '请输入类目名称' }]}
                            >
                                <Input placeholder='' disabled/>
                            </Form.Item>
                            <Form.Item
                                label="用户昵称"
                                name="nickname"
                                rules={[{ required: false }]}
                            >
                                <Input placeholder='请输入用户昵称' />
                            </Form.Item>
                            <Form.Item 
                                label="用户权限"
                                name="level"
                                rules={[{ required: true, message: '请输入用户权限' }]}>

                                <Select mode="tags" >
                                    <Select.Option value={'0'}>管理员</Select.Option>
                                    <Select.Option value={'1'}>普通用户</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Col>

                </Row>
            </Modal>
        </>
    )
}


