import React from 'react';
import { Approval } from '../../functions/types';

interface GovernanceTabProps {
  approvals: Approval[];
  emergencyStop: boolean;
  onToggleEmergencyStop: () => void;
  onDecideApproval: (id: string, status: 'approved' | 'rejected') => void;
  onResetProject?: () => void;
}

export const GovernanceTab: React.FC<GovernanceTabProps> = ({ 
  approvals, 
  emergencyStop, 
  onToggleEmergencyStop,
  onDecideApproval,
  onResetProject 
}) => {
  const policySteps = [
    { etape: 'Changement de vision ou de périmètre', mode: 'approve', justification: 'Le sponsor humain est le seul garant de la trajectoire stratégique.' },
    { etape: 'Fusion d\'un changement sensible (Auth, Données)', mode: 'approve', justification: 'Validation humaine préalable pour éviter les brèches ou fuites.' },
    { etape: 'Mise en production d\'une feature normale', mode: 'notify', justification: 'Les agents déploient directement en prévenant l\'équipe.' },
    { etape: 'Correctif de sécurité critique', mode: 'approve', justification: 'Revue obligatoire pour s\'assurer de l\'absence d\'effet de bord.' },
    { etape: 'Ajout d\'une nouvelle dépendance npm', mode: 'approve', justification: 'Parade stricte contre le typosquatting et les attaques logicielles.' },
    { etape: 'Demande de clé d\'API tierce', mode: 'approve', justification: 'L\'agent ne choisit jamais l\'emplacement du secret.' },
    { etape: 'Dépassement du budget prévisionnel', mode: 'approve', justification: 'Plafond strict de 30 € mensuel garanti par intervention humaine.' },
    { etape: 'Toute suppression de données SQL', mode: 'approve', justification: 'Protection contre les effacements accidentels.' },
    { etape: 'Retour en arrière automatique (Rollback)', mode: 'auto', justification: 'Réflexe immédiat en cas d\'échec de vérification post-déploiement.' },
    { etape: 'Tri et priorisation du backlog', mode: 'auto', justification: 'Calculé par le PO selon la formule mathématique explicite.' },
    { etape: 'Génération du journal de bord quotidien', mode: 'auto', justification: 'Rédigé par le Narrateur puis soumis à relecture de publication.' },
    { etape: 'Lancement des tests de sécurité passifs ZAP', mode: 'auto', justification: 'Exécution programmée sans impact perturbateur.' }
  ];

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const pastApprovals = approvals.filter(a => a.status !== 'pending');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Emergency Stop Panel */}
      <div className="card" style={{ 
        background: emergencyStop ? 'rgba(244, 63, 94, 0.15)' : '#0f172a', 
        border: emergencyStop ? '2px solid #f43f5e' : '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🛑</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: emergencyStop ? '#fb7185' : '#f8fafc' }}>
              Commutateur d'arrêt d'urgence global (kill switch)
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Cette variable est lue par tous les Workers et scripts d'agents. Lorsqu'elle est activée, aucune exécution LLM, aucun push GitHub ni aucun déploiement ne peut être opéré.
          </p>
        </div>

        <button 
          onClick={onToggleEmergencyStop} 
          className={`btn ${emergencyStop ? 'btn-success' : 'btn-danger'}`}
        >
          {emergencyStop ? 'Désactiver l\'arrêt et rétablir le flux' : 'Déclencher l\'arrêt d\'urgence immédiat'}
        </button>
      </div>

      {/* Pending Human Approvals Queue */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>File d'approbation humaine en attente (canal de validation)</span>
          <span className="badge badge-amber">{pendingApprovals.length} en attente</span>
        </h3>

        {pendingApprovals.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Aucune demande d'approbation en attente. Le système fonctionne dans ses bornes d'autonomie nominales.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingApprovals.map(app => (
              <div key={app.id} style={{ padding: '1rem', background: '#090d16', borderRadius: '0.5rem', border: '1px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>{app.id}</span>
                    <span className="badge badge-amber">{app.action_type}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>par {app.agent}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{app.description}</div>
                  {app.justification && (
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                      Justification : {app.justification}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => onDecideApproval(app.id, 'rejected')} className="btn btn-outline" style={{ fontSize: '0.8rem', borderColor: '#f43f5e', color: '#fb7185' }}>
                    Refuser
                  </button>
                  <button onClick={() => onDecideApproval(app.id, 'approved')} className="btn btn-success" style={{ fontSize: '0.8rem' }}>
                    Approuver (Bruno Delb)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Autonomy Policies Matrix */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>
          Matrice d'autonomie V1 (policies.yaml)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Étape ou action critique</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Mode V1</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Règle de gouvernance associée</th>
              </tr>
            </thead>
            <tbody>
              {policySteps.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, color: '#f8fafc' }}>{p.etape}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {p.mode === 'approve' ? (
                      <span className="badge badge-red">Approve (Validation)</span>
                    ) : p.mode === 'notify' ? (
                      <span className="badge badge-amber">Notify (Notification)</span>
                    ) : (
                      <span className="badge badge-green">Auto (Autonome)</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{p.justification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sponsor Reset Zone */}
      {onResetProject && (
        <div className="card" style={{ 
          background: 'rgba(239, 68, 68, 0.05)', 
          border: '1px dashed #ef4444',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🔄</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f87171', margin: 0 }}>
                Zone réservée au sponsor : remise à zéro du projet (jour 0)
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.35rem 0 0' }}>
              Réinitialise la base SQL D1 à l'état vierge du lancement initial pour observer l'équipe autonome construire l'application depuis le premier ticket.
            </p>
          </div>

          <button 
            onClick={onResetProject}
            className="btn btn-danger"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            Réinitialiser au jour 0
          </button>
        </div>
      )}

    </div>
  );
};
