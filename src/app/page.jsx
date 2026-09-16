import Link from 'next/link';
export default function Home() {
  return <>
    <div className="eyebrow">Réflexe Textes IEG</div>
    <h1>Retrouver un droit, le texte applicable et son original</h1>
    <p className="muted">Recherche dans l’ensemble du corpus fourni, avec séparation entre textes IEG / branche et textes propres à GRDF. Les dossiers prioritaires regroupent explications, originaux et jurisprudence.</p>
    <form className="searchbox" action="/recherche"><input name="q" placeholder="Posez une question ou une référence : astreinte, 48 h, repos, PERS 530, repas…" aria-label="Recherche"/><button>Rechercher</button></form>

    <div className="priority-grid">
      <Link className="priority astreinte" href="/dossiers/astreinte"><span className="stamp">DOSSIER PRIORITAIRE</span><h2>Astreinte</h2><p>PERS 530 et textes liés, règles d’entreprise GRDF, interventions, contraintes, repos et jurisprudence.</p><span className="arrow">Ouvrir le pavé Astreinte →</span></Link>
      <Link className="priority temps" href="/dossiers/temps-de-travail"><span className="stamp">DOSSIER PRIORITAIRE</span><h2>Temps de travail & repos</h2><p>Temps de travail effectif, PERS 77, pauses, repos, durées maximales, heures supplémentaires et articulation avec l’astreinte.</p><span className="arrow">Ouvrir le pavé Temps de travail →</span></Link>
    </div>

    <h2 className="section-title">Textes originaux, classés par niveau</h2>
    <div className="corpora">
      <Link className="corpus" href="/corpus/ieg"><span className="stamp">STATUT / BRANCHE IEG</span><h2>Textes IEG</h2><p>Statut, circulaires PERS, accords de branche et documents de référence. Les doublons, versions et textes à vérifier sont signalés.</p><span className="arrow">Parcourir le corpus IEG ↗</span></Link>
      <Link className="corpus" href="/corpus/grdf"><span className="stamp grdf">ENTREPRISE GRDF</span><h2>Textes GRDF</h2><p>Accords, décisions, notes et règles GRDF, séparés du corpus de branche et classés selon leur portée.</p><span className="arrow">Parcourir le corpus GRDF ↗</span></Link>
    </div>
  </>;
}
