import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/all-documents.js';
import { dossiers } from '../../../data/dossiers.js';
import { jurisprudence } from '../../../data/jurisprudence.js';
import { scopeOf, scopeName } from '../../../lib/catalogue.mjs';

const norm=(s='')=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ');
const text=d=>norm([d.ref,d.title,d.theme,d.folder,d.kind,d.origin,d.explanation?.heading,d.explanation?.simple,...(d.explanation?.points||[])].filter(Boolean).join(' '));
const unique=docs=>docs.filter((d,i,a)=>a.findIndex(x=>norm(x.origin||x.title)===norm(d.origin||d.title))===i);
const ASTREINTE_REFS=['PERS530','PERS557','PERS849','PERS939'];
const TEMPS_REFS=['PERS77','PERS788'];
function dossierDocs(slug){
 if(slug==='astreinte') return unique(data.filter(d=>ASTREINTE_REFS.includes((d.ref||'').replace(/\s/g,''))||/astreinte|action immediate|zone.{0,8}habitat|\bzha\b|\bmres\b|repos.{0,8}11/i.test([d.title,d.origin,d.theme].join(' '))));
 if(slug==='temps-de-travail') return unique(data.filter(d=>TEMPS_REFS.includes((d.ref||'').replace(/\s/g,''))||/temps de travail|duree du travail|repos quotidien|repos hebdomadaire|heures supplementaires|horaire|pause|repos.{0,8}11/i.test(text(d))));
 return [];
}
const rank=d=>{const ref=(d.ref||'').replace(/\s/g,'');if(ASTREINTE_REFS.includes(ref)||TEMPS_REFS.includes(ref))return 0;if(scopeOf(d)==='grdf')return 1;return 2;};
const iconFor=(slug,i)=>slug==='astreinte'?['📟','🚗','😴','⏱️','🏠'][i%5]:['🕒','☕','😴','48','📅'][i%5];
function isEssential(slug,d){
 const h=norm(`${d.ref||''} ${d.title||''} ${d.origin||''}`);
 if(slug==='astreinte') return /pers530|pers557|pers849|accord.*astreinte|m res|020048|zha|repos.*11/.test(h);
 return /pers77|accord national.*temps|accord temps de travail|repos.*11|2012 07 03/.test(h);
}
export function generateStaticParams(){return Object.keys(dossiers).map(slug=>({slug}));}
export async function generateMetadata({params}){const {slug}=await params;return {title:dossiers[slug]?.title||'Dossier'};}

