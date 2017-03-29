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
    log('post /create-user');
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
        error(err.stack);
        next(false);
    });
});

server.post('/update-user/:username', (req,res,next)=>{
    log('post /update-user/');
    usersModel.update(req.params.username,req.params.password,
        req.params.provider,req.params.lastName,
        req.params.givenName,req.params.middleName,
        req.params.emails,req.params.photos)
    .then(result=>{
        log('update '+util.inspect(result));
        res.send(result);
        next(false);
    })
    .catch(err=>{
        res.send(500,err);
        error(err.stack);
        next(false);
    });
});

server.post('/find-or-create',(req,res,next)=>{
    log('post /find-or-create');
    usersModel.findOrCreate({
            id:req.params.username,
            username:req.params.username,
            password:req.params.password,
            provider:req.params.provider,
            lastName:req.params.lastName,
            givenname:req.params.givenName,
            middleName:req.params.middleName,
            emails:req.params.emails,
            photos:req.params.photos
    })
    .then(result=>{
        log('find-or-create',util.inspect(result));
        res.send(result);
        next(false);
    })
    .catch(err=>{
        res.send(500,err);
        error(err.stack);
        next(false);
    });
});

server.get('/find/:username',(req,res,next)=>{
    log("get /find/:username");
    usersModel.find(req.params.username)
    .then(result=>{
        if(result)
            res.send(result);
        else 
            res.send(404, new Error("Did not find "+req.params.username));
        next(false);
    })
    .catch(err=>{
        res.send(500,err);
        error(err.stack);
        next(false);
    });
});


server.del('/destroy/:username',(req,res,next)=>{
    log('del /destroy/:username');
    usersModel.destroy(req.params.username)
    .then(()=>{
        res.send({});
        next(false);
    })
    .catch(err=>{
        res.send(500,err);
        error(err.stack);
        next(false);
    })
});

server.post('/passwordCheck',(req,res,next)=>{
    log('passwordCheck');
    usersModel.userPasswordCheck(req.params.username,req.params.password)
    .then(result=>{
        res.send(result);
        next(false);
    })
    .catch(err=>{
        res.send(500,err);
        error(err.stack);
        next(false);
    });
});

server.get('/list',(req,res,next)=>{
    log('list');
    usersModel.listUsers()
    .then(users=>{
        if(!users) users=[];
        res.send(users);
        next(false);
    })
    .catch(err=>{
        res.send(500,err);
        error(err.stack);
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

