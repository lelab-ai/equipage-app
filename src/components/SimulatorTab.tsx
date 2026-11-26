import React, { useState } from 'react';

interface SimulatorTabProps {
  onSimulate: (scenario: string) => Promise<any>;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({ onSimulate }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const runScenario = async (key: string, name: string) => {
    setLoading(key);
    addLog(`[SIMULATEUR] Démarrage du scénario : ${name}...`);
    try {
      const res = await onSimulate(key);
      addLog(`[SUCCÈS] Résultat reçu : ${JSON.stringify(res, null, 2)}`);
    } catch (err: any) {
      addLog(`[ERREUR] Échec de la simulation : ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const addLog = (msg: string) => {
    setLog(prev => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev.slice(0, 30)]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Intro Box & Autonomy Distinction */}
      <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
            Simulateur interactif de cycle V1 (démonstration en direct)
          </h3>
          <span className="badge badge-green">⚡ Déclencheurs réels actifs : Sentry &amp; GitHub</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.5rem' }}>
          Ce simulateur est un <strong>bac à sable interactif de démonstration</strong> pour tester les réactions de l'équipe sans attendre un incident de production réel.
          En temps normal, les agents sont déclenchés de façon <strong>100% autonome</strong> par les webhooks Sentry (alertes de prod) et GitHub Actions (ouvertures de tickets ou PRs).
        </p>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
          💡 <em>Les scénarios ci-dessous effectuent de vraies requêtes SQL sur Cloudflare D1 et appellent les modèles d'IA réels (OpenRouter &amp; Cloudflare Workers AI).</em>
        </p>
      </div>

      {/* Action Buttons Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        
        {/* Scenario 1 : Client Pressé */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-amber">Scénario 1</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>Retour du client pressé</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              Alex soumet un besoin urgent : « Widget compact d'uptime intégrable ». Le PO applique la formule de scoring et l'inscrit au backlog.
            </p>
          </div>
          <button 
            disabled={loading !== null}
            onClick={() => runScenario('client_presse_request', 'Demande Client Pressé')}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem' }}
          >
            {loading === 'client_presse_request' ? 'Traitement en cours...' : 'Déclencher la demande'}
          </button>
        </div>

        {/* Scenario 2 : Alerte Sentry */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-red">Scénario 2</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>Alerte Sentry et panne</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              Simulation d'un pic de latence (&gt; 320ms) sur <code>/api/health</code>. L'agent Exploitation ouvre immédiatement un incident SEV-2 et bascule la sonde en dégradé.
            </p>
          </div>
          <button 
            disabled={loading !== null}
            onClick={() => runScenario('sentry_alert', 'Alerte Sentry')}
            className="btn btn-danger"
            style={{ fontSize: '0.8rem' }}
          >
            {loading === 'sentry_alert' ? 'Déclenchement...' : 'Injecter l\'alerte'}
          </button>
        </div>

        {/* Scenario 3 : Rollback automatique */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-green">Scénario 3</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>Rollback et rétablissement</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              L'agent Exploitation rétablit le service actif par retour en arrière automatique, rédige le postmortem blameless et clôture l'incident.
            </p>
          </div>
          <button 
            disabled={loading !== null}
            onClick={() => runScenario('auto_rollback', 'Rollback Automatique')}
            className="btn btn-success"
            style={{ fontSize: '0.8rem' }}
          >
            {loading === 'auto_rollback' ? 'Rollback...' : 'Exécuter le rollback'}
          </button>
        </div>

        {/* Scenario 4 : Agent Dev Run */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-purple">Scénario 4</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>Exécution du développeur</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              L'agent Développeur (DeepSeek V3 via OpenRouter) exécute les tests de non-régression et enregistre ses tokens et son coût exact dans la table <code>runs</code>.
            </p>
          </div>
          <button 
            disabled={loading !== null}
            onClick={() => runScenario('developer_run', 'Run Développeur')}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem' }}
          >
            {loading === 'developer_run' ? 'Exécution...' : 'Lancer un run de test'}
          </button>
        </div>

        {/* Scenario 5 : Workers AI Gratuit */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem', border: '1px solid #a855f7' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-purple" style={{ background: '#7e22ce' }}>Scénario 5</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>Narrateur Workers AI</h4>
              <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>0,00 € Gratuit</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              Appel direct au modèle <strong>Llama 3.3 70B sur Cloudflare Workers AI</strong> (à l'edge). Zéro coût sur votre quota de neurones gratuits.
            </p>
          </div>
          <button 
            disabled={loading !== null}
            onClick={() => runScenario('workers_ai_narrator', 'Narrateur Workers AI')}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', background: '#7e22ce', borderColor: '#a855f7' }}
          >
            {loading === 'workers_ai_narrator' ? 'Inférence Edge...' : '⚡ Exécuter via Workers AI (0 €)'}
          </button>
        </div>

      </div>

      {/* Live Logs Terminal */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
            Terminal de suivi des événements simulés
          </h4>
          <button onClick={() => setLog([])} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
            Effacer le terminal
          </button>
        </div>
        <div style={{ 
          background: '#090d16', 
          borderRadius: '0.5rem', 
          padding: '0.75rem', 
          border: '1px solid #1e293b', 
          minHeight: '160px', 
          maxHeight: '250px', 
          overflowY: 'auto',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: '#38bdf8',
          lineHeight: 1.5
        }}>
          {log.length === 0 ? (
            <span style={{ color: '#64748b' }}>En attente de déclenchement d'un scénario interactif...</span>
          ) : (
            log.map((l, idx) => (
              <div key={idx} style={{ marginBottom: '0.2rem', whiteSpace: 'pre-wrap' }}>{l}</div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
