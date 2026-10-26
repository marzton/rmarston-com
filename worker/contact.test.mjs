import assert from 'node:assert/strict';
import test from 'node:test';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, nextResolve) { if (specifier === 'cloudflare:email') return {url:'data:text/javascript,export class EmailMessage { constructor(from,to,raw){this.from=from;this.to=to;this.raw=raw;} }',shortCircuit:true}; return nextResolve(specifier,context); } });
const {default:worker}=await import('./index.ts');
function request(){const form=new FormData();for(const [k,v]of Object.entries({name:'Test Person',email:'test@example.com',message:'Hello',subject:'quote'}))form.set(k,v);return new Request('https://api.rmarston.com/api/contact',{method:'POST',body:form});}
test('missing mail transport cannot return success',async()=>{const r=await worker.fetch(request(),{});assert.equal(r.status,503);assert.equal((await r.json()).success,undefined)});
test('configured email binding sends the inquiry',async()=>{const sent=[];const r=await worker.fetch(request(),{SEND_EMAIL:{send:async m=>sent.push(m)},CONTACT_FROM_EMAIL:'hello@rmarston.com',CONTACT_TO_EMAIL:'rob@rmarston.com'});assert.equal(r.status,200);assert.equal((await r.json()).success,true);assert.equal(sent.length,1);assert.equal(sent[0].from,'hello@rmarston.com');assert.equal(sent[0].to,'rob@rmarston.com');assert.match(sent[0].raw,/Reply-To: test@example.com/);assert.match(sent[0].raw,/Hello/);});
test('mail transport failure is returned to the caller',async()=>{const r=await worker.fetch(request(),{SEND_EMAIL:{send:async()=>{throw Error('unavailable')}}});assert.equal(r.status,500);assert.equal((await r.json()).success,undefined);});
test('preflight does not require a mail transport',async()=>{const r=await worker.fetch(new Request('https://api.rmarston.com/api/contact',{method:'OPTIONS'}),{});assert.equal(r.status,204);assert.equal(r.headers.get('Access-Control-Allow-Origin'),'https://rmarston.com');});

