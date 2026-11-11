import { useState, useMemo } from 'react';

export function SquareTile({
  squareName,
  position,
  isLight,
  theme,
  isSelected,
  isLastMove,
  isInCheck,
  isLegalMove,
  isCapture,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  // Compute tile color & emissive properties
  const { color, emissive, emissiveIntensity } = useMemo(() => {
    if (isInCheck) {
      return { color: '#ef4444', emissive: '#b91c1c', emissiveIntensity: 0.6 };
    }
    if (isSelected) {
      return { color: '#f7ec59', emissive: '#eab308', emissiveIntensity: 0.45 };
    }
    if (isLastMove) {
      return { color: '#ced26b', emissive: '#854d0e', emissiveIntensity: 0.25 };
    }
    if (hovered && !isLegalMove) {
      const base = isLight ? theme.lightSquare : theme.darkSquare;
      return { color: base, emissive: '#ffffff', emissiveIntensity: 0.1 };
    }

    const base = isLight ? theme.lightSquare : theme.darkSquare;
    return { color: base, emissive: '#000000', emissiveIntensity: 0 };
  }, [isInCheck, isSelected, isLastMove, hovered, isLegalMove, isLight, theme]);

  return (
    <group position={position}>
      {/* Physical 3D Tile Slab */}
      <mesh
        receiveShadow
        position={[0, -0.08, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick(squareName);
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
        <boxGeometry args={[0.985, 0.16, 0.985]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>

      {/* Legal Move Indicators (3D Destination Markers) */}
      {isLegalMove && !isCapture && (
        <mesh
          position={[0, 0.02, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClick(squareName);
          }}
        >
          <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
          <meshStandardMaterial
            color="#0f172a"
            transparent
            opacity={0.4}
            roughness={0.3}
          />
        </mesh>
      )}

      {/* Legal Capture Target Ring */}
      {isLegalMove && isCapture && (
        <mesh
          position={[0, 0.03, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClick(squareName);
          }}
        >
          <torusGeometry args={[0.38, 0.045, 16, 32]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>
      )}
    </group>
  );
}
