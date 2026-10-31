# Validation

- Frontend production build and TypeScript validation passed; Browserslist reports an existing stale caniuse-lite database warning.
- Existing motion_status tests passed: 3 tests. Existing controller_hints tests passed: 3 tests with one Starlette/httpx deprecation warning.
- Python test auto-discovery initially failed because the unrelated system ROS pytest plugin requires missing lark; disabling plugin auto-loading allowed the relevant tests to pass.
- The 1.3.5+csr.4 wheel was built offline using the successful static export; verified package version, non-placeholder HTML, and JavaScript containing Moving.
