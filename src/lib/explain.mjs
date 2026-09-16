const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const canon=s=>String(s||'').replace(/\s+/g,'').toUpperCase();

const folderGuide={
  astreinte:{subject:"l’astreinte, la disponibilité, les interventions et les contraintes associées",check:"Distingue toujours la période d’astreinte, le temps d’intervention et les règles de repos qui se déclenchent après une intervention."},
  temps:{subject:"le temps de travail, les horaires, les pauses, les repos ou les congés",check:"Regarde la durée concernée, la période de décompte, les repos obligatoires et l’existence éventuelle d’un accord plus précis."},
  argent:{subject:"la rémunération, les primes, les indemnités, les frais ou les déplacements",check:"Vérifie qui bénéficie du droit, les conditions d’ouverture, la période concernée et le barème applicable à cette date."},
  discipline:{subject:"la discipline, les sanctions et la procédure applicable au salarié",check:"Sépare le fait reproché, la procédure suivie, le niveau de sanction possible et les garanties prévues par les textes."},
  sante:{subject:"la santé, la sécurité et les conditions de travail",check:"Vérifie les obligations de prévention, la situation concrète de travail et les procédures spécifiques prévues en cas de danger ou d’atteinte à la santé."},
  mandats:{subject:"les mandats, la représentation du personnel et les moyens des élus",check:"Vérifie le type de mandat, l’origine du temps utilisé, les déplacements et le texte qui fonde précisément le droit exercé."},
  carriere:{subject:"la carrière, la classification, l’emploi, la mobilité ou la formation",check:"Regarde la population visée, la fonction ou classification concernée et si le texte a été remplacé par un dispositif plus récent."},
  famille:{subject:"les droits familiaux, la parentalité et les absences liées à la famille",check:"Vérifie la situation familiale visée, la durée du droit, les justificatifs demandés et les textes plus récents qui peuvent compléter la règle."},
  retraite:{subject:"la retraite, l’inactivité ou les pensions",check:"Regarde la date d’effet, la population concernée et les réformes postérieures susceptibles d’avoir modifié le dispositif."},
  avantages:{subject:"les avantages sociaux, les avantages en nature ou les droits associés au statut",check:"Vérifie le bénéficiaire, le type d’avantage, son mode de calcul et les décisions plus récentes qui peuvent l’avoir fait évoluer."},
  regles:{subject:"les règles générales du statut et leur mise en œuvre",check:"Repère le niveau du texte, sa date, les textes qu’il modifie et ceux qui l’ont ensuite complété."},
  autres:{subject:"un sujet du corpus IEG ou GRDF",check:"Commence par identifier le périmètre du document, sa date et les textes qu’il cite avant d’en tirer une conséquence pratique."}
};

