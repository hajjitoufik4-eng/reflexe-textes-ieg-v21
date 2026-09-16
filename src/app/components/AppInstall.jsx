'use client';

import { useEffect, useState } from 'react';

export default function AppInstall(){
  const [prompt,setPrompt]=useState(null);
  const [ios,setIos]=useState(false);
  const [installed,setInstalled]=useState(false);

  useEffect(()=>{
    if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}
    const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
    setInstalled(standalone);
    const ua=window.navigator.userAgent.toLowerCase();
    setIos(/iphone|ipad|ipod/.test(ua)&&!standalone);
    const onPrompt=e=>{e.preventDefault();setPrompt(e);};
    const onInstalled=()=>{setInstalled(true);setPrompt(null);};
    window.addEventListener('beforeinstallprompt',onPrompt);
    window.addEventListener('appinstalled',onInstalled);
    return()=>{window.removeEventListener('beforeinstallprompt',onPrompt);window.removeEventListener('appinstalled',onInstalled);};
  },[]);

  if(installed)return null;
  const install=async()=>{if(!prompt)return;prompt.prompt();await prompt.userChoice;setPrompt(null);};
  if(!prompt&&!ios)return null;

  return <div className="install-banner" role="status">
    <div className="install-app-icon">⚡</div>
    <div className="install-copy"><strong>Installer Réflexe IEG</strong><small>{ios?'Sur iPhone : Partager puis « Sur l’écran d’accueil ».':'Ajoute l’application sur ton téléphone pour la phase test.'}</small></div>
    {prompt&&<button onClick={install}>Installer</button>}
  </div>;
}
