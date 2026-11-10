import { useState, useEffect, useCallback } from 'react';
import './App.css';

// Unicode symbols for chess pieces
const PIECE_SYMBOLS = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
};

// Initial starting arrangement of a chess board (8 rows x 8 cols)
const createInitialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  const major = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: major[c], color: 'black' };
    board[1][c] = { type: 'pawn', color: 'black' };
    board[6][c] = { type: 'pawn', color: 'white' };
    board[7][c] = { type: major[c], color: 'white' };
  }
  return board;
};

// Web Audio API synthesizer for instant sound effects (zero external files)
const playAudioEffect = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'capture') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Silently ignore if browser blocked auto-play before user gesture
  }
};

// Helper: Calculate basic candidate moves for a piece
const getPossibleMoves = (board, row, col) => {
  const piece = board[row][col];
  if (!piece) return [];

  const moves = [];
  const isInside = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

  const addMoveIfValid = (r, c) => {
    if (!isInside(r, c)) return false;
    const target = board[r][c];
    if (!target) {
      moves.push({ row: r, col: c, capture: false });
      return true; // continue line
    }
    if (target.color !== piece.color) {
      moves.push({ row: r, col: c, capture: true, targetPiece: target.type });
    }
    return false; // blocked
  };

  const addRay = (dRow, dCol) => {
    let r = row + dRow;
    let c = col + dCol;
    while (isInside(r, c)) {
      const keepGoing = addMoveIfValid(r, c);
      if (!keepGoing) break;
      r += dRow;
      c += dCol;
    }
  };

  // 1. PAWN
  if (piece.type === 'pawn') {
    const dir = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;

    // 1 step forward
    if (isInside(row + dir, col) && !board[row + dir][col]) {
      moves.push({ row: row + dir, col, capture: false });
      // 2 steps forward from initial rank
      if (row === startRow && !board[row + 2 * dir][col]) {
        moves.push({ row: row + 2 * dir, col, capture: false });
      }
    }
    // Diagonal captures
    [-1, 1].forEach((dc) => {
      const r = row + dir;
      const c = col + dc;
      if (isInside(r, c) && board[r][c] && board[r][c].color !== piece.color) {
        moves.push({ row: r, col: c, capture: true, targetPiece: board[r][c].type });
      }
    });
  }

  // 2. KNIGHT
  if (piece.type === 'knight') {
    [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(
      ([dr, dc]) => addMoveIfValid(row + dr, col + dc)
    );
  }

  // 3. BISHOP / QUEEN (diagonals)
  if (piece.type === 'bishop' || piece.type === 'queen') {
    addRay(-1, -1);
    addRay(-1, 1);
    addRay(1, -1);
    addRay(1, 1);
  }

  // 4. ROOK / QUEEN (straights)
  if (piece.type === 'rook' || piece.type === 'queen') {
    addRay(-1, 0);
    addRay(1, 0);
    addRay(0, -1);
    addRay(0, 1);
  }

  // 5. KING
  if (piece.type === 'king') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) addMoveIfValid(row + dr, col + dc);
      }
    }
  }

  return moves;
};

// Formats seconds into MM:SS
const formatTimer = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Converts move coordinates into chess notation (e.g. e4, Nf3, exd5)
const toAlgebraic = (piece, from, to, isCapture) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const toSquare = `${files[to.col]}${8 - to.row}`;

  if (piece.type === 'pawn') {
    return isCapture ? `${files[from.col]}x${toSquare}` : toSquare;
  }
  const prefixMap = { knight: 'N', bishop: 'B', rook: 'R', queen: 'Q', king: 'K' };
  const prefix = prefixMap[piece.type] || '';
  return `${prefix}${isCapture ? 'x' : ''}${toSquare}`;
};

// Component: Piece
function Piece({ piece }) {
  if (!piece) return null;
  return (
    <span className={`piece ${piece.color}`}>
      {PIECE_SYMBOLS[piece.color][piece.type]}
    </span>
  );
}

