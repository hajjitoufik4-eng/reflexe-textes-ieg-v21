'use client';

import { useEffect } from 'react';
import { sendBetaEvent } from '../../lib/beta-events.js';

export default function RechercheTemplate({children}){
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const q=(params.get('q')||'').trim();
    if(!q)return;
    let session='';
    try{
      session=sessionStorage.getItem('reflexe-session')||crypto.randomUUID();
      sessionStorage.setItem('reflexe-session',session);
    }catch{}
    sendBetaEvent('search',{
      query:q,
      result_count:null,
      page_path:window.location.pathname+window.location.search,
      session_id:session
    }).catch(()=>{});
  },[]);
  return children;
}
