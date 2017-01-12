'use strict';

(function(window) {
  var WORKER_SRC = null;
  var scripts = document.getElementsByTagName('script');
  WORKER_SRC = scripts[scripts.length - 1].src;

  function HttpWorker() {
    var dones = ['success', 'error', 'timeout'];
    var progs = ['start', 'progress', 'end'];
    var httpMethos = ['get', 'post'];
    this.worker = new Worker(this.__getWorkScriptSrc());
    this.__setDones(dones);
    this.__setProgs(progs);
    this.__setHttpMethods(httpMethos);
  }

  HttpWorker.prototype.__getWorkScriptSrc = function() {
    var arr = WORKER_SRC.split('/');
    var last = arr.length - 1;
    if (arr[last] !== 'httpworker.js') throw new Error('Failed httpworker.js');
    arr[last] = 'worker.js';
    return arr.join('/');
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
    _this[method] = function(opts) {
      _this.request(opts);
    };
  });
};

HttpWorker.prototype.request = function(data, success, error) {
  this.worker.postMessage(data);

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

