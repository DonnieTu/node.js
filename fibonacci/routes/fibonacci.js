//fibonacci
var express = require('express');
var router = express.Router();
var math=require('../math');
var http=require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.query.fibonum) {
    var httpreq= http.request({
      host:'localhost',
      port:'3002',
      method:'GET',
      path: '/fibonacci/'+req.query.fibonum
    },httpres=>{
      httpres.on('data',chunk=>{
        res.render('fibonacci', { 
              title: 'Math Calculator',
              fibonum:req.query.fibonum,
              fiboval:JSON.parse(chunk).result
            });
      });
      httpres.on('error',err=>{
        console.log(err.message);
        next(err);
      });
    });
    httpreq.on('error',err=>{next(err);});
    httpreq.end();
  } else {
    res.render('fibonacci', { 
      title: 'Math Calculator',
      fibonum:undefined
      });
  }
});

module.exports = router;