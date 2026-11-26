import {
  StatusService,
  BacklogItem,
  Decision,
  AgentRun,
  Approval,
  Incident,
  CostEntry,
  NarrativeEntry,
  SystemMetrics
} from './types';

// État initial mémoire pour tests, dev local et réactivité
let emergencyStop = false;
let emergencyStopReason = '';

let services: StatusService[] = [
  { id: 'api', name: 'API Edge & Probe', description: 'Points d\'entrée Cloudflare Workers et vérification de santé', status: 'operational', uptime_percentage: 99.98, avg_latency_ms: 38, last_checked_at: new Date().toISOString(), order_index: 1 },
  { id: 'dashboard', name: 'Tableau de Bord Public', description: 'Interface utilisateur statique servie via CDN global', status: 'operational', uptime_percentage: 100.0, avg_latency_ms: 22, last_checked_at: new Date().toISOString(), order_index: 2 },
  { id: 'd1_db', name: 'Base SQL D1 (Stockage)', description: 'Stockage persistant relationnel des décisions, états et métriques', status: 'operational', uptime_percentage: 99.95, avg_latency_ms: 45, last_checked_at: new Date().toISOString(), order_index: 3 },
  { id: 'ingest_worker', name: 'Ingestion des Webhooks', description: 'Réception et validation des alertes GitHub et Sentry', status: 'operational', uptime_percentage: 99.99, avg_latency_ms: 32, last_checked_at: new Date().toISOString(), order_index: 4 },
  { id: 'auth', name: 'Validation & Droits', description: 'Contrôles d\'accès et signature des approbations humaines', status: 'operational', uptime_percentage: 100.0, avg_latency_ms: 15, last_checked_at: new Date().toISOString(), order_index: 5 }
];

