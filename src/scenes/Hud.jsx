import { chapters } from '../data/content'
import { motion } from '../lib/timeline'

function jump(p) {
  const st = motion.tl?.scrollTrigger
  if (!st) return
  const y = st.start + (st.end - st.start) * p
  if (motion.lenis) motion.lenis.scrollTo(y, { duration: 2.6 })
  else window.scrollTo({ top: y })
}

// Cập nhật DOM trực tiếp mỗi frame cuộn — không re-render React.
export function createHudUpdater(root) {
  const bar = root.querySelector('.progress-bar')
  const items = [...root.querySelectorAll('.chapter')]
  let active = 0
  return (self) => {
    bar.style.transform = `scaleX(${self.progress})`
    const i = Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length))
    if (i !== active) {
      items.forEach((el, k) => el.classList.toggle('is-active', k === i))
      active = i
    }
  }
}

export default function Hud() {
  return (
    <>
      <header className="hud pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8">
        <p className="font-display text-lg tracking-[0.2em] uppercase md:text-xl">
          Her <em className="text-champagne">Bloom</em>
        </p>
        <p className="font-sans text-[0.65rem] tracking-[0.35em] uppercase opacity-70">20 · 10 · 2026</p>
      </header>

      <nav className="hud chapters-nav absolute top-1/2 right-4 hidden -translate-y-1/2 flex-col gap-4 md:right-8 md:flex" aria-label="Chương">
        {chapters.map((c, i) => (
          <button key={c.en} type="button" onClick={() => jump(c.jump)} className={`chapter ${i === 0 ? 'is-active' : ''}`} aria-label={`${String(i + 1).padStart(2, '0')} ${c.label}`}>
            <span className="chapter-label">
              <span className="opacity-60">0{i + 1}</span> {c.label}
            </span>
            <span className="chapter-dot" />
          </button>
        ))}
      </nav>

      <div className="hud progress absolute inset-x-0 bottom-0 h-px">
        <span className="progress-bar block h-full origin-left" />
      </div>

      <div className="s1-hint hud pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-center">
        <p className="font-sans text-[0.65rem] tracking-[0.4em] uppercase opacity-80">Cuộn để đánh thức đóa hoa</p>
        <span className="hint-line" />
      </div>
    </>
  )
}
