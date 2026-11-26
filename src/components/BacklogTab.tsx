import React, { useState } from 'react';
import { BacklogItem, Decision } from '../../functions/types';

interface BacklogTabProps {
  items: BacklogItem[];
  decisions: Decision[];
  onAddNewTicket: (data: any) => void;
  onOpenBrief?: () => void;
}

export const BacklogTab: React.FC<BacklogTabProps> = ({ items, decisions, onAddNewTicket, onOpenBrief }) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSource, setNewSource] = useState('client-presse');
  const [newValeur, setNewValeur] = useState(4);
  const [newFrequence, setNewFrequence] = useState(3);
  const [newAdequation, setNewAdequation] = useState(5);
  const [newEffort, setNewEffort] = useState(2);
  const [newMalusCout, setNewMalusCout] = useState(0);

  const currentWip = items.filter(i => i.work_in_progress === 1).length;
  const isWipFull = currentWip >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSource) return;
    onAddNewTicket({
      title: newTitle,
      description: newDescription,
      source: newSource,
      status: 'pret',
      valeur: Number(newValeur),
      frequence: Number(newFrequence),
      adequation: Number(newAdequation),
      effort: Number(newEffort),
      malus_cout: Number(newMalusCout)
    });
    setNewTitle('');
    setNewDescription('');
    setShowNewModal(false);
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'client-presse':
        return <span className="badge badge-amber">Alex (Client Pressé)</span>;
      case 'client-securite':
        return <span className="badge badge-purple">Claire (Client Sécurité)</span>;
      case 'sentry':
        return <span className="badge badge-red">Sentry (Incident)</span>;
      case 'dependabot':
        return <span className="badge badge-blue">Dependabot</span>;
      case 'sponsor':
        return <span className="badge badge-green">Bruno Delb (Sponsor)</span>;
      default:
        return <span className="badge badge-blue">{source}</span>;
    }
  };

  const getStatusBadge = (status: BacklogItem['status']) => {
    switch (status) {
      case 'termine':
        return <span className="badge badge-green">Terminé</span>;
      case 'en_cours':
        return <span className="badge badge-blue">En Cours (WIP)</span>;
      case 'pret':
        return <span className="badge badge-amber">Prêt (Sprint)</span>;
      case 'backlog':
        return <span className="badge badge-blue" style={{ opacity: 0.7 }}>Backlog</span>;
      case 'rejete':
        return <span className="badge badge-red">Refusé</span>;
      case 'gele':
        return <span className="badge" style={{ background: '#334155', color: '#94a3b8' }}>Gelé</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
            Backlog et moteur de décision du product owner
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Priorisation mathématique : <code>Score = ((V × F × A) ÷ E) - (Malus Coût × 0.25)</code>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* WIP Gauge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: isWipFull ? 'rgba(244, 63, 94, 0.15)' : '#0f172a', 
            padding: '0.4rem 0.85rem', 
            borderRadius: '0.5rem', 
            border: isWipFull ? '1px solid #f43f5e' : '1px solid #334155' 
          }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Limite WIP :</span>
            <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: isWipFull ? '#fb7185' : '#38bdf8' }}>
              {currentWip} / 3 en cours
            </span>
          </div>

          <button onClick={() => setShowNewModal(true)} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            + Proposer un ticket (avec source)
          </button>
        </div>
      </div>

      {/* Client Brief & Mandate Card */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(10, 15, 29, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid #1e293b',
        borderLeft: '4px solid #38bdf8',
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🎯</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Demande client initiale (mandat du sponsor)
              </h3>
              <span className="badge badge-blue">Source : Bruno Delb</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>
              « Créer et opérer une plateforme web autonome de <strong>Page de Statut et Journal d'Incidents en direct</strong> sur Cloudflare Edge pour surveiller en temps réel les 5 briques de notre architecture (API Edge, Base D1 SQL, Dashboard, Ingestion Webhooks, Authentification). Les agents doivent concevoir les sondes de disponibilité, mesurer la latence SQL P95, ingérer les alertes Sentry et publier les postmortems, le tout pour moins de 30 €/mois sous gouvernance humaine. »
            </p>
          </div>
          {onOpenBrief && (
            <button 
              onClick={onOpenBrief} 
              className="btn btn-secondary" 
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', border: '1px solid #38bdf8', color: '#38bdf8', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <span>📋</span> Cahier des charges détaillé ↗
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid #1e293b', fontSize: '0.75rem', color: '#94a3b8' }}>
          <div>
            <span style={{ color: '#64748b' }}>En cours de développement (sprint 1) : </span>
            <strong style={{ color: '#38bdf8' }}>TIK-001 (Page de statut et sondes des 5 services)</strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Prochain sprint : </span>
            <strong style={{ color: '#f8fafc' }}>TIK-002 (/api/health et mesure de latence P95)</strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Contrainte absolue : </span>
            <strong style={{ color: '#34d399' }}>Budget strict &lt; 30 € et validation humaine sur actions sensibles</strong>
          </div>
        </div>
      </div>

      {/* Modal New Ticket */}
      {showNewModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.75)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 100,
          padding: '1rem' 
        }}>
          <div className="card" style={{ maxWidth: '550px', width: '100%', border: '1px solid #38bdf8' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
              Soumettre un besoin au product owner
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
                  Titre du ticket *
                </label>
                <input 
                  type="text" 
                  required
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="ex: Graphique des temps de réponse sur 30 jours"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', background: '#090d16', border: '1px solid #334155', color: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
                  Source obligatoire (Règle PO : toute proposition doit citer sa provenance) *
                </label>
                <select 
                  value={newSource} 
                  onChange={e => setNewSource(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', background: '#090d16', border: '1px solid #334155', color: '#f8fafc' }}
                >
                  <option value="client-presse">Alex (Client Pressé) — Vélocité &amp; visibilité</option>
                  <option value="client-securite">Claire (Client Sécurité) — Audit &amp; conformité</option>
                  <option value="client-econome">Julien (Client Économe) — FinOps &amp; frugalité</option>
                  <option value="sentry">Sentry — Incident ou anomalie détectée</option>
                  <option value="dependabot">Dependabot — Dépendance ou vulnérabilité</option>
                  <option value="sponsor">Bruno Delb (Sponsor) — Orientation stratégique</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Valeur (1-5)</label>
                  <input type="number" min="1" max="5" value={newValeur} onChange={e => setNewValeur(Number(e.target.value))} style={{ width: '100%', padding: '0.35rem', background: '#090d16', border: '1px solid #334155', color: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Fréquence (1-5)</label>
                  <input type="number" min="1" max="5" value={newFrequence} onChange={e => setNewFrequence(Number(e.target.value))} style={{ width: '100%', padding: '0.35rem', background: '#090d16', border: '1px solid #334155', color: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Adéquation (1-5)</label>
                  <input type="number" min="1" max="5" value={newAdequation} onChange={e => setNewAdequation(Number(e.target.value))} style={{ width: '100%', padding: '0.35rem', background: '#090d16', border: '1px solid #334155', color: '#f8fafc' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Effort estimé (1-5)</label>
                  <input type="number" min="1" max="5" value={newEffort} onChange={e => setNewEffort(Number(e.target.value))} style={{ width: '100%', padding: '0.35rem', background: '#090d16', border: '1px solid #334155', color: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Malus Coût (0-5)</label>
                  <input type="number" min="0" max="5" value={newMalusCout} onChange={e => setNewMalusCout(Number(e.target.value))} style={{ width: '100%', padding: '0.35rem', background: '#090d16', border: '1px solid #334155', color: '#f8fafc' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowNewModal(false)} className="btn btn-outline">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Calculer le score et enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid Backlog Items & Decisions Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        
        {/* Backlog Items List */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>
            Backlog priorisé par le PO
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ 
                padding: '0.85rem', 
                borderRadius: '0.5rem', 
                background: '#090d16', 
                border: item.work_in_progress ? '1px solid #0284c7' : '1px solid #1e293b',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="mono" style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{item.id}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{item.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusBadge(item.status)}
                    <div style={{ 
                      padding: '0.2rem 0.5rem', 
                      background: 'rgba(56, 189, 248, 0.1)', 
                      borderRadius: '0.375rem', 
                      border: '1px solid rgba(56, 189, 248, 0.2)' 
                    }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Score: </span>
                      <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>{item.score}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Source :</span>
                    {getSourceBadge(item.source)}
                  </div>
                  <div className="mono" style={{ color: '#94a3b8' }}>
                    V:{item.valeur} F:{item.frequence} A:{item.adequation} / E:{item.effort} (Malus:{item.malus_cout})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PO Decisions & Reasoning Feed */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>
            Journal des arbitrages du PO
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto' }}>
            {decisions.map(dec => (
              <div key={dec.id} style={{ 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                background: '#090d16', 
                borderLeft: dec.action === 'REJECT' ? '3px solid #f43f5e' : dec.action === 'FREEZE' ? '3px solid #64748b' : '3px solid #10b981',
                borderTop: '1px solid #1e293b',
                borderRight: '1px solid #1e293b',
                borderBottom: '1px solid #1e293b'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 600, color: '#38bdf8' }}>{dec.id}</span>
                    <span className={`badge ${dec.action === 'REJECT' ? 'badge-red' : dec.action === 'FREEZE' ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.65rem' }}>
                      {dec.action}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: '0.65rem', color: '#64748b' }}>{dec.created_at.split('T')[0]}</span>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                  {dec.justification}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', color: '#94a3b8' }}>
                  <span>Ticket : <strong className="mono" style={{ color: '#cbd5e1' }}>{dec.item_id || 'N/A'}</strong></span>
                  <span>Source citée : <strong style={{ color: '#38bdf8' }}>{dec.source}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