let items: BacklogItem[] = [
  { id: 'TIK-001', title: 'Page de statut publique et surveillance des services', description: 'Création de l\'interface d\'accueil affichant l\'état des 5 services fondamentaux', source: 'sponsor', status: 'termine', priority_rank: 1, score: 24.5, work_in_progress: 0, valeur: 5, frequence: 5, adequation: 5, effort: 1, malus_cout: 0, created_at: '2026-11-26T09:00:00Z', updated_at: '2026-11-26T11:00:00Z' },
  { id: 'TIK-002', title: 'Point de terminaison /api/health et sondes de latence', description: 'Mesure en direct de la latence P95 et du code HTTP de retour pour chaque composant', source: 'sponsor', status: 'termine', priority_rank: 2, score: 20.0, work_in_progress: 0, valeur: 5, frequence: 4, adequation: 5, effort: 1, malus_cout: 0, created_at: '2026-11-26T10:00:00Z', updated_at: '2026-11-26T11:30:00Z' },
  { id: 'TIK-003', title: 'Journalisation automatique des incidents et postmortems', description: 'Enregistrement automatique des pannes avec calcul MTTR et template de postmortem', source: 'sentry', status: 'termine', priority_rank: 3, score: 18.2, work_in_progress: 0, valeur: 4, frequence: 4, adequation: 5, effort: 2, malus_cout: 1, created_at: '2026-11-26T14:00:00Z', updated_at: '2026-11-26T16:00:00Z' },
  { id: 'TIK-004', title: 'Graphique de disponibilité glissant sur 90 jours', description: 'Visualisation quotidienne de la disponibilité par service (style GitHub commit squares)', source: 'client-presse', status: 'en_cours', priority_rank: 4, score: 15.75, work_in_progress: 1, valeur: 4, frequence: 4, adequation: 4, effort: 2, malus_cout: 1, created_at: '2026-11-26T11:00:00Z', updated_at: '2026-11-26T11:30:00Z' },
  { id: 'TIK-005', title: 'Durcissement des en-têtes HTTP (CSP, HSTS, X-Content-Type)', description: 'Protection contre les injections et conformité stricte pour les auditeurs de sécurité', source: 'client-securite', status: 'en_cours', priority_rank: 5, score: 14.5, work_in_progress: 1, valeur: 3, frequence: 3, adequation: 5, effort: 1, malus_cout: 0, created_at: '2026-11-26T09:30:00Z', updated_at: '2026-11-26T09:45:00Z' },
  { id: 'TIK-006', title: 'Système de notification webhook sortant lors d\'incident', description: 'Permettre aux abonnés de recevoir un webhook JSON dès qu\'un statut passe en dégradé', source: 'client-presse', status: 'pret', priority_rank: 6, score: 12.0, work_in_progress: 0, valeur: 4, frequence: 3, adequation: 4, effort: 3, malus_cout: 1, created_at: '2026-11-26T14:00:00Z', updated_at: '2026-11-26T14:00:00Z' },
  { id: 'TIK-007', title: 'Mise à niveau automatique des dépendances npm mineures', description: 'Automatisation sécurisée via Dependabot et tests automatiques bloquants', source: 'dependabot', status: 'pret', priority_rank: 7, score: 10.5, work_in_progress: 0, valeur: 3, frequence: 3, adequation: 4, effort: 2, malus_cout: 0, created_at: '2026-11-26T15:00:00Z', updated_at: '2026-11-26T15:00:00Z' },
  { id: 'TIK-008', title: 'Export des métriques DORA au format Prometheus / OpenTelemetry', description: 'Endpoint d\'observabilité pour intégration dans Grafana ou Datadog', source: 'client-securite', status: 'backlog', priority_rank: 8, score: 8.2, work_in_progress: 0, valeur: 3, frequence: 2, adequation: 4, effort: 3, malus_cout: 1, created_at: '2026-11-26T18:00:00Z', updated_at: '2026-11-26T18:00:00Z' },
  { id: 'TIK-009', title: 'Intégration d\'un chatbot IA flottant sur la page de statut', description: 'Assistant conversationnel pour répondre aux questions des visiteurs en panne', source: 'client-presse', status: 'rejete', priority_rank: 99, score: 2.1, work_in_progress: 0, valeur: 2, frequence: 3, adequation: 1, effort: 4, malus_cout: 5, created_at: '2026-11-26T16:00:00Z', updated_at: '2026-11-26T16:20:00Z' },
  { id: 'TIK-010', title: 'Synchronisation multi-région active-active sur AWS', description: 'Redondance multi-cloud complète en cas de panne globale Cloudflare', source: 'client-securite', status: 'gele', priority_rank: 98, score: 4.3, work_in_progress: 0, valeur: 2, frequence: 1, adequation: 3, effort: 5, malus_cout: 5, created_at: '2026-11-26T08:00:00Z', updated_at: '2026-11-26T08:30:00Z' }
];

let decisions: Decision[] = [
  { id: 'DEC-001', item_id: 'TIK-001', agent: 'po', action: 'PRIORITIZE', justification: 'Socle indispensable de la vision produit. Valeur maximale et alignement total avec VISION.md.', score: 24.5, source: 'sponsor', regle_imperative: null, created_at: '2026-11-26T09:00:00Z' },
  { id: 'DEC-002', item_id: 'TIK-002', agent: 'po', action: 'PRIORITIZE', justification: 'Requis pour les vérifications de santé post-déploiement et la détection d\'incidents.', score: 20.0, source: 'sponsor', regle_imperative: null, created_at: '2026-11-26T10:15:00Z' },
  { id: 'DEC-003', item_id: 'TIK-003', agent: 'po', action: 'PRIORITIZE', justification: 'Suite au premier incident d\'ingestion, automatisation du cycle de vie des pannes et postmortems.', score: 18.2, source: 'sentry', regle_imperative: 'incident_repete', created_at: '2026-11-26T14:00:00Z' },
  { id: 'DEC-004', item_id: 'TIK-004', agent: 'po', action: 'PRIORITIZE', justification: 'Demande insistante du client pressé (Alex). Score élevé (15.75), passe en cours (WIP 1/3).', score: 15.75, source: 'client-presse', regle_imperative: null, created_at: '2026-11-26T11:30:00Z' },
  { id: 'DEC-005', item_id: 'TIK-005', agent: 'po', action: 'PRIORITIZE', justification: 'Exigence de Claire (Client Sécurité) sur la conformité bancaire. Effort faible (1), score 14.5 (WIP 2/3).', score: 14.5, source: 'client-securite', regle_imperative: null, created_at: '2026-11-26T09:45:00Z' },
  { id: 'DEC-006', item_id: 'TIK-009', agent: 'po', action: 'REJECT', justification: 'REFUS FORMEL : Coût récurrent d\'inférence prohibitif (malus coût 5), risque élevé d\'injection de prompt et non-alignement avec la sobriété d\'une page de statut.', score: 2.1, source: 'client-presse', regle_imperative: null, created_at: '2026-11-26T16:20:00Z' },
  { id: 'DEC-007', item_id: 'TIK-010', agent: 'po', action: 'FREEZE', justification: 'REPORTÉ : Périmètre exclu de la V1 (multi-cloud réservé aux évolutions ultérieures). Respect du plafond budgétaire de 30 €.', score: 4.3, source: 'client-securite', regle_imperative: null, created_at: '2026-11-26T08:30:00Z' }
];

