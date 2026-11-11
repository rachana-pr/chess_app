import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard3D } from '../three/Chessboard3D';
import { CameraHUD } from './CameraHUD';
import { GameSidebar } from './GameSidebar';
import { GameOverModal } from './GameOverModal';
import {
  createChessGame,
  getLegalMovesForSquare,
  getCapturedPieces,
  calculateMaterialAdvantage,
  getCheckKingSquare,
} from '../chess/chessEngine';
import { sounds } from '../utils/sound';

export function GameView({ onGoHome, themeId, onSelectTheme }) {
  // Chess.js core game instance
  const [game] = useState(() => createChessGame());
  const [fen, setFen] = useState(() => game.fen());

  // Interaction State
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  // 3D Camera Controls State
  const [cameraPreset, setCameraPreset] = useState('default');
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Timers & Sound
  const [whiteTime, setWhiteTime] = useState(300); // 5 minutes
  const [blackTime, setBlackTime] = useState(300);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const turn = game.turn();
  const isGameOver = game.isGameOver();
  const isCheck = game.isCheck();

  // Derived game states from current board position
  const checkKingSquare = getCheckKingSquare(game);
  const legalMoves = useMemo(() => {
    if (!selectedSquare || isGameOver) return [];
    return getLegalMovesForSquare(game, selectedSquare);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, selectedSquare, isGameOver, fen]);

  const { white: whiteCaptured, black: blackCaptured } = getCapturedPieces(game);
  const materialAdvantage = calculateMaterialAdvantage(game);
  const moveHistory = game.history({ verbose: true });

  // Execute a chess move
  const executeMove = useCallback((from, to) => {
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (!move) return false;

      // Audio feedback
      if (game.isCheckmate() || game.isCheck()) {
        sounds.play('check');
      } else if (move.captured) {
        sounds.play('capture');
      } else {
        sounds.play('move');
      }

      setLastMove({ from, to });
      setSelectedSquare(null);
      setFen(game.fen());

      // Check for Game Over
      if (game.isGameOver()) {
        sounds.play('victory');
        setIsModalOpen(true);
      }

      return true;
    } catch {
      return false;
    }
  }, [game]);

  // Click on a piece
  const handlePieceClick = useCallback((square) => {
    if (isGameOver) return;
    const piece = game.get(square);

    // If clicking current player's piece -> select it
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      sounds.play('click');
      return;
    }

    // If a piece is already selected and clicked on an enemy piece -> attempt capture
    if (selectedSquare) {
      const isLegal = legalMoves.some((m) => m.to === square);
      if (isLegal) {
        executeMove(selectedSquare, square);
      } else {
        setSelectedSquare(null);
      }
    }
  }, [game, isGameOver, turn, selectedSquare, legalMoves, executeMove]);

  // Click on a square tile
  const handleSquareClick = useCallback((square) => {
    if (isGameOver) return;

    if (selectedSquare) {
      const isLegal = legalMoves.some((m) => m.to === square);
      if (isLegal) {
        executeMove(selectedSquare, square);
      } else {
        setSelectedSquare(null);
      }
    } else {
      const piece = game.get(square);
      if (piece && piece.color === turn) {
        setSelectedSquare(square);
        sounds.play('click');
      }
    }
  }, [isGameOver, selectedSquare, legalMoves, executeMove, game, turn]);

  // Undo move
  const handleUndo = useCallback(() => {
    if (game.history().length === 0 || isGameOver) return;
    game.undo();
    setSelectedSquare(null);
    setLastMove(null);
    setFen(game.fen());
    sounds.play('move');
  }, [game, isGameOver]);

  // Reset game
  const handleReset = useCallback(() => {
    game.reset();
    setSelectedSquare(null);
    setLastMove(null);
    setWhiteTime(300);
    setBlackTime(300);
    setIsModalOpen(false);
    setFen(game.fen());
    sounds.play('move');
  }, [game]);

  // Camera presets & reset handlers
  const handleSelectPreset = useCallback((preset) => {
    setAutoRotate(false);
    setCameraPreset(preset);
    sounds.play('click');
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => !prev);
    sounds.play('click');
  }, []);

  const handleResetCamera = useCallback(() => {
    setAutoRotate(false);
    setCameraPreset('default');
    setResetTrigger((prev) => prev + 1);
    sounds.play('click');
  }, []);

  // Clocks timer
  useEffect(() => {
    if (isGameOver || moveHistory.length === 0) return;

    const timer = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime((t) => (t <= 1 ? 0 : t - 1));
      } else {
        setBlackTime((t) => (t <= 1 ? 0 : t - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [turn, isGameOver, moveHistory.length]);

  // Game over status message
  let gameOverText = '';
  let winner = null;
  if (game.isCheckmate()) {
    winner = turn === 'w' ? 'Black' : 'White';
    gameOverText = `Checkmate! ${winner} is Victorious!`;
  } else if (game.isDraw()) {
    gameOverText = 'Game ended in a Draw!';
  } else if (whiteTime === 0) {
    winner = 'Black';
    gameOverText = 'Black wins on Time!';
  } else if (blackTime === 0) {
    winner = 'White';
    gameOverText = 'White wins on Time!';
  }

  return (
    <div className="game-view-container">
      {/* 3D Canvas Stage */}
      <div className="canvas-stage">
        <Chessboard3D
          game={game}
          selectedSquare={selectedSquare}
          lastMove={lastMove}
          checkKingSquare={checkKingSquare}
          legalMoves={legalMoves}
          themeId={themeId}
          cameraPreset={cameraPreset}
          autoRotate={autoRotate}
          resetTrigger={resetTrigger}
          onSquareClick={handleSquareClick}
          onPieceClick={handlePieceClick}
          onCameraChange={() => setAutoRotate(false)}
        />

        {/* Floating 360 Camera Controls Overlay */}
        <CameraHUD
          cameraPreset={cameraPreset}
          autoRotate={autoRotate}
          onSelectPreset={handleSelectPreset}
          onToggleAutoRotate={handleToggleAutoRotate}
          onResetCamera={handleResetCamera}
        />
      </div>

      {/* Game Sidebar Dashboard */}
      <GameSidebar
        turn={turn}
        isCheck={isCheck}
        isGameOver={isGameOver}
        whiteTime={whiteTime}
        blackTime={blackTime}
        whiteCaptured={whiteCaptured}
        blackCaptured={blackCaptured}
        materialAdvantage={materialAdvantage}
        moveHistory={moveHistory}
        themeId={themeId}
        soundEnabled={soundEnabled}
        onSelectTheme={onSelectTheme}
        onToggleSound={() => {
          sounds.toggle(!soundEnabled);
          setSoundEnabled(!soundEnabled);
        }}
        onUndo={handleUndo}
        onReset={handleReset}
        onGoHome={onGoHome}
      />

      {/* Game Over Celebration Modal */}
      <GameOverModal
        isOpen={isModalOpen || isGameOver}
        statusText={gameOverText}
        winner={winner}
        onRestart={handleReset}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
