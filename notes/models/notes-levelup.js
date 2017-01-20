'use strict'

const util=require('util');
const levelup=require('levelup');
const Promise=require('bluebird');

const log=require('debug')('notes:levelup-model');
const error=require('debug')('notes:error');

const Note=require('./notes');

var db;

function connectDB() {
    return new Promise((resolve,reject)=>{
        if(db) return resolve(db);
        levelup(process.env.LEVELUP_DB_LOCATION||'notes.levelup',{
            createIfMissing:true,
            valueEncoding:'json'
        },
        (err,_db)=> {
            if(err) return reject(err);
            db=_db;
            resolve();
        });
    });
}

exports.update=exports.create=function(key,title,body) {
    return connectDB().then(()=>{
        var note=new Note(key,title,body);
        return new Promise((resolve,reject)=>{
            db.put(key,note,err=>{
                if(err) reject(err);
                else resolve(note);
            });
        });
    });
};

exports.read=function(key) {
    return connectDB().then(()=>{
        return new Promise((resolve,reject)=>{
            db.get(key,(err,value)=>{
                if(err) reject(err);
                else (resolve(new Note(value.key,value.title,value.body)));
            });
        });
    });
};

exports.destory=function(key) {
    return connectDB().then(()=>{
        return new Promise((resolve,reject)=>{
            db.delete(key,err=>{
                if(err) reject(err);
                else resolve();
            });
        });
    });
};

exports.keylist=function(){
    return connectDB().then(()=>{
        return new Promise((resolve,reject)=>{
            var keys=[];
            db.createKeyStream()
            .on('data',data=>{keys.push(data);})
            .on('error',err=>{reject(err);})
            .on('end',()=>{resolve(keys);});
        });
    });
};

exports.count=function() {
    return connectDB().then(()=>{
        return new Promise((resolve,reject)=>{
            var count=0;
            db.createReadStream()
             .on('data',()=>{count++;})
             .on('end',()=>resolve(count))
             .on('error',()=>reject(err))
        });
    });
};
