import { explanationFor as baseExplanationFor } from './explain-base.mjs';

const N=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const H=d=>N(`${d?.ref||''} ${d?.title||''} ${d?.kind||''} ${d?.origin||''}`);

const verifiedGuides=[
  {
    test:h=>/m res 11 02a|mres1102a|grdf nat res pol csr 020048|astreinte et intervention de securite gaz/.test(h),
    guide:{
      heading:'M-RES 11/02A — Astreinte et Intervention de Sécurité Gaz',
      simple:'Cette note métier GRDF organise l’astreinte gaz et l’ISG : elle distingue les travaux urgents et les dépannages reportables, définit l’astreinte et la ZHA, puis rappelle les limites de durée du travail, les repos et le cadre de décompte hebdomadaire.',
      points:[
        'Les ISG et les dépannages potentiellement sensibles sont traités comme travaux urgents ; les dépannages reportables ne bénéficient pas du même régime de dérogation.',
        'La période d’astreinte hors intervention est distinguée du temps d’intervention, qui est du travail effectif.',
        'La note rappelle une durée quotidienne de principe de 10 h, portée à 12 h pendant l’astreinte pour les salariés couverts par les accords correspondants.',
        'Elle rappelle la limite hebdomadaire de 48 h et la moyenne de 44 h sur 12 semaines, avec les dérogations prévues par le droit du travail.',
        'Pour le repos quotidien de 11 h interrompu par une ISG ou un DPS, GRDF retient une restitution en repos équivalent au temps d’intervention situé dans la séquence de repos, à prendre au plus près du fait générateur.',
        'Pour le repos hebdomadaire, la note renvoie expressément à la PERS 530, à N69-76 et aux accords collectifs applicables.'
      ],
      related:'À lire avec PERS 530, PERS 557, N69-76, la note M-RH 13-04 sur les 11 h, les accords de temps de travail et l’accord astreinte GRDF applicable au territoire.',
      limit:'Note métier GRDF datée du 28 août 2014 et indiquée « Valide » dans la copie fournie. Son application doit être combinée avec les accords collectifs et décisions plus récentes.',
      mode:'verified',badge:'✅ Explication vérifiée'
    }
  },
  {
    test:h=>/accord collectif.*organisation.*dispositif.*astreinte gaz|accord fusion astreinte|organisation du dispositif d astreinte gaz.*ile de france/.test(h),
    guide:{
      heading:'Accord astreinte gaz DR Île-de-France — en clair',
      simple:'Cet accord organise concrètement l’astreinte gaz en Île-de-France : périmètre, rythme des tours, cycle jeudi-jeudi, renforts, repos, ZEPIG et mesures destinées à maîtriser la charge et le respect des temps de travail.',
      points:[
        'Il s’applique aux salariés intégrés au dispositif d’astreinte des délégations Île-de-France Est, Ouest et Paris.',
        'Il vise notamment le respect des règles de durée du travail et de repos ainsi que l’équilibre vie professionnelle / vie privée.',
        'Le cycle d’astreinte débute le jeudi matin et se termine le jeudi suivant à la prise de travail.',
        'Pour l’Île-de-France Ouest, l’accord retient une référence moyenne de 13 occurrences par an pour la plupart des ARG et un maximum de 16 tours par an.',
        'Les repos compensateurs générés par le repos journalier de 11 h et les heures supplémentaires doivent être pris au plus près du fait générateur et au plus tard à la sortie de la semaine d’astreinte, selon les dispositions du texte.',
        'L’accord prévoit également des mesures de renfort et d’adaptation des ZEPIG afin de maîtriser la charge et les délais d’intervention.'
      ],
      related:'À lire avec la M-RES 11/02A, PERS 530/557, N69-76, les accords de temps de travail et les décisions ZHA postérieures.',
      limit:'Accord d’entreprise / territorial : il ne remplace pas le socle IEG ni les règles légales de durée et de repos.',
      mode:'verified',badge:'✅ Explication vérifiée'
    }
  },
  {
    test:h=>/decision.*evolution.*zone.*habitat.*astreinte|evolution des zones d habitat d astreinte|evolution zha/.test(h),
    guide:{
      heading:'Décision ZHA Île-de-France du 15 juin 2021 — en clair',
      simple:'Cette décision fixe les périmètres géographiques des Zones d’Habitat d’Astreinte en Île-de-France. Elle indique, ZHA par ZHA, les communes dans lesquelles les salariés concernés doivent résider pendant leur astreinte.',
      points:[
        'La décision découpe les ZHA par secteurs et missions : première intervention, renfort et ATCE selon les territoires.',
        'Elle remplace les anciennes listes de communes annexées aux décisions ou notes antérieures visées par le document.',
        'Le périmètre de la ZHA est un élément concret pour apprécier les contraintes imposées pendant l’astreinte.',
        'La décision prend effet immédiatement à compter du 15 juin 2021.'
      ],
      related:'À lire avec la M-RES 11/02A, qui explique que la ZHA est déterminée pour permettre le respect des délais d’intervention, ainsi qu’avec l’accord astreinte GRDF et les PERS relatives à l’astreinte.',
      limit:'La décision définit les périmètres géographiques ; elle ne résume pas à elle seule l’ensemble des obligations d’astreinte.',
      mode:'verified',badge:'✅ Explication vérifiée'
    }
  },
  {
    test:h=>/m rh 13 04|repos quotidien.*11 heures.*grdf|repos des 11h|repos des 11 h/.test(h),
    guide:{
      heading:'M-RH 13-04 — Repos quotidien de 11 heures',
      simple:'Cette note RH précise comment GRDF traite le repos quotidien de 11 heures lorsqu’une intervention urgente d’astreinte vient l’interrompre, notamment pour les interventions longues, multiples ou réalisées le week-end.',
      points:[
        'Le principe reste un repos quotidien de 11 heures consécutives.',
        'Une intervention urgente peut interrompre cette séquence ; une contrepartie en repos doit alors être organisée selon les règles GRDF.',
        'La méthode distingue notamment les interventions d’au moins 6 heures, les interventions multiples de durée inférieure et certaines situations du week-end.',
        'La restitution doit être rapprochée au maximum du fait générateur et articulée avec l’organisation de la reprise du travail.'
      ],
      related:'À lire avec la M-RES 11/02A, l’accord astreinte GRDF, les accords de temps de travail et les règles de repos hebdomadaire.',
      limit:'Cette fiche synthétise le rôle de la note tel qu’il ressort du corpus GRDF fourni ; pour un calcul individuel, il faut reprendre la méthode complète du document original.',
      mode:'verified',badge:'✅ Explication vérifiée'
    }
  },
  {
    test:h=>/2012 07 03.*temps de travail|note enedis grdf temps de travail/.test(h),
    guide:{
      heading:'Note ENEDIS-GRDF Temps de travail du 3 juillet 2012 — en clair',
      simple:'Cette note pratique explique la mise en œuvre des accords de temps de travail : cycles, acquisition et programmation des JRTT, gestion des événements professionnels et règles de pause méridienne.',
      points:[
        'Les JRTT sont acquis dans la logique du cycle de travail et doivent être programmés sur le cycle selon le tableau de service.',
        'Lorsqu’un événement professionnel impose la présence du salarié, le texte prévoit des règles de reprogrammation du JRTT selon le délai de prévenance.',
        'La pause méridienne doit être définie pour chaque équipe par l’accord local, avec une durée minimale de 45 minutes et une plage comprise entre 11 h 30 et 14 h.',
        'La note distingue les JRTT issus de l’aménagement du temps de travail des jours non travaillés issus du temps choisi.'
      ],
      related:'À lire avec l’accord national temps de travail, l’accord local applicable à l’équipe et, en cas d’astreinte, avec les textes spécifiques d’astreinte et de repos.',
      limit:'Document explicatif de mise en œuvre : la règle applicable dépend aussi de l’accord local et du cycle effectivement retenu pour l’équipe.',
      mode:'verified',badge:'✅ Explication vérifiée'
    }
  }
];

export function explanationFor(d){
  const h=H(d);
  const found=verifiedGuides.find(x=>x.test(h));
  if(found) return found.guide;
  return baseExplanationFor(d);
}
