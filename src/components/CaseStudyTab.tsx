import React from 'react';

export const CaseStudyTab: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Article Header */}
      <div className="card" style={{ borderLeft: '4px solid #38bdf8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-blue">Étude de Cas V1</span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>25 novembre 2026</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>• Lecture : 5 min</span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.3 }}>
          Equipage V1 : Ce que nous avons appris en faisant tourner une équipe logicielle autonome pour moins de 1 € par semaine
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Par <strong>Bruno Delb</strong> (Sponsor) et l'équipe d'agents Equipage
        </p>
      </div>

      {/* Main Content */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.7 }}>
        
        <section>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            1. Le pari initial
          </h3>
          <p>
            Le marché de l'ingénierie logicielle assistée par IA regorge de démonstrations spectaculaires mais rarement reproductibles, où des agents prétendent tout faire de zéro sans contrôle, sans observabilité et sans maîtrise des coûts.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Avec <strong>Equipage</strong>, nous avons pris le contre-pied exact : construire une équipe logicielle virtuelle minimale (Product Owner, Développeur, Relecteur, Sécurité, SRE, Narrateur et deux clients simulés) avec pour mission de concevoir et d'opérer un produit réel — <strong>une page de statut et un journal d'incidents accessible sur equipage.lelab.ai</strong> — sous une contrainte budgétaire stricte : <strong>moins de 30 € par mois</strong>.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            2. Les chiffres bruts de la version 1
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', margin: '0.75rem 0' }}>
            <div style={{ background: '#090d16', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Taux d'autonomie</span>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8' }}>88.5%</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>23/26 actions sans humain</span>
            </div>
            <div style={{ background: '#090d16', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Temps de résolution (MTTR)</span>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981' }}>8 min</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Détection en 72s</span>
            </div>
            <div style={{ background: '#090d16', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Dépense totale V1</span>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a855f7' }}>0.82 €</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Sur plafond de 30 €</span>
            </div>
            <div style={{ background: '#090d16', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Taux de régressions</span>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f59e0b' }}>7.1%</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>1 rollback immédiat</span>
            </div>
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            3. Les trois leçons clés
          </h3>
          <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <strong>Séparer les modèles pour la relecture est non négociable</strong> : L'agent développeur (DeepSeek V3 via OpenRouter) avait omis de tester le cas d'échec SQL sur la route de statut. L'agent relecteur (OpenAI via OpenRouter) a immédiatement bloqué la pull request. Si les deux agents avaient partagé le même modèle, la PR aurait été fusionnée sans obstacle.
            </li>
            <li>
              <strong>Un script déterministe bat toujours un LLM pour la sécurité</strong> : Le rollback automatique en production ne fait appel à aucun prompt. Dès que la sonde de santé post-déploiement renvoie une erreur 500, un script de rollback Cloudflare est déclenché en moins de 15 secondes. L'IA n'intervient qu'après coup, pour diagnostiquer la cause racine et rédiger le postmortem.
            </li>
            <li>
              <strong>Le scoring mathématique protège le backlog de la dérive</strong> : Alex (Client Pressé) voulait imposer un chatbot IA sur la page de statut. La formule du PO a automatiquement attribué un malus de coût maximal (5) et un effort de 4, aboutissant à un score de 2.1 qui a relégué le sujet au rebut sans aucune discussion infinie.
            </li>
          </ol>
        </section>

        <section>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            4. Prochaine étape : la version 2
          </h3>
          <p>
            La boucle complète de la V1 étant validée et mesurée, la Version 2 introduira :
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>L'agent Chaos et sa bibliothèque de 10 scénarios de pannes injectées (au plus 1 par jour).</li>
            <li>L'agent de mise à jour gérant les montées de versions majeures.</li>
            <li><strong>Le pentest autonome hebdomadaire par IA avec Strix</strong> depuis un dépôt privé, avec divulgation publique des failles uniquement après correction en production.</li>
          </ul>
        </section>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem', fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'right' }}>
          Document de synthèse V1 publié sur equipage.lelab.ai • Bruno Delb
        </div>

      </div>

    </div>
  );
};
