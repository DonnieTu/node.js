'use strict'

var util=require('util');
var express=require('express');
var rounter=express.Router();
var notes=require('../models/notes-memory');

rounter.get('/add',(req,res,next) => {
    res.render('noteedit',{
        title:"add a note",
        docreate: true,
        noteKey: "",
        note:undefined,
        breadcrumbs: [
            {href:'/',text:'Home'},
            {active:true, text: 'Add Note'}
        ],
        hideAddNote:true     
    });
});

rounter.get('/edit',(req,res,next)=>{
    notes.read(req.query.noteKey)
    .then((note)=>{
        res.render('noteedit',{
            title:"edit a note",
            docreate: false,
            noteKey:note.key,
            note:note,
            breadcrumbs: [
                {href:'/',text:'Home'},
                {active:true,text:note.title}
            ]
        });
    })
    .catch(err=>{
        next(err);
    });
});

rounter.post('/save',(req,res,next)=>{
    var promise;
    if(req.body.docreate=='create') 
        promise=notes.create(req.body.noteKey,req.body.title,req.body.body);
    else
        promise=notes.update(req.body.noteKey,req.body.title,req.body.body);
    promise.then((note)=>{
        res.redirect('/notes/view?noteKey='+note.key);
        })
    .catch(err=>next(err));
});

rounter.get('/view',(req,res,next)=>{
    notes.read(req.query.noteKey)
    .then((note)=>{
        res.render('noteview',{
            title:note.title,
            note:note,
            breadcrumbs: [
                { href:'/',text:'Home'},
                {active:true, text:note.title}    
            ]
        });
    })
    .catch(err=>next(err));
});

rounter.get('/destory',(req,res,next)=>{
    notes.read(req.query.noteKey)
    .then(note=>{
        res.render('notedestory',{
            title:note?note.title:'',
            noteKey:note?note.key:'',
            note:note,
            breadcrumbs:[
                {href:'/',text:'Home'},
                {active:true,text:'Delete Note'}
            ]
        });
    })
    .catch(err=>next(err));
});

rounter.post('/destory/confirm',(req,res,next)=>{
    notes.destory(req.body.noteKey)
    .then(()=>res.redirect('/'))
    .catch(err=>next(err));
});

module.exports=rounter;