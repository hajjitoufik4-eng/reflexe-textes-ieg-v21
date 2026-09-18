import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import complement from '../src/data/corpus-complement.js';
import { dossierPacks, documentsForDossier } from '../src/data/dossier-packs.js';

const base=JSON.parse(await readFile(new URL('../src/data/corpus.json',import.meta.url),'utf8'));
const data=[...base,...complement];
const home=await readFile(new URL('../src/app/page.jsx',import.meta.url),'utf8');

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const homeQueries=[...home.matchAll(/\['([^']+)','([^']+)'\]/g)].map(m=>({label:m[1],query:m[2]}));

function packForQuery(query){
  const q=norm(query);
  return dossierPacks
    .map(pack=>({pack,score:pack.triggers.reduce((n,t)=>n+(q.includes(norm(t))?Math.max(2,norm(t).split(' ').length):0),0)}))
    .filter(x=>x.score>0)
    .sort((a,b)=>b.score-a.score)[0]?.pack||null;
}

test('every homepage dossier click resolves to a non-empty dossier',()=>{
  assert.ok(homeQueries.length>=20,'homepage should expose progressive dossier choices');
  for(const item of homeQueries){
    const pack=packForQuery(item.query);
    assert.ok(pack,`${item.label}: no dossier pack for "${item.query}"`);
    const docs=documentsForDossier(data,pack.id);
    assert.ok(docs.length>0,`${item.label}: dossier ${pack.id} is empty`);
  }
});

test('meal path is complete before optional complements',()=>{
  const pack=packForQuery('repas');
  assert.equal(pack?.id,'repas');
  const docs=documentsForDossier(data,'repas');
  const core=docs.filter(x=>x.relation.tier==='core'&&!/extension|enn/i.test(x.document.title||''));
  const refs=new Set(core.map(x=>String(x.document.ref||'').replace(/[\s-]+/g,'').toUpperCase()));
  for(const ref of ['PERS375','PERS583','PERS793']) assert.ok(refs.has(ref),`meal core missing ${ref}`);
});

test('homepage remains progressive rather than a text catalogue',()=>{
  assert.ok(home.includes('Choisis un domaine, puis un dossier'));
  assert.ok(home.includes('Aucun catalogue de 100 textes'));
  assert.ok(home.includes('<details'));
  const primaryStart=home.indexOf('const primaryThemes');
  const moreStart=home.indexOf('const moreThemes');
  const primaryBlock=home.slice(primaryStart,moreStart);
  const primaryCount=(primaryBlock.match(/tone:'/g)||[]).length;
  assert.equal(primaryCount,6,'home should show only six primary domains initially');
});
