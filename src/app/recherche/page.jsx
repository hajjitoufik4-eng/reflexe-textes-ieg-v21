import Link from 'next/link';
import data from '../../data/all-documents.js';
import { jurisprudence } from '../../data/jurisprudence.js';
import { dossiers } from '../../data/dossiers.js';
import { publicLawFor } from '../../data/public-law.js';
import { scopeOf, scopeName } from '../../lib/catalogue.mjs';
import { explanationFor } from '../../lib/explain.mjs';
import { packsForQuery, correlationFor, relationSummary } from '../../data/legal-relations.js';

const norm=(s='')=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const aliases={
  '48h':['48 h','duree maximale','temps de travail','repos'],
  '48 h':['48h','duree maximale','temps de travail','repos'],
  'astreinte':['action immediate','pers530','pers557','pers849','pers939','zha','zone habitat','mres','intervention','repos'],
  'pause':['pers77','pause meridienne','temps de travail'],
  'repas':['pers793','indemnite repas','deplacement'],
  'discipline':['pers846','sanction','ep1','ep2','reglement interieur'],
  '11h':['repos quotidien','11 h'],
  '11 h':['repos quotidien','11h'],
};
const docText=d=>{const x=explanationFor(d);return norm([d.ref,d.title,d.theme,d.folder,d.kind,d.scopeLabel,d.origin,x.heading,x.simple,...(x.points||[]),x.related,...(d.relatedTexts||[]).map(v=>typeof v==='string'?v:v?.title)].filter(Boolean).join(' '));};
const caseText=j=>norm([j.court,j.date,j.number,j.title,j.issue,j.result,j.scope,...(j.topics||[])].join(' '));
const dossierText=d=>norm([d.title,d.subtitle,...d.queries,...d.sections.flatMap(s=>[s.title,s.text])].join(' '));
const tokens=q=>{const n=norm(q);const extra=Object.entries(aliases).filter(([k])=>n.includes(norm(k))).flatMap(([,v])=>v.map(norm));return [...new Set([...n.split(/\s+/).filter(Boolean),...extra.flatMap(x=>x.split(' '))])];};
const score=(hay,terms)=>terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0);
const uniqById=arr=>arr.filter((x,i,a)=>a.findIndex(y=>y.d.id===x.d.id)===i);
const isExtension=d=>/décision d.?extension|decision d.?extension|texte remis a jour|modifi|application de la circulaire|note aux unités/i.test(`${d.title||''} ${d.kind||''}`);
const refRegex=/\b(?:PERS\s*[- ]?\s*\d{1,4}[A-Z]?|DP\s*\d{1,2}\s*-\s*\d+[A-Z]?|N\s*\d{2}\s*-\s*\d+[A-Z]?)\b/gi;
const canonRef=r=>String(r||'').toUpperCase().replace(/[\s-]+/g,m=>m.includes('-')?'-':'').replace(/^PERS-?/,'PERS').replace(/^DP(\d+)-(\d+)$/,'DP$1-$2').replace(/^N(\d+)-(\d+)$/,'N$1-$2');
const refsIn=d=>{
  const x=explanationFor(d);
  const src=[d.ref,d.title,d.origin,x.related,...(d.relatedTexts||[]).map(v=>typeof v==='string'?v:v?.title)].filter(Boolean).join(' ');
  const refs=[...(src.match(refRegex)||[])].map(canonRef);
  if(d.ref) refs.push(canonRef(d.ref));
  return [...new Set(refs.filter(Boolean))];
};

function LawBlock({items}){
 if(!items.length)return null;
 return <section className="law-bridge search-law-bridge"><div className="ieg-bridge-head"><div className="ieg-bridge-icon">📘</div><div><span>Droit commun</span><h2>Les règles légales qui encadrent ta question</h2><p>Le moteur place le Code du travail et le droit européen avant les règles IEG et GRDF lorsqu’ils structurent le sujet.</p></div></div><div className="law-grid">{items.map(x=><a className="law-card" href={x.url} target="_blank" rel="noopener noreferrer" key={x.id}><div><span>{x.level}</span><b>{x.ref}</b></div><strong>{x.title}</strong><p>{x.simple}</p><small><strong>Pourquoi ici :</strong> {x.why}</small><i>Source officielle ↗</i></a>)}</div></section>;
}

