import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ChessPieceModel } from './PieceGeometries';
import { squareTo3D } from '../chess/chessEngine';

export function Piece3D({
  type,
  color,
  square,
  isSelected,
  theme,
  onClick,
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Target 3D position corresponding to the piece's square on the board
  const targetCoords = useMemo(() => squareTo3D(square), [square]);
  const targetPos = useMemo(
    () => new THREE.Vector3(targetCoords[0], 0, targetCoords[2]),
    [targetCoords]
  );

  // Store current animated position in ref
  const animPos = useRef(new THREE.Vector3(targetCoords[0], 0, targetCoords[2]));
  const startPos = useRef(new THREE.Vector3(targetCoords[0], 0, targetCoords[2]));
  const progress = useRef(1); // 1 = animation complete

  // Detect when square changes to trigger smooth movement animation
  useEffect(() => {
    startPos.current.copy(animPos.current);
    progress.current = 0; // restart move animation
  }, [square]);

  // Create PBR Material
  const material = useMemo(() => {
    const isWhite = color === 'w' || color === 'white';
    const matConfig = isWhite ? theme.whitePiece : theme.blackPiece;

    return new THREE.MeshStandardMaterial({
      color: matConfig.color,
      roughness: matConfig.roughness,
      metalness: matConfig.metalness,
      emissive: matConfig.emissive || (isSelected ? '#facc15' : '#000000'),
      emissiveIntensity: isSelected ? 0.4 : (matConfig.emissiveIntensity || 0),
    });
  }, [color, theme, isSelected]);

  // Frame animation: Smooth flight arc when moving & elevation when selected
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (progress.current < 1) {
      // Advance movement animation progress
      progress.current = Math.min(1, progress.current + delta * 3.5);

      // Ease-out interpolation on X and Z
      const t = progress.current;
      const ease = t * (2 - t); // quadratic ease-out

      animPos.current.x = THREE.MathUtils.lerp(startPos.current.x, targetPos.x, ease);
      animPos.current.z = THREE.MathUtils.lerp(startPos.current.z, targetPos.z, ease);

      // Parabolic flight arc on Y (lifts up to 0.75 units and sets down)
      const arc = Math.sin(t * Math.PI) * 0.75;
      animPos.current.y = arc;
    } else {
      // Snap to target ground
      animPos.current.x = targetPos.x;
      animPos.current.z = targetPos.z;

      // Elevated floating state when selected
      const targetY = isSelected ? 0.28 : 0;
      animPos.current.y = THREE.MathUtils.lerp(animPos.current.y, targetY, delta * 12);
    }

    groupRef.current.position.copy(animPos.current);

    // Subtle scale hover effect
    const targetScale = hovered && !isSelected ? 1.05 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 15);
  });

  return (
    <group
      ref={groupRef}
      position={[targetCoords[0], 0, targetCoords[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick(square);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <ChessPieceModel type={type} color={color} material={material} />

      {/* Selected Piece Glow / Aura */}
      {isSelected && (
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.36, 0.46, 32]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}
