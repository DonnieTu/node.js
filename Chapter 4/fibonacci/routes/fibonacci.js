var express=require('express');
var router=express.Router();

var math=require('../math');
router.get('/',function(req,res,next){
    if(req.query.fibonum) {
        res.render('fibonacci',{
            title:"Calculate Fibonacci numbers",
            fibonum: req.query.fibonum,
            fiboval:math.fibonacci(req.query.fibonum)
        });
    } else {
        res.render('fibonacci',{
            title: "Calculate Fibonacci numbers",
            fiboval:undefined
        });
    }
});

module.exports=router;