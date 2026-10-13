# AGENTS.md

This repository is a Playwright-based API test suite for the Conduit API. The project is organized around typed request helpers, custom expectations, and schema validation rather than UI automation.

## Project overview

- Test runner: Playwright, configured in [playwright.config.ts](playwright.config.ts)
- Runtime config and environment variables: [api-test.config.ts](api-test.config.ts)
- Dependency and script metadata: [package.json](package.json)
- Test suite entry points: [tests/smoke.spec.ts](tests/smoke.spec.ts) and [tests/negative-tests.spec.ts](tests/negative-tests.spec.ts)

## Working commands

- Install dependencies: `npm install`
- Run the full suite: `npx playwright test`
- Run a specific spec: `npx playwright test tests/smoke.spec.ts`
- Run a subset by grep: `npx playwright test --grep "Create and Delete Article"`

There are no custom npm scripts in [package.json](package.json); use Playwright commands directly.

## Environment and config

- The project reads environment variables from `.env` via [api-test.config.ts](api-test.config.ts).
- Required variables are typically:
  - `BASE_URL`
  - `USER_EMAIL`
  - `USER_PASSWORD`
  - optionally `TEST_ENV` to select a runtime environment (`dev` by default)
- Keep credentials out of committed files and use local environment setup instead.

## Architecture and conventions

### Request flow

The central API abstraction is [utils/request-handler.ts](utils/request-handler.ts). Tests should prefer using the `api` fixture from [utils/fixtures.ts](utils/fixtures.ts) and chain methods such as:

- `path()` to set the endpoint
- `params()` for query parameters
- `body()` for JSON payloads
- `headers()` for custom headers
- `clearAuth()` to bypass auth for negative tests
- `getRequest()`, `postRequest()`, `putRequest()`, `deleteRequest()` to assert the expected status code

This helper also validates HTTP status codes and logs recent activity for debugging.

### Auth setup

Authentication is created per worker through [helpers/create-token.ts](helpers/create-token.ts) and injected into the `api` fixture in [utils/fixtures.ts](utils/fixtures.ts). Most tests should use the shared `api` fixture instead of creating ad hoc request contexts.

### Custom assertions and schema validation

- Custom matchers live in [utils/custom-expect.ts](utils/custom-expect.ts)
- Schema validation logic is in [utils/schema-validator.ts](utils/schema-validator.ts)
- JSON schemas for endpoint validation are stored under [response-schemas](response-schemas)

For API assertions, prefer `expect(response).shouldMatchSchema("<group>", "<schema>", true)` when matching an endpoint contract.

## Testing conventions

- Keep test names descriptive and focused on the API behavior under test.
- Use the `api` fixture for all API calls; do not instantiate raw `APIRequestContext` directly in new specs unless absolutely necessary.
- Favor small, deterministic request payloads and reuse helper functions from [utils/data-generator.ts](utils/data-generator.ts).
- Negative tests should explicitly clear auth with `.clearAuth()` when the endpoint is expected to fail without credentials.
- Arrange cleanup via delete/update flows in the same test when creating entities, as shown in [tests/smoke.spec.ts](tests/smoke.spec.ts).

## Files to inspect first when making changes

- [playwright.config.ts](playwright.config.ts)
- [utils/fixtures.ts](utils/fixtures.ts)
- [utils/request-handler.ts](utils/request-handler.ts)
- [tests/smoke.spec.ts](tests/smoke.spec.ts)
- [utils/custom-expect.ts](utils/custom-expect.ts)

## Notes for AI agents

- Do not assume there is a `npm test` script; run Playwright directly.
- Prefer extending the existing request helper and fixture patterns instead of introducing a second request abstraction.
- Keep validation aligned with the repository’s schema-driven approach and the Conduit API contract.
- If you add new API tests, follow the same style and fixture usage already established in the current suite.
