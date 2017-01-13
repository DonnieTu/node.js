var express = require('express');
var router = express.Router();
var notes=require('../models/notes-memory');


/* GET home page. */
router.get('/', function(req, res, next) {
  notes.keylist()
  .map((key)=>{
    return notes.read(key);
  })
  .then(notelist=>{
      res.render('index', { title: 'Node',notelist:notelist });
  })
  .catch(err=>{next(err);});
});

module.exports = router;
