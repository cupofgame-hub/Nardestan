export type PlayerColor = 'white' | 'black';

export type PointIndex = number;

export interface DiceRoll {
  first: number;
  second: number;
  isDouble: boolean;
}

export interface CheckerState {
  color: PlayerColor;
  point: PointIndex;
}

export interface BoardState {
  points: CheckerState[][];
  bar: Record<PlayerColor, number>;
  borneOff: Record<PlayerColor, number>;
}

export interface GameState {
  board: BoardState;
  currentPlayer: PlayerColor;
}

export interface Move {
  color: PlayerColor;
  from: PointIndex | 'bar';
  to: PointIndex | 'off';
  dieValue: number;
}

export interface LegalMove extends Move {
  reason: 'normal' | 'hit' | 'enter-from-bar';
}

export interface MoveResult {
  legal: boolean;
  message?: string;
  nextState: GameState;
}

const pointCount = 24;

const createEmptyBoard = (): BoardState => ({
  points: Array.from({ length: pointCount }, () => []),
  bar: { white: 0, black: 0 },
  borneOff: { white: 0, black: 0 }
});

export const createInitialGameState = (): GameState => {
  const points = Array.from({ length: pointCount }, () => [] as CheckerState[]);

  points[0] = [
    { color: 'black', point: 0 },
    { color: 'black', point: 0 }
  ];
  points[5] = [
    { color: 'white', point: 5 },
    { color: 'white', point: 5 },
    { color: 'white', point: 5 },
    { color: 'white', point: 5 },
    { color: 'white', point: 5 }
  ];
  points[7] = [
    { color: 'black', point: 7 },
    { color: 'black', point: 7 },
    { color: 'black', point: 7 }
  ];
  points[11] = [
    { color: 'black', point: 11 },
    { color: 'black', point: 11 },
    { color: 'black', point: 11 },
    { color: 'black', point: 11 },
    { color: 'black', point: 11 }
  ];
  points[12] = [
    { color: 'white', point: 12 },
    { color: 'white', point: 12 },
    { color: 'white', point: 12 },
    { color: 'white', point: 12 },
    { color: 'white', point: 12 }
  ];
  points[16] = [
    { color: 'black', point: 16 },
    { color: 'black', point: 16 },
    { color: 'black', point: 16 }
  ];
  points[18] = [
    { color: 'white', point: 18 },
    { color: 'white', point: 18 },
    { color: 'white', point: 18 },
    { color: 'white', point: 18 },
    { color: 'white', point: 18 }
  ];
  points[23] = [
    { color: 'white', point: 23 },
    { color: 'white', point: 23 }
  ];

  return {
    board: {
      ...createEmptyBoard(),
      points: points.map((point) => [...point])
    },
    currentPlayer: 'white'
  };
};

const getDirection = (color: PlayerColor): 1 | -1 => (color === 'white' ? -1 : 1);

const getDestinationPoint = (
  from: PointIndex,
  color: PlayerColor,
  dieValue: number
): PointIndex => {
  const direction = getDirection(color);
  return from + direction * dieValue;
};

const isLegalDirection = (from: PointIndex, to: PointIndex, color: PlayerColor): boolean => {
  return color === 'white' ? to < from : to > from;
};

const isPointWithinBoard = (point: PointIndex): boolean => point >= 0 && point < pointCount;

const getPointCheckers = (board: BoardState, pointIndex: PointIndex): CheckerState[] => {
  return board.points[pointIndex] ?? [];
};