function CaseBlock({items}){
 if(!items.length) return <p className="muted">Aucune décision vérifiée n’est encore reliée à cette recherche.</p>;
 return <div className="search-case-grid">{items.map(({j})=><article className="search-case" key={j.id}>
   <span>⚖️ {j.court}</span><h3>{j.number}</h3><p>{j.result}</p>
   {j.judgment?.amounts?.length>0&&<div className="mini-amount">{j.judgment.amounts.slice(0,2).map(([label,amount])=><div key={label}><small>{label}</small><strong>{amount}</strong></div>)}</div>}
   <a href={j.url} target="_blank" rel="noopener noreferrer">Décision officielle / source ↗</a>
 </article>)}</div>;
}

function DocCard({item,label}){
 const {d}=item; const x=explanationFor(d);
 return <Link className="correlation-doc" href={`/textes/${d.id}`}>
   <div className="correlation-top"><span className={'stamp '+(scopeOf(d)==='grdf'?'grdf':'')}>{scopeName(scopeOf(d))}</span>{d.ref&&<b>{d.ref}</b>}<em>{label}</em></div>
   <h3>{x.heading||d.title}</h3>
   <p>{x.simple}</p>
   {item.why&&<small><strong>Pourquoi il apparaît :</strong> {item.why}</small>}
   <i>Ouvrir la fiche →</i>
 </Link>;
}

