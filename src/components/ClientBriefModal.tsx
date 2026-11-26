import React from 'react';

interface ClientBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientBriefModal: React.FC<ClientBriefModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }} onClick={onClose}>
      <div 
        className="card" 
        style={{ 
          maxWidth: '850px', 
          width: '100%', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          border: '1px solid #38bdf8',
          boxShadow: '0 0 35px rgba(56, 189, 248, 0.25)',
          padding: '2rem'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🎯</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Demande client initiale et cahier des charges de la V1
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              Le mandat fondateur confié à l'équipe logicielle autonome par le sponsor et les clients cibles.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.85rem' }}
          >
            ✕ Fermer
          </button>
        </div>

        {/* Section 1 : La Commande Initiale (Le Brief Client) */}
        <div style={{ marginBottom: '1.75rem', background: '#0a0f1d', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1. Le brief client fondateur (vision sponsor)
            </span>
            <span className="badge badge-blue">Source : Bruno Delb (sponsor)</span>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
            « Nous voulons une application web autonome de <strong>Page de Statut et Journal d'Incidents en direct</strong> (équivalent à status.github.com ou status.stripe.com) déployée sur Cloudflare Edge. Elle doit surveiller les <strong>5 briques de notre architecture</strong> (API Edge, Base SQL D1, Tableau de bord, Ingestion Webhooks, Authentification &amp; Secrets), mesurer la <strong>latence SQL P95</strong>, ingérer les alertes Sentry et publier des postmortems transparents. Le tout doit être développé, audité et exploité par une <strong>équipe d'agents d'IA autonomes sous gouvernance humaine</strong>, pour un budget mensuel strict inférieur à <strong>30 €</strong>. »
          </p>
        </div>

        {/* Note de cadrage : Quels sont ces 5 composants et existent-ils déjà ? */}
        <div style={{ marginBottom: '1.75rem', background: 'rgba(56, 189, 248, 0.05)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>💡</span>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', margin: 0 }}>
              Quels sont ces 5 composants et sont-ils supposés déjà exister ?
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Pour respecter l'engagement de <strong>zéro mock</strong> sans payer de serveurs externes inutiles, Équipage applique le principe du <em>dogfooding</em> (l'application surveille sa propre infrastructure de production) :
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', fontSize: '0.8rem' }}>
            <div style={{ background: '#090d16', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
              <strong style={{ color: '#f8fafc', display: 'block' }}>1. API Edge (Worker)</strong>
              <span style={{ color: '#94a3b8' }}>L'infrastructure réseau Cloudflare existe, mais les endpoints <code>/api/status</code> et <code>/api/health</code> restent à coder.</span>
            </div>
            <div style={{ background: '#090d16', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
              <strong style={{ color: '#f8fafc', display: 'block' }}>2. Base SQL (Cloudflare D1)</strong>
              <span style={{ color: '#94a3b8' }}>La base existe, mais la sonde de mesure de latence P95 et la persistance des pannes doivent être instrumentées.</span>
            </div>
            <div style={{ background: '#090d16', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
              <strong style={{ color: '#f8fafc', display: 'block' }}>3. Tableau de bord (SPA React)</strong>
              <span style={{ color: '#94a3b8' }}>L'interface publique affichant les barres d'uptime quotidiennes sur 90 jours doit être construite de zéro.</span>
            </div>
            <div style={{ background: '#090d16', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
              <strong style={{ color: '#f8fafc', display: 'block' }}>4. Ingestion Webhooks</strong>
              <span style={{ color: '#94a3b8' }}>Le récepteur d'alertes externes (Sentry pour les pannes réelles et GitHub pour la CI) doit être connecté.</span>
            </div>
            <div style={{ background: '#090d16', padding: '0.6rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #1e293b' }}>
              <strong style={{ color: '#f8fafc', display: 'block' }}>5. Authentification &amp; Secrets</strong>
              <span style={{ color: '#94a3b8' }}>L'isolation des variables d'environnement (OpenRouter, Cloudflare) et le contrôle d'accès du sponsor.</span>
            </div>
          </div>
        </div>

        {/* Section 2 : Ce qui est en cours de développement (Sprint Actuel) */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📦</span> Ce que l'équipe d'agents développe actuellement (sprint 1)
          </h3>

          <div style={{ background: '#090d16', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-amber" style={{ marginRight: '0.5rem' }}>Ticket actif</span>
                <span className="mono" style={{ color: '#38bdf8', fontWeight: 700 }}>TIK-001</span>
                <span style={{ marginLeft: '0.5rem', fontWeight: 600, color: '#f8fafc' }}>
                  Page de statut publique et surveillance des 5 services fondamentaux
                </span>
              </div>
              <span className="badge badge-green">Score du PO : 37.5 (priorité 1)</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Mise en place du socle applicatif de production et des sondes de santé pour les 5 briques du système :
            </p>

            {/* Checklist des critères d'acceptation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <div>
                  <strong>Exposition des API à l'edge :</strong> Création de <code>/api/status</code> (état global) et <code>/api/health</code> (latence D1 SQL P95 et coupe-circuit).
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <div>
                  <strong>Surveillance des 5 services fondamentaux :</strong> Edge API Worker, Base SQL Cloudflare D1, Tableau de bord React, Ingestion Sentry/Webhooks, et Authentification/Secrets.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <div>
                  <strong>Grille d'uptime sur 90 jours :</strong> Visualisation journalière de la disponibilité et calcul automatique du SLA global.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <div>
                  <strong>Couverture de tests unitaires (TDD) :</strong> Validation mathématique de la formule de disponibilité et protection contre les divisions par zéro.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <div>
                  <strong>Audit croisé obligatoire :</strong> Relecture indépendante par un modèle de fondation concurrente (OpenAI) pour éliminer les failles SQL et faiblesses d'architecture.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 : Les Personas Clients Simulés et leurs Exigences Contradictoires */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👥</span> Les personas clients qui soumettent les besoins
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.85rem' }}>
            {/* Alex */}
            <div style={{ background: '#0a0f1d', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#f59e0b' }}>Alex (client pressé)</strong>
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Vélocité</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Fondateur de startup B2B. Exige des métriques en temps réel, refuse les délais de bureaucratie et menace d'aller chez la concurrence si les fonctionnalités prennent plus de 2 sprints.
              </p>
            </div>

            {/* Claire */}
            <div style={{ background: '#0a0f1d', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#c084fc' }}>Claire (client sécurité)</strong>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Conformité</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                RSSI dans le secteur bancaire. Exige des requêtes SQL SQLite préparées, zéro fuite de secrets, des audits croisés rigoureux et bloque toute nouvelle dépendance non auditée.
              </p>
            </div>

            {/* Bruno Delb */}
            <div style={{ background: '#0a0f1d', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>Bruno Delb (sponsor)</strong>
                <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>Gouvernance</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Sponsor officiel du projet. Détient le droit de veto exclusif sur les changements d'architecture, impose le plafond strict de 30 € et peut actionner le coupe-circuit d'urgence.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Sources de référence : <code>VISION.md</code>, <code>docs/arene-v1.md</code> et <code>decisions/ADR-001.md</code>.
          </span>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.45rem 1.25rem' }}>
            Compris, retour au projet
          </button>
        </div>

      </div>
    </div>
  );
};
