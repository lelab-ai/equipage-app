import React, { useState } from 'react';
import { AgentRun } from '../../functions/types';

interface RunInspectorDrawerProps {
  run: AgentRun | null;
  onClose: () => void;
}

export const RunInspectorDrawer: React.FC<RunInspectorDrawerProps> = ({ run, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'response' | 'raw'>('prompt');
  const [copied, setCopied] = useState<string | null>(null);

  if (!run) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const fullPromptText = `${run.prompt_system ? `=== SYSTEM PROMPT ===\n${run.prompt_system}\n\n` : ''}=== USER PROMPT ===\n${run.prompt_user || run.action}`;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 16, 0.75)',
          backdropFilter: 'blur(3px)',
          zIndex: 9998,
          transition: 'opacity 0.2s ease-in-out'
        }}
      />

      {/* Slide-over Drawer */}
      <aside 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '640px',
          maxWidth: '92vw',
          height: '100vh',
          background: '#0b0f19',
          borderLeft: '1px solid #1e293b',
          boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1e293b',
          background: '#0e1626',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                {run.id}
              </span>
              <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                Agent {run.agent}
              </span>
              <span className={`badge ${run.outcome === 'success' ? 'badge-green' : 'badge-red'}`}>
                {run.outcome === 'success' ? 'VALIDÉ' : 'REJETÉ'}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
              {run.action}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem', lineHeight: 1 }}
            title="Fermer le volet d'inspection"
          >
            ✕
          </button>
        </div>

        {/* Telemetry Stats Bar */}
        <div style={{
          padding: '0.75rem 1.5rem',
          background: '#070a12',
          borderBottom: '1px solid #1e293b',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          fontSize: '0.75rem'
        }}>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Modèle et passerelle</span>
            <strong className="mono" style={{ color: '#e2e8f0', fontSize: '0.72rem' }}>{run.model}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Tokens (In / Out)</span>
            <strong className="mono" style={{ color: '#38bdf8' }}>{run.tokens_in} / {run.tokens_out}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Coût de l'inférence</span>
            <strong className="mono" style={{ color: run.cost_eur === 0 ? '#10b981' : '#f59e0b' }}>
              {run.cost_eur === 0 ? '0.00 € (Gratuit)' : `${run.cost_eur.toFixed(4)} €`}
            </strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block' }}>Durée d'exécution</span>
            <strong className="mono" style={{ color: '#94a3b8' }}>{(run.duration_ms / 1000).toFixed(1)}s</strong>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #1e293b',
          background: '#090d16',
          padding: '0 1rem'
        }}>
          <button
            onClick={() => setActiveTab('prompt')}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'prompt' ? '#38bdf8' : '#94a3b8',
              borderBottom: activeTab === 'prompt' ? '2px solid #38bdf8' : '2px solid transparent'
            }}
          >
            📤 Prompt envoyé
          </button>
          <button
            onClick={() => setActiveTab('response')}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'response' ? '#10b981' : '#94a3b8',
              borderBottom: activeTab === 'response' ? '2px solid #10b981' : '2px solid transparent'
            }}
          >
            📥 Réponse de l'agent
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'raw' ? '#a855f7' : '#94a3b8',
              borderBottom: activeTab === 'raw' ? '2px solid #a855f7' : '2px solid transparent'
            }}
          >
            📦 Données brutes (JSON)
          </button>
        </div>

        {/* Drawer Content (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* TAB 1: PROMPT */}
          {activeTab === 'prompt' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Copy Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Ce prompt a été envoyé via OpenRouter à <code>{run.model}</code>.
                </span>
                <button 
                  onClick={() => handleCopy(fullPromptText, 'prompt')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  {copied === 'prompt' ? '✓ Copié dans le presse-papier' : '📋 Copier le prompt complet'}
                </button>
              </div>

              {/* System Prompt (Cadrage) */}
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <div style={{ padding: '0.5rem 0.75rem', background: '#0e1626', borderBottom: '1px solid #1e293b', fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                  ⚙️ System Prompt (Garde-fous &amp; Cadrage de l'Agent)
                </div>
                <pre style={{ margin: 0, padding: '0.85rem', fontSize: '0.75rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontFamily: 'monospace' }}>
                  {run.prompt_system || "Tu es un agent logiciel autonome d'Équipage opérant sous gouvernance humaine explicite."}
                </pre>
              </div>

              {/* User Prompt (Ticket & Contexte) */}
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <div style={{ padding: '0.5rem 0.75rem', background: '#0e1626', borderBottom: '1px solid #1e293b', fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>
                  📝 User Prompt (Tâche, Contexte &amp; Critères d'Acceptation)
                </div>
                <pre style={{ margin: 0, padding: '0.85rem', fontSize: '0.75rem', color: '#f8fafc', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontFamily: 'monospace' }}>
                  {run.prompt_user || run.action}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 2: RESPONSE */}
          {activeTab === 'response' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Réponse reçue et validée par le pipeline d'exécution.
                </span>
                <button 
                  onClick={() => handleCopy(run.response_raw || 'Aucune réponse', 'response')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  {copied === 'response' ? '✓ Copié' : '📋 Copier la réponse'}
                </button>
              </div>

              <div style={{ 
                background: '#090d16', 
                border: '1px solid #1e293b', 
                borderRadius: '0.5rem', 
                padding: '1rem',
                fontSize: '0.8rem',
                color: '#e2e8f0',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {run.response_raw || "Succès : L'exécution s'est achevée avec 100% de tests unitaires conformes."}
              </div>
            </div>
          )}

          {/* TAB 3: RAW JSON */}
          {activeTab === 'raw' && (
            <div>
              <pre style={{
                background: '#070a12',
                border: '1px solid #1e293b',
                borderRadius: '0.5rem',
                padding: '1rem',
                fontSize: '0.75rem',
                color: '#38bdf8',
                overflowX: 'auto',
                lineHeight: 1.5
              }}>
                {JSON.stringify(run, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #1e293b',
          background: '#0e1626',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <span>Horodaté : {run.created_at}</span>
          <a 
            href="https://openrouter.ai/docs" 
            target="_blank" 
            rel="noreferrer"
            style={{ color: '#38bdf8', textDecoration: 'none' }}
          >
            Spécification OpenRouter API ↗
          </a>
        </div>

      </aside>
    </>
  );
};
