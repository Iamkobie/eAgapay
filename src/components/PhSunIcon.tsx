export function PhSunIcon({ size = 28, color = '#FAC302', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <circle cx="50" cy="50" r="20" fill={color} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line
          key={i}
          x1={50 + 24 * Math.cos((deg * Math.PI) / 180)}
          y1={50 + 24 * Math.sin((deg * Math.PI) / 180)}
          x2={50 + 40 * Math.cos((deg * Math.PI) / 180)}
          y2={50 + 40 * Math.sin((deg * Math.PI) / 180)}
          stroke={color} strokeWidth="7" strokeLinecap="round"
        />
      ))}
    </svg>
  )
}
