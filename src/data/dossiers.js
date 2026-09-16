export const dossiers = {
  astreinte: {
    slug: 'astreinte',
    title: 'Astreinte',
    subtitle: 'Un dossier unique pour retrouver les textes IEG, les règles GRDF, le temps d’intervention, les repos et la jurisprudence.',
    queries: ['astreinte','PERS530','PERS557','PERS849','PERS939','action immédiate','ZHA','zone habitat','MRES'],
    sections: [
      { title: '1. Cadre IEG', text: 'Les circulaires PERS relatives aux sujétions de service constituent le socle documentaire historique. Elles doivent être lues avec leurs textes modificatifs ou complémentaires et avec les règles d’entreprise actuellement applicables. La présence d’un document dans le corpus ne signifie donc pas, à elle seule, que toutes ses dispositions sont encore applicables sans modification.' },
      { title: '2. Astreinte et intervention', text: 'Il faut distinguer la période d’astreinte de l’intervention effectivement réalisée. Le Code du travail qualifie l’intervention accomplie pendant l’astreinte de temps de travail effectif. Pour la période d’attente elle-même, la qualification dépend notamment de l’intensité réelle des contraintes imposées au salarié.' },
      { title: '3. Intensité des contraintes', text: 'Le délai de réaction, la zone ou le lieu imposé, la fréquence des interventions et les possibilités réelles de consacrer le temps à des activités personnelles sont des éléments déterminants. La Cour de cassation impose au juge de vérifier concrètement si ces contraintes affectent objectivement et très significativement la liberté du salarié.' },
      { title: '4. Repos et durée du travail', text: 'Les interventions doivent être rapprochées des règles de durée maximale du travail et de repos. Une fiche d’astreinte ne peut donc pas être lue isolément : le dossier Temps de travail & repos complète ce pavé.' },
      { title: '5. Organisation GRDF', text: 'Les documents GRDF concernant l’action immédiate, les zones d’habitat, les modalités opérationnelles, la GTA et les accords de temps de travail doivent rester identifiés comme textes d’entreprise. Ils ne doivent pas être mélangés avec les PERS ou avec le droit commun.' }
    ]
  },
  'temps-de-travail': {
    slug: 'temps-de-travail',
    title: 'Temps de travail & repos',
    subtitle: 'Durée du travail, pauses, repos, 48 heures, heures supplémentaires et articulation avec l’astreinte.',
    queries: ['temps de travail','durée du travail','repos','pause','PERS77','48 h','48h','heures supplémentaires','astreinte'],
    sections: [
      { title: '1. Temps de travail effectif', text: 'La question centrale est de savoir si le salarié est à la disposition de l’employeur, se conforme à ses directives et peut ou non vaquer librement à des occupations personnelles. Cette définition sert notamment pour apprécier certaines périodes d’attente, de déplacement ou de contrainte.' },
      { title: '2. Pauses', text: 'Une pause ne doit pas être confondue avec une simple interruption théorique de planning. Son traitement dépend du texte applicable et des contraintes réellement maintenues pendant la période. Les textes IEG/GRDF spécifiques doivent être confrontés aux règles légales.' },
      { title: '3. Repos quotidien et hebdomadaire', text: 'Le repos doit être étudié avec les interventions réellement effectuées et leur horaire. Pour l’astreinte, le temps d’intervention constitue du travail effectif et peut donc modifier le calcul des périodes de repos.' },
      { title: '4. Durées maximales', text: 'Le contrôle des durées maximales exige de reconstruire le temps de travail réellement accompli sur les périodes de référence pertinentes. Les plannings, interventions, heures supplémentaires et repos doivent être rapprochés plutôt que lus séparément.' },
      { title: '5. Articulation IEG / GRDF / droit commun', text: 'Le site sépare désormais le niveau du texte : droit commun et européen, branche/IEG, puis entreprise GRDF. Une règle interne ne doit pas être présentée comme une règle légale générale, et un ancien texte ne doit pas être présenté comme actuel sans vérification.' }
    ]
  }
};
