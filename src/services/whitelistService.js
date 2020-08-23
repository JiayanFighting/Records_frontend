import {getRequest, postRequest} from './Http';

export function getAllWhitelistService(){
    return getRequest(`/whitelist/list`);
}


export function addWhitelistService(email){
    let body = {'email':email};
    return postRequest('/whitelist/add',body)
}

export function deleteWhitelistService(email){
    let body = {'email':email};
    return postRequest('/whitelist/delete',body)
}

export function setAdminService(email){
    let body = {'email':email};
    return postRequest('/whitelist/setAdmin',body)
}

export function cancelAdminService(email){
    let body = {'email':email};
    return postRequest('/whitelist/cancelAdmin',body)
}
