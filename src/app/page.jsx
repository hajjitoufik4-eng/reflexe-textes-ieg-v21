import Link from 'next/link';

const hierarchy = [
  {
    n:'1', icon:'⚖️', title:'Droit commun & Europe',
    text:'Le socle général : Code du travail, règles européennes et autres normes applicables.',
    detail:'On commence ici pour savoir ce que la loi impose ou permet. Ensuite seulement on regarde ce que les textes IEG et GRDF précisent.'
  },
  {
    n:'2', icon:'📘', title:'Statut & branche IEG',
    text:'Statut national, PERS, Notes DP, Circulaires N et accords de branche.',
    detail:'Ces textes organisent les règles propres aux IEG. Ils doivent être lus avec leur date, leur champ d’application et les textes qui les ont modifiés.'
  },
  {
    n:'3', icon:'🏢', title:'GRDF',
    text:'Accords, décisions, notes RH ou métier et règlement intérieur.',
    detail:'Ils mettent en œuvre ou précisent les règles dans l’entreprise. Une note n’a pas le même rôle qu’un accord : l’application les sépare.'
  },
  {
    n:'4', icon:'📍', title:'Local',
    text:'Textes applicables à une direction, unité ou zone déterminée.',
    detail:'Ils ne concernent que le périmètre prévu. Un texte plus local n’est pas automatiquement “plus fort” : on vérifie toujours les niveaux supérieurs.'
  },
];

const primaryThemes = [
  {
    icon:'🕒', tone:'blue', title:'Temps de travail & repos',
    text:'Durées, repos, pauses, astreinte, RTT, congés…',
    items:[
      ['Temps de travail','temps-travail'],
      ['Repos & pauses','repos-pauses'],
      ['Astreinte','astreinte'],
      ['Congés, RTT & CET','conges-rtt-cet'],
    ]
  },
  {
    icon:'💶', tone:'gold', title:'Rémunération & frais',
    text:'Salaire, primes, repas, déplacements…',
    items:[
      ['Rémunération','remuneration'],
      ['Repas','repas'],
      ['Déplacements & frais','deplacements'],
      ['Heures supplémentaires','heures-sup'],
    ]
  },
  {
    icon:'⚡', tone:'green', title:'Tarif agent & avantages',
    text:'Énergie, résidence secondaire, logement…',
    items:[
      ['Tarif agent énergie','tarif-agent'],
      ['Résidence secondaire','residence-secondaire'],
      ['Logement','logement'],
    ]
  },
  {
    icon:'🧭', tone:'purple', title:'Carrière & emploi',
    text:'Classification, mutation, mobilité, affectation…',
    items:[
      ['Classification & classement','classification'],
      ['Mobilité, mutation & affectation','mobilite'],
    ]
  },
  {
    icon:'🦺', tone:'teal', title:'Santé & famille',
    text:'Accident, maladie, handicap, parentalité…',
    items:[
      ['Accident du travail & maladie','accident-maladie'],
      ['Handicap','handicap'],
      ['Famille & parentalité','famille'],
      ['Enfant malade','enfant-malade'],
    ]
  },
  {
    icon:'🗣️', tone:'pink', title:'Mandats & règles internes',
    text:'CSE, CSSCT, droit syndical, discipline…',
    items:[
      ['CSE & CSSCT','cse-cssct'],
      ['Droit syndical & délégation','droit-syndical'],
      ['Discipline & sanctions','discipline'],
    ]
  },
];

function ThemeDrawer({theme}){
  return <details className={`home-drawer drawer-${theme.tone}`}>
    <summary>
      <span className="drawer-icon" aria-hidden="true">{theme.icon}</span>
      <span className="drawer-copy"><strong>{theme.title}</strong>{theme.text&&<small>{theme.text}</small>}</span>
      <span className="drawer-open">Choisir</span>
    </summary>
    <div className="drawer-items">
      {theme.items.map(([label,slug])=><Link key={label} href={`/dossiers/${slug}`}>
        <span>📁</span><strong>{label}</strong><i>→</i>
      </Link>)}
    </div>
  </details>;
}

