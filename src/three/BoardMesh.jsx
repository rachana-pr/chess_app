import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { SquareTile } from './SquareTile';
import { FILES, RANKS } from '../chess/chessEngine';

export function BoardMesh({
  theme,
  selectedSquare,
  lastMove,
  checkKingSquare,
  legalMoves,
  onSquareClick,
}) {
  // Generate the 64 squares with their 3D coordinates
  const squares = useMemo(() => {
    const list = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const file = FILES[c];
        const rank = RANKS[r];
        const squareName = `${file}${rank}`;
        const isLight = (r + c) % 2 === 0;

        const x = c - 3.5;
        const z = r - 3.5;

        list.push({
          squareName,
          position: [x, 0, z],
          isLight,
        });
      }
    }
    return list;
  }, []);

  // Pre-calculate legal destinations map for instant O(1) lookups
  const legalMoveMap = useMemo(() => {
    const map = new Map();
    legalMoves.forEach((m) => {
      map.set(m.to, Boolean(m.captured));
    });
    return map;
  }, [legalMoves]);

  return (
    <group>
      {/* 3D Physical Board Slab / Frame */}
      <mesh receiveShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[9.4, 0.36, 9.4]} />
        <meshStandardMaterial
          color={theme.boardFrame}
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* Beveled Inner Border Bed */}
      <mesh receiveShadow position={[0, -0.11, 0]}>
        <boxGeometry args={[8.4, 0.16, 8.4]} />
        <meshStandardMaterial
          color={theme.boardInner}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* 64 Individual 3D Board Squares */}
      {squares.map((sq) => {
        const isSelected = selectedSquare === sq.squareName;
        const isLast = lastMove && (lastMove.from === sq.squareName || lastMove.to === sq.squareName);
        const isInCheck = checkKingSquare === sq.squareName;
        const isLegal = legalMoveMap.has(sq.squareName);
        const isCapture = legalMoveMap.get(sq.squareName);

        return (
          <SquareTile
            key={sq.squareName}
            squareName={sq.squareName}
            position={sq.position}
            isLight={sq.isLight}
            theme={theme}
            isSelected={isSelected}
            isLastMove={isLast}
            isInCheck={isInCheck}
            isLegalMove={isLegal}
            isCapture={isCapture}
            onClick={onSquareClick}
          />
        );
      })}

      {/* Embedded 3D Coordinates: Files (a - h) on White & Black sides */}
      {FILES.map((file, i) => {
        const x = i - 3.5;
        return (
          <group key={`file-${file}`}>
            {/* White side */}
            <Text
              position={[x, 0.01, 4.35]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.24}
              color={theme.coordsColor}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {file}
            </Text>
            {/* Black side */}
            <Text
              position={[x, 0.01, -4.35]}
              rotation={[-Math.PI / 2, 0, Math.PI]}
              fontSize={0.24}
              color={theme.coordsColor}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {file}
            </Text>
          </group>
        );
      })}

      {/* Embedded 3D Coordinates: Ranks (1 - 8) on Left & Right sides */}
      {RANKS.map((rank, i) => {
        const z = i - 3.5;
        return (
          <group key={`rank-${rank}`}>
            {/* Left side */}
            <Text
              position={[-4.35, 0.01, z]}
              rotation={[-Math.PI / 2, 0, Math.PI / 2]}
              fontSize={0.24}
              color={theme.coordsColor}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {rank}
            </Text>
            {/* Right side */}
            <Text
              position={[4.35, 0.01, z]}
              rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
              fontSize={0.24}
              color={theme.coordsColor}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {rank}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

