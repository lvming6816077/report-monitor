import React, { useState, useEffect } from 'react'

import { DatePicker } from 'antd';
import { CheckSquareTwoTone, Loading3QuartersOutlined } from '@ant-design/icons';
import axios from 'axios'
import moment, { Moment } from 'moment'
// import * as moment from "moment";
import { tranNumber} from '@/utils/num.js'
const RangePicker: any = DatePicker.RangePicker

import './CItem.less'
type Props = {
    data: [];
    code: string;
    desc: string
}
type ChartDataItem = {
    time: string,
    total: number
}

export const CItem: React.FC<Props> = React.memo(({ data, code, desc }) => {

    const [showDatePicker, setShowDatePicker] = useState<Boolean>(false)
    const [showLoading, setShowLoading] = useState<Boolean>(false)


    const initChart = (_data: []) => {
        const xAxis = _data.map((i: ChartDataItem) => {
            return i.time
        })
        const yAxis = _data.filter((i: ChartDataItem) => {
            return moment().isAfter(moment(i.time))
        }).map((i: ChartDataItem) => {
            return i.total
        })

        const option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt: any[]) {
                    return [pt[0], '10%'];
                }
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
                data: xAxis
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                axisLabel: {
                    formatter: (v:string)=>{
                        console.log(v)
                        return tranNumber(v,2)
                    },
                }
            },

            series: [
                {
                    name: '次数',
                    type: 'line',
                    symbol: 'none',
                    // sampling: 'lttb',
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },

                    data: yAxis
                }
            ]
        };
        const chartmei = (window as any).echarts.init(document.getElementById(code));
        chartmei.setOption(option)
    }
    useEffect(() => {
        if (data.length) {
            setValue([moment().startOf('day'), moment().endOf('day')]);
            initChart(data)
        }
    }, [data]);



    const [dates, setDates] = useState<Moment[]>([]);
    const [value, setValue] = useState<Moment[]>([]);

    const search = async () => {
        setShowLoading(true)
        const result = await axios.post('/rapi/report/getReportsGroup', {
            start: value[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            end: value[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            code: code
        });
        setShowLoading(false)
        initChart(result.data.data)
    }

    const disabledDate = (current: Moment) => {
        if (!dates || dates.length === 0) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
        const tooEarly = dates[1] && (dates[1]).diff(current, 'days') > 7;
        return tooEarly || tooLate;
    };


    return (
        <div className='c-content'>
            
            <div className='title'>{desc + '(' + code + ')'}</div>

                <div className='inner' onMouseEnter={() => { setShowDatePicker(true) }} onMouseLeave={() => { setShowDatePicker(false) }}>
                    <div style={{ opacity: showDatePicker ? '1' : '0' }} className="datepick">
                        <RangePicker size={'small'}
                            value={value}
                            disabledDate={disabledDate}
                            onCalendarChange={(val: Moment[]) => setDates(val)}
                            onChange={(val: Moment[]) => setValue(val)}
                            style={{width:'90%'}}

                        ></RangePicker><CheckSquareTwoTone className='search-btn' onClick={search} />
                    </div>
                    {data.length ? 
                        <div id={code} className="item"></div>
                        :
                        <div className='no-data'>暂无数据</div>
                    }
                    {showLoading ? <div className='loading'>
                        <Loading3QuartersOutlined spin className='loading-icon' />
                    </div>
                        : null}
                </div>

        </div>
    )
})
