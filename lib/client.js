var constants = require('../custom_modules/constants')
var headers = require('../custom_modules/headers')
var Requester = require('./requester')

var URLS = constants.URLS

function getProxyString(proxy) {
    return `http://${(proxy.username && proxy.password) ? `${proxy.username}:${proxy.password}@` : ''}${proxy.ip}:${proxy.port}`
}

var OKCupid = function (proxy = null) {
    this.requester = new Requester(proxy)
    this.proxy = proxy;
}

OKCupid.prototype.proxyTest = function (cb) {
    const _proxyTestUrl = 'https://www.whatismyip.com/'
    this.requester.getRequestHtml(_proxyTestUrl, function (err, res, body) {
        if (err) cb(err, res, body)
        else cb(err, res, body.indexOf(this.proxy) != -1)
    })
}

OKCupid.prototype.login = function (username, password, token, callback) {
    var login_form = {
        okc_api: 1,
        username: username,
        password: password,
    };
    this.requester.postRequest(URLS.login, login_form, token, function (err, res, body) {
        // if there is a non-zero status in response and response does not show an error
        if (!err && body.status !== 0) {
            err = {
                status: body.status, // a status number
                status_str: body.status_str, // descriptive error message
            }
        }
        // set the OAuth token in the custom header
        // else if (body.oauth_accesstoken) {
        //     headers.setOAuthToken(body.oauth_accesstoken)
        // }
        callback(err, res, body)
    })
}

OKCupid.prototype.visitUser = function (username, token, callback) {
    var user_profile_url = URLS.visit_user.replace('{username}', username)
    this.requester.getRequest(user_profile_url, token, callback)
}

OKCupid.prototype.like = function (target_userid, token, callback) {
    var like_url = URLS.like.replace('{userid}', target_userid)
    this.requester.postRequest(like_url, {}, token, callback)
}

OKCupid.prototype.unlike = function (target_userid, token, callback) {
    var unlike_url = URLS.unlike.replace('{userid}', target_userid)
    this.requester.postRequest(unlike_url, {}, token, callback)
}

OKCupid.prototype.rate = function (target_userid, score, token, callback) {
    var data = {
        okc_api: 1,
        score: score,
        vote_type: 'personality',
        target_userid: target_userid
    }
    this.requester.postRequest(URLS.rate, data, token, callback)
}

OKCupid.prototype.getQuickmatch = function (token, callback) {
    this.requester.getRequest(URLS.quickmatch, token, callback)
}

OKCupid.prototype.getUserProfile = function (username, token, callback) {
    var user_profile_url = URLS.user_profile.replace('{username}', username)
    this.requester.getRequest(user_profile_url, token, callback)
}

OKCupid.prototype.getUserQuestions = function (username, options, token, callback) {
    var user_questions_url = URLS.user_questions.replace('{username}', username)
    this.requester.postJsonRequest(user_questions_url, options, token, callback)
}

OKCupid.prototype.getVisitors = function (token, callback) {
    this.requester.getRequest(URLS.get_visitors, token, callback)
}

OKCupid.prototype.sendMessage = function (user_id, message_body, token, callback) {
    this.requester.postJsonRequest(URLS.send_message, { "body": message_body, "receiverid": user_id }, token, callback)
}

OKCupid.prototype.getRecentMessages = function (token, callback) {
    this.requester.getRequest(URLS.get_messages, token, callback)
}

OKCupid.prototype.getMessageThread = function (thread_id, token, callback) {
    var thread_url = URLS.get_thread.replace('{thread_id}', thread_id)
    this.requester.getRequest(thread_url, token, callback)
}

OKCupid.prototype.search = function (options, token, callback) {
    this.requester.postJsonRequest(URLS.search, options, token, callback)
}

OKCupid.prototype.editProfile = function (essayid, contents, token, callback) {
    this.requester.postJsonRequest(URLS.edit_profile, { essay_pics: [], essayid, contents }, token, callback)
}

OKCupid.prototype.getLikes = function (options, token, callback) {
    var connections_url = URLS.connections + this.requester.buildQueryString(options)
    this.requester.getRequest(connections_url, token, callback)
}

OKCupid.prototype.getIncomingLikes = function (options, token, callback) {
    var connections_url = URLS.incomingconnections + this.requester.buildQueryString(options)
    this.requester.getRequest(connections_url, token, callback)
}
module.exports = OKCupid
