import React, { useState, useEffect } from 'react';
import { ProductHeader } from './components/ProductHeader';
import { CockpitHeader } from './components/CockpitHeader';
import { MetricsBanner } from './components/MetricsBanner';
import { StatusPageTab } from './components/StatusPageTab';
import { BacklogTab } from './components/BacklogTab';
import { AgentRunsTab } from './components/AgentRunsTab';
import { IncidentsTab } from './components/IncidentsTab';
import { FailuresTab } from './components/FailuresTab';
import { GovernanceTab } from './components/GovernanceTab';
import { NarratorTab } from './components/NarratorTab';
import { SimulatorTab } from './components/SimulatorTab';
import { CaseStudyTab } from './components/CaseStudyTab';
import { LivePipelineBanner } from './components/LivePipelineBanner';
import { ClientBriefModal } from './components/ClientBriefModal';

import { 
  StatusService, 
  BacklogItem, 
  Decision, 
  AgentRun, 
  Approval, 
  Incident, 
  NarrativeEntry, 
  FailureEntry,
  SystemMetrics,
  Monitor
} from '../functions/types';

type Route = 'product' | 'cockpit';
type CockpitTab = 'runs' | 'backlog' | 'incidents' | 'failures' | 'governance' | 'narrator' | 'simulator' | 'case-study';

