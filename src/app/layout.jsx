import Link from 'next/link';
import AppInstall from './components/AppInstall';
import './globals.css';
import './extras.css';
import './catalogue.css';
import './law.css';
import './search.css';
import './text.css';
import './install.css';

export const metadata={
  title:{default:'Réflexe IEG — Tes droits, simplement',template:'%s · Réflexe IEG'},
  description:'Comprendre simplement les textes IEG et GRDF, retrouver la source originale et la jurisprudence utile.',
  manifest:'/manifest.webmanifest',
  icons:{icon:'/app-icon.svg',apple:'/app-icon.svg'},
  appleWebApp:{capable:true,title:'Réflexe IEG',statusBarStyle:'default'}
};

export const viewport={themeColor:'#173b72',width:'device-width',initialScale:1,viewportFit:'cover'};

export default function Layout({children}){
  return <html lang="fr"><body>
    <a className="skip" href="#contenu">Aller au contenu</a>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Réflexe IEG — Accueil">
        <span className="brand-logo" aria-hidden="true"><b>R</b><i>⚡</i></span>
        <span className="brand-copy"><strong>Réflexe</strong><small>TEXTES IEG</small></span>
      </Link>
      <nav className="topnav" aria-label="Navigation principale">
        <Link href="/#themes">Comprendre</Link>
        <Link href="/corpus/ieg">Textes IEG</Link>
        <Link href="/corpus/grdf">GRDF</Link>
        <Link href="/jurisprudence">Décisions</Link>
        <Link className="nav-search" href="/recherche">🔎 Rechercher</Link>
      </nav>
    </header>
    <main id="contenu">{children}</main>
    <footer>
      <strong>Réflexe IEG</strong><span>Comprendre d’abord. Vérifier la source ensuite.</span>
    </footer>
    <nav className="mobile-nav" aria-label="Navigation mobile">
      <Link href="/"><span>⌂</span><small>Accueil</small></Link>
      <Link href="/recherche"><span>⌕</span><small>Chercher</small></Link>
      <Link href="/#themes"><span>▦</span><small>Thèmes</small></Link>
      <Link href="/jurisprudence"><span>⚖</span><small>Décisions</small></Link>
    </nav>
    <AppInstall/>
  </body></html>
}
