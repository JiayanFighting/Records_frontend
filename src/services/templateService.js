// teamService.js
import { getRequest, postRequest, mockResult } from './Http';
import { API_ROOT } from "../constants";
import { template } from 'lodash';


//checked
export function getTemplatesInTeamService(teamId) {
    var url = new URL(API_ROOT + '/template/getTemplatesInTeam')
    var content = { "teamId": teamId }
    url.search = new URLSearchParams(content).toString();
    return getRequest(`/template/getTemplatesInTeam${url.search}`);
}

export function deleteTemplateService(id) {
    var body = { "id": id }
    return postRequest('/template/delete', body)
}

export function updateTemplateService(template) {
    return postRequest('/template/update', template)
}

export function createTemplateService(template) {
    return postRequest('/template/create', template)
}

export function searchTemplatesService(teamId, type) {
    var url = new URL(API_ROOT + '/template/search')
    var content = { "teamId": teamId, "type": type }
    url.search = new URLSearchParams(content).toString();
    return postRequest(`/template/search`, content);
}

export function getAllTemplatesService(template) {
    return postRequest('/template/getAllTemplates', template)
}

// export function searchTemplatesService(teamId,type){
//     var url = new URL(API_ROOT+'/template/search')
//     var content = {"teamId":teamId,"type":type}
//     url.search = new URLSearchParams(content).toString();
//     return getRequest(`/template/search${url.search}`);
// }