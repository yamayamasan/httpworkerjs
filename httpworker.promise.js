'use strict';
require('es6-promise').polyfill();

(function(window) {
  const WORKER_FILE = 'worker.js';
  const HTTPWORKER_FILE = 'httpworker.js';
  const scripts = document.getElementsByTagName('script');
  const SCRIPT_SRC = scripts[scripts.length - 1].src;

  function HttpWorker() {
    const dones = ['success', 'error', 'timeout'];
    const progs = ['start', 'progress', 'end'];
    const httpMethods = ['get', 'post', 'put', 'delete', 'head'];
    this.worker = new Worker(this.__getWorkScriptSrc());
    this.__setDones(dones);
    this.__setProgs(progs);
    this.__setHttpMethods(httpMethods);
    this.opts = {
      url: null,
      method: 'GET'
    };
  }

  HttpWorker.prototype.__getWorkScriptSrc = function() {
    if (SCRIPT_SRC === null) throw new Error();
    const arr = SCRIPT_SRC.split('/');
    const last = arr.length - 1;
    if (arr[last] !== HTTPWORKER_FILE) throw new Error('Failed httpworker.js');
    arr[last] = WORKER_FILE;
    return arr.join('/');
  };

  HttpWorker.prototype.__getOpts = function(opts) {
    return Object.assign({}, this.opts, opts);
  };

  HttpWorker.prototype.__setProgs = function(fnc) {
    fnc.map((v) => {
      this[v] = (cb) => {
        this.worker.addEventListener('message', (msg) => {
          const res = msg.data;
          if (res.event === v) {
            cb(res.data);
          }
        });
        return this;
      }
    });
  };

  HttpWorker.prototype.__setHttpMethods = function(methods) {
    methods.map((method) => {
      this[method] = (url, opts) => {
        opts.url = url;
        opts.method = method.toUpperCase();
        return this.request(opts);
      };
    });
  };

  HttpWorker.prototype.request = function(data, success, error) {
    const opts = this.__getOpts(data);
    this.worker.postMessage(opts);

    return new Promise((resolve, reject) => {
      this.worker.onmessage = (msg) => {
        const res = msg.data;
        if (res.event === 'success') resolve(res.data, res.status);

        if (res.event === 'error') reject(res.data);
      };
    });
  };

  window.httpWorker = new HttpWorker();

  if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  }

}(window));

