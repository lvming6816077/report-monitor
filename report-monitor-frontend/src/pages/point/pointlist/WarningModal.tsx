import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, Tag, Select, Switch, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { message } from 'antd';
import axios from 'axios'
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PlusSquareOutlined, RedoOutlined } from '@ant-design/icons';
import { DataType } from './PointList'

export type WarningType  = {
    max: number;
    min:number;
    isOpen:boolean;
    message: string;
    create:string;
    _id:string;
}

type Props = {
    code?: string;
    onRef?: any,
    updateCallback: () => void
}

export const WarningModal: React.FC<Props> = ({ updateCallback, onRef }) => {

    const history = useHistory()


    const [pointid, setpointid] = useState<string>('')
    const [warningid, setwarningid] = useState<string>('')
    const [form] = Form.useForm();



    useImperativeHandle(onRef, () => ({
        showModal
    }));


    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (item: DataType) => {
        form.resetFields()
        setIsModalVisible(true);
        setpointid(item._id);
        setwarningid(item.warning._id)

        form.setFieldsValue({
            ...item.warning,
            isOpen:item.warning.isOpen
        })
    };

    const handleOk = async () => {
        const values = await form.validateFields()

        const result = await axios.post('/rapi/warning/addWarningSet', {
            ...values,
            pointId: pointid
        });
        if (result.data.code == 0) {
            updateCallback()
        }
        setIsModalVisible(false);
    };

    const resetCount = async ()=>{
        const result = await axios.get('/rapi/warning/resetWarningCount', {
            params:{
                id:warningid
            }
        });

        if (result.data.code == 0) {
            message.success('操作成功')
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <>
            <Modal title="告警设置" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Row justify="center" align="middle">
                    <Col span={24}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Form.Item label="是否开启" name="isOpen" valuePropName="checked" rules={[{ required: true, message: '请选择' }]}>
                                <Switch />
                            </Form.Item>
                            <Form.Item
                                label="最大触发次数"
                                name="triggerMax"
                                
                                rules={[{ required: true,message: '请输入最大触发次数'  }]}
                            >
                                <InputNumber placeholder='最大触发次数' min={1} disabled={true} />
                            </Form.Item>
                            <Form.Item
                                label="清零触发次数"
                                name="triggerCount"
                                rules={[{ required: false, }]}
                            >
                                <RedoOutlined style={{fontSize:18,cursor:'pointer'}} onClick={resetCount}/>
                            </Form.Item>
                            <Form.Item
                                label="监控间隔"
                                name="interval"
                                
                                rules={[{ required: true, message: '请输入监控间隔' }]}
                            >
                                <InputNumber min={1} max={60} addonAfter="分钟"/>
                            </Form.Item>
                            <Form.Item
                                label="最大值"
                                name="max"
                                rules={[{ required: false }]}
                            >
                                <InputNumber placeholder='最大值' min={1} />
                            </Form.Item>
                            <Form.Item
                                label="最小值"
                                name="min"
                                rules={[{ required: false }]}
                            >
                                <InputNumber placeholder='最小值' min={1} />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="告警文案"
                                rules={[{ required: true, message: '请输入告警文案' }]}
                            >
                                <Input.TextArea showCount maxLength={100} />
                            </Form.Item>

                        </Form>
                    </Col>

                </Row>
            </Modal>
        </>
    )
}


