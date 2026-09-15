import Link from 'next/link';
import './globals.css';
export const metadata = {
  title: {
    default: 'Réflexe IEG — Vos droits, plus simplement',
    template: '%s · Réflexe IEG',
  },
  description:
    'Consultez les textes de branche IEG et les textes GRDF, leurs documents originaux et leurs fiches de lecture.',
};
export default function Layout({ children }) {
  return (
    <html lang="fr">
      <body>
        <a className="skip" href="#contenu">
          Aller au contenu
        </a>
        <header>
          <Link className="brand" href="/">
            <span aria-hidden="true">⚖️</span> Réflexe <span>IEG</span>
          </Link>
          <span className="project">Vos textes de référence</span>
        </header>
        <main id="contenu">{children}</main>
        <footer>
          Textes de branche et textes GRDF séparés · Applicabilité à vérifier ·
          Recherche par référence, titre et thème.
        </footer>
      </body>
    </html>
  );
}
