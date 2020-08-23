// reportService.js
import {getRequest, postRequest, mockResult} from './Http';
import {reportManagementData} from "../Mock/reportManagement/reportManagement";
import {API_ROOT} from "../constants";

export function submitReportService(IsMock, report){
    if(IsMock){
        return mockResult(require('../Mock/report/submit'))
    }
    
    return postRequest('/report/submit',report)
}

export function submitTemplateService(IsMock, template) {
    if (IsMock) {
        return mockResult(require('../Mock/report/submit'));
    }
    return postRequest('/template/create',template);
}

export function getReportData(IsMock, params){
    if(IsMock){
        return mockResult(reportManagementData);
    }
    return postRequest(`/report/aggregate/`, params);
}

export function sendEmailService(IsMock, params){
    if(IsMock){
        return mockResult(reportManagementData);
    }
    return postRequest(`/report/sendEmail`, params);

}

export function getPeopleToRemindService(IsMock,params){
    if(IsMock){
        return mockResult(require('../Mock/team/joinedTeams'))
    }
    // var url = new URL(API_ROOT+'/report/getRemindAll')
    // url.search = new URLSearchParams(leadEmail).toString();
    return postRequest(`/report/getRemindAll`, params);
}

export function getTemplatesService(IsMock, teamId) {
    if(IsMock){
        return "mock";
    }
    var url = new URL(API_ROOT+'/template/getTemplatesInTeam');
    let param = {"teamId":teamId}
    url.search = new URLSearchParams(param).toString();
    return getRequest(`/template/getTemplatesInTeam${url.search}`);
}

export function getReportDetailService(params) {
    return postRequest(`/report/content`, params);
}

export function updateReportService(report){
    return postRequest('/report/update',report)
}

export function saveDraftService(report){
    return postRequest('/report/saveDraft',report)
}