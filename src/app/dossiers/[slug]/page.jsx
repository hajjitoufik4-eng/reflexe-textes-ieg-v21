import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/corpus.json';
import { dossiers } from '../../../data/dossiers.js';
import { jurisprudence } from '../../../data/jurisprudence.js';
import { scopeOf, scopeName } from '../../../lib/catalogue.mjs';

const norm=(s='')=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ');
const text=d=>norm([d.ref,d.title,d.theme,d.folder,d.kind,d.explanation?.heading,d.explanation?.simple,...(d.explanation?.points||[])].filter(Boolean).join(' '));

export function generateStaticParams(){return Object.keys(dossiers).map(slug=>({slug}));}
export async function generateMetadata({params}){const {slug}=await params;return {title:dossiers[slug]?.title||'Dossier'};}

export default async function Dossier({params}){
 const {slug}=await params; const dossier=dossiers[slug]; if(!dossier) notFound();
 const qs=dossier.queries.map(norm);
 const docs=data.filter(d=>qs.some(q=>text(d).includes(q))).filter((d,i,a)=>a.findIndex(x=>(x.ref&&x.ref===d.ref)||x.title===d.title)===i);
 const cases=jurisprudence.filter(j=>j.topics.some(t=>qs.some(q=>norm(t).includes(q)||q.includes(norm(t)))));
 return <>
  <Link className="back" href="/">← Accueil</Link><div className="eyebrow">Dossier juridique prioritaire</div><h1>{dossier.title}</h1><p className="lead">{dossier.subtitle}</p>
  <div className="dossier-nav"><a href="#comprendre">Comprendre</a><a href="#textes">Textes applicables</a><a href="#jurisprudence">Jurisprudence</a></div>
  <section id="comprendre" className="reader dossier-reader"><h2>Comprendre le dossier</h2>{dossier.sections.map((s,i)=><article className="explain" key={i}><h3>{s.title}</h3><p>{s.text}</p></article>)}</section>
  <section id="textes"><h2 className="section-title">Textes retrouvés dans le corpus</h2><p className="muted">Les originaux restent identifiés par leur niveau. Les doublons portant la même référence ne sont affichés qu’une fois dans ce pavé.</p><div className="results">{docs.map(d=><Link className="result" href={`/textes/${d.id}`} key={d.id}><div><span className={'stamp '+(scopeOf(d)==='grdf'?'grdf':'')}>{scopeName(scopeOf(d))}</span>{d.ref&&<strong>{d.ref}</strong>}</div><h3>{d.title}</h3><p>{d.explanation?.simple||'Original présent dans le corpus. Analyse détaillée à consolider sur le document source.'}</p></Link>)}</div></section>
  <section id="jurisprudence" className="reader"><h2>Jurisprudence vérifiée rattachée au dossier</h2>{cases.map(j=><article className="case" key={j.id}><h3>{j.court} — {j.date} · n° {j.number}</h3><p><strong>Question :</strong> {j.issue}</p><p><strong>Décision :</strong> {j.result}</p><p><strong>Portée pratique :</strong> {j.scope}</p><a className="source" href={j.url} target="_blank" rel="noopener noreferrer">Décision officielle ↗</a></article>)}</section>
 </>;
}
