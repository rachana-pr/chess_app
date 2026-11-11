import { Volume2, VolumeX, RotateCcw, RotateCw, Home, ShieldAlert } from 'lucide-react';
import { THEMES_3D } from '../constants/themes';

export function GameSidebar({
  turn,
  isCheck,
  isGameOver,
  whiteTime,
  blackTime,
  whiteCaptured,
  blackCaptured,
  materialAdvantage,
  moveHistory,
  themeId,
  soundEnabled,
  onSelectTheme,
  onToggleSound,
  onUndo,
  onReset,
  onGoHome,
}) {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside className="game-sidebar">
      {/* Top Header Controls */}
      <div className="sidebar-top-bar">
        <button className="sidebar-icon-btn" onClick={onGoHome} title="Return to Landing Page">
          <Home size={18} />
          <span>Home</span>
        </button>

        <div className="sidebar-top-actions">
          <button
            className={`sidebar-icon-btn ${soundEnabled ? 'active' : ''}`}
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* Black Player Card */}
      <div className={`player-card ${turn === 'b' && !isGameOver ? 'active' : ''}`}>
        <div className="player-meta">
          <div className="player-avatar black">♚</div>
          <div className="player-details">
            <span className="player-name">
              Black Player
              {materialAdvantage < 0 && (
                <span className="advantage-pill">+{Math.abs(materialAdvantage)}</span>
              )}
            </span>
            <div className="captured-row">
              {whiteCaptured.map((p, i) => (
                <span key={i} className="captured-piece-tag">{p.toUpperCase()}</span>
              ))}
            </div>
          </div>
        </div>
        <div className={`player-clock ${turn === 'b' && !isGameOver ? 'active' : ''} ${blackTime < 30 ? 'low' : ''}`}>
          {formatTime(blackTime)}
        </div>
      </div>

      {/* In-Check Banner */}
      {isCheck && !isGameOver && (
        <div className="check-alert-banner">
          <ShieldAlert size={16} />
          <span>King is in Check!</span>
        </div>
      )}

      {/* White Player Card */}
      <div className={`player-card ${turn === 'w' && !isGameOver ? 'active' : ''}`}>
        <div className="player-meta">
          <div className="player-avatar white">♔</div>
          <div className="player-details">
            <span className="player-name">
              White Player
              {materialAdvantage > 0 && (
                <span className="advantage-pill">+{materialAdvantage}</span>
              )}
            </span>
            <div className="captured-row">
              {blackCaptured.map((p, i) => (
                <span key={i} className="captured-piece-tag">{p.toUpperCase()}</span>
              ))}
            </div>
          </div>
        </div>
        <div className={`player-clock ${turn === 'w' && !isGameOver ? 'active' : ''} ${whiteTime < 30 ? 'low' : ''}`}>
          {formatTime(whiteTime)}
        </div>
      </div>

      {/* Game Action Buttons */}
      <div className="sidebar-action-grid">
        <button
          className="sidebar-action-btn"
          onClick={onUndo}
          disabled={moveHistory.length === 0 || isGameOver}
          title="Take back last move"
        >
          <RotateCcw size={16} />
          <span>Undo</span>
        </button>
        <button
          className="sidebar-action-btn highlight"
          onClick={onReset}
          title="Start fresh game"
        >
          <RotateCw size={16} />
          <span>New Game</span>
        </button>
      </div>

      {/* Theme Studio Selector */}
      <div className="sidebar-section">
        <span className="section-title">3D Environment Theme</span>
        <div className="theme-selector-grid">
          {Object.entries(THEMES_3D).map(([key, t]) => (
            <button
              key={key}
              className={`theme-pill ${themeId === key ? 'active' : ''}`}
              onClick={() => onSelectTheme(key)}
            >
              <div className="theme-mini-swatch">
                <span style={{ backgroundColor: t.lightSquare }} />
                <span style={{ backgroundColor: t.darkSquare }} />
              </div>
              <span className="theme-label">{t.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Move History Log */}
      <div className="sidebar-section move-history-section">
        <span className="section-title">
          <span>Move History</span>
          <span className="move-count">{moveHistory.length} moves</span>
        </span>
        <div className="move-history-scrollbox">
          {moveHistory.length === 0 ? (
            <div className="empty-history-text">Make a move on the 3D board to begin...</div>
          ) : (
            moveHistory.reduce((acc, move, idx) => {
              if (idx % 2 === 0) acc.push([move]);
              else acc[acc.length - 1].push(move);
              return acc;
            }, []).map((pair, idx) => (
              <div key={idx} className="move-history-row">
                <span className="turn-number">{idx + 1}.</span>
                <span className="move-item white">{pair[0]?.san}</span>
                <span className="move-item black">{pair[1]?.san || ''}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

