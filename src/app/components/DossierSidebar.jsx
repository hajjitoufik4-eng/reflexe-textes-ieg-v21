'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { dossierNavigation, allDossierLinks } from '../../data/dossier-navigation.js';

export default function DossierSidebar(){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);

  const content=<>
    <div className="dossier-side-head">
      <div><span>🗂️</span><div><strong>Tous les dossiers</strong><small>{allDossierLinks.length} accès directs</small></div></div>
      <button className="dossier-side-close" type="button" onClick={()=>setOpen(false)} aria-label="Fermer les dossiers">×</button>
    </div>
    <nav className="dossier-side-nav" aria-label="Tous les dossiers">
      {dossierNavigation.map(group=><section key={group.group} className="dossier-side-group">
        <div className="dossier-side-group-title"><span>{group.icon}</span><strong>{group.group}</strong></div>
        <div className="dossier-side-links">
          {group.items.map(([slug,label])=>{
            const href=`/dossiers/${slug}`;
            const active=pathname===href;
            return <Link key={slug} href={href} className={active?'active':''} onClick={()=>setOpen(false)}>
              <span>{label}</span><i>›</i>
            </Link>;
          })}
        </div>
      </section>)}
    </nav>
  </>;

  return <>
    <aside className="dossier-sidebar">{content}</aside>
    <button className="dossier-mobile-button" type="button" onClick={()=>setOpen(true)} aria-expanded={open} aria-controls="dossier-mobile-panel">
      <span>🗂️</span><strong>24 dossiers</strong>
    </button>
    {open&&<div className="dossier-mobile-overlay" onClick={()=>setOpen(false)}>
      <aside id="dossier-mobile-panel" className="dossier-mobile-panel" onClick={e=>e.stopPropagation()}>{content}</aside>
    </div>}
  </>;
}
