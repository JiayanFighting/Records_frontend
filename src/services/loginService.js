import {getRequest,postRequest} from './Http';
import { API_ROOT } from '../constants';

export function logout(){
    return getRequest('/logout');
}

export function loginService(values){
    var url = new URL(API_ROOT+'/login')
    // content = {"email":values.email,"userEmail":userEmail}
    url.search = new URLSearchParams(values).toString();
    return getRequest(`/login${url.search}`);
}

export function registerService(values){
    return postRequest('/register',values);
}