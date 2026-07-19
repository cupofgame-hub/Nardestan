# Server-Authoritative Matches

Status: Accepted

## Context

Online matches affect competitive state and future economy features. Client-owned game state would make cheating, desynchronization, and disputed outcomes difficult to prevent.

## Decision

Online matches are server-authoritative. The server owns dice generation, legal move validation, turn timers, Time Bank, reconnection state, and the final match result.

Clients send intentions and actions, not trusted final state. Wallet, rewards, ranking, and `fairPlayScore` must never be decided by the client.

## Consequences

The client can focus on input and presentation while the server remains the trusted match coordinator. Server APIs must preserve enough state to resume matches and reject invalid or stale client actions.
