'use strict';
const assert=require('chai').assert;
const model=require(process.env.MODEL_TO_TEST);

describe("Model Test", function(){
    beforeEach(function(){
        return model.keylist()
        .then(keys=>{
            var todel=keys.map(key=>model.destory(key));
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
            })
        });
    });

    describe("should have keys n1 n2 n3",function(){
        return model.keylist()
        .then(keys=>{
            keys.forEach((key)=>{
                assert.match(key,/n[123]/,"correct key");
            });
        });
    });

    describe("Should have titles Node #",function(){
        return model.keylist()
        .then(keys=>{
            var keyPromises=keys.map(key=>{
                model.read(key);
            });
            Promises.all(keyPromises);
        })
        .then(notes=>{
            notes.forEach(note=>{
                assert.match(note.title,/Note [123]/);
            });
        });
    });

});