export const dossierNavigation = [
  {
    group:'Temps & organisation',
    icon:'🕒',
    items:[
      ['temps-travail','Temps de travail'],
      ['repos-pauses','Repos & pauses'],
      ['astreinte','Astreinte'],
      ['conges-rtt-cet','Congés, RTT & CET'],
    ]
  },
  {
    group:'Rémunération & frais',
    icon:'💶',
    items:[
      ['remuneration','Rémunération'],
      ['repas','Repas'],
      ['deplacements','Déplacements & frais'],
      ['heures-sup','Heures supplémentaires'],
    ]
  },
  {
    group:'Avantages & carrière',
    icon:'⚡',
    items:[
      ['tarif-agent','Tarif agent énergie'],
      ['residence-secondaire','Résidence secondaire'],
      ['logement','Logement'],
      ['classification','Classification & classement'],
      ['mobilite','Mobilité, mutation & affectation'],
    ]
  },
  {
    group:'Santé & famille',
    icon:'🦺',
    items:[
      ['accident-maladie','Accident du travail & maladie'],
      ['handicap','Handicap'],
      ['famille','Famille & parentalité'],
      ['enfant-malade','Enfant malade'],
    ]
  },
  {
    group:'Représentation & règles',
    icon:'🗣️',
    items:[
      ['cse-cssct','CSE & CSSCT'],
      ['droit-syndical','Droit syndical & délégation'],
      ['discipline','Discipline & sanctions'],
    ]
  },
  {
    group:'Parcours & vie sociale',
    icon:'🎓',
    items:[
      ['formation','Formation & alternance'],
      ['frais-stage','Frais de stage'],
      ['retraite','Retraite & inactivité'],
      ['activites-sociales','CCAS, CAS & activités sociales'],
    ]
  }
];

export const allDossierLinks = dossierNavigation.flatMap(group =>
  group.items.map(([slug,label]) => ({slug,label,group:group.group,icon:group.icon}))
);
