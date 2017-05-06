var express = require('express');
var router = express.Router();
var notes=require('../models/notes-memory');

/* GET home page. */
router.get('/', function(req, res, next) {
  notes.keylist()
    .then(keylist=>{
      var promises=[];
      for (var key of keylist) {
        promises.push(notes.read(key)
          .then(note=>{
            return {key:note.key,title:note.title};
          }))
      }
      return Promise.all(promises);
    })
    .then(notelist=>{
      res.render('index', { 
        title: 'Notes',
        notelist: notelist
      });
    })
    .catch(err=>next(err));
});

module.exports = router;
