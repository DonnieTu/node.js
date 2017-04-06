var util=require('util');
var url=require('url');

exports.sniffOn=function(server) {
    server.on('checkContinue',(req,res)=>{
        util.log('event_checkContinue');
        util.log(reqToString(req));
        res.writeContinue();
    });

    server.on('close',errno=>{
        util.log('event_close errno='+errno);
    })

    server.on('request',(req,res)=>{
        util.log('event_request');
        util.log(reqToString(req));
    });

    server.on('connect',(req,res)=>{
        util.log('event_connect');
        util.log(reqToString(req));
    });

    server.on('upgrade',(req,res)=>{
        util.log('event_upgrade');
        util.log(reqToString(req));
    });
    
    server.on('clientError',(err,socket)=>{
        util.log('event_clientError: '+err);
    })
};

var reqToString=exports.reqToString=function(req) {
    var ret=`req ${req.method} ${req.httpVersion} ${req.url}` +'\n';
    ret+=JSON.stringify(url.parse(req.url,true))+'\n';
    var keys=Object.keys(req.headers);
    for (var i=0,l=keys.length;i<l;i++) {
        var key=keys[i];
        ret+=`${i} ${key}: ${req.headers[key]}`+'\n';
    }

    if(req.trailers) ret+=req.trailers +'\n';
    return ret;
};