// Component: Square
function Square({ row, col, piece, isSelected, isLastMove, isPossibleMove, isCapture, onClick }) {
  const isLight = (row + col) % 2 === 0;
  const fileLetter = col === 7 ? 8 - row : null;
  const rankNumber = row === 7 ? String.fromCharCode(97 + col) : null;

  let className = `square ${isLight ? 'light' : 'dark'}`;
  if (isSelected) className += ' selected';
  if (isLastMove) className += ' last-move';
  if (isPossibleMove) className += isCapture ? ' possible-capture' : ' possible-move';

  return (
    <div className={className} onClick={onClick}>
      <Piece piece={piece} />
      {fileLetter && <span className="coord-rank">{fileLetter}</span>}
      {rankNumber && <span className="coord-file">{rankNumber}</span>}
    </div>
  );
}

export default function App() {
  // Game States
  const [board, setBoard] = useState(createInitialBoard);
  const [turn, setTurn] = useState('white');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [captured, setCaptured] = useState({ white: [], black: [] });
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameMode, setGameMode] = useState('bot'); // 'bot' or 'pvp'
  const [whiteTime, setWhiteTime] = useState(300); // 5 minutes
  const [blackTime, setBlackTime] = useState(300);
  const [gameOver, setGameOver] = useState(null);

  // Compute possible moves for selected square
  const possibleMoves = selectedSquare && !gameOver
    ? getPossibleMoves(board, selectedSquare.row, selectedSquare.col)
    : [];

  // Function to execute a move (memoized with useCallback)
  const makeMove = useCallback((from, to) => {
    const newBoard = board.map((row) => [...row]);
    const movingPiece = newBoard[from.row][from.col];
    const targetPiece = newBoard[to.row][to.col];
    const isCapture = Boolean(targetPiece);

    // Audio effect
    playAudioEffect(isCapture ? 'capture' : 'move');

    // Handle captures
    if (targetPiece) {
      if (targetPiece.type === 'king') {
        setGameOver(`${movingPiece.color === 'white' ? 'White' : 'Black'} wins by capturing King!`);
      }
      setCaptured((prev) => ({
        ...prev,
        [targetPiece.color]: [...prev[targetPiece.color], targetPiece],
      }));
    }

    // Pawn promotion (auto-promote to Queen for simplicity)
    if (movingPiece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
      movingPiece.type = 'queen';
    }

    // Apply movement
    newBoard[to.row][to.col] = movingPiece;
    newBoard[from.row][from.col] = null;

    // Record notation in move history
    const notation = toAlgebraic(movingPiece, from, to, isCapture);
    setMoveHistory((prev) => [...prev, { piece: movingPiece, notation, color: movingPiece.color }]);

    // Update state
    setBoard(newBoard);
    setSelectedSquare(null);
    setLastMove({ from, to });
    setTurn((prevTurn) => (prevTurn === 'white' ? 'black' : 'white'));
  }, [board]);

  // User click on square
  const handleSquareClick = (r, c) => {
    if (gameOver) return;
    if (gameMode === 'bot' && turn === 'black') return; // wait for computer

    const clickedPiece = board[r][c];

    // Select piece of current turn
    if (clickedPiece && clickedPiece.color === turn) {
      setSelectedSquare({ row: r, col: c });
      return;
    }

    // Move to destination
    if (selectedSquare) {
      const validMove = possibleMoves.find((m) => m.row === r && m.col === c);
      if (validMove) {
        makeMove(selectedSquare, { row: r, col: c });
      } else {
        setSelectedSquare(null);
      }
    }
  };

  // REACT HOOK 1: Clock Timer with useEffect
  useEffect(() => {
    if (gameOver || moveHistory.length === 0) return;

    const interval = setInterval(() => {
      if (turn === 'white') {
        setWhiteTime((t) => {
          if (t <= 1) {
            setGameOver('Black wins on time!');
            return 0;
          }
          return t - 1;
        });
      } else {
        setBlackTime((t) => {
          if (t <= 1) {
            setGameOver('White wins on time!');
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    // Cleanup function: clears timer when turn changes or component unmounts
    return () => clearInterval(interval);
  }, [turn, gameOver, moveHistory.length]);

  // REACT HOOK 2: Computer Bot AI with useEffect
  useEffect(() => {
    if (gameMode !== 'bot' || turn !== 'black' || gameOver) return;

    // Small delay so bot feels realistic
    const botTimeout = setTimeout(() => {
      const blackMoves = [];

      // Find all possible legal moves for all black pieces
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (board[r][c] && board[r][c].color === 'black') {
            const moves = getPossibleMoves(board, r, c);
            moves.forEach((m) => {
              blackMoves.push({ from: { row: r, col: c }, to: { row: m.row, col: m.col }, moveInfo: m });
            });
          }
        }
      }

      if (blackMoves.length === 0) {
        setGameOver('Game over: White wins!');
        return;
      }

      // Prioritize captures first (smart bot)
      const captures = blackMoves.filter((m) => m.moveInfo.capture);
      const chosenMove = captures.length > 0
        ? captures[Math.floor(Math.random() * captures.length)]
        : blackMoves[Math.floor(Math.random() * blackMoves.length)];

      makeMove(chosenMove.from, chosenMove.to);
    }, 500);

    return () => clearTimeout(botTimeout);
  }, [turn, gameMode, gameOver, board, makeMove]);

  const handleReset = () => {
    setBoard(createInitialBoard());
    setTurn('white');
    setSelectedSquare(null);
    setLastMove(null);
    setCaptured({ white: [], black: [] });
    setMoveHistory([]);
    setWhiteTime(300);
    setBlackTime(300);
    setGameOver(null);
  };

  return (
    <div className="app">
      <header>
        <h1>React Chess</h1>
        <p className="subtitle">Learn React with interactive state, hooks, audio, and an AI opponent</p>
      </header>

      <div className="game-layout">
        <div className="board-column">
          {/* Black Player Bar */}
          <div className="player-bar">
            <div className="player-info">
              <span className="player-name">
                {gameMode === 'bot' ? '🤖 Computer (Black)' : 'Black Player'}
              </span>
              <div className="captured-inline">
                {captured.white.map((p, i) => (
                  <Piece key={i} piece={p} />
                ))}
              </div>
            </div>
            <div className={`player-timer ${turn === 'black' && !gameOver ? 'active' : ''} ${blackTime < 30 ? 'low-time' : ''}`}>
              {formatTimer(blackTime)}
            </div>
          </div>

          {/* Chessboard */}
          <div className="board">
            {board.map((rowArr, r) =>
              rowArr.map((piece, c) => {
                const isSelected = selectedSquare && selectedSquare.row === r && selectedSquare.col === c;
                const isLastMove = lastMove && ((lastMove.from.row === r && lastMove.from.col === c) || (lastMove.to.row === r && lastMove.to.col === c));
                const moveInfo = possibleMoves.find((m) => m.row === r && m.col === c);

                return (
                  <Square
                    key={`${r}-${c}`}
                    row={r}
                    col={c}
                    piece={piece}
                    isSelected={isSelected}
                    isLastMove={isLastMove}
                    isPossibleMove={Boolean(moveInfo)}
                    isCapture={moveInfo?.capture}
                    onClick={() => handleSquareClick(r, c)}
                  />
                );
              })
            )}
          </div>

          {/* White Player Bar */}
          <div className="player-bar">
            <div className="player-info">
              <span className="player-name">You (White)</span>
              <div className="captured-inline">
                {captured.black.map((p, i) => (
                  <Piece key={i} piece={p} />
                ))}
              </div>
            </div>
            <div className={`player-timer ${turn === 'white' && !gameOver ? 'active' : ''} ${whiteTime < 30 ? 'low-time' : ''}`}>
              {formatTimer(whiteTime)}
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="sidebar">
          {gameOver && <div className="status-message">{gameOver}</div>}

          <div className="card">
            <div className="card-title">Game Mode</div>
            <div className="mode-toggle">
              <button
                className={`mode-btn ${gameMode === 'bot' ? 'active' : ''}`}
                onClick={() => setGameMode('bot')}
              >
                vs Computer
              </button>
              <button
                className={`mode-btn ${gameMode === 'pvp' ? 'active' : ''}`}
                onClick={() => setGameMode('pvp')}
              >
                Pass & Play
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Move History</div>
            <div className="moves-list">
              {moveHistory.length === 0 && <span style={{ color: '#6b7280' }}>No moves yet</span>}
              {moveHistory.reduce((acc, move, idx) => {
                if (idx % 2 === 0) {
                  acc.push([move]);
                } else {
                  acc[acc.length - 1].push(move);
                }
                return acc;
              }, []).map((pair, turnNum) => (
                <div key={turnNum} className="move-row">
                  <span className="move-num">{turnNum + 1}.</span>
                  <span className="move-white">{pair[0]?.notation}</span>
                  <span className="move-black">{pair[1]?.notation || ''}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-reset" onClick={handleReset}>
            New Game
          </button>
        </aside>
      </div>
    </div>
  );
}
