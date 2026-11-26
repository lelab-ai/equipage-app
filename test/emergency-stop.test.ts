import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { store } from '../functions/store';

describe('Lot 1 — Bouton d\'Arrêt d\'Urgence et Coupe-Circuit', () => {
  test('L\'arrêt d\'urgence est inactif par défaut', () => {
    store.setEmergencyStop(false);
    const stop = store.getEmergencyStop();
    assert.equal(stop.active, false);
  });

  test('L\'activation de l\'arrêt d\'urgence bloque immédiatement toute exécution d\'agent', () => {
    store.setEmergencyStop(true, 'Test d\'interruption manuelle du sponsor');
    const stop = store.getEmergencyStop();
    assert.equal(stop.active, true);

    // Tentative d'exécution d'un agent
    assert.throws(() => {
      store.addRun({
        agent: 'developpeur',
        action: 'Modification de code',
        model: 'claude-3-5-sonnet',
        provider: 'anthropic',
        tokens_in: 100,
        tokens_out: 50,
        cost_eur: 0.001,
        duration_ms: 500,
        outcome: 'success'
      });
    }, /ARRÊT D'URGENCE ACTIF/);

    // Réinitialisation après test
    store.setEmergencyStop(false);
  });
});
