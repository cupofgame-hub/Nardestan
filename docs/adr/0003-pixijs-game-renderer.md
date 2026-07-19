# PixiJS Game Renderer

Status: Accepted

## Context

Nardestan needs React application screens and an interactive backgammon board. The board renderer should support rich interaction without mixing presentation code with game-rule logic.

## Decision

React remains responsible for application screens and UI. PixiJS is the selected renderer for the interactive backgammon board, and Phaser is not selected for the MVP.

The renderer must consume engine state and must not contain game-rule logic. PixiJS integration should start only when the engine rules and public engine API are sufficiently stable.

## Consequences

React and PixiJS can evolve within clear responsibilities. Renderer work depends on a stable engine contract, so early UI work should avoid committing to board integration details before the engine API settles.
