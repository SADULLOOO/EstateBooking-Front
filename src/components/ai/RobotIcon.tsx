interface RobotIconProps {
  size?: number;
  className?: string;
}

export function RobotIcon({ size = 34, className = "" }: RobotIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`robot-icon ${className}`.trim()}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="robotBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2f5ff" />
          <stop offset="100%" stopColor="#c3ccf0" />
        </linearGradient>
        <radialGradient id="robotEye" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#eafcff" />
          <stop offset="55%" stopColor="#5fe0ff" />
          <stop offset="100%" stopColor="#1c8fd6" />
        </radialGradient>
      </defs>

      <ellipse cx="24" cy="41" rx="11" ry="2.4" fill="#1c2440" opacity="0.35" />

      <rect x="21.2" y="6" width="1.6" height="6" rx="0.8" fill="#aab3d9" />
      <circle cx="22" cy="5" r="2.1" fill="#5fe0ff" />

      <circle cx="24" cy="24" r="15.5" fill="url(#robotBody)" stroke="#9aa4d6" strokeWidth="1" />

      <path d="M9 22c-2.6 0-4.6 2-4.6 4.4S6.4 30.8 9 30.8" stroke="#aab3d9" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M39 22c2.6 0 4.6 2 4.6 4.4S41.6 30.8 39 30.8" stroke="#aab3d9" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      <circle cx="24" cy="25" r="8.4" fill="#141a30" />
      <circle cx="24" cy="25" r="6.6" fill="url(#robotEye)" />
      <circle cx="21.6" cy="22.6" r="1.7" fill="#ffffff" opacity="0.85" />

      <path d="M15 33.5c3 2.2 15 2.2 18 0" stroke="#7b86bd" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
