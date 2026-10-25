# Build without Google Fonts

- Remove the next/font/google Inter import from the root layout.
- Use a system sans-serif stack with common Chinese font fallbacks.
- Bump the fork version to 1.3.5+csr.2.
- Verify a clean production build and check exported assets for Google font URLs.
- Push the fix and update the application's pinned Git revision.
