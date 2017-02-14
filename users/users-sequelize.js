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
            photos:Selection.STRING(2048)
        });
        return SQUser.sync();
    });
};
