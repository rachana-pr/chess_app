import { RotateCcw, Video, Compass } from 'lucide-react';
import { CAMERA_PRESETS } from '../constants/themes';

export function CameraHUD({
  cameraPreset,
  autoRotate,
  onSelectPreset,
  onToggleAutoRotate,
  onResetCamera,
}) {
  return (
    <div className="camera-hud-container">
      {/* Top Floating Control Bar */}
      <div className="camera-hud-bar">
        {/* Reset Camera Button */}
        <button
          className="hud-btn highlight"
          onClick={onResetCamera}
          title="Reset Camera to Default Angle"
        >
          <RotateCcw size={15} />
          <span>Reset Camera</span>
        </button>

        {/* Camera Preset Buttons */}
        <div className="hud-presets-group">
          {Object.entries(CAMERA_PRESETS).map(([key, p]) => (
            <button
              key={key}
              className={`hud-btn ${cameraPreset === key && !autoRotate ? 'active' : ''}`}
              onClick={() => onSelectPreset(key)}
              title={p.name}
            >
              <span>{p.name.replace(' Perspective', '').replace(' 2D', '').replace(' 3D', '')}</span>
            </button>
          ))}
        </div>

        {/* Auto-Rotate 360 Toggle */}
        <button
          className={`hud-btn ${autoRotate ? 'active-pulse' : ''}`}
          onClick={onToggleAutoRotate}
          title="Toggle 360-degree automatic camera orbit"
        >
          <Video size={15} />
          <span>{autoRotate ? 'Pause 360°' : '360° Spin'}</span>
        </button>
      </div>

      {/* Floating Bottom Hint Badge */}
      <div className="camera-hud-hint">
        <Compass size={14} className="hud-hint-icon" />
        <span>Drag to rotate 360° • Scroll/Pinch to zoom</span>
      </div>
    </div>
  );
}
