'use strict';
Promise=require('bluebird');

var notes=[];
const Note=require('./note');

exports.update=exports.create = funciton(key,title,body) {
    return new Promise((resolve,reject)=>{
        notes[key]=new Note(key,title,body);
        resolve(notes[key]);
    });
};

exports.read=function(key) {
    return new Promise((resolve,reject)=>{
        if(notes[key]) 
            resolve(notes[key]);
        else    
            reject(`Note ${key} does not exist!`);
    });
};

exports.destory=function(key) {
    return new Promise((resolve,reject)=>{
        if(nodes[key]){
            delete notes[key];
            resolve();
        } else {
            reject(`Note ${ke} does not exist!`);
        };
    });
};

exports.keylist=function {
    return new Promises((resolve,reject)=> {
        resolve(notes.keys)
    });
};

exports.count=function(){
    return new Promise((resolve,reject)=>{
        resolve(notes.length);
    });
};