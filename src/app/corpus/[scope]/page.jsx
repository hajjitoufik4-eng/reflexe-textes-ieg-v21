import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/all-documents.js';
import { topics, levels, scopeName, scopeOf, tag, filterDocuments, catalogueUrl, safeUrl } from '../../../lib/catalogue.mjs';
import { explanationFor } from '../../../lib/explain.mjs';
import { packsForQuery, correlationFor } from '../../../data/legal-relations.js';

const single = (v) => (typeof v === 'string' ? v : '');
const icons={astreinte:'⏱️',temps:'🕒',argent:'💶',discipline:'⚠️',sante:'🦺',mandats:'🗣️',carriere:'📈',famille:'👨‍👩‍👧',retraite:'🌤️',avantages:'⚡',regles:'📚',autres:'🗂️'};
const colors={astreinte:'blue',temps:'teal',argent:'gold',discipline:'red',sante:'green',mandats:'purple',carriere:'blue',famille:'pink',retraite:'orange',avantages:'teal',regles:'purple',autres:'orange'};
const isExtension=d=>/décision d.?extension|decision d.?extension|texte remis a jour/i.test(d.title||'');
const canon=s=>String(s||'').replace(/\s+/g,'').toUpperCase();

function unique(items){
 const m=new Map();
 items.forEach(item=>{if(item?.d&&!m.has(item.d.id))m.set(item.d.id,item);});
 return [...m.values()];
}

