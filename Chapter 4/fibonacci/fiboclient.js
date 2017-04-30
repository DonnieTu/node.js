var http=require('http');
var url=require('url');
var util=require('util');

[
    '/fibonacci/10',
    '/fibonacci/15'
].forEach(path=>{
    util.log("requesting "+path);
    var req=http.request({
        hostname:'localhost',
        port:3002,
        path:path,
        method:'GET'
    },(res)=>{
        res.on('data',chuck=>{
            var result=JSON.parse(chuck);
            util.log("result: ", result);
        })

    });
    req.end();
});