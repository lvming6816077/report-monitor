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

export type WarningType = {
    max: number;
    min: number;
    isOpen: boolean;
    message: string;
    create: string;
    interval: number;
    _id: string;
}

type Props = {
    code?: string;
    onRef?: any,
    updateCallback: () => void
}

export const WarningModal: React.FC<Props> = ({ updateCallback, onRef }) => {

    const history = useHistory()


    const [curItem, setCurItem] = useState<DataType>()
    const [form] = Form.useForm();



    useImperativeHandle(onRef, () => ({
        showModal
    }));


    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (item: DataType) => {
        form.resetFields()
        setIsModalVisible(true);

        setCurItem(item)

        form.setFieldsValue({
            ...item.warning,
            isOpen: item.warning.isOpen
        })


    };

    // useEffect(() => {
    //     form.setFieldsValue({
    //     })
    // }, [])

    // 初次触发
    useEffect(() => {
        if (curItem) {
            changeV(curItem?.warning.interval, 'interval')
            changeV(curItem?.warning.max, 'max')
            changeV(curItem?.warning.min, 'min')
        }
    }, [curItem])

    const handleOk = async () => {
        const values = await form.validateFields()

        const result = await axios.post('/rapi/warning/addWarningSet', {
            ...values,
            pointId: curItem?._id
        });
        if (result.data.code == 0) {
            updateCallback()
        }
        setIsModalVisible(false);
    };

    const resetCount = async () => {
        const result = await axios.get('/rapi/warning/resetWarningCount', {
            params: {
                id: curItem?.warning?._id
            }
        });

        if (result.data.code == 0) {
            message.success('操作成功')
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    let intervalStr = '', maxStr = '', minStr = ''
    const changeV = (v: any, type: any) => {


        if (type == 'interval' && v) {
            intervalStr = '【' + curItem?.code + '】【' + curItem?.desc + '】在时间间隔' + v + '分钟内，触发了'
        }
        if (type == 'max' && v) {
            maxStr = '，最大值：' + v + '的监控告警'
        }

        if (type == 'min' && v) {
            minStr = '，最小值：' + v + '的监控告警'
        }

        let message = ''

        if (!intervalStr) {
            message = ''
        } else {
            message = intervalStr + maxStr + minStr + '。'
        }

        form.setFieldsValue({
            message
        })
    }

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
                            {/* <Form.Item
                                label="最大触发次数"
                                name="triggerMax"

                                rules={[{ required: true, message: '请输入最大触发次数' }]}
                            >
                                <InputNumber placeholder='最大触发次数' min={1} disabled={true} />
                            </Form.Item> */}
                            {/* <Form.Item
                                label="清零触发次数"
                                name="triggerCount"
                                rules={[{ required: false, }]}
                            >
                                <RedoOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={resetCount} />
                            </Form.Item> */}
                            <Form.Item
                                label="监控间隔"
                                name="interval"

                                rules={[{ required: true, message: '请输入监控间隔' }]}
                            >
                                <InputNumber min={1} max={60} addonAfter="分钟" onChange={(v) => changeV(v, 'interval')} />
                            </Form.Item>
                            <Form.Item
                                label="最大值"
                                name="max"
                                rules={[{ required: false }]}
                            >
                                <InputNumber placeholder='最大值' min={1} onChange={(v) => changeV(v, 'max')} />
                            </Form.Item>
                            <Form.Item
                                label="最小值"
                                name="min"
                                rules={[{ required: false }]}
                            >
                                <InputNumber placeholder='最小值' min={1} onChange={(v) => changeV(v, 'min')} />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="告警文案"
                                rules={[{ required: true, message: '请输入告警文案' }]}
                            >
                                <Input.TextArea showCount maxLength={100} style={{ height: 100 }} disabled />
                            </Form.Item>

                        </Form>
                    </Col>

                </Row>
            </Modal>
        </>
    )
}


