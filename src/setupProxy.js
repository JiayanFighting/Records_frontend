const { createProxyMiddleware } = require('http-proxy-middleware');
let API_ROOT = 'http://localhost:8080';
// let Photo_ROOT = 'https://localhost:8082'

module.exports = function (app) {
    app.use(createProxyMiddleware('/login', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/register', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/logout', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/login/secure', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/common/oauth2/v2.0/authorize', {
        target: 'https://login.microsoftonline.com',    // 目标服务器 host
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    // =================================================
    // about user
    app.use(createProxyMiddleware('/user/visitInfo', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    // =================================================
    // about note
    app.use(createProxyMiddleware('/note/list', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/submit', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/update', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/delete', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/tags', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/id', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/star', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/thumbUp', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/getAllTypes', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/getAllTags', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/note/query', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    // =================================================
    // about directory
    app.use(createProxyMiddleware('/directory/all', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/directory/allOnly', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));

    // =================================================
    // about tool
    app.use(createProxyMiddleware('/tool/removeLine', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));


    // =================================================
    // about team
    app.use(createProxyMiddleware('/team/joinedTeamList', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/createdTeamList', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/create', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/update', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/delete', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/removeMember', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/info', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/join', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/search', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/members', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/team/recommend', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    // team end =================================================

    //report Apis
    app.use(createProxyMiddleware('/report', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/report/submit', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/report/sendEmail', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/report/content', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/report/update', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/report/saveDraft', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));

    //template apis
    app.use(createProxyMiddleware('/template/create', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/template/getTemplatesInTeam', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/template/delete', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/template/update', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/template/search', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    //template apis
    app.use(createProxyMiddleware('/template/getTemplatesInTeam', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/template/getAllTemplates', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    // =================================================
    // about sprint
    app.use(createProxyMiddleware('/team/sprint/create', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/team/sprint/get', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/team/sprint/delete', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/team/sprint/update', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/team/sprint/list', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    app.use(createProxyMiddleware('/team/sprint/current', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));
    // sprint end =================================================

    // =================================================
    // about user
    app.use(createProxyMiddleware('/user/search', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    // user end =================================================

    // =================================================
    // about photo upload
    app.use(createProxyMiddleware('/photo/upload', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/photo/getPhotos', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/photo/delete', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/photo/get', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/message', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/feedback/sendEmail', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));

    app.use(createProxyMiddleware('/me/people', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));

    app.use(createProxyMiddleware('/user/recommend', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));

    app.use(createProxyMiddleware('/photo/upload/avatar', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));

    app.use(createProxyMiddleware('/photo/upload/cover', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,
    }));

    // app.use(createProxyMiddleware('', {
    //     target: Photo_ROOT,
    //     secure: false,
    //     changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    // }));
    // // user end =================================================


    // white list  begin =================================================
    app.use(createProxyMiddleware('/whitelist/list', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/whitelist/add', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/whitelist/delete', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/whitelist/setAdmin', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    app.use(createProxyMiddleware('/whitelist/cancelAdmin', {
        target: API_ROOT,
        secure: false,
        changeOrigin: false,                         //是否需要改变原始主机头为目标URL默认false，
    }));
    // whitelist end =================================================
};