import { useMemo } from 'react';

// Reusable standard base for all pieces to ensure uniform Staunton proportions
function PieceBase({ material, radius = 0.38 }) {
  return (
    <group>
      {/* Lower plinth */}
      <mesh castShadow receiveShadow position={[0, 0.04, 0]} material={material}>
        <cylinderGeometry args={[radius * 0.92, radius, 0.08, 32]} />
      </mesh>
      {/* Stepped pedestal */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]} material={material}>
        <cylinderGeometry args={[radius * 0.8, radius * 0.9, 0.06, 32]} />
      </mesh>
      {/* Waist bead */}
      <mesh castShadow receiveShadow position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[radius * 0.75, 0.025, 16, 32]} />
      </mesh>
    </group>
  );
}

// 1. 3D PAWN
export function PawnModel({ material }) {
  return (
    <group>
      <PieceBase material={material} radius={0.34} />
      {/* Tapered body stem */}
      <mesh castShadow receiveShadow position={[0, 0.38, 0]} material={material}>
        <cylinderGeometry args={[0.15, 0.27, 0.44, 32]} />
      </mesh>
      {/* Collar ring */}
      <mesh castShadow receiveShadow position={[0, 0.61, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.17, 0.025, 16, 32]} />
      </mesh>
      {/* Head sphere */}
      <mesh castShadow receiveShadow position={[0, 0.78, 0]} material={material}>
        <sphereGeometry args={[0.18, 32, 32]} />
      </mesh>
    </group>
  );
}

// 2. 3D ROOK (Castle Tower)
export function RookModel({ material }) {
  // 4 battlements
  const battlements = useMemo(() => {
    const items = [];
    const radius = 0.22;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      items.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rot: -angle,
      });
    }
    return items;
  }, []);

  return (
    <group>
      <PieceBase material={material} radius={0.36} />
      {/* Tower shaft */}
      <mesh castShadow receiveShadow position={[0, 0.42, 0]} material={material}>
        <cylinderGeometry args={[0.26, 0.31, 0.52, 32]} />
      </mesh>
      {/* Parapet cornice */}
      <mesh castShadow receiveShadow position={[0, 0.69, 0]} material={material}>
        <cylinderGeometry args={[0.32, 0.27, 0.08, 32]} />
      </mesh>
      {/* Inner floor of battlements */}
      <mesh castShadow receiveShadow position={[0, 0.73, 0]} material={material}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
      </mesh>
      {/* Crenellated battlement turrets */}
      {battlements.map((b, i) => (
        <mesh
          key={i}
          castShadow
          receiveShadow
          position={[b.x, 0.78, b.z]}
          rotation={[0, b.rot, 0]}
          material={material}
        >
          <boxGeometry args={[0.11, 0.1, 0.08]} />
        </mesh>
      ))}
    </group>
  );
}

// 3. 3D KNIGHT (Horse)
export function KnightModel({ material, isBlack }) {
  // Rotate knight so it faces towards center/opponent
  const yRotation = isBlack ? Math.PI : 0;

  return (
    <group rotation={[0, yRotation, 0]}>
      <PieceBase material={material} radius={0.36} />
      {/* Lower pedestal neck transition */}
      <mesh castShadow receiveShadow position={[0, 0.26, 0]} material={material}>
        <cylinderGeometry args={[0.22, 0.29, 0.2, 32]} />
      </mesh>
      {/* Arched chest & neck */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.54, 0.02]}
        rotation={[-0.2, 0, 0]}
        material={material}
      >
        <boxGeometry args={[0.22, 0.44, 0.3]} />
      </mesh>
      {/* Snout & head pointing forward */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.76, 0.16]}
        rotation={[0.35, 0, 0]}
        material={material}
      >
        <boxGeometry args={[0.18, 0.22, 0.28]} />
      </mesh>
      {/* Muzzle tip */}
      <mesh castShadow receiveShadow position={[0, 0.7, 0.3]} material={material}>
        <sphereGeometry args={[0.09, 16, 16]} />
      </mesh>
      {/* Left ear */}
      <mesh
        castShadow
        receiveShadow
        position={[-0.06, 0.93, 0.06]}
        rotation={[-0.2, 0, -0.15]}
        material={material}
      >
        <coneGeometry args={[0.04, 0.14, 16]} />
      </mesh>
      {/* Right ear */}
      <mesh
        castShadow
        receiveShadow
        position={[0.06, 0.93, 0.06]}
        rotation={[-0.2, 0, 0.15]}
        material={material}
      >
        <coneGeometry args={[0.04, 0.14, 16]} />
      </mesh>
      {/* Mane crest along the back */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.62, -0.14]}
        rotation={[0.2, 0, 0]}
        material={material}
      >
        <boxGeometry args={[0.08, 0.42, 0.08]} />
      </mesh>
    </group>
  );
}

