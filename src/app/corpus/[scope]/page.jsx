import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/all-documents.js';
import { topics, levels, scopeName, scopeOf, tag, filterDocuments, catalogueUrl, safeUrl } from '../../../lib/catalogue.mjs';
import { explanationFor } from '../../../lib/explain.mjs';
import { packsForQuery, correlationFor } from '../../../data/legal-relations.js';

const single = (v) => (typeof v === 'string' ? v : '');
const icons={astreinte:'⏱️',temps:'🕒',argent:'💶',discipline:'⚠️',sante:'🦺',mandats:'🗣️',carriere:'📈',famille:'👨‍👩‍👧',retraite:'🌤️',avantages:'⚡',regles:'📚',autres:'🗂️'};
const colors={astreinte:'blue',temps:'teal',argent:'gold',discipline:'red',sante:'green',mandats:'purple',carriere:'blue',famille:'pink',retraite:'orange',avantages:'teal',regles:'purple',autres:'orange'};
const isExtension=d=>/décision d.?extension|decision d.?extension|texte remis a jour|étendu par|etendu par/i.test(`${d.title||''} ${d.kind||''}`);
const canon=s=>String(s||'').replace(/[\s-]+/g,'').toUpperCase();
const levelOk=(d,scope,level)=>scope==='ieg'||level==='all'||d.level===level;

function unique(items){
 const m=new Map();
 items.forEach(item=>{if(item?.d&&!m.has(item.d.id))m.set(item.d.id,item);});
 return [...m.values()];
}

function IegCard({item,label}){
 const {d,why}=item; const x=explanationFor(d);
 return <Link className="ieg-bridge-card" href={`/textes/${d.id}`}>
   <div><span className="ieg-mini">IEG</span>{d.ref&&<b>{d.ref}</b>}{label&&<em>{label}</em>}</div>
   <strong>{x.heading}</strong><p>{x.simple}</p>
   {why&&<small><strong>Pourquoi ici :</strong> {why}</small>}<i>Comprendre ce texte →</i>
 </Link>;
}

function IegBridge({items,theme,query}){
 if(!items.length)return null;
 const core=items.filter(x=>!isExtension(x.d));
 const complements=items.filter(x=>isExtension(x.d));
 return <section className="ieg-bridge ieg-bridge-prominent">
   <div className="ieg-bridge-head"><div className="ieg-bridge-icon">⚖️</div><div><span>Socle juridique IEG / branche</span><h2>Textes IEG qui régissent ce sujet</h2><p>Tu es dans l’espace GRDF. Les PERS, notes DP et circulaires qui fondent la règle sont affichées avec les textes d’entreprise, sans mélanger leur niveau juridique.</p></div></div>
   <div className="ieg-bridge-grid">{core.slice(0,14).map(item=><IegCard item={item} label="Texte de fond" key={item.d.id}/>)}</div>
   {complements.length>0&&<details className="ieg-complements"><summary>Voir les décisions d’extension, versions et compléments ({complements.length}) <span>＋</span></summary><div className="ieg-bridge-grid">{complements.slice(0,12).map(item=><IegCard item={item} label="Complément" key={item.d.id}/>)}</div></details>}
   <div className="ieg-bridge-actions">{theme&&<Link className="ieg-bridge-more" href={catalogueUrl('ieg',{theme})}>Voir tous les textes IEG de ce thème →</Link>}{query&&<Link className="ieg-bridge-more" href={catalogueUrl('ieg',{query})}>Rechercher « {query} » dans tout le corpus IEG →</Link>}</div>
 </section>;
}

function GrdfDocs({items,limit}){
 if(!items.length)return <div className="empty"><strong>Aucun texte GRDF direct ou corrélé retrouvé.</strong><p>Le socle IEG correspondant reste affiché au-dessus lorsqu’il existe.</p></div>;
 return <>{items.slice(0,limit).map(({d,why})=>{const url=safeUrl(d.url);const guide=explanationFor(d);return <article className="row doc-row" key={d.id}>
   <div className="doc-row-top"><span className="stamp grdf">{tag(d)}</span>{d.ref&&<b>{d.ref}</b>}<em className={guide.mode==='verified'?'verified-pill':'guided-pill'}>{guide.mode==='verified'?'✅ Expliqué':'🧭 Guidé'}</em></div>
   <strong>{d.title}</strong><p className="doc-simple">{guide.simple}</p>
   {why&&<p className="correlation-why"><strong>Pourquoi ce texte apparaît :</strong> {why}</p>}
   <div className="doc-actions"><Link className="source explanation-button" href={'/textes/'+d.id}>💡 Comprendre</Link>{url?<a className="source" href={url} target="_blank" rel="noopener noreferrer">📄 Texte original ↗</a>:d.providedArchive?<span className="status supplied">Original fourni</span>:<span className="status">Original à relier</span>}</div>
 </article>})}</>;
}

