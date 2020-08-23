import {getRequest} from './Http';

export function logout(){
    return getRequest('/logout');
}

export function loginService(team){
    return postRequest('/login',team)
}