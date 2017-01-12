# httpworkerjs

HTTP client for browsers using WebWorker

# Example

base request
```

var opts = {
  url: '/user/me',
  method: 'GET'
};

var req = httpWorker.request(opts);

req.success(function(res, status){

}).error(function(err){

});

```
