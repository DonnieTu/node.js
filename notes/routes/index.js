var express = require('express');
var path=require('path');
var notes=require(process.env.NOTES_MODEL
  ?path.join('..',process.env.NOTES_MODEL)
  :'../models/notes-memory');
var log=require('debug') ('notes:reouter-home');
var error=require('debug')('notes:error');

var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  notes.keylist()
  .map((key)=>{
    return notes.read(key);
  })
  .then(notelist=>{
      res.render('index', { 
        title: 'Node',
        notelist:notelist,
        user: req.user ? req.user : undefined,
        breadcrumbs: [
          {href: '/',text:'Home'}
        ]
      });
  })
  .catch(err=>{next(err);});
});

module.exports = router;
