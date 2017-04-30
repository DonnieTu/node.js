var express=require('express');
var math=require('./math');
var logger=require('morgan');

var app=express();
app.use(logger('dev'));

app.get('/fibonacci/:n',(req,res,next)=>{
    math.fibonacciAsync(Math.floor(req.params.n),(err,val)=>{
        if(err) next('Fibo server error '+err);
        else {
            res.send({
                n:req.params.n,
                result:val
            });
        }
    });
});

app.listen(process.env.SERVERPORT?process.env.SERVERPORT:3002);
