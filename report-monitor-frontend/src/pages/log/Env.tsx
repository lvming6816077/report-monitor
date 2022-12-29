import React, { useState, useEffect } from 'react'



import { ChromeOutlined, createFromIconfontCN, IeOutlined, PlusSquareOutlined } from '@ant-design/icons'

import parser from 'ua-parser-js'

type Props = {
    ua: string,
    ip:string
}
const IconFont = createFromIconfontCN({
    scriptUrl: [
      '//at.alicdn.com/t/c/font_3843073_pwmdv7ls74s.js', // icon-javascript, icon-java, icon-shoppingcart (overrided)
    ],
});
export const Env: React.FC<Props> = ({ ua,ip}) => {
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
                arr.push(<span key={1}><IconFont type="icon-edge" />Edge</span>)
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

            arr.push(<span  key={5}><IconFont type="icon-network" />{ip}</span>)

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
