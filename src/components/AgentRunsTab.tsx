import React, { useState } from 'react';
import { AgentRun } from '../../functions/types';
import { RunInspectorDrawer } from './RunInspectorDrawer';

interface AgentRunsTabProps {
  runs: AgentRun[];
}

export const AgentRunsTab: React.FC<AgentRunsTabProps> = ({ runs }) => {
  const [selectedRun, setSelectedRun] = useState<AgentRun | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Intro Box on Cross-Model Verification */}
      <div className="card" style={{ borderLeft: '4px solid #38bdf8' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.35rem' }}>
          Principe d'audit croisé : développeur contre relecteur
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Toutes les requêtes sont routées via la passerelle unifiée <strong>OpenRouter</strong> avec une clé d'API unique et un budget centralisé.
          Pour éliminer toute complaisance algorithmique, <strong>l'agent Développeur (deepseek/deepseek-chat)</strong> et <strong>l'agent Relecteur (openai/gpt-4.1-mini)</strong> utilisent impérativement deux familles de fondations distinctes.
          Les analyses statiques de routine et le tri sont délégués à <strong>qwen/qwen-2.5-coder-32b-instruct</strong>.
        </p>
      </div>

      {/* Runs Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
              Historique des exécutions d'agents (runs et consommations)
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Cliquez sur n'importe quelle exécution pour ouvrir le volet d'inspection latérale des prompts et réponses.
            </span>
          </div>
          <span className="badge badge-blue">
            {runs.length} exécution{runs.length > 1 ? 's' : ''} enregistrée{runs.length > 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Identifiant et horodatage</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Agent et modèle</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Action exécutée</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Tokens (In / Out)</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Durée</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Coût (€)</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Résultat</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Traçabilité des invites</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    Aucune exécution d'agent pour le moment (Jour 0).
                  </td>
                </tr>
              ) : (
                runs.map(run => (
                  <tr 
                    key={run.id} 
                    style={{ 
                      borderBottom: '1px solid #1e293b',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    className="hover-row"
                    onClick={() => setSelectedRun(run)}
                  >
                    <td style={{ padding: '0.75rem' }}>
                      <div className="mono" style={{ fontWeight: 600, color: '#38bdf8' }}>{run.id}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{run.created_at.split('T')[0]}</div>
                    </td>

                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{run.agent}</div>
                      <div style={{ fontSize: '0.7rem', color: '#a855f7' }}>
                        {run.provider} ({run.model})
                      </div>
                    </td>

                    <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                      <div>{run.action}</div>
                      {run.error_message && (
                        <div style={{ fontSize: '0.7rem', color: '#fb7185', marginTop: '0.2rem' }}>
                          ⚠ {run.error_message}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '0.75rem' }} className="mono">
                      <span style={{ color: '#94a3b8' }}>{run.tokens_in.toLocaleString()}</span> / <span style={{ color: '#38bdf8' }}>{run.tokens_out.toLocaleString()}</span>
                    </td>

                    <td style={{ padding: '0.75rem', color: '#cbd5e1' }} className="mono">
                      {(run.duration_ms / 1000).toFixed(1)}s
                    </td>

                    <td style={{ padding: '0.75rem', fontWeight: 600, color: run.cost_eur === 0 ? '#10b981' : '#38bdf8' }} className="mono">
                      {run.cost_eur === 0 ? '0.00 € (Gratuit)' : `${run.cost_eur.toFixed(4)} €`}
                    </td>

                    <td style={{ padding: '0.75rem' }}>
                      {run.outcome === 'success' ? (
                        <span className="badge badge-green">Validé</span>
                      ) : run.outcome === 'failure' ? (
                        <span className="badge badge-red">Rejeté</span>
                      ) : (
                        <span className="badge badge-amber">Escaladé</span>
                      )}
                    </td>

                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRun(run);
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                      >
                        🔍 Inspecter
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Inspection Drawer */}
      <RunInspectorDrawer 
        run={selectedRun} 
        onClose={() => setSelectedRun(null)} 
      />

    </div>
  );
};
