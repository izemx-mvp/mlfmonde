# LFILM Smart Hub

# LFILM Smart School — MVP de démonstration

## 1. CONTEXTE

Créer un **MVP web complet, interactif et professionnel** pour le :

**Lycée Français International Louis-Massignon (LFILM)**

📍 Bouskoura – Ville Verte, Maroc

🌐 Réseau : mlfmonde / OSUI

👥 Environ 349 personnels

🎓 De la petite section à la terminale

Le client souhaite digitaliser et automatiser ses processus internes, principalement autour de :

* Ressources humaines

* Absences et congés

* Événements RH

* Recrutement

* Documents RH

* Onboarding

* Communication interne

* Emails

* Demandes et réclamations

* Services aux parents / candidats / collaborateurs

* Analyse des données

* Intelligence artificielle

Le MVP doit montrer **concrètement comment l'IA peut automatiser les processus du lycée**.

Ce n'est PAS une simple landing page ni une maquette statique.

Je veux une **application métier navigable et interactive**, avec des mock data réalistes.

---

# 2. IDENTITÉ VISUELLE

Utiliser comme référence les sites officiels du lycée :

* https://lfilm.org/

* https://lfilm-casa-anfa.org/

Respecter autant que possible :

* Leurs couleurs

* Leurs codes d'identité visuelle

* Leur style institutionnel

* Leurs éléments graphiques

* Leur ton

L'application doit renvoyer une image :

* Moderne

* Premium

* Institutionnelle

* Claire

* Professionnelle

* Adaptée à une présentation client

*Note : Éviter absolument toute apparence SaaS standard ou générique sans lien direct avec l'identité du lycée.*

---

## Palette de Couleurs Officielle

### A. Couleurs Principales du Logo (Palette Signature)

