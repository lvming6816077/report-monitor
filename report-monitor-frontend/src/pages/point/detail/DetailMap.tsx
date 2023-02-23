import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Modal, Form, Input, Table } from 'antd'
import { message } from 'antd'
import axios from 'axios'
import moment from 'moment'

import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { PlusSquareOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { RootState } from '@/store'

type DataType = {
    desc?: string
    create?: string
    city?:string
    ip?:string
    province?:string
    _id: string
}
type Props = {
    timeEnd: string
    timeStart: string
    code:string
}
export const DetailMap: React.FC<Props> = ({ timeEnd, timeStart,code}) => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)


    const option =  {
        backgroundColor: 'transparent',
        tooltip : {
          trigger: 'item',
          background:'#000',
          color:'#fff',

        },
        //左侧小导航图标
        visualMap: {
            show : false,
            splitList: [
              {start: 80},{start: 60, end: 80},{start: 40, end: 60},{start: 20, end: 40},{start: 0, end: 20}
            ],
            color: [ '#00897B','#009688','#26A69A','#4DB6AC','#80CBC4']
        },
        
        //配置属性
        series: [{
            name: false,
            type: 'map',
            mapType: 'china',
            selectedMode: false,
            zoom: 1.2,
            roam: false,
            itemStyle:{
              emphasis: {
                areaColor:'#0475de'
              }
            },
            label: {
                normal: {
                    show: false  //省份名称
                },
                emphasis: {
                    show: false
                }
            },
            data:[]  //数据
        }]
      };

      const searchMap = async () => {
        const result = await axios.post('/rapi/report/getReportsGroupProvince?timeStart='+timeStart+'&timeEnd='+timeEnd, {
            timeStart,
            timeEnd,
            pointCode: code,
        })
        let list = result.data.data||[]
        
        
        var mapData: never[] = []
        list.forEach((element:any) => {
            if (element._id) {
                element.value = Number(element.count)
                element.name = element._id.replace('省','')
                mapData.push(element as never)
            }
        })
        console.log(mapData)
        option.series[0].data = mapData
        chartmei.setOption(option)
    }
    let chartmei:any = null

    useEffect(()=>{
        chartmei = (window as any).echarts.init(
            document.getElementById('chinaMap')
        )
        
        searchMap()
    },[])

    return (
        <>
            <div id={'chinaMap'} style={{width:'100%',height:400}}></div>
        </>
    )
}
