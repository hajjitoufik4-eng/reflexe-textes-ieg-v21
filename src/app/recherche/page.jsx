import Link from 'next/link';
import data from '../../data/corpus.json';
import { scopeOf, scopeName } from '../../lib/catalogue.mjs';

const norm = (s='') => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const hay = d => norm([d.ref,d.title,d.folder,d.kind,d.explanation?.heading,d.explanation?.simple,...(d.explanation?.points||[])].filter(Boolean).join(' '));

export default async function Recherche({ searchParams }) {
  const p = await searchParams;
  const q = (p?.q || '').trim();
  const nq = norm(q);
  const terms = nq.split(/\s+/).filter(Boolean);
  const results = q ? data.filter(d => terms.every(t => hay(d).includes(t))).slice(0,80) : [];
  return <>
    <div className="eyebrow">Recherche dans tout le corpus</div>
    <h1>Quel droit ou quel texte cherchez-vous ?</h1>
    <form className="searchbox" action="/recherche">
      <input name="q" defaultValue={q} autoFocus placeholder="Ex. astreinte, 48 h, PERS 530, repos, repas, discipline…" aria-label="Recherche" />
      <button type="submit">Rechercher</button>
    </form>
    <div className="quicklinks">
      <Link href="/recherche?q=astreinte">Astreinte</Link><Link href="/recherche?q=temps+de+travail">Temps de travail</Link><Link href="/recherche?q=repos">Repos</Link><Link href="/recherche?q=PERS+793">Déplacements / repas</Link><Link href="/recherche?q=discipline">Discipline</Link>
    </div>
    {q && <><h2>{results.length} résultat{results.length>1?'s':''} pour « {q} »</h2>
      <div className="results">{results.length ? results.map(d => <Link className="result" href={`/textes/${d.id}`} key={d.id}>
        <div><span className="stamp">{scopeName(scopeOf(d))}</span>{d.ref && <strong>{d.ref}</strong>}</div>
        <h3>{d.title}</h3>
        <p>{d.explanation?.simple || `Document original classé dans : ${d.folder || 'corpus'}.`}</p>
      </Link>) : <p>Aucun résultat exact. Essayez une référence (PERS 530) ou un thème plus court (astreinte, repos, repas).</p>}</div>
    </>}
  </>;
}
