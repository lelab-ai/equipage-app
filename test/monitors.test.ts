import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { store, isValidPublicHttpUrl } from '../functions/store';

describe('Option A — Moniteurs HTTP Externes & Défense Anti-SSRF', () => {
  test('Validation stricte anti-SSRF sur les URLs saisies', () => {
    // 1. URLs publiques valides
    assert.equal(isValidPublicHttpUrl('https://api.github.com').valid, true);
    assert.equal(isValidPublicHttpUrl('https://status.stripe.com/health').valid, true);
    assert.equal(isValidPublicHttpUrl('http://my-company-saas.fr').valid, true);

    // 2. Rejet des protocoles non HTTP/HTTPS
    assert.equal(isValidPublicHttpUrl('file:///etc/passwd').valid, false);
    assert.equal(isValidPublicHttpUrl('ftp://ftp.server.com').valid, false);
    assert.equal(isValidPublicHttpUrl('javascript:alert(1)').valid, false);

    // 3. Rejet strict des IP et domaines privés (Défense Anti-SSRF)
    assert.equal(isValidPublicHttpUrl('http://localhost:3000').valid, false);
    assert.equal(isValidPublicHttpUrl('http://127.0.0.1/admin').valid, false);
    assert.equal(isValidPublicHttpUrl('http://0.0.0.0:8080').valid, false);
    assert.equal(isValidPublicHttpUrl('http://10.0.0.5/secrets').valid, false);
    assert.equal(isValidPublicHttpUrl('http://192.168.1.1/router').valid, false);
    assert.equal(isValidPublicHttpUrl('http://172.16.0.1').valid, false);
    assert.equal(isValidPublicHttpUrl('http://169.254.169.254/latest/meta-data').valid, false);
  });

  test('Ajout et consultation d\'un moniteur externe autonome', () => {
    const initialList = store.getMonitors();
    assert.ok(initialList.length >= 2);

    const newMon = store.addMonitor({
      name: 'Plateforme Client Test',
      url: 'https://client-production.com/health',
      interval_seconds: 30,
      timeout_ms: 3000
    });

    assert.ok(newMon.id.startsWith('MON-'));
    assert.equal(newMon.name, 'Plateforme Client Test');
    assert.equal(newMon.url, 'https://client-production.com/health');
    assert.equal(newMon.status, 'operational');
    assert.ok(newMon.last_latency_ms !== null);

    const updatedList = store.getMonitors();
    assert.equal(updatedList.length, initialList.length + 1);
    const found = updatedList.find(m => m.id === newMon.id);
    assert.ok(found);

    // Suppression
    const deleted = store.deleteMonitor(newMon.id);
    assert.equal(deleted, true);
    assert.equal(store.getMonitors().length, initialList.length);
  });
});
