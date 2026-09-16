const N=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

export const legalPacks=[
  {
    id:'astreinte', label:'Astreinte', icon:'📟',
    triggers:['astreinte','action immediate','départ immédiat','depart immediat','zha','zone habitat','intervention de sécurité gaz','isg','mres','m-res'],
    refs:['PERS530','PERS557','PERS849','PERS939','N69-76','DP31-28','DP31-103'],
    titles:['astreinte et intervention de sécurité gaz','organisation du dispositif d’astreinte gaz','organisation du dispositif d astreinte gaz','repos quotidien de 11 heures','évolution zha','evolution zha','accord national sur le temps de travail','accord temps de travail — direction réseaux','accord temps de travail direction réseaux','note enedis grdf temps de travail'],
    reason:'Ce texte doit être lu avec les autres règles qui organisent l’astreinte, l’intervention, la durée du travail et le repos.'
  },
  {
    id:'temps', label:'Temps de travail & repos', icon:'🕒',
    triggers:['temps de travail','horaire','heures supplémentaires','heures supplementaires','48 h','48h','44 h','44h','12 h','12h','repos 11','11 h','repos quotidien','repos hebdomadaire','pause','pause méridienne','pause meridienne','jrt','jrtt'],
    refs:['PERS77'],
    titles:['accord national sur le temps de travail','accord temps de travail','note enedis grdf temps de travail','repos quotidien de 11 heures','m-rh 13-04','m rh 13 04'],
    reason:'Cette règle se combine avec les accords de temps de travail, les maxima de durée et les règles de repos.'
  },
  {
    id:'repas', label:'Repas & déplacements', icon:'🍽️',
    triggers:['repas','déplacement','deplacement','frais','11 h et 13 h','11h 13h','18 h et 21 h','18h 21h','cantine'],
    refs:['PERS793'], titles:[],
    reason:'La PERS 793 fixe le droit de base ; sa décision d’extension et la jurisprudence doivent être lues avec elle lorsque la preuve ou l’ouverture du droit est discutée.'
  },
  {
    id:'discipline', label:'Discipline & procédure', icon:'⚠️',
    triggers:['discipline','sanction','avertissement','blâme','blame','ep1','ep2','courrier de rappel','faute','culture juste'],
    refs:['PERS846'], titles:['règlement intérieur grdf','reglement interieur grdf','culture juste'],
    reason:'La procédure disciplinaire ne se lit pas isolément : PERS, règlement intérieur et règles internes doivent être articulés.'
  },
  {
    id:'mandats', label:'CSE, CSSCT & mandat', icon:'🗣️',
    triggers:['cse','cssct','proxi','élu','elu','mandat','délégation','delegation','réunion employeur','reunion employeur'],
    refs:[], titles:['guide idf des élus cse-e','guide idf des elus cse-e'],
    reason:'Le guide pratique et les règles de mandat doivent être rapprochés selon la situation : temps, déplacement, frais ou réunion employeur.'
  },
  {
    id:'sante', label:'Santé & sécurité', icon:'🦺',
    triggers:['santé','sante','sécurité','securite','danger grave','dgi','rps','accident du travail','chaleur','canicule','epi'],
    refs:[], titles:['règlement intérieur grdf','reglement interieur grdf','culture juste'],
    reason:'Les règles internes doivent être lues avec les obligations de prévention et les procédures santé-sécurité.'
  }
];

export function packsForQuery(query){
  const q=N(query);
  const found=legalPacks.filter(p=>p.triggers.some(t=>q.includes(N(t))));
  const add=id=>{if(!found.some(p=>p.id===id)) found.push(legalPacks.find(p=>p.id===id));};
  if(/\bpers\s*530\b|\bpers530\b|\bpers\s*557\b|\bpers557\b|\bpers\s*849\b|\bpers849\b|\bpers\s*939\b|\bpers939\b/.test(q)) add('astreinte');
  if(/\bpers\s*77\b|\bpers77\b/.test(q)) add('temps');
  if(/\bpers\s*793\b|\bpers793\b/.test(q)) add('repas');
  if(/\bpers\s*846\b|\bpers846\b/.test(q)) add('discipline');
  if(found.some(p=>p.id==='astreinte')) add('temps');
  if(found.some(p=>p.id==='mandats')&&(/repas|frais|déplacement|deplacement/.test(q))) add('repas');
  return found.filter(Boolean);
}

export function correlationFor(document,packs){
  const ref=String(document.ref||'').replace(/\s+/g,'').toUpperCase();
  const hay=N(`${document.title||''} ${document.origin||''} ${document.theme||''}`);
  for(const p of packs){
    if(p.refs.includes(ref)) return {pack:p,why:p.reason,kind:/décision d.?extension|decision d.?extension/i.test(document.title||'')?'extension':'correlation'};
    if(p.titles.some(t=>hay.includes(N(t)))) return {pack:p,why:p.reason,kind:'correlation'};
  }
  return null;
}

export function relationSummary(packs){
  if(!packs.length) return '';
  const labels=packs.map(p=>p.label);
  return labels.length===1?`Pour ce sujet, plusieurs niveaux de textes doivent être lus ensemble : ${labels[0]}.`:`Ta question touche plusieurs blocs qui se croisent : ${labels.join(' + ')}.`;
}
