import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { PieceDefs, ChessPiece } from './ChessPieces';
import './App.css';

// Material values for advantage and AI evaluation
const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

// Web Audio API Synthesizer (Reliable audio without external asset loading)
const playAudio = (type, enabled = true) => {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'capture') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.14);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'check') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'hint') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else {
      // Move sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Ignore autoplay restriction
  }
};

// Formats seconds into MM:SS
const formatTimer = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Evaluates a move for AI & Hints
const scoreMove = (move) => {
  let score = 0;
  if (move.captured) {
    score += (PIECE_VALUES[move.captured] || 1) * 10;
  }
  // Center control bonus
  if (['d4', 'd5', 'e4', 'e5'].includes(move.to)) {
    score += 5;
  } else if (['c3', 'c4', 'c5', 'c6', 'f3', 'f4', 'f5', 'f6'].includes(move.to)) {
    score += 2;
  }
  if (move.san.includes('+')) score += 3;
  return score;
};

// Component: A single square on the board
function Square({
  squareName,
  piece,
  isLight,
  isSelected,
  isLastMove,
  isInCheck,
  isHintFrom,
  isHintTo,
  isPossibleMove,
  isCapture,
  rankLabel,
  fileLabel,
  onClick,
  onDragStart,
  onDrop
}) {
  let className = `square ${isLight ? 'light' : 'dark'}`;
  if (isSelected) className += ' selected';
  if (isLastMove) className += ' last-move';
  if (isInCheck) className += ' in-check';
  if (isHintFrom) className += ' hint-from';
  if (isHintTo) className += ' hint-to';
  if (isPossibleMove) className += isCapture ? ' possible-capture' : ' possible-move';

  return (
    <div
      className={className}
      onClick={onClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, squareName)}
    >
      {piece && (
        <div
          className="piece-wrapper"
          draggable={Boolean(piece)}
          onDragStart={(e) => onDragStart(e, squareName)}
        >
          <ChessPiece type={piece.type} color={piece.color} />
        </div>
      )}
      {rankLabel && <span className="coord-rank">{rankLabel}</span>}
      {fileLabel && <span className="coord-file">{fileLabel}</span>}
    </div>
  );
}

