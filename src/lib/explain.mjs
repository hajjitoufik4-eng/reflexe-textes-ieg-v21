const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

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
    points:[
      `Sujet principal : ${guide.subject}.`,
      guide.check,
      isExtension?`Ne lis pas cette décision seule : ouvre aussi ${ref||'le texte de fond'} et les textes qui le modifient.`:`Vérifie si ce document a été modifié, remplacé, étendu ou précisé par un texte plus récent.`
    ],
    related:`Utilise le bloc « À lire avec » de cette fiche : le site recherche les textes portant la même référence, les décisions d’extension, les textes d’application et les documents du même bloc juridique.`,
    limit:`Lecture guidée construite à partir de l’intitulé, du classement et des liens du corpus. Ce n’est pas encore une analyse article par article du document original.`,
    mode:'guided',
    badge:'🧭 Lecture guidée'
  };
}

export function explanationFor(d){
  if(d?.explanation){
    return {...d.explanation,mode:'verified',badge:'✅ Explication vérifiée'};
  }
  return genericExplanation(d||{});
}
