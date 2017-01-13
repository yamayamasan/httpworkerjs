'use strict';

(function(window) {
  var WORKER_FILE = '%WORKER_FILE_NAME%';
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
    this.opts = {
      url: null,
      method: 'GET'
    };
  }

  HttpWorker.prototype.__getWorkScriptSrc = function() {
    if (SCRIPT_SRC === null) throw new Error();
    var arr = SCRIPT_SRC.split('/');
    var last = arr.length - 1;
    arr[last] = WORKER_FILE;
    return arr.join('/');
  };

  HttpWorker.prototype.__getOpts = function(opts) {
    return Object.assign({}, this.opts, opts);
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
        opts.url = url;
        opts.method = method.toUpperCase();
        return _this.request(opts);
      };
    });
  };

  HttpWorker.prototype.request = function(data, success, error) {
    var opts = this.__getOpts(data);
    this.worker.postMessage(opts);

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

