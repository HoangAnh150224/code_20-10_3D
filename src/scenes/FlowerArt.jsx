// Tác phẩm hoa vẽ bằng SVG — dùng khi chưa có ảnh thật. Vẽ trong vòng tròn bán kính ~240 quanh (0,0).
function petalPath(shape, L, w) {
  if (shape === 'pointed') return `M0 0C${w} ${-L * 0.3} ${w * 0.7} ${-L * 0.78} 0 ${-L}C${-w * 0.7} ${-L * 0.78} ${-w} ${-L * 0.3} 0 0Z`
  if (shape === 'thin') return `M0 0C${w} ${-L * 0.35} ${w * 0.8} ${-L * 0.92} 0 ${-L}C${-w * 0.8} ${-L * 0.92} ${-w} ${-L * 0.35} 0 0Z`
  return `M0 0C${w * 1.25} ${-L * 0.25} ${w * 1.2} ${-L * 1.02} 0 ${-L * 0.9}C${-w * 1.2} ${-L * 1.02} ${-w * 1.25} ${-L * 0.25} 0 0Z`
}

export default function FlowerArt({ f, uid }) {
  const d = petalPath(f.shape, f.len, f.width)
  const id = (k) => `fa-${k}-${uid}`
  return (
    <g>
      <defs>
        <radialGradient id={id('bg')} cx="50%" cy="42%" r="62%">
          <stop offset="0" stopColor={f.bg[1]} />
          <stop offset="1" stopColor={f.bg[0]} />
        </radialGradient>
        <linearGradient id={id('p')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={f.petal[0]} />
          <stop offset="1" stopColor={f.petal[1]} />
        </linearGradient>
        <radialGradient id={id('c')}>
          <stop offset="0" stopColor="#fff1d6" />
          <stop offset="0.6" stopColor={f.center} />
          <stop offset="1" stopColor="#5a3a1a" />
        </radialGradient>
      </defs>
      <rect x="-260" y="-260" width="520" height="520" fill={`url(#${id('bg')})`} />
      {Array.from({ length: 18 }, (_, i) => (
        <line key={i} x1="0" y1="0" x2="0" y2="-260" transform={`rotate(${i * 20})`} stroke="#D9B77A" strokeOpacity="0.09" strokeWidth="1.2" />
      ))}
      {Array.from({ length: f.layers }, (_, li) => {
        const s = 1 - li * (0.7 / f.layers)
        return (
          <g key={li} transform={`rotate(${li * (180 / f.count)}) scale(${s})`} opacity={0.78 + (0.22 * li) / Math.max(1, f.layers - 1)}>
            {Array.from({ length: f.count }, (_, j) => (
              <path key={j} d={d} transform={`rotate(${(j * 360) / f.count})`} fill={`url(#${id('p')})`} stroke="#FFF7F0" strokeOpacity="0.3" strokeWidth={1.2 / s} />
            ))}
          </g>
        )
      })}
      <circle r={f.len * 0.16} fill={`url(#${id('c')})`} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return <circle key={i} cx={Math.cos(a) * f.len * 0.23} cy={Math.sin(a) * f.len * 0.23} r="3.2" fill="#fff1d6" opacity="0.85" />
      })}
    </g>
  )
}
