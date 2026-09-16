import Link from 'next/link';
import data from '../../data/corpus.json';
import { jurisprudence } from '../../data/jurisprudence.js';
import { dossiers } from '../../data/dossiers.js';
import { scopeOf, scopeName } from '../../lib/catalogue.mjs';

const norm=(s='')=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const aliases={
  '48h':['48 h','duree maximale','temps de travail','repos'],
  '48 h':['48h','duree maximale','temps de travail','repos'],
  'astreinte':['action immediate','pers530','pers557','pers849','pers939','zha','zone habitat','mres','intervention'],
  'pause':['pers77','pause meridienne','temps de travail'],
  'repas':['pers793','indemnite repas','deplacement'],
  'discipline':['pers846','sanction','ep1','ep2'],
};
const docText=d=>norm([d.ref,d.title,d.theme,d.folder,d.kind,d.scopeLabel,d.explanation?.heading,d.explanation?.simple,...(d.explanation?.points||[]),d.explanation?.related].filter(Boolean).join(' '));
const caseText=j=>norm([j.court,j.date,j.number,j.issue,j.result,j.scope,...(j.topics||[])].join(' '));
const dossierText=d=>norm([d.title,d.subtitle,...d.queries,...d.sections.flatMap(s=>[s.title,s.text])].join(' '));
const tokens=q=>{const n=norm(q);const extra=Object.entries(aliases).filter(([k])=>n.includes(norm(k))).flatMap(([,v])=>v.map(norm));return [...new Set([...n.split(/\s+/).filter(Boolean),...extra.flatMap(x=>x.split(' '))])];};
const score=(hay,terms)=>terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0);

export default async function Recherche({searchParams}){
 const p=await searchParams; const q=(p?.q||'').trim(); const terms=tokens(q);
 const docs=q?data.map(d=>({d,s:score(docText(d),terms)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,60):[];
 const cases=q?jurisprudence.map(j=>({j,s:score(caseText(j),terms)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s):[];
 const ds=q?Object.values(dossiers).map(d=>({d,s:score(dossierText(d),terms)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s):[];
 const top=ds[0]?.d;
 return <>
  <div className="eyebrow">Recherche transversale</div><h1>Recherche dans les textes, dossiers et jurisprudences</h1>
  <p className="muted">Une seule recherche interroge les références, titres, explications, thèmes et décisions déjà vérifiées.</p>
  <form className="searchbox" action="/recherche"><input name="q" defaultValue={q} autoFocus placeholder="Ex. départ immédiat, 48 h, PERS 530, pause 12-13, repas…" aria-label="Recherche"/><button type="submit">Rechercher</button></form>
  <div className="quicklinks"><Link href="/dossiers/astreinte">Pavé Astreinte</Link><Link href="/dossiers/temps-de-travail">Pavé Temps de travail</Link><Link href="/recherche?q=PERS+793">Repas / déplacements</Link><Link href="/recherche?q=PERS+846">Discipline</Link></div>
  {q&&<>
   {top&&<section className="reader search-answer"><div className="eyebrow">Réponse orientée dossier</div><h2>{top.title}</h2><p>{top.subtitle}</p><p>{top.sections[0]?.text}</p><Link className="source" href={`/dossiers/${top.slug}`}>Ouvrir le dossier complet →</Link></section>}
   <section><h2 className="section-title">Textes applicables ou associés ({docs.length})</h2><div className="results">{docs.length?docs.map(({d})=><Link className="result" href={`/textes/${d.id}`} key={d.id}><div><span className={'stamp '+(scopeOf(d)==='grdf'?'grdf':'')}>{scopeName(scopeOf(d))}</span>{d.ref&&<strong>{d.ref}</strong>}</div><h3>{d.title}</h3><p>{d.explanation?.simple||'Original présent dans le corpus. Cette fiche reste signalée comme non analysée tant que son contenu n’a pas été vérifié.'}</p></Link>):<p>Aucun texte retrouvé.</p>}</div></section>
   <section className="reader"><h2>Jurisprudence vérifiée ({cases.length})</h2>{cases.length?cases.map(({j})=><article className="case" key={j.id}><h3>{j.court} — {j.date} · n° {j.number}</h3><p><strong>Question :</strong> {j.issue}</p><p><strong>Décision :</strong> {j.result}</p><p><strong>Portée :</strong> {j.scope}</p><a className="source" href={j.url} target="_blank" rel="noopener noreferrer">Décision officielle ↗</a></article>):<p className="muted">Aucune jurisprudence vérifiée ne correspond encore à cette recherche.</p>}</section>
  </>}
 </>;
}
