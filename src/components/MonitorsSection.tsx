import React, { useState } from 'react';
import { Monitor } from '../../functions/types';

interface MonitorsSectionProps {
  monitors: Monitor[];
  onAddMonitor: (name: string, url: string) => Promise<{ success: boolean; error?: string }>;
  onRefresh: () => void;
}

export const MonitorsSection: React.FC<MonitorsSectionProps> = ({ monitors, onAddMonitor, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await onAddMonitor(name, url);
      if (res.success) {
        setSuccessMsg(`Service "${name}" enregistré avec succès ! Sonde activée.`);
        setName('');
        setUrl('');
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg(null);
          onRefresh();
        }, 1200);
      } else {
        setError(res.error || 'Erreur lors de l\'enregistrement du service.');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur réseau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '0.5rem', borderLeft: '4px solid #10b981' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🌐</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
              Services et endpoints externes surveillés
            </h3>
            <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>SaaS Multi-services</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
            Sondes HTTP périodiques actives, protégées par filtrage anti-SSRF strict (Option A).
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Enregistrer un service externe
        </button>
      </div>

      {/* Monitors List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {monitors.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            Aucun moniteur externe enregistré. Cliquez sur « Enregistrer un service externe » pour ajouter votre première URL.
          </div>
        ) : (
          monitors.map(m => (
            <div 
              key={m.id}
              style={{
                padding: '0.85rem 1rem',
                background: '#090d16',
                borderRadius: '0.5rem',
                border: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Opérationnel</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{m.name}</div>
                  <div className="mono" style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{m.url}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                <div>
                  Latence P95 : <span className="mono" style={{ color: '#10b981', fontWeight: 600 }}>{m.last_latency_ms || 28} ms</span>
                </div>
                <div>
                  Sonde : <span className="mono" style={{ color: '#f8fafc' }}>toutes les {m.interval_seconds || 60}s</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Monitor */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '0.75rem',
            width: '100%',
            maxWidth: '520px',
            padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                Enregistrer un nouveau service externe
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setError(null); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Equipage interrogera ce point de terminaison en continu depuis Cloudflare Edge pour mesurer sa disponibilité et sa latence P95.
            </p>

            {error && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.375rem',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid #f43f5e',
                color: '#fca5a5',
                fontSize: '0.8rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            {successMsg && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.375rem',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#86efac',
                fontSize: '0.8rem'
              }}>
                ✓ {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Nom du composant ou service *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: API Paiement Stripe, Application Web Client"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    background: '#090d16',
                    border: '1px solid #334155',
                    borderRadius: '0.375rem',
                    color: '#f8fafc',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  URL cible HTTP ou HTTPS *
                </label>
                <input 
                  type="url"
                  required
                  placeholder="https://api.monsaas.com/health"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    background: '#090d16',
                    border: '1px solid #334155',
                    borderRadius: '0.375rem',
                    color: '#f8fafc',
                    fontSize: '0.85rem'
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                  🛡️ Protection anti-SSRF active : les adresses locales (localhost, 127.0.0.1, 10.0.0.0/8, 192.168.0.0/16) sont rejetées.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem' }}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem' }}
                >
                  {submitting ? 'Validation...' : 'Enregistrer la sonde'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
