'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { sendBetaEvent } from '../../lib/beta-events.js';

export default function RechercheTemplate({children}){
  const params=useSearchParams();
  const q=(params.get('q')||'').trim();
  useEffect(()=>{
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
  },[q]);
  return children;
}
