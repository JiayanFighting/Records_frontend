// teamService.js
import {getRequest, postRequest} from './Http';
import {API_ROOT} from "../constants";

export function getNotesListService(userId){
    var url = new URL(API_ROOT+'/note/list')
    let content = {"userId":userId}
    url.search = new URLSearchParams(content).toString();
    return getRequest(`/note/list${url.search}`);
}

export function submitNoteService(note){
    return postRequest('/note/submit',note)
}

export function updateNoteService(note){
    return postRequest('/note/update',note)
}

export function deleteNoteService(id){
    let body = {'id':id};
    return postRequest('/note/delete',body)
}

export function getTagListService(userId){
    var url = new URL(API_ROOT+'/note/tags')
    let content = {"userId":userId}
    url.search = new URLSearchParams(content).toString();
    return getRequest(`/note/tags${url.search}`);
}