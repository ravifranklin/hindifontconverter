import {test} from 'node:test';
import assert from 'node:assert/strict';
import {routes} from '../lib/routes';
import {reverseRoute,switchDraft} from '../lib/direction';
import {convert} from '../lib/conversion/engine';
for(const route of routes)test(`switch ${route.slug} both directions with multiline text`,()=>{
 const reverse=reverseRoute(route);assert.equal(reverseRoute(reverse).slug,route.slug);
 const input=convert('भारत\n\nनेपाल','unicode',route.from),output=convert(input,route.from,route.to);
 const next=switchDraft({input,output,converted:true});assert.equal(next.input,output);assert.equal(next.output,'');assert.equal(next.convertNow,true);
 const actual=convert(next.input,reverse.from,reverse.to);
 const back=switchDraft({input:next.input,output:actual,converted:true});assert.equal(back.input,actual);
});
test('unconverted or invalidated draft never becomes reverse source; switch back restores it',()=>{
 const original={input:'unfinished draft',output:'',converted:false};
 const next=switchDraft(original);assert.deepEqual(next,{input:'',output:'',converted:false,convertNow:false});
 assert.equal(switchDraft(next,original).input,'unfinished draft');
 assert.equal(switchDraft({...original,output:'stale'}).input,'');
});
test('edited result, including empty result, is authoritative after conversion',()=>{
 assert.equal(switchDraft({input:'old',output:'edited\nresult',converted:true}).input,'edited\nresult');
 assert.equal(switchDraft({input:'old',output:'',converted:true},{input:'saved',output:'stale',converted:true}).input,'');
});
