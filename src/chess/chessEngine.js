import { Chess } from 'chess.js';

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export const PIECE_NAMES = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King',
};

/**
 * Converts a standard chess square string (e.g. 'e4') into 3D world coordinates [x, y, z].
 * Board is centered at [0, 0, 0].
 * Each square is 1 unit x 1 unit.
 * White pieces start at positive Z, Black at negative Z.
 */
export function squareTo3D(square) {
  if (!square || square.length < 2) return [0, 0, 0];
  const file = square[0].toLowerCase();
  const rank = parseInt(square[1], 10);

  const fileIdx = FILES.indexOf(file);
  const rankIdx = 8 - rank; // 0 for rank 8, 7 for rank 1

  const x = fileIdx - 3.5;
  const z = rankIdx - 3.5;
  return [x, 0, z];
}

/**
 * Converts 3D world coordinates [x, z] back into a square name ('e4').
 */
export function coordsToSquare(x, z) {
  const fileIdx = Math.round(x + 3.5);
  const rankIdx = Math.round(z + 3.5);

  if (fileIdx < 0 || fileIdx > 7 || rankIdx < 0 || rankIdx > 7) return null;
  return `${FILES[fileIdx]}${8 - rankIdx}`;
}

/**
 * Creates a new Chess.js game instance
 */
export function createChessGame(fen) {
  return new Chess(fen);
}

/**
 * Returns legal moves for a given square
 */
export function getLegalMovesForSquare(game, square) {
  if (!game || !square) return [];
  try {
    return game.moves({ square, verbose: true });
  } catch {
    return [];
  }
}

/**
 * Returns captured pieces separated by color
 */
export function getCapturedPieces(game) {
  if (!game) return { white: [], black: [] };
  const history = game.history({ verbose: true });
  const whiteCaptured = [];
  const blackCaptured = [];

  history.forEach((m) => {
    if (m.captured) {
      if (m.color === 'w') {
        whiteCaptured.push(m.captured);
      } else {
        blackCaptured.push(m.captured);
      }
    }
  });

  return { white: whiteCaptured, black: blackCaptured };
}

/**
 * Calculates net material advantage from White's perspective (+ for White, - for Black)
 */
export function calculateMaterialAdvantage(game) {
  const { white, black } = getCapturedPieces(game);
  const whiteScore = white.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
  const blackScore = black.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
  return whiteScore - blackScore;
}

/**
 * Finds the square of the king that is currently in check
 */
export function getCheckKingSquare(game) {
  if (!game || !game.isCheck()) return null;
  const turn = game.turn();
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === turn) {
        return piece.square;
      }
    }
  }
  return null;
}

