import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { BoardMesh } from './BoardMesh';
import { Piece3D } from './Piece3D';
import { CameraRig } from './CameraRig';
import { THEMES_3D } from '../constants/themes';

export function Chessboard3D({
  game,
  selectedSquare,
  lastMove,
  checkKingSquare,
  legalMoves,
  themeId = 'wood',
  cameraPreset = 'default',
  autoRotate = false,
  resetTrigger = 0,
  onSquareClick,
  onPieceClick,
  onCameraChange,
}) {
  const theme = THEMES_3D[themeId] || THEMES_3D.wood;

  // Extract all active pieces on the board from chess.js
  const activePieces = useMemo(() => {
    if (!game) return [];
    const board = game.board();
    const pieces = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p) {
          pieces.push({
            id: `${p.color}-${p.type}-${p.square}`,
            type: p.type,
            color: p.color,
            square: p.square,
          });
        }
      }
    }
    return pieces;
  }, [game]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 8, 8], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.65} />

          {/* Key Light (Sun / Chandelier) */}
          <directionalLight
            castShadow
            position={[8, 14, 8]}
            intensity={1.5}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={35}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
            shadow-bias={-0.0005}
          />

          {/* Fill Light (Soft cool rim light from opposite side) */}
          <directionalLight position={[-8, 10, -8]} intensity={0.5} color="#93c5fd" />

          {/* Subtle center warm point light for sparkle on pieces */}
          <pointLight position={[0, 4, 0]} intensity={0.35} color="#fef08a" distance={12} />

          {/* 3D Chessboard Slab & 64 Squares */}
          <BoardMesh
            theme={theme}
            selectedSquare={selectedSquare}
            lastMove={lastMove}
            checkKingSquare={checkKingSquare}
            legalMoves={legalMoves}
            onSquareClick={onSquareClick}
          />

          {/* 3D Chess Pieces */}
          {activePieces.map((p) => {
            const isSelected = selectedSquare === p.square;
            return (
              <Piece3D
                key={p.id}
                id={p.id}
                type={p.type}
                color={p.color}
                square={p.square}
                isSelected={isSelected}
                theme={theme}
                onClick={onPieceClick}
              />
            );
          })}

          {/* Table Surface Ground Plane */}
          <mesh receiveShadow position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[45, 45]} />
            <meshStandardMaterial
              color={theme.tableColor}
              roughness={0.7}
              metalness={0.2}
            />
          </mesh>

          {/* Orbit Camera Controller */}
          <CameraRig
            currentPreset={cameraPreset}
            autoRotate={autoRotate}
            resetTrigger={resetTrigger}
            onCameraChange={onCameraChange}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

