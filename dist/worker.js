(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

onmessage = onMessage;

function onMessage(message) {
  var self = this.self;
  var xhr = new XMLHttpRequest();
  var data = message.data;
  var params = null;

  xhr.open(data.method, data.url);

  if (data.headers) {
    Object.keys(data.headers).forEach(function (v) {
      xhr.setRequestHeader(v, data.headers[v]);
    });
  }

  if (data.responseType) xhr.responseType = data.responseType;

  if (data.params) params = __toStringParams(data.params);

  if (data.timeout) xhr.timeout = data.timeout;

  xhr.onload = function (r) {
    var res = __parseResonse(this);
    self.postMessage(res);
  };

  xhr.onerror = function (e) {
    self.postMessage({
      event: 'error',
      status: 500,
      data: 'error'
    });
  };

  xhr.ontimeout = function (e) {
    self.postMessage({
      event: 'timeout',
      status: this.status,
      data: 'Timeout Error'
    });
  };

  xhr.onloadstart = function (e) {
    self.postMessage({
      event: 'start'
    });
  };

  xhr.onprogress = function (e) {
    self.postMessage({
      event: 'progress'
    });
  };

  xhr.onloadend = function (e) {
    self.postMessage({
      event: 'end'
    });
  };
  xhr.send(params);
};

function __parseResonse(__this) {
  var status = __this.status;
  var body = __this.response;
  var event = 'success';

  if (status >= 200 && status < 300) {
    if (__this.responseType == '') {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }
  } else if (status >= 300 && status < 400) {
    //
  } else if (status >= 400 && status < 500) {
    event = 'error';
  } else if (status >= 500 && status < 600) {
    event = 'error';
  }

  return {
    event: event,
    status: status,
    data: body
  };
}

function __toStringParams(params) {
  var text = '';
  Object.keys(params).forEach(function (v, i) {
    if (i > 0) text += '&';
    text += v + '=' + params[v];
  });
  return text;
}

},{}]},{},[1]);