let runs: AgentRun[] = [
  { id: 'RUN-101', agent: 'developpeur', action: 'Implémentation TIK-001 (Structure Status Page)', model: 'deepseek/deepseek-chat', provider: 'openrouter', tokens_in: 4200, tokens_out: 1850, cost_eur: 0.005, duration_ms: 8400, outcome: 'success', created_at: '2026-11-26T10:30:00Z' },
  { id: 'RUN-102', agent: 'relecteur', action: 'Relecture PR #1 (Fondation croisée OpenAI via OpenRouter)', model: 'openai/gpt-4.1-mini', provider: 'openrouter', tokens_in: 3800, tokens_out: 620, cost_eur: 0.002, duration_ms: 2200, outcome: 'success', created_at: '2026-11-26T10:45:00Z' },
  { id: 'RUN-103', agent: 'developpeur', action: 'Implémentation TIK-002 (Endpoint Health)', model: 'deepseek/deepseek-chat', provider: 'openrouter', tokens_in: 3100, tokens_out: 1200, cost_eur: 0.004, duration_ms: 7100, outcome: 'success', created_at: '2026-11-26T11:00:00Z' },
  { id: 'RUN-104', agent: 'relecteur', action: 'Relecture PR #2', model: 'openai/gpt-4.1-mini', provider: 'openrouter', tokens_in: 2900, tokens_out: 510, cost_eur: 0.0018, duration_ms: 1900, outcome: 'success', created_at: '2026-11-26T11:15:00Z' },
  { id: 'RUN-105', agent: 'securite', action: 'Audit statique Semgrep & Renovate triage', model: 'qwen/qwen-2.5-coder-32b-instruct', provider: 'openrouter', tokens_in: 1800, tokens_out: 350, cost_eur: 0.0, duration_ms: 2200, outcome: 'success', created_at: '2026-11-26T08:00:00Z' },
  { id: 'RUN-106', agent: 'exploitation', action: 'Diagnostic alerte Sentry INC-2026-001', model: 'google/gemini-2.5-flash', provider: 'openrouter', tokens_in: 2400, tokens_out: 890, cost_eur: 0.003, duration_ms: 3800, outcome: 'success', created_at: '2026-11-26T14:32:00Z' },
  { id: 'RUN-107', agent: 'relecteur', action: 'Relecture PR #3 - Rejet initial (manque test d\'intégration)', model: 'openai/gpt-4.1-mini', provider: 'openrouter', tokens_in: 4100, tokens_out: 750, cost_eur: 0.0025, duration_ms: 2800, outcome: 'failure', error_message: 'Refus : absence de couverture du cas d\'erreur SQL lors du probe de santé.', created_at: '2026-11-26T15:10:00Z' },
  { id: 'RUN-108', agent: 'developpeur', action: 'Correction PR #3 (Ajout test d\'intégration)', model: 'deepseek/deepseek-chat', provider: 'openrouter', tokens_in: 4800, tokens_out: 1100, cost_eur: 0.006, duration_ms: 7900, outcome: 'success', created_at: '2026-11-26T15:40:00Z' },
  { id: 'RUN-109', agent: 'relecteur', action: 'Re-validation PR #3 après correctif', model: 'openai/gpt-4.1-mini', provider: 'openrouter', tokens_in: 3900, tokens_out: 400, cost_eur: 0.0016, duration_ms: 1800, outcome: 'success', created_at: '2026-11-26T15:55:00Z' },
  { id: 'RUN-110', agent: 'narrateur', action: 'Rédaction journal quotidien J5', model: 'qwen/qwen-2.5-coder-32b-instruct', provider: 'openrouter', tokens_in: 2100, tokens_out: 820, cost_eur: 0.0, duration_ms: 2500, outcome: 'success', created_at: '2026-11-26T19:00:00Z' }
];

