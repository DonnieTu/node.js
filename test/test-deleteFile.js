const df=require('deleteFile');
const assert=require('assert');
const log=require('debug')('test');
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

try {
df.deleteFile('no-such-file',err=>{
    assert.doesNotThrow(()=>{
        if(err) throw err;
    },
    TypeError,
    'unexpected error'
    )
});
}
catch(e) {
    
}