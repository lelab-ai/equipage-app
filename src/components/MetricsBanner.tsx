import React from 'react';
import { SystemMetrics } from '../../functions/types';

interface MetricsBannerProps {
  metrics: SystemMetrics | null;
}

export const MetricsBanner: React.FC<MetricsBannerProps> = ({ metrics }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
      
      {/* 1. Taux d'autonomie */}
      <div className="card" style={{ borderLeft: '4px solid #38bdf8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Taux d'autonomie
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="mono" style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f8fafc' }}>
                {metrics?.autonomy_rate ?? 88.5}%
              </span>
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 500 }}>
                ↑ Cible &gt; 80%
              </span>
            </div>
          </div>
          <div style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          23 actions menées sans arbitrage humain direct sur 26 cycles d'arbitrage.
        </p>
      </div>

      {/* 2. Temps de résolution (MTTR) */}
      <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Temps moyen de résolution (MTTR)
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="mono" style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f8fafc' }}>
                {metrics?.mttr_minutes ?? 8} min
              </span>
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 500 }}>
                Détection 72s
              </span>
            </div>
          </div>
          <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          Atténuation automatique par rollback dès détection d'une anomalie.
        </p>
      </div>

      {/* 3. Coût unitaire */}
      <div className="card" style={{ borderLeft: '4px solid #a855f7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Coût moyen par ticket
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="mono" style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f8fafc' }}>
                0.09 €
              </span>
              <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 500 }}>
                Plancher 0.02 €
              </span>
            </div>
          </div>
          <div style={{ padding: '0.5rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          Routage intelligent : Workers AI gratuit pour le tri, LLM fort seulement pour coder.
        </p>
      </div>

      {/* 4. Taux de mauvaises corrections */}
      <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mauvaises corrections
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="mono" style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f8fafc' }}>
                {metrics?.bad_fix_rate ?? 7.1}%
              </span>
              <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 500 }}>
                1 rollback / 14 PRs
              </span>
            </div>
          </div>
          <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          Régressions détectées post-fusion et annulées immédiatement sans impact durable.
        </p>
      </div>

    </div>
  );
};
