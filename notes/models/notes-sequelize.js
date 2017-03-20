'use strict'

const util=require('util');
const Sequelize=require('sequelize');
const Promise=require('bluebird');
const jsyaml=require('js-yaml');
const fs=require('fs-extra');

const log=require('debug')('notes:sequelize-model');
const error=require('debug')('notes:error');

const Note=require('./notes');
exports.events = require('./notes-events');

function connectDB() {
    var SQNote;
    var sequlz;

    if(SQNote) return SQNote.sync();

    return new Promise((resolve,reject)=>{
        fs.readFile(process.env.SEQUELIZE_CONNECT,'utf8',
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
            key: {
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
    return connectDB()
    .then((SQNote)=>{
        return SQNote.create({
            key:key,
            title:title,
            body:body
        })
    })
    .then(newnote=>{
        exports.events.noteCreate({
            key:newnote.key,
            title:newnote.title,
            body:newnote.body
        });
        return newnote;
    });
};

exports.update=function(key,title,body) {
    return connectDB().then((SQNote)=>{
        return SQNote.findById(key)
        .then(note=>{
            if(!note) {
                throw new Error("no note found for key "+key);
            } else {
                note.title=title;
                note.body=body;
                return note.save();
            }
        })
        .then(note=>{
            exports.events.noteUpdate({
                key,
                title:note.title,
                body:note.body
            });
            return new Note(note.key,note.title,note.body);
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
                return new Note(note.key,note.title,note.body);
            }
        });
    });
};

exports.destroy=function(key) {
    return connectDB().then((SQNote)=>{
        return SQNote.findById(key)
        .then(note=>{
            if(!note) 
                throw new Error("no note found for key "+key);
            else
                return note.destroy();
        })
        .then(()=>{
            exports.events.noteDestory({key});
        });
    });
};

exports.keylist=function() {
    return connectDB().then((SQNote)=>{
       return SQNote.findAll({attributes:['key']})
       .then((notes)=>{
           return notes.map(note=>note.key);
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

exports.events=require('./notes-events');