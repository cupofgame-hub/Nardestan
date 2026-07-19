# Nardestan

Nardestan is a mobile-first web backgammon experience for the Bale Mini App ecosystem. The initial repository setup focuses on a clean, production-oriented monorepo structure so future gameplay, economy, and platform features can be built safely.

## Repository layout

- apps/web: Vite + React + TypeScript landing app
- apps/api: Fastify + TypeScript health-check API
- apps/bot: placeholder for future Bale bot/webhook work
- apps/admin: placeholder for future administration tooling
- packages/shared: shared utilities and contracts
- packages/backgammon-engine: future engine logic
- packages/game-protocol: future protocol definitions
- packages/economy: future economy rules and types
- packages/validation: future validation helpers
- docs: product, design, and technical planning documents
- infra: deployment and infrastructure starter assets

## Local setup

1. Install pnpm if needed.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the web app:
   ```bash
   pnpm dev:web
   ```
4. Start the API:
   ```bash
   pnpm dev:api
   ```

## Scripts

- pnpm dev:web
- pnpm dev:api
- pnpm build
- pnpm typecheck
- pnpm lint

## Notes

This repository intentionally does not implement gameplay, payments, ad integrations, Bale tokens, or database connectivity yet.

## Backgammon engine milestone

The initial backgammon engine package now includes deterministic core types, a standard starting board, bar support, hit handling, bar-entry rules, and a small legal-move generator for non-double dice rolls. The implementation is intentionally limited and does not yet cover full backgammon rules, bearing off, or multiplayer.
