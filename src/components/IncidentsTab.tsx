import React, { useState } from 'react';
import { Incident } from '../../functions/types';

interface IncidentsTabProps {
  incidents: Incident[];
  onTriggerIncidentSimulation: () => void;
  onTriggerRollback: () => void;
}

export const IncidentsTab: React.FC<IncidentsTabProps> = ({ 
  incidents, 
  onTriggerIncidentSimulation, 
  onTriggerRollback 
}) => {
  const [activePostmortem, setActivePostmortem] = useState<string | null>(incidents[0]?.id || null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* SRE Action Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
            Supervision SRE et traitement automatique des incidents
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Surveillance continue des sondes, déclenchement immédiat de rollback en cas de régression.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={onTriggerIncidentSimulation} className="btn btn-danger" style={{ fontSize: '0.8rem' }}>
            Simuler une alerte Sentry
          </button>
          <button onClick={onTriggerRollback} className="btn btn-success" style={{ fontSize: '0.8rem' }}>
            Déclencher un rollback automatique
          </button>
        </div>
      </div>

      {/* Incidents Details and Postmortem Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Incidents Timeline */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>
            Registre des incidents détectés
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {incidents.map(inc => (
              <div 
                key={inc.id}
                onClick={() => setActivePostmortem(inc.id)}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '0.5rem', 
                  background: activePostmortem === inc.id ? '#1e293b' : '#090d16',
                  border: activePostmortem === inc.id ? '1px solid #38bdf8' : '1px solid #1e293b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>{inc.id}</span>
                    <span className={`badge ${inc.severity === 'SEV-1' ? 'badge-red' : 'badge-amber'}`}>
                      {inc.severity}
                    </span>
                    {inc.is_regression === 1 && (
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Régression d'agent</span>
                    )}
                  </div>
                  <span className="mono" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {inc.detected_at.split('T')[0]}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  {inc.title}
                </h4>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <div>
                    <span>Temps de détection : </span>
                    <strong className="mono" style={{ color: '#10b981' }}>{inc.time_to_detect_seconds}s</strong>
                  </div>
                  <div>
                    <span>Temps de résolution : </span>
                    <strong className="mono" style={{ color: '#38bdf8' }}>{Math.round(inc.time_to_resolve_seconds / 60)} min</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Postmortem Reader */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>
            Rapport Postmortem Blameless Détaillé
          </h3>

          {(() => {
            const inc = incidents.find(i => i.id === activePostmortem);
            if (!inc || !inc.postmortem) {
              return <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Sélectionnez un incident pour lire son rapport de retour d'expérience.</p>;
            }

            return (
              <div style={{ 
                background: '#090d16', 
                borderRadius: '0.5rem', 
                padding: '1.25rem', 
                border: '1px solid #1e293b', 
                maxHeight: '550px', 
                overflowY: 'auto' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Statut incident : </span>
                    <span className="badge badge-green">{inc.status}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                    Service : <strong className="mono" style={{ color: '#38bdf8' }}>{inc.service_id}</strong>
                  </div>
                </div>

                <div style={{ 
                  fontSize: '0.85rem', 
                  fontFamily: 'var(--font-sans)', 
                  color: '#cbd5e1', 
                  lineHeight: '1.6', 
                  whiteSpace: 'pre-wrap' 
                }}>
                  {inc.postmortem}
                </div>
              </div>
            );
          })()}
        </div>

      </div>

    </div>
  );
};
