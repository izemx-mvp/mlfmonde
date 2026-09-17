# Plan

## Objectif
Mettre à jour uniquement les trois éléments demandés : menu latéral, écran de connexion, et logo responsive.

## Changements prévus
- Retirer le sous-menu **Conversations** du menu latéral.
- Ajouter le bloc **CONFIGURATION IA** en bas du menu, avec cinq nouvelles pages cliquables :
  - Agents IA
  - Base de connaissances
  - Modèles de documents
  - FAQ
  - Paramètres
- Ajouter un écran de connexion responsive affiché avant l’application.
- Vérifier les identifiants côté serveur et conserver la session ouverte après connexion.
- Remplacer le logo actuel par le logo fourni, avec un conteneur adaptatif sans débordement ni déformation.

## Détails techniques
- Les nouvelles pages seront ajoutées comme routes TanStack Start dédiées, avec contenu de gestion léger et fonctionnel pour éviter les liens morts.
- Le login utilisera une vérification côté serveur et une session chiffrée, avec les identifiants stockés comme secrets serveur.
- Le logo fourni sera utilisé via Lovable Assets, puis affiché avec des dimensions contraintes et `object-contain`.
- Aucun autre module, tableau, donnée métier ou logique existante ne sera modifié.

## Validation
- Vérifier que le menu ne contient plus **Conversations**.
- Vérifier que les cinq liens **Configuration IA** s’ouvrent correctement.
- Vérifier que l’application demande une connexion avant accès.
- Vérifier que le logo reste propre sur desktop et mobile.
