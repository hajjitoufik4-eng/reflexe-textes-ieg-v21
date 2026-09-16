import Link from 'next/link';
export default function Home() {
  return <>
    <div className="eyebrow">Réflexe Textes IEG</div>
    <h1>Retrouver un droit, le texte applicable et son original</h1>
    <p className="muted">La priorité est donnée aux dossiers pratiques. Les originaux restent accessibles dans leur corpus juridique : IEG / branche d’un côté, GRDF de l’autre.</p>
    <form className="searchbox" action="/recherche"><input name="q" placeholder="Posez un mot-clé : astreinte, 48 h, repos, PERS 530, repas…" aria-label="Recherche"/><button>Rechercher</button></form>

    <div className="priority-grid">
      <Link className="priority astreinte" href="/recherche?q=astreinte"><span className="stamp">DOSSIER PRIORITAIRE</span><h2>Astreinte</h2><p>PERS 530, 557, 849, 939, textes d’application, règles GRDF, temps d’intervention, contraintes, repos et jurisprudence.</p><span className="arrow">Ouvrir le pavé Astreinte →</span></Link>
      <Link className="priority temps" href="/recherche?q=temps+de+travail"><span className="stamp">DOSSIER PRIORITAIRE</span><h2>Temps de travail & repos</h2><p>PERS 77, durée du travail, pauses, repos quotidien et hebdomadaire, 48 h, heures supplémentaires et articulation avec l’astreinte.</p><span className="arrow">Ouvrir le pavé Temps de travail →</span></Link>
    </div>

    <h2 className="section-title">Textes originaux, classés par niveau</h2>
    <div className="corpora">
      <Link className="corpus" href="/corpus/ieg"><span className="stamp">STATUT / BRANCHE IEG</span><h2>Textes IEG</h2><p>Statut, PERS, circulaires, accords de branche et documents utiles. Les doublons et textes modifiés doivent être distingués de la version de référence.</p><span className="arrow">Parcourir le corpus IEG ↗</span></Link>
      <Link className="corpus" href="/corpus/grdf"><span className="stamp grdf">ENTREPRISE GRDF</span><h2>Textes GRDF</h2><p>Accords, décisions et notes GRDF, séparés du corpus de branche et classés selon leur portée nationale, régionale ou locale.</p><span className="arrow">Parcourir le corpus GRDF ↗</span></Link>
    </div>
  </>;
}
