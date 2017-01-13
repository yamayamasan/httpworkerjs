onmessage = onMessage;

function onMessage(message) {
  const self = this.self;
  const xhr = new XMLHttpRequest();
  const data = message.data;
  let params = null;

  if (data.headers) {
    forEach(data.headers, (v) => {
      xhr.setRequestHeader(v, data.headers[v]);
    });
  }

  if (data.responseType) xhr.responseType = data.responseType;

  if (data.params) params = __toStringParams(data.params);

  if (data.timeout) xhr.timeout = data.timeout;

  xhr.open(data.method, data.url);

  xhr.onload = function (r) {
    var res = __parseResonse(this);
    self.postMessage(res);
  }

  xhr.onerror = function(e) {
    self.postMessage({
      event: 'error',
      status: 500,
      data: 'error'
    });
  };

  xhr.ontimeout = function(e) {
    self.postMessage({
      event: 'timeout',
      status: this.status,
      data: 'Timeout Error'
    });
  };

  xhr.onloadstart = function(e) {
    self.postMessage({
      event: 'start',
    });
  }

  xhr.onprogress = function(e) {
    self.postMessage({
      event: 'progress',
    });
  }

  xhr.onloadend = function(e) {
    self.postMessage({
      event: 'end',
    });
  }
  xhr.send(params);
};

function __parseResonse (__this) {
  var status = __this.status;
  var body = __this.response;
  var event = 'success';

  if (status >= 200 && status < 300) {
    if (__this.responseType == '') {
      try {
        body = JSON.parse(body);
      } catch(e) {}
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
  let text = '';
  forEach(params, (v, i) => {
    if (i > 0) text += '&';
    text += v + '=' + params[v];
  });
  return text;
}

function forEach(vals, cb) {
  Object.keys(vals).forEach(cb);
}
