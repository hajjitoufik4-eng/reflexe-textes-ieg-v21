'use client';

import { useEffect } from 'react';
import { sendBetaEvent } from '../../lib/beta-events.js';

export default function SearchTracker({query,resultCount}){
  useEffect(()=>{
    if(!query)return;
    let session='';
    try{
      session=sessionStorage.getItem('reflexe-session')||crypto.randomUUID();
      sessionStorage.setItem('reflexe-session',session);
    }catch{}
    sendBetaEvent('search',{
      query,
      result_count:resultCount,
      page_path:window.location.pathname+window.location.search,
      session_id:session
    }).catch(()=>{});
  },[query,resultCount]);
  return null;
}
