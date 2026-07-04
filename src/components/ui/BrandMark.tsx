interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 32, className = "" }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`brand-mark ${className}`.trim()}
      role="img"
      aria-label="HousingBook"
    >
      <defs>
        <linearGradient id="brandGlobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#213a82" />
          <stop offset="100%" stopColor="#0a1330" />
        </linearGradient>
        <linearGradient id="brandRoad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6d8bff" />
          <stop offset="100%" stopColor="#b98bff" />
        </linearGradient>
        <clipPath id="brandClip">
          <circle cx="32" cy="32" r="23" />
        </clipPath>
      </defs>

      <circle cx="32" cy="32" r="23" fill="url(#brandGlobe)" />

      <g clipPath="url(#brandClip)">
        <path d="M9 27c8 3 38 3 46 0" stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" />
        <path d="M9 38c8 3 38 3 46 0" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />

        <path
          d="M4 26c6 -3 12 -3 16 0v9H4z"
          fill="#182c63"
        />
        <path
          d="M46 30c6 -2 12 -1 15 2v6H46z"
          fill="#152657"
        />

        <g fill="#eef1fb">
          <rect x="20" y="16" width="4.4" height="18" rx="0.6" />
          <rect x="20.7" y="10.5" width="3" height="6.5" rx="0.5" />
          <rect x="24.9" y="21" width="4.6" height="13" rx="0.6" opacity="0.92" />
          <rect x="30.1" y="24.5" width="4.2" height="9.5" rx="0.6" opacity="0.86" />
          <rect x="34.9" y="19.5" width="4" height="14.5" rx="0.6" opacity="0.9" />
        </g>
        <rect x="21.75" y="8.6" width="1" height="2.2" fill="#f4d67a" />

        <path d="M2 40c9 8 41 8 50 0v24H2z" fill="#0a1330" opacity="0.001" />
      </g>

      <path
        d="M7 41.5c9 8.5 41 8.5 50 0"
        stroke="url(#brandRoad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="27" cy="47.1" r="1.7" fill="#fff" />

      <circle cx="32" cy="32" r="23" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
  );
}
