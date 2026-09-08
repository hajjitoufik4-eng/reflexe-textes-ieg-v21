# Corpus IEG et complément GRDF — étape documentaire

Cette branche prépare le corpus. Elle ne modifie pas l’interface du site et ne certifie pas la vigueur des textes.

## Collectes

- `inventaire.json` : 649 fichiers du ZIP SGE IEG fourni ; empreintes SHA-256, chemins originaux, rattachements au tableau du corpus et groupes de fichiers identiques.
- `complement-grdf.json` : 48 liens PDF distincts de https://csec-grdf.fnme-cgt.fr/accords-a-grdf/ téléchargés avec succès, plus les 3 pièces fournies. Les 51 entrées correspondent à 49 PDF distincts. Chaque provenance est conservée.
- Les PDF du complément sont conservés dans l’archive livrée `Corpus_GRDF_collecte.zip`. Ils ne sont pas encore importés comme fichiers binaires dans ce dépôt. Le catalogue conserve les URL publiques d’origine et les noms des pièces fournies.

## Règles de classement à valider

Entrée principale par thème et sous-dossier ; nature et périmètre sont des attributs distincts : PERS, note DP/N, accord de branche, accord GRDF, note GRDF, avenant, décision ou document explicatif. Ne pas assimiler automatiquement un texte hébergé par le CSEC à un accord national applicable à tous.

1. Temps de travail : astreinte et organisation ; horaires et aménagements ; repos ; congés ; CET ; travail à distance et itinérance.
2. Rémunération et frais : salaires ; primes ; repas ; déplacements ; épargne salariale.
3. Carrière : classification ; avancement ; mobilité ; formation ; réorganisations.
4. Santé et protection sociale : maladie ; accidents du travail ; handicap ; pénibilité.
5. Famille : parentalité ; enfants ; absences ; aidants.
6. Retraite : départ ; pension ; régimes supplémentaires.
7. Représentation : mandats ; moyens syndicaux ; CSE/CSP ; parcours des mandatés.
8. Avantages et activités sociales : tarif agent ; prestations ; CCAS.
9. Règles internes : règlement intérieur ; discipline ; déontologie.

Un texte peut figurer dans plusieurs sous-dossiers par des liens, sans multiplier les copies. Les décisions d’extension communes conservent leurs différents rattachements. Le classement automatique du complément est provisoire et fondé sur les intitulés.

## Trois pièces fournies

- Accord national sur le temps de travail : couverture identifiée comme accord national GRDF ; fichier scanné.
- Accord temps de travail Île-de-France : couverture identifiée comme accord collectif applicable au sein de la Direction Réseaux Île-de-France ; fichier scanné.
- Accord fusion astreinte : titre et article 1 identifient la Direction Réseaux Île-de-France, et les salariés intégrés au dispositif d’astreinte des DEM Est, Ouest et Paris. Le préambule mentionne deux accords associés (semaine calendaire et durée quotidienne), dont la présence dans le corpus reste à vérifier. Le nom du fichier comporte une date de version : ne pas l’assimiler sans vérification à une date de signature.

## Suite

Faire valider l’arborescence ; lire/OCR les documents nécessaires ; vérifier les dates, périmètres, signatures, avenants, substitutions et textes obsolètes ; rapprocher les PDF existants du dépôt avec l’ensemble des collectes ; intégrer les fichiers et le moteur de recherche après validation. Aucun diagnostic juridique définitif n’a été produit à cette étape.
