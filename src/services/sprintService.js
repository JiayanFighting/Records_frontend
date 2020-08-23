import {getRequest, postRequest} from './Http';
import {API_ROOT} from "../constants";

export function createSprintItemService(sprintItem){
    return postRequest('/team/sprint/create',sprintItem)
}

export function deleteSprintService(id){
    var body = {"id":id}
    return postRequest('/team/sprint/delete',body)
}

export function getSprintService(id, sprint, type){
    var body = {"id":id, "sprint": sprint, "type": type};
    return postRequest('/team/sprint/get',body)
}

export function updateSprintItemService(sprintItem){
    return postRequest('/team/sprint/update',sprintItem)
}

export function getSprintListService(teamId){
    var url = new URL(API_ROOT+'/team/sprint/list')
    var content = {"teamId":teamId}
    url.search = new URLSearchParams(content).toString();
    return getRequest(`/team/sprint/list${url.search}`);
}

export function getCurSprintListService(teamId){
    var url = new URL(API_ROOT+'/team/sprint/current')
    var content = {"teamId":teamId}
    url.search = new URLSearchParams(content).toString();
    return getRequest(`/team/sprint/current${url.search}`);
}
