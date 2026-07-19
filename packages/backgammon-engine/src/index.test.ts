import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyMove,
  createInitialGameState,
  getLegalMoves,
  type DiceRoll,
  type GameState,
  type PlayerColor
} from './index';

const makeRoll = (first: number, second: number): DiceRoll => ({
  first,
  second,
  isDouble: first === second
});

const getMove = (moves: ReturnType<typeof getLegalMoves>, from: number | 'bar', to: number | 'off') =>
  moves.find((move) => move.from === from && move.to === to);

test('initial board setup uses the standard starting positions', () => {
  const state = createInitialGameState();

  assert.equal(state.board.bar.white, 0);
  assert.equal(state.board.bar.black, 0);
  assert.equal(state.board.borneOff.white, 0);
  assert.equal(state.board.borneOff.black, 0);
  assert.equal(state.board.points[23].length, 2);
  assert.equal(state.board.points[12].length, 5);
  assert.equal(state.board.points[7].length, 3);
  assert.equal(state.board.points[5].length, 5);
  assert.equal(state.board.points[0].length, 2);
  assert.equal(state.board.points[11].length, 5);
  assert.equal(state.board.points[16].length, 3);
  assert.equal(state.board.points[18].length, 5);
});

test('legal moves from the initial position include the expected white moves', () => {
  const state = createInitialGameState();
  const moves = getLegalMoves(state, 'white', makeRoll(3, 5));

  assert.ok(getMove(moves, 23, 20));
  assert.ok(getMove(moves, 12, 9));
});

test('hitting a blot moves the opposing checker to the bar', () => {
  const state: GameState = {
    board: {
      points: Array.from({ length: 24 }, () => []),
      bar: { white: 0, black: 0 },
      borneOff: { white: 0, black: 0 }
    },
    currentPlayer: 'white'
  };

  state.board.points[10] = [{ color: 'white', point: 10 }];
  state.board.points[7] = [{ color: 'black', point: 7 }];

  const result = applyMove(state, { color: 'white', from: 10, to: 7, dieValue: 3 });

  assert.equal(result.legal, true);
  assert.equal(result.nextState.board.bar.black, 1);
  assert.equal(result.nextState.board.points[7][0].color, 'white');
});

test('entering from the bar is required before moving other checkers', () => {
  const state = createInitialGameState();
  state.board.bar.white = 1;
  state.board.points[5] = [{ color: 'white', point: 5 }];

  const moves = getLegalMoves(state, 'white', makeRoll(3, 5));

  assert.ok(getMove(moves, 'bar', 20));
  assert.equal(getMove(moves, 5, 2), undefined);
});

test('backward movement is rejected', () => {
  const state: GameState = {
    board: {
      points: Array.from({ length: 24 }, () => []),
      bar: { white: 0, black: 0 },
      borneOff: { white: 0, black: 0 }
    },
    currentPlayer: 'white'
  };

  state.board.points[5] = [{ color: 'white', point: 5 }];

  const result = applyMove(state, { color: 'white', from: 5, to: 8, dieValue: 3 });

  assert.equal(result.legal, false);
});
