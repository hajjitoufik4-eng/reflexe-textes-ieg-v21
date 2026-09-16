import Link from 'next/link';

const topics = [
  { icon:'⏱️', tone:'blue', title:'Je suis d’astreinte', text:'Départ, intervention, ZHA, repos, 48 h…', href:'/dossiers/astreinte' },
  { icon:'🕒', tone:'teal', title:'Mon temps de travail', text:'Horaires, pause, repos, heures sup, JRTT…', href:'/dossiers/temps-de-travail' },
  { icon:'🍽️', tone:'orange', title:'Repas & déplacements', text:'PERS 793, repas du midi/soir, frais, trajet…', href:'/recherche?q=PERS+793+repas+d%C3%A9placement' },
  { icon:'⚠️', tone:'red', title:'On me reproche quelque chose', text:'Sanction, rappel, EP1, EP2, procédure disciplinaire…', href:'/recherche?q=PERS+846+discipline+sanction' },
  { icon:'💶', tone:'gold', title:'Salaire, primes & indemnités', text:'Majoration, indemnité, remboursement, barème…', href:'/recherche?q=prime+indemnit%C3%A9+r%C3%A9mun%C3%A9ration' },
  { icon:'🦺', tone:'green', title:'Santé & sécurité', text:'Accident, chaleur, RPS, prévention, conditions de travail…', href:'/recherche?q=sant%C3%A9+s%C3%A9curit%C3%A9+conditions+de+travail' },
  { icon:'🗣️', tone:'purple', title:'Je suis élu / représentant', text:'CSE, CSSCT, Proxi, déplacements, temps de mandat…', href:'/recherche?q=CSE+CSSCT+mandat+d%C3%A9placement' },
  { icon:'👨‍👩‍👧', tone:'pink', title:'Famille & absences', text:'Enfant, congé, absence, parentalité, droits familiaux…', href:'/recherche?q=famille+enfant+cong%C3%A9+absence' },
];

const essentials = [
  { icon:'🕒', ref:'PERS 77', title:'Travail, repos, congés', text:'Le texte historique à connaître sur les horaires, heures supplémentaires et repos.', href:'/textes/d111' },
  { icon:'🍽️', ref:'PERS 793', title:'Frais de déplacement', text:'Le texte clé pour les repas et déplacements professionnels.', href:'/textes/d35' },
  { icon:'📟', ref:'PERS 530', title:'Astreinte', text:'Le cadre historique de l’astreinte, des interventions et du logement imposé.', href:'/textes/d19' },
  { icon:'🔔', ref:'PERS 557', title:'Astreinte mise à jour', text:'Action immédiate, interventions, repos hebdomadaire et compensation.', href:'/textes/d65' },
  { icon:'📅', ref:'Accord 2011', title:'Temps de travail GRDF', text:'Le cadre national GRDF du temps de travail.', href:'/textes/d594' },
];

