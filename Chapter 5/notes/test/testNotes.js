var should=require('chai').should();
var notes=require('../models/notes-memory');

describe('Notes',function() {
    before(function (){
        notes.create('key1','title1','body1');
        notes.create('key2','title2','body2');
    });


    it('should create note 1',function(done){
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

    it('should have 2 notes',function(done){
        notes.count()
        .then(val=>{
           val.should.to.equal(2);
           done();
        })
        .catch(err=> {
            done(err);
        });
    });


    it('keylist should right',function(done){
        notes.keylist()
        .then(list=>{
             list.should.to.be.eql(['key1','key2']);
             done();
        })
        .catch(err=>{
            done(err);
        })
    });
});