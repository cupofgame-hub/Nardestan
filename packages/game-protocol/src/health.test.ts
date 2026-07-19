import assert from 'node:assert/strict';
import test from 'node:test';

import { healthResponseSchema } from './health';

test('accepts the valid current API health payload', () => {
  const payload = {
    status: 'ok',
    service: 'nardestan-api',
    timestamp: new Date().toISOString()
  };

  assert.deepEqual(healthResponseSchema.parse(payload), payload);
});

test('rejects invalid status, service, timestamp or unexpected fields', () => {
  const validPayload = {
    status: 'ok',
    service: 'nardestan-api',
    timestamp: new Date().toISOString()
  };

  const invalidPayloads = [
    { ...validPayload, status: 'degraded' },
    { ...validPayload, service: 'other-api' },
    { ...validPayload, timestamp: 'not-a-date' },
    { ...validPayload, version: '1.0.0' }
  ];

  for (const payload of invalidPayloads) {
    assert.equal(healthResponseSchema.safeParse(payload).success, false);
  }
});
