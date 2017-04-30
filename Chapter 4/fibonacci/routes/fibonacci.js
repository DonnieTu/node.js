var express=require('express');
var router=express.Router();

var math=require('../math');
router.get('/',function(req,res,next){
    if(req.query.fibonum) {
        /*math.fibonacciAsync(req.query.fibonum,(err,val)=>{
            res.render('fibonacci',{
                title:"Calculate Fibonacci numbers",
                fibonum: req.query.fibonum,
                fiboval: val});
        });*/
        var httpreq=require('http').request({
            hostname:"localhost",
            port:3002,
            path:'/fibonacci/'+Math.floor(req.query.fibonum),
            method:'GET'
        },
        (httpres)=>{
            httpres.on('data',(chuck)=>{
                var data=JSON.parse(chuck);
                res.render('fibonacci',{
                    title:"Calculate Fibonacci numbers",
                    fibonum: req.query.fibonum,
                    fiboval: data.result});
                });
            httpres.on('error',err=>{next(err);});
        });
        httpreq.on('error',err=>next(err));
        httpreq.end();
    } else {
        res.render('fibonacci',{
            title: "Calculate Fibonacci numbers",
            fiboval:undefined
        });
    }
});

module.exports=router;