import {getRequest} from './Http';

export function logout(){
    return getRequest('/logout');
}