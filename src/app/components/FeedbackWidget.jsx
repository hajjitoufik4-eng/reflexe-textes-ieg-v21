'use client';

import { useEffect,useState } from 'react';
import { sendBetaEvent } from '../../lib/beta-events.js';

const choices=[
  ['utile','👍 Utile'],
  ['pas_clair','🤔 Pas clair'],
  ['texte_manquant','📄 Texte manquant'],
  ['erreur','⚠️ Erreur'],
  ['suggestion','💡 Suggestion']
];

export default function FeedbackWidget(){
  const [open,setOpen]=useState(false);
  const [type,setType]=useState('utile');
  const [message,setMessage]=useState('');
  const [tester,setTester]=useState('');
  const [state,setState]=useState('idle');

  useEffect(()=>{
    try{setTester(localStorage.getItem('reflexe-tester')||'');}catch{}
  },[]);

  async function submit(e){
    e.preventDefault();
    setState('sending');
    try{
      try{if(tester)localStorage.setItem('reflexe-tester',tester);}catch{}
      await sendBetaEvent('feedback',{
        feedback_type:type,
        message,
        tester_label:tester,
        page_path:window.location.pathname+window.location.search,
        search_query:new URLSearchParams(window.location.search).get('q')||'',
        document_ref:''
      });
      setState('sent');setMessage('');
      setTimeout(()=>{setOpen(false);setState('idle');},1200);
    }catch{setState('error');}
  }

  return <>
    <button className="feedback-fab" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>💬 <span>Mon avis</span></button>
    {open&&<div className="feedback-panel" role="dialog" aria-label="Donner mon avis sur Réflexe IEG">
      <div className="feedback-head"><div><small>PHASE TEST</small><strong>Ton retour nous aide à améliorer l’appli</strong></div><button onClick={()=>setOpen(false)} aria-label="Fermer">×</button></div>
      <form onSubmit={submit}>
        <div className="feedback-types">{choices.map(([value,label])=><button type="button" key={value} className={type===value?'active':''} onClick={()=>setType(value)}>{label}</button>)}</div>
        <label>Ton prénom ou pseudo <input value={tester} onChange={e=>setTester(e.target.value)} placeholder="Optionnel" maxLength={200}/></label>
        <label>Dis-nous ce qu’il faut garder ou changer <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ex. Je n’ai pas compris pourquoi ce texte apparaît…" maxLength={4000}/></label>
        <button className="feedback-submit" disabled={state==='sending'}>{state==='sending'?'Envoi…':'Envoyer mon avis'}</button>
        {state==='sent'&&<p className="feedback-status success">Merci, retour enregistré.</p>}
        {state==='error'&&<p className="feedback-status error">Le retour n’a pas pu être envoyé. Réessaie.</p>}
      </form>
    </div>}
  </>;
}
