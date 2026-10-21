import { story } from '../data/content'
import Reveal from './Reveal'

// Dải lụa đi vào từ trái, vẽ thành trái tim ở giữa rồi bay ra góc phải.
const RIBBON =
  'M-120 760C180 860 520 760 800 640C600 520 540 330 660 280C740 248 800 300 800 360C800 300 860 248 940 280C1060 330 1000 520 800 640C640 740 980 860 1240 620C1420 460 1560 300 1740 240'
const GOLD_OFFSETS = [-24, -12, 0, 12, 24]

const POS = {
  'st-1': 'left-6 bottom-[12vh] md:left-[8vw] md:bottom-[14vh] text-left items-start',
  'st-2': 'right-6 top-[16vh] md:right-[12vw] md:top-[16vh] text-right items-end',
  'st-3': 'inset-x-6 mx-auto bottom-[9vh] md:bottom-[10vh] text-center items-center',
}

export default function Story() {
  return (
    <section className="s3 pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="rb-pink" x1="0" x2="1600" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F4B8C7" stopOpacity="0" />
            <stop offset="0.25" stopColor="#F4B8C7" />
            <stop offset="0.5" stopColor="#fff1f4" />
            <stop offset="0.75" stopColor="#e98ea6" />
            <stop offset="1" stopColor="#771C32" stopOpacity="0" />
          </linearGradient>
          <filter id="rb-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g className="rb-pink" fill="none" strokeLinecap="butt">
          <path className="rb" d={RIBBON} pathLength="1" strokeDasharray="1" stroke="url(#rb-pink)" strokeWidth="46" opacity="0.35" filter="url(#rb-soft)" />
          <path className="rb" d={RIBBON} pathLength="1" strokeDasharray="1" stroke="url(#rb-pink)" strokeWidth="16" opacity="0.85" />
          <path className="rb" d={RIBBON} pathLength="1" strokeDasharray="1" stroke="#FFF7F0" strokeWidth="2" opacity="0.9" />
        </g>
        <g fill="none" stroke="#D9B77A" strokeLinecap="round">
          {GOLD_OFFSETS.map((o) => (
            <path key={o} className="rb rb-gold" d={RIBBON} pathLength="1" strokeDasharray="1" strokeWidth={o === 0 ? 2.2 : 1.2} transform={`translate(0 ${o})`} />
          ))}
        </g>
      </svg>

      {story.map((s) => (
        <div key={s.key} className={`st ${s.key} absolute flex max-w-[34rem] flex-col ${POS[s.key]}`}>
          <span className="st-num font-display text-[clamp(3rem,7vw,6rem)] leading-none font-light text-champagne/25 italic">{s.numeral}</span>
          <Reveal as="p" className="st-eyebrow mt-2 font-sans text-xs tracking-[0.4em] text-champagne uppercase" text={s.eyebrow} />
          <Reveal as="h2" className="st-title mt-3 font-display text-[clamp(2.3rem,5vw,4.5rem)] leading-[0.95] text-cream italic" text={s.title} />
          <Reveal as="p" className="st-body mt-4 max-w-[30ch] font-display text-[clamp(1.1rem,1.6vw,1.45rem)] leading-snug text-blush/90" text={s.body} />
        </div>
      ))}
    </section>
  )
}
