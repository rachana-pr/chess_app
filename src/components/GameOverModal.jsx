import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, X } from 'lucide-react';

export function GameOverModal({
  isOpen,
  statusText,
  winner,
  onRestart,
  onClose,
}) {
  useEffect(() => {
    if (isOpen && winner) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, winner]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose} title="Dismiss">
          <X size={18} />
        </button>

        <div className="modal-trophy">
          <Trophy size={48} className="trophy-icon" />
        </div>

        <h2 className="modal-title">Game Concluded</h2>
        <p className="modal-desc">{statusText}</p>

        <div className="modal-actions">
          <button className="btn-modal-primary" onClick={onRestart}>
            <RefreshCw size={16} />
            <span>Play Again</span>
          </button>
          <button className="btn-modal-secondary" onClick={onClose}>
            Review Board
          </button>
        </div>
      </div>
    </div>
  );
}

