import {postRequest} from './Http';

export function SendFeedbackEmailService(params){
    return postRequest(`/feedback/sendEmail`, params);
}