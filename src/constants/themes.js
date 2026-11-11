// CHESSVERSE Theme & Material Presets

export const THEMES_3D = {
  wood: {
    id: 'wood',
    name: 'Classic Oak & Walnut',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    boardFrame: '#2c1a11',
    boardInner: '#180d07',
    coordsColor: '#c5a059',
    tableColor: '#121217',
    whitePiece: {
      color: '#fdfbf7',
      roughness: 0.25,
      metalness: 0.08,
      clearcoat: 0.3,
    },
    blackPiece: {
      color: '#1e1e24',
      roughness: 0.28,
      metalness: 0.18,
      clearcoat: 0.3,
    },
  },
  tournament: {
    id: 'tournament',
    name: 'Tournament Green',
    lightSquare: '#ebecd0',
    darkSquare: '#779556',
    boardFrame: '#1f2421',
    boardInner: '#0e1210',
    coordsColor: '#a3b18a',
    tableColor: '#141716',
    whitePiece: {
      color: '#ffffff',
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.4,
    },
    blackPiece: {
      color: '#1a1c1a',
      roughness: 0.25,
      metalness: 0.12,
      clearcoat: 0.4,
    },
  },
  marble: {
    id: 'marble',
    name: 'Carrara Marble & Obsidian',
    lightSquare: '#e2e8f0',
    darkSquare: '#334155',
    boardFrame: '#0f172a',
    boardInner: '#020617',
    coordsColor: '#94a3b8',
    tableColor: '#0a0d14',
    whitePiece: {
      color: '#f8fafc',
      roughness: 0.15,
      metalness: 0.15,
      clearcoat: 0.6,
    },
    blackPiece: {
      color: '#0f172a',
      roughness: 0.18,
      metalness: 0.25,
      clearcoat: 0.6,
    },
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Neon',
    lightSquare: '#083344',
    darkSquare: '#1e1b4b',
    boardFrame: '#030712',
    boardInner: '#000000',
    coordsColor: '#06b6d4',
    tableColor: '#030712',
    whitePiece: {
      color: '#38bdf8',
      roughness: 0.2,
      metalness: 0.4,
      emissive: '#0369a1',
      emissiveIntensity: 0.3,
    },
    blackPiece: {
      color: '#a855f7',
      roughness: 0.2,
      metalness: 0.4,
      emissive: '#7e22ce',
      emissiveIntensity: 0.3,
    },
  },
};

export const CAMERA_PRESETS = {
  default: {
    name: 'Default 3D',
    position: [0, 8, 8],
    target: [0, 0, 0],
  },
  white: {
    name: 'White Perspective',
    position: [0, 6.8, 7.2],
    target: [0, 0, 0],
  },
  black: {
    name: 'Black Perspective',
    position: [0, 6.8, -7.2],
    target: [0, 0, 0],
  },
  top: {
    name: 'Top-Down 2D',
    position: [0, 11, 0.001],
    target: [0, 0, 0],
  },
  isometric: {
    name: 'Isometric 3D',
    position: [6.8, 6.8, 6.8],
    target: [0, 0, 0],
  },
};

