import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { wish } from '../data/content'
import { world } from '../lib/timeline'

const Lines = ({ items }) =>
  items.map((t, i) => (
    <span key={i} className="ln block overflow-hidden">
      <span className="ln-in block">{t}</span>
    </span>
  ))

function Ornament({ className = '' }) {
  return (
    <svg className={className} viewBox="-50 -50 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d="M0 -6C12 -14 12 -34 0 -44C-12 -34 -12 -14 0 -6Z" transform={`rotate(${i * 60})`} />
        ))}
        <circle r="4" fill="currentColor" />
      </g>
    </svg>
  )
}

export default function Letter() {
  const tiltRef = useRef(null)

  // Tương tác: thiệp nghiêng theo chuột / chạm, có vệt sáng chạy theo.
  useEffect(() => {
    const el = tiltRef.current
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const move = (e) => {
      if (!world.cardLive) return
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      ry(nx * 18)
      rx(-ny * 14)
      el.style.setProperty('--gx', `${(nx + 0.5) * 100}%`)
      el.style.setProperty('--gy', `${(ny + 0.5) * 100}%`)
    }
    const reset = () => { rx(0); ry(0) }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    window.addEventListener('pointerleave', reset)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', move)
      window.removeEventListener('pointerleave', reset)
    }
  }, [])

  return (
    <section className="s4 letter-stage pointer-events-none absolute inset-0 grid place-items-center">
      <div className="envelope">
        <div className="env-shadow env-piece" />
        <div className="env-back env-piece" />

        <div className="card">
          <div className="card-tilt" ref={tiltRef}>
            <div className="card-base paper">
              <div className="wish">
                <Lines items={wish.bottom.slice(0, 3)} />
                <span className="block h-[0.6em]" />
                <Lines items={wish.bottom.slice(3)} />
                <span className="ln mt-[0.8em] block overflow-hidden">
                  <span className="ln-in block text-right text-wine italic">{wish.signature}</span>
                </span>
              </div>
              <div className="glare" />
            </div>
            <div className="card-cover">
              <div className="cover-front">
                <Ornament className="h-[28%] text-champagne" />
                <p className="gold-text mt-2 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-none font-light">20.10</p>
                <p className="mt-2 font-sans text-[0.6rem] tracking-[0.4em] text-champagne/80 uppercase">Her Bloom</p>
              </div>
              <div className="cover-back paper">
                <div className="wish">
                  <span className="ln block overflow-hidden">
                    <span className="ln-in block font-display text-[1.35em] text-wine italic">{wish.heading}</span>
                  </span>
                  <span className="block h-[0.5em]" />
                  <Lines items={wish.top} />
                </div>
                <Ornament className="absolute right-[6%] bottom-[8%] h-[18%] text-champagne/70" />
                <div className="glare" />
              </div>
            </div>
          </div>
        </div>

        <div className="env-pocket env-piece">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points="0,0 50,54 100,0" fill="none" stroke="#D9B77A" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.7" />
          </svg>
        </div>
        <div className="flap">
          <div className="flap-front">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline points="0,0 50,58 100,0" fill="none" stroke="#D9B77A" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.8" />
            </svg>
          </div>
          <div className="flap-back" />
        </div>
        <div className="seal">
          <svg viewBox="-50 -50 100 100" className="h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="seal-g" cx="40%" cy="35%">
                <stop offset="0" stopColor="#fff1d6" />
                <stop offset="0.5" stopColor="#D9B77A" />
                <stop offset="1" stopColor="#8a6a3a" />
              </radialGradient>
            </defs>
            {Array.from({ length: 5 }, (_, i) => (
              <path key={i} className="seal-petal" d="M0 -8C20 -18 22 -44 0 -48C-22 -44 -20 -18 0 -8Z" transform={`rotate(${i * 72})`} fill="url(#seal-g)" stroke="#8a6a3a" strokeWidth="1" />
            ))}
            <circle r="11" fill="#771C32" stroke="#D9B77A" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </section>
  )
}
