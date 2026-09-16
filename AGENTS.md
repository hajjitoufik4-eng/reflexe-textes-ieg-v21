# Règles de travail

- Projet : Réflexe Textes IEG, Next.js / JavaScript, Node.js 24, npm et package-lock.json uniquement.
- Avant toute modification importante, expliquer le périmètre et attendre la validation de l’utilisateur. Une migration validée peut être menée jusqu’à sa vérification sans demandes répétées.
- Préparer les petits correctifs avec un diff clair et une explication.
- Préserver la distinction branche IEG / GRDF / national / local / périmètre à vérifier. Ne jamais transformer une donnée d’inventaire en conclusion juridique.
- Conserver les documents originaux, les identifiants des fiches et les liens publics. Ne pas inventer de contenu pour les fiches sans explication.
- Préserver l’apparence validée, les couleurs, le symbole et l’espacement, sauf demande explicite.
- Travailler sur une branche dédiée. Ne pas fusionner ni publier sans validation.
- Lancer npm run check et vérifier les parcours accueil, corpus, recherche, fiche, document, retour navigateur et mobile avant livraison. Rapporter les blocages réels.
- Ne pas modifier les fichiers historiques pour un changement de l’application Next.js. Le catalogue utilisé par Next.js est src/data/corpus.json.
- Aucun secret dans Git. Aucun service externe payant ou compte utilisateur ajouté sans besoin validé.
