import test from 'node:test';
import assert from 'node:assert/strict';
import data from '../src/data/all-documents.js';
import { dossierCoverage, documentsForDossier } from '../src/data/dossier-packs.js';

const refsFor=id=>documentsForDossier(data,id).map(x=>String(x.document.ref||'').replace(/[\s-]+/g,'').toUpperCase());

test('every dossier has coverage and no missing curated core reference',()=>{
  const coverage=dossierCoverage(data);
  for(const item of coverage){
    assert.ok(item.count>0, `${item.id} has no document`);
    assert.deepEqual(item.missingCoreRefs,[], `${item.id} is missing core references: ${item.missingCoreRefs.join(', ')}`);
  }
});

test('meal dossier contains the three direct IEG references',()=>{
  const refs=refsFor('repas');
  for(const ref of ['PERS375','PERS583','PERS793']) assert.ok(refs.includes(ref), `missing ${ref}`);
});

test('meal dossier keeps extension documents separate from main references',()=>{
  const docs=documentsForDossier(data,'repas');
  for(const ref of ['PERS375','PERS583','PERS793']){
    const hits=docs.filter(x=>String(x.document.ref||'').replace(/[\s-]+/g,'').toUpperCase()===ref);
    assert.ok(hits.some(x=>x.relation.tier==='core'), `${ref}: missing core text`);
    assert.ok(hits.some(x=>/extension|enn/i.test(x.document.title||'')), `${ref}: missing extension document`);
  }
});
