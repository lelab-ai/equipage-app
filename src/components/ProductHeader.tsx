import React from 'react';

interface ProductHeaderProps {
  isHealthy: boolean;
  onGoToCockpit: () => void;
  onRefresh: () => void;
  lastUpdated?: string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  isHealthy,
  onGoToCockpit,
  onRefresh,
  lastUpdated
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      {/* Top subtle bar announcing AI autonomous team */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(2, 132, 199, 0.15) 0%, rgba(56, 189, 248, 0.25) 50%, rgba(16, 185, 129, 0.15) 100%)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
        padding: '0.45rem 1rem',
        fontSize: '0.8rem',
        color: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem' }}>🤖</span>
          <span>
            Cette application SaaS est <strong>conçue, codée et opérée en direct</strong> par une équipe d'agents d'IA autonomes sous gouvernance humaine.
          </span>
        </div>
        <button
          onClick={onGoToCockpit}
          style={{
            background: 'rgba(56, 189, 248, 0.2)',
            border: '1px solid #38bdf8',
            color: '#38bdf8',
            borderRadius: '9999px',
            padding: '0.2rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#38bdf8';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
            e.currentTarget.style.color = '#38bdf8';
          }}
        >
          <span>Explorer le cockpit de l'équipage</span>
          <span>➔</span>
        </button>
      </div>

      {/* Main product navigation bar */}
      <div className="container" style={{ padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '2.5rem', 
            height: '2.5rem', 
            borderRadius: '0.5rem', 
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.35)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc', margin: 0 }}>
                Equipage
              </h1>
              <span className="badge badge-blue">Statut &amp; Surveillance</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
              Surveillance continue des services et observabilité multi-plateforme
            </p>
          </div>
        </div>

        {/* Global status & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Live Status indicator */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: '#0f172a', 
            padding: '0.4rem 0.85rem', 
            borderRadius: '0.5rem', 
            border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: isHealthy ? '#10b981' : '#f43f5e' 
            }} className="pulse-indicator"></span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isHealthy ? '#34d399' : '#fb7185' }}>
              {isHealthy ? 'Tous les systèmes opérationnels' : 'Incidents détectés'}
            </span>
          </div>

          {/* GitHub public repository link */}
          <a
            href="https://github.com/lelab-ai/equipage-app"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#0f172a',
              padding: '0.4rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #334155',
              fontSize: '0.75rem',
              color: '#94a3b8',
              textDecoration: 'none'
            }}
            title="Dépôt open source public du produit"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>equipage-app ↗</span>
          </a>

          {/* Refresh button */}
          <button 
            onClick={onRefresh} 
            className="btn btn-outline" 
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            title="Rafraîchir les sondes en direct"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>Actualiser</span>
          </button>
        </div>

      </div>
    </header>
  );
};