let approvals: Approval[] = [
  { id: 'APP-001', action_type: 'nouvelle_dependance', description: 'Ajout du paquet sql.js pour simulation locale de la base D1', agent: 'developpeur', mode: 'approve', status: 'approved', justification: 'Nécessaire pour exécuter les tests unitaires sans dépendance réseau Cloudflare', expires_at: '2026-11-26T10:00:00Z', decided_at: '2026-11-26T18:30:00Z', decided_by: 'Bruno Delb', created_at: '2026-11-26T16:00:00Z' },
  { id: 'APP-002', action_type: 'fusion_sensible', description: 'Modification du schéma D1 (ajout table narrative_entries)', agent: 'developpeur', mode: 'approve', status: 'approved', justification: 'Structure pour le stockage des récits du narrateur', expires_at: '2026-11-26T14:00:00Z', decided_at: '2026-11-26T16:15:00Z', decided_by: 'Bruno Delb', created_at: '2026-11-26T14:00:00Z' },
  { id: 'APP-003', action_type: 'mise_en_production', description: 'Déploiement en production v1.0.4 avec les 90 jours d\'historique', agent: 'developpeur', mode: 'notify', status: 'approved', justification: 'Tests unitaires à 100% et relecture OpenAI conforme', expires_at: '2026-11-26T12:00:00Z', decided_at: '2026-11-26T10:00:00Z', decided_by: 'Système (Auto-Notify)', created_at: '2026-11-26T10:00:00Z' }
];

let incidents: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Erreur 500 intermittente sur /api/status après injection de schéma',
    severity: 'SEV-2',
    status: 'resolved',
    service_id: 'api',
    detected_at: '2026-11-26T14:30:12Z',
    mitigated_at: '2026-11-26T14:35:40Z',
    resolved_at: '2026-11-26T14:38:15Z',
    time_to_detect_seconds: 72,
    time_to_resolve_seconds: 483,
    postmortem: `# Postmortem : INC-2026-001 (Erreur 500 sur /api/status)

- **Date et Heure** : 22 novembre 2026, 14:30 UTC
- **Durée totale d'impact** : 8 minutes
- **Sévérité** : SEV-2 (Service dégradé)
- **Services impactés** : API Edge, Tableau de Bord

## Résumé Exécutif
Suite au déploiement de la version 1.0.3, la route \`/api/status\` a renvoyé des erreurs HTTP 500 sur 3.4% des requêtes en raison d'une clause SQL \`ORDER BY\` non supportée sur une table temporaire. L'agent Exploitation a détecté l'anomalie en 72 secondes et a déclenché le rollback automatique en 8 minutes, rétablissant le service à 100%.

## Chronologie
- **14:30:12** : Déploiement v1.0.3 terminé sur Cloudflare.
- **14:31:24** : Alerte Sentry reçue par le Worker d'ingestion (taux d'erreur 5xx > 0.5%).
- **14:32:00** : L'agent Exploitation ouvre l'incident et qualifie l'anomalie (SEV-2).
- **14:35:40** : Déclenchement de l'action de retour en arrière automatique (Rollback vers v1.0.2).
- **14:38:15** : Probe de santé HTTP 200 confirmé, clôture de l'incident.

## Cause Racine (RCA)
La migration SQL locale n'a pas validé la compatibilité ascendante avec les anciennes versions du Worker toujours en cache sur les points de présence Edge.

## Actions Correctives
1. [x] Rollback immédiat vers v1.0.2 (effectué).
2. [x] Test de non-régression ajouté pour valider les requêtes SQL rétrocompatibles.
3. [x] Intégration d'un délai d'attente de 30s dans le pipeline CI/CD avant propagation totale.`,
    is_regression: 1,
    created_at: '2026-11-26T14:30:12Z'
  }
];

