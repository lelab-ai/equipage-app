# Equipage — Page de Statut et Observabilité en Direct

[![Tests](https://github.com/lelab-ai/equipage-app/actions/workflows/test.yml/badge.svg)](https://github.com/lelab-ai/equipage-app/actions/workflows/test.yml)
[![CodeQL Security](https://github.com/lelab-ai/equipage-app/actions/workflows/codeql.yml/badge.svg)](https://github.com/lelab-ai/equipage-app/actions/workflows/codeql.yml)
[![Sondes SRE](https://github.com/lelab-ai/equipage-app/actions/workflows/health-probes.yml/badge.svg)](https://github.com/lelab-ai/equipage-app/actions/workflows/health-probes.yml)
[![Production](https://img.shields.io/badge/Production-equipage.lelab.ai-22c55e)](https://equipage.lelab.ai)

**Equipage** est une application web open-source de **page de statut temps réel et journal d'incidents**, déployée sur **Cloudflare Edge** avec stockage distribué **Cloudflare D1 (SQL)**.

Accessible publiquement sur **[https://equipage.lelab.ai](https://equipage.lelab.ai)**.

---

## 🎯 Fonctionnalités du Produit

1. **Surveillance des composants en direct** : État opérationnel, dégradé ou en panne des services critiques (API Edge, Base de données SQL D1, Réception des webhooks, Tableau de bord).
2. **Historique glissant de disponibilité (SLA 90 jours)** : Mesure continue du taux de disponibilité et calcul des percentiles de latence (P95).
3. **Journal des incidents et postmortems publics** : Chronologie transparente des perturbations, du diagnostic à la remédiation blameless.
4. **Sondes de santé automatisées** : Probes externes périodiques mesurant la latence réseau et alertant immédiatement en cas d'anomalie.
5. **Observabilité SRE intégrée** : Ingestion native d'alertes webhooks (Sentry, alertes personnalisées).

---

## 🏗️ Architecture Technique

- **Front-end** : React 18, TypeScript, Vite (interface ultra-rapide et responsive, thématisable en marque blanche).
- **Backend Edge** : Cloudflare Worker TypeScript (temps de démarrage < 5 ms, zéro serveur à gérer).
- **Base de données** : Cloudflare D1 (SQLite serverless distribué mondialement).
- **Intégrations & CI/CD** : GitHub Actions (tests unitaires, analyse de sécurité sémantique CodeQL, sondes de santé programmées, déploiement continu et rollback automatique).

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- npm

### Installation
```bash
git clone https://github.com/lelab-ai/equipage-app.git
cd equipage-app
npm install
```

### Lancement en local
```bash
npm run dev
```
L'application démarre sur `http://localhost:5173`.

### Exécuter les tests unitaires et d'intégration
```bash
npm test
```

### Vérification des types TypeScript
```bash
npm run check
```

### Compilation pour la production
```bash
npm run build
```

---

## 🤝 Contribuer & Soumettre des retours

- **Besoin d'une nouvelle fonctionnalité ?** Ouvrez un ticket via notre [formulaire de demande d'évolution](https://github.com/lelab-ai/equipage-app/issues/new?template=demande-evolution-po.yml).
- **Une panne ou un bug constaté ?** Signalez-le via notre [formulaire d'incident SRE](https://github.com/lelab-ai/equipage-app/issues/new?template=signalement-incident-sre.yml).
- **Discussions libres & idées** : Rendez-vous dans l'onglet [GitHub Discussions](https://github.com/lelab-ai/equipage-app/discussions).

---

## 📄 Licence
Ce projet est sous licence MIT.
