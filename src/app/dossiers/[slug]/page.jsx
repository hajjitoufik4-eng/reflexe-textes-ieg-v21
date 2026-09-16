import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/corpus.json';
import { dossiers } from '../../../data/dossiers.js';
import { jurisprudence } from '../../../data/jurisprudence.js';
import { scopeOf, scopeName } from '../../../lib/catalogue.mjs';

const norm=(s='')=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ');
const text=d=>norm([d.ref,d.title,d.theme,d.folder,d.kind,d.origin,d.explanation?.heading,d.explanation?.simple,...(d.explanation?.points||[])].filter(Boolean).join(' '));
const unique=docs=>docs.filter((d,i,a)=>a.findIndex(x=>norm(x.origin||x.title)===norm(d.origin||d.title))===i);

const ASTREINTE_REFS=['PERS530','PERS557','PERS849','PERS939'];
const TEMPS_REFS=['PERS77','PERS788'];

function dossierDocs(slug){
 if(slug==='astreinte') return unique(data.filter(d=>ASTREINTE_REFS.includes((d.ref||'').replace(/\s/g,''))||/astreinte|action immediate|zone.{0,8}habitat|\bzha\b|\bmres\b/i.test([d.title,d.origin,d.theme].join(' '))));
 if(slug==='temps-de-travail') return unique(data.filter(d=>TEMPS_REFS.includes((d.ref||'').replace(/\s/g,''))||/temps de travail|duree du travail|repos quotidien|repos hebdomadaire|heures supplementaires|horaire|pause/i.test(text(d))));
 return [];
}

const rank=d=>{
 const ref=(d.ref||'').replace(/\s/g,'');
 if(ASTREINTE_REFS.includes(ref)||TEMPS_REFS.includes(ref)) return 0;
 if(scopeOf(d)==='grdf') return 1;
 return 2;
};

export function generateStaticParams(){return Object.keys(dossiers).map(slug=>({slug}));}
export async function generateMetadata({params}){const {slug}=await params;return {title:dossiers[slug]?.title||'Dossier'};}

export default async function Dossier({params}){
 const {slug}=await params; const dossier=dossiers[slug]; if(!dossier) notFound();
 const docs=dossierDocs(slug).sort((a,b)=>rank(a)-rank(b)||a.title.localeCompare(b.title,'fr'));
 const qs=dossier.queries.map(norm);
 const cases=jurisprudence.filter(j=>j.topics.some(t=>qs.some(q=>norm(t).includes(q)||q.includes(norm(t)))));
 const ieg=docs.filter(d=>scopeOf(d)!=='grdf'); const grdf=docs.filter(d=>scopeOf(d)==='grdf');
 const Group=({title,items})=>items.length?<section><h2 className="section-title">{title}</h2><div className="results">{items.map(d=><Link className="result" href={`/textes/${d.id}`} key={d.id}><div><span className={'stamp '+(scopeOf(d)==='grdf'?'grdf':'')}>{scopeName(scopeOf(d))}</span>{d.ref&&<strong>{d.ref}</strong>}</div><h3>{d.title}</h3><p>{d.explanation?.simple||'Document original du corpus. Ouvrir la fiche pour consulter la source et son niveau.'}</p></Link>)}</div></section>:null;
 return <>
  <Link className="back" href="/">← Accueil</Link><div className="eyebrow">Dossier juridique prioritaire</div><h1>{dossier.title}</h1><p className="lead">{dossier.subtitle}</p>
  <div className="dossier-nav"><a href="#comprendre">Comprendre</a><a href="#textes">Textes</a><a href="#jurisprudence">Jurisprudence</a></div>
  <section id="comprendre" className="reader dossier-reader"><h2>Comprendre le dossier</h2>{dossier.sections.map((s,i)=><article className="explain" key={i}><h3>{s.title}</h3><p>{s.text}</p></article>)}</section>
  <div id="textes"><Group title="Textes IEG / branche et PERS" items={ieg}/><Group title="Textes et règles d’entreprise GRDF" items={grdf}/></div>
  <section id="jurisprudence" className="reader"><h2>Jurisprudence vérifiée rattachée au dossier</h2>{cases.map(j=><article className="case" key={j.id}><h3>{j.court} — {j.date} · n° {j.number}</h3><p><strong>Question :</strong> {j.issue}</p><p><strong>Décision :</strong> {j.result}</p><p><strong>Portée pratique :</strong> {j.scope}</p><a className="source" href={j.url} target="_blank" rel="noopener noreferrer">Décision officielle ↗</a></article>)}</section>
 </>;
}
