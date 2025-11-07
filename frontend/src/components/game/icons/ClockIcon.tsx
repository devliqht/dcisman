export const ClockIcon = () => (
  <svg className='w-6 h-6' viewBox='0 0 32 32' fill='none'>
    {/* Outer circle */}
    <rect x='10' y='4' width='12' height='2' fill='currentColor' />
    <rect x='8' y='6' width='2' height='2' fill='currentColor' />
    <rect x='22' y='6' width='2' height='2' fill='currentColor' />
    <rect x='6' y='8' width='2' height='2' fill='currentColor' />
    <rect x='24' y='8' width='2' height='2' fill='currentColor' />
    <rect x='4' y='10' width='2' height='12' fill='currentColor' />
    <rect x='26' y='10' width='2' height='12' fill='currentColor' />
    <rect x='6' y='22' width='2' height='2' fill='currentColor' />
    <rect x='24' y='22' width='2' height='2' fill='currentColor' />
    <rect x='8' y='24' width='2' height='2' fill='currentColor' />
    <rect x='22' y='24' width='2' height='2' fill='currentColor' />
    <rect x='10' y='26' width='12' height='2' fill='currentColor' />

    {/* Clock hands - pointing to 3 o'clock */}
    {/* Hour hand (short) - center to right */}
    <rect x='16' y='14' width='6' height='2' fill='currentColor' />
    {/* Minute hand (long) - center upward */}
    <rect x='15' y='8' width='2' height='8' fill='currentColor' />

    {/* Center dot */}
    <rect x='15' y='15' width='2' height='2' fill='currentColor' />
  </svg>
);
