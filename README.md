# httpworkerjs

Minimam HTTP client for browsers using WebWorker

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

get
```
var req = httpWorker.get('/user/me');

req.success(function(res, status){

}).error(function(err){

});
```

post
```
var req = httpWorker.post('/user/', {
  params: {
    name: 'user'
  }
});

req.success(function(res, status){

}).error(function(err){

});
```





