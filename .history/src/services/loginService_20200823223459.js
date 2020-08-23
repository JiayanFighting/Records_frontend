import {getRequest,postRequest} from './Http';

export function logout(){
    return getRequest('/logout');
}

export function loginService(values){
//     var url = new URL(API_ROOT+'/login')
//     content = {"content":content,"userEmail":userEmail}
//     url.search = new URLSearchParams(content).toString();
//     return getRequest(`/team/search${url.search}`);
    return postRequest('/login',values)
}