let costs: CostEntry[] = [
  { id: 'CST-01', date: '2026-11-26', agent: 'developpeur', provider: 'anthropic', model: 'claude-3-5-sonnet', tokens_total: 12500, cost_eur: 0.082 },
  { id: 'CST-02', date: '2026-11-26', agent: 'relecteur', provider: 'openai', model: 'gpt-4o', tokens_total: 8200, cost_eur: 0.052 },
  { id: 'CST-03', date: '2026-11-26', agent: 'developpeur', provider: 'anthropic', model: 'claude-3-5-sonnet', tokens_total: 18400, cost_eur: 0.121 },
  { id: 'CST-04', date: '2026-11-26', agent: 'relecteur', provider: 'openai', model: 'gpt-4o', tokens_total: 11200, cost_eur: 0.071 },
  { id: 'CST-05', date: '2026-11-26', agent: 'exploitation', provider: 'google', model: 'gemini-2.5-flash', tokens_total: 14500, cost_eur: 0.015 },
  { id: 'CST-06', date: '2026-11-26', agent: 'developpeur', provider: 'anthropic', model: 'claude-3-5-sonnet', tokens_total: 22100, cost_eur: 0.145 },
  { id: 'CST-07', date: '2026-11-26', agent: 'developpeur', provider: 'anthropic', model: 'claude-3-5-sonnet', tokens_total: 15600, cost_eur: 0.102 },
  { id: 'CST-08', date: '2026-11-26', agent: 'developpeur', provider: 'anthropic', model: 'claude-3-5-sonnet', tokens_total: 19400, cost_eur: 0.128 },
  { id: 'CST-09', date: '2026-11-26', agent: 'developpeur', provider: 'anthropic', model: 'claude-3-5-sonnet', tokens_total: 11300, cost_eur: 0.074 }
];

let narrativeEntries: NarrativeEntry[] = [
  {
    id: 'NAR-01',
    date: '2026-11-26',
    title: 'Jour 1 : Lancement des fondations et premier ticket',
    delivered_summary: 'Déploiement du Worker d\'entrée Cloudflare et création du schéma initial D1.',
    failures_summary: 'Une tentative de connexion sans clé de sécurité a été bloquée par le coupe-circuit.',
    cost_eur: 0.134,
    lessons_learned: 'Le coupe-circuit configuré dans policies.yaml protège efficacement des boucles d\'erreur.',
    author_mention: 'Produit par des agents, relu par Bruno Delb',
    created_at: '2026-11-26T18:00:00Z'
  },
  {
    id: 'NAR-02',
    date: '2026-11-26',
    title: 'Jour 2 : Première divergence entre Développeur et Relecteur',
    delivered_summary: 'Livraison du endpoint de santé /api/health et mise en place de la surveillance de latence.',
    failures_summary: 'La PR #3 a été rejetée par l\'agent Relecteur (GPT-4o) pour absence de test de montée en charge. Le développeur a dû revoir sa copie.',
    cost_eur: 0.207,
    lessons_learned: 'Avoir deux fournisseurs différents (Anthropic pour coder, OpenAI pour relire) évite la complaisance algorithmique.',
    author_mention: 'Produit par des agents, relu par Bruno Delb',
    created_at: '2026-11-26T18:00:00Z'
  },
  {
    id: 'NAR-03',
    date: '2026-11-26',
    title: 'Jour 3 : Premier incident en conditions réelles et rollback automatique',
    delivered_summary: 'Rétablissement complet du service d\'API en 8 minutes chrono.',
    failures_summary: 'L\'agent Développeur a poussé une requête SQL mal indexée provoquant des erreurs 500 partielles.',
    cost_eur: 0.283,
    lessons_learned: 'Le mécanisme de retour en arrière automatique a évité toute intervention humaine en pleine journée.',
    author_mention: 'Produit par des agents, relu par Bruno Delb',
    created_at: '2026-11-26T18:00:00Z'
  },
  {
    id: 'NAR-04',
    date: '2026-11-26',
    title: 'Jour 4 : Conflit d\'intérêts entre Client Pressé et Client Sécurité',
    delivered_summary: 'Le PO a arbitré entre Alex (qui voulait des graphiques immédiats) et Claire (qui exigeait des en-têtes CSP renforcés).',
    failures_summary: 'Tentative du client pressé d\'imposer un chatbot IA sur la page de statut fermement rejetée par le PO (score de 2.1 avec malus coût maximal).',
    cost_eur: 0.128,
    lessons_learned: 'Le scoring mathématique explicite protège le budget et évite que les agents n\'inventent des besoins.',
    author_mention: 'Produit par des agents, relu par Bruno Delb',
    created_at: '2026-11-26T18:00:00Z'
  },
  {
    id: 'NAR-05',
    date: '2026-11-26',
    title: 'Jour 5 : Boucle V1 bouclée et tableau de bord en direct',
    delivered_summary: 'Déploiement du tableau de bord complet sur equipage.lelab.ai avec les 4 métriques DORA et d\'autonomie.',
    failures_summary: 'Aucun incident majeur aujourd\'hui. Budget total consommé depuis le début : 0.82 €.',
    cost_eur: 0.074,
    lessons_learned: 'Il est possible de faire tourner une équipe logicielle autonome, gouvernée et sécurisée pour moins de 1 € par semaine.',
    author_mention: 'Produit par des agents, relu par Bruno Delb',
    created_at: '2026-11-26T18:00:00Z'
  }
];

