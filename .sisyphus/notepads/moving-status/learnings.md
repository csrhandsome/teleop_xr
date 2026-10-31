# Validation

- Frontend: `npm test` passed all 45 tests, including double-trigger timing, release/rearm, stale input reset, and immediate activation.
- Frontend: `npm run build` passed, including TypeScript and static export.
- Python: config reaches clients on connect/reconnect; delay validation rejects negative or non-finite values.
- Browser hardware validation remains for the headset; no robot commands or driver restarts are part of this frontend change.
- Local FastAPI TestClient needed execution outside the restricted sandbox; sandbox execution stalled without test output and was interrupted.