export default function Home() {
  return <>
    <section className="home-hero">
      <div className="hero-copy">
        <span className="hero-badge">⚡ Le droit IEG, sans jargon</span>
        <h1>Une question au boulot ?<br/><span>Trouve la règle en 30 secondes.</span></h1>
        <p>Pas besoin de connaître le numéro d’une PERS. Écris simplement ton problème : on te montre d’abord l’explication, puis le texte et la jurisprudence si elle existe.</p>
        <form className="hero-search" action="/recherche">
          <span aria-hidden="true">🔎</span>
          <input name="q" placeholder="Ex. Ma pause est coupée par une intervention…" aria-label="Décris ta question"/>
          <button>Voir mes droits</button>
        </form>
        <div className="search-suggestions" aria-label="Exemples de recherches">
          <Link href="/recherche?q=48+h+astreinte">48 h en astreinte</Link>
          <Link href="/recherche?q=repas+18h30+PERS+793">Repas du soir</Link>
          <Link href="/recherche?q=pause+m%C3%A9ridienne+PERS+77">Pause méridienne</Link>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="phone-card card-one"><span>🍽️</span><div><small>Repas</small><strong>Entre 18 h et 21 h ?</strong></div><b>→</b></div>
        <div className="phone-card card-two"><span>⏱️</span><div><small>Astreinte</small><strong>Repos après intervention</strong></div><b>→</b></div>
        <div className="phone-card card-three"><span>⚖️</span><div><small>Jurisprudence</small><strong>Voir le rendu concret</strong></div><b>→</b></div>
        <div className="hero-stat"><strong>697</strong><span>références triées</span></div>
      </div>
    </section>

    <section id="themes" className="home-section">
      <div className="section-heading">
        <div><span className="section-kicker">Commence ici</span><h2>Qu’est-ce qui t’arrive ?</h2></div>
        <p>Choisis une situation. Pas un numéro de texte.</p>
      </div>
      <div className="topic-grid">
        {topics.map(t=><Link key={t.title} href={t.href} className={`topic-card tone-${t.tone}`}>
          <span className="topic-icon" aria-hidden="true">{t.icon}</span>
          <div><h3>{t.title}</h3><p>{t.text}</p></div>
          <span className="topic-arrow" aria-hidden="true">›</span>
        </Link>)}
      </div>
    </section>

    <section className="how-section">
      <div className="section-heading light-heading"><div><span className="section-kicker">Simple par principe</span><h2>Tu ne lis pas un texte de 20 pages pour avoir une réponse.</h2></div></div>
      <div className="steps-grid">
        <div className="step-card"><span>1</span><strong>On t’explique</strong><p>La règle avec des mots simples et un exemple concret.</p></div>
        <div className="step-card"><span>2</span><strong>On te montre la preuve</strong><p>Article, PERS, accord GRDF ou texte de branche.</p></div>
        <div className="step-card"><span>3</span><strong>On ajoute les décisions</strong><p>Jurisprudence, rendu et montants quand ils sont connus.</p></div>
      </div>
    </section>

    <section className="home-section essentials-section">
      <div className="section-heading">
        <div><span className="section-kicker">À garder sous la main</span><h2>Les textes qui reviennent tout le temps</h2></div>
        <Link className="section-link" href="/corpus/ieg">Voir tous les textes →</Link>
      </div>
      <div className="essential-scroll">
        {essentials.map(e=><Link className="essential-card" href={e.href} key={e.ref}>
          <span className="essential-icon">{e.icon}</span><span className="essential-ref">{e.ref}</span><h3>{e.title}</h3><p>{e.text}</p><b>Comprendre ce texte →</b>
        </Link>)}
      </div>
    </section>

    <section className="decision-banner">
      <div className="decision-icon">⚖️</div>
      <div><span className="section-kicker">Ce que les juges ont vraiment décidé</span><h2>La jurisprudence, avec le résultat concret.</h2><p>Cassation, renvoi, sommes accordées, limites de la décision : on évite les résumés trompeurs.</p></div>
      <Link href="/jurisprudence">Voir les décisions <span>→</span></Link>
    </section>

    <section className="home-section raw-section">
      <div className="section-heading"><div><span className="section-kicker">Pour aller à la source</span><h2>Tu connais déjà le texte ?</h2></div><p>Accède directement au corpus complet.</p></div>
      <div className="source-doors">
        <Link href="/corpus/ieg" className="source-door ieg-door"><span className="door-logo">IEG</span><div><strong>Statut & branche IEG</strong><p>PERS, notes DP, circulaires N, accords de branche…</p></div><b>→</b></Link>
        <Link href="/corpus/grdf" className="source-door grdf-door"><span className="door-logo">G</span><div><strong>Textes GRDF</strong><p>Accords, décisions, notes métier et règles locales.</p></div><b>→</b></Link>
      </div>
    </section>
  </>;
}
