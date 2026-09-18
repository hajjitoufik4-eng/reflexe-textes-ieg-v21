'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { dossierNavigation, allDossierLinks } from '../../data/dossier-navigation.js';

export default function DossierSidebar(){
  const pathname=usePathname();
  const activeSlug=pathname?.startsWith('/dossiers/')?pathname.split('/')[2]:null;
  const activeEntry=useMemo(()=>allDossierLinks.find(item=>item.slug===activeSlug)||null,[activeSlug]);
  const [panelOpen,setPanelOpen]=useState(false);
  const [openGroup,setOpenGroup]=useState(activeEntry?.group||null);

  useEffect(()=>{
    setOpenGroup(activeEntry?.group||null);
  },[activeEntry?.group]);

  const content=<>
    <div className="dossier-side-head">
      <div><span>🗂️</span><div><strong>Les dossiers</strong><small>Choisis un domaine, puis un sujet</small></div></div>
      <button className="dossier-side-close" type="button" onClick={()=>setPanelOpen(false)} aria-label="Fermer les dossiers">×</button>
    </div>

    <Link className="dossier-side-home" href="/" onClick={()=>setPanelOpen(false)}>
      <span>⌂</span><strong>Accueil</strong><i>›</i>
    </Link>

    <nav className="dossier-side-nav" aria-label="Tous les dossiers">
      {dossierNavigation.map(group=>{
        const expanded=openGroup===group.group;
        const activeInGroup=activeEntry?.group===group.group;
        return <section key={group.group} className={`dossier-side-group ${activeInGroup?'active-group':''}`}>
          <button
            type="button"
            className="dossier-side-group-title"
            aria-expanded={expanded}
            onClick={()=>setOpenGroup(expanded?null:group.group)}
          >
            <span>{group.icon}</span>
            <strong>{group.group}</strong>
            <small>{group.items.length}</small>
            <i>{expanded?'−':'+'}</i>
          </button>
          {expanded&&<div className="dossier-side-links">
            {group.items.map(([slug,label])=>{
              const href=`/dossiers/${slug}`;
              const active=pathname===href;
              return <Link key={slug} href={href} className={active?'active':''} onClick={()=>setPanelOpen(false)}>
                <span>{label}</span><i>›</i>
              </Link>;
            })}
          </div>}
        </section>;
      })}
    </nav>

    <div className="dossier-side-foot">
      <span>24 dossiers disponibles</span>
      <small>Ils restent classés pour éviter de tout afficher d’un coup.</small>
    </div>
  </>;

  return <>
    <aside className="dossier-sidebar">{content}</aside>

    <button
      className="dossier-mobile-button"
      type="button"
      onClick={()=>setPanelOpen(true)}
      aria-expanded={panelOpen}
      aria-controls="dossier-mobile-panel"
    >
      <span>🗂️</span><strong>{activeEntry?activeEntry.label:'Dossiers'}</strong>
    </button>

    {panelOpen&&<div className="dossier-mobile-overlay" onClick={()=>setPanelOpen(false)}>
      <aside id="dossier-mobile-panel" className="dossier-mobile-panel" onClick={e=>e.stopPropagation()}>{content}</aside>
    </div>}
  </>;
}
