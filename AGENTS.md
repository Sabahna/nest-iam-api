# Repository Guide for AI Agents

## Project Overview

This repository is `nest-iam-api`, a NestJS gRPC microservice for the Social
Metrica system's Identity and Access Management (IAM), based on `package.json`,
`src/main.ts`, and the module/controller layout.

- Primary framework: NestJS 11 + TypeScript, compiled with `nest build`.
- Runtime model: a gRPC microservice. `src/main.ts` creates a Nest app and
  attaches a `Transport.GRPC` microservice; there is no HTTP server started in
  `main.ts` (Swagger config exists in `src/app.api.swagger.ts` but is not wired
  into `main.ts`).
- Package manager: ambiguous. Both `package-lock.json` and `yarn.lock` exist in
  the tree (`yarn.lock` is listed in `.gitignore`); `deploy.sh` and the README
  use `yarn`. Confirm with the team before assuming one.
- Main entry points:
  - `src/main.ts` boots the app and starts the gRPC microservice, reading
    `IAM_GRPC_URL` (falling back to `127.0.0.1:${PORT ?? 5010}`).
  - `src/app.module.ts` registers `NestIAMModule.forRoot(...)` (from the
    `nest-iam` library) plus the six feature modules listed in `appModules`.
  - `src/utils/protos.ts` builds `serverProtos` (package name, service name,
    proto path) from `sm-protobuf`'s proto files and exports `protoRoot`.
- High-level architecture:
  - Thin gRPC controllers. Each `src/<domain>/<domain>.controller.ts` maps
    `@GrpcMethod(...)` handlers directly onto `NestIamCoreService` methods from
    the `nest-iam` library. This service exposes the actual IAM logic; this repo
    mostly adapts gRPC requests to it.
  - Domains: `scope`, `resource`, `permission`, `role`, `user`, `token` — each
    with a `*.module.ts` and `*.controller.ts` under `src/<domain>/`.
  - `src/protobuf/**` holds generated TypeScript proto types (`*.pb.ts`),
    generated from `sm-protobuf` via `scripts/generate-iam-proto.sh`.

## System Context

gRPC microservice exposing the `nest-iam` IAM library. Consumes `nest-iam` and `sm-protobuf` (the contract spine). Called over gRPC by `social-metrica-backend` for auth. Any gRPC contract change lives in `sm-protobuf` — update the spine and every consumer together. Full cross-repo system map: `../sm-protobuf/SYSTEM.md`.

## Common Commands

- Install dependencies: `npm install` (or `yarn install`).
  - Note the lockfile ambiguity above; match whatever the team standardizes on.
- Start (dev, watch): `npm run start:dev`
  - Runs `nest start --watch`.
- Start (dev): `npm run start` (`nest start`).
- Start (debug, watch): `npm run start:debug`.
- Start (production): `npm run start:prod` (`node dist/main`, requires a prior
  build).
- Build: `npm run build` (`nest build`).
- Lint: `npm run lint`
  - Runs `eslint "{src,apps,libs,test}/**/*.ts" --fix`. Note: this auto-fixes.
- Format: `npm run format` (`prettier --write` over `src` and `test`).
- Test (unit): `npm test` (`jest`).
  - Jest config (in `package.json`) uses `rootDir: src` and
    `testRegex: .*\.spec\.ts$`. No `*.spec.ts` files exist under `src`, so this
    currently discovers no tests. Do not claim unit tests passed.
- Test (watch): `npm run test:watch`.
- Test (coverage): `npm run test:cov`.
- Test (e2e): `npm run test:e2e` (`jest --config ./test/jest-e2e.json`).
  - `test/app.e2e-spec.ts` is the default Nest scaffold test: it does a
    `GET /` and expects `"Hello World!"`. There is no `AppController` in `src`
    and no HTTP server wired in `main.ts`, so this test is stale scaffolding and
    is expected to fail as written. Treat it as a known gap, not a real check.
- Regenerate proto types: `npm run proto:generate:iam`
  - Runs `scripts/generate-iam-proto.sh`, which requires `protoc` on PATH and
    `protoc-gen-ts_proto` in `node_modules/.bin`. It reads `.proto` files from
    `node_modules/sm-protobuf/proto/iam` (excluding `iam.proto`) and writes
    `*.pb.ts` into `src/protobuf/`.
- Deploy: `npm run deploy`
  - Runs `deploy.sh` which builds, rsyncs `dist/` to a hard-coded production
    host over SSH, and `pm2 reload`s it. Do NOT run this unless the user
    explicitly requests deployment.

## Repository Structure

- `src/main.ts`: microservice bootstrap and gRPC transport wiring.
- `src/app.module.ts`: root module; `NestIAMModule.forRoot(...)` + feature
  modules (`appModules`).
- `src/app.api.swagger.ts`: Swagger `DocumentBuilder` config. Exported but not
  invoked from `main.ts` (dead/optional wiring at present).
- `src/<domain>/`: one folder per IAM domain (`scope`, `resource`, `permission`,
  `role`, `user`, `token`), each a `*.module.ts` + `*.controller.ts`.
- `src/protobuf/**`: generated proto TS (`*.pb.ts`) for `iam/*` and
  `google/protobuf/*`. Generated output — regenerate via the proto script rather
  than hand-editing.
- `src/utils/protos.ts`: proto path/package/service registry consumed by
  `main.ts`.
- `test/`: e2e Jest config and the scaffold e2e spec.
- `scripts/generate-iam-proto.sh`: proto codegen.
- `deploy.sh`, `ecosystem.config.js`: deployment (rsync + SSH) and PM2 process
  config.
