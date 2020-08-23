import {getRequest, postRequest, mockResult} from './Http';
import {API_ROOT} from "../constants";

export function sendMessage(message){
    return postRequest('/message/create',message)
}

export function getMessage(){
    return getRequest(`/message/getMessageList`);
}

export function deleteMessage(messageId){
    let body = {"id":messageId}
    return postRequest('/message/delete',body)
}

export function readMessage(messageId){
    let body = {"id":messageId}
    return postRequest('/message/read',body)
}