export default function App() {
  // Official standard chess engine state
  const [game] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());

  // Interaction State
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [hint, setHint] = useState(null);

  // Settings & Controls
  const [gameMode, setGameMode] = useState('bot'); // 'bot' or 'pvp'
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [isFlipped, setIsFlipped] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Clocks & Timer
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [timeoutWinner, setTimeoutWinner] = useState(null);

  const turn = game.turn(); // 'w' or 'b'
  const isGameOver = game.isGameOver() || Boolean(timeoutWinner);
  const isCheck = game.isCheck();

  // Find King square if currently in check
  let checkKingSquare = null;
  if (isCheck) {
    const b = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          checkKingSquare = p.square;
        }
      }
    }
  }

  // Get legal moves for currently selected square
  const legalMoves = selectedSquare && !isGameOver
    ? game.moves({ square: selectedSquare, verbose: true })
    : [];

  // Captured pieces and advantage
  const history = game.history({ verbose: true });
  const whiteCaptured = history.filter((m) => m.color === 'w' && m.captured).map((m) => m.captured);
  const blackCaptured = history.filter((m) => m.color === 'b' && m.captured).map((m) => m.captured);

  const whiteScore = whiteCaptured.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
  const blackScore = blackCaptured.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
  const advantage = whiteScore - blackScore;

  // Make move execution handler
  const handleMove = useCallback((from, to) => {
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (!move) return false;

      // Audio feedback
      if (game.isCheckmate() || game.isCheck()) {
        playAudio('check', soundEnabled);
      } else if (move.captured) {
        playAudio('capture', soundEnabled);
      } else {
        playAudio('move', soundEnabled);
      }

      setLastMove({ from, to });
      setSelectedSquare(null);
      setHint(null);
      setFen(game.fen());
      return true;
    } catch {
      return false;
    }
  }, [game, soundEnabled]);

  // Click on a square
  const handleSquareClick = (square) => {
    if (isGameOver) return;
    if (gameMode === 'bot' && turn === 'b') return;

    const pieceOnSquare = game.get(square);

    // 1. If clicking own piece -> select it
    if (pieceOnSquare && pieceOnSquare.color === turn) {
      setSelectedSquare(square);
      setHint(null);
      return;
    }

    // 2. If a piece is already selected, try to move to the clicked square
    if (selectedSquare) {
      const success = handleMove(selectedSquare, square);
      if (!success) {
        setSelectedSquare(null);
      }
    }
  };

  // Drag and Drop
  const handleDragStart = (e, square) => {
    if (isGameOver) return;
    if (gameMode === 'bot' && turn === 'b') return;
    const p = game.get(square);
    if (p && p.color === turn) {
      setSelectedSquare(square);
      e.dataTransfer.setData('text/plain', square);
    }
  };

  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    const sourceSquare = e.dataTransfer.getData('text/plain');
    if (sourceSquare && sourceSquare !== targetSquare) {
      handleMove(sourceSquare, targetSquare);
    }
  };

  // User-Friendly: Undo
  const handleUndo = () => {
    if (game.history().length === 0 || isGameOver) return;
    if (gameMode === 'bot') {
      game.undo(); // Undo bot
      game.undo(); // Undo player
    } else {
      game.undo();
    }
    setSelectedSquare(null);
    setHint(null);
    setLastMove(null);
    setFen(game.fen());
    playAudio('move', soundEnabled);
  };

  // User-Friendly: Hint
  const handleHint = () => {
    if (isGameOver || turn !== 'w') return;
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return;
    moves.sort((a, b) => scoreMove(b) - scoreMove(a));
    setHint({ from: moves[0].from, to: moves[0].to });
    playAudio('hint', soundEnabled);
  };

  // Reset
  const handleReset = () => {
    game.reset();
    setSelectedSquare(null);
    setLastMove(null);
    setHint(null);
    setWhiteTime(300);
    setBlackTime(300);
    setTimeoutWinner(null);
    setFen(game.fen());
  };

  // Turn Clocks
  useEffect(() => {
    if (isGameOver || history.length === 0) return;

    const timer = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime((t) => {
          if (t <= 1) {
            setTimeoutWinner('Black wins on time! ⌛');
            return 0;
          }
          return t - 1;
        });
      } else {
        setBlackTime((t) => {
          if (t <= 1) {
            setTimeoutWinner('White wins on time! ⌛');
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [turn, isGameOver, history.length]);

  // AI Bot Response
  useEffect(() => {
    if (gameMode !== 'bot' || turn !== 'b' || isGameOver) return;

    const botTimeout = setTimeout(() => {
      const moves = game.moves({ verbose: true });
      if (moves.length === 0) return;

      let chosen;
      if (difficulty === 'easy') {
        chosen = moves[Math.floor(Math.random() * moves.length)];
      } else if (difficulty === 'medium') {
        const captures = moves.filter((m) => m.captured || m.san.includes('+'));
        chosen = captures.length > 0
          ? captures[Math.floor(Math.random() * captures.length)]
          : moves[Math.floor(Math.random() * moves.length)];
      } else {
        // Hard: pick best scored move
        moves.sort((a, b) => scoreMove(b) - scoreMove(a));
        chosen = moves[0];
      }

      handleMove(chosen.from, chosen.to);
    }, 450);

    return () => clearTimeout(botTimeout);
  }, [fen, gameMode, difficulty, turn, isGameOver, game, handleMove]);

  // Board Coordinates (supports flip)
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayedRanks = isFlipped ? [...ranks].reverse() : ranks;
  const displayedFiles = isFlipped ? [...files].reverse() : files;

  // Game Over Status Text
  let gameOverText = null;
  if (timeoutWinner) {
    gameOverText = timeoutWinner;
  } else if (game.isCheckmate()) {
    gameOverText = `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins! 🏆`;
  } else if (game.isDraw()) {
    gameOverText = 'Game drawn! 🤝';
  }

  return (
    <div className="app">
      {/* SVG Definitions */}
      <PieceDefs />

      {/* Header */}
      <header>
        <div className="brand">
          <span className="brand-icon">♞</span>
          <h1>Grandmaster Chess</h1>
        </div>

        <div className="header-actions">
          <button
            className="btn-header"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle sound"
          >
            {soundEnabled ? '🔊 Sound On' : '🔇 Muted'}
          </button>
        </div>
      </header>

      {/* Main Arena */}
      <div className="game-arena">
        {/* Board & Player Column */}
        <div className="board-column">
          {/* Top Player (Black) */}
          <div className="player-bar">
            <div className="player-info">
              <span className="player-avatar">{gameMode === 'bot' ? '🤖' : '👤'}</span>
              <div>
                <span className="player-name">
                  {gameMode === 'bot' ? `Bot (${difficulty})` : 'Black'}
                  {advantage < 0 && <span className="advantage-badge">+{Math.abs(advantage)}</span>}
                </span>
                <div className="captured-strip">
                  {whiteCaptured.map((p, i) => (
                    <span key={i} className="captured-mini">
                      <ChessPiece type={p} color="white" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={`clock ${turn === 'b' && !isGameOver ? 'active' : ''} ${blackTime < 30 ? 'panic' : ''}`}>
              {formatTimer(blackTime)}
            </div>
          </div>

          {/* Wooden Master Board */}
          <div className="board-container">
            <div className="board-inner-frame">
              <div className="board-grid">
                {displayedRanks.map((rank, rIdx) =>
                  displayedFiles.map((file, cIdx) => {
                    const squareName = `${file}${rank}`;
                    const piece = game.get(squareName);
                    const isLight = (rIdx + cIdx) % 2 === 0;

                    const isSelected = selectedSquare === squareName;
                    const isLast = lastMove && (lastMove.from === squareName || lastMove.to === squareName);
                    const isInCheckSquare = checkKingSquare === squareName;
                    const isHintFrom = hint && hint.from === squareName;
                    const isHintTo = hint && hint.to === squareName;

                    const moveInfo = legalMoves.find((m) => m.to === squareName);
                    const isPossibleMove = Boolean(moveInfo);
                    const isCapture = Boolean(moveInfo?.captured);

                    const rankLabel = cIdx === 0 ? rank : null;
                    const fileLabel = rIdx === 7 ? file : null;

                    return (
                      <Square
                        key={squareName}
                        squareName={squareName}
                        piece={piece}
                        isLight={isLight}
                        isSelected={isSelected}
                        isLastMove={isLast}
                        isInCheck={isInCheckSquare}
                        isHintFrom={isHintFrom}
                        isHintTo={isHintTo}
                        isPossibleMove={isPossibleMove}
                        isCapture={isCapture}
                        rankLabel={rankLabel}
                        fileLabel={fileLabel}
                        onClick={() => handleSquareClick(squareName)}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Bottom Player (White) */}
          <div className="player-bar">
            <div className="player-info">
              <span className="player-avatar">👑</span>
              <div>
                <span className="player-name">
                  You (White)
                  {advantage > 0 && <span className="advantage-badge">+{advantage}</span>}
                </span>
                <div className="captured-strip">
                  {blackCaptured.map((p, i) => (
                    <span key={i} className="captured-mini">
                      <ChessPiece type={p} color="black" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={`clock ${turn === 'w' && !isGameOver ? 'active' : ''} ${whiteTime < 30 ? 'panic' : ''}`}>
              {formatTimer(whiteTime)}
            </div>
          </div>
        </div>

        {/* Sidebar Controls & History */}
        <aside className="sidebar">
          {isCheck && !isGameOver && (
            <div className="status-banner">
              ⚠️ King in Check!
            </div>
          )}

          {/* Quick Actions */}
          <div className="panel">
            <div className="panel-title">Controls</div>
            <div className="action-grid">
              <button
                className="btn-action"
                onClick={handleUndo}
                disabled={game.history().length === 0 || isGameOver}
                title="Take back last move"
              >
                ↩ Undo
              </button>
              <button
                className="btn-action highlight"
                onClick={handleHint}
                disabled={turn !== 'w' || isGameOver}
                title="Suggest best move"
              >
                💡 Hint
              </button>
              <button
                className="btn-action"
                onClick={() => setIsFlipped(!isFlipped)}
                title="Flip board orientation"
              >
                🔄 Flip
              </button>
              <button
                className="btn-action"
                onClick={handleReset}
                title="Restart game"
              >
                ⚡ Reset
              </button>
            </div>
          </div>

          {/* Game Mode & Difficulty */}
          <div className="panel">
            <div className="panel-title">Game Mode</div>
            <div className="action-grid">
              <button
                className={`btn-action ${gameMode === 'bot' ? 'active' : ''}`}
                onClick={() => setGameMode('bot')}
              >
                🤖 vs Bot
              </button>
              <button
                className={`btn-action ${gameMode === 'pvp' ? 'active' : ''}`}
                onClick={() => setGameMode('pvp')}
              >
                👥 2-Player
              </button>
            </div>

            {gameMode === 'bot' && (
              <>
                <div className="panel-title" style={{ marginTop: '12px' }}>Bot Difficulty</div>
                <div className="difficulty-selector">
                  {['easy', 'medium', 'hard'].map((d) => (
                    <button
                      key={d}
                      className={`difficulty-btn ${difficulty === d ? 'active' : ''}`}
                      onClick={() => setDifficulty(d)}
                    >
                      {d.toUpperCase()}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Move Log */}
          <div className="panel">
            <div className="panel-title">
              <span>Move Log</span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {history.length} moves
              </span>
            </div>
            <div className="moves-table">
              {history.length === 0 && (
                <span style={{ color: '#6b7280', textAlign: 'center', padding: '12px 0' }}>
                  Awaiting first move...
                </span>
              )}
              {history.reduce((acc, move, idx) => {
                if (idx % 2 === 0) acc.push([move]);
                else acc[acc.length - 1].push(move);
                return acc;
              }, []).map((pair, idx) => (
                <div key={idx} className="move-entry">
                  <span className="move-index">{idx + 1}.</span>
                  <span className="move-san">{pair[0]?.san}</span>
                  <span className="move-san">{pair[1]?.san || ''}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-icon">🏆</div>
            <h2 className="modal-title">Game Over</h2>
            <p className="modal-desc">{gameOverText}</p>
            <button className="btn-primary" onClick={handleReset}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
