import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, List } from 'antd'
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import './LogList.less'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { PlusSquareOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'

type DataType = {
    str: string,
    create:string
}
export const LogList: React.FC = () => {


    const [dataSource, setDateSource] = useState<DataType[]>([])
    const history = useHistory()
    const [modal, contextHolder] = Modal.useModal()



    useEffect(() => {
        ; (async function fn() {
            await getList()
        })()
    }, [])


    const getList = async (params = {}, isReset = false) => {

        const result = await axios.get(
            '/rapi/log/list'
        )
        // console.log(result.data.data.map((i:DataType)=>i.str))
        setDateSource(result?.data?.data?.map((i:DataType)=>{
            return {
                str:i.str,
                create:moment(i.create).format('YYYY-MM-DD HH:mm:ss')
            }
        }))
    }

    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        getList(values)
    }

    const resetList = () => {
        getList({}, true)
        form.resetFields()
    }



    return (
        <>
            <div className="page-title">日志管理</div>
            <div className="loglist-content">
                <div className="query-content">
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row justify="center" align="middle">
                            <Col span={8}>
                                <Form.Item label="关键字" name="desc">
                                    <Input placeholder={'请输入关键字'} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit">
                                        搜索
                                    </Button>
                                    <Button
                                        onClick={resetList}
                                        style={{ marginLeft: 5 }}
                                    >
                                        重置
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <List
                    header={<div>日志列表：</div>}
                    // footer={<div>Footer</div>}
                    bordered
                    dataSource={dataSource}
                    renderItem={(item:DataType) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.create}
                                description={item.str}
                                />
                        </List.Item>
                    )}
                />

                {contextHolder}
            </div>
        </>
    )
}
