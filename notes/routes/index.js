var express = require('express');
var path=require('path');
var notes=require(process.env.NOTES_MODEL
  ?path.join('..',process.env.NOTES_MODEL)
  :'../models/notes-memory');
var log=require('debug') ('notes:reouter-home');
var error=require('debug')('notes:error');

var router = express.Router();


var getKeyTitlesList=function() {
  return notes.keylist()
  .map((key)=>{
    return notes.read(key);
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  getKeyTitlesList()
  .then(notelist=>{
      res.render('index', { 
        title: 'Node',
        notelist:notelist,
        user: req.user ? req.user : undefined,
        breadcrumbs: [{href: '/',text:'Home'}]
      });
  })
  .catch(err=>next(err));
});


module.exports = router;

module.exports.socketio=function(io){
  var emitNoteTitles=function(){
    getKeyTitlesList()
    .then(notelist=>{
      io.of('/home').emit('notetitles',{notelist});
    });
  };

  notes.events.on('notecreated',emitNoteTitles);
  notes.events.on('noteupdate',emitNoteTitles);
  notes.events.on('notedestroy',emitNoteTitles);
}

