//fibonacci
var express = require('express');
var router = express.Router();
var math=require('../math');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.query.fibonum) {
      math.fibonacci(req.query.fibonum,(err,val)=>{
            res.render('fibonacci', { 
              title: 'Math Calculator',
              fibonum:req.query.fibonum,
              fiboval:val
            });
        });
  } else {
    res.render('fibonacci', { 
      title: 'Math Calculator',
      fibonum:undefined
      });
  }
});

module.exports = router;