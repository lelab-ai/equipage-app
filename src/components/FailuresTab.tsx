import React from 'react';
import { FailureEntry } from '../../functions/types';

interface FailuresTabProps {
  failures: FailureEntry[];
}

export const FailuresTab: React.FC<FailuresTabProps> = ({ failures }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Manifesto Box */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.3)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🎯</span>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
            Ce que les agents ont raté : l'engagement de transparence radicale
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.5 }}>
          « Je ne vous montre pas que l'IA sait tout faire. Je vous montre ce qu'elle sait faire, ce qu'elle rate, combien elle coûte, et comment on l'encadre. »
          <br />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'normal' }}>
            — Bruno Delb, Document de conception d'Equipage (Section 3)
          </span>
        </p>
      </div>

      {/* Failures Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {failures.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
            Aucun échec ou régression enregistré dans la base SQL D1.
          </div>
        ) : (
          failures.map(f => (
            <div key={f.id} className="card" style={{ borderTop: '3px solid #f43f5e', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb7185' }}>{f.id}</span>
                  <span className="badge badge-red">{f.date}</span>
                </div>
                <span className="mono" style={{ fontSize: '0.75rem', color: '#f59e0b' }}>{f.impact_cout}</span>
              </div>

              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                {f.titre}
              </h3>

              <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                {f.description}
              </p>

              <div style={{ background: '#090d16', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #1e293b', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div>
                  <strong style={{ color: '#38bdf8' }}>Détecté par : </strong>
                  <span style={{ color: '#cbd5e1' }}>{f.detecte_par}</span>
                </div>
                <div>
                  <strong style={{ color: '#10b981' }}>Parade / Rétablissement : </strong>
                  <span style={{ color: '#cbd5e1' }}>{f.reparation}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #334155', paddingTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <strong style={{ color: '#f1f5f9' }}>Leçon apprise : </strong>
                <span>{f.lecon}</span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
