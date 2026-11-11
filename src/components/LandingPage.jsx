import { Play, Sparkles, Compass, ShieldCheck, Smartphone, Eye } from 'lucide-react';
import { Chessboard3D } from '../three/Chessboard3D';
import { createChessGame } from '../chess/chessEngine';

export function LandingPage({ onStartGame, themeId }) {
  // A fresh sample game to showcase on the hero 3D board
  const sampleGame = createChessGame();

  return (
    <div className="landing-page-container">
      {/* Top Navbar */}
      <nav className="landing-navbar">
        <div className="nav-brand">
          <span className="brand-logo-icon">♔</span>
          <span className="brand-title">CHESSVERSE</span>
          <span className="brand-badge">PHASE 1</span>
        </div>

        <button className="nav-cta-btn" onClick={onStartGame}>
          <Play size={16} fill="currentColor" />
          <span>Play 3D Chess</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={14} className="pill-icon" />
            <span>Next-Generation 3D Chess Experience</span>
          </div>

          <h1 className="hero-headline">
            Master the Board in <span className="gradient-text">Genuine 3D</span>
          </h1>

          <p className="hero-subtitle">
            Immerse yourself in physically based 3D chess pieces, 360-degree free orbit camera controls, and certified chess rules. Designed for desktop, tablet, and mobile.
          </p>

          <div className="hero-cta-group">
            <button className="btn-hero-primary" onClick={onStartGame}>
              <Play size={20} fill="currentColor" />
              <span>Enter 3D Arena</span>
            </button>
          </div>

          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-number">360°</span>
              <span className="stat-label">Full Camera Orbit</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">3D Piece Types</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">FIDE Legal Rules</span>
            </div>
          </div>
        </div>

        {/* Live Interactive 3D Showcase Canvas */}
        <div className="hero-3d-showcase">
          <div className="showcase-glow" />
          <div className="showcase-canvas-wrapper">
            <Chessboard3D
              game={sampleGame}
              selectedSquare={null}
              lastMove={null}
              checkKingSquare={null}
              legalMoves={[]}
              themeId={themeId}
              cameraPreset="isometric"
              autoRotate={true}
              onSquareClick={() => {}}
              onPieceClick={() => {}}
              onCameraChange={() => {}}
            />
          </div>
          <div className="showcase-caption">
            <Compass size={14} />
            <span>Interactive 3D Preview (Drag to orbit)</span>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="landing-features">
        <h2 className="features-title">Engineered for Excellence</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Compass size={24} />
            </div>
            <h3 className="feature-heading">360° Free Camera Orbit</h3>
            <p className="feature-text">
              Inspect the board from every perspective. Smooth horizontal rotation, vertical angle tilt, and fluid zoom controls via mouse or touch.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Eye size={24} />
            </div>
            <h3 className="feature-heading">Genuine 3D Pieces & Lighting</h3>
            <p className="feature-text">
              Individually modeled Staunton pieces with real-time physically based materials, cast shadows, and luminous selection auras.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={24} />
            </div>
            <h3 className="feature-heading">Complete Legal Chess Rules</h3>
            <p className="feature-text">
              Powered by Chess.js for strict rule enforcement. Includes castling, en passant, promotion, and check/checkmate detection.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Smartphone size={24} />
            </div>
            <h3 className="feature-heading">Responsive Across Devices</h3>
            <p className="feature-text">
              Optimized for high-refresh desktop monitors, iPads, and mobile screens with intuitive pinch-to-zoom and touch drag navigation.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span>CHESSVERSE &copy; 2026 &bull; Phase 1 Core Architecture</span>
      </footer>
    </div>
  );
}

