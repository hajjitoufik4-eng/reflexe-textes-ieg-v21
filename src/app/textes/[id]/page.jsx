import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/all-documents.js';
import { caseLawFor } from '../../../data/jurisprudence.js';
import { tag, scopeOf, scopeName, catalogueUrl, safeUrl, isLocalPdf } from '../../../lib/catalogue.mjs';
import { explanationFor } from '../../../lib/explain.mjs';
import { packsForQuery, correlationFor } from '../../../data/legal-relations.js';

export function generateStaticParams() { return data.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }) { const { id } = await params; const d = data.find((x) => x.id === id); return { title: d?.title || 'Texte introuvable' }; }
const major = /PERS\s*(77|96|530|557|793|846|849|939)|astreinte|temps de travail|repos|disciplin|déplacement|primes et indemnités|travail de nuit|RPS|droits familiaux|M-RES|ZHA/i;
const canon=s=>String(s||'').toUpperCase().replace(/\s+/g,'');
export default async function Document({ params }) {
  const { id } = await params; const d = data.find((x) => x.id === id); if (!d) notFound();
  const scope = scopeOf(d), x = explanationFor(d), url = safeUrl(d.url); const important = major.test(`${d.ref || ''} ${d.title || ''} ${d.folder || ''}`);
  const jurisprudence = [...(d.jurisprudence || d.caseLaw || []), ...caseLawFor(d)].filter((j,i,a)=>a.findIndex(k=>(k.id || `${k.court}-${k.number}`)===(j.id || `${j.court}-${j.number}`))===i);
  const packs=packsForQuery(`${d.ref||''} ${d.title||''} ${d.theme||''} ${d.folder||''}`);
  const sameRef=d.ref?data.filter(r=>r.id!==d.id&&canon(r.ref)===canon(d.ref)):[];
  const correlated=data.map(r=>r.id===d.id?null:(()=>{const rel=correlationFor(r,packs);return rel?{d:r,...rel}:null})()).filter(Boolean);
  const relatedMap=new Map();
  sameRef.forEach(r=>relatedMap.set(r.id,{d:r,why:`Même référence ${d.ref} : version, décision d’extension ou document complémentaire à vérifier avec le texte principal.`}));
  correlated.forEach(r=>{if(!relatedMap.has(r.d.id))relatedMap.set(r.d.id,r)});
  const related=[...relatedMap.values()].slice(0,12);
  return <>
    <Link className="back" href={catalogueUrl(scope, { theme: d.folder })}>← Retour aux textes</Link>
    <div className="crumb">{scopeName(scope)} / Fiche juridique</div><span className={'stamp ' + (scope === 'grdf' ? 'grdf' : '')}>{tag(d)}</span>
    <h1>{x.heading}</h1><p className="muted">{d.title}</p>
    <div className="explain-level"><span>{x.badge}</span>{important&&<strong>Texte structurant</strong>}</div>
    {x.mode==='guided'&&<p className="notice"><strong>Pourquoi “lecture guidée” ?</strong> Cette fiche t’aide déjà à comprendre le rôle du document et ses liens. L’analyse détaillée du contenu original n’est pas encore validée article par article.</p>}
    {important && x.mode==='verified' && <p className="notice"><strong>Texte structurant</strong> — cette fiche réunit le texte source, son application pratique, les textes liés et la jurisprudence pertinente.</p>}
    <section className="reader"><nav className="tabs" aria-label="Sections de la fiche"><a href="#essentiel">En clair</a><a href="#regles">À retenir</a><a href="#articulation">À lire avec ({related.length})</a><a href="#jurisprudence">Jurisprudence ({jurisprudence.length})</a><a href="#original">Original</a></nav>
      <section id="essentiel"><h2>À quoi sert ce texte ?</h2><div className="simple">{x.simple}</div></section>
      <section id="regles"><h2>Ce qu’il faut regarder</h2><ul>{(x.points||[]).map((p,i)=><li key={i}>{p}</li>)}</ul>{x.pages && <p className="muted">Repérage dans le document : {x.pages}</p>}{x.limit && <p className="notice"><strong>Point de vigilance :</strong> {x.limit}</p>}</section>
      <section id="articulation"><h2>À lire avec</h2><p>{x.related||'Le site recherche les documents qui portent la même référence ou appartiennent au même bloc juridique.'}</p>{related.length?<div className="related-docs">{related.map(({d:r,why})=><Link className="related-doc" href={`/textes/${r.id}`} key={r.id}><span>{scopeOf(r)==='grdf'?'🏢':'📚'}</span><div>{r.ref&&<small>{r.ref}</small>}<strong>{r.title}</strong><p>{why||'Document à rapprocher pour comprendre l’ensemble de la règle.'}</p></div><b>→</b></Link>)}</div>:<p className="muted">Aucun document complémentaire n’a encore été relié automatiquement à cette fiche.</p>}</section>
      <section id="jurisprudence"><h2>Jurisprudence et décisions</h2>{jurisprudence.length ? jurisprudence.map((j,i)=><article className="case" key={j.id || i}><h3>{j.court || j.juridiction} — {j.date}{j.number || j.numero ? ` · n° ${j.number || j.numero}` : ''}</h3>{j.issue && <p><strong>Question tranchée :</strong> {j.issue}</p>}{j.result && <p><strong>Rendu / résultat :</strong> {j.result}</p>}{j.scope && <p><strong>Portée pratique :</strong> {j.scope}</p>}{j.judgment?.amounts?.length>0&&<div className="amounts">{j.judgment.amounts.map(([label,amount])=><div className="amount-row" key={label}><span>{label}</span><strong>{amount}</strong></div>)}</div>}{j.url && <a className="source" href={j.url} target="_blank" rel="noopener noreferrer">Consulter la décision source ↗</a>}</article>) : <p className="muted">Aucune décision vérifiée n’est encore rattachée à cette fiche.</p>}</section>
      <section id="original"><h2>Document original</h2>{url ? <><a className="source" href={url} target="_blank" rel="noopener noreferrer">{isLocalPdf(url) ? 'Ouvrir le PDF ↗' : 'Consulter la source ↗'}</a>{isLocalPdf(url) && <><a className="source" href={url} download>Télécharger</a><object className="pdf" type="application/pdf" data={url} aria-label={'Document original : '+d.title}><p>Utilisez « Ouvrir le PDF » si le document ne s’affiche pas.</p></object></>}</> : d.providedArchive ? <p className="notice"><strong>Original fourni :</strong> ce document est bien présent dans les fichiers transmis au projet. Son lien public doit encore être rattaché au dépôt.</p> : <p>L’original n’est pas encore relié à cette fiche.</p>}</section>
    </section>
  </>;
}
