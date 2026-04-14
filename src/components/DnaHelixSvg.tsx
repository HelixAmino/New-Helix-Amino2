export function DnaHelixSvg({ size = 220, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="helixGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="50%" stopColor="#0099cc" />
          <stop offset="100%" stopColor="#005f8a" />
        </linearGradient>
        <linearGradient id="helixGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00ffcc" />
          <stop offset="50%" stopColor="#00c9a0" />
          <stop offset="100%" stopColor="#007a62" />
        </linearGradient>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8f4f8" />
          <stop offset="30%" stopColor="#a0d4e8" />
          <stop offset="60%" stopColor="#4db8d4" />
          <stop offset="100%" stopColor="#0088aa" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow ring */}
      <circle cx="110" cy="110" r="100" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.15" fill="none" />
      <circle cx="110" cy="110" r="90" stroke="#00d4ff" strokeWidth="0.3" strokeOpacity="0.1" fill="none" />

      {/* Strand 1 - left curve */}
      <path
        d="M 80 20 C 50 50, 50 80, 80 110 C 110 140, 110 165, 80 195"
        stroke="url(#helixGrad1)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />

      {/* Strand 2 - right curve */}
      <path
        d="M 140 20 C 170 50, 170 80, 140 110 C 110 140, 110 165, 140 195"
        stroke="url(#helixGrad2)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />

      {/* Base pairs / rungs */}
      <line x1="83" y1="38" x2="137" y2="38" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" filter="url(#glow)" />
      <line x1="72" y1="58" x2="148" y2="58" stroke="#00c9a0" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="62" y1="78" x2="158" y2="78" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" filter="url(#glow)" />
      <line x1="64" y1="98" x2="156" y2="98" stroke="#00c9a0" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="80" y1="118" x2="140" y2="118" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" filter="url(#glow)" />
      <line x1="100" y1="138" x2="120" y2="138" stroke="#00c9a0" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="100" y1="158" x2="120" y2="158" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" filter="url(#glow)" />
      <line x1="92" y1="178" x2="128" y2="178" stroke="#00c9a0" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />

      {/* Node dots on strand 1 */}
      <circle cx="83" cy="38" r="4" fill="#00d4ff" filter="url(#glow)" />
      <circle cx="62" cy="78" r="4" fill="#00d4ff" filter="url(#glow)" />
      <circle cx="80" cy="118" r="4" fill="#00d4ff" filter="url(#glow)" />
      <circle cx="100" cy="158" r="4" fill="#00d4ff" filter="url(#glow)" />

      {/* Node dots on strand 2 */}
      <circle cx="137" cy="38" r="4" fill="#00ffcc" filter="url(#glow)" />
      <circle cx="158" cy="78" r="4" fill="#00ffcc" filter="url(#glow)" />
      <circle cx="140" cy="118" r="4" fill="#00ffcc" filter="url(#glow)" />
      <circle cx="120" cy="158" r="4" fill="#00ffcc" filter="url(#glow)" />

      {/* Center molecule highlight */}
      <circle cx="110" cy="110" r="6" fill="#00d4ff" fillOpacity="0.2" />
      <circle cx="110" cy="110" r="3" fill="#00d4ff" fillOpacity="0.6" filter="url(#glow)" />
    </svg>
  );
}

export function DnaHelixLogoSmall({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#0088aa" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00ffcc" />
          <stop offset="100%" stopColor="#007a62" />
        </linearGradient>
      </defs>
      <path d="M 12 2 C 6 8, 6 14, 12 18 C 18 22, 18 28, 12 34" stroke="url(#logoGrad1)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 24 2 C 30 8, 30 14, 24 18 C 18 22, 18 28, 24 34" stroke="url(#logoGrad2)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="13" y1="6" x2="23" y2="6" stroke="#00d4ff" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="12" x2="28" y2="12" stroke="#00c9a0" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="8" y1="18" x2="28" y2="18" stroke="#00d4ff" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="13" y1="24" x2="23" y2="24" stroke="#00c9a0" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="13" y1="30" x2="23" y2="30" stroke="#00d4ff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
