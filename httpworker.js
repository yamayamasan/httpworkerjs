'use strict';

(function(window) {
  var WORKER_FILE = 'worker.js';
  var HTTPWORKER_FILE = 'httpworker.js';
  var scripts = document.getElementsByTagName('script');
  var SCRIPT_SRC = scripts[scripts.length - 1].src;

  function HttpWorker() {
    var dones = ['success', 'error', 'timeout'];
    var progs = ['start', 'progress', 'end'];
    var httpMethods = ['get', 'post', 'put', 'delete', 'head'];
    this.worker = new Worker(this.__getWorkScriptSrc());
    this.__setDones(dones);
    this.__setProgs(progs);
    this.__setHttpMethods(httpMethods);
    this.__initOpts();
  }

  HttpWorker.prototype.__getWorkScriptSrc = function() {
    if (SCRIPT_SRC === null) throw new Error();
    var arr = SCRIPT_SRC.split('/');
    var last = arr.length - 1;
    if (arr[last] !== HTTPWORKER_FILE) throw new Error('Failed httpworker.js');
    arr[last] = WORKER_FILE;
    return arr.join('/');
  };

  HttpWorker.prototype.__initOpts = function() {
    this.opts = {
      url: null,
      method: 'GET'
    };
  };

  HttpWorker.prototype.__setOpts = function(vals) {
    var _this = this;
    Object.keys(vals).forEach(function(key){
      _this.__setOpt(key, vals[key]);
      // _this.opts[key] = vals[key];
    });
  };

  HttpWorker.prototype.__setOpt = function(key, val) {
    this.opts[key] = val;
  };

  HttpWorker.prototype.__setDones = function(fnc) {
    var _this = this;
    fnc.map(function(v) {
      _this[v] = function(cb) {
        _this.worker.addEventListener('message', function(msg) {
          var res = msg.data;
          if (res.event === v) {
            cb(res.data, res.status);
          }
        });
        return _this;
      }
    });
  };

  HttpWorker.prototype.__setProgs = function(fnc) {
    var _this = this;
    fnc.map(function(v) {
      _this[v] = function(cb) {
        _this.worker.addEventListener('message', function(msg) {
          var res = msg.data;
          if (res.event === v) {
            cb(res.data);
          }
        });
        return _this;
      }
    });
  };

  HttpWorker.prototype.__setHttpMethods = function(methods) {
    var _this = this;
    methods.map(function(method){
      _this[method] = function(url, opts) {
        _this.__setOpt('url', url);
        _this.__setOpt('method', method.toUpperCase());
        _this.__setOpts(opts);
        _this.request();
      };
    });
  };

  HttpWorker.prototype.request = function(data, success, error) {
    this.__setOpts(data);
    this.worker.postMessage(this.opts);

    // tmp code
    if (success || error) {
      this.worker.onmessage = function(msg) {
        var res = msg.data;
        if (success && res.event === 'success') success(res.data);
        if (error && res.event === 'error') error(res.data);
      }
    }

    return this;
  };

  window.httpWorker = new HttpWorker();

}(window));

