'use strict';

const assert=require('chai').assert;
const restify=require('restify');
const url=require('url');

var userClient;

describe("Users Test",function(){
    before(function() {
        userClient=restify.createJsonClient({
            url:url.format({
                protocol:"http",
                hostname:process.env.HOST_USERS_TEST,
                port:process.env.PORT
            }),
            version:'*'
        });
        userClient.basicAuth('them','D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
    });

    beforeEach(function(){
        return new Promise((resolve,reject)=>{
            userClient.post('/find-or-create',{
                username: "me", password: "w0rd", provider: "local",            
                familyName: "Einarrsdottir", givenName: "Ashildr",            
                middleName: "", emails: [], photos: []
            },
            (err,req,res,obj)=>{
                if(err) reject(err);
                else resolve();
            });
        });
    });

    afterEach(function() {
        return new Promise((resolve,reject)=>{
            userClient.del('/destroy/me',(err,req,res,obj)=>{
                if(err) reject(err);
                else resolve();
            });
        });
    });

    describe("List user",function(){
        it("list created users",function(){
            return new Promise((resolve,reject)=>{
                userClient.get('/list',(err,req,res,obj)=>{
                    if(err) reject(err);
                    else {
                        if(obj.length<=0)
                            reject(new Error("no users found"));
                        else
                            resolve();
                    }
                });
            });
        });
    });
});