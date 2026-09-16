import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/all-documents.js';
import { topics, levels, scopeName, tag, filterDocuments, catalogueUrl, safeUrl } from '../../../lib/catalogue.mjs';
const single = (v) => (typeof v === 'string' ? v : '');
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
  return <>
    <Link className="back" href="/">← Choisir un autre corpus</Link>
    <div className="crumb">{scopeName(scope)}{topic && ' / ' + topic[1]}</div>
    <div className="eyebrow">{scopeName(scope)}</div>
    <h1>{topic ? topic[1] : 'Trouvez le texte qui vous concerne.'}</h1>
    <p className="muted">{filterDocuments(data,{scope,theme:'',query:'',level:'all'}).length} références indexées dans ce corpus.</p>
    <form className="search" action={'/corpus/' + scope}><label><span className="sr-only">Rechercher une référence, un titre ou un thème</span><input name="q" defaultValue={query} placeholder="Une référence, un mot-clé, un thème…" maxLength={300}/></label>{level !== 'all' && <input type="hidden" name="level" value={level}/>}<button className="primary">Trouver les textes →</button></form>
    {scope === 'grdf' && <nav className="levels" aria-label="Périmètre GRDF">{levels.map(([key,label])=><Link key={key} href={catalogueUrl(scope,{...state,level:key})} aria-current={level===key?'page':undefined}>{label}</Link>)}</nav>}
    {!theme&&!query?<div className="themes">{topics.map(([key,title,description])=><Link className="theme" key={key} href={catalogueUrl(scope,{...state,theme:key})}><strong>{title}</strong><small>{description}</small></Link>)}</div>:<>
      <Link className="back" href={catalogueUrl(scope,{level})}>← Tous les thèmes</Link><p className="muted">{list.length} références dans cette sélection</p>
      {list.slice(0,limit).map(d=>{const url=safeUrl(d.url);return <article className="row" key={d.id}><span className={'stamp '+(scope==='grdf'?'grdf':'')}>{tag(d)}</span><strong>{url?<a className="document-title" href={url} target="_blank" rel="noopener noreferrer">{d.title} ↗</a>:d.title}</strong><div className="doc-actions">{url?<a className="source" href={url} target="_blank" rel="noopener noreferrer">Ouvrir le texte ↗</a>:d.providedArchive?<span className="status supplied">Original fourni · lien public à rattacher</span>:<span className="status">Original à intégrer</span>}<Link className="source explanation-button" href={'/textes/'+d.id}>{d.explanation?'Lire l’explication':'Voir la fiche'}</Link></div><small>{d.explanation?'Explication disponible · applicabilité à vérifier':d.providedArchive?'Référence vérifiée dans les fichiers fournis':'Explication à préparer'}</small></article>})}
      {!list.length&&<p className="empty">Aucun intitulé correspondant. Essayez un mot plus simple ou un autre thème.</p>}
      {list.length>limit&&<Link className="more" href={catalogueUrl(scope,{...state,limit:limit+12})}>Afficher davantage de textes ↓</Link>}
    </>}
  </>;
}
