var http=require('http');
var util=require('util');

["/fibonacci/20",
"/fibonacci/15"].forEach(path=>{
    util.log("requesting "+path);
    var req=http.request({
        host:"localhost",
        port:3002,
        path:path,
        method: "GET"
    },res=>{
        res.on('data',chunk=>{
            util.log('BODY: '+chunk);
        });
    });
    req.end();
});