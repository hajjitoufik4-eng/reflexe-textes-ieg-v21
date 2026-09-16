export const topics = [
  ['astreinte', 'Astreinte', 'Sujétions, action immédiate, interventions, ZHA et textes associés'],
  ['temps', 'Temps de travail & repos', 'Durées, horaires, pauses, repos, congés et heures supplémentaires'],
  ['argent', 'Rémunération, frais & déplacements', 'Primes, indemnités, repas, déplacements et remboursements'],
  ['discipline', 'Discipline & procédure', 'Sanctions, garanties procédurales, EP1 / EP2 et textes disciplinaires'],
  ['sante', 'Santé, sécurité & conditions de travail', 'Prévention, accidents, maladie, handicap, chaleur et RPS'],
  ['mandats', 'CSE, CSSCT & droit syndical', 'Mandats, représentation du personnel et moyens des élus'],
  ['carriere', 'Carrière, classification & formation', 'Classement, mobilité, avancement, formation et parcours'],
  ['famille', 'Famille, parentalité & absences', 'Enfants, droits familiaux, congés et situations personnelles'],
  ['retraite', 'Retraite & pensions', 'Pensions, inactivité et droits associés'],
  ['avantages', 'Avantages sociaux & tarif agent', 'Avantages en nature, énergie et activités sociales'],
  ['regles', 'Statut & règles générales', 'Statut national, règles transversales et textes de référence'],
  ['autres', 'À classer / à vérifier', 'Documents dont le rattachement juridique doit encore être contrôlé'],
];
export const levels=[['all','Tous les textes GRDF'],['national','GRDF national'],['local','GRDF régional / local'],['unverified','Périmètre à vérifier']];
export const scopeOf=d=>d.scope==='ieg'?'ieg':'grdf';
export const scopeName=scope=>scope==='ieg'?'IEG / branche':'GRDF';
export const tag=d=>d.scope==='ieg'?(d.kind==='PERS'?'IEG · PERS':'IEG / branche'):d.level==='local'?'GRDF · régional / local':d.level==='national'?'GRDF · national':'GRDF · périmètre à vérifier';
export const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

const inferredFolder=d=>{
 const h=normalize(`${d.ref||''} ${d.title||''} ${d.theme||''} ${d.folder||''}`);
 if(/astreinte|pers\s*530|pers\s*557|pers\s*849|pers\s*939|zha|zone.*habitat|action immediate|mres/.test(h)) return 'astreinte';
 if(/disciplin|sanction|pers\s*846|ep1|ep2/.test(h)) return 'discipline';
 return d.folder||'autres';
};
export function filterDocuments(data,{scope,theme='',query='',level='all'}){
 const terms=normalize(query).match(/[a-z0-9]+/g)||[];
 return data.filter(d=>scopeOf(d)===scope&&(!theme||inferredFolder(d)===theme)&&(scope==='ieg'||level==='all'||d.level===level)&&terms.every(t=>normalize([d.title,d.ref,d.theme,topics.find(x=>x[0]===inferredFolder(d))?.[1],d.explanation?.simple,...(d.explanation?.points||[])].join(' ')).includes(t)))
 .sort((a,b)=>Number(Boolean(b.explanation))-Number(Boolean(a.explanation))||String(a.ref||a.title).localeCompare(String(b.ref||b.title),'fr'));
}
export function catalogueUrl(scope,{theme='',query='',level='all',limit=12}={}){const p=new URLSearchParams();if(theme)p.set('theme',theme);if(query)p.set('q',query);if(level!=='all')p.set('level',level);if(limit>12)p.set('limit',String(limit));return '/corpus/'+scope+(p.size?'?'+p.toString():'');}
export function safeUrl(value){if(typeof value!=='string')return'';if(value.startsWith('/documents/')&&!/[\\\r\n]/.test(value))return value;try{const u=new URL(value);return['https:','http:'].includes(u.protocol)?u.href:'';}catch{return'';}}
export const isLocalPdf=url=>url.startsWith('/documents/')&&/\.pdf$/i.test(url);
