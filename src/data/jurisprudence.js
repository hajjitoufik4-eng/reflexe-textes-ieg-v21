import { jurisprudence as baseJurisprudence } from './jurisprudence-base.js';
import { extraJurisprudence } from './jurisprudence-extra.js';

export const jurisprudence=[...baseJurisprudence,...extraJurisprudence];

export function caseLawFor(document) {
  const haystack = `${document.ref || ''} ${document.title || ''} ${document.theme || ''} ${document.folder || ''}`.toLowerCase();
  return jurisprudence.filter((j) => j.topics.some((topic) => haystack.includes(String(topic).toLowerCase())));
}
