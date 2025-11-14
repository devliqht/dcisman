export const EventsIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pixelated"
  >
    {/* Bell top */}
    <rect x="14" y="6" width="4" height="2" fill="currentColor" />

    {/* Bell body - top */}
    <rect x="12" y="8" width="8" height="2" fill="currentColor" />

    {/* Bell body - middle expanding */}
    <rect x="10" y="10" width="12" height="2" fill="currentColor" />
    <rect x="8" y="12" width="16" height="2" fill="currentColor" />
    <rect x="8" y="14" width="16" height="2" fill="currentColor" />

    {/* Bell body - bottom expanding */}
    <rect x="6" y="16" width="20" height="2" fill="currentColor" />
    <rect x="6" y="18" width="20" height="2" fill="currentColor" />

    {/* Bell bottom rim */}
    <rect x="6" y="20" width="20" height="2" fill="currentColor" />

    {/* Bell clapper */}
    <rect x="14" y="22" width="4" height="2" fill="currentColor" />
    <rect x="14" y="24" width="4" height="2" fill="currentColor" />
  </svg>
);
