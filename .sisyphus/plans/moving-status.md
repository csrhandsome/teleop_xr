# Double-trigger wrist motion indicator

- Reuse the existing connection wrist panel and display green `moving` after both index triggers meet the configured application deadman delay.
- Keep the existing IK grip engagement logic independent.
- Clear motion status on release, controller loss, stale input, connection loss, or XR visibility/session loss.
- Bump fork version to 1.3.5+csr.3 and validate frontend tests/build and config serialization before pushing.
