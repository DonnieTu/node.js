var http=require('http');
var url=require('url');
var util=require('util');

var argUrl=process.argv[2];
var parsedUrl=url.parse(argUrl,true);

var options= {
    host:parsedUrl.hostname,
    port:parsedUrl.port,
    path:parsedUrl.path,
    method:'GET'
};

//if(parsedUrl.search) options.path=+"?"+parsedUrl.search;

var req=http.request(options, res=>{
    util.log('STATUS: ',res.statusCode);
    util.log('HEADERS: '+util.inspect(res.headers));
    res.setEncoding('utf8');
    res.on('data',(chunk)=>{
        util.log('BODY: ');
    });
    res.on('error',err=>{
        util.log('RESPONSE ERROR: '+err);
    });
    res.on('end',()=>{
        util.log('There is no more data!');
    });
    res.on('close',()=>{
        util.log('Connection is closed!');
    });
});

req.on('error',err=>{
    util.log('REQUEST ERROR: '+err);
});
req.end();
util.log("REQUEST END!")