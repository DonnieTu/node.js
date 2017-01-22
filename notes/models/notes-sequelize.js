'use strict'

const util=require('util');
const Sequelize=require('sequelize');
const Promise=require('bluebird');
const jsyaml=require('js-yaml');
const fs=require('fs-extra');

const log=require('debug')('notes:sequelize-model');
const error=require('debug')('notes:error');

const Note=require('./notes');

exports.connectDB=function() {
    var SQNote;
    var sequlz;

    if(SQNote) return SQNote.sync();

    return new Promise((resolve,reject)=>{
        fs.readFile(process.evn.SEQUELIZE_CONNECT,'utf8',
        (err,data)=>{
            if(err) reject(err);
            else resolve(data);
        });
    })
    .then(yamtext=>{
        return jsyaml.safeLoad(yamtext);
    })
    .then(params=>{
        sequlz=new Sequelize(params.dbname,params.username,params.password,params.params);
        SQNote=sequlz.define('notes',{
            notekey: {
                type:Sequelize.STRING,
                primaryKey:true,
                unique:true
            },
            title: Sequelize.STRING,
            body: Sequelize.TEXT
        });
        return SQNote.sync();
    });
};

exports.create=function(key,title,body) {
    return connectDB().then((SQNote)=>{
        return SQNote.create({
            notekey:key,
            title:title,
            body:body
        });
    });
};

exports.update=function(key,title,body) {
    return connectDB().then((SQNote)=>{
        SQNote.findById(key)
        .then(note=>{
            if(!note) {
                throw new Error("no note found for key "+key);
            } else {
                note.title=title;
                note.body=body;
                return note.save();
            }
        });
    });
};

exports.read=function(key) {
    return connectDB().then((SQNote)=>{
        return SQNote.findById(key)
        .then(note=>{
            if(!note) 
                throw new Error("no note found for key "+ key);
            else {
                return new Note(note.notekey,note.title,note.body);
            }
        });
    });
};

exports.destory=function(key) {
    return connectDB().then((SQNote)=>{
        return SQNote.findById(key)
        .then(note=>{
            if(!note) 
                throw new Error("no note found for key "+key);
            else
                return note.destory();
        });
    });
};

exports.keylist=function() {
    return connectDB().then((SQNote)=>{
       return SQNote.findAll({attributes:['notekey']})
       .then((notes)=>{
           return notes.map(note=>note.notekey);
       });
    });
};

exports.count=function() {
    return connectDB().then((SQNote)=>{
        SQNote.count()
        .then(count=>{
            return count;
        });
    });
};