import React from 'react';

interface LivePipelineBannerProps {
  onTriggerNextStep?: () => void;
  isRunning?: boolean;
  onOpenBrief?: () => void;
}

export const LivePipelineBanner: React.FC<LivePipelineBannerProps> = ({ onTriggerNextStep, isRunning, onOpenBrief }) => {
  return (
    <div className="card" style={{ 
      background: 'linear-gradient(135deg, rgba(14, 22, 38, 0.95) 0%, rgba(9, 13, 22, 0.95) 100%)',
      border: '1px solid #1e293b',
      borderLeft: '4px solid #38bdf8',
      marginBottom: '1.5rem',
      padding: '1.25rem 1.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🏭</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Où et comment l'application se construit sous vos yeux
            </h3>
            <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Pipeline actif</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            Chaque incrément logiciel traverse obligatoirement ce circuit fermé d'agents sans complaisance :
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onOpenBrief && (
            <button 
              onClick={onOpenBrief}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #38bdf8', color: '#38bdf8' }}
              title="Consulter le brief client initial, le ticket actif et le cahier des charges V1"
            >
              <span>🎯</span> Brief client et cahier des charges
            </button>
          )}

          {onTriggerNextStep && (
            <button 
              onClick={onTriggerNextStep}
              disabled={isRunning}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              {isRunning ? '⏳ Exécution du cycle...' : '⚡ Lancer un cycle de construction (Dev + Audit)'}
            </button>
          )}
        </div>
      </div>

      {/* Visual Workflow Steps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem',
        position: 'relative'
      }}>
        
        {/* Step 1 */}
        <div 
          onClick={onOpenBrief}
          style={{ 
            background: '#070a12', 
            padding: '0.75rem', 
            borderRadius: '0.375rem', 
            border: '1px solid #38bdf8', 
            cursor: onOpenBrief ? 'pointer' : 'default',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.15)'
          }}
          title="Cliquer pour afficher la demande client initiale et le cahier des charges"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>Étape 1 (cliquez)</span>
            <span style={{ fontSize: '0.7rem' }}>📋</span>
          </div>
          <strong style={{ fontSize: '0.8rem', color: '#f8fafc', display: 'block' }}>Besoin client ou ticket</strong>
          <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>🔍 Voir le brief client ↗</span>
        </div>

        {/* Step 2 */}
        <div style={{ background: '#070a12', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>Étape 2</span>
            <span style={{ fontSize: '0.7rem' }}>🎯</span>
          </div>
          <strong style={{ fontSize: '0.8rem', color: '#38bdf8', display: 'block' }}>Scoring du PO (Gemini)</strong>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Formule mathématique et WIP &le; 3</span>
        </div>

        {/* Step 3 */}
        <div style={{ background: '#070a12', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#a855f7', fontWeight: 700 }}>Étape 3</span>
            <span style={{ fontSize: '0.7rem' }}>💻</span>
          </div>
          <strong style={{ fontSize: '0.8rem', color: '#c084fc', display: 'block' }}>Développement TDD (DeepSeek)</strong>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Tests unitaires et pull request</span>
        </div>

        {/* Step 4 */}
        <div style={{ background: '#070a12', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>Étape 4</span>
            <span style={{ fontSize: '0.7rem' }}>🛡️</span>
          </div>
          <strong style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'block' }}>Audit croisé (OpenAI)</strong>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Détection de régressions et failles</span>
        </div>

        {/* Step 5 */}
        <div style={{ background: '#070a12', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Étape 5</span>
            <span style={{ fontSize: '0.7rem' }}>🚀</span>
          </div>
          <strong style={{ fontSize: '0.8rem', color: '#34d399', display: 'block' }}>Déploiement à l'edge</strong>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Cloudflare Workers et D1 SQL</span>
        </div>

        {/* Step 6 */}
        <div style={{ background: '#070a12', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: 700 }}>Étape 6</span>
            <span style={{ fontSize: '0.7rem' }}>⚡</span>
          </div>
          <strong style={{ fontSize: '0.8rem', color: '#f43f5e', display: 'block' }}>Sonde SRE et alertes Sentry</strong>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Retour arrière automatique si erreur 500</span>
        </div>

      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
        <span>
          💡 <strong>Deux façons d'observer la construction :</strong>
          1. Ouvrez une Issue avec le label <code>pret</code> sur <a href="https://github.com/lelab-ai/equipage/issues" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>GitHub</a> pour déclencher les agents.
          2. Ou utilisez le bouton ci-dessus pour simuler une itération complète.
        </span>
      </div>
    </div>
  );
};
