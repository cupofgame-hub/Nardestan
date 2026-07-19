# Shared Backgammon Engine

Status: Accepted

## Context

Nardestan needs the same backgammon rules to drive local UI, bots, and online match validation. Duplicating rule logic across apps would make behavior drift likely and would make fair play harder to verify.

## Decision

`packages/backgammon-engine` is the single source of truth for backgammon rules. The engine must remain deterministic and independent from React, rendering, HTTP, WebSocket, database access, and the Bale SDK.

UI, Bot, and server code must consume the engine API instead of implementing duplicate game-rule logic. Random dice values must be generated outside the engine and supplied as inputs.

## Consequences

Engine behavior can be tested directly and reused across product surfaces. Integrations must translate their inputs into engine calls and keep platform-specific concerns outside the engine package.
