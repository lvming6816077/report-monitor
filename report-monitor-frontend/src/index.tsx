import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider,message } from 'antd';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './utils/request.js';

import 'antd/dist/antd.less'
 
message.config({
 duration: 2,// 持续时间
 maxCount: 3, // 最大显示数, 超过限制时，最早的消息会被自动关闭
 top: 300,// 到页面顶部距离
});
import App from './App'

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </ConfigProvider>,
    document.getElementById('root')
)