export const App: React.FC = () => {
  // Navigation découplée : '/' (Application produit) vs '/cockpit' (Cockpit d'ingénierie)
  const [currentRoute, setCurrentRoute] = useState<Route>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/cockpit')) {
      return 'cockpit';
    }
    return 'product';
  });

  const [cockpitTab, setCockpitTab] = useState<CockpitTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as CockpitTab;
      if (['runs', 'backlog', 'incidents', 'failures', 'governance', 'narrator', 'simulator', 'case-study'].includes(tab)) {
        return tab;
      }
    }
    return 'runs';
  });

  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [services, setServices] = useState<StatusService[]>([]);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [items, setItems] = useState<BacklogItem[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [narrative, setNarrative] = useState<NarrativeEntry[]>([]);
  const [failures, setFailures] = useState<FailureEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCycleRunning, setIsCycleRunning] = useState<boolean>(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState<boolean>(false);

  // Synchronisation de l'URL via pushState sans rechargement de page
  const navigateTo = (route: Route, tab?: CockpitTab) => {
    setCurrentRoute(route);
    if (tab) setCockpitTab(tab);
    if (typeof window !== 'undefined') {
      const targetUrl = route === 'cockpit' ? (tab ? `/cockpit?tab=${tab}` : '/cockpit') : '/';
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ route, tab }, '', targetUrl);
      }
    }
  };

  // Support des boutons Précédent / Suivant du navigateur
  useEffect(() => {
    const handlePopState = () => {
      const isCockpit = window.location.pathname.startsWith('/cockpit');
      setCurrentRoute(isCockpit ? 'cockpit' : 'product');
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as CockpitTab | null;
      if (tab && ['runs', 'backlog', 'incidents', 'failures', 'governance', 'narrator', 'simulator', 'case-study'].includes(tab)) {
        setCockpitTab(tab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Chargement direct depuis la base Cloudflare D1 SQL (Zéro mock)
  const refreshData = async () => {
    try {
      setLoadError(null);
      const [mRes, sRes, iRes, dRes, rRes, aRes, incRes, nRes, fRes, monRes] = await Promise.all([
        fetch('/api/metrics').then(r => r.json()),
        fetch('/api/status').then(r => r.json()),
        fetch('/api/items').then(r => r.json()),
        fetch('/api/decisions').then(r => r.json()),
        fetch('/api/runs').then(r => r.json()),
        fetch('/api/approvals').then(r => r.json()),
        fetch('/api/incidents').then(r => r.json()),
        fetch('/api/narrator').then(r => r.json()),
        fetch('/api/failures').then(r => r.json()),
        fetch('/api/monitors').then(r => r.json()).catch(() => [])
      ]);

      setMetrics(mRes);
      setServices(sRes?.services || []);
      setItems(iRes || []);
      setDecisions(dRes || []);
      setRuns(rRes || []);
      setApprovals(aRes || []);
      setIncidents(incRes || []);
      setNarrative(nRes || []);
      setFailures(fRes || []);
      setMonitors(Array.isArray(monRes) ? monRes : []);
    } catch (err: any) {
      console.error('Erreur de chargement des données SQL D1:', err);
      setLoadError("Impossible de charger les données en direct depuis Cloudflare D1.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMonitor = async (name: string, url: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/monitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url })
      });
      const data = await res.json() as any;
      if (!res.ok) {
        return { success: false, error: data.error || 'Erreur de validation' };
      }
      setMonitors(prev => [data, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur réseau' };
    }
  };

  useEffect(() => {
    refreshData();
    // Rafraîchissement automatique toutes les 15 secondes pour les sondes en direct
    const interval = setInterval(refreshData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleEmergencyStop = async () => {
    const current = metrics?.emergency_stop || false;
    const nextState = !current;
    try {
      await fetch('/api/emergency-stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: nextState, reason: nextState ? 'Action manuelle depuis le cockpit' : '' })
      });
      await refreshData();
    } catch (err) {
      console.error('Erreur lors du basculement d\'arrêt d\'urgence:', err);
    }
  };

  const handleAddNewTicket = async (data: any) => {
    try {
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      await refreshData();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du ticket en base D1:', err);
    }
  };

  const handleDecideApproval = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/approvals/${id}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, decided_by: 'Bruno Delb' })
      });
      await refreshData();
    } catch (err) {
      console.error('Erreur lors de la décision d\'approbation:', err);
    }
  };

  const handleSimulate = async (scenario: string) => {
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      const data = await res.json();
      await refreshData();
      return data;
    } catch (err) {
      console.error('Erreur d\'exécution du scénario sur D1:', err);
      return null;
    }
  };

  const handleRunFullCycle = async () => {
    setIsCycleRunning(true);
    try {
      // 1. Scoring PO (Gemini) sur la demande d'Alex
      await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: 'client_presse_request' })
      });
      // 2. Implémentation TDD par l'agent Développeur (DeepSeek)
      await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: 'developer_run' })
      });
      // 3. Audit croisé par l'agent Relecteur (OpenAI)
      await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: 'reviewer_run' })
      });
      await refreshData();
      navigateTo('cockpit', 'runs');
    } catch (err) {
      console.error('Erreur lors du cycle complet:', err);
    } finally {
      setIsCycleRunning(false);
    }
  };

  const handleResetProject = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir réinitialiser le projet au Jour 0 ? Tout l'historique sera remis à l'état de lancement initial.")) {
      return;
    }
    try {
      await fetch('/api/reset', { method: 'POST' });
      await refreshData();
      navigateTo('product');
    } catch (err) {
      console.error('Erreur lors de la réinitialisation:', err);
    }
  };

  const isHealthy = !incidents.some(i => i.status !== 'resolved') && services.every(s => s.status === 'operational');

  // =========================================================================
  // VUE 1 : L'APPLICATION PRODUIT PURE ('/')
  // =========================================================================
  if (currentRoute === 'product') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* En-tête produit avec badge discret vers le cockpit */}
        <ProductHeader 
          isHealthy={isHealthy}
          onGoToCockpit={() => navigateTo('cockpit', 'runs')}
          onRefresh={refreshData}
        />

        <main className="container" style={{ flex: 1, paddingBottom: '3rem', paddingTop: '1.5rem' }}>
          
          {loadError && (
            <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>⚠️ {loadError}</span>
              <button className="btn btn-secondary" onClick={refreshData}>Réessayer</button>
            </div>
          )}

          {/* Affichage exclusif de l'application produit SaaS */}
          <StatusPageTab 
            services={services} 
            incidents={incidents} 
            monitors={monitors}
            onAddMonitor={handleAddMonitor}
            onRefresh={refreshData} 
            onInspectCockpit={() => navigateTo('cockpit', 'runs')}
          />

        </main>

        {/* Pied de page de l'application produit */}
        <footer style={{ borderTop: '1px solid #1e293b', background: '#090d16', padding: '1.5rem 0', fontSize: '0.8rem', color: '#64748b' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <strong>Equipage</strong> — Plateforme SaaS de surveillance et statut de service en direct.
              <br />
              Hébergée sur <a href="https://equipage.lelab.ai" style={{ color: '#38bdf8', textDecoration: 'none' }}>equipage.lelab.ai</a>.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a 
                href="https://github.com/lelab-ai/equipage-app" 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: '#94a3b8', textDecoration: 'none' }}
              >
                Code source public (GitHub) ↗
              </a>
              <button 
                onClick={() => navigateTo('cockpit', 'runs')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
              >
                Explorer le cockpit de l'équipage ➔
              </button>
            </div>
          </div>
        </footer>

        {/* Modal du cahier des charges client si déclenché */}
        <ClientBriefModal 
          isOpen={isBriefModalOpen} 
          onClose={() => setIsBriefModalOpen(false)} 
        />

      </div>
    );
  }

  // =========================================================================
  // VUE 2 : LE COCKPIT DE L'ÉQUIPAGE ('/cockpit')
  // =========================================================================
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* En-tête observatoire du cockpit avec lien de retour produit */}
      <CockpitHeader 
        metrics={metrics} 
        onToggleEmergencyStop={handleToggleEmergencyStop} 
        onBackToProduct={() => navigateTo('product')}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '3rem', paddingTop: '1.5rem' }}>
        
        {loadError && (
          <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {loadError}</span>
            <button className="btn btn-secondary" onClick={refreshData}>Réessayer</button>
          </div>
        )}

        {/* Les 4 métriques DORA et d'autonomie */}
        <MetricsBanner metrics={metrics} />

        {/* Bannière du pipeline en direct et déclencheur de cycle */}
        <LivePipelineBanner 
          onTriggerNextStep={handleRunFullCycle} 
          isRunning={isCycleRunning} 
          onOpenBrief={() => setIsBriefModalOpen(true)}
        />

        {/* Navigation des onglets du cockpit */}
        <div className="tabs-nav" style={{ marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
          <button 
            className={`tab-btn ${cockpitTab === 'runs' ? 'active' : ''}`}
            onClick={() => navigateTo('cockpit', 'runs')}
          >
            🤖 Boucle de dev et relecture
          </button>

          <button 
            className={`tab-btn ${cockpitTab === 'backlog' ? 'active' : ''}`}
            onClick={() => navigateTo('cockpit', 'backlog')}
          >
            📋 Backlog et décisions du PO
          </button>

          <button 
            className={`tab-btn ${cockpitTab === 'incidents' ? 'active' : ''}`}
            onClick={() => navigateTo('cockpit', 'incidents')}
          >
            ⚡ Incidents et exploitation SRE
          </button>

          <button 
            className={`tab-btn ${cockpitTab === 'failures' ? 'active' : ''}`}
            onClick={() => navigateTo('cockpit', 'failures')}
          >
            🎯 Ce que les agents ont raté
          </button>

          <button 
            className={`tab-btn ${cockpitTab === 'governance' ? 'active' : ''}`}
            onClick={() => navigateTo('cockpit', 'governance')}
          >
            ⚖️ Gouvernance et approbations
          </button>

          <button 
            className={`tab-btn ${cockpitTab === 'narrator' ? 'active' : ''}`}
            onClick={() => navigateTo('cockpit', 'narrator')}
          >
            📖 Journal du narrateur
          </button>

          <button 
            className={`tab-btn ${cockpitTab === 'simulator' ? 'active' : ''}`}
            onClick={() => navigateTo('cockpit', 'simulator')}
          >
            🚀 Simulateur interactif
          </button>

          <button 
            className={`tab-btn ${cockpitTab === 'case-study' ? 'active' : ''}`}
            onClick={() => navigateTo('cockpit', 'case-study')}
          >
            📑 Étude de cas V1
          </button>
        </div>

        {/* Contenu de l'onglet actif du cockpit */}
        {cockpitTab === 'runs' && (
          <AgentRunsTab runs={runs} />
        )}

        {cockpitTab === 'backlog' && (
          <BacklogTab 
            items={items} 
            decisions={decisions} 
            onAddNewTicket={handleAddNewTicket} 
            onOpenBrief={() => setIsBriefModalOpen(true)}
          />
        )}

        {cockpitTab === 'incidents' && (
          <IncidentsTab 
            incidents={incidents} 
            onTriggerIncidentSimulation={() => handleSimulate('sentry_alert')} 
            onTriggerRollback={() => handleSimulate('auto_rollback')} 
          />
        )}

        {cockpitTab === 'failures' && (
          <FailuresTab failures={failures} />
        )}

        {cockpitTab === 'governance' && (
          <GovernanceTab 
            approvals={approvals} 
            emergencyStop={metrics?.emergency_stop || false} 
            onToggleEmergencyStop={handleToggleEmergencyStop} 
            onDecideApproval={handleDecideApproval} 
            onResetProject={handleResetProject} 
          />
        )}

        {cockpitTab === 'narrator' && (
          <NarratorTab entries={narrative} />
        )}

        {cockpitTab === 'simulator' && (
          <SimulatorTab onSimulate={handleSimulate} />
        )}

        {cockpitTab === 'case-study' && (
          <CaseStudyTab />
        )}

      </main>

      {/* Pied de page du cockpit d'ingénierie */}
      <footer style={{ borderTop: '1px solid #1e293b', background: '#090d16', padding: '1.5rem 0', fontSize: '0.8rem', color: '#64748b' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>Cockpit de l'Équipage</strong> — Observatoire d'ingénierie agentique sous gouvernance humaine explicite.
            <br />
            Moteurs : DeepSeek V3 (Développement) · GPT-4.1-mini (Relecture) · Workers AI Llama 3.3 (Synthèse récit).
          </div>
          <div style={{ fontStyle: 'italic', color: '#94a3b8' }}>
            « Produit par des agents, relu par Bruno Delb »
          </div>
        </div>
      </footer>

      {/* Modal du cahier des charges client */}
      <ClientBriefModal 
        isOpen={isBriefModalOpen} 
        onClose={() => setIsBriefModalOpen(false)} 
      />

    </div>
  );
};
