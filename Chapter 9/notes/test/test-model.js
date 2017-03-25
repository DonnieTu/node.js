'use strict';
const assert=require('chai').assert;
const model=require(process.env.MODEL_TO_TEST);


describe("Model Test", function(){
    beforeEach(function(){
        return model.keylist()
        .then(keys=>{
            var todel=keys.map(key=>model.destroy(key));
            return Promise.all(todel);
        })
        .then(()=>{
            return Promise.all(
            [
                model.create("n1","Note 1","Note 1"),
                model.create("n2","Note 2","Note 2"),
                model.create('n3',"Note 3","Note 3")
            ]);
        });
    });

    describe("check keylist", function(){
        it("should have three entries",function(){
            return model.keylist()
            .then(keys=>{
                assert.equal(3,keys.length,"length 3");
            });
        });


        it("should have keys n1 n2 n3",function(){
            return model.keylist()
            .then(keys=>{
                keys.forEach((key)=>{
                    assert.match(key,/n[123]/,"correct key");
                });
            });
        });

        it("Should have titles Node #",function(){
            return model.keylist()
            .then(keys=>{
                var keyPromises=keys.map(key=>{
                    return model.read(key);
                });
                return Promise.all(keyPromises);
            })
            .then(notes=>{
                notes.forEach(note=>{
                    assert.match(note.title,/Note [123]/);
                });
            });
        });     
    });

    describe("check read",function(){
        it("should read correct",function(){
            return model.read('n1')
            .then(note=>{
                assert.equal(note.key,'n1');
                assert.equal(note.title,'Note 1');
                assert.equal(note.body,'Note 1');
            });
        });

        it('shuold fail to read unexisting item',function(){
            return model.read("noitem")
            .then(note=>{
                throw(new Error("Should no go there"));
            })
            .catch(err=>{
                //it's right here for testing
            });
        });
    });

    describe("check update ",function(){
        it("should update the item ",function(){
            return model.update('n1',"Note 1-1","Note 1-body")
            .then(note=>{
                return model.read('n1');
            })
            .then(note=>{
                assert(note.key,'n1');
                assert(note.title,"Note 1-1");
                assert(note.body,"Note 1-body");
            })
        });
    });

    describe("check delete",function(){
        it("should delete one item",function(){
            return model.destroy('n1')
            .then(()=>{
                return  model.keylist()
                .then(keys=>{
                    assert(keys.length,2);
                });
            });
        });
    });
});