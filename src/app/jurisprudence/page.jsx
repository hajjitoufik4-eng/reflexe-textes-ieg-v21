import Link from 'next/link';
import { jurisprudence } from '../../data/jurisprudence.js';

export const metadata = { title: 'Jurisprudence et résultats' };

export default function JurisprudencePage() {
  return <>
    <Link className="back" href="/">← Accueil</Link>
    <div className="eyebrow">Jurisprudence vérifiée</div>
    <h1>Arrêts, cassations et résultat concret</h1>
    <p className="lead">Chaque fiche distingue la règle dégagée par la décision, le sens du jugement et, lorsqu’ils sont connus, les montants effectivement accordés.</p>
    <div className="results">
      {jurisprudence.map((j) => <article className="reader case-card" key={j.id}>
        <div className="case-heading"><span className="stamp">{j.court}</span><strong>{j.date} · {j.number}</strong></div>
        <h2>{j.title || j.number}</h2>
        <h3>Question tranchée</h3><p>{j.issue}</p>
        <h3>Rendu / résultat</h3><p>{j.result}</p>
        {j.scope && <><h3>Portée pratique</h3><p>{j.scope}</p></>}
        {j.judgment?.amounts?.length > 0 && <><h3>Montants accordés dans cette affaire</h3><div className="amounts">{j.judgment.amounts.map(([label, amount]) => <div className="amount-row" key={label}><span>{label}</span><strong>{amount}</strong></div>)}</div></>}
        {j.judgment?.follow?.length > 0 && <><h3>Suite de la procédure</h3><ul>{j.judgment.follow.map((f,i)=><li key={i}><strong>{f.label}</strong>{f.text ? ` — ${f.text}` : ''}</li>)}</ul></>}
        {j.limit && <p className="notice"><strong>Limite :</strong> {j.limit}</p>}
        <a className="source" href={j.url} target="_blank" rel="noopener noreferrer">Consulter la décision source ↗</a>
      </article>)}
    </div>
  </>;
}
