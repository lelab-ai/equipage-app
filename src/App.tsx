import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
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
  SystemMetrics 
} from '../functions/types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'backlog' | 'runs' | 'incidents' | 'failures' | 'governance' | 'narrator' | 'simulator' | 'case-study'>('status');

  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [services, setServices] = useState<StatusService[]>([]);
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

  // Chargement direct depuis la base Cloudflare D1 SQL (Zéro mock)
  const refreshData = async () => {
    try {
      setLoadError(null);
      const [mRes, sRes, iRes, dRes, rRes, aRes, incRes, nRes, fRes] = await Promise.all([
        fetch('/api/metrics').then(r => r.json()),
        fetch('/api/status').then(r => r.json()),
        fetch('/api/items').then(r => r.json()),
        fetch('/api/decisions').then(r => r.json()),
        fetch('/api/runs').then(r => r.json()),
        fetch('/api/approvals').then(r => r.json()),
        fetch('/api/incidents').then(r => r.json()),
        fetch('/api/narrator').then(r => r.json()),
        fetch('/api/failures').then(r => r.json())
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
    } catch (err: any) {
      console.error('Erreur de chargement des données SQL D1:', err);
      setLoadError("Impossible de charger les données en direct depuis Cloudflare D1.");
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ active: nextState, reason: nextState ? 'Action manuelle depuis le tableau de bord' : '' })
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
      setActiveTab('runs');
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
      setActiveTab('status');
    } catch (err) {
      console.error('Erreur lors de la réinitialisation:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Navigation Header */}
      <Header 
        metrics={metrics} 
        onToggleEmergencyStop={handleToggleEmergencyStop} 
      />

      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        
        {loadError && (
          <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {loadError}</span>
            <button className="btn btn-secondary" onClick={refreshData}>Réessayer</button>
          </div>
        )}

        {/* The 4 DORA / Autonomy Metrics */}
        <MetricsBanner metrics={metrics} />

        {/* Live Pipeline Map & Action Runner */}
        <LivePipelineBanner 
          onTriggerNextStep={handleRunFullCycle} 
          isRunning={isCycleRunning} 
          onOpenBrief={() => setIsBriefModalOpen(true)}
        />

        {/* Dual-Perspective Mode Switcher (Produit Client vs Coulisses Équipe) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.6rem 1rem', background: '#0a0f1d', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Perspective :</span>
            <button 
              onClick={() => setActiveTab('status')}
              className={`btn ${activeTab === 'status' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>🟢</span> Vue produit client (page de statut)
            </button>
            <button 
              onClick={() => { if (activeTab === 'status') setActiveTab('backlog'); }}
              className={`btn ${activeTab !== 'status' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>🏭</span> Coulisses de l'équipe autonome (cockpit)
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: activeTab === 'status' ? '#34d399' : '#38bdf8' }}>
            {activeTab === 'status' 
              ? "👁️ Vous consultez l'application telle que vos clients et utilisateurs finaux la voient." 
              : "🔍 Vous êtes dans la salle des machines : backlog, audits croisés, prompts LLM et métriques DORA."}
          </div>
        </div>

        {/* Tab Navigation (Cockpit Only when inspecting engineering) */}
        {activeTab !== 'status' && (
          <div className="tabs-nav" style={{ marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
            <button 
              className={`tab-btn ${activeTab === 'backlog' ? 'active' : ''}`}
              onClick={() => setActiveTab('backlog')}
            >
              📋 Backlog et décisions du PO
            </button>

            <button 
              className={`tab-btn ${activeTab === 'runs' ? 'active' : ''}`}
              onClick={() => setActiveTab('runs')}
            >
              🤖 Boucle de dev et relecture
            </button>

            <button 
              className={`tab-btn ${activeTab === 'incidents' ? 'active' : ''}`}
              onClick={() => setActiveTab('incidents')}
            >
              ⚡ Incidents et exploitation SRE
            </button>

            <button 
              className={`tab-btn ${activeTab === 'failures' ? 'active' : ''}`}
              onClick={() => setActiveTab('failures')}
            >
              🎯 Ce que les agents ont raté
            </button>

            <button 
              className={`tab-btn ${activeTab === 'governance' ? 'active' : ''}`}
              onClick={() => setActiveTab('governance')}
            >
              ⚖️ Gouvernance et approbations
            </button>

            <button 
              className={`tab-btn ${activeTab === 'narrator' ? 'active' : ''}`}
              onClick={() => setActiveTab('narrator')}
            >
              📖 Journal du narrateur
            </button>

            <button 
              className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
              onClick={() => setActiveTab('simulator')}
            >
              🚀 Simulateur interactif
            </button>

            <button 
              className={`tab-btn ${activeTab === 'case-study' ? 'active' : ''}`}
              onClick={() => setActiveTab('case-study')}
            >
              📑 Étude de cas V1
            </button>
          </div>
        )}

        {/* Tab Contents */}
        {activeTab === 'status' && (
          <StatusPageTab 
            services={services} 
            incidents={incidents} 
            onRefresh={refreshData} 
            onInspectCockpit={() => setActiveTab('runs')}
          />
        )}

        {activeTab === 'backlog' && (
          <BacklogTab 
            items={items} 
            decisions={decisions} 
            onAddNewTicket={handleAddNewTicket} 
            onOpenBrief={() => setIsBriefModalOpen(true)}
          />
        )}

        {activeTab === 'runs' && (
          <AgentRunsTab runs={runs} />
        )}

        {activeTab === 'incidents' && (
          <IncidentsTab 
            incidents={incidents} 
            onTriggerIncidentSimulation={() => handleSimulate('sentry_alert')} 
            onTriggerRollback={() => handleSimulate('auto_rollback')} 
          />
        )}

        {activeTab === 'failures' && (
          <FailuresTab failures={failures} />
        )}

        {activeTab === 'governance' && (
          <GovernanceTab 
            approvals={approvals} 
            emergencyStop={metrics?.emergency_stop || false} 
            onToggleEmergencyStop={handleToggleEmergencyStop} 
            onDecideApproval={handleDecideApproval} 
            onResetProject={handleResetProject} 
          />
        )}

        {activeTab === 'narrator' && (
          <NarratorTab entries={narrative} />
        )}

        {activeTab === 'simulator' && (
          <SimulatorTab onSimulate={handleSimulate} />
        )}

        {activeTab === 'case-study' && (
          <CaseStudyTab />
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e293b', background: '#090d16', padding: '1.5rem 0', fontSize: '0.8rem', color: '#64748b' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>Equipage</strong> — Page de statut et journal d'incidents hébergé sur <a href="https://equipage.lelab.ai" style={{ color: '#38bdf8', textDecoration: 'none' }}>equipage.lelab.ai</a>.
            <br />
            Système d'ingénierie agentique sous gouvernance humaine explicite.
          </div>
          <div style={{ fontStyle: 'italic', color: '#94a3b8' }}>
            « Produit par des agents, relu par Bruno Delb »
          </div>
        </div>
      </footer>

      {/* Client Brief & Specifications Modal */}
      <ClientBriefModal 
        isOpen={isBriefModalOpen} 
        onClose={() => setIsBriefModalOpen(false)} 
      />

    </div>
  );
};
