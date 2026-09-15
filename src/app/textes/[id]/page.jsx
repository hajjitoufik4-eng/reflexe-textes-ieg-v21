import Link from 'next/link';
import { notFound } from 'next/navigation';
import data from '../../../data/corpus.json';
import {
  tag,
  scopeOf,
  scopeName,
  catalogueUrl,
  safeUrl,
  isLocalPdf,
} from '../../../lib/catalogue.mjs';
export function generateStaticParams() {
  return data.map(({ id }) => ({ id }));
}
export async function generateMetadata({ params }) {
  const { id } = await params;
  const d = data.find((x) => x.id === id);
  return { title: d?.title || 'Texte introuvable' };
}
export default async function Document({ params }) {
  const { id } = await params;
  const d = data.find((x) => x.id === id);
  if (!d) notFound();
  const scope = scopeOf(d),
    x = d.explanation,
    url = safeUrl(d.url);
  return (
    <>
      <Link className="back" href={catalogueUrl(scope, { theme: d.folder })}>
        ← Retour aux textes
      </Link>
      <div className="crumb">{scopeName(scope)} / Fiche du texte</div>
      <span className={'stamp ' + (scope === 'grdf' ? 'grdf' : '')}>
        {tag(d)}
      </span>
      <h1>{x ? x.heading : d.ref || d.kind}</h1>
      <p className="muted">{d.title}</p>
      <section className="reader">
        <nav className="tabs" aria-label="Sections de la fiche">
          <a href="#explication">Explication simple</a>
          <a href="#original">Document original</a>
        </nav>
        <section id="explication">
          {x ? (
            <>
              <h2>Ce qu’il faut comprendre</h2>
              <div className="simple">{x.simple}</div>
              <h3>Ce que prévoit le texte</h3>
              <ul>
                {x.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <p className="muted">Dans le document : {x.pages}</p>
              <h3>Textes à rapprocher</h3>
              <p>{x.related}</p>
              <p className="notice">{x.limit}</p>
            </>
          ) : (
            <>
              <h2>Explication en préparation</h2>
              <p>
                Ce document est recensé. Son contenu doit encore être lu et
                vérifié pour vous proposer une explication fiable.
              </p>
              <p className="notice">
                {d.note ||
                  'Périmètre, dates et textes modificatifs à contrôler.'}
              </p>
            </>
          )}
        </section>
        <section id="original">
          <h2>Le document original</h2>
          {url ? (
            <>
              <a
                className="source"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isLocalPdf(url) ? 'Ouvrir le PDF ↗' : 'Consulter la source ↗'}
              </a>
              {isLocalPdf(url) && (
                <>
                  <a className="source" href={url} download>
                    Télécharger
                  </a>
                  <object
                    className="pdf"
                    type="application/pdf"
                    data={url}
                    aria-label={'Document original : ' + d.title}
                  >
                    <p>
                      Utilisez le lien « Ouvrir le PDF » si le document ne
                      s’affiche pas.
                    </p>
                  </object>
                </>
              )}
            </>
          ) : (
            <p>L’original n’est pas encore relié à cette fiche.</p>
          )}
        </section>
      </section>
    </>
  );
}
