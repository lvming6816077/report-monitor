import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, Switch } from 'antd';
import { message } from 'antd';
import axios from 'axios'
import moment from 'moment';
import './PointAllList.less'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PlusSquareOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import { WarningType } from '@/pages/point/pointlist/WarningModal';

type DataType  = {
    desc: string;
    code: string;
    create:string;
    _id:string;
    isBlock:boolean;
    warning?:WarningType
}
export const PointAllList: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '数据点名称',
            dataIndex: 'desc',
        },
        {
            title: '数据点code',
            dataIndex: 'code',
        },
        {
            title: '所属类目',
            dataIndex: ['tag', 'desc'],
        },
        {
            title: '创建时间',
            dataIndex: 'create',
            render: (v,item) => moment(item.create).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '是否禁用',
            dataIndex: 'isBlock',
            render: (v,item) => <Switch defaultChecked={item.isBlock} onChange={()=>onChange(item)} />
        },
        // {
        //     title: '是否开启告警',
        //     dataIndex: ['warning', 'isOpen'],
        //     render: (v,item) => <Switch defaultChecked={item?.warning?.isOpen} onChange={()=>onChangeWarning(item)} />
        // },
        {
            title: '操作',
            dataIndex: 'action',
            render: (v, item) => {
                return <a onClick={() => deletePoint(item)}>删除</a>
            }
        },
    ]

    const onChange = async (item:DataType)=>{
        const result = await axios.post('/rapi/point/updatePoint/',{
            _id:item._id,
            isBlock:!item.isBlock
        });
        if (result.data.code == 0) {
            message.success('操作成功')
            // resetList()

        }
    }

    const onChangeWarning = async (item:DataType)=>{
        const result = await axios.post('/rapi/warning/updatePoint/',{
            _id:item?.warning?._id
        });
        if (result.data.code == 0) {
            message.success('操作成功')

        }
    }

    
    const [dataSource, setDateSource] = useState<[]>([])
    const history = useHistory()
    const [modal, contextHolder] = Modal.useModal();

    const [page, setPage] = useState<PageType>({
        pageStart: 1,
        pageSize: 10,
        total: 0
    })

    const paginationProps = {
        current: page.pageStart, //当前页码
        pageSize: page.pageSize, // 每页数据条数
        total: page.total, // 总条数
        onChange: (current: any, pageSize: any) => {
            setPage({
                ...page,
                pageStart: current,
                pageSize: pageSize,
            })
        }, //改变页码的函数
        hideOnSinglePage: false,
        showSizeChanger: false,
    };

    useEffect(() => {
        (async function fn() {
            await getList();
        })()
    }, [page.pageSize, page.pageStart])

    const deletePoint = async (item: any) => {
        modal.confirm({
            title: '确认删除?',
            onOk: async () => {
                const result = await axios.get('/rapi/point/deletePoint/' + item._id);
                if (result.data.code == 0) {
                    message.success('删除成功')
                    resetList()

                }
            }
        })

    }
    const getList = async (params = {},isReset = false) => {
        

        const p = isReset ? {
            pageSize: 10,
            pageStart: 1,
        } : page


        const result = await axios.get('/rapi/point/getPointsAllList?pageStart=' + p.pageStart + '&pageSize=' + p.pageSize, {
            params: {
                ...params
            }
        });
        if (isReset) {
            setPage({
                ...p,
                total: result.data.data.totalDocs
            })
        } else {
            setPage({
                ...page,
                total: result.data.data.totalDocs
            })
        }
        
        setDateSource(result.data.data.docs)
    }

    const [form] = Form.useForm();


    const onFinish = async (values: any) => {

        getList(values)
    }

    const resetList = () => {

        getList({},true)
        form.resetFields();
    }


    return (
        <>
            <div className='page-title'>数据点管理</div>
            <div className='pointalllist-content'>
                <div className='query-content'>
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
                                <Form.Item
                                    label="数据点名称"
                                    name="desc"
                                >
                                    <Input placeholder={'请输入数据点名称'} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="数据code"
                                    name="code"
                                >
                                    <Input placeholder={'请输入数据code'} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit">
                                        搜索
                                    </Button>
                                    <Button onClick={resetList} style={{ marginLeft: 5 }}>
                                        重置
                                    </Button>
                                </Form.Item>
                            </Col>


                        </Row>
                    </Form>
                </div>
                <div className='table-content'>

                    
                    <Table dataSource={dataSource} columns={columns} pagination={paginationProps} rowKey={'code'} />;
                </div>
                {contextHolder}

            </div>
        </>
    )
}
