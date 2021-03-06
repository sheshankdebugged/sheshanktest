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
    this.requester.getRequestHtml(null,_proxyTestUrl, function (err, res, body) {
        if (err) cb(err, res, body)
        else cb(err, res, body.indexOf(this.proxy) != -1)
    })
}

OKCupid.prototype.login = function (username, password, callback) {
    var login_url = URLS.login + '?okc_api=1' + '&username=' + username + '&password=' + password
    this.requester.getRequest(null,login_url, function (err, res, body) {
        if (!err && body.status !== 0) {
            err = {
                status: body.status, // a status number
                status_str: body.status_str, // descriptive error message
            }
        }
        callback(err, res, body)
    })
}

OKCupid.prototype.visitUser = function (cookies, username, callback) {
    var user_profile_url = URLS.visit_user.replace('{username}', username)
    this.requester.getRequest(cookies,user_profile_url, callback)
}

OKCupid.prototype.like = function (cookies,target_userid, callback) {
    var like_url = URLS.like.replace('{userid}', target_userid)
    this.requester.postRequest(cookies,like_url, {}, callback)
}

OKCupid.prototype.unlike = function (cookies, target_userid, callback) {
    var unlike_url = URLS.unlike.replace('{userid}', target_userid)
    this.requester.postRequest(cookies, unlike_url, {}, callback)
}

OKCupid.prototype.rate = function (cookies,target_userid, score, callback) {
    var data = {
        okc_api: 1,
        score: score,
        vote_type: 'personality',
        target_userid: target_userid
    }
    this.requester.postRequest(cookies,URLS.rate, data, callback)
}

OKCupid.prototype.getQuickmatch = function (cookies, callback) {
    this.requester.getRequest(cookies, URLS.quickmatch, callback)
}

OKCupid.prototype.getUserProfile = function (cookies,username, callback) {
    var user_profile_url = URLS.user_profile.replace('{username}', username)
    this.requester.getRequest(cookies,user_profile_url, callback)
}

OKCupid.prototype.getUserQuestions = function (cookies,username, options, callback) {
    var user_questions_url = URLS.user_questions.replace('{username}', username)
    this.requester.postJsonRequest(cookies, user_questions_url, options, callback)
}

OKCupid.prototype.getVisitors = function (cookies,callback) {
    this.requester.getRequest(cookies, URLS.get_visitors, callback)
}

OKCupid.prototype.sendMessage = function (cookies, user_id, message_body, callback) {
    this.requester.postJsonRequest(cookies, URLS.send_message, { "body": message_body, "receiverid": user_id }, callback)
}
OKCupid.prototype.getRecentMessages = function (cookies,callback) {
    this.requester.getRequest(cookies, URLS.get_messages, callback)
}

OKCupid.prototype.getMessageThread = function (cookies,thread_id, callback) {
    var thread_url = URLS.get_thread.replace('{thread_id}', thread_id)
    this.requester.getRequest(cookies,thread_url, callback)
}

OKCupid.prototype.search = function (cookies, options, callback) {
    this.requester.postJsonRequest(cookies,URLS.search, options, callback)
}

OKCupid.prototype.editProfile = function (cookies,essayid, contents, callback) {
    this.requester.postJsonRequest(cookies,URLS.edit_profile, { essay_pics: [], essayid, contents }, callback)
}

OKCupid.prototype.getLikes = function (cookies, options, callback) {
    var connections_url = URLS.connections + this.requester.buildQueryString(options)
    this.requester.getRequest(cookies,connections_url, callback)
}

OKCupid.prototype.getIncomingLikes = function (cookies,options, callback) {
    var connections_url = URLS.incomingconnections + this.requester.buildQueryString(options)
    this.requester.getRequest(cookies,connections_url, callback)
}
module.exports = OKCupid