const verifiedByRef={
  PERS77:{
    heading:'PERS 77 — Travail, repos et heures supplémentaires',
    simple:'La PERS 77 explique notamment comment traiter les dépassements de l’horaire normal, les heures supplémentaires, certains travaux urgents, le travail du dimanche et des jours fériés. Pour un agent, le point clé est que le dépassement de l’horaire affiché peut ouvrir droit à compensation ou paiement selon les règles prévues.',
    points:[
      'Les heures supplémentaires commencent à courir à partir du dépassement de l’horaire habituel de travail prévu au tableau de service.',
      'Le texte vise notamment les travaux urgents destinés à prévenir ou réparer des accidents ainsi que les travaux préparatoires ou complémentaires exécutés hors horaire normal.',
      'Le texte prévoit des modalités de compensation : repos compensateur majoré, compensation temps pour temps avec paiement de la majoration, ou paiement des heures et de leur majoration selon les nécessités du service.',
      'Pour le dimanche et les jours fériés, il prévoit des règles spécifiques de rémunération et de compensation.'
    ],
    related:'À lire avec les accords de temps de travail applicables aujourd’hui, les règles de repos quotidien/hebdomadaire et, en cas d’astreinte, les PERS 530/557 et les règles GRDF correspondantes.',
    limit:'Texte ancien : certaines références horaires historiques ont été remplacées ou encadrées par des règles plus récentes. Il faut donc utiliser la PERS 77 sur les points encore applicables en la combinant avec les accords actuels.',
    mode:'verified',badge:'✅ Explication vérifiée'
  },
  PERS557:{
    heading:'PERS 557 — Astreinte en clair',
    simple:'La PERS 557 modifie la PERS 530 et republie son dispositif d’astreinte. Elle distingue l’astreinte d’action immédiate et l’astreinte d’alerte, précise la rémunération de l’astreinte, la rémunération des interventions, le repos hebdomadaire et certaines règles de logement imposé.',
    points:[
      'L’astreinte est une sujétion imposée en dehors des heures normales de travail pour recevoir des informations, intervenir ou décider des mesures à prendre.',
      'Pour l’astreinte d’action immédiate, le texte prévoit l’obligation de rester en permanence au domicile ou à proximité immédiate afin de répondre à tout appel.',
      'Toute heure d’intervention entraînant un travail effectif est considérée comme une heure supplémentaire pour le personnel d’exécution ou de maîtrise, et la rémunération de l’astreinte se cumule avec celle de l’intervention.',
      'Le texte prévoit également un repos hebdomadaire de 24 heures consécutives sans astreinte et des règles spécifiques pour les jours fériés.'
    ],
    related:'À lire avec la PERS 530, N69-76, les notes DP relatives à l’astreinte, les accords GRDF d’astreinte, la M-RES 11/02A, les règles de repos et la jurisprudence sur l’intensité des contraintes.',
    limit:'La PERS 557 pose le socle IEG. L’organisation concrète actuelle chez GRDF dépend aussi des accords et décisions d’entreprise applicables au territoire et au métier.',
    mode:'verified',badge:'✅ Explication vérifiée'
  },
  PERS793:{
    heading:'PERS 793 — Repas et déplacements en clair',
    simple:'La PERS 793 fixe les règles de remboursement des frais de déplacement. Pour les déplacements dans la zone habituelle de travail, elle ouvre notamment le droit à l’indemnité de repas lorsque l’agent est en déplacement pour raison de service pendant les heures normales de repas.',
    points:[
      'Pour le déjeuner, les heures normales de repas sont comprises entre 11 h et 13 h ; pour le dîner, entre 18 h et 21 h.',
      'Le texte précise que ces heures sont celles de fin de travail ou de fin de déplacement.',
      'Dans la zone habituelle de travail, l’indemnité de repas est fixée à 90 % du barème applicable au groupe fonctionnel et à la localité concernée.',
      'L’existence d’une cantine ou d’un restaurant agréé peut modifier les modalités d’indemnisation lorsque l’agent peut effectivement y prendre son repas.'
    ],
    related:'À lire avec la jurisprudence de la Cour de cassation du 16 novembre 2022 sur la preuve de la possibilité de retour au centre et, selon la situation, avec les règles GRDF relatives aux déplacements et aux frais des élus.',
    limit:'Le droit dépend de la situation réelle de déplacement et des possibilités concrètes de retour ou d’accès à une cantine. Le barème financier applicable doit être vérifié à la date concernée.',
    mode:'verified',badge:'✅ Explication vérifiée'
  },
  'DP31-28':{
    heading:'DP31-28 — Astreinte et maintien de l’indemnité',
    simple:'Cette note précise un cas particulier de la PERS 530 modifiée : le maintien de l’indemnité horaire d’astreinte pour certains agents en astreinte d’assistance pendant une période prévue au tableau de service.',
    points:[
      'La note vise les absences liées à des stages de perfectionnement ou à des accidents du travail.',
      'Le maintien de l’indemnité vaut pendant la période où l’agent reste inscrit au tableau de service préétabli organisant l’astreinte.',
      'Au-delà de cette période, le bénéfice du maintien de l’indemnité cesse.'
    ],
    related:'À lire avec la PERS 530 modifiée et la PERS 557, car la note ne constitue pas un régime autonome d’astreinte.',
    limit:'La note traite d’un point précis de rémunération et ne résume pas l’ensemble des règles d’astreinte.',
    mode:'verified',badge:'✅ Explication vérifiée'
  }
};

