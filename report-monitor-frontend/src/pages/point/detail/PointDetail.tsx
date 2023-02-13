import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table, DatePicker, Card, Statistic, Radio, RadioChangeEvent } from 'antd'
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
    const initChart = (_data: ChartDataItem[]) => {
        const xAxis = _data.map((i: ChartDataItem) => {
            return i.time
        })
        const yAxis = _data
            .filter((i: ChartDataItem) => {
                return moment().isAfter(moment(i.time))
            })
            .map((i: ChartDataItem) => {
                return i.total
            })

        const option = {
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
                    name: '次数',
                    type: 'line',
                    symbol: 'none',
                    // sampling: 'lttb',
                    itemStyle: {
                        color: '#088f81',
                    },

                    data: yAxis,
                },
            ],
        }

        const chartmei = (window as any).echarts.init(
            document.getElementById(code as string)
        )
        chartmei.setOption(option)
    }
    const searchChart = async () => {

        const result = await axios.post('/rapi/report/getReportsGroup', {
            
            start: timeStart,
            end: timeEnd,
            code: code,
            unit:unit
        })
        const d:ChartDataItem[] = result.data.data

        initChart(d)

        let t = d.reduce((prev,cur)=>{
            return prev+cur.total
        },0)
        setTotal(t.toString())

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
                <Card title="数据明细">
                    <DetailTable timeStart={timeStart} timeEnd={timeEnd} code={code as string}></DetailTable>
                </Card>
                {contextHolder}
            </div>
        </>
    )
}
export default PointDetail