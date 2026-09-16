import Link from 'next/link';
import './globals.css';
import './extras.css';
export const metadata={title:{default:'Réflexe IEG — Textes et droits',template:'%s · Réflexe IEG'},description:'Textes IEG et GRDF, explications, originaux et jurisprudence.'};
export default function Layout({children}){return <html lang="fr"><body><a className="skip" href="#contenu">Aller au contenu</a><header><Link className="brand" href="/"><span aria-hidden="true">⚖️</span> Réflexe <span>IEG</span></Link><nav className="topnav"><Link href="/dossiers/astreinte">Astreinte</Link><Link href="/dossiers/temps-de-travail">Temps de travail</Link><Link href="/corpus/ieg">IEG</Link><Link href="/corpus/grdf">GRDF</Link><Link href="/jurisprudence">Jurisprudence</Link><Link href="/recherche">🔎 Recherche</Link></nav></header><main id="contenu">{children}</main><footer>Réflexe IEG · Source originale + niveau juridique + explication + jurisprudence lorsqu’elle est pertinente.</footer></body></html>}
