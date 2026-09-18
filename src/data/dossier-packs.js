const N=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const R=s=>String(s||'').toUpperCase().replace(/[\s-]+/g,'');

export const dossierPacks=[
  {
    id:'remuneration', theme:'pay', label:'Rémunération', subtitle:'Salaire, structure de rémunération et textes généraux.',
    triggers:['rémunération','remuneration','salaire','structure de rémunération','structure des rémunérations'],
    coreRefs:[],
    coreTitles:['réforme de la structure des rémunérations','mise en place de la nouvelle structure de rémunération'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'repas', theme:'pay', label:'Repas', subtitle:'Indemnités de repas avec ou sans déplacement et règles directement liées.',
    triggers:['repas','indemnité de repas','indemnite de repas','repas sans déplacement','repas sans deplacement'],
    coreRefs:['PERS375','PERS583','PERS793'],
    coreTitles:['indemnités de déplacement et de repas sans déplacement','abattements sur indemnités de repas','indemnités de déplacement'],
    relatedRefs:['PERS96','PERS225','PERS691'],
    relatedTitles:[]
  },
  {
    id:'deplacements', theme:'pay', label:'Déplacements & frais', subtitle:'Déplacements de service, grands déplacements et remboursements de frais.',
    triggers:['déplacement','deplacement','grand déplacement','grand deplacement','frais de voyage','frais de déplacement','frais de deplacement'],
    coreRefs:['PERS375','PERS691','PERS793'],
    coreTitles:['indemnités de déplacement','indemnité de grand déplacement'],
    relatedRefs:['PERS96','PERS225'], relatedTitles:[]
  },
  {
    id:'temps-travail', theme:'time', label:'Temps de travail', subtitle:'Durées, horaires et organisation générale du temps de travail.',
    triggers:['temps de travail','durée du travail','duree du travail','horaire','aménagement du temps de travail','amenagement du temps de travail'],
    coreRefs:['PERS77','DP31-98'],
    coreTitles:['accord national sur le temps de travail','note d’application de dispositions contenues dans l’accord temps de travail','note d application de dispositions contenues dans l accord temps de travail'],
    relatedRefs:[], relatedTitles:['accord temps de travail']
  },
  {
    id:'repos-pauses', theme:'time', label:'Repos & pauses', subtitle:'Repos quotidien et hebdomadaire, pauses et temps de restauration.',
    triggers:['repos quotidien','repos hebdomadaire','pause','pause méridienne','pause meridienne','temps de restauration'],
    coreRefs:['PERS77'],
    coreTitles:['repos quotidien de 11 heures','accord national sur le temps de travail','note d’application de dispositions contenues dans l’accord temps de travail'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'astreinte', theme:'time', label:'Astreinte', subtitle:'Définition, sujétions, intervention et organisation GRDF.',
    triggers:['astreinte','action immédiate','action immediate','zha','zone habitat','intervention de sécurité gaz','intervention de securite gaz'],
    coreRefs:['PERS530','PERS557','PERS849','PERS939','DP31-28','DP31-103'],
    coreTitles:['astreinte et intervention de sécurité gaz','organisation du dispositif d’astreinte gaz','organisation du dispositif d astreinte gaz'],
    relatedRefs:[], relatedTitles:['repos quotidien de 11 heures','évolution zha','evolution zha','accord national sur le temps de travail']
  },
  {
    id:'conges-rtt-cet', theme:'time', label:'Congés, RTT & CET', subtitle:'Congés, jours non travaillés et compte épargne temps.',
    triggers:['congé','conge','rtt','jrtt','jnt','cet','compte épargne temps','compte epargne temps'],
    coreRefs:['PERS77'],
    coreTitles:['accord national sur le temps de travail','note d’application de dispositions contenues dans l’accord temps de travail','transfert de droits épargnés dans le cet'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'tarif-agent', theme:'benefits', label:'Tarif agent & avantages énergie', subtitle:'Avantages en nature, tarifs particuliers, résidence secondaire et compteurs.',
    triggers:['avantage en nature','tarif particulier','tarif agent','résidence secondaire','residence secondaire','redevance sur compteurs'],
    coreRefs:['PERS161','PERS182','PERS198','PERS211','PERS274'],
    coreTitles:['avantages en nature','redevances sur compteurs'],
    relatedRefs:['PERS96','PERS225'], relatedTitles:[]
  },
  {
    id:'logement', theme:'benefits', label:'Logement', subtitle:'Logement assigné ou imposé et règles directement associées.',
    triggers:['logement','logement imposé','logement impose','logements assignés','logements assignes'],
    coreRefs:['PERS444','DP31-33'],
    coreTitles:['logements assignés','application de la pers 309 agents en logement imposé'],
    relatedRefs:['PERS530'], relatedTitles:[]
  },
  {
    id:'classification', theme:'career', label:'Classification & classement', subtitle:'Textes généraux et textes propres aux fonctions lorsque la fonction est précisée.',
    triggers:['classification','classement','groupe fonctionnel','niveau de classification'],
    coreRefs:[],
    coreTitles:['classification du personnel','classification de fonctions'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'mobilite', theme:'career', label:'Mobilité, mutation & affectation', subtitle:'Mutation, mobilité, affectation et vacances de postes.',
    triggers:['mutation','mobilité','mobilite','affectation','vacance de poste','vacances de postes'],
    coreRefs:['PERS121','PERS590'],
    coreTitles:['affectation définitive','publication des vacances de postes'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'famille', theme:'family', label:'Famille & parentalité', subtitle:'Maternité, paternité, adoption et événements familiaux.',
    triggers:['maternité','maternite','paternité','paternite','adoption','naissance','événement familial','evenement familial','congé parental','conge parental'],
    coreRefs:['PERS890'],
    coreTitles:['congé parental d’éducation','conge parental d education'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'enfant-malade', theme:'family', label:'Enfant malade', subtitle:'Autorisations d’absence et textes propres aux enfants malades.',
    triggers:['enfant malade','enfants malades'],
    coreRefs:['DP31-105','DP31-65'],
    coreTitles:['autorisations spéciales d absences aux parents d enfants malades','autorisations spéciales d absences enfants malades'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'accident-maladie', theme:'health', label:'Accident du travail & maladie', subtitle:'Accidents du travail, de trajet, maladies et règles statutaires.',
    triggers:['accident du travail','accident de trajet','maladie','maladie professionnelle','longue maladie'],
    coreRefs:[],
    coreTitles:['accidents du travail','accident de trajet','maladies professionnelles'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'handicap', theme:'health', label:'Handicap', subtitle:'Emploi, maintien et accords relatifs au handicap.',
    triggers:['handicap','personnes en situation de handicap'],
    coreRefs:['DP31-107'],
    coreTitles:['accord pour l emploi des personnes en situation de handicap','insertion professionnelle des personnes en situation de handicap'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'discipline', theme:'discipline', label:'Discipline & sanctions', subtitle:'Mesures disciplinaires, procédure et règlement intérieur.',
    triggers:['discipline','disciplinaire','sanction','avertissement','blâme','blame','règlement intérieur','reglement interieur'],
    coreRefs:['PERS846'],
    coreTitles:['mesures disciplinaires','accord expérimentation discipline','règlement intérieur enedis grdf'],
    relatedRefs:['PERS408'], relatedTitles:['culture juste']
  },
  {
    id:'cse-cssct', theme:'mandates', label:'CSE & CSSCT', subtitle:'Mise en place, fonctionnement et commissions santé-sécurité.',
    triggers:['cse','cssct','comité social et économique','comite social et economique'],
    coreRefs:[],
    coreTitles:['mise en place et au fonctionnement des comités sociaux et économiques','composition et aux modalités d organisation de l élection des membres du cse'],
    relatedRefs:[], relatedTitles:['guide idf des élus cse-e']
  },
  {
    id:'droit-syndical', theme:'mandates', label:'Droit syndical & délégation', subtitle:'Accords syndicaux, crédits d’heures et moyens de représentation.',
    triggers:['droit syndical','syndical','délégation','delegation','crédit d heures','credit d heures'],
    coreRefs:['N82-37'],
    coreTitles:['accord relatif à l exercice du droit syndical','accord relatif aux moyens du délégué syndical central'],
    relatedRefs:['PERS73'], relatedTitles:[]
  },
  {
    id:'formation', theme:'training', label:'Formation & alternance', subtitle:'Formation professionnelle, alternance et formations qualifiantes.',
    triggers:['formation professionnelle','alternance','formation qualifiante','apprentissage'],
    coreRefs:['N95-13'],
    coreTitles:['accord formation et alternance ieg','accord grdf alternance'],
    relatedRefs:['N96-5'], relatedTitles:[]
  },
  {
    id:'frais-stage', theme:'training', label:'Frais de stage', subtitle:'Frais et déplacements liés aux stages et formations.',
    triggers:['frais de stage','stage'],
    coreRefs:['PERS791'],
    coreTitles:['formation professionnelle frais de stage'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'retraite', theme:'retirement', label:'Retraite & inactivité', subtitle:'Départ en inactivité, pension et retraite supplémentaire.',
    triggers:['retraite','inactivité','inactivite','pension','retraite supplémentaire','retraite supplementaire'],
    coreRefs:['PERS755','DP31-127','DP31-80','DP31-95','N81-38'],
    coreTitles:['retraite supp','accord de méthode retraites','droits retraite','régime supplémentaire de retraite'],
    relatedRefs:[], relatedTitles:[]
  },
  {
    id:'activites-sociales', theme:'social', label:'Activités sociales', subtitle:'CCAS, CAS et personnel des activités sociales.',
    triggers:['ccas','cas','activités sociales','activites sociales'],
    coreRefs:['PERS148'],
    coreTitles:['caisse d action sociale','activités sociales'],
    relatedRefs:['PERS408','DP31-114','DP31-115','DP33-225','N63-37'], relatedTitles:[]
  }
];

export const dossiersByTheme=dossierPacks.reduce((acc,p)=>{
  (acc[p.theme]??=[]).push(p);
  return acc;
},{});

export function dossierPack(id){
  return dossierPacks.find(p=>p.id===id)||null;
}

function H(document){
  return N([document.ref,document.title,document.theme,document.folder,document.kind,document.scopeLabel,document.origin].filter(Boolean).join(' '));
}

function titleMatches(document,list=[]){
  const h=N(document.title||'');
  return list.some(v=>h.includes(N(v)));
}

export function dossierRelation(document,pack){
  if(!pack) return null;
  const ref=R(document.ref);
  if(pack.coreRefs.some(r=>R(r)===ref)) return {tier:'core',score:100,why:'Référence structurante du dossier.'};
  if(titleMatches(document,pack.coreTitles)) return {tier:'core',score:90,why:'Le titre du document traite directement du dossier.'};
  if(pack.relatedRefs.some(r=>R(r)===ref)) return {tier:'related',score:55,why:'Texte connexe utile pour replacer la règle dans son contexte.'};
  if(titleMatches(document,pack.relatedTitles)) return {tier:'related',score:50,why:'Texte connexe au dossier.'};

  const h=H(document);
  const direct=pack.triggers.filter(t=>h.includes(N(t)));
  if(direct.length) return {tier:'direct',score:70+Math.min(direct.length,3)*5,why:'Le document traite directement d’une notion du dossier.'};
  return null;
}

export function documentsForDossier(documents,id){
  const pack=dossierPack(id);
  if(!pack) return [];
  const seen=new Set();
  return documents
    .map(document=>({document,relation:dossierRelation(document,pack)}))
    .filter(x=>x.relation)
    .sort((a,b)=>b.relation.score-a.relation.score||String(a.document.ref||a.document.title).localeCompare(String(b.document.ref||b.document.title),'fr'))
    .filter(({document})=>{
      const key=R(document.ref)||N(document.title);
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function dossierCoverage(documents){
  return dossierPacks.map(pack=>({
    id:pack.id,
    label:pack.label,
    theme:pack.theme,
    count:documentsForDossier(documents,pack.id).length,
    missingCoreRefs:pack.coreRefs.filter(ref=>!documents.some(d=>R(d.ref)===R(ref)))
  }));
}