export default async function Catalogue({ params, searchParams }) {
  const { scope } = await params;
  if (!['ieg', 'grdf'].includes(scope)) notFound();
  const s = await searchParams;
  const theme = single(s.theme), query = single(s.q).slice(0, 300), level = levels.some((x) => x[0] === s.level) ? s.level : 'all';
  const topic = topics.find((x) => x[0] === theme);
  if (theme && !topic) notFound();
  const limit = Math.min(data.length, Math.max(12, Number.parseInt(single(s.limit), 10) || 12));
  const state = { theme, query, level };
  const directList = filterDocuments(data, { scope, ...state });
  const total = filterDocuments(data,{scope,theme:'',query:'',level:'all'}).length;

  const relationQuery=[query,topic?.[1],topic?.[2],theme].filter(Boolean).join(' ');
  const packs=scope==='grdf'&&relationQuery?packsForQuery(relationQuery):[];
  const coreOrder=packs.flatMap(p=>p.refs||[]).map(canon);

  let iegAssociated=[];
  let grdfItems=directList.map(d=>({d,why:'Ce document correspond directement à ta recherche.',priority:10}));

  if(scope==='grdf'){
    const byPack=data.filter(d=>scopeOf(d)==='ieg').map(d=>{const rel=correlationFor(d,packs);if(!rel)return null;const idx=coreOrder.indexOf(canon(d.ref));return {d,why:rel.why,priority:idx>=0?idx:60};}).filter(Boolean);
    const byTheme=theme?filterDocuments(data,{scope:'ieg',theme,query:'',level:'all'}).map(d=>({d,why:'Même thème juridique : ce texte IEG peut constituer le socle, une précision ou un complément de la règle GRDF.',priority:100})):[];
    const byQuery=query?filterDocuments(data,{scope:'ieg',theme:'',query,level:'all'}).map(d=>({d,why:'Ce texte IEG correspond directement à ta recherche dans l’espace GRDF.',priority:80})):[];
    const essentials=!theme&&!query?['PERS77','PERS530','PERS557','PERS793','PERS846'].map((ref,i)=>{const d=data.find(x=>scopeOf(x)==='ieg'&&canon(x.ref)===ref&&!isExtension(x));return d?{d,why:'Référence IEG structurante fréquemment nécessaire pour comprendre les règles appliquées dans l’entreprise.',priority:200+i}:null;}).filter(Boolean):[];
    iegAssociated=unique([...byPack,...byQuery,...byTheme,...essentials]).sort((a,b)=>Number(isExtension(a.d))-Number(isExtension(b.d))||a.priority-b.priority||Number(Boolean(explanationFor(b.d).mode==='verified'))-Number(Boolean(explanationFor(a.d).mode==='verified'))||String(a.d.ref||a.d.title).localeCompare(String(b.d.ref||b.d.title),'fr'));

    const grdfCorrelated=data.filter(d=>scopeOf(d)==='grdf'&&levelOk(d,'grdf',level)).map(d=>{
      const rel=correlationFor(d,packs); if(!rel)return null;
      return {d,why:rel.why,priority:0};
    }).filter(Boolean);
    grdfItems=unique([...grdfCorrelated,...grdfItems]).sort((a,b)=>a.priority-b.priority||Number(explanationFor(b.d).mode==='verified')-Number(explanationFor(a.d).mode==='verified')||String(a.d.title).localeCompare(String(b.d.title),'fr'));
  }

  return <>
    <Link className="back" href="/">← Accueil</Link>
    <section className={`catalogue-head catalogue-${scope}`}>
      <span className="catalogue-logo">{scope==='ieg'?'IEG':'G'}</span>
      <div><span className="section-kicker">{scope==='ieg'?'Statut & branche':'Entreprise GRDF'}</span><h1>{topic ? topic[1] : scope==='ieg'?'Les textes IEG, rangés simplement.':'Tes règles GRDF, avec les textes IEG qui les encadrent.'}</h1><p>{topic?topic[2]:scope==='ieg'?`${total} références indexées. Tu peux chercher avec des mots normaux : repas, astreinte, sanction, congé…`:`Cherche un sujet comme « astreinte ». Le site reconstruit le bloc complet : PERS / notes IEG + accords, décisions et notes GRDF qui doivent être lus ensemble.`}</p></div>
    </section>
    <form className="searchbox catalogue-search" action={'/corpus/' + scope}><span>🔎</span><label><span className="sr-only">Rechercher une référence, un titre ou un thème</span><input name="q" defaultValue={query} placeholder={scope==='grdf'?'Ex. astreinte, repos 11 h, repas, sanction…':'Ex. repas, PERS 793, sanction, repos…'} maxLength={300}/></label>{level !== 'all' && <input type="hidden" name="level" value={level}/>}<button>Trouver</button></form>
    {scope === 'grdf' && <nav className="levels" aria-label="Périmètre GRDF">{levels.map(([key,label])=><Link key={key} href={catalogueUrl(scope,{...state,level:key})} aria-current={level===key?'page':undefined}>{label}</Link>)}</nav>}

    {!theme&&!query?<>
      <div className="catalogue-help"><strong>Je cherche par situation</strong><span>Choisis une carte : dans GRDF, le site ajoutera automatiquement le socle IEG correspondant.</span></div>
      <div className="themes theme-app-grid">{topics.map(([key,title,description])=>{const count=filterDocuments(data,{scope,theme:key,query:'',level}).length;return <Link className={`theme theme-app tone-${colors[key]||'blue'}`} key={key} href={catalogueUrl(scope,{...state,theme:key})}><span className="theme-icon">{icons[key]||'📄'}</span><strong>{title}</strong><small>{description}</small><em>{count} texte{count>1?'s':''} {scope==='grdf'?'GRDF':''}</em></Link>})}</div>
    </>:<>
      <div className="catalogue-results-head"><Link className="back" href={catalogueUrl(scope,{level})}>← Tous les thèmes</Link><span>{scope==='grdf'?`${grdfItems.length} GRDF + ${iegAssociated.length} IEG`:`${directList.length} résultat${directList.length>1?'s':''}`}</span></div>

      {scope==='grdf'&&<IegBridge items={iegAssociated} theme={theme} query={query}/>} 

      {scope==='grdf'?<section className="grdf-results-block"><div className="grdf-section-label"><span>🏢</span><div><strong>Textes spécifiques GRDF à lire avec</strong><small>Résultats directs + accords, décisions et notes GRDF juridiquement corrélés au même sujet.</small></div></div><GrdfDocs items={grdfItems} limit={limit}/></section>:directList.slice(0,limit).map(d=>{const url=safeUrl(d.url);const guide=explanationFor(d);return <article className="row doc-row" key={d.id}><div className="doc-row-top"><span className="stamp">{tag(d)}</span>{d.ref&&<b>{d.ref}</b>}<em className={guide.mode==='verified'?'verified-pill':'guided-pill'}>{guide.mode==='verified'?'✅ Expliqué':'🧭 Guidé'}</em></div><strong>{d.title}</strong><p className="doc-simple">{guide.simple}</p><div className="doc-actions"><Link className="source explanation-button" href={'/textes/'+d.id}>💡 Comprendre</Link>{url?<a className="source" href={url} target="_blank" rel="noopener noreferrer">📄 Texte original ↗</a>:d.providedArchive?<span className="status supplied">Original fourni</span>:<span className="status">Original à relier</span>}</div></article>})}

      {scope==='ieg'&&!directList.length&&<div className="empty"><strong>Rien avec ces mots dans ce corpus.</strong><p>Essaie plus simple : « repas », « repos », « astreinte », « sanction »…</p></div>}
      {(scope==='grdf'?grdfItems.length:directList.length)>limit&&<Link className="more" href={catalogueUrl(scope,{...state,limit:limit+12})}>Afficher davantage ↓</Link>}
    </>}
  </>;
}
