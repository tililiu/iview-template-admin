import axios from 'axios';
import qs from 'qs';
import { getTimestamp } from '@/utils';
import { getToken } from '@/utils/auth';
import store from '@/store';
import {router} from '@/router';
import { Message } from 'iview';

export const actionUrl = process.env.BASE_API;

const service = axios.create({
    baseURL: actionUrl,
    timeout: 50000
});

// axios 请求拦截器
service.interceptors.request.use(
    config => {
        let token = getToken('token');
        if (token) {
            config.headers['token'] = token;
        }
        // if (config.sendForm) {
        //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // }
        if (config.method === 'post') {
            if (config.sendForm) {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            } else {
                config.data = {
                    ...config.data,
                    platForm: 'web',
                    streamNo: 'web_' + getTimestamp()
                };
            }
            // if (!config.sendForm) {
            //     config.data = {
            //         ...config.data,
            //         platForm: 'web',
            //         streamNo: 'web_' + getTimestamp()
            //     };
            // }
        }
        return config;
    },
    err => Promise.reject(err)
);

// axios 响应拦截器
service.interceptors.response.use(
    res => {
        if (res.data.code === '2006') {
            store.commit('logout');
            router.replace({
                name: 'login'
            });
        }
        // if (res.data.code === '0000') {
        //     return res;
        // } else {
        //     Message.error({
        //         content: res.data.msg + '',
        //         duration: 5,
        //         closable: true
        //     });
        // }
        // return res;
        if (res.data.code !== '0000') {
            Message.error({
                content: res.data.msg + '',
                duration: 3,
                closable: true
            });
            const err = new Error(res.data.msg);
            throw err;
        } else {
            return res;
        }
    },
    error => Promise.reject(error)
);

export default service;
