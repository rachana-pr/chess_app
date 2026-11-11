import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { GameView } from './components/GameView';
import './App.css';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'game'
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('chessverse_theme') || 'wood';
  });

  useEffect(() => {
    localStorage.setItem('chessverse_theme', themeId);
  }, [themeId]);

  return (
    <div className="chessverse-app">
      {view === 'landing' ? (
        <LandingPage
          onStartGame={() => setView('game')}
          themeId={themeId}
        />
      ) : (
        <GameView
          onGoHome={() => setView('landing')}
          themeId={themeId}
          onSelectTheme={setThemeId}
        />
      )}
    </div>
  );
}
