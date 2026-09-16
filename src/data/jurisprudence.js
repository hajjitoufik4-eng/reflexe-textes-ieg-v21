export const jurisprudence = [
  {
    id: 'cass-2022-21-14178',
    topics: ['astreinte','PERS530','PERS557','PERS849','PERS939','temps de travail','repos'],
    court: 'Cour de cassation, chambre sociale',
    date: '26 octobre 2022',
    number: '21-14.178',
    issue: "Une période qualifiée d’astreinte doit-elle être requalifiée en temps de travail lorsque les contraintes imposées limitent très fortement la liberté du salarié ?",
    result: "Cassation partielle. La Cour reproche aux juges d’appel de ne pas avoir recherché si les contraintes, notamment le court délai d’intervention, affectaient objectivement et très significativement la faculté du salarié de gérer librement son temps personnel.",
    scope: "La qualification ne dépend pas seulement du nom donné au dispositif. Il faut examiner concrètement l’intensité des contraintes : délai de réaction/intervention, lieu ou zone imposés, fréquence des sollicitations et possibilités réelles d’activités personnelles. Cette décision n’a pas été rendue contre GRDF : elle fournit un critère juridique général à confronter aux règles IEG et à l’organisation réelle de l’astreinte.",
    url: 'https://www.legifrance.gouv.fr/juri/id/JURITEXT000046510365'
  },
  {
    id: 'cjue-matzak-c518-15',
    topics: ['astreinte','PERS530','PERS557','PERS849','temps de travail','repos'],
    court: 'CJUE',
    date: '21 février 2018',
    number: 'C-518/15, Matzak',
    issue: "Une garde à domicile assortie d’un lieu imposé et d’un délai très bref pour rejoindre le travail relève-t-elle du temps de travail ?",
    result: "La Cour juge que les contraintes de présence au lieu déterminé par l’employeur et de réaction dans un délai bref peuvent restreindre très significativement les possibilités d’activités personnelles et conduire à qualifier toute la période de temps de travail.",
    scope: "Arrêt fondateur pour apprécier l’intensité des contraintes d’astreinte. Il ne signifie pas que toute astreinte est automatiquement du travail effectif : l’analyse dépend des contraintes concrètes.",
    url: 'https://curia.europa.eu/juris/liste.jsf?num=C-518/15'
  },
  {
    id: 'cjue-offenbach-c580-19',
    topics: ['astreinte','PERS530','PERS557','PERS849','temps de travail','repos'],
    court: 'CJUE, grande chambre',
    date: '9 mars 2021',
    number: 'C-580/19, Stadt Offenbach am Main',
    issue: "Quels critères permettent de distinguer une astreinte constituant du temps de travail d’une période de repos ?",
    result: "La Cour retient une appréciation globale : une astreinte relève intégralement du temps de travail lorsque les contraintes imposées affectent objectivement et très significativement la faculté de gérer librement le temps non travaillé.",
    scope: "Le délai pour reprendre l’activité doit être apprécié avec les autres contraintes et, notamment, la fréquence moyenne des interventions. Un délai court est un indice important mais doit être replacé dans les circonstances concrètes.",
    url: 'https://curia.europa.eu/juris/liste.jsf?num=C-580/19'
  }
];

export function caseLawFor(document) {
  const haystack = `${document.ref || ''} ${document.title || ''} ${document.theme || ''} ${document.folder || ''}`.toLowerCase();
  return jurisprudence.filter((j) => j.topics.some((topic) => haystack.includes(topic.toLowerCase())));
}
