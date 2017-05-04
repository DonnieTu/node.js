var should=require('chai').should();
var notes=require('../models/notes-memory');

describe('Notes',function() {
    describe('create',function(){
        it('should create note 1',function(){
            notes.create('key1','title1','body1')
            .then(value=>{
                return notes.read('key1');
            })
            .then(note=>{
                note.key.should.equal('key1');
                note.title.should.equal('title1');
                note.body.should.equal('body1');
            });
        });
    });
});