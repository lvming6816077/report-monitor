import React, { useState, useEffect } from 'react'

import { DatePicker } from 'antd'
import { ArrowRightOutlined, CheckSquareTwoTone, Loading3QuartersOutlined } from '@ant-design/icons'
import axios from 'axios'
import moment, { Moment } from 'moment'
import { useHistory, useLocation } from 'react-router-dom'
// import * as moment from "moment";
import { tranNumber } from '@/utils/num.js'
const RangePicker: any = DatePicker.RangePicker

import './CItem.less'
type Props = {
    data: ChartDataItem[]
    code: string
    desc: string
    changeData: (cur: [], code: string) => void
}
export type ChartDataItem = {
    time: string
    total: number
}

export const CItem: React.FC<Props> = React.memo(
    ({ data, code, desc, changeData }) => {
        const [showDatePicker, setShowDatePicker] = useState<Boolean>(false)
        const [showLoading, setShowLoading] = useState<Boolean>(false)
        const [total,setTotal] = useState<Number>(0)
        const history = useHistory()
        // console.log(data)

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
                document.getElementById(code)
            )
            chartmei.setOption(option)
        }
        useEffect(() => {
            if (data.length) {
                initChart(data)
            }
            let t = data.reduce((prev,cur)=>{
                return prev+cur.total
            },0)
            setTotal(t)
        }, [data])

        useEffect(() => {
            setValue([moment().startOf('day'), moment().endOf('day')])
        }, [])

        const [dates, setDates] = useState<Moment[]>([])
        const [value, setValue] = useState<Moment[]>([])

        const search = async () => {
            if (!value.length) return
            setShowLoading(true)
            const result = await axios.post('/rapi/report/getReportsGroup', {
                start: value[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                end: value[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                code: code,
            })
            setShowLoading(false)
            changeData(result.data.data, code)
        }

        const disabledDate = (current: Moment) => {
            if (!dates || dates.length === 0) {
                return false
            }
            const tooLate = dates[0] && current.diff(dates[0], 'days') > 7
            const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7
            return tooEarly || tooLate
        }

        return (
            <div className="c-content">
                <div className="title" onClick={()=>history.push('/point/pointdetail?code='+(code||''))}>{desc + '(' + code + ')'}<ArrowRightOutlined style={{marginLeft:6,fontSize:14}}/></div>
                <div className="total-count"><>总计：{total}</></div>
                <div
                    className="inner"
                    onMouseEnter={() => {
                        setShowDatePicker(true)
                    }}
                    onMouseLeave={() => {
                        setShowDatePicker(false)
                    }}
                >
                    <div
                        style={{ opacity: showDatePicker ? '1' : '0' }}
                        className="datepick"
                    >
                        <RangePicker
                            size={'small'}
                            value={value}
                            disabledDate={disabledDate}
                            onCalendarChange={(val: Moment[]) => setDates(val)}
                            onChange={(val: Moment[]) => setValue(val)}
                            style={{ width: '90%' }}
                        ></RangePicker>
                        <CheckSquareTwoTone
                            className="search-btn"
                            onClick={search}
                        />
                    </div>
                    {data.length ? (
                        <div id={code} className="item"></div>
                    ) : (
                        <div className="no-data">暂无数据</div>
                    )}
                    {showLoading ? (
                        <div className="loading">
                            <Loading3QuartersOutlined
                                spin
                                className="loading-icon"
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }
)
