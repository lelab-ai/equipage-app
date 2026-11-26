import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { store } from '../functions/store';

describe('Lot 2 — Algorithme de Priorisation du Product Owner (PO)', () => {
  test('Calcule exactement le score selon la formule explicite', () => {
    // Score = ((V * F * A) / E) - (M * 0.25)
    // V=4, F=4, A=4, E=2, M=1 => ((4 * 4 * 4) / 2) - 0.25 = 32 - 0.25 = 31.75
    const score = store.calculateScore(4, 4, 4, 2, 1);
    assert.equal(score, 31.75);
  });

  test('Rejette toute proposition qui ne cite pas sa source', () => {
    assert.throws(() => {
      store.addItem({
        title: 'Fonctionnalité sans source',
        description: 'Test d\'invalidation',
        source: '',
        status: 'backlog',
        valeur: 3,
        frequence: 3,
        adequation: 3,
        effort: 2,
        malus_cout: 0
      });
    }, /Règle impérative PO violée/);
  });

  test('Respecte la limite stricte de travail en cours (WIP <= 3)', () => {
    const initialItems = store.getItems();
    const currentWip = initialItems.filter(i => i.work_in_progress === 1).length;
    assert.ok(currentWip <= 3, 'WIP initial doit être <= 3');

    // Trouver un item prêt pour le passer en cours si WIP < 3
    const pretItem = initialItems.find(i => i.status === 'pret');
    if (pretItem && currentWip < 3) {
      store.updateItemStatus(pretItem.id, 'en_cours');
      const updatedWip = store.getItems().filter(i => i.work_in_progress === 1).length;
      assert.equal(updatedWip, currentWip + 1);
    }
  });

  test('Une décision enregistre sa source et sa justification', () => {
    const dec = store.addDecision({
      item_id: 'TIK-001',
      agent: 'po',
      action: 'PRIORITIZE',
      justification: 'Indispensable pour la vision initiale',
      score: 24.5,
      source: 'sponsor',
      regle_imperative: null
    });

    assert.ok(dec.id.startsWith('DEC-'));
    assert.equal(dec.source, 'sponsor');
    assert.ok(dec.justification.length > 10);
  });
});
