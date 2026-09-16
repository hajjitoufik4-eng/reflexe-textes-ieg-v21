# Réflexe Textes IEG

Migration Next.js / JavaScript du prototype existant. Les textes de branche et les textes GRDF restent séparés. Cette migration ne valide pas juridiquement les classements ou explications de l’inventaire.

## Installation et lancement

Node.js 24 et npm. Après clonage :

```bash
npm ci
npm run dev
```

Ouvrir http://localhost:3000. `predev` et `prebuild` copient les originaux de `documents/` vers `public/documents/`. Ces copies sont ignorées par Git ; les originaux restent versionnés à leur emplacement historique.

## Contrôles

```bash
npm run check
```

Cette commande exécute ESLint, le contrôle Prettier, les tests du catalogue et la compilation. `npm run format` met en forme les nouveaux fichiers. Les fichiers historiques sont exclus du formatage.

Production locale : `npm run build`, puis `npm start`.

## Organisation

- `src/app/` : accueil, catalogue `/corpus/ieg` et `/corpus/grdf`, fiches `/textes/d…` et page introuvable.
- `src/data/corpus.json` : 609 fiches extraites du bloc `ir-data` de `prototype/lecture-textes.html`, avec identifiants conservés.
- `src/lib/catalogue.mjs` : recherche, périmètres et liens.
- `documents/` : originaux versionnés ; leurs URL `/documents/…` sont conservées.
- `prototype/`, `index.html`, `data.js` : fichiers historiques conservés pour l’ancien hébergement. La nouvelle application utilise `src/data/corpus.json`.
- `tests/` : conservation des fiches, présence des fichiers, recherche et périmètres.

Composants en PascalCase, fonctions en camelCase, dossiers en kebab-case ; conserver les conventions de routage Next.js.

## Données et limites

L’inventaire contient 218 liens locaux, 46 liens externes et 345 fiches sans original relié. Quatre fiches ont une explication, dont deux versions de PERS 530. Les liens externes ne sont pas réputés vérifiés. La recherche porte sur références, titres et thèmes ; aucun service d’IA n’est connecté. Aucune variable d’environnement ni base de données n’est nécessaire.

## Déploiement proposé

Sur Vercel, importer ce dépôt, choisir Next.js et la racine du dépôt, Node.js 24, installation `npm ci`, compilation `npm run build`, sortie Next.js par défaut. Faire une prévisualisation sur la branche de migration avant toute fusion dans main. L’accès à l’espace Vercel doit encore être confirmé. Ne pas changer l’ancien hébergement avant validation de la nouvelle version.

## Git

Une branche par changement, commits ciblés, contrôles avant revue, fusion et publication après validation. Ne pas versionner de secrets, `.env`, `.next` ou `node_modules`.

## Compatibilité ESLint

ESLint est fixé à 9.39.5 : la version 10.10.0 échoue avec le parseur de la configuration Next.js 16.3.5 (`scopeManager.addGlobals is not a function`). npm signale que la branche 9 n’est plus prise en charge. Réévaluer cette dépendance à la prochaine mise à jour compatible de la chaîne Next.js ; ne pas forcer les dépendances pair.
