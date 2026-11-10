// Realistic Vector Staunton Chess Pieces with physical lighting, ivory & ebony gradients

export function PieceDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        {/* White Ivory Gradient */}
        <linearGradient id="w-body" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fdfcf8" />
          <stop offset="70%" stopColor="#ece7d5" />
          <stop offset="100%" stopColor="#cac2aa" />
        </linearGradient>

        <linearGradient id="w-rim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#968e7b" stopOpacity="0.8" />
        </linearGradient>

        {/* Black Ebony Gradient */}
        <linearGradient id="b-body" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#484a52" />
          <stop offset="35%" stopColor="#2e3037" />
          <stop offset="70%" stopColor="#1c1d22" />
          <stop offset="100%" stopColor="#0f1013" />
        </linearGradient>

        <linearGradient id="b-rim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a7c85" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#555761" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#050508" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ChessPiece({ type, color }) {
  const isWhite = color === 'white' || color === 'w';
  const prefix = isWhite ? 'w' : 'b';
  const fill = `url(#${prefix}-body)`;
  const rim = `url(#${prefix}-rim)`;
  const stroke = isWhite ? '#766c5c' : '#141518';
  const highlight = isWhite ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)';

  // Normalized piece type
  const t = (type || '').toLowerCase();

  return (
    <svg
      viewBox="0 0 100 100"
      className="chess-piece-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderPiece(t, fill, rim, stroke, highlight, isWhite)}
    </svg>
  );
}

function renderPiece(type, fill, rim, stroke, highlight, isWhite) {
  switch (type) {
    case 'p':
    case 'pawn':
      return (
        <g stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          {/* Base */}
          <ellipse cx="50" cy="85" rx="26" ry="7" fill={fill} />
          <path d="M26 84 C30 76, 70 76, 74 84" fill={rim} />
          <path d="M33 82 C35 73, 65 73, 67 82" fill={fill} />
          <ellipse cx="50" cy="54" rx="15" ry="3.5" fill={rim} />
          <path d="M38 74 C43 60, 41 55, 39 53 L61 53 C59 55, 57 60, 62 74 Z" fill={fill} />
          <circle cx="50" cy="36" r="14" fill={fill} />
          <ellipse cx="46" cy="32" rx="4" ry="7" transform="rotate(-30 46 32)" fill={highlight} stroke="none" />
        </g>
      );

    case 'n':
    case 'knight':
      return (
        <g stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <ellipse cx="50" cy="85" rx="28" ry="7.5" fill={fill} />
          <path d="M25 84 C30 76, 70 76, 75 84" fill={rim} />
          <path
            d="M32 82 C33 72, 28 65, 23 54 C19 46, 21 37, 28 32 C33 28, 40 29, 44 26 C47 23, 48 18, 51 18 C53 18, 54 22, 57 23 C62 25, 68 22, 70 27 C72 32, 70 42, 74 50 C77 56, 78 68, 68 82 Z"
            fill={fill}
          />
          <path d="M51 22 C58 27, 65 35, 67 47" fill="none" stroke={stroke} strokeWidth="2" />
          <path d="M56 31 C63 36, 68 45, 70 57" fill="none" stroke={stroke} strokeWidth="2" />
          <ellipse cx="36" cy="38" rx="2.5" ry="3.5" fill={stroke} stroke="none" />
          <path d="M22 51 C27 49, 32 52, 34 54" fill="none" stroke={stroke} strokeWidth="2" />
          <path d="M30 36 C35 32, 42 33, 45 38" fill="none" stroke={highlight} strokeWidth="2" />
        </g>
      );

    case 'b':
    case 'bishop':
      return (
        <g stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <ellipse cx="50" cy="85" rx="27" ry="7" fill={fill} />
          <path d="M26 84 C30 76, 70 76, 74 84" fill={rim} />
          <path d="M36 78 C39 65, 61 65, 64 78 Z" fill={fill} />
          <ellipse cx="50" cy="56" rx="16" ry="4" fill={rim} />
          <path d="M36 54 C32 40, 36 28, 50 21 C64 28, 68 40, 64 54 Z" fill={fill} />
          <path d="M47 31 L58 41 M43 43 L51 35" fill="none" stroke={stroke} strokeWidth="2.5" />
          <circle cx="50" cy="18" r="4" fill={fill} />
          <path d="M42 32 C41 40, 44 48, 47 52" fill="none" stroke={highlight} strokeWidth="2" />
        </g>
      );

    case 'r':
    case 'rook':
      return (
        <g stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <ellipse cx="50" cy="85" rx="28" ry="7" fill={fill} />
          <path d="M25 84 C30 76, 70 76, 75 84" fill={rim} />
          <path d="M34 78 L37 42 L63 42 L66 78 Z" fill={fill} />
          <ellipse cx="50" cy="42" rx="17" ry="4" fill={rim} />
          <path
            d="M30 40 L30 24 L38 24 L38 29 L46 29 L46 24 L54 24 L54 29 L62 29 L62 24 L70 24 L70 40 Z"
            fill={fill}
          />
          <line x1="42" y1="44" x2="40" y2="76" stroke={highlight} strokeWidth="2.5" />
        </g>
      );

    case 'q':
    case 'queen':
      return (
        <g stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <ellipse cx="50" cy="86" rx="29" ry="7.5" fill={fill} />
          <path d="M24 85 C30 77, 70 77, 76 85" fill={rim} />
          <path d="M33 80 C36 67, 64 67, 67 80 Z" fill={fill} />
          <ellipse cx="50" cy="58" rx="17" ry="4" fill={rim} />
          <path d="M35 56 L24 33 L38 42 L50 26 L62 42 L76 33 L65 56 Z" fill={fill} />
          <circle cx="24" cy="31" r="3.2" fill={fill} />
          <circle cx="38" cy="40" r="3" fill={fill} />
          <circle cx="50" cy="24" r="3.8" fill={fill} />
          <circle cx="62" cy="40" r="3" fill={fill} />
          <circle cx="76" cy="31" r="3.2" fill={fill} />
          <path d="M47 34 L49 54" stroke={highlight} strokeWidth="2.5" />
        </g>
      );

    case 'k':
    case 'king':
      return (
        <g stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <ellipse cx="50" cy="86" rx="30" ry="7.5" fill={fill} />
          <path d="M23 85 C30 77, 70 77, 77 85" fill={rim} />
          <path d="M33 80 C36 66, 64 66, 67 80 Z" fill={fill} />
          <ellipse cx="50" cy="56" rx="18" ry="4.5" fill={rim} />
          <path d="M34 54 C30 40, 36 29, 50 28 C64 29, 70 40, 66 54 Z" fill={fill} />
          <ellipse cx="50" cy="28" rx="11" ry="3.5" fill={rim} />
          <path d="M50 14 L50 25 M45 18 L55 18" stroke={stroke} strokeWidth="3.5" strokeLinecap="square" fill="none" />
          <circle cx="50" cy="18" r="1.5" fill={isWhite ? '#ffd700' : '#d4af37'} stroke="none" />
          <path d="M42 34 C41 42, 44 48, 48 52" fill="none" stroke={highlight} strokeWidth="2.5" />
        </g>
      );

    default:
      return null;
  }
}
