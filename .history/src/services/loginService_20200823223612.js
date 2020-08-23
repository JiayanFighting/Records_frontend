import {getRequest,postRequest} from './Http';

export function logout(){
    return getRequest('/logout');
}

export function loginService(values){
    // var url = new URL(API_ROOT+'/login')
    // content = {"email":values.email,"userEmail":userEmail}
    url.search = new URLSearchParams(values).toString();
    return getRequest(`/team/search${url.search}`);
}