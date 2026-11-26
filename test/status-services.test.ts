import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { store } from '../functions/store';

describe('Lot 4 & 5 — Page de Statut, Incidents et Rollback Automatique', () => {
  test('Liste les services fondamentaux et leurs métriques de santé', () => {
    const services = store.getServices();
    assert.equal(services.length, 5);
    const apiService = services.find(s => s.id === 'api');
    assert.ok(apiService);
    assert.equal(apiService?.status, 'operational');
    assert.ok((apiService?.uptime_percentage || 0) > 99.0);
  });

  test('L\'ouverture d\'un incident bascule le service en panne et alerte le système', () => {
    const inc = store.openIncident({
      title: 'Perte de connectivité sur les sondes de monitoring',
      severity: 'SEV-1',
      service_id: 'api'
    });

    assert.ok(inc.id.startsWith('INC-'));
    assert.equal(inc.status, 'investigating');

    // Vérifier que le service a été basculé en panne
    const s = store.getServices().find(x => x.id === 'api');
    assert.equal(s?.status, 'major_outage');

    // Résolution et rollback
    const resolved = store.resolveIncident(inc.id, 'Résolu par rollback automatique');
    assert.equal(resolved?.status, 'resolved');
    assert.ok(resolved?.time_to_resolve_seconds! >= 0);

    // Vérifier le rétablissement
    const restoredService = store.getServices().find(x => x.id === 'api');
    assert.equal(restoredService?.status, 'operational');
  });
});
