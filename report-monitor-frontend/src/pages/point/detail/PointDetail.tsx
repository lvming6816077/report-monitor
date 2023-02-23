import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, DatePicker, Card, Statistic, Radio, RadioChangeEvent, Space } from 'antd'
const { RangePicker } = DatePicker;
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import './PointDetail.less'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { PlusSquareOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import queryString from 'query-string'
import { RootState } from '@/store'
import { DetailTable } from './DetailTable';
import { DetailMap } from './DetailMap';
import { ChartDataItem } from '@/pages/home/citem/CItem';
import { tranNumber } from '@/utils/num.js'


const PointDetail: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)

    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    const history = useHistory()
    const [modal, contextHolder] = Modal.useModal()
    const [timeStart, setTimeStart] = useState(moment().startOf('day').format(dateFormat))
    const [timeEnd, setTimeEnd] = useState(moment().endOf('day').format(dateFormat))
    const [total,setTotal] = useState<string>('0')
    const [uv,setUv] = useState<string>('0')
    const [title,setTitle] = useState<string>('')
    const [unit,setUnit] = useState<string>('h')

    const [form] = Form.useForm()

    const location = useLocation()

    const { code } = queryString.parse(location.search)

    const onFinish = async (values: any) => {
        if (values.time && values.time.length) {
            setTimeStart(values.time[0].format(dateFormat))
        }
        if (values.time && values.time.length) {
            setTimeEnd(values.time[1].format(dateFormat))
        }
    }

    const resetList = () => {

        form.resetFields()
    }
    const initChart = (today_data: ChartDataItem[],yes_data: ChartDataItem[]) => {
        const xAxis = today_data.map((i: ChartDataItem) => {
            return i.time
        })
        const yAxisToday = today_data
            .filter((i: ChartDataItem) => {
                return moment().isAfter(moment(i.time))
            })
            .map((i: ChartDataItem) => {
                return i.total
            })
        const yAxisYestoday = yes_data
            .filter((i: ChartDataItem) => {
                return moment().isAfter(moment(i.time))
            })
            .map((i: ChartDataItem) => {
                return i.total
            })

        const option = {
            legend: {
                data: ['昨日次数', '今日次数',]
            },
            tooltip: {
                trigger: 'axis',
                position: function (pt: any[]) {
                    return [pt[0], '10%']
                },
            },
            title: {
                left: 'center',
                // text: desc + '(' + code + ')'
            },
            // toolbox: {
            //     feature: {
            //         dataZoom: {
            //             yAxisIndex: 'none'
            //         },
            //         restore: {},
            //         saveAsImage: {}
            //     }
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis,
                // axisLabel: {
                //     formatter: (v:string)=>{
                //         return v.split(' ')[1]
                //     },
                // }
            },
            yAxis: {
                splitLine :{    //网格线
                    lineStyle:{
                        type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
                    },
                    show:true //隐藏或显示
                },
                type: 'value',
                boundaryGap: [0, '100%'],
                axisLabel: {
                    formatter: (v: string) => {
                        return tranNumber(v, 2)
                    },
                },
            },

            series: [
                {
                    name: '今日次数',
                    type: 'line',
                    // smooth:true,
                    showSymbol: false,
                    itemStyle: {
                        color: '#088f81',
                    },

                    data: yAxisToday,
                },
                {
                    name: '昨日次数',
                    type: 'line',
                    showSymbol: false,
                    itemStyle: {
                        color: '#FF9800',
                    },

                    data: yAxisYestoday,
                },
            ],
        }

        const chartmei = (window as any).echarts.init(
            document.getElementById(code as string)
        )
        chartmei.setOption(option)
    }
    const searchChart = async () => {

        const result1 = await axios.post('/rapi/report/getReportsGroup', {
            
            start: timeStart,
            end: timeEnd,
            code: code,
            unit:unit
        })
        const result2 = await axios.post('/rapi/report/getReportsGroup', {
            
            start: moment(timeStart).subtract(1, 'days').startOf('day'),
            end: moment(timeEnd).subtract(1, 'days').endOf('day'),
            code: code,
            unit:unit
        })
        const today:ChartDataItem[] = result1.data.data
        const yestoday:ChartDataItem[] = result2.data.data

        initChart(today,yestoday)

        let t = today.reduce((prev,cur)=>{
            return prev+cur.total
        },0)
        setTotal(t.toString())

    }
    const setFastTime = (t:string)=>{
        // 前一天
        if (t == 'd') {
            form.setFieldsValue({time:[
                moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')
            ]})
        }
        // 前一周
        if (t == 'w') {
            form.setFieldsValue({time:[
                moment().subtract(7, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')
            ]})
        }
        // 当天
        if (t == 't') {
            form.setFieldsValue({time:[
                moment().startOf('day'), moment().endOf('day')
            ]})
        }

        onFinish(form.getFieldsValue())
        
    }
    const searchCount = async () => {
        const result = await axios.get('/rapi/report/getReportsByCount?timeStart='+timeStart+'&timeEnd='+timeEnd, {
            params:{
                pointCode: code,
            },
        })
        setUv(result?.data?.data?.length)
    }

    const searchDetail = async () => {
        const result = await axios.get('/rapi/point/getPointDetail/'+code)
        setTitle(result?.data?.data?.desc)
    }
    useEffect(()=>{
        searchChart()
        searchCount()
        searchDetail()
    },[timeStart,timeEnd])

    useEffect(()=>{
        searchChart()
    },[unit])

    return (
        <>
            <div className="page-title">数据详情--{title}({code})</div>
            
            <div className="point-detail-content">
                <a className="back" onClick={()=>history.goBack()}>返回</a>
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
                            <Col span={14}>
                                <Form.Item label="时间段" name="time">
                                    <RangePicker showTime format={dateFormat} defaultValue={[moment().startOf('day'), moment().endOf('day')]} ranges={{
                                        
                                        '前一天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                                    }} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div style={{marginBottom:20}}>
                    <Space>
                        <Button size={'small'} ghost type={'primary'} onClick={()=>setFastTime('t')}>当天</Button>
                        <Button size={'small'} ghost type={'primary'} onClick={()=>setFastTime('d')}>前一天</Button>
                        <Button size={'small'} ghost type={'primary'} onClick={()=>setFastTime('w')}>前一周</Button>
                    </Space>
                </div>
                <Card title="基本信息">
                    <div className="site-card-wrapper">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card title="PV(次数)">
                                    <Statistic  value={total} />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="UV(人数)">
                                    <Statistic  value={uv} />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="DAU">
                                    <Statistic  value={uv} />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Card>
                <Card title="实时数据">
                    <Radio.Group options={[{ label: '小时', value: 'h' },{ label: '分钟', value: 'm' }]} onChange={(v:RadioChangeEvent)=>setUnit(v.target.value)} value={unit} optionType="button" className='radio-btn'/>
                    <div id={code as string} className="chart-i"></div>
                </Card>
                <Card title="地区分布">
                    <DetailMap timeStart={timeStart} timeEnd={timeEnd} code={code as string}></DetailMap>
                </Card>
                <Card title="数据明细">
                    <DetailTable timeStart={timeStart} timeEnd={timeEnd} code={code as string}></DetailTable>
                </Card>
                {contextHolder}
            </div>
        </>
    )
}
export default PointDetail