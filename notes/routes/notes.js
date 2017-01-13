'use strict'

var util=require('util');
var express=require('express');
var rounter=express.Router();
var notes=require('../models/notes-memory');

rounter.get('/add',(req,res,next) => {
    res.render('noteedit',{
        title:"add a note",
        docreate: true,
        notekey: "",
        note:undefined
    });
});

rounter.post('/save',(req,res,next)=>{
    var promise;
    if(req.body.docreate=='create') 
        promise=notes.create(req.body.notekey,req.body.title,req.body.body);
    else
        promise=notes.update(req.body.notekey,req.body.title,req.body.body);
    promise.then((note)=>{
        res.redirect('/notes/view?notekey='+note.key);
        })
    .catch(err=>next(err));
});

rounter.get('/view',(req,res,next)=>{
    notes.read(req.query.notekey)
    .then((note)=>{
        res.render('noteview',{
            title:note.title,
            note:note
        });
    })
    .catch(err=>next(err));
});

module.exports=rounter;