- `dist/`: build output. Do not edit manually.
- `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`, `eslint.config.mjs`,
  `.prettierrc`: build/lint/format config.
- `websm.pem`: an SSH private key committed at repo root. Treat as sensitive;
  never read, copy, print, or commit its contents. Flag it if the user is
  working near it.

## Architecture Notes

- gRPC wiring:
  - The microservice registers multiple packages/proto paths at once, computed
    from `serverProtos` in `src/utils/protos.ts` (deduped package names, mapped
    proto paths). Proto files are loaded from `node_modules/sm-protobuf/proto`.
  - Loader options in `main.ts`: `longs: Number`, `defaults: true`,
    `arrays: true`, with `includeDirs: [protoRoot]`. Match these if you touch
    loader config.
- Controllers:
  - Every controller is annotated `@Public(true)` (from `nest-iam`) and
    delegates each `@GrpcMethod` to `NestIamCoreService`. Adding a new gRPC
    method means: add the RPC to the proto in `sm-protobuf`, regenerate types,
    then map it in the relevant controller.
  - Some handlers reshape results (e.g. `getUsers` wraps items as
    `{ items }`; `addRoleToUser`/`deleteRoleFromUser` return `{}`). Follow the
    nearby handler's request/response shaping.
- Contract source of truth:
  - Proto types under `src/protobuf` are generated from `sm-protobuf`. Do not
    edit them by hand; change the proto in `sm-protobuf` and regenerate. See the
    System Context section for cross-repo coordination rules.
- IAM logic:
  - The real IAM behavior lives in the `nest-iam` library (a GitHub dependency),
    configured via `NestIAMModule.forRoot(...)` with `provider`/`url` from env.
    Provider support noted in the README: MongoDB (needs replication) and
    PostgreSQL.
- Configuration:
  - `@nestjs/config` `ConfigModule.forRoot({ isGlobal: true })` is loaded.
    Env is read directly via `process.env` in `main.ts`, `app.module.ts`, and
    `app.api.swagger.ts`.

## Coding Conventions

- Language/style: TypeScript with NestJS decorators. Prettier config:
  `tabWidth: 2`, `singleQuote: false`, `trailingComma: "all"`. Double quotes are
  the norm in `src` (note the e2e scaffold file uses single quotes — legacy).
- TypeScript: `strictNullChecks: true` but `noImplicitAny: false` and
  `strictBindCallApply: false` (see `tsconfig.json`). Not full `strict`.
- Naming: files are `<domain>.controller.ts` / `<domain>.module.ts`; generated
  proto files use the `.pb.ts` suffix (set by the proto script). Keep new domain
  files consistent with this pattern.
- Imports: proto types are imported from `../protobuf/iam/*.pb`, often as
  `type`-only imports for request types. Follow that in new controllers.
- Modules: register new feature modules in `appModules` in `src/app.module.ts`
  so they are both mounted and (potentially) included in Swagger.

## Testing Guidance

- Test framework: Jest (`jest` + `ts-jest`), configured in `package.json` (unit)
  and `test/jest-e2e.json` (e2e).
- Unit test naming/location: `*.spec.ts` under `src` (`rootDir: src`). None
  currently exist.
- e2e test naming/location: `test/*.e2e-spec.ts`. The one present is stale
  scaffold and expects an HTTP endpoint this service does not expose.
- Mocking conventions: Unknown from repo (no example tests to follow).
- Because no meaningful tests exist yet, validate changes with:
  - `npm run lint`
  - `npm run build`
  - Manual gRPC verification against a running instance where feasible.
- If you add tests, prefer unit `*.spec.ts` next to the controller/module under
  test and document any new command here.

## Safe Change Rules

- Do not hand-edit generated `src/protobuf/**`; regenerate from `sm-protobuf`.
- Do not run `npm run deploy` or `deploy.sh` unless explicitly asked.
- Never read, print, copy, or commit `websm.pem` or any private key.
- Do not commit secrets. Note that `ecosystem.config.js` currently contains
  hard-coded connection strings and secret-looking values; do not duplicate
  those into docs, logs, or code review summaries, and flag them if asked to
  harden config.
- `npm run lint` auto-fixes (`--fix`); review its diffs before committing.
- Do not change proto package/service names or gRPC method signatures without
  coordinating the change in `sm-protobuf` and every consumer.

## Environment Variables

Read directly from `process.env` (no `.env.example` present; `.env` is
gitignored). Observed usage:

- `IAM_GRPC_URL` / `PORT`: gRPC bind address (`main.ts`).
- `NESTIAM_PROVIDER`, `NESTIAM_URL`: IAM backing store (`app.module.ts`,
  `ecosystem.config.js`).
- `PRODUCTION_API`: Swagger production server URL (`app.api.swagger.ts`).
- `METABASE_EMBEDDING_SECRET_KEY`, `METABASE_DASHBOARD_ID`,
  `METABASE_TOKEN_TTL_SECONDS`: present in `ecosystem.config.js` env; no
  consuming code was found in `src` during inspection.

Note: `NestIAMModule.forRoot` currently passes a hard-coded `secret: "secret"`
and short token lifetimes in `app.module.ts`. Treat these as placeholders; do
not assume they are production-safe.

## Known Gaps / Unknowns

- Unknown from repo: canonical package manager (npm vs yarn lockfiles both
  present).
- Unknown from repo: real unit tests, mocking conventions, and whether the e2e
  scaffold is intended to be replaced or removed.
- Unknown from repo: required Node version (no `.nvmrc`/`.node-version`).
- The Swagger setup (`src/app.api.swagger.ts`) is not wired into `main.ts`; it
  is unclear whether an HTTP surface is intended.
