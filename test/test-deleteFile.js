const df=require('./deleteFile');
const assert=require('assert');

df.deleteFile('no-such-file',err=>{
    assert.throws(()=>{
        if(err) throw err;
    },
    function (error) {
        if(error instanceof Error && /does not exist/.test(error))
            return true;
        else
            return false;
    },
    'unexpected error'
    )
});