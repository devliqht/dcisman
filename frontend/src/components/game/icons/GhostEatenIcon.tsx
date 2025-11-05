export const GhostEatenIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pixelated"
  >
    {/* ghost head */}
    <rect x="8" y="6" width="16" height="2" fill="currentColor" />
    <rect x="6" y="8" width="2" height="4" fill="currentColor" />
    <rect x="24" y="8" width="2" height="4" fill="currentColor" />
    <rect x="6" y="12" width="20" height="10" fill="currentColor" />

    {/* wavy bottom */}
    <rect x="6" y="22" width="4" height="2" fill="currentColor" />
    <rect x="12" y="22" width="4" height="2" fill="currentColor" />
    <rect x="18" y="22" width="4" height="2" fill="currentColor" />
    <rect x="8" y="24" width="4" height="2" fill="currentColor" />
    <rect x="16" y="24" width="4" height="2" fill="currentColor" />

    {/* left eye */}
    <rect x="10" y="12" width="4" height="4" fill="currentColor" />
    <rect x="10" y="12" width="2" height="2" fill="white" />

    {/* right eye */}
    <rect x="18" y="12" width="4" height="4" fill="currentColor" />
    <rect x="18" y="12" width="2" height="2" fill="white" />
  </svg>
);
