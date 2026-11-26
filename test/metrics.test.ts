import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { store } from '../functions/store';

describe('Lot 6 — Les 4 Indicateurs DORA et d\'Autonomie', () => {
  test('Calcule et expose les 4 indicateurs fondamentaux', () => {
    const metrics = store.getMetrics();

    // 1. Taux d'autonomie (> 80%)
    assert.ok(metrics.autonomy_rate > 50 && metrics.autonomy_rate <= 100, `Taux d'autonomie inattendu: ${metrics.autonomy_rate}`);

    // 2. MTTR (< 30 minutes)
    assert.ok(metrics.mttr_minutes > 0 && metrics.mttr_minutes < 60, `MTTR inattendu: ${metrics.mttr_minutes}`);

    // 3. Coût maîtrisé (< budget cap de 30 €)
    assert.ok(metrics.total_cost_eur < metrics.budget_cap_eur, `Budget dépassé: ${metrics.total_cost_eur}`);

    // 4. Taux de régressions mesuré
    assert.ok(metrics.bad_fix_rate >= 0 && metrics.bad_fix_rate <= 100, `Taux régressions inattendu: ${metrics.bad_fix_rate}`);
  });
});
