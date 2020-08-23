import {postRequest} from './Http';

export function sendAutomatedFlowService(url, params){
    return postRequest(url, params);
}