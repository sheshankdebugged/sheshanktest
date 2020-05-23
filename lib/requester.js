var request = require('request')
var constants = require('../custom_modules/constants')
var headers = require('../custom_modules/headers')

var cookie_jar = request.jar()
var request;


var Requester = function (proxy) {
    // proxy must be of format http://username:password@ip:port or http://ip:port
    request = request.defaults({ jar: cookie_jar, strictSSL: false, proxy: proxy })
}

Requester.prototype.postRequest = function (cookies, endpoint, data, callback) {
    var request = setCookies(cookies);
    request({
        method: 'POST',
        url: endpoint,
        form: data,
        headers: headers.getHeaders(cookies),
        json: true
    },
        callback)
}

Requester.prototype.postJsonRequest = function (cookies, endpoint, data, callback) {
    var request = setCookies(cookies);
    request({
        method: 'POST',
        url: endpoint,
        body: data,
        headers: headers.getHeaders(cookies),
        json: true
    },
        callback)
}

Requester.prototype.getRequest = function (cookies,endpoint, callback) {
    var request = setCookies(cookies);
    request({
        method: 'GET',
        url: endpoint,
        headers: headers.getHeaders(cookies),
        json: true
    },
        callback)
}

Requester.prototype.getRequestHtml = function (cookies,endpoint, callback) {
    var request = setCookies(cookies);
    request({
        method: 'GET',
        url: endpoint,
        headers: headers.getHeaders(cookies)
    },
        callback)
}

Requester.prototype.buildQueryString = function (query) {
    var queryStrings = []

    for (var key in query) {
        if (query.hasOwnProperty(key)) {
            queryStrings.push(key + '=' + query[key])
        }
    }

    return queryStrings.length === 0 ? '' : '?' + queryStrings.join("&")
}

module.exports = Requester

function setCookies(cookies) {
    var request = require('request');
    var cookie_jar = request.jar();
    if (cookies && cookies.length > 0) {
        cookies.forEach(cookie => {
            cookie_jar.setCookie(cookie, 'https://www.okcupid.com/');
        });
    }
    request = request.defaults({ jar: cookie_jar, strictSSL: false, proxy: null });
    return request;
}
