import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import complement from '../src/data/corpus-complement.js';
import { dossierPacks, documentsForDossier } from '../src/data/dossier-packs.js';
import { dossierNavigation, allDossierLinks } from '../src/data/dossier-navigation.js';

const base=JSON.parse(await readFile(new URL('../src/data/corpus.json',import.meta.url),'utf8'));
const data=[...base,...complement];
const home=await readFile(new URL('../src/app/page.jsx',import.meta.url),'utf8');

test('the sidebar exposes exactly 24 direct dossier pages',()=>{
  assert.equal(allDossierLinks.length,24);
  assert.equal(dossierPacks.length,24);
  const navIds=new Set(allDossierLinks.map(x=>x.slug));
  const packIds=new Set(dossierPacks.map(x=>x.id));
  assert.deepEqual([...navIds].sort(),[...packIds].sort());
  assert.equal(dossierNavigation.length,6);
});

test('every dossier page has source coverage',()=>{
  for(const pack of dossierPacks){
    const docs=documentsForDossier(data,pack.id);
    assert.ok(docs.length>0, `${pack.id} has no document`);
    for(const ref of pack.coreRefs){
      const expected=String(ref).replace(/[\s-]+/g,'').toUpperCase();
      assert.ok(data.some(d=>String(d.ref||'').replace(/[\s-]+/g,'').toUpperCase()===expected), `${pack.id} missing curated core reference ${ref}`);
    }
  }
});

test('meal dossier keeps PERS 375, 583 and 793 in the essential core',()=>{
  const docs=documentsForDossier(data,'repas');
  const core=docs.filter(x=>x.relation.tier==='core'&&!/extension|enn/i.test(x.document.title||''));
  const refs=new Set(core.map(x=>String(x.document.ref||'').replace(/[\s-]+/g,'').toUpperCase()));
  for(const ref of ['PERS375','PERS583','PERS793']) assert.ok(refs.has(ref),`meal core missing ${ref}`);
});

test('homepage stays intentionally short and does not list all 24 dossiers',()=>{
  assert.ok(home.includes('Choisis un domaine, puis un dossier'));
  assert.ok(home.includes('Les 24 dossiers sont disponibles en permanence dans la barre latérale'));
  const primaryStart=home.indexOf('const primaryThemes');
  const drawerStart=home.indexOf('function ThemeDrawer');
  const primaryBlock=home.slice(primaryStart,drawerStart);
  const primaryCount=(primaryBlock.match(/tone:'/g)||[]).length;
  assert.equal(primaryCount,6,'home should show only six primary domains initially');
  assert.equal(home.includes('const moreThemes'),false);
});
