export const jurisprudence = [
  {
    id: 'JUR-CASS-21-14178',
    topics: ['astreinte','temps de travail','repos','PERS530','PERS557','PERS849','PERS939'],
    court: 'Cour de cassation, chambre sociale',
    date: '26 octobre 2022',
    number: '21-14.178',
    title: 'Astreinte : contraintes et requalification en temps de travail effectif',
    issue: 'Le juge doit-il examiner concrètement si les contraintes d’astreinte limitent très significativement la liberté du salarié ?',
    result: 'Cassation partielle de l’arrêt d’Amiens et renvoi à Douai. La Cour impose une appréciation concrète de l’intensité des contraintes, notamment du délai d’intervention.',
    scope: 'La qualification dépend des contraintes réelles, pas seulement de l’étiquette « astreinte ».',
    url: 'https://www.legifrance.gouv.fr/juri/id/JURITEXT000046510365',
    judgment: { result: 'Cassation partielle avec renvoi à Douai. Cet arrêt ne fixe pas lui-même le rappel d’heures supplémentaires.', follow: [{label:'22 décembre 2023 · Douai · 22/01653',id:'JUR-DOUAI-22-01653',text:'Arrêt de renvoi retrouvé : requalification de toute la permanence et condamnations chiffrées.'}], amounts: [] },
    limit: 'Résultat de cette affaire : il ne garantit pas le même résultat dans une autre situation. État des recherches au 16 septembre 2026.'
  },
  {
    id: 'JUR-DOUAI-22-01653',
    topics: ['astreinte','temps de travail','repos','PERS530','PERS557','PERS849','PERS939'],
    court: "Cour d'appel de Douai",
    date: '22 décembre 2023',
    number: '22/01653',
    title: 'Après la cassation : permanence requalifiée et rappels accordés',
    issue: 'Après renvoi, les permanences du dépanneur doivent-elles être intégralement requalifiées en temps de travail effectif ?',
    result: 'La cour de renvoi requalifie la permanence et accorde des rappels d’heures supplémentaires, repos, dommages-intérêts et indemnités de rupture.',
    scope: 'Décision de renvoi rendue dans une entreprise de dépannage automobile ; elle illustre les conséquences financières possibles d’une requalification.',
    url: 'https://justice.pappers.fr/decision/feb6204c4c422593e0ae9a956cb8353977d3409c',
    judgment: { result: 'Le salarié obtient les sommes ci-dessous. Les demandes initiales étaient plus élevées : les montants demandés ne doivent pas être confondus avec les condamnations.', follow: [{label:'Décision à l’origine du renvoi',id:'JUR-CASS-21-14178',text:'Cassation du 26 octobre 2022.'},{label:'Après cet arrêt',text:'Aucune décision ultérieure de cette même affaire n’a été vérifiée ici. Le caractère irrévocable et le paiement effectif ne sont pas établis.'}], amounts: [['Heures supplémentaires','167 320 €'],['Congés payés correspondants','16 732 €'],['Contrepartie obligatoire en repos','57 905,58 €'],['Sécurité, durée du travail et repos','15 000 €'],['Travail dissimulé','26 400 €'],['Préavis','8 800 €'],['Congés payés sur préavis','880 €'],['Licenciement sans cause réelle et sérieuse','70 000 €'],['Frais de procédure · article 700','6 000 €']] },
    limit: 'Résultat de cette affaire : il ne garantit pas le même résultat dans une autre situation. État des recherches au 16 septembre 2026.'
  },
  {
    id: 'JUR-REPAS-2022',
    topics: ['PERS793','repas','indemnités de repas','déplacement','argent'],
    court: 'Cour de cassation, chambre sociale',
    date: '16 novembre 2022',
    number: '21-17.975 à 21-17.980',
    title: 'PERS 793 : indemnités de repas et preuve du retour possible',
    issue: 'Qui supporte la preuve de la possibilité de revenir au centre entre 11 h et 13 h pour l’indemnité de repas PERS 793 ?',
    result: 'Cassation partielle des six arrêts d’Angers et renvoi à Rennes. Lorsque les techniciens établissent leurs déplacements et horaires, les employeurs qui contestent l’indemnité doivent établir la possibilité de retour au centre.',
    scope: 'Décision directement relative à Enedis/GRDF et à la PERS 793.',
    url: 'https://www.legifrance.gouv.fr/juri/id/JURITEXT000046651771',
    judgment: { result: 'Cassation partielle des arrêts d’Angers du 17 septembre 2020 et renvoi à Rennes. Les 6 000 € d’article 700 pour les six salariés ne sont pas un rappel de repas.', follow: [{label:'30 novembre 2023 · Rennes · 23/01250',id:'JUR-RENNES-23-01250',text:'Une des six affaires retrouvée : 1 942,53 € de rappel. Les cinq autres résultats ne sont pas encore documentés dans cette fiche.'}], amounts: [] },
    limit: 'Résultat de cette affaire : il ne garantit pas le même résultat dans une autre situation. État des recherches au 16 septembre 2026.'
  },
  {
    id: 'JUR-RENNES-23-01250',
    topics: ['PERS793','repas','indemnités de repas','déplacement','argent'],
    court: "Cour d'appel de Rennes",
    date: '30 novembre 2023',
    number: '23/01250',
    title: 'Après la cassation : 1 942,53 € d’indemnités de repas',
    issue: 'Après cassation, quel rappel d’indemnités de repas est dû dans l’une des six affaires ?',
    result: 'La cour fixe le rappel d’indemnités de repas à 1 942,53 € et condamne Enedis et GRDF in solidum.',
    scope: 'Résultat d’une des six affaires renvoyées ; il ne vaut pas automatiquement pour les cinq autres.',
    url: 'https://justice.pappers.fr/decision/c252abc9444441894a555e33f1e3ae156f765595',
    judgment: { result: 'Le rappel est fixé à 1 942,53 €, au lieu des 2 379,33 € accordés en première instance. Enedis et GRDF supportent les dépens ; leur demande d’article 700 est rejetée.', follow: [{label:'Cassation préalable',id:'JUR-REPAS-2022',text:'16 novembre 2022 : règle de preuve appliquée au renvoi.'},{label:'État de la procédure',text:'Aucun recours ultérieur ni paiement effectif vérifié ici. Ce résultat concerne ce salarié, pas automatiquement les six.'}], amounts: [['Rappel d’indemnités de repas accordé','1 942,53 €']] },
    limit: 'Résultat de cette affaire : il ne garantit pas le même résultat dans une autre situation. État des recherches au 16 septembre 2026.'
  },
  {
    id: 'JUR-CJUE-C344-19',
    topics: ['astreinte','temps de travail','repos','PERS530','PERS557','PERS849','PERS939'],
    court: 'CJUE, grande chambre',
    date: '9 mars 2021',
    number: 'C-344/19',
    title: 'Astreinte et liberté de gérer son temps · C-344/19',
    issue: 'Quand une période d’astreinte dans un lieu reculé constitue-t-elle intégralement du temps de travail ?',
    result: 'La CJUE pose une appréciation globale des contraintes : elles doivent affecter objectivement et très significativement la faculté de gérer librement le temps personnel.',
    scope: 'Renvoi préjudiciel : pas de somme accordée par la CJUE.',
    url: 'https://curia.europa.eu/juris/liste.jsf?num=C-344/19',
    judgment: { result: 'Interprétation du droit européen ; pas de somme allouée au travailleur par cet arrêt préjudiciel.', follow: [{label:'Issue nationale',text:'Jugement national consécutif non retrouvé ici. Aucun montant ni victoire définitive ne peut être annoncé.'}], amounts: [] },
    limit: 'Résultat de cette affaire : il ne garantit pas le même résultat dans une autre situation. État des recherches au 16 septembre 2026.'
  },
  {
    id: 'JUR-CJUE-C580-19',
    topics: ['astreinte','temps de travail','repos','PERS530','PERS557','PERS849','PERS939'],
    court: 'CJUE, grande chambre',
    date: '9 mars 2021',
    number: 'C-580/19',
    title: 'Astreinte et liberté de gérer son temps · C-580/19',
    issue: 'Un pompier devant rejoindre les limites de la ville en vingt minutes est-il nécessairement en temps de travail pendant toute l’astreinte ?',
    result: 'La CJUE impose une appréciation globale du délai, des autres contraintes et de la fréquence des interventions pour déterminer si toute la période est du temps de travail.',
    scope: 'Renvoi préjudiciel : pas de somme accordée par la CJUE.',
    url: 'https://curia.europa.eu/juris/liste.jsf?num=C-580/19',
    judgment: { result: 'Interprétation du droit européen ; pas de somme allouée au travailleur par cet arrêt préjudiciel.', follow: [{label:'Issue nationale',text:'Jugement national consécutif non retrouvé ici. Aucun montant ni victoire définitive ne peut être annoncé.'}], amounts: [] },
    limit: 'Résultat de cette affaire : il ne garantit pas le même résultat dans une autre situation. État des recherches au 16 septembre 2026.'
  },
  {
    id: 'cjue-matzak-c518-15',
    topics: ['astreinte','temps de travail','repos','PERS530','PERS557','PERS849'],
    court: 'CJUE, grande chambre',
    date: '21 février 2018',
    number: 'C-518/15, Matzak',
    title: 'Garde à domicile et délai de huit minutes — Matzak',
    issue: 'Une garde à domicile imposant au travailleur de rester à un lieu déterminé et de rejoindre son lieu de travail dans un délai très bref doit-elle être qualifiée de temps de travail ?',
    result: 'Interprétation du droit de l’Union : la période de garde à domicile en cause doit être considérée comme du temps de travail. Cet arrêt préjudiciel n’alloue pas lui-même de somme au travailleur.',
    scope: 'Arrêt de principe à utiliser pour apprécier l’intensité des contraintes concrètes d’une astreinte ; il ne rend pas toute astreinte automatiquement assimilable à du travail effectif.',
    url: 'https://curia.europa.eu/juris/liste.jsf?num=C-518/15',
    judgment: { result: 'Renvoi préjudiciel : qualification juridique posée par la CJUE ; aucun montant attribué par cet arrêt.', follow: [], amounts: [] },
    limit: 'La décision porte sur une situation factuelle particulière et sur l’interprétation de la directive 2003/88/CE.'
  }
];

export function caseLawFor(document) {
  const haystack = `${document.ref || ''} ${document.title || ''} ${document.theme || ''} ${document.folder || ''}`.toLowerCase();
  return jurisprudence.filter((j) => j.topics.some((topic) => haystack.includes(String(topic).toLowerCase())));
}
