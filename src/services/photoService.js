// reportService.js
import {getRequest, postRequest, mockResult, postFormData} from './Http';
import {reportManagementData} from "../Mock/reportManagement/reportManagement";
import {API_ROOT} from "../constants";

// checked data include 'photo', 'teamId'
export function savePhoto(data){
    return postFormData('/photo/upload',data)
}

// checked
export function getPhotos(teamId){
    var url = new URL(API_ROOT+'/photo/getPhotos');
    let param = {"teamId":teamId}
    url.search = new URLSearchParams(param).toString();
    return getRequest(`/photo/getPhotos${url.search}`);
}

//deletePhoto(url)
export function deletePhoto(photoUrl){
    let body = {"url":photoUrl};
    return postRequest(`/photo/delete`,body);
}

//display a photo by absolute url
export function getPhoto(photoUrl){
    var url = new URL(API_ROOT+'/photo/getPhotos');
    let param = {"url":photoUrl}
    url.search = new URLSearchParams(param).toString();
    return getRequest(`/photo/get${url.search}`);
}

export function saveAvatar(data){
    return postFormData('/photo/upload/avatar',data)
}

export function saveCover(data){
    return postFormData('/photo/upload/cover',data)
}