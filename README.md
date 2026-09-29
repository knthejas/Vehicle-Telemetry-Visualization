# Vehicle Telemetry Visualization

A dependency-free fleet dashboard prototype for speed, battery, vehicle status, and GPS telemetry.

## Run

Requires Node.js 18 or newer.

```sh
npm run dev
```

Open http://localhost:4173. Run automated tests with `npm test`.

## Checks

Run `npm run check` for JavaScript syntax checks and `npm run lint` for ESLint. GitHub Actions runs syntax checks, unit tests, and linting on every push and pull request.

Sample fleet data is in `src/telemetry.js`. The browser exposes `window.ingestTelemetry(packet)` for in-memory updates with `id`, `speed`, `battery`, `lat`, and `lon` fields. See [DESIGN.md](DESIGN.md) and [TEST_CASES.md](TEST_CASES.md).