import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CAMERA_PRESETS } from '../constants/themes';

export function CameraRig({
  currentPreset,
  autoRotate,
  resetTrigger,
  onCameraChange,
}) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const targetPos = useRef(null);

  // When preset changes or reset is triggered, initiate smooth lerp to new target
  useEffect(() => {
    const preset = CAMERA_PRESETS[currentPreset] || CAMERA_PRESETS.default;
    targetPos.current = new THREE.Vector3(...preset.position);
  }, [currentPreset, resetTrigger]);

  // Smooth camera interpolation in useFrame
  useFrame((_, delta) => {
    if (targetPos.current) {
      camera.position.lerp(targetPos.current, delta * 3.8);

      // Once close enough, release programmatic control so user can orbit freely
      if (camera.position.distanceTo(targetPos.current) < 0.08) {
        camera.position.copy(targetPos.current);
        targetPos.current = null;
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={true}
      enableZoom={true}
      enablePan={false}
      minDistance={5}
      maxDistance={20}
      minPolarAngle={Math.PI / 12} // prevent looking from directly top glitch
      maxPolarAngle={Math.PI / 2 - 0.04} // prevent dipping below table
      enableDamping={true}
      dampingFactor={0.06}
      autoRotate={autoRotate}
      autoRotateSpeed={1.0}
      target={[0, 0, 0]}
      onChange={() => {
        // If user manually moves the camera, stop any active lerp
        if (!targetPos.current && onCameraChange) {
          onCameraChange();
        }
      }}
    />
  );
}

