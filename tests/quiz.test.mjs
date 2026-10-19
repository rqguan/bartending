import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const original = read('./fixtures/cocktailtest-original.html');
const integrated = read('../cocktailtest/index.html');
const script = html => html.match(/<script>([\s\S]*?)<\/script>/)[1];
function run(html) {
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {innerText:'0', innerHTML:'', children:[], attributes:{}, classes:new Set(),
      appendChild(child){this.children.push(child)}, setAttribute(k,v){this.attributes[k]=v},
      get classList(){return {add: name=>this.classes.add(name), remove:name=>this.classes.delete(name)}}});
    return nodes.get(id);
  };
  const context = vm.createContext({document:{getElementById:node, createElement:()=>node(Symbol()),
    querySelectorAll: selector=>selector.split(', ').map(x=>node(x.slice(1)))},window:{}});
  vm.runInContext(script(html), context);
  return {context,node,questions:JSON.parse(vm.runInContext('JSON.stringify(questions)',context)),
    set(values){values.forEach((v,i)=>context.window.update(i,String(v)));return Number(node('total').innerText)}};
}
test('all ten original questions, ranges, types and weights are unchanged',()=>{
  const source=run(original),site=run(integrated);
  assert.equal(site.questions.length,10);assert.deepEqual(site.questions,source.questions);
  assert.equal(site.node('quiz').children.length,10);
  assert.equal(site.questions.reduce((s,q)=>s+q.w,0),61);
});
test('zero, maximum, each individual question and 500 seeded mixed answers match original scoring',()=>{
  const source=run(original),site=run(integrated);const qs=site.questions;
  const cases=[qs.map(()=>0),qs.map(q=>q.max),...qs.map((q,i)=>qs.map((p,j)=>i===j?p.max:0))];
  let seed=711;
  for(let k=0;k<500;k++) cases.push(qs.map(q=>{seed=(seed*1664525+1013904223)>>>0;return seed%(q.max+1)}));
  for(const values of cases){
    const expected=Math.round(values.reduce((sum,value,i)=>sum+value/qs[i].max*qs[i].w,0)/61*100);
    assert.equal(site.set(values),expected);assert.equal(site.set(values),source.set(values));
  }
  assert.equal(site.set(qs.map(()=>0)),0);assert.equal(site.set(qs.map(q=>q.max)),100);
});
test('yes/no selection updates both visible and accessible state',()=>{
  const site=run(integrated);
  for(const index of [2,5]){
    site.context.window.update(index,1);
    assert.equal(site.node(`yn-${index}-1`).attributes['aria-pressed'],'true');
    assert.equal(site.node(`yn-${index}-0`).attributes['aria-pressed'],'false');
    assert(site.node(`yn-${index}-1`).classes.has('active'));
    site.context.window.update(index,0);
    assert.equal(site.node(`yn-${index}-0`).attributes['aria-pressed'],'true');
    assert.equal(site.node(`yn-${index}-1`).attributes['aria-pressed'],'false');
  }
});
