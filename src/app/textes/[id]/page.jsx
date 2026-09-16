import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/all-documents.js';
import { caseLawFor } from '../../../data/jurisprudence.js';
import { tag, scopeOf, scopeName, catalogueUrl, safeUrl, isLocalPdf } from '../../../lib/catalogue.mjs';

export function generateStaticParams() { return data.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }) { const { id } = await params; const d = data.find((x) => x.id === id); return { title: d?.title || 'Texte introuvable' }; }
const major = /PERS\s*(77|96|530|557|793|846|849|939)|astreinte|temps de travail|repos|disciplin|déplacement|primes et indemnités|travail de nuit|RPS|droits familiaux|M-RES|ZHA/i;
export default async function Document({ params }) {
  const { id } = await params; const d = data.find((x) => x.id === id); if (!d) notFound();
  const scope = scopeOf(d), x = d.explanation, url = safeUrl(d.url); const important = major.test(`${d.ref || ''} ${d.title || ''} ${d.folder || ''}`);
  const jurisprudence = [...(d.jurisprudence || d.caseLaw || []), ...caseLawFor(d)].filter((j,i,a)=>a.findIndex(k=>(k.id || `${k.court}-${k.number}`)===(j.id || `${j.court}-${j.number}`))===i);
  const links = d.relatedTexts || [];
  return <>
    <Link className="back" href={catalogueUrl(scope, { theme: d.folder })}>← Retour aux textes</Link>
    <div className="crumb">{scopeName(scope)} / Fiche juridique</div><span className={'stamp ' + (scope === 'grdf' ? 'grdf' : '')}>{tag(d)}</span>
    <h1>{x ? x.heading : d.ref || d.kind}</h1><p className="muted">{d.title}</p>
    {important && <p className="notice"><strong>Texte structurant</strong> — cette fiche réunit le texte source, son application pratique, les textes liés et la jurisprudence pertinente.</p>}
    <section className="reader"><nav className="tabs" aria-label="Sections de la fiche"><a href="#essentiel">L’essentiel</a><a href="#regles">Règles</a><a href="#articulation">Articulation</a><a href="#jurisprudence">Jurisprudence ({jurisprudence.length})</a><a href="#original">Original</a></nav>
      <section id="essentiel"><h2>Ce qu’il faut comprendre</h2>{x ? <div className="simple">{x.simple}</div> : <p>Le document est indexé dans le corpus fourni. L’analyse détaillée doit être validée sur le texte original avant publication.</p>}</section>
      <section id="regles"><h2>Règles et conséquences pratiques</h2>{x?.points?.length ? <ul>{x.points.map((p,i)=><li key={i}>{p}</li>)}</ul> : <p className="muted">Analyse article par article en cours de consolidation.</p>}{x?.pages && <p className="muted">Repérage dans le document : {x.pages}</p>}{x?.limit && <p className="notice"><strong>Point de vigilance :</strong> {x.limit}</p>}</section>
      <section id="articulation"><h2>Textes à rapprocher</h2>{x?.related ? <p>{x.related}</p> : <p className="muted">Les textes modificatifs, complémentaires ou de niveau supérieur seront reliés ici.</p>}{links.length > 0 && <ul>{links.map((r,i)=><li key={i}>{typeof r === 'string' ? r : r.title}</li>)}</ul>}</section>
      <section id="jurisprudence"><h2>Jurisprudence et décisions</h2>{jurisprudence.length ? jurisprudence.map((j,i)=><article className="case" key={j.id || i}><h3>{j.court || j.juridiction} — {j.date}{j.number || j.numero ? ` · n° ${j.number || j.numero}` : ''}</h3>{j.issue && <p><strong>Question tranchée :</strong> {j.issue}</p>}{j.result && <p><strong>Rendu / résultat :</strong> {j.result}</p>}{j.scope && <p><strong>Portée pratique :</strong> {j.scope}</p>}{j.judgment?.amounts?.length>0&&<div className="amounts">{j.judgment.amounts.map(([label,amount])=><div className="amount-row" key={label}><span>{label}</span><strong>{amount}</strong></div>)}</div>}{j.url && <a className="source" href={j.url} target="_blank" rel="noopener noreferrer">Consulter la décision source ↗</a>}</article>) : <p className="muted">Aucune décision vérifiée n’est encore rattachée à cette fiche.</p>}</section>
      <section id="original"><h2>Document original</h2>{url ? <><a className="source" href={url} target="_blank" rel="noopener noreferrer">{isLocalPdf(url) ? 'Ouvrir le PDF ↗' : 'Consulter la source ↗'}</a>{isLocalPdf(url) && <><a className="source" href={url} download>Télécharger</a><object className="pdf" type="application/pdf" data={url} aria-label={'Document original : '+d.title}><p>Utilisez « Ouvrir le PDF » si le document ne s’affiche pas.</p></object></>}</> : d.providedArchive ? <p className="notice"><strong>Original fourni :</strong> ce document est bien présent dans les fichiers transmis au projet. Son lien public doit encore être rattaché au dépôt.</p> : <p>L’original n’est pas encore relié à cette fiche.</p>}</section>
    </section>
  </>;
}
