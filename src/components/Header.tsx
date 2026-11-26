import React from 'react';
import { SystemMetrics } from '../../functions/types';

interface HeaderProps {
  metrics: SystemMetrics | null;
  onToggleEmergencyStop: () => void;
}

export const Header: React.FC<HeaderProps> = ({ metrics, onToggleEmergencyStop }) => {
  const isEmergency = metrics?.emergency_stop || false;

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="container" style={{ padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Logo & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '2.5rem', 
            height: '2.5rem', 
            borderRadius: '0.5rem', 
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                Equipage
              </h1>
              <span className="badge badge-blue">v1.0</span>
              <a 
                href="https://equipage.lelab.ai" 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                equipage.lelab.ai ↗
              </a>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Équipe logicielle animée par des agents sous gouvernance humaine
            </p>
          </div>
        </div>

        {/* Global Controls & Ticker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0f172a', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: isEmergency ? '#f43f5e' : '#10b981' 
            }} className="pulse-indicator"></span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isEmergency ? '#fb7185' : '#34d399' }}>
              {isEmergency ? 'ARRÊT D\'URGENCE' : 'SYSTÈME ACTIF'}
            </span>
          </div>

          {/* Architecture / Language Strategy & Engines Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0f172a', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #334155' }} title="DeepSeek V3 (Dev) & OpenAI GPT-4.1-mini (Audit) via OpenRouter + Llama 3.3 via Cloudflare Workers AI (Gratuit 0 €) - UI en français">
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Moteurs :</span>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>🇬🇧 DeepSeek &amp; GPT-4.1-mini</span>
            <span style={{ fontSize: '0.75rem', color: '#475569' }}>+</span>
            <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600 }}>⚡ Workers AI (0 €)</span>
            <span style={{ fontSize: '0.75rem', color: '#475569' }}>|</span>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>🇫🇷 UI FR</span>
          </div>

          {/* Budget Live Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0f172a', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Coût V1 :</span>
            <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
              {metrics?.total_cost_eur.toFixed(2) || '0.82'} € / {metrics?.budget_cap_eur || 30} €
            </span>
          </div>

          {/* Emergency Stop Button */}
          <button 
            onClick={onToggleEmergencyStop}
            className={`btn ${isEmergency ? 'btn-success' : 'btn-danger'}`}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            title={isEmergency ? "Cliquer pour réactiver les agents" : "Interrompre tous les agents immédiatement"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
            {isEmergency ? 'Rétablir les agents' : 'Arrêt d\'urgence'}
          </button>
        </div>

      </div>
    </header>
  );
};
