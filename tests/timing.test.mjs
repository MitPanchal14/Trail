import test from 'node:test';
import assert from 'node:assert/strict';
import {sample} from '../demo/timing.js';
test('monotonic elapsed, delayed callbacks, and remaining clamp',()=>{
  assert.deepEqual(sample({wall:1000,mono:0},{wall:8000,mono:7000},120000),{deltaMs:7000,interrupted:false,reason:null});
  assert.equal(sample({wall:0,mono:0},{wall:14000,mono:14000},50).deltaMs,50);
});
test('discard the entire uncertain gap, clock reversal or disagreement',()=>{
  for(const c of [{wall:15001,mono:15001},{wall:-1,mono:5000},{wall:5000,mono:-1},{wall:9000,mono:5000},{wall:5000,mono:NaN}]){
    const result=sample({wall:0,mono:0},c,100000);assert.equal(result.deltaMs,0);assert.equal(result.interrupted,true);
  }
});
