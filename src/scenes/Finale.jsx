import { useRef, useState } from 'react'
import gsap from 'gsap'
import Reveal from './Reveal'
import { world, motion } from '../lib/timeline'

export default function Finale() {
  const dialog = useRef(null)
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const link = `${location.origin}${location.pathname}${name.trim() ? `?to=${encodeURIComponent(name.trim())}` : ''}`

  function sendLove() {
    // Hoa nở lần nữa: cánh bung ra rồi tụ lại
    gsap.timeline()
      .to(world, { pulse: 1, duration: 0.8, ease: 'power3.out' })
      .to(world, { pulse: 0, duration: 2.4, ease: 'power2.inOut' })
    setCopied(false)
    dialog.current.showModal()
    motion.lenis?.stop()
  }

  async function copy() {
    try {
      if (navigator.share) await navigator.share({ title: 'Her Bloom — 20/10', url: link })
      else await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {
      /* người dùng huỷ chia sẻ */
    }
  }

  const replay = () => {
    if (motion.lenis) motion.lenis.scrollTo(0, { duration: 7, easing: (t) => 1 - Math.pow(1 - t, 3) })
    else window.scrollTo({ top: 0 })
  }

  return (
    <section className="s5 pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
      <div className="fin-veil absolute inset-0" />
      <Reveal as="h2" split="char" className="fin-title relative font-display text-[clamp(1.6rem,4.6vw,4rem)] font-medium tracking-[0.18em] text-cream" text="HAPPY WOMEN'S DAY" />
      <p className="fin-date relative mt-2 font-display text-[clamp(5.5rem,19vw,16rem)] leading-[0.85] font-light">
        <span className="fin-date-in gold-text inline-block pb-[0.06em]">20.10</span>
      </p>
      <Reveal as="p" className="fin-sub relative mt-4 font-display text-[clamp(1.15rem,2.2vw,1.8rem)] text-blush italic" text="To all the wonderful women in our lives." />
      <div className="fin-cta pointer-events-auto relative mt-10 flex flex-wrap items-center justify-center gap-4">
        <button type="button" onClick={sendLove} className="btn-gold">
          Gửi lời yêu thương
        </button>
        <button type="button" onClick={replay} className="font-sans text-xs tracking-[0.3em] text-cream/70 uppercase transition hover:text-cream">
          ↺ Xem lại từ đầu
        </button>
      </div>

      <dialog ref={dialog} data-lenis-prevent onClose={() => motion.lenis?.start()} className="love-dialog">
        <form method="dialog" className="flex flex-col gap-4 text-left">
          <p className="font-sans text-[0.65rem] tracking-[0.35em] text-champagne uppercase">Thiệp 20/10</p>
          <h3 className="font-display text-3xl text-cream italic">Gửi tới một đóa hoa</h3>
          <label className="flex flex-col gap-2 font-sans text-sm text-blush/90">
            Tên người nhận
            <input
              value={name}
              maxLength={40}
              onChange={(e) => { setName(e.target.value); setCopied(false) }}
              placeholder="Ví dụ: Mẹ, Lan, chị Hà…"
              className="rounded-full border border-champagne/40 bg-white/5 px-5 py-3 text-cream outline-none placeholder:text-cream/30 focus:border-champagne"
            />
          </label>
          <p className="font-sans text-xs break-all text-cream/50">{link}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <button type="button" onClick={copy} className="btn-gold">
              {copied ? 'Đã sẵn sàng gửi ✓' : 'Sao chép / chia sẻ liên kết'}
            </button>
            <button className="px-4 font-sans text-xs tracking-[0.3em] text-cream/60 uppercase hover:text-cream">Đóng</button>
          </div>
        </form>
      </dialog>
    </section>
  )
}
