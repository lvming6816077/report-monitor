import axios from 'axios';
import { useHistory } from 'react-router-dom'
import { message } from 'antd';
// axios 配置
axios.defaults.timeout = 8000;
// axios.defaults.baseURL = 'https://api.github.com';

// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (localStorage.token) { //判断token是否存在
            config.headers['token'] = localStorage.token;  //将token设置成请求头
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
        // console.log(response)

        return response;
    },
    error => {
        if (error.response.data.code === 401) {
            window.location.href = '/login'
        }
        if (error.response.data.code === 500) {
            message.error(error.response.data.message)
        }
        return Promise.reject(error);
    }
);
export default axios;