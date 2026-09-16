import Link from 'next/link';
export default function Home() {
  return (
    <>
      <div className="eyebrow">Vos droits, plus simplement</div>
      <h1>Par où souhaitez-vous commencer ?</h1>
      <p className="muted">
        Choisissez votre corpus. Chaque texte dispose de sa propre fiche de
        lecture.
      </p>
      <div className="corpora">
        <Link className="corpus" href="/corpus/ieg">
          <span className="stamp">BRANCHE IEG</span>
          <h2>Le cadre de la branche</h2>
          <p>PERS, accords de branche et circulaires issus du corpus IEG.</p>
          <span className="arrow">Explorer les textes de branche ↗</span>
        </Link>
        <Link className="corpus" href="/corpus/grdf">
          <span className="stamp grdf">GRDF</span>
          <h2>Les textes de l’entreprise</h2>
          <p>
            Accords et notes GRDF, en distinguant le national du régional et du
            local.
          </p>
          <span className="arrow">Explorer les textes GRDF ↗</span>
        </Link>
      </div>
    </>
  );
}