export default async function Dossier({params}){
 const {slug}=await params; const dossier=dossiers[slug]; if(!dossier) notFound();
 const docs=dossierDocs(slug).sort((a,b)=>rank(a)-rank(b)||a.title.localeCompare(b.title,'fr'));
 const essentials=docs.filter(d=>isEssential(slug,d)).slice(0,8);
 const qs=dossier.queries.map(norm); const cases=jurisprudence.filter(j=>j.topics.some(t=>qs.some(q=>norm(t).includes(q)||q.includes(norm(t)))));
 const ieg=docs.filter(d=>scopeOf(d)!=='grdf'); const grdf=docs.filter(d=>scopeOf(d)==='grdf');
 const situationLinks=slug==='astreinte' ? [
   ['🚨','Je viens d’être appelé','intervention astreinte travail effectif'],
   ['😴','Je veux comprendre mes 11 h','repos 11 h astreinte'],
   ['48','J’arrive à 48 h','48 h astreinte repos'],
   ['🏠','On m’impose une ZHA','ZHA zone habitat astreinte'],
 ] : [
   ['☕','Ma pause est coupée','pause méridienne PERS 77'],
   ['🕒','Je dépasse mon horaire','heures supplémentaires PERS 77'],
   ['😴','Je n’ai pas mes 11 h','repos quotidien 11 h'],
   ['48','Je dépasse 48 h','48 h durée maximale travail'],
 ];
 const Group=({title,items})=>items.length?<section className="full-text-group"><h3>{title} <span>({items.length})</span></h3><div className="results">{items.map(d=><Link className="result" href={`/textes/${d.id}`} key={d.id}><div><span className={'stamp '+(scopeOf(d)==='grdf'?'grdf':'')}>{scopeName(scopeOf(d))}</span>{d.ref&&<strong>{d.ref}</strong>}</div><h3>{d.title}</h3><p>{d.explanation?.simple||'Référence fournie dans le corpus. Ouvre la fiche pour voir son niveau, son origine et les explications disponibles.'}</p></Link>)}</div></section>:null;
 return <>
  <Link className="back" href="/">← Accueil</Link>
  <section className={`dossier-hero ${slug==='astreinte'?'dossier-astreinte':'dossier-temps'}`}>
    <div><span className="dossier-symbol">{slug==='astreinte'?'📟':'🕒'}</span><span className="dossier-label">Le guide simple</span><h1>{dossier.title}</h1><p>{dossier.subtitle}</p></div>
    <div className="dossier-count"><strong>{docs.length}</strong><span>textes reliés<br/>et triés</span></div>
  </section>

  <section className="situation-strip">
    <span>Je veux savoir…</span>
    <div>{situationLinks.map(([icon,label,q])=><Link href={`/recherche?q=${encodeURIComponent(q)}`} key={label}><b>{icon}</b>{label}<i>›</i></Link>)}</div>
  </section>

  <section className="dossier-fast">
    <div className="section-heading"><div><span className="section-kicker">En 30 secondes</span><h2>Les 3 choses à retenir</h2></div><p>Tu peux déjà comprendre l’essentiel sans ouvrir un PDF.</p></div>
    <div className="takeaway-grid">{dossier.sections.slice(0,3).map((s,i)=><article key={i} className="takeaway-card"><span>{iconFor(slug,i)}</span><b>{i+1}</b><h3>{s.title.replace(/^\d+\.\s*/, '')}</h3><p>{s.text}</p></article>)}</div>
    {dossier.sections.length>3&&<details className="learn-more"><summary>Comprendre le dossier plus en détail <span>＋</span></summary><div>{dossier.sections.slice(3).map((s,i)=><article className="explain" key={i}><h3>{s.title}</h3><p>{s.text}</p></article>)}</div></details>}
  </section>

  <section className="essential-docs">
    <div className="section-heading"><div><span className="section-kicker">Pas besoin de tout lire</span><h2>Les textes à ouvrir en premier</h2></div><p>{essentials.length} références sélectionnées pour ce dossier.</p></div>
    <div className="essential-doc-grid">{essentials.map((d,i)=><Link href={`/textes/${d.id}`} className="essential-doc" key={d.id}><span className="doc-number">{String(i+1).padStart(2,'0')}</span><div><small>{scopeName(scopeOf(d))}{d.ref?` · ${d.ref}`:''}</small><h3>{d.explanation?.heading||d.title}</h3><p>{d.explanation?.simple||'Ouvre cette fiche pour voir l’explication simple et le document de référence.'}</p></div><b>›</b></Link>)}</div>
  </section>

  <section className="case-preview">
    <div className="section-heading"><div><span className="section-kicker">Les juges ont aussi parlé</span><h2>Décisions utiles pour ce sujet</h2></div><Link className="section-link" href="/jurisprudence">Toutes les décisions →</Link></div>
    <div className="case-preview-grid">{cases.slice(0,3).map(j=><article key={j.id}><span>⚖️ {j.court}</span><h3>{j.number}</h3><p>{j.result}</p><a href={j.url} target="_blank" rel="noopener noreferrer">Voir la décision ↗</a></article>)}</div>
  </section>

  <details id="textes" className="all-docs"><summary>Voir tous les textes du dossier ({docs.length}) <span>＋</span></summary><div><Group title="IEG / branche et PERS" items={ieg}/><Group title="Entreprise GRDF" items={grdf}/></div></details>
 </>;
}
