'use strict'

const util=require('util');
const sqlite3=require('sqlite3');
const Promise=require('bluebird');

const log=require('debug')('notes:sqlite3-model');
const error=require('debug')('notes:error');

const Note=require('./notes');

sqlite3.verbose();
var db;

function connectDB () {
    return new Promise((resolve,reject)=>{
        if(db)  return resolve(db);
        var dbfile = process.env.SQLITE_FILE || "notes.sqlite3";
        db=new sqlite3.Database(dbfile,sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,err=>{
            if(err) reject(err);
            else {
                log('Opened SQLite3 database '+ dbfile);
                resolve(db);
            }
        });
    });
};

exports.create=function(key,title,body) {
   return connectDB().then(()=>{
    var note=new Note(key,title,body);
    return new Promise((resolve,reject)=>{
        db.run("INSERT INTO notes (key,title,body) "+
            "VALUES (?,?,?);",
            [key,title,body],err=>{
                if(err) reject(err);
                else {
                    log("CREATE "+util.inspect(note));
                    resolve(note);
                }
            });
        });
    });
};

exports.update=function(key,title,body) {
    return connectDB().then(()=>{
        var note=new Note(key,title,body);
        return new Promise((resolve,reject)=>{
            db.run("UPDATE notes SET title=?,body=? where key=?",
            [title,body,key],err=>{
                if(err) reject(err);
                else {
                    log('UPDATE '+util.inspect(note));
                    resolve(note);
                }
            });  
        });
    });
};

exports.read=function(key) {
    return connectDB().then(()=>{
        return new Promise((resolve,reject)=>{
            db.get("SELECT * FROM notes where key=?",
                [key], (err,data)=>{
                    if(err) reject(err);
                    else {
                        var note=new Note(data.key,data.title,data.body);
                        log('read '+util.inspect(note));
                        resolve(note);
                    }
                });
        });
    });
};

exports.destroy=function(key) {
    return connectDB().then(()=>{
        return new Promise((resolve,reject)=>{
            db.run("DELETE  FROM notes WHERE key=?",[key],err=>{
                if(err) reject(err);
                else {
                    log('delete '+ key);
                    resolve();
                }
            });
        });
    });
};

exports.keylist=function() {
    return connectDB().then(()=>{
        return new Promise((resolve,reject)=>{
            var keys=[];
            db.each('SELECT key FROM notes',
                (err,row)=>{
                    if(err) reject(err);
                    else {
                        keys.put(row.key);
                    }
                },
                (err,number)=>{
                    if(err) reject(err);
                    else {
                        resolve(keys);
                    }
                });
        });
    });
};

exports.count=function() {
    return connectDB().then(()=>{
        return new Promise((resolve,reject)=>{
            db.run("SELECT count(key) as count FROM notes",(err,row)=>{
                if(err) reject(err);
                else {
                    resolve(row.count);
                }
            });
        });
    });
};