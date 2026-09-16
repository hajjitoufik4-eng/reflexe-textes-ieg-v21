import Link from 'next/link';
export default function Home() {
  return <>
    <div className="eyebrow">Réflexe Textes IEG</div>
    <h1>Retrouver un droit, le texte applicable et son original</h1>
    <p className="muted">Recherche dans le corpus fourni, avec séparation entre textes IEG / branche et textes propres à GRDF. Le catalogue comprend désormais 697 références documentaires et une rubrique jurisprudence avec le rendu des décisions.</p>
    <form className="searchbox" action="/recherche"><input name="q" placeholder="Posez une question ou une référence : astreinte, 48 h, repos, PERS 530, repas…" aria-label="Recherche"/><button>Rechercher</button></form>

    <div className="priority-grid">
      <Link className="priority astreinte" href="/dossiers/astreinte"><span className="stamp">DOSSIER PRIORITAIRE</span><h2>Astreinte</h2><p>PERS 530, PERS 557, PERS 849, PERS 939, notes DP, M-RES, ZHA, règles GRDF, repos et jurisprudence.</p><span className="arrow">Ouvrir le pavé Astreinte →</span></Link>
      <Link className="priority temps" href="/dossiers/temps-de-travail"><span className="stamp">DOSSIER PRIORITAIRE</span><h2>Temps de travail & repos</h2><p>PERS 77, accords temps de travail, pauses, repos, 48 heures, heures supplémentaires et articulation avec l’astreinte.</p><span className="arrow">Ouvrir le pavé Temps de travail →</span></Link>
      <Link className="priority justice" href="/jurisprudence"><span className="stamp">7 DÉCISIONS VÉRIFIÉES</span><h2>Jurisprudence & résultats</h2><p>Cassations, arrêts de renvoi, CJUE, résultat concret et montants accordés lorsqu’ils sont connus.</p><span className="arrow">Voir les décisions →</span></Link>
    </div>

    <h2 className="section-title">Textes originaux, classés par niveau</h2>
    <div className="corpora">
      <Link className="corpus" href="/corpus/ieg"><span className="stamp">STATUT / BRANCHE IEG</span><h2>Textes IEG</h2><p>Statut, circulaires PERS, notes DP, circulaires N, accords de branche et documents utiles. Les décisions d’extension fournies sont également indexées.</p><span className="arrow">Parcourir le corpus IEG ↗</span></Link>
      <Link className="corpus" href="/corpus/grdf"><span className="stamp grdf">ENTREPRISE GRDF</span><h2>Textes GRDF</h2><p>Accords, décisions, notes métier et RH, règles nationales et documents Île-de-France, séparés du corpus de branche.</p><span className="arrow">Parcourir le corpus GRDF ↗</span></Link>
    </div>
  </>;
}
