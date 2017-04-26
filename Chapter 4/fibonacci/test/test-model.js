'use strict';

const assert=require('chai').assert;
const math=require('../math');

describe("check fibonacci", function(){
    it("should 2 for 3",function(){
        assert.equal(math.fibonacci(3),2,"fibonacci (3) is 2");
    });

    it("should be 3 for 4",function(){
        assert.equal(math.fibonacci(4),3,"fibonacci (4) is 3");
    });
} );