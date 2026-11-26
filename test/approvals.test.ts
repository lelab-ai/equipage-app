import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { store } from '../functions/store';

describe('Lot 1 & 4 — Gouvernance et Approbations Humaines', () => {
  test('Enregistre une nouvelle demande d\'approbation sensible', () => {
    const app = store.addApproval({
      action_type: 'fusion_sensible',
      description: 'Changement de schéma SQL pour la table runs',
      agent: 'developpeur',
      mode: 'approve',
      justification: 'Ajout d\'index pour réduire les coûts',
      expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
    });

    assert.ok(app.id.startsWith('APP-'));
    assert.equal(app.status, 'pending');
    assert.equal(app.mode, 'approve');
  });

  test('Permet au sponsor Bruno Delb d\'approuver ou rejeter', () => {
    const app = store.addApproval({
      action_type: 'nouvelle_dependance',
      description: 'Ajout d\'un SDK externe',
      agent: 'developpeur',
      mode: 'approve',
      expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
    });

    const approved = store.decideApproval(app.id, 'approved', 'Bruno Delb');
    assert.equal(approved?.status, 'approved');
    assert.equal(approved?.decided_by, 'Bruno Delb');
    assert.ok(approved?.decided_at);
  });
});