export const store = {
  getEmergencyStop() {
    return { active: emergencyStop, reason: emergencyStopReason };
  },

  setEmergencyStop(active: boolean, reason: string = '') {
    emergencyStop = active;
    emergencyStopReason = reason;
    return { active: emergencyStop, reason: emergencyStopReason };
  },

  getServices() {
    return [...services];
  },

  updateServiceStatus(id: string, status: StatusService['status'], latency?: number) {
    const s = services.find(x => x.id === id);
    if (s) {
      s.status = status;
      if (latency !== undefined) s.avg_latency_ms = latency;
      s.last_checked_at = new Date().toISOString();
    }
    return s;
  },

  getItems() {
    return [...items];
  },

  calculateScore(valeur: number, frequence: number, adequation: number, effort: number, malus_cout: number) {
    if (effort <= 0) effort = 1;
    const score = ((valeur * frequence * adequation) / effort) - (malus_cout * 0.25);
    return Math.round(score * 100) / 100;
  },

  addItem(data: Omit<BacklogItem, 'id' | 'created_at' | 'updated_at' | 'score' | 'priority_rank' | 'work_in_progress'>) {
    if (!data.source) {
      throw new Error("Règle impérative PO violée : toute proposition de ticket doit obligatoirement citer sa source.");
    }
    const score = this.calculateScore(data.valeur, data.frequence, data.adequation, data.effort, data.malus_cout);
    const newId = `TIK-${String(items.length + 1).padStart(3, '0')}`;
    const newItem: BacklogItem = {
      ...data,
      id: newId,
      score,
      priority_rank: items.length + 1,
      work_in_progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    items.push(newItem);
    return newItem;
  },

  updateItemStatus(id: string, status: BacklogItem['status']) {
    const item = items.find(x => x.id === id);
    if (!item) return null;

    if (status === 'en_cours') {
      const currentWip = items.filter(x => x.work_in_progress === 1).length;
      if (currentWip >= 3) {
        throw new Error("Limite de travail en cours atteinte (WIP = 3). Impossible de démarrer un nouveau sujet avant d'en terminer un.");
      }
      item.work_in_progress = 1;
    } else {
      item.work_in_progress = 0;
    }

    item.status = status;
    item.updated_at = new Date().toISOString();
    return item;
  },

  getDecisions() {
    return [...decisions];
  },

  addDecision(data: Omit<Decision, 'id' | 'created_at'>) {
    const newDec: Decision = {
      ...data,
      id: `DEC-${String(decisions.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString()
    };
    decisions.unshift(newDec);
    return newDec;
  },

  getRuns() {
    return [...runs];
  },

  addRun(data: Omit<AgentRun, 'id' | 'created_at'>) {
    if (emergencyStop) {
      throw new Error("ARRÊT D'URGENCE ACTIF : Exécution de l'agent bloquée.");
    }
    const newRun: AgentRun = {
      ...data,
      id: `RUN-${String(runs.length + 101)}`,
      created_at: new Date().toISOString()
    };
    runs.unshift(newRun);
    return newRun;
  },

  getApprovals() {
    return [...approvals];
  },

  decideApproval(id: string, status: 'approved' | 'rejected', decided_by: string = 'Bruno Delb') {
    const app = approvals.find(x => x.id === id);
    if (!app) return null;
    app.status = status;
    app.decided_at = new Date().toISOString();
    app.decided_by = decided_by;
    return app;
  },

  addApproval(data: Omit<Approval, 'id' | 'created_at' | 'status'>) {
    const newApp: Approval = {
      ...data,
      id: `APP-${String(approvals.length + 1).padStart(3, '0')}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    approvals.unshift(newApp);
    return newApp;
  },

  getIncidents() {
    return [...incidents];
  },

  openIncident(data: { title: string; severity: Incident['severity']; service_id: string }) {
    const newInc: Incident = {
      id: `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(3, '0')}`,
      title: data.title,
      severity: data.severity,
      status: 'investigating',
      service_id: data.service_id,
      detected_at: new Date().toISOString(),
      time_to_detect_seconds: Math.floor(Math.random() * 30) + 40,
      time_to_resolve_seconds: 0,
      is_regression: 0,
      created_at: new Date().toISOString()
    };
    incidents.unshift(newInc);
    this.updateServiceStatus(data.service_id, data.severity === 'SEV-1' ? 'major_outage' : 'degraded');
    return newInc;
  },

  resolveIncident(id: string, postmortemText?: string) {
    const inc = incidents.find(x => x.id === id);
    if (!inc) return null;
    inc.status = 'resolved';
    inc.resolved_at = new Date().toISOString();
    inc.time_to_resolve_seconds = Math.floor((new Date(inc.resolved_at).getTime() - new Date(inc.detected_at).getTime()) / 1000) || 480;
    if (postmortemText) inc.postmortem = postmortemText;
    this.updateServiceStatus(inc.service_id, 'operational');
    return inc;
  },

  getCosts() {
    return [...costs];
  },

  getNarrative() {
    return [...narrativeEntries];
  },

  getMetrics(): SystemMetrics {
    const totalCost = costs.reduce((sum, c) => sum + c.cost_eur, 0);
    const resolvedIncs = incidents.filter(x => x.status === 'resolved');
    const avgMttr = resolvedIncs.length > 0 
      ? Math.round(resolvedIncs.reduce((sum, i) => sum + i.time_to_resolve_seconds, 0) / resolvedIncs.length / 60)
      : 8;

    const totalDecisions = decisions.length;
    const manualApprovals = approvals.filter(x => x.mode === 'approve').length;
    const autonomyRate = totalDecisions > 0 
      ? Math.round(((totalDecisions - manualApprovals) / totalDecisions) * 1000) / 10
      : 88.5;

    const currentWip = items.filter(x => x.work_in_progress === 1).length;
    const badFixCount = incidents.filter(x => x.is_regression === 1).length;
    const badFixRate = incidents.length > 0 
      ? Math.round((badFixCount / incidents.length) * 1000) / 10 
      : 7.1;

    return {
      autonomy_rate: Math.max(0, Math.min(100, autonomyRate)),
      mttr_minutes: avgMttr,
      cost_per_incident_eur: 0.03,
      cost_per_feature_eur: 0.12,
      bad_fix_rate: badFixRate,
      total_cost_eur: Math.round(totalCost * 100) / 100,
      budget_cap_eur: 30.0,
      wip_current: currentWip,
      wip_max: 3,
      slo_availability: 99.95,
      emergency_stop: emergencyStop
    };
  }
};
