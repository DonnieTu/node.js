var chai=require('chai')
var notes=require('../models/notes-memory');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

describe('Notes',function() {
    before(function (){
        notes.create('key1','title1','body1')
        .then(()=>{
            return notes.create('key2','title2','body2');
        });
    });


    it('should have note 1',function(done){
        notes.read('key1')
        .then(note=>{
                note.key.should.equal('key1');
                note.title.should.equal('title1');
                note.body.should.equal('body1');
                done();
        })
        .catch(err=> {
            done(err);
        });
    });

    it('should have 2 notes',function(){
        return notes.count().should.eventually.equal(2);
    });

    it('keylist should be right',function(){
        return notes.keylist().should.eventually.eql(['key1','key2']);
    });

    it("should delete key1", function(done) {
        notes.destory('key1')
        .then(()=>{
            return notes.read('key1');
        })
        .catch(err=>{
            done();
        });
    });
});