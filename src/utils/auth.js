import Cookies from 'js-cookie';

export function getToken (tokenKey) {
    return Cookies.get(tokenKey);
}

export function setToken (tokenKey, token, param) {
    return Cookies.set(tokenKey, token, param);
}

export function removeToken (tokenKey) {
    return Cookies.remove(tokenKey);
}
