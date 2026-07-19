# AGENTS.md

## Mission

Maintain the Nardestan repository as a clean, production-oriented monorepo. Implement only the minimum necessary structure for future product growth.

## Core rules

- Keep the repository simple and maintainable.
- Prefer strict TypeScript and explicit types.
- Do not implement gameplay, payments, Bale tokens, ads, real database access, or Redis without explicit request.
- Do not hardcode secrets, tokens, passwords, or private URLs.
- Use pnpm workspaces and keep package boundaries clear.
- Prefer small, focused files over large abstractions.

## Working expectations

- Preserve the existing app/package layout.
- When adding new packages or apps, keep them isolated and consistent with the current structure.
- Ensure scripts such as pnpm build, pnpm typecheck, and pnpm lint remain meaningful.
- If a command cannot be verified yet, document the limitation clearly.
