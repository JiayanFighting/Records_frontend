import {getRequest, postRequest, mockResult} from './Http';
import {reportManagementData} from "../Mock/reportManagement/reportManagement";
import {API_ROOT} from "../constants";

export function searchUserService(content){
    var url = new URL(API_ROOT+'/user/search')
    let param = {"content":content}
    url.search = new URLSearchParams(param).toString();
    console.log(url.search);
    return getRequest(`/user/search${url.search}`);
}

export function searchUserInTeamsService(search){
    var url = new URL(API_ROOT+'/me/people')
    let param = {"search":search}
    url.search = new URLSearchParams(param).toString();
    return getRequest(`/me/people${url.search}`);
}

export function recommendedUserService(){
    return getRequest(`/user/recommend`);
}

export function updateUsernameService(username){
    let body = {"username":username}
    return postRequest('/user/updateName',body)
}