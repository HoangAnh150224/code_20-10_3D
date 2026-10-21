import { honorees } from '../data/content'
import FlowerArt from './FlowerArt'

// Cánh hoa lớn: gốc gần tâm (r≈55), đỉnh ở r≈472. Sáu cánh xoay 30° + k·60°.
const PETAL = 'M0 -55C125 -120 175 -330 0 -472C-175 -330 -125 -120 0 -55Z'
export const DEPTHS = [1, 0.55, 1.35, 0.75, 1.15, 0.45]

export default function Gallery() {
  return (
    <section className="s2 pointer-events-none absolute inset-0 grid place-items-center">
      <div className="gallery relative aspect-square w-[min(92vw,62vh)] md:w-[min(88vh,72vw)]">
        <svg className="g-svg h-full w-full overflow-visible" viewBox="-500 -500 1000 1000" aria-hidden="true">
          <defs>
            <linearGradient id="g-sweep" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fff1d6" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff1d6" stopOpacity="0.75" />
              <stop offset="1" stopColor="#fff1d6" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="g-shade" cx="0" cy="-265" r="260" gradientUnits="userSpaceOnUse">
              <stop offset="0.55" stopColor="#170E1B" stopOpacity="0" />
              <stop offset="1" stopColor="#170E1B" stopOpacity="0.65" />
            </radialGradient>
            <radialGradient id="g-core">
              <stop offset="0" stopColor="#fff7f0" />
              <stop offset="0.45" stopColor="#D9B77A" />
              <stop offset="1" stopColor="#771C32" stopOpacity="0" />
            </radialGradient>
            {honorees.map((_, k) => (
              <clipPath id={`g-clip-${k}`} key={k}>
                <path d={PETAL} />
              </clipPath>
            ))}
          </defs>

          {honorees.map((h, k) => {
            const angle = k * 60 + 30
            return (
              <g key={k} transform={`rotate(${angle})`}>
                <g className="pf">
                  <g clipPath={`url(#g-clip-${k})`}>
                    <rect x="-260" y="-500" width="520" height="480" fill="#170E1B" />
                    <g transform="translate(0 -265)">
                      <g className="pf-art" data-depth={DEPTHS[k]}>
                        <g transform={`rotate(${-angle}) scale(1.12)`}>
                          {h.image ? (
                            <image href={h.image} x="-240" y="-240" width="480" height="480" preserveAspectRatio="xMidYMid slice" />
                          ) : (
                            <FlowerArt f={h.flower} uid={k} />
                          )}
                        </g>
                      </g>
                    </g>
                    <path d={PETAL} fill="url(#g-shade)" />
                    <g className="pf-sweep">
                      <rect x="-70" y="-560" width="140" height="640" fill="url(#g-sweep)" transform="rotate(18)" />
                    </g>
                  </g>
                  <path className="pf-outline" d={PETAL} fill="none" stroke="#D9B77A" strokeOpacity="0.5" strokeWidth="1.6" />
                </g>
              </g>
            )
          })}

          <g className="g-core">
            <circle r="80" fill="url(#g-core)" />
            <circle r="44" fill="none" stroke="#D9B77A" strokeWidth="1.5" />
          </g>
        </svg>

        {honorees.map((h, k) => {
          const a = ((k * 60 + 30) * Math.PI) / 180
          const dx = Math.sin(a)
          const side = dx > 0.1 ? 'right' : dx < -0.1 ? 'left' : 'center'
          return (
            <div
              key={k}
              className={`g-label g-label--${side}`}
              style={{ '--lx': `${50 + dx * 58}%`, '--ly': `${50 - Math.cos(a) * 54}%` }}
            >
              <p className="font-sans text-[0.65rem] tracking-[0.3em] text-champagne uppercase">
                {h.role} · {h.flower.label}
              </p>
              <p className="mt-1 font-display text-[clamp(1.6rem,2.4vw,2.4rem)] leading-none text-cream italic">{h.name}</p>
              <p className="mt-2 font-display text-[clamp(0.95rem,1.15vw,1.15rem)] leading-snug text-blush/90">{h.quote}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
