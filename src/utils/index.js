/**
 * Created by tililiu on 18/08/11
 */
import store from '@/store/index';
import crypto from 'crypto';

// 获取时间戳
export function getTimestamp () {
    let timestamp = new Date().getTime();
    return timestamp;
};

// 根据字典值查询字典名
export function findDicWord (word) {
    let datas = store.state.app.dictionaryList;
    let result = datas.find((val) => {
        return val.dictCode === word;
    });
    return result.dictName;    
};

export function getType (type) {
    let color = '';
    let name = '';
    switch (type) {
        case 0:
            color = 'blue';
            name = '产品标准';
            break;
        case 1:
            color = 'green';
            name = '方法标准';
            break;
        case 2:
            color = 'yellow';
            name = '抽样细则';
            break;
        case 3:
            color = 'red';
            name = '判定标准';
            break;
        default:
            break;
    }
    return {
        color,
        name
    };
};

// 格式化日期
function formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
        }
    }
    return fmt;
};

// 格式化时间
export function formatTime (time) {
    if (!time) {
        return '';
    } else {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
};

// ms5加密
export function cryptPwd (str) {
    const md5 = crypto.createHash('md5');
    let result = md5.update(str).digest('hex');
    return result;
};

export function oneOf (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};