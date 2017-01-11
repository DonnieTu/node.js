'use strict'

var util=require('util');
var express=require('express');
var rounter=express.Router();
var notes=require('../models/notes-memory');

rounter.get('/add',(req,res,next) => {
    res.render('noteedit',{
        title:"add a Note",
        docreate: true,
        notekey: "",
        note:undefined
    });
});

module.exports=rounter;