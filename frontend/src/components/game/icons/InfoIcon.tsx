export const InfoIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pixelated"
  >
    {/* outer circle */}
    <rect x="8" y="6" width="16" height="2" fill="currentColor" />
    <rect x="6" y="8" width="2" height="16" fill="currentColor" />
    <rect x="24" y="8" width="2" height="16" fill="currentColor" />
    <rect x="8" y="24" width="16" height="2" fill="currentColor" />

    {/* dot on top (i dot) */}
    <rect x="14" y="10" width="4" height="4" fill="currentColor" />

    {/* vertical line (i body) */}
    <rect x="14" y="16" width="4" height="6" fill="currentColor" />
  </svg>
);
