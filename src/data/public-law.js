const N=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

export const publicLaw=[
  {
    id:'CDT-L3121-9',level:'Code du travail',ref:'L3121-9',topics:['astreinte'],
    title:'Définition légale de l’astreinte',
    simple:'L’astreinte est une période hors lieu de travail durant laquelle le salarié doit être en mesure d’intervenir. La durée de l’intervention est du temps de travail effectif et l’astreinte donne lieu à une contrepartie.',
    url:'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020484',
    why:'C’est le point de départ légal pour distinguer la période d’astreinte de l’intervention.'
  },
  {
    id:'CDT-L3121-10',level:'Code du travail',ref:'L3121-10',topics:['astreinte','repos'],
    title:'Astreinte hors intervention et calcul des repos',
    simple:'Hors durée d’intervention, la période d’astreinte est prise en compte pour calculer les repos quotidien et hebdomadaire.',
    url:'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000033001534',
    why:'Cet article explique l’articulation entre astreinte et repos.'
  },
  {
    id:'CDT-L3121-18-19',level:'Code du travail',ref:'L3121-18 / L3121-19',topics:['astreinte','temps de travail','12h','durée quotidienne','duree quotidienne'],
    title:'Durée quotidienne maximale : 10 h, avec possibilités encadrées jusqu’à 12 h',
    simple:'La durée quotidienne de travail effectif est en principe limitée à 10 heures. Un accord peut prévoir certains dépassements sans porter cette durée au-delà de 12 heures, sous les conditions prévues par le Code.',
    url:'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006195763/',
    why:'À rapprocher des accords GRDF qui portent la durée quotidienne à 12 h pour certaines situations d’astreinte.'
  },
  {
    id:'CDT-L3121-20',level:'Code du travail',ref:'L3121-20',topics:['astreinte','temps de travail','48h','48 h','durée hebdomadaire','duree hebdomadaire'],
    title:'Durée maximale hebdomadaire : 48 h',
    simple:'Au cours d’une même semaine, la durée maximale hebdomadaire de travail est de 48 heures.',
    url:'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020414',
    why:'C’est la borne hebdomadaire de principe à contrôler avec les interventions d’astreinte.'
  },
  {
    id:'CDT-L3121-22',level:'Code du travail',ref:'L3121-22',topics:['astreinte','temps de travail','44h','44 h','12 semaines'],
    title:'Moyenne maximale : 44 h sur 12 semaines',
    simple:'La durée hebdomadaire calculée sur une période quelconque de douze semaines consécutives ne peut en principe dépasser 44 heures.',
    url:'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020402',
    why:'Une semaine isolée ne suffit pas toujours : cette borne impose aussi un contrôle dans la durée.'
  },
  {
    id:'CDT-L3131-1',level:'Code du travail',ref:'L3131-1',topics:['astreinte','repos','11h','11 h','repos quotidien'],
    title:'Repos quotidien : 11 heures consécutives',
    simple:'Tout salarié bénéficie en principe d’un repos quotidien minimal de 11 heures consécutives, sous réserve des dérogations prévues par les textes.',
    url:'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020918',
    why:'C’est la règle de base que les notes GRDF sur les interventions urgentes viennent articuler.'
  },
  {
    id:'CDT-L3132-2',level:'Code du travail',ref:'L3132-2',topics:['astreinte','repos','repos hebdomadaire','35h','35 h'],
    title:'Repos hebdomadaire : 24 h + repos quotidien',
    simple:'Le repos hebdomadaire minimal est de 24 heures consécutives auxquelles s’ajoute le repos quotidien, soit normalement 35 heures au total.',
    url:'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902581',
    why:'À lire avec PERS 530, N69-76 et la M-RES pour comprendre le repos hebdomadaire en astreinte.'
  },
  {
    id:'UE-2003-88',level:'Union européenne',ref:'Directive 2003/88/CE',topics:['astreinte','temps de travail','repos','11h','48h','repos hebdomadaire'],
    title:'Directive européenne sur le temps de travail',
    simple:'La directive fixe notamment 11 heures de repos journalier, un repos hebdomadaire minimal et une durée moyenne hebdomadaire maximale de 48 heures, heures supplémentaires comprises.',
    url:'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=celex%3A32003L0088',
    why:'C’est le cadre européen utilisé par la CJUE pour interpréter le temps de travail et les repos.'
  }
];

export function publicLawFor(query){
  const q=N(query);
  if(!q.trim()) return [];
  const astreinte=/astreinte|action immediate|zha|isg|intervention de securite/.test(q);
  const temps=/temps de travail|48\s*h|44\s*h|12\s*h|duree|heure supplementaire/.test(q);
  const repos=/repos|11\s*h|35\s*h/.test(q);
  return publicLaw.filter(x=>x.topics.some(t=>q.includes(N(t)))||(astreinte&&x.topics.includes('astreinte'))||(temps&&x.topics.includes('temps de travail'))||(repos&&x.topics.includes('repos')));
}
