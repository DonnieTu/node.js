var fibonacci=exports.fibonacci=function(n,cb) {
    if(n==1 || n==2) 
        cb(null,1);
    else {
        setImmediate(fibonacci,n-1,(err,val1)=>{
               console.log("fibonacci of "+(n-1) +": "+val1);
               if(err) cb(err);
               setImmediate(fibonacci,n-2,(err,val2)=>{
                    console.log("fabonacci of "+ (n-2)+ ": "+val2);
                    if(err) cb(err);
                    cb(null,val1+val2);
                });
            });
       //return fibonacci(n-1)+fibonacci(n-2);
    }
};