export default async function Recherche({searchParams}){
 const p=await searchParams; const q=(p?.q||'').trim(); const terms=tokens(q); const packs=q?packsForQuery(q):[]; const lawItems=q?publicLawFor(q):[];
 const lexical=q?data.map(d=>({d,s:score(docText(d),terms)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s):[];
 const maxScore=lexical[0]?.s||0;
 const strongest=lexical.filter(x=>x.s===maxScore).slice(0,10);
 const queryRefs=[...(q.match(refRegex)||[])].map(canonRef);
 const seedRefs=[...new Set([...queryRefs,...strongest.flatMap(x=>refsIn(x.d))])];

 const packCorrelated=q?data.map(d=>{const rel=correlationFor(d,packs);return rel?{d,s:0,...rel}:null}).filter(Boolean):[];
 const autoCorrelated=q&&seedRefs.length?data.map(d=>{
   const drefs=refsIn(d); const hay=docText(d);
   const hits=seedRefs.filter(ref=>drefs.includes(ref)||hay.includes(norm(ref)));
   if(!hits.length) return null;
   return {d,s:0,kind:isExtension(d)?'extension':'correlation',why:`Ce document est relié à ${hits.join(', ')} : il le cite, l’applique, le modifie, l’étend ou reprend la même référence.`};
 }).filter(Boolean):[];
 const corrMap=new Map();
 [...autoCorrelated,...packCorrelated].forEach(x=>{const prev=corrMap.get(x.d.id);corrMap.set(x.d.id,prev&&prev.pack?prev:x);});
 const correlated=[...corrMap.values()];
 const all=uniqById([...lexical,...correlated]);
 const correlatedIds=new Set(correlated.map(x=>x.d.id));
 const primary=all.filter(x=>correlatedIds.has(x.d.id)&&!isExtension(x.d)).map(x=>corrMap.get(x.d.id)||x).sort((a,b)=>(b.s||0)-(a.s||0));
 const extensions=all.filter(x=>correlatedIds.has(x.d.id)&&isExtension(x.d)).map(x=>corrMap.get(x.d.id)||x);
 const other=lexical.filter(x=>!correlatedIds.has(x.d.id)).slice(0,30);

 const packWords=packs.flatMap(pack=>[pack.id,pack.label,...pack.refs]);
 const caseTerms=[...terms,...packWords.map(norm),...seedRefs.map(norm)];
 const cases=q?jurisprudence.map(j=>({j,s:score(caseText(j),caseTerms)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s):[];
 const ds=q?Object.values(dossiers).map(d=>({d,s:score(dossierText(d),terms)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s):[];
 const top=ds[0]?.d;
 return <>
  <section className="question-head"><span>💬</span><div><div className="eyebrow">Pose ta question normalement</div><h1>Qu’est-ce que tu veux vérifier ?</h1><p>Le moteur cherche le texte principal, puis suit automatiquement les références qui le modifient, l’appliquent ou doivent être lues avec lui.</p></div></section>
  <form className="ask-box" action="/recherche"><textarea name="q" defaultValue={q} autoFocus placeholder="Ex. J’ai travaillé en astreinte, j’arrive à 48 h jeudi et on veut me faire poser un RTT. Quels textes s’appliquent ?" aria-label="Ta question"/><button type="submit">Analyser ma question <span>→</span></button></form>
  <div className="quick-asks"><span>Exemples :</span><Link href="/recherche?q=Ma+pause+de+midi+est+coup%C3%A9e+par+une+intervention">Pause coupée</Link><Link href="/recherche?q=Je+travaille+%C3%A0+18h30+ai-je+droit+au+repas+PERS+793">Repas à 18h30</Link><Link href="/recherche?q=Je+d%C3%A9passe+48+h+en+sortie+d%27astreinte">48 h + astreinte</Link></div>

  {q&&<>
   <section className="answer-map">
     <div className="answer-map-head"><span>🧭</span><div><small>CARTE DE TA QUESTION</small><h2>{relationSummary(packs)||'Le moteur a suivi les références trouvées dans le corpus pour reconstruire les textes liés.'}</h2></div></div>
     {packs.length>0&&<div className="pack-row">{packs.map((pack,i)=><div className="pack-pill" key={pack.id}><b>{pack.icon}</b><span>{pack.label}</span>{i<packs.length-1&&<i>＋</i>}</div>)}</div>}
     {seedRefs.length>0&&<div className="followed-refs"><small>Références suivies automatiquement :</small><div>{seedRefs.map(ref=><span key={ref}>{ref}</span>)}</div></div>}
     <div className="answer-stats"><div><strong>{lawItems.length}</strong><span>règles droit commun</span></div><div><strong>{primary.length}</strong><span>textes à lire ensemble</span></div><div><strong>{cases.length}</strong><span>décisions reliées</span></div></div>
   </section>

   {top&&<section className="plain-answer"><div className="plain-icon">💡</div><div><span className="section-kicker">D’abord, en clair</span><h2>{top.title}</h2><p className="plain-lead">{top.subtitle}</p>{top.sections.slice(0,2).map((s,i)=><div className="plain-point" key={i}><b>{i+1}</b><p><strong>{s.title.replace(/^\d+\.\s*/, '')}</strong><br/>{s.text}</p></div>)}<Link href={`/dossiers/${top.slug}`}>Voir le guide complet →</Link></div></section>}

   <LawBlock items={lawItems}/>

   <section className="correlation-section">
     <div className="section-heading"><div><span className="section-kicker">IEG + GRDF</span><h2>Ces textes doivent être lus ensemble</h2></div><p>Le moteur combine recherche directe, liens entre références et règles de corrélation.</p></div>
     {primary.length?<div className="correlation-grid">{primary.map(item=><DocCard key={item.d.id} item={item} label={item.pack?'À corréler':'Lien détecté'}/>)}</div>:<p className="empty">Aucun lien juridique supplémentaire n’a été détecté automatiquement. Les résultats textuels sont affichés plus bas.</p>}
   </section>

   {extensions.length>0&&<details className="extensions-box"><summary><span>🔗</span><div><strong>Modifications, décisions d’extension et textes d’application</strong><small>{extensions.length} document{extensions.length>1?'s':''} relié{extensions.length>1?'s':''} automatiquement</small></div><b>＋</b></summary><div className="extension-list">{extensions.map(item=><DocCard key={item.d.id} item={item} label="Complément"/>)}</div></details>}

   <section className="case-search-section"><div className="section-heading"><div><span className="section-kicker">Ce que les juges en ont fait</span><h2>Jurisprudence reliée à la question</h2></div><Link className="section-link" href="/jurisprudence">Voir toutes les décisions →</Link></div><CaseBlock items={cases}/></section>

   {other.length>0&&<details className="other-results"><summary>Voir aussi les autres textes contenant les mots de ma question ({other.length}) <span>＋</span></summary><div className="results">{other.map(item=>{const x=explanationFor(item.d);return <Link className="result" href={`/textes/${item.d.id}`} key={item.d.id}><div><span className={'stamp '+(scopeOf(item.d)==='grdf'?'grdf':'')}>{scopeName(scopeOf(item.d))}</span>{item.d.ref&&<strong>{item.d.ref}</strong>}</div><h3>{item.d.title}</h3><p>{x.simple}</p></Link>})}</div></details>}
  </>}
 </>;
}
