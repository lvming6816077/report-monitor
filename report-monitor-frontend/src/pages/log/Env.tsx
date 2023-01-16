import React, { useState, useEffect } from 'react'



import { ChromeOutlined, createFromIconfontCN, IeOutlined, PlusSquareOutlined } from '@ant-design/icons'

import parser from 'ua-parser-js'
import { Tooltip } from 'antd'
import axios from 'axios'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

type Props = {
    ua: string,
    ip:string,
    meta:any
}
const IconFont = createFromIconfontCN({
    scriptUrl: [
      '//at.alicdn.com/t/c/font_3843073_c1vv07lftsd.js', // icon-javascript, icon-java, icon-shoppingcart (overrided)
    ],
});
export const Env: React.FC<Props> = ({ ua,ip,meta}) => {


    const onOpenChange = async (open:boolean,ip:string)=>{

        if (open) {
            const result = await axios.get('/rapi/log/getIpDesc?ip='+ip)
            // console.log(result.data)
            setIpDesc(result.data.data||'-')
        }
    }
    const [ipDesc,setIpDesc] = useState<string>(' ')

    const renderEnv = (s:string)=>{
        // console.log(ua)
        if (s) {
            var o = parser(s);
            var arr = []

            if (o.browser.name == 'Chrome') {
                arr.push(<span key={1}><ChromeOutlined />Chrome</span>)
            } else if (o.browser.name == 'IE') {
                arr.push(<span key={1}><IconFont type="icon-IE" />IE</span>)
            } else if (o.browser.name == 'WeChat') {
                arr.push(<span key={1}><IconFont type="icon-wechat-fill" />WeChat</span>)
            } else if (o.browser.name == 'Edge') {
                arr.push(<span key={1}><IconFont type="icon-edge" />Edge </span>)
            }

            arr.push(<span key={2}>&nbsp;&nbsp;</span>)

            if (o.os.name == 'Windows') {
                arr.push(<span key={3}><IconFont type="icon-windows" />Windows</span>)
            } else if (o.os.name == 'iOS') {
                arr.push(<span key={3}><IconFont type="icon-iphone" />Iphone</span>)
            } else if (o.os.name == 'Mac OS') {
                arr.push(<span key={3}><IconFont type="icon-mac" />MAC</span>)
            }

            arr.push(<span key={4}>&nbsp;&nbsp;</span>)

            arr.push(<span  key={5}><Tooltip onVisibleChange={(open)=>onOpenChange(open,ip)} title={ipDesc}><IconFont type="icon-network1" /></Tooltip>{ip}</span>)

            arr.push(<span key={7}>&nbsp;&nbsp;</span>)

            arr.push(<span  key={6}><Tooltip  title={JSON.stringify(meta)}><IconFont type="icon-cc-database" /></Tooltip></span>)

            // console.log(o)
            
            return (<>{arr}</>)
        }

        return null
    }

    return (
        <>
            {renderEnv(ua)}
        </>
    )
}
