
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from 'react-redux'
import store, { RootState } from './store'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider, message } from 'antd'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './utils/request.js'

// import 'antd/dist/antd.less'
import "./theme/antd-default.css";
import "./theme/antd-dark.css";

message.config({
    duration: 2, // 持续时间
    maxCount: 3, // 最大显示数, 超过限制时，最早的消息会被自动关闭
    top: 300, // 到页面顶部距离
})
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
import App from './App'



const Main = ()=>{
    let cuser = localStorage.getItem('cuser')
    let prefixCls = 'antd-default'
    if (cuser) {
        prefixCls = JSON.parse(cuser).userInfo.theme||'antd-default'
        window.document.documentElement.setAttribute( "data-theme", prefixCls );
    }
    const [prefixClsInner,setPrefixClsInner] = useState<string>(prefixCls)
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    useEffect(()=>{
        
        window.document.documentElement.setAttribute( "data-theme", userInfo.theme as string );
        setPrefixClsInner(userInfo.theme as string)
    },[userInfo.theme])

    return (<ConfigProvider locale={zhCN} prefixCls={prefixClsInner}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
            </ConfigProvider>)
}

root.render(<Provider store={store}><Main></Main></Provider>)
