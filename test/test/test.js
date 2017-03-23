var assert=require('assert');
const df=require('../deleteFile');
const fs = require('fs');

 before(function() {
    return fs.writeFile('test.dumy',"a dumy file",(err)=>{
        if(err) throw err;
    });
});

describe('Array', function(){

    describe('#indexOf()',function(){
        it('Should return -1 when the value is not present',function(){
            assert.equal(-1,[1,2,3].indexOf(4));
        });
    });
});

describe('my suite', function() {
  it('my test', function(done){
    // should set the timeout of this test to 1000 ms; instead will fail
    this.timeout(50);
    done();
  });
});


describe.only('deleteFile',function(){
    it('should fail when delete no existing file', function(done){
        df.deleteFile('no-such-file',function(err){
            if(err) 
                done();
            else
                done(Error("delete unexisting fail"));
        });
    });

    it('should delete the existing file',function(done){
        df.deleteFile('test.dumy',function(err) {
            if(err)
                done(err);
            else if(fs.existsSync('test.dumy'))
                done("fail to delete test.dumy");
            else 
                done();
        });
    });

    it('should return -1 when the value is not present');
});