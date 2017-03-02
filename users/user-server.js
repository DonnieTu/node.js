'use strict'
const restify=require('restify');
const util=require('util');
const log=require('debug')('users:server');
const error=require('debug')('user:error');
const usersModel=require('./users-sequelize');

var server=restify.createServer( {
    name:"User-Auth-Service",
    version: "0.0.1"
});

server.use(restify.authorizationParser());
server.use(check);
server.use(restify.queryParser());
server.use(restify.bodyParser({
    mapParams:true
}));

server.listen(process.env.PORT,"localhost",function(){
    log(server.name+' listening at '+server.url);
});

server.post('/create-user',(req,res,next)=>{
    log('post for create-user');
    usersModel.create(req.params.username,req.params.password,
        req.params.provider,req.params.lastName,
        req.params.givenName,req.params.middleName,
        req.params.emails,req.params.photos)
    .then(result=>{
        log('created '+util.inspect(result));
        res.send(result);
        next(false);
    })
    .catch(err=>{
        res.send(500,err);
        err(err.stack);
        next(false);
    });
});

var apiKeys = [ {
    user: 'them',
    key: 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF'
} ];

function check(req,res,next) {
    log("check...");
    if(req.authorization) {
        var found=false;
        for (let auth of apiKeys) {
            if(auth.key==req.authorization.basic.password 
            && auth.user==req.authorization.basic.username) { 
                found=true;
                break;
            }
        }

        if(found) next();
        else {
            res.send(401,new Error("Not authenticated"));
            error('Failed authentication check '+
                util.inspect(req.authorization));
            next(false);
        }
    } else {
        res.send(500,new Error('No Authorization Key'));
        error('NO Authorization');
        next(false);
    }
}

