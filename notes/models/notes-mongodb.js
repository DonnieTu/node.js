'use strict'

const util=require('util');
var MongoClient = require('mongodb').MongoClient;
const Promise=require('bluebird');
const fs=require('fs-extra');

const log=require('debug')('notes:mongodb-model');
const error=require('debug')('notes:error');

const Note=require('./notes');

var db;

function connectDB() {
    return new Promise((resolved,reject)=>{
        if(db) return resolved(db);
        else {
            //var url=process.env.Mongo_Url;
            var url="mongodb://localhost/chap07";
            MongoClient.connect(url,(err,_db)=>{
                if(err) reject(err);
                else {
                    db=_db;
                    resolved(_db);
                }
            });
        }
    });
}

exports.create=function(key,title,body) {
    return connectDB()
    .then((db)=>{
        var collection=db.collection("notes");
        var note=new Note(key,title,body);
        return collection.insertOne({
            key:key,
            title:title,
            body:body
        }).then(()=>{return note;});
    });
};

exports.update=function(key,title,body) {
    return connectDB()
    .then(db=>{
        var collection=db.collection("notes");
        var note=new Note(key,title,body);
        return collection.updateOne(
            {key:key},
            {$set:{title:title,body:body}})
            .then(()=>{return note;});
    });
};


exports.read=function(key) {
    return connectDB()
    .then(db=>{
        var collection=db.collection("notes");
        return collection.findOne({key:key}).then(doc=>{
            var note=new Note(doc.key,doc.title,doc.body);
            return note;
        });
    });
};

exports.destroy=function(key) {
    return connectDB()
    .then(db=>{
        var collection=db.collection("notes");
        return collection.deleteOne({key:key});
    });
};

exports.keylist=function() {
    return connectDB()
    .then(db=>{
        return new Promise((resolved,reject)=>{
            var collection=db.collection("notes");
            var keys=[];
            collection.find({}).forEach((doc)=>{
                keys.push(doc.key);
            },
            (err)=>{
                if (err) reject(err);
                else
                    resolved(keys);
            });
        });
    });
};

exports.count=function() {
    return connectDB()
    .then(db=>{
        var collection=db.collection("notes");
        return collection.find({}).count();
    });
};







