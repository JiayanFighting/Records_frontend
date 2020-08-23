// teamService.js
import {getRequest, postRequest, mockResult} from './Http';
import {API_ROOT} from "../constants";

export function getTeamInfoService(IsMock,content){
    if(IsMock){
        return mockResult(require('../Mock/team/info'))
    }
    var url = new URL(API_ROOT+'/team/info')
    content = {"id":content}
    url.search = new URLSearchParams(content).toString();
    return getRequest(`/team/info${url.search}`);
}

export function getJoinedTeamsService(IsMock){
    if(IsMock){
        return mockResult(require('../Mock/team/joinedTeams'))
    }
    return getRequest(`/team/joinedTeamList`);
}

export function getCreatedTeamsService(IsMock){
    if(IsMock){
        return mockResult(require('../Mock/team/createdTeams'))
    }
    return getRequest(`/team/createdTeamList`);
}

export function createTeamService(team){
    return postRequest('/team/create',team)
}

export function removeTeamMemberService(teamId,userEmail){
    let body = {'teamId':teamId,'userEmail':userEmail}
    return postRequest('/team/removeMember',body)
}

export function leaveTeamService(teamId){
    let body = {'teamId':teamId}
    return postRequest('/team/removeMember',body)
}

export function searchTeamsService(IsMock,content,userEmail){
    if(IsMock){
        return mockResult(require('../Mock/team/allTeams'))
    }
    var url = new URL(API_ROOT+'/team/search')
    content = {"content":content,"userEmail":userEmail}
    url.search = new URLSearchParams(content).toString();
    return getRequest(`/team/search${url.search}`);
}

export function deleteTeamService(teamId){
    let body = {"id":teamId}
    return postRequest('/team/delete',body)
}

export function joinTeamService(teamId,userEmail){
    let body = {'teamId':teamId,'userEmail':userEmail}
    return postRequest('/team/join',body)
}

export function getMembersService(teamId){
    var url = new URL(API_ROOT+'/team/members')
    let param = {"teamId":teamId}
    url.search = new URLSearchParams(param).toString();
    return getRequest(`/team/members${url.search}`);
}

export function updateTeamService(team){
    return postRequest('/team/update',team)
}

export function recommendedTeamService(){
    return getRequest(`/team/recommend`);
}