Ces teintes proviennent directement des blocs graphiques du logo central et doivent être utilisées par petites touches identitaires (boutons d'action, accents visuels, badges, graphiques) :

* **Bleu nuit / Marine :** `#262B3F` *(Titres forts, fonds sombres ou contrastes institutionnels)*

* **Rouge brique :** `#BC322B` *(Accents dynamiques, alertes, points d'attention)*

* **Orange :** `#E07C32` *(Éléments secondaires, bannières, appels à l'information)*

* **Jaune :** `#F2CC42` *(Mise en valeur, pastilles, illustrations)*

* **Vert :** `#67B146` *(Validation, succès, indicateurs positifs)*

* **Bleu clair / Turquoise :** `#6BAED0` *(Liens, infographies, éléments interactifs clairs)*

### B. Couleurs de Structure et d'Interface (Neutres & Institutionnelles)

Ces couleurs garantissent la lisibilité, la hiérarchie de l'information et le sérieux de l'interface :

* **Bleu canard foncé / Pétrole :** `#2B5470` *(Couleur principale des en-têtes, des icônes de contact et des éléments de navigation de premier niveau)*

* **Noir institutionnel :** `#1A1A1A` *(Textes principaux, typographies d'en-tête, contrastes forts)*

* **Gris clair (Fonds/Conteneurs) :** `#F4F6F8` ou `#F5F7FA` *(Fonds de cartes, zones de contenu alternées, arrière-plans de page adoucis)*

* **Gris moyen (Textes secondaires) :** `#6B6B6B` ou `#7F7F7F` *(Sous-titres, métadonnées, bordures, séparateurs légers)*

* **Blanc pur :** `#FFFFFF` *(Fonds de page principaux, cartes, espaces de respiration)*

### Layout

Créer :

* Sidebar gauche

* Header supérieur

* Zone de contenu principale

* Notifications

* Profil utilisateur

La sidebar doit pouvoir être réduite/agrandie.

---

# 3. NAVIGATION

Créer les menus suivants :

```text

Dashboard

RH

 ├── AI HR Command Center

 ├── Collaborateurs

 ├── Absences & Congés

 ├── Événements RH

 └── AI HR Insights

Recrutement

 ├── AI Recruitment Manager

 ├── Candidatures

 ├── AI Candidate Screening

 └── Entretiens

Documents

 └── AI HR Document Generator

Onboarding

 └── AI Onboarding Manager

Assistants IA

 ├── AI Employee Assistant

 └── AI School Service Agent

Demandes & Réclamations

 ├── Toutes les demandes

 ├── Réclamations

 ├── Emails entrants

 └── Conversations

Administration

 ├── Utilisateurs

 └── Paramètres

```

Toutes les pages doivent être accessibles depuis la navigation.

---

# 4. DASHBOARD

Créer un dashboard central donnant une vision globale de l'activité du lycée.

## KPI

Afficher :

* **349** collaborateurs

* Absences en cours

* Congés en attente

* Événements RH à venir

* Documents arrivant à échéance

* Recrutements en cours

* Nouvelles candidatures

* Demandes à traiter

* Réclamations ouvertes

Utiliser des KPI cards modernes avec :

* valeur

* évolution

* indicateur positif/négatif

* icône

* possibilité de cliquer pour accéder au module concerné

## Graphiques

Ajouter des graphiques avec mock data :

* évolution des effectifs

* taux d'absentéisme

* répartition des absences

* turnover

* recrutements

* répartition des collaborateurs par service

## AI Insights

Créer une section :

### 🤖 AI Insights

Exemples :

> Le taux d'absentéisme du personnel administratif a augmenté ce mois-ci.

> 12 documents collaborateurs arrivent à échéance dans les 30 prochains jours.

> 5 demandes de congés attendent une validation.

> 7 dossiers collaborateurs présentent des informations manquantes.

Chaque insight doit avoir un bouton permettant d'accéder au module concerné.

## Actions prioritaires

Créer une liste :

* contrats à renouveler

* demandes de congés

* visites médicales

* réclamations urgentes

* candidatures à analyser

---

# 5. AI HR COMMAND CENTER

Créer un espace centralisé de supervision RH.

Afficher :

* Effectif

* Nouveaux collaborateurs

* Départs

* Absences

* Congés

* Événements

* Documents expirants

* Formations

* Entretiens

* Alertes

Créer une section :

### Actions prioritaires

Exemple :

**Urgent**

> 3 contrats arrivent à échéance dans moins de 15 jours.

**À traiter**

> 5 demandes de congés sont en attente.

**Rappel**

> 8 visites médicales doivent être planifiées.

Ajouter des filtres :

* Aujourd'hui

* Cette semaine

* Ce mois

* Urgent

* En retard

---

# 6. COLLABORATEURS

Créer une vraie page de gestion des collaborateurs.

Tableau avec :

* Nom

* Prénom

* Matricule

* Service

* Fonction

* Type de contrat

* Date d'arrivée

* Statut

* Responsable

Fonctionnalités :

* recherche

* pagination

* filtres

* tri

* consultation

* modification

* ajout d'un collaborateur

Créer une fiche collaborateur détaillée avec :

* informations personnelles

* poste

* contrat

* absences

* congés

* événements RH

* documents

* historique

Utiliser des données fictives.

---

# 7. SMART ABSENCE & LEAVE MANAGEMENT

Créer un module complet Absences & Congés.

## Tableau

Colonnes :

* Collaborateur

* Service

* Type

* Date début

* Date fin

* Durée

* Source

* Statut

* Actions

Types :

* Congé annuel

* Maladie

* Absence exceptionnelle

* Télétravail

* Autorisation d'absence

Sources :

* Portail RH

* Email

* WhatsApp

* Saisie manuelle

Statuts :

* En attente

* Approuvé

* Refusé

* En cours

## Fonctionnalités

Permettre :

* recherche

* filtres

* pagination

* tri

* validation

* refus

* modification

* consultation

* création d'une demande

## AI Automation

Ajouter une section :

### Automatisation IA

Exemples :

> Une demande reçue par email a été automatiquement détectée et créée.

> Une demande WhatsApp a été interprétée et ajoutée aux demandes en attente.

> Une relance automatique est recommandée pour une demande non traitée depuis 48h.

Créer également une vue calendrier.

---

# 8. HR EVENT & MEDICAL FOLLOW-UP

Créer un module de suivi des événements RH.

Types :

* Visite médicale

* Formation

* Entretien annuel

* Renouvellement de document

* Échéance de contrat

* Certification

* Évaluation

Tableau :

* Événement

* Collaborateur

* Type

* Date

* Responsable

* Statut

Ajouter :

* recherche

* filtres

* pagination

* calendrier

* alertes

Exemples :

> ⚠️ Visite médicale dans 7 jours.

> ⚠️ Document arrivant à échéance dans 15 jours.

---

# 9. AI HR INSIGHTS

Créer une page d'analyse RH.

Afficher des graphiques concernant :

* absentéisme

* turnover

* effectifs

* recrutements

* congés

* réclamations

Créer une section :

### Ask AI

L'utilisateur peut poser une question :

> Quel service a le plus fort taux d'absentéisme ?

> Combien de collaborateurs ont été recrutés cette année ?

> Quelles sont les principales tendances RH ?

Le MVP peut afficher des réponses simulées basées sur les mock data.

---

# 10. AI RECRUITMENT MANAGER

Créer un pipeline Kanban :

```text

Nouveau

↓

Préqualification

↓

Screening IA

↓

Entretien

↓

Entretien final

↓

Sélectionné

↓

Onboarding

```

Chaque candidat contient :

* Nom

* Poste

* Date candidature

* Expérience

* Score IA

* Statut

* Responsable

* Prochaine action

Permettre de déplacer les candidats entre les étapes.

---

# 11. AI CANDIDATE SCREENING

Créer une page permettant de simuler l'analyse IA des CV.

Afficher :

* candidat

* poste

* expérience

* compétences

* score de matching

* points forts

* points faibles

* recommandation IA

Exemple :

**92 % de correspondance**

Points forts :

* Java

* Spring Boot

* expérience RH

* expérience secteur éducatif

Ajouter :

**Analyser le CV**

Le bouton ouvre une modale contenant une analyse détaillée simulée.

---

# 12. INTERVIEW & MEETING ASSISTANT

Créer un module de gestion des entretiens.

Afficher :

* candidat

* poste

* recruteur

* date

* heure

* statut

Actions :

* proposer des créneaux

* planifier

* modifier

* annuler

* envoyer invitation

Ajouter une vue calendrier.

---

# 13. AI HR DOCUMENT GENERATOR

Créer un générateur de documents RH.

Types :

* Contrat

* Attestation de travail

* Attestation de salaire

* Convocation

* Courrier RH

* Certificat

* Lettre administrative

Workflow :

```text

1. Choisir le document

2. Choisir le collaborateur

3. Préremplir les informations

4. Générer

5. Prévisualiser

6. Télécharger

```

Pour le MVP, la génération peut être simulée.

Créer également une liste :

### Documents récents

avec :

* nom

* type

* collaborateur

* date

* statut

---

# 14. AI ONBOARDING MANAGER

Créer un suivi de l'intégration des nouveaux collaborateurs.

Checklist :

* Documents administratifs

* Contrat signé

* Création du compte

* Accès informatique

* Badge

* Présentation équipe

* Formation

* Rendez-vous RH

* Visite médicale

Afficher une progression :

**75 % complété**

Afficher les tâches en retard.

---

# 15. AI EMPLOYEE ASSISTANT

Créer un chatbot RH.

Interface moderne de conversation.

Questions suggérées :

> Combien de jours de congés me reste-t-il ?

> Comment demander un congé ?

> Quels documents dois-je fournir ?

> Comment obtenir une attestation de travail ?

> Quand est ma prochaine visite médicale ?

Les réponses peuvent être simulées mais doivent être cohérentes avec les données fictives.

Ajouter :

* historique

* suggestions

* messages utilisateur

* réponses IA

* timestamp

---

# 16. AI SCHOOL SERVICE AGENT

Créer un assistant intelligent destiné aux :

* Parents

* Candidats

* Collaborateurs

* Visiteurs

Canaux :

* WhatsApp

* Site web

* Email

* Réseaux sociaux

Créer une interface de gestion des conversations.

Chaque demande doit afficher :

* demandeur

* canal

* message

* catégorie détectée

* priorité

* service concerné

* statut

## Catégories IA

* Admission

* Inscription

* RH

* Finance

* Vie scolaire

* Transport

* Cantine

* Documents

* Réclamation

* Information générale

Exemple :

**Message :**

> Je souhaite connaître les documents nécessaires pour inscrire mon enfant.

**IA :**

Catégorie : Admission

Service : Admissions

Priorité : Normale

Action : Réponse automatique

Ajouter une zone de chat permettant de simuler une conversation avec l'agent.

---

# 17. DEMANDES & RÉCLAMATIONS

Créer un module centralisant toutes les demandes.

Tableau :

* ID

* Demandeur

* Sujet

* Catégorie

* Canal

* Priorité

* Responsable

* Date

* Statut

Statuts :

* Nouveau

* En cours

* En attente

* Résolu

* Fermé

Ajouter :

* recherche

* filtres

* pagination

* tri

* consultation

* changement de statut

* assignation

## Fiche détaillée

Afficher :

* conversation

* historique

* notes internes

* responsable

* statut

* actions

---

# 18. AI EMAIL MANAGEMENT

Créer une boîte email intelligente.

Tableau :

* Expéditeur

* Objet

* Date

* Catégorie IA

* Priorité

* Service

* Statut

L'IA simule automatiquement :

* classification

* extraction du sujet

* identification du service

* détection d'urgence

* suggestion de réponse

* création d'une tâche

Exemple :

**Email :**

> Bonjour, je souhaite savoir où en est ma demande de congé.

**Analyse IA :**

Catégorie : Congé

Priorité : Normale

Service : RH

Action : Vérifier la demande

Ajouter un bouton :

**Générer une réponse IA**

qui affiche une réponse proposée.

---

# 19. NOTIFICATIONS

Créer un centre de notifications accessible depuis le header.

Exemples :

* 5 demandes de congés nécessitent une validation

* 3 contrats arrivent bientôt à échéance

* 2 visites médicales sont prévues cette semaine

* 4 nouvelles candidatures

* 3 réclamations prioritaires

Ajouter un compteur de notifications non lues.

Les notifications doivent être cliquables.

---

# 20. RECHERCHE GLOBALE

Ajouter une recherche globale dans le header.

Recherche parmi :

* collaborateurs

* candidatures

* demandes

* documents

* réclamations

* emails

* événements

Afficher les résultats regroupés par catégorie.

---

# 21. MOCK DATA

Créer suffisamment de mock data pour rendre le MVP crédible.

Utiliser des données fictives mais cohérentes.

Créer au minimum :

* 349 collaborateurs

* plusieurs services

* 50+ absences

* 30+ demandes de congés

* 30+ événements RH

* 20+ candidatures

* plusieurs entretiens

* plusieurs documents

* 20+ réclamations

* 30+ emails

* plusieurs conversations WhatsApp

* données historiques pour les graphiques

Les mêmes collaborateurs doivent pouvoir apparaître dans plusieurs modules.

**Ne pas utiliser Lorem ipsum.**

Tout doit être en français.

---

# 22. TABLEAUX

Tous les tableaux doivent avoir lorsque pertinent :

* recherche

* pagination

* filtres

* tri

* actions

* consultation détaillée

* changement de statut

Utiliser des tableaux professionnels avec :

* badges

* avatars

* dates formatées

* actions contextuelles

* dropdown menu

---

# 23. FORMULAIRES

Tous les formulaires doivent avoir :

* validation

* champs obligatoires

* messages d'erreur

* feedback de succès

* bouton annuler

* confirmation lorsque nécessaire

Les données peuvent être stockées uniquement côté frontend/local pour le MVP.

---

# 24. INTERACTIONS

IMPORTANT :

**AUCUN BOUTON NE DOIT ÊTRE PUREment DÉCORATIF.**

Chaque bouton visible doit effectuer une action réelle dans le MVP.

Exemples :

* Ajouter → ouvre un formulaire

* Modifier → ouvre une modale

* Voir → ouvre le détail

* Supprimer → confirmation puis suppression de la mock data

* Valider → changement de statut

* Refuser → changement de statut

* Filtrer → filtre réellement les données

* Rechercher → recherche réellement

* Pagination → change réellement de page

* Générer → affiche un résultat simulé

* Analyser → affiche l'analyse IA simulée

* Assigner → permet de choisir un responsable

* Notifier → affiche une notification

---

# 25. ÉTATS UI

Prévoir :

* loading states

* empty states

* error states

* success states

* confirmation dialogs

* toast notifications

* badges

* tooltips

* modales

Aucune page importante ne doit être vide.

---

# 26. ARCHITECTURE TECHNIQUE

Utiliser :

* React

* TypeScript

* Tailwind CSS

* composants réutilisables

* bibliothèque UI moderne si nécessaire

* librairie de graphiques adaptée

Créer une architecture propre et réutilisable.

Préparer le code afin que les mock data puissent être remplacées plus tard par de vraies APIs.

Créer des composants réutilisables notamment :

* DataTable

* SearchBar

* FilterBar

* Pagination

* StatusBadge

* KPICard

* Modal

* AIInsightCard

* ChartCard

* ChatInterface

* NotificationCenter

* Timeline

* Calendar

---

# 27. RESPONSIVE

L'application doit être responsive.

Priorité :

1. Desktop

2. Laptop

3. Tablet

---

# 28. PARCOURS DE DÉMONSTRATION

Le MVP doit permettre une démonstration fluide.

Parcours recommandé :

```text

Dashboard

   ↓

AI HR Command Center

   ↓

Alerte RH

   ↓

Absences & Congés

   ↓

Demande reçue par Email / WhatsApp

   ↓

Classification automatique par IA

   ↓

Validation de la demande

   ↓

AI HR Insights

   ↓

Recrutement

   ↓

Analyse IA d'un candidat

   ↓

Onboarding

   ↓

AI School Service Agent

   ↓

Demande d'un parent

   ↓

Classification automatique

   ↓

Réponse IA / transfert au bon service

   ↓

Réclamation

```

Ce parcours doit montrer clairement la valeur de l'automatisation.

---

# 29. PRIORITÉS

Si certaines fonctionnalités doivent être simplifiées pour respecter le périmètre MVP, donner la priorité à :

### PRIORITÉ 1

* Dashboard

* AI HR Command Center

* Collaborateurs

* Absences & Congés

* Événements RH

* AI HR Insights

* AI School Service Agent

* Emails intelligents

* Demandes & Réclamations

### PRIORITÉ 2

* Recruitment Manager

* Candidate Screening

* Interview Assistant

* Document Generator

* Onboarding

### PRIORITÉ 3

* Employee Assistant

* Administration

* Paramètres avancés

---

# 30. RÈGLE FINALE

Je veux un **MVP complet, cohérent, interactif et présentable devant un client**.

Ne crée pas seulement des écrans statiques.

Les données doivent être réalistes, les modules doivent être liés entre eux et les interactions doivent fonctionner.

Les fonctionnalités d'intelligence artificielle peuvent être simulées dans cette première version, mais elles doivent donner une représentation crédible de la future solution.

L'objectif principal est de montrer au LFILM :

**Comment une plateforme intelligente peut centraliser les données, automatiser les tâches répétitives, détecter les actions à effectuer, assister les équipes RH et améliorer le traitement des demandes provenant des emails, WhatsApp et autres canaux.**

Construire directement le MVP avec toutes les pages, la navigation, les composants réutilisables, les mock data et les interactions décrites ci-dessus.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5ab484e2-4d3a-4cc8-a338-7c906fae22bc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