const cleanTitle=d=>String(d.title||d.ref||d.kind||'Ce texte')
  .replace(/^PERS\s*\d+\s*[-–—:]?\s*/i,'')
  .replace(/^DP\s*\d{1,2}\s*-\s*\d+\s*[-–—:]?\s*/i,'')
  .replace(/^N\s*\d{2}\s*-\s*\d+\s*[-–—:]?\s*/i,'')
  .replace(/\s*-?\s*Décision d['’]extension.*$/i,'')
  .replace(/\s*-?\s*\d{1,2}\s+\d{1,2}\s+\d{4}.*$/,'')
  .trim();

function genericExplanation(d){
  const title=String(d.title||'');
  const lower=norm(`${title} ${d.kind||''}`);
  const guide=folderGuide[d.folder]||folderGuide.autres;
  const ref=d.ref?String(d.ref).replace(/\s+/g,' '):'';
  const isExtension=/decision d.?extension|décision d.?extension/.test(lower);
  const isPers=/^pers\b/i.test(String(d.kind||''))||/^PERS/i.test(ref);
  const isDp=/note dp/i.test(String(d.kind||''))||/^DP/i.test(ref);
  const isN=/circulaire n/i.test(String(d.kind||''))||/^N\d/i.test(ref);
  const isAgreement=/accord/i.test(`${d.kind||''} ${title}`);
  const subject=cleanTitle(d)||guide.subject;

  let simple;
  if(isExtension){
    simple=`Cette décision d’extension est liée à ${ref||'un texte IEG'} : elle sert à préciser ou étendre son applicabilité. Elle ne remplace pas le texte de fond ; il faut lire les deux ensemble.`;
  }else if(isPers){
    simple=`Cette circulaire PERS traite de « ${subject} ». Elle précise une règle de personnel des IEG et doit être replacée dans le Statut, ses modifications et les textes d’application qui l’accompagnent.`;
  }else if(isDp){
    simple=`Cette note DP apporte une précision d’application sur « ${subject} ». Elle se lit avec le texte IEG qu’elle applique, complète ou précise.`;
  }else if(isN){
    simple=`Cette circulaire N concerne « ${subject} ». C’est un texte d’application à rapprocher des PERS, notes DP ou dispositions statutaires auxquelles elle se réfère.`;
  }else if(isAgreement){
    simple=`Cet accord collectif concerne « ${subject} ». Il fixe des règles négociées pour son périmètre d’application et doit être lu avec les règles de niveau supérieur ainsi qu’avec les accords plus récents éventuels.`;
  }else if(d.scope==='grdf'){
    simple=`Ce document GRDF concerne « ${subject} ». Il faut vérifier son niveau (national ou local), sa date de validité et son articulation avec les textes IEG, les accords collectifs et le droit commun.`;
  }else{
    simple=`Ce document du corpus concerne « ${subject} ». Pour savoir ce qu’il permet concrètement, il faut vérifier son périmètre, sa date et les textes qui le modifient ou l’appliquent.`;
  }

  return {
    heading:ref?`${ref} — en clair`:`${subject} — en clair`,
    simple,
    points:[`Sujet principal : ${guide.subject}.`,guide.check,isExtension?`Ne lis pas cette décision seule : ouvre aussi ${ref||'le texte de fond'} et les textes qui le modifient.`:`Vérifie si ce document a été modifié, remplacé, étendu ou précisé par un texte plus récent.`],
    related:'Utilise le bloc « À lire avec » de cette fiche : le site recherche les textes portant la même référence, les décisions d’extension, les textes d’application et les documents du même bloc juridique.',
    limit:'Lecture guidée construite à partir de l’intitulé, du classement et des liens du corpus. Ce n’est pas encore une analyse article par article du document original.',
    mode:'guided',badge:'🧭 Lecture guidée'
  };
}

export function explanationFor(d){
  const ref=canon(d?.ref);
  const extension=/décision d.?extension|decision d.?extension/i.test(d?.title||'');
  if(!extension&&verifiedByRef[ref]) return verifiedByRef[ref];
  if(d?.explanation) return {...d.explanation,mode:'verified',badge:'✅ Explication vérifiée'};
  return genericExplanation(d||{});
}