export default function Home() {
  return <>
    <section className="home-hero home-hero-simple">
      <div className="hero-copy">
        <span className="hero-badge">⚡ Le droit IEG, sans jargon</span>
        <h1>Pose une question simple.<br/><span>Découvre seulement ce dont tu as besoin.</span></h1>
        <p>Une réponse claire d’abord. Les explications ensuite. Les textes seulement si tu veux aller plus loin.</p>
        <form className="hero-search" action="/recherche">
          <span aria-hidden="true">🔎</span>
          <input name="q" placeholder="Ex. Ai-je droit à une indemnité de repas ?" aria-label="Décris ta question"/>
          <button>Explique-moi</button>
        </form>
        <div className="hero-path">
          <span><b>1</b> Je comprends</span>
          <span><b>2</b> J’approfondis</span>
          <span><b>3</b> Je vérifie le texte</span>
        </div>
      </div>
      <div className="hero-guide" aria-hidden="true">
        <div className="guide-face">R<span>⚡</span></div>
        <div className="guide-bubble"><strong>Commence par ta question.</strong><p>Tu n’as pas besoin de connaître une PERS ou un accord.</p></div>
      </div>
    </section>

    <section className="home-section hierarchy-lite">
      <div className="section-heading simple-heading">
        <div><span className="section-kicker">Le repère essentiel</span><h2>Dans quel ordre lire les textes ?</h2></div>
        <p>Quatre niveaux. Clique seulement si tu veux comprendre le rôle de chacun.</p>
      </div>
      <div className="hierarchy-line">
        {hierarchy.map(h=><details key={h.n} className="hierarchy-mini">
          <summary><span className="hier-num">{h.n}</span><span className="hier-icon">{h.icon}</span><strong>{h.title}</strong><small>{h.text}</small><i>+</i></summary>
          <p>{h.detail}</p>
        </details>)}
      </div>
      <div className="hierarchy-note"><span>⚠️</span><p><strong>À retenir :</strong> un texte plus local n’est pas automatiquement prioritaire. Il faut vérifier sa matière, son champ d’application, sa date et les textes supérieurs qu’il met en œuvre.</p></div>
    </section>

    <section className="read-lite">
      <details>
        <summary><span>🧠</span><div><small>Mode d’emploi</small><strong>Comment lire un texte sans être juriste ?</strong></div><b>Découvrir →</b></summary>
        <div className="read-lite-grid">
          <div><span>1</span><strong>Quel type de texte ?</strong><p>Accord, PERS, note, décision, article du Code… leur rôle n’est pas le même.</p></div>
          <div><span>2</span><strong>À qui s’applique-t-il ?</strong><p>Branche entière, GRDF, site local, métier ou population précise.</p></div>
          <div><span>3</span><strong>Est-il toujours à jour ?</strong><p>On vérifie la date, les modifications, remplacements et textes liés.</p></div>
        </div>
      </details>
    </section>

    <section id="themes" className="home-section folders-section">
      <div className="section-heading simple-heading">
        <div><span className="section-kicker">Explorer sans se perdre</span><h2>Choisis un domaine, puis un dossier</h2></div>
        <p>Aucun catalogue de 100 textes : tu avances un niveau à la fois.</p>
      </div>
      <div className="drawer-grid">
        {primaryThemes.map(theme=><ThemeDrawer theme={theme} key={theme.title}/>)}
      </div>
      <div className="home-sidebar-hint"><span>🗂️</span><p><strong>Tu veux aller directement à un sujet précis ?</strong> Les 24 dossiers sont disponibles en permanence dans la barre latérale.</p></div>
    </section>

    <section className="home-final">
      <div><span>🔎</span><div><strong>Tu sais déjà ce que tu cherches ?</strong><p>Utilise la recherche libre. L’application répond d’abord, puis te laisse choisir jusqu’où tu veux aller.</p></div></div>
      <Link href="/recherche">Ouvrir la recherche <span>→</span></Link>
    </section>
  </>;
}
