import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { filterDocuments, safeUrl, scopeOf } from '../src/lib/catalogue.mjs';
const data = JSON.parse(
  readFileSync(new URL('../src/data/corpus.json', import.meta.url)),
);
test('Conservation des 609 identifiants et des 4 explications', () => {
  assert.equal(data.length, 609);
  assert.equal(new Set(data.map((d) => d.id)).size, 609);
  assert.equal(data.filter((d) => d.explanation).length, 4);
});
test('Chaque document local référencé existe', () => {
  const local = data.filter((d) => d.url.startsWith('/documents/'));
  assert.equal(local.length, 218);
  for (const d of local)
    assert.ok(
      existsSync(
        new URL('../' + decodeURIComponent(d.url.slice(1)), import.meta.url),
      ),
      d.id,
    );
});
test('RTT ne se transforme pas en astreinte ; accents et références espacées', () => {
  const docs = [
    { id: 'a', scope: 'ieg', title: 'Accord RTT', ref: '' },
    { id: 'b', scope: 'ieg', title: 'Astreinte', ref: 'PERS530' },
    { id: 'c', scope: 'ieg', title: 'Congés', ref: '' },
  ];
  assert.deepEqual(
    filterDocuments(docs, { scope: 'ieg', query: 'RTT' }).map((d) => d.id),
    ['a'],
  );
  assert.equal(
    filterDocuments(docs, { scope: 'ieg', query: 'PERS 530' })[0].id,
    'b',
  );
  assert.equal(
    filterDocuments(docs, { scope: 'ieg', query: 'conges' })[0].id,
    'c',
  );
});
test('Les corpus et périmètres restent séparés', () => {
  assert.equal(data.filter((d) => scopeOf(d) === 'grdf').length, 48);
  assert.equal(
    filterDocuments(data, { scope: 'grdf', level: 'local' }).length,
    2,
  );
  assert.ok(
    filterDocuments(data, { scope: 'ieg' }).every((d) => d.scope === 'ieg'),
  );
});
test('Les URL exécutables sont rejetées', () => {
  assert.equal(safeUrl('javascript:alert(1)'), '');
  assert.equal(safeUrl('//example.com'), '');
  assert.equal(safeUrl('/documents/test.pdf'), '/documents/test.pdf');
});