// 4. 3D BISHOP
export function BishopModel({ material }) {
  return (
    <group>
      <PieceBase material={material} radius={0.36} />
      {/* Body stem */}
      <mesh castShadow receiveShadow position={[0, 0.42, 0]} material={material}>
        <cylinderGeometry args={[0.18, 0.29, 0.52, 32]} />
      </mesh>
      {/* Collar ring */}
      <mesh castShadow receiveShadow position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.21, 0.028, 16, 32]} />
      </mesh>
      {/* Mitre head (elongated sphere) */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.94, 0]}
        scale={[0.85, 1.35, 0.85]}
        material={material}
      >
        <sphereGeometry args={[0.21, 32, 32]} />
      </mesh>
      {/* Mitre cleft notch cut */}
      <mesh position={[0.1, 0.98, 0.08]} rotation={[0.4, 0.3, 0.6]}>
        <boxGeometry args={[0.04, 0.14, 0.1]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      {/* Finial top sphere */}
      <mesh castShadow receiveShadow position={[0, 1.22, 0]} material={material}>
        <sphereGeometry args={[0.055, 16, 16]} />
      </mesh>
    </group>
  );
}

// 5. 3D QUEEN
export function QueenModel({ material }) {
  // 8 crown jewel pearls around the coronet rim
  const crownJewels = useMemo(() => {
    const jewels = [];
    const radius = 0.27;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      jewels.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
      });
    }
    return jewels;
  }, []);

  return (
    <group>
      <PieceBase material={material} radius={0.38} />
      {/* Regal flared waist & stem */}
      <mesh castShadow receiveShadow position={[0, 0.48, 0]} material={material}>
        <cylinderGeometry args={[0.2, 0.31, 0.64, 32]} />
      </mesh>
      {/* Mid collar ring */}
      <mesh castShadow receiveShadow position={[0, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.23, 0.03, 16, 32]} />
      </mesh>
      {/* Flared coronet goblet */}
      <mesh castShadow receiveShadow position={[0, 1.0, 0]} material={material}>
        <cylinderGeometry args={[0.3, 0.2, 0.3, 32]} />
      </mesh>
      {/* Inner crown dome */}
      <mesh castShadow receiveShadow position={[0, 1.05, 0]} material={material}>
        <sphereGeometry args={[0.18, 32, 32]} />
      </mesh>
      {/* Crown jewels around rim */}
      {crownJewels.map((j, i) => (
        <mesh key={i} castShadow receiveShadow position={[j.x, 1.16, j.z]} material={material}>
          <sphereGeometry args={[0.038, 16, 16]} />
        </mesh>
      ))}
      {/* Center top jewel */}
      <mesh castShadow receiveShadow position={[0, 1.25, 0]} material={material}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>
    </group>
  );
}

// 6. 3D KING
export function KingModel({ material }) {
  return (
    <group>
      <PieceBase material={material} radius={0.39} />
      {/* Royal robe column stem */}
      <mesh castShadow receiveShadow position={[0, 0.52, 0]} material={material}>
        <cylinderGeometry args={[0.22, 0.32, 0.72, 32]} />
      </mesh>
      {/* Upper imperial collar */}
      <mesh castShadow receiveShadow position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.25, 0.032, 16, 32]} />
      </mesh>
      {/* Imperial arched crown dome */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 1.12, 0]}
        scale={[1, 1.15, 1]}
        material={material}
      >
        <sphereGeometry args={[0.24, 32, 32]} />
      </mesh>
      {/* Cross Finial: Vertical stem */}
      <mesh castShadow receiveShadow position={[0, 1.4, 0]} material={material}>
        <boxGeometry args={[0.045, 0.18, 0.045]} />
      </mesh>
      {/* Cross Finial: Horizontal crossbar */}
      <mesh castShadow receiveShadow position={[0, 1.43, 0]} material={material}>
        <boxGeometry args={[0.14, 0.045, 0.045]} />
      </mesh>
    </group>
  );
}

/**
 * Universal Master Piece Component:
 * Maps piece type ('p', 'r', 'n', 'b', 'q', 'k') to its 3D model.
 */
export function ChessPieceModel({ type, color, material }) {
  const isBlack = color === 'b' || color === 'black';
  const t = (type || '').toLowerCase();

  switch (t) {
    case 'p':
      return <PawnModel material={material} />;
    case 'r':
      return <RookModel material={material} />;
    case 'n':
      return <KnightModel material={material} isBlack={isBlack} />;
    case 'b':
      return <BishopModel material={material} />;
    case 'q':
      return <QueenModel material={material} />;
    case 'k':
      return <KingModel material={material} />;
    default:
      return null;
  }
}
