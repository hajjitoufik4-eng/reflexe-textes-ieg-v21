import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/all-documents.js';
import { topics, levels, scopeName, tag, filterDocuments, catalogueUrl, safeUrl } from '../../../lib/catalogue.mjs';
import { explanationFor } from '../../../lib/explain.mjs';
const single = (v) => (typeof v === 'string' ? v : '');
const icons={astreinte:'⏱️',temps:'🕒',argent:'💶',discipline:'⚠️',sante:'🦺',mandats:'🗣️',carriere:'📈',famille:'👨‍👩‍👧',retraite:'🌤️',avantages:'⚡',regles:'📚',autres:'🗂️'};
const colors={astreinte:'blue',temps:'teal',argent:'gold',discipline:'red',sante:'green',mandats:'purple',carriere:'blue',famille:'pink',retraite:'orange',avantages:'teal',regles:'purple',autres:'orange'};
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
  return <>
    <Link className="back" href="/">← Accueil</Link>
    <section className={`catalogue-head catalogue-${scope}`}>
      <span className="catalogue-logo">{scope==='ieg'?'IEG':'G'}</span>
      <div><span className="section-kicker">{scope==='ieg'?'Statut & branche':'Entreprise GRDF'}</span><h1>{topic ? topic[1] : scope==='ieg'?'Les textes IEG, rangés simplement.':'Les textes GRDF, sans mélanger les niveaux.'}</h1><p>{topic?topic[2]:`${total} références indexées. Tu peux chercher avec des mots normaux : repas, astreinte, sanction, congé…`}</p></div>
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
    </>:<>
      <div className="catalogue-results-head"><Link className="back" href={catalogueUrl(scope,{level})}>← Tous les thèmes</Link><span>{list.length} résultat{list.length>1?'s':''}</span></div>
      {list.slice(0,limit).map(d=>{const url=safeUrl(d.url);const guide=explanationFor(d);return <article className="row doc-row" key={d.id}>
        <div className="doc-row-top"><span className={'stamp '+(scope==='grdf'?'grdf':'')}>{tag(d)}</span>{d.ref&&<b>{d.ref}</b>}<em className={guide.mode==='verified'?'verified-pill':'guided-pill'}>{guide.mode==='verified'?'✅ Expliqué':'🧭 Guidé'}</em></div>
        <strong>{d.title}</strong>
        <p className="doc-simple">{guide.simple}</p>
        <div className="doc-actions"><Link className="source explanation-button" href={'/textes/'+d.id}>💡 Comprendre</Link>{url?<a className="source" href={url} target="_blank" rel="noopener noreferrer">📄 Texte original ↗</a>:d.providedArchive?<span className="status supplied">Original fourni</span>:<span className="status">Original à relier</span>}</div>
      </article>})}
      {!list.length&&<div className="empty"><strong>Rien avec ces mots.</strong><p>Essaie plus simple : « repas », « repos », « astreinte », « sanction »…</p></div>}
      {list.length>limit&&<Link className="more" href={catalogueUrl(scope,{...state,limit:limit+12})}>Afficher davantage ↓</Link>}
    </>}
  </>;
}
