var express = require('express');
var router = express.Router();
var notes=require('../models/notes-memory');

/* GET home page. */
router.get('/', function(req, res, next) {
  notes.keylists()
  .map((note)=>{return notes.read(key);})
  .then(notelist=>{
      res.render('index', { title: 'Node',nodelist:notelist });
  });
});

module.exports = router;