function IegBridge({items,theme}){
 if(!items.length)return null;
 return <section className="ieg-bridge">
   <div className="ieg-bridge-head"><div className="ieg-bridge-icon">🔗</div><div><span>Socle IEG associé</span><h2>À lire aussi côté IEG / PERS</h2><p>Ces textes ne sont pas des règles GRDF. Ils apparaissent séparément parce qu’ils fondent, modifient ou complètent le sujet consulté.</p></div></div>
   <div className="ieg-bridge-grid">{items.slice(0,8).map(({d,why})=>{const x=explanationFor(d);return <Link className="ieg-bridge-card" href={`/textes/${d.id}`} key={d.id}><div><span className="ieg-mini">IEG</span>{d.ref&&<b>{d.ref}</b>}</div><strong>{x.heading}</strong><p>{x.simple}</p>{why&&<small>{why}</small>}<i>Comprendre ce texte →</i></Link>})}</div>
   {theme&&<Link className="ieg-bridge-more" href={catalogueUrl('ieg',{theme})}>Voir tous les textes IEG de ce thème →</Link>}
 </section>;
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
  const list = filterDocuments(data, { scope, ...state });
  const total = filterDocuments(data,{scope,theme:'',query:'',level:'all'}).length;

  let iegAssociated=[];
  if(scope==='grdf'){
    const relationQuery=[query,topic?.[1],topic?.[2],theme].filter(Boolean).join(' ');
    const packs=packsForQuery(relationQuery);
    const byPack=data.filter(d=>scopeOf(d)==='ieg').map(d=>{const rel=correlationFor(d,packs);return rel?{d,why:rel.why,priority:0}:null}).filter(Boolean);
    const byTheme=theme?filterDocuments(data,{scope:'ieg',theme,query:'',level:'all'}).map(d=>({d,why:'Même thème juridique : ce texte IEG peut constituer le socle ou un complément de la règle GRDF.',priority:1})):[];
    const byQuery=query?filterDocuments(data,{scope:'ieg',theme:'',query,level:'all'}).map(d=>({d,why:'Ce texte IEG correspond directement aux mots de ta recherche dans l’espace GRDF.',priority:1})):[];
    const essentials=!theme&&!query?['PERS77','PERS530','PERS557','PERS793','PERS846'].map(ref=>{
      const d=data.find(x=>scopeOf(x)==='ieg'&&canon(x.ref)===ref&&!isExtension(x));
      return d?{d,why:'Référence IEG importante souvent nécessaire pour comprendre l’application des règles d’entreprise.',priority:2}:null;
    }).filter(Boolean):[];
    iegAssociated=unique([...byPack,...byTheme,...byQuery,...essentials]).sort((a,b)=>a.priority-b.priority||Number(Boolean(b.d.explanation))-Number(Boolean(a.d.explanation))||String(a.d.ref||a.d.title).localeCompare(String(b.d.ref||b.d.title),'fr'));
  }

  return <>
    <Link className="back" href="/">← Accueil</Link>
    <section className={`catalogue-head catalogue-${scope}`}>
      <span className="catalogue-logo">{scope==='ieg'?'IEG':'G'}</span>
      <div><span className="section-kicker">{scope==='ieg'?'Statut & branche':'Entreprise GRDF'}</span><h1>{topic ? topic[1] : scope==='ieg'?'Les textes IEG, rangés simplement.':'Les règles GRDF, avec leur socle IEG.'}</h1><p>{topic?topic[2]:scope==='ieg'?`${total} références indexées. Tu peux chercher avec des mots normaux : repas, astreinte, sanction, congé…`:`${total} documents GRDF indexés. Les PERS et textes IEG utiles apparaissent automatiquement dans un bloc séparé « À lire aussi côté IEG ».`}</p></div>
    </section>
    <form className="searchbox catalogue-search" action={'/corpus/' + scope}><span>🔎</span><label><span className="sr-only">Rechercher une référence, un titre ou un thème</span><input name="q" defaultValue={query} placeholder="Ex. repas, PERS 793, sanction, repos…" maxLength={300}/></label>{level !== 'all' && <input type="hidden" name="level" value={level}/>}<button>Trouver</button></form>
    {scope === 'grdf' && <nav className="levels" aria-label="Périmètre GRDF">{levels.map(([key,label])=><Link key={key} href={catalogueUrl(scope,{...state,level:key})} aria-current={level===key?'page':undefined}>{label}</Link>)}</nav>}
    {!theme&&!query?<>
      <div className="catalogue-help"><strong>Je cherche par situation</strong><span>Choisis une carte. Les références juridiques viennent après.</span></div>
      <div className="themes theme-app-grid">{topics.map(([key,title,description])=>{
        const count=filterDocuments(data,{scope,theme:key,query:'',level}).length;
        return <Link className={`theme theme-app tone-${colors[key]||'blue'}`} key={key} href={catalogueUrl(scope,{...state,theme:key})}>
          <span className="theme-icon">{icons[key]||'📄'}</span><strong>{title}</strong><small>{description}</small><em>{count} texte{count>1?'s':''}</em>
        </Link>})}</div>
      {scope==='grdf'&&<IegBridge items={iegAssociated}/>} 
    </>:<>
      <div className="catalogue-results-head"><Link className="back" href={catalogueUrl(scope,{level})}>← Tous les thèmes</Link><span>{list.length} résultat{list.length>1?'s':''}</span></div>
      {scope==='grdf'&&<div className="grdf-section-label"><span>🏢</span><div><strong>Textes GRDF</strong><small>Règles d’entreprise, accords, décisions et notes GRDF correspondant à ta sélection.</small></div></div>}
      {list.slice(0,limit).map(d=>{const url=safeUrl(d.url);const guide=explanationFor(d);return <article className="row doc-row" key={d.id}>
        <div className="doc-row-top"><span className={'stamp '+(scope==='grdf'?'grdf':'')}>{tag(d)}</span>{d.ref&&<b>{d.ref}</b>}<em className={guide.mode==='verified'?'verified-pill':'guided-pill'}>{guide.mode==='verified'?'✅ Expliqué':'🧭 Guidé'}</em></div>
        <strong>{d.title}</strong>
        <p className="doc-simple">{guide.simple}</p>
        <div className="doc-actions"><Link className="source explanation-button" href={'/textes/'+d.id}>💡 Comprendre</Link>{url?<a className="source" href={url} target="_blank" rel="noopener noreferrer">📄 Texte original ↗</a>:d.providedArchive?<span className="status supplied">Original fourni</span>:<span className="status">Original à relier</span>}</div>
      </article>})}
      {!list.length&&<div className="empty"><strong>Rien avec ces mots dans ce corpus.</strong><p>Essaie plus simple : « repas », « repos », « astreinte », « sanction »…</p></div>}
      {list.length>limit&&<Link className="more" href={catalogueUrl(scope,{...state,limit:limit+12})}>Afficher davantage ↓</Link>}
      {scope==='grdf'&&<IegBridge items={iegAssociated} theme={theme}/>} 
    </>}
  </>;
}
