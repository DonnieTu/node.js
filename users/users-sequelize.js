'use strict';

const Sequelize= require('sequelize');
const jsyaml=require('js-yaml');
const fs=require('fs');
const util=require('util');
const log=require('debug')('users:model-users');
const error=require('debug')('users:error');

var SQUser;
var sequlz;

exports.connectDB=function() {
    if(SQUser) return SQUser.sync();

    return new Promise((resolve,reject)=>{
        fs.readFile(process.env.SEQUELIZE_CONNECT,'utf8',(err,data)=>{
            if(err) reject(err);
            else resolve(data);
        });
    })
    .then(yamltext=>{
        return jsyaml.safeLoad(yamltext,'utf8');
    })
    .then(params =>{
        if(!sequlz) sequlz=
            new Sequelize(params.dbname,params.username,params.password,params.params);

        if(!SQUser) SQUser=sequlz.define('User',{
            provider:Sequelize.STRING,
            username:{type:Sequelize.STRING,unique:true,primaryKey:true},
            password:Sequelize.STRING,
            familyName:Sequelize.STRING,
            giveName:Sequelize.STRING,
            middleName:Sequelize.STRING,
            emails:Sequelize.STRING(2048),
            photos:Sequelize.STRING(2048)
        });
        return SQUser.sync();
    });
};

exports.create=function(username, password, provider, familyName, givenName, middleName, emails, photos) {
    return exports.connectDB()
    .then(SQUser=>{
        return SQUser.create({
            username: username,
            password: password,
            provider: provider,
            familyName: familyName,
            givenName: givenName,
            middleName: middleName,
            emails: JSON.stringify(emails),
            photos: JSON.stringify(photos)
        });
    });
};

exports.update=function(username, password, provider, familyName, givenName, middleName, emails, photos) {
    return exports.connectDB()
    .then(SQUser=>{
        return SQUser.findOne({where: {username:username}});
    })
    .then(user=>{
        return user?user.update({
            password: password,
            provider: provider,
            familyName: familyName,
            givenName: givenName,
            middleName: middleName,
            emails: JSON.stringify(emails),
            photos: JSON.stringify(photos)
        }):undefined;
    });
};

exports.find=function(username) {
    log('find '+username);
    return exports.connectDB()
    .then(SQUser=>{
        return SQUser.findOne({where: {username:username}});
    })
    .then(user=>{
        user?exports.sanitizedUser(user):undefined;
    });
};

exports.destory=function(username) {
    return exports.connectDB()
    .then(SQUser=>{
        return SQUser.findOne({where:{username:username}});
    })
    .then(user=>{
        if(!user) throw new Error ("Did not find requested "+username+ ' to delete');
        user.destory();
        return;
    });
};

exports.userPasswordCheck=function(username,password) {
    return exports.connectDB().then(SQUser=>{
        return SQUser.findOne({where:{username:username}});
    })
    .then(user=>{
        if(!user) {
            return {check:false, username:username,message:"Could not find user"};
        } else if(user.username==username && user.password==password) {
            return {check:true,username:user.username};
        } else {
            return {check:false,username:username,message:"Incorrect password"};
        }
    });
};

exports.findOrCreate=function(profile) {
    return exports.find(profile.id)
    .then(user=>{
        if(user) return user;
        return exports.create(profile.id, profile.password,
            profile.provider, profile.familyName,
            profile.givenName, profile.middleName,
            profile.emails, profile.photos);
    });
};

exports.sanitizedUser = function(user) {
    return {
        id: user.username,
        username: user.username,
        provider: user.provider,
        familyName: user.familyName,
        givenName: user.givenName,
        middleName: user.middleName,
        emails: user.emails,
        photos: user.photos
    };
};

exports.listUsers=function(){
    exports.connectDB()
    .then(SQUser=>SQUser.findAll({}))
    .then(users=>users.map(
        user=>exports.sanitizedUser(user))
    )
    .catch(err=>error(err));
};

