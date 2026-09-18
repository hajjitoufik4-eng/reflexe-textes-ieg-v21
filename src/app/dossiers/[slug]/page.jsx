import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/all-documents.js';
import { dossierPacks, dossierPack, documentsForDossier } from '../../../data/dossier-packs.js';
import { jurisprudence } from '../../../data/jurisprudence.js';
import { publicLawFor } from '../../../data/public-law.js';
import { scopeOf, scopeName } from '../../../lib/catalogue.mjs';
import { allDossierLinks } from '../../../data/dossier-navigation.js';
import { explanationFor } from '../../../lib/explain.mjs';

const norm=(s='')=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

export function generateStaticParams(){return dossierPacks.map(d=>({slug:d.id}));}
export async function generateMetadata({params}){const {slug}=await params;const d=dossierPack(slug);return {title:d?.label||'Dossier'};}

function DocCard({item,label}){
  const d=item.document; const x=explanationFor(d);
  return <Link className="dossier-doc-card" href={`/textes/${d.id}`}>
    <div><span className={'stamp '+(scopeOf(d)==='grdf'?'grdf':'')}>{scopeName(scopeOf(d))}</span>{d.ref&&<b>{d.ref}</b>}<em>{label}</em></div>
    <h3>{x.heading||d.title}</h3>
    <p>{x.simple||'Référence présente dans le corpus. Ouvre la fiche pour voir le rôle du texte et les explications disponibles.'}</p>
    <small>Comprendre ce texte →</small>
  </Link>;
}

function SourceGroup({title,subtitle,items,label}){
  if(!items.length)return null;
  return <section className="dossier-source-group">
    <div className="dossier-source-title"><div><span>{title}</span><small>{subtitle}</small></div><b>{items.length}</b></div>
    <div className="dossier-doc-grid">{items.map(item=><DocCard key={item.document.id} item={item} label={label}/>)}</div>
  </section>;
}

export default async function DossierPage({params}){
  const {slug}=await params;
  const pack=dossierPack(slug);
  if(!pack) notFound();
  const navEntry=allDossierLinks.find(item=>item.slug===slug);

  const linked=documentsForDossier(data,slug);
  const core=linked.filter(x=>x.relation.tier==='core'&&!/extension|enn/i.test(x.document.title||''));
  const direct=linked.filter(x=>x.relation.tier==='direct'&&!/extension|enn/i.test(x.document.title||''));
  const complements=linked.filter(x=>x.relation.tier==='related'||/extension|enn/i.test(x.document.title||''));

  const essential=[...core,...direct].filter((x,i,a)=>a.findIndex(y=>y.document.id===x.document.id)===i).slice(0,6);
  const extra=[...core,...direct].filter((x,i,a)=>a.findIndex(y=>y.document.id===x.document.id)===i).slice(6);

  const query=[pack.label,...pack.triggers].join(' ');
  const law=publicLawFor(query).slice(0,4);
  const caseTerms=pack.triggers.map(norm);
  const cases=jurisprudence.filter(j=>j.topics?.some(t=>caseTerms.some(q=>norm(t).includes(q)||q.includes(norm(t))))).slice(0,4);

  const branch=essential.filter(x=>scopeOf(x.document)==='ieg');
  const grdf=essential.filter(x=>scopeOf(x.document)==='grdf');
  const local=essential.filter(x=>scopeOf(x.document)==='local');

  return <>
    <nav className="dossier-breadcrumb" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link><span>›</span><span>{navEntry?.group||'Dossiers'}</span><span>›</span><strong>{pack.label}</strong>
    </nav>

    <section className="dossier-page-hero">
      <div>
        <span className="dossier-page-kicker">📁 Dossier</span>
        <h1>{pack.label}</h1>
        <p>{pack.subtitle}</p>
      </div>
      <div className="dossier-page-guide"><span>💡</span><p><strong>Commence par l’essentiel.</strong><br/>Les autres textes restent cachés tant que tu n’en as pas besoin.</p></div>
    </section>

    <section className="dossier-question-box">
      <div><span>💬</span><div><strong>Tu as une question précise sur ce dossier ?</strong><p>Pose-la avec tes mots. La recherche restera centrée sur le sujet.</p></div></div>
      <form action="/recherche">
        <input type="hidden" name="dossier" value={pack.id}/>
        <input name="q" aria-label="Question dans ce dossier" placeholder="Écris ta question…" required/>
        <button>Expliquer →</button>
      </form>
    </section>

    <section className="dossier-first">
      <div className="section-heading simple-heading">
        <div><span className="section-kicker">Commence ici</span><h2>Les textes à connaître en premier</h2></div>
        <p>Maximum 6 références sur l’écran. Le reste est disponible plus bas si tu veux approfondir.</p>
      </div>

      {law.length>0&&<section className="dossier-law-mini">
        <div className="dossier-level-head"><span>1</span><div><strong>Droit commun & Europe</strong><small>Le cadre général avant les textes IEG et GRDF.</small></div></div>
        <div className="dossier-law-grid">{law.map(x=><a key={x.id} href={x.url} target="_blank" rel="noopener noreferrer"><b>{x.ref}</b><strong>{x.title}</strong><p>{x.simple}</p></a>)}</div>
      </section>}

      <SourceGroup title="2 · Statut & branche IEG" subtitle="PERS, Notes DP, Circulaires N et accords de branche." items={branch} label="Essentiel"/>
      <SourceGroup title="3 · GRDF" subtitle="Accords, décisions et notes applicables dans l’entreprise." items={grdf} label="Essentiel"/>
      <SourceGroup title="4 · Local" subtitle="Seulement lorsque le périmètre local est directement concerné." items={local} label="Essentiel"/>

      {!essential.length&&!law.length&&<div className="empty">Aucun texte suffisamment structurant n’a été identifié pour ce dossier. L’application préfère ne pas remplir l’écran avec des résultats faibles.</div>}
    </section>

    {(extra.length>0||complements.length>0)&&<details className="dossier-more">
      <summary><div><span>🔗</span><div><small>SI TU VEUX ALLER PLUS LOIN</small><strong>Voir tous les textes liés à ce dossier</strong><p>{extra.length+complements.length} document{extra.length+complements.length>1?'s':''} gardé{extra.length+complements.length>1?'s':''} en retrait.</p></div></div><b>Ouvrir ＋</b></summary>
      <div className="dossier-more-body">
        <div className="dossier-doc-grid">
          {[...extra,...complements].filter((x,i,a)=>a.findIndex(y=>y.document.id===x.document.id)===i).map(item=><DocCard key={item.document.id} item={item} label={item.relation.tier==='related'?'Complément':'Direct'}/>)}
        </div>
      </div>
    </details>}

    {cases.length>0&&<details className="dossier-more case-more">
      <summary><div><span>⚖️</span><div><small>INTERPRÉTATION</small><strong>Décisions de justice liées</strong><p>À ouvrir seulement si tu veux voir comment une règle a été interprétée.</p></div></div><b>Ouvrir ＋</b></summary>
      <div className="dossier-more-body"><div className="case-preview-grid">{cases.map(j=><article key={j.id}><span>⚖️ {j.court}</span><h3>{j.number}</h3><p>{j.result}</p><a href={j.url} target="_blank" rel="noopener noreferrer">Décision officielle ↗</a></article>)}</div></div>
    </details>}
  </>;
}
