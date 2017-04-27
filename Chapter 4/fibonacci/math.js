
var fibonacci=exports.fibonacci=function(n) {
    if(n==1) return 1;
    else if(n==2) return 1;
    else return fibonacci(n-1)+fibonacci(n-2);
};

var fibonacciAsync=exports.fibonacciAsync=function(n,cb) {
    if(n<=0)
        cb(undefined,0);
    if(n==1 || n==2)  cb(undefined,1);
    else {
        setImmediate(function(){
            fibonacciAsync(n-1,function(err,val1) {
                if(err) cb(err);
                else {
                    setImmediate(function() {
                        fibonacciAsync(n-2,function(err,val2){
                            if(err) cb(err);
                            else 
                                cb(undefined,val1+val2);
                        });
                    });
                }
            })
        });
    }
};