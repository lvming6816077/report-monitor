import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Modal, Form, Input, DatePicker, List } from 'antd'
const { RangePicker } = DatePicker;
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import './LogList.less'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ChromeOutlined, IeOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { RootState } from '@/store'
import ReactJson from 'react-json-view'
import parser from 'ua-parser-js'
import { Env } from './Env'

type DataType = {
    str: string,
    create:string,
    ua:string,
    ip:string,
    meta:any
}
const LogList: React.FC = () => {


    const [dataSource, setDateSource] = useState<DataType[]>([])
    const history = useHistory()
    const [modal, contextHolder] = Modal.useModal()
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const [params,setParams] = useState({})
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'

    const [page, setPage] = useState<PageType>({
        pageStart: 1,
        pageSize: 10,
        total: 0,
    })

    useEffect(() => {
        ; (async function fn() {
            await getList({},true)
            setInitLoading(false);
        })()
    }, [])

    useEffect(() => {
        ; (async function fn() {
            await getList(params,page.pageSize == 1)
        })()
    }, [page.pageStart])


    const getList = async (params = {}, isReset = false) => {
        const p = isReset ? {
            pageSize: 10,
            pageStart:1
        } : {
            pageSize: page.pageSize,
            pageStart: page.pageStart,
        }
        setLoading(true);
        const result = await axios.get(
            '/rapi/log/list?projectId='+userInfo.activePid+'&pageStart=' +
                p.pageStart +
                '&pageSize=' +
                p.pageSize,
            {
                params: {
                    ...params,
                },
            }
        )
        let d = result?.data?.data?.docs.map((i:DataType)=>{
            return {
                ...i,
                create:moment(i.create).format(dateFormat),
                
            }
        })

        
        setDateSource((isReset ? [] : dataSource).concat(d))
        
        if (!result?.data?.data.hasNextPage) {
            setLoading(true);
        } else {
            setLoading(false);
        }
        
        if (isReset) {
            setPage({
                ...p,
            })
        } else {
            setPage({
                ...page,
            })
        }
    }

    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        if (values.time) {
            values.timeStart = values.time[0].format(dateFormat)
            values.timeEnd = values.time[1].format(dateFormat)
        }

        // console.log(values)
        setParams(values)
        await getList(values,true)
    }

    const resetList = async() => {

        getList({}, true)
        form.resetFields()
        setParams({})
        
    }
    const onLoadMore = ()=>{

        setPage({
            pageStart:(page.pageStart||0)+1,
            pageSize:page.pageSize
        })
        // getList(params)
    }

    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 42,
          lineHeight: '32px',
        }}
      >
        <a onClick={onLoadMore}>加载更多</a>
      </div>
    ) : null;
    



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
                            <Col span={7}>
                                <Form.Item label="关键字" name="keyword">
                                    <Input placeholder={'请输入关键字'} />
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item label="时间" name="time">
                                    <RangePicker showTime format={dateFormat}/>
                                </Form.Item>
                            </Col>
                            

                            <Col span={6}>
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
                    loading={initLoading}
                    loadMore={loadMore}
                    itemLayout={'vertical'}
                    bordered
                    dataSource={dataSource}
                    renderItem={(item:DataType) => (
                        <List.Item>
                            <List.Item.Meta title={item.create} ></List.Item.Meta>
                            <div><ReactJson src={JSON.parse(item.str)} collapsed={true} iconStyle={'square'} displayDataTypes={false} displayObjectSize={false}/></div>
                            <div className='env'><Env ua={item.ua} ip={item.ip} meta={item.meta}></Env></div>
                        </List.Item>
                    )}
                />

                {contextHolder}
            </div>
        </>
    )
}

export default LogList