import React from 'react';
import { NarrativeEntry } from '../../functions/types';

interface NarratorTabProps {
  entries: NarrativeEntry[];
}

export const NarratorTab: React.FC<NarratorTabProps> = ({ entries }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Intro Box */}
      <div className="card" style={{ borderLeft: '4px solid #38bdf8' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.35rem' }}>
          Journal de bord quotidien du narrateur
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Rédigé chaque fin de journée par l'agent Narrateur (modèle léger à coût zéro) en compilant les événements réels, les tickets fusionnés, les pannes et les coûts facturés.
          Chaque épisode porte la mention contractuelle obligatoire : <em>« Produit par des agents, relu par Bruno Delb »</em>.
        </p>
      </div>

      {/* Narrative Entries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {entries.map(entry => (
          <div key={entry.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>{entry.id}</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{entry.title}</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="mono" style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>{entry.cost_eur.toFixed(3)} €</span>
                <span className="badge badge-blue">{entry.date}</span>
              </div>
            </div>

            {/* 4 Quadrants */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              
              <div style={{ background: '#090d16', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ✓ Ce qui a été livré
                </span>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
                  {entry.delivered_summary}
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ✕ Ce qui a raté
                </span>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
                  {entry.failures_summary}
                </p>
              </div>

            </div>

            {/* Lesson Learned */}
            <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>💡 La leçon du jour : </span>
              <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>{entry.lessons_learned}</span>
            </div>

            {/* Mandatory Author Mention */}
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #1e293b', paddingTop: '0.5rem' }}>
              {entry.author_mention}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