export const getLegalMoves = (
  state: GameState,
  color: PlayerColor,
  dice: DiceRoll
): LegalMove[] => {
  const moves: LegalMove[] = [];
  const availableDice = [dice.first, dice.second].filter(
    (value, index, values) => values.indexOf(value) === index
  );

  const addMove = (from: PointIndex, dieValue: number): void => {
    const target = getDestinationPoint(from, color, dieValue);
    if (!isLegalDirection(from, target, color) || !isPointWithinBoard(target)) {
      return;
    }

    const point = getPointCheckers(state.board, target);
    const isBlocked = point.length > 1 && point[0].color !== color;
    const isOpponentBlot = point.length === 1 && point[0].color !== color;

    if (!isBlocked && (point.length === 0 || isOpponentBlot || point[0]?.color === color)) {
      moves.push({
        color,
        from,
        to: target,
        dieValue,
        reason: isOpponentBlot ? 'hit' : 'normal'
      });
    }
  };

  if (state.board.bar[color] > 0) {
    // Checkers on the bar must enter before any other movement is considered.
    for (const dieValue of availableDice) {
      const target = color === 'white' ? 23 - dieValue : dieValue - 1;
      if (!isPointWithinBoard(target)) {
        continue;
      }

      const point = getPointCheckers(state.board, target);
      const isBlocked = point.length > 1 && point[0].color !== color;
      const isOpponentBlot = point.length === 1 && point[0].color !== color;
      if (!isBlocked && (point.length === 0 || isOpponentBlot || point[0]?.color === color)) {
        moves.push({
          color,
          from: 'bar',
          to: target,
          dieValue,
          reason: 'enter-from-bar'
        });
      }
    }

    return moves;
  }

  for (const [index, point] of state.board.points.entries()) {
    if (point.some((checker) => checker.color === color)) {
      for (const dieValue of availableDice) {
        addMove(index, dieValue);
      }
    }
  }

  return moves;
};

export const applyMove = (state: GameState, move: Move): MoveResult => {
  const { board } = state;
  const { color, from, to } = move;

  if (from === 'bar') {
    const target = to as PointIndex;
    if (!isPointWithinBoard(target)) {
      return { legal: false, message: 'Entry point is outside the board.', nextState: state };
    }

    const point = board.points[target];
    const pointIsBlocked = point.length > 1 && point[0].color !== color;
    const isOpponentBlot = point.length === 1 && point[0].color !== color;
    if (pointIsBlocked) {
      return { legal: false, message: 'Destination point is blocked.', nextState: state };
    }

    const nextBoard = createEmptyBoard();
    nextBoard.points = board.points.map((checkers) => [...checkers]);
    nextBoard.bar = { ...board.bar };
    nextBoard.borneOff = { ...board.borneOff };

    if (isOpponentBlot) {
      nextBoard.bar[point[0].color] += 1;
      nextBoard.points[target] = [{ color, point: target }];
    } else {
      nextBoard.points[target] = [...point, { color, point: target }];
    }

    nextBoard.bar[color] -= 1;

    return { legal: true, nextState: { ...state, board: nextBoard } };
  }

  const fromIndex = from as PointIndex;
  const target = to as PointIndex;

  if (!isPointWithinBoard(fromIndex) || !isPointWithinBoard(target)) {
    return { legal: false, message: 'Move is outside the board.', nextState: state };
  }

  const sourcePoint = board.points[fromIndex];
  const sourceChecker = sourcePoint[sourcePoint.length - 1];
  if (!sourceChecker || sourceChecker.color !== color) {
    return { legal: false, message: 'No checker available to move.', nextState: state };
  }

  if (!isLegalDirection(fromIndex, target, color)) {
    return { legal: false, message: 'Backward movement is not allowed.', nextState: state };
  }

  const destinationPoint = board.points[target];
  const destinationOccupiedByOpponent =
    destinationPoint.length === 1 && destinationPoint[0].color !== color;
  if (destinationPoint.length > 1 && destinationPoint[0].color !== color) {
    return { legal: false, message: 'Destination point is blocked.', nextState: state };
  }

  const nextBoard = createEmptyBoard();
  nextBoard.points = board.points.map((checkers) => [...checkers]);
  nextBoard.bar = { ...board.bar };
  nextBoard.borneOff = { ...board.borneOff };

  nextBoard.points[fromIndex] = sourcePoint.slice(0, -1);
  if (destinationOccupiedByOpponent) {
    nextBoard.bar[destinationPoint[0].color] += 1;
    nextBoard.points[target] = [{ color, point: target }];
  } else {
    nextBoard.points[target] = [...destinationPoint, { color, point: target }];
  }

  return {
    legal: true,
    nextState: {
      ...state,
      board: nextBoard
    }
  };
};
