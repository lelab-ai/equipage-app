export interface StatusService {
  id: string;
  name: string;
  description: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
  uptime_percentage: number;
  avg_latency_ms: number;
  last_checked_at: string;
  order_index: number;
}

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  source: string;
  status: 'backlog' | 'pret' | 'en_cours' | 'termine' | 'rejete' | 'gele';
  priority_rank: number;
  score: number;
  work_in_progress: number;
  valeur: number;
  frequence: number;
  adequation: number;
  effort: number;
  malus_cout: number;
  created_at: string;
  updated_at: string;
}

export interface Decision {
  id: string;
  item_id: string | null;
  agent: string;
  action: 'PRIORITIZE' | 'DEFER' | 'REJECT' | 'FREEZE' | 'APPROVE';
  justification: string;
  score: number | null;
  source: string;
  regle_imperative: string | null;
  created_at: string;
}

export interface AgentRun {
  id: string;
  agent: string;
  action: string;
  model: string;
  provider: string;
  tokens_in: number;
  tokens_out: number;
  cost_eur: number;
  duration_ms: number;
  outcome: 'success' | 'failure' | 'escalated';
  error_message?: string;
  prompt_system?: string;
  prompt_user?: string;
  response_raw?: string;
  created_at: string;
}

export interface Approval {
  id: string;
  action_type: string;
  description: string;
  agent: string;
  mode: 'auto' | 'notify' | 'approve';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  justification?: string;
  expires_at: string;
  decided_at?: string;
  decided_by?: string;
  created_at: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  service_id: string;
  detected_at: string;
  mitigated_at?: string;
  resolved_at?: string;
  time_to_detect_seconds: number;
  time_to_resolve_seconds: number;
  postmortem?: string;
  is_regression: number;
  created_at: string;
}

export interface CostEntry {
  id: string;
  date: string;
  agent: string;
  provider: string;
  model: string;
  tokens_total: number;
  cost_eur: number;
}

export interface NarrativeEntry {
  id: string;
  date: string;
  title: string;
  delivered_summary: string;
  failures_summary: string;
  cost_eur: number;
  lessons_learned: string;
  author_mention: string;
  created_at: string;
}

export interface FailureEntry {
  id: string;
  date: string;
  titre: string;
  description: string;
  detecte_par: string;
  reparation: string;
  impact_cout: string;
  lecon: string;
}

export interface SystemMetrics {
  autonomy_rate: number;         // en %
  mttr_minutes: number;           // en minutes
  cost_per_incident_eur: number;  // en €
  cost_per_feature_eur: number;   // en €
  bad_fix_rate: number;           // en % (taux de régressions)
  total_cost_eur: number;
  budget_cap_eur: number;
  wip_current: number;
  wip_max: number;
  slo_availability: number;
  emergency_stop: boolean;
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  interval_seconds: number;
  timeout_ms: number;
  status: 'operational' | 'degraded' | 'down';
  last_latency_ms: number | null;
  last_checked_at: string | null;
  created_at: string;
}
