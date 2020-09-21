// teamService.js
import {getRequest, postRequest} from './Http';
import {API_ROOT} from "../constants";

export function removeLineService(content){
    var url = new URL(API_ROOT+'/tool/removeLine')
    content = {"content":content}
    url.search = new URLSearchParams(content).toString();
    return getRequest(`/tool/removeLine${url.search}`);
}

export function updateTeamService(team){
    return postRequest('/team/update',team)
}
