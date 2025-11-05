export const TargetIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pixelated"
  >
    {/* outer ring */}
    <rect x="8" y="6" width="16" height="2" fill="currentColor" />
    <rect x="6" y="8" width="2" height="16" fill="currentColor" />
    <rect x="24" y="8" width="2" height="16" fill="currentColor" />
    <rect x="8" y="24" width="16" height="2" fill="currentColor" />

    {/* middle ring */}
    <rect x="10" y="10" width="12" height="2" fill="currentColor" />
    <rect x="10" y="12" width="2" height="8" fill="currentColor" />
    <rect x="20" y="12" width="2" height="8" fill="currentColor" />
    <rect x="10" y="20" width="12" height="2" fill="currentColor" />

    {/* center dot */}
    <rect x="14" y="14" width="4" height="4" fill="currentColor" />

    {/* arrow pointing to center */}
    <rect x="28" y="14" width="2" height="4" fill="currentColor" />
    <rect x="26" y="12" width="2" height="2" fill="currentColor" />
    <rect x="26" y="18" width="2" height="2" fill="currentColor" />
  </svg>
);
