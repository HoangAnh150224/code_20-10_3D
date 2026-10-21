import gsap from 'gsap'
import { DEPTHS } from '../scenes/Gallery'

// Trạng thái dùng chung giữa timeline (DOM) và WebGL. Timeline tween các số này, stage đọc mỗi frame.
export const world = {
  camZ: 6, bloom: 0, burst: 0, split: 0, rosette: 1, rot: 0, glow: 0, palette: 0, roseVis: 1,
  m1: 0, m2: 0, pOpacity: 0.35, disperse: 0,
  fieldScale: 1, converge: 0, roseGlow: 0, roseBack: 0, pulse: 0, finale: 0, cardLive: 0,
}
export const motion = { lenis: null, tl: null }

const IN = { yPercent: 0, rotate: 0, opacity: 1, ease: 'power3.out' }

// Một master timeline dài 100 đơn vị = 0–100% quãng cuộn. Scrub ⇒ cuộn xuôi/ngược đều tái hiện chính xác.
export function buildTimeline(root, { isMobile, reduced, onUpdate }) {
  const q = gsap.utils.selector(root)
  const words = (sel) => q(`${sel} .wi`)

  // ---------- trạng thái ban đầu ----------
  gsap.set(q('.reveal .wi'), { yPercent: 115, rotate: 4, opacity: 0 })
  gsap.set(words('.fin-title'), { yPercent: 100, rotate: 0, filter: 'blur(12px)' })
  gsap.set(q('.ln-in'), { yPercent: 110, opacity: 0 })
  gsap.set(q('.s1-date-in'), { clipPath: 'inset(0% 50% 0% 50%)', letterSpacing: '0.35em' })
  gsap.set(q('.fin-date-in'), { clipPath: 'inset(100% 0% 0% 0%)', letterSpacing: '0.2em' })
  gsap.set(q('.flash'), { scale: 0.2, opacity: 0 })
  gsap.set(q('.gallery'), { autoAlpha: 0, scale: 0.4 })
  gsap.set(q('.g-svg'), { rotate: -45 })
  gsap.set(q('.pf'), { scaleX: 0.35, scaleY: 0, opacity: 0, svgOrigin: '0 0' })
  gsap.set(q('.pf-sweep'), { x: -420 })
  gsap.set(q('.g-core'), { scale: 0, opacity: 0, svgOrigin: '0 0' })
  gsap.set(q('.g-label'), { autoAlpha: 0, y: 16 })
  gsap.set(q('.rb'), { strokeDashoffset: 1 })
  gsap.set(q('.envelope'), { autoAlpha: 0, y: '45vh', rotateX: 38, rotateZ: -10, scale: 0.7 })
  gsap.set(q('.env-back'), { z: -4 })
  gsap.set(q('.card'), { z: -1 })
  gsap.set(q('.card-cover'), { z: 1 })
  gsap.set(q('.env-pocket'), { z: 1 })
  gsap.set(q('.flap'), { z: 2 })
  gsap.set(q('.seal'), { z: 3 })
  gsap.set(q('.fin-veil, .s1-veil'), { opacity: 0 })
  gsap.set(q('.st-num'), { opacity: 0, x: -30 })
  gsap.set(q('.fin-cta'), { autoAlpha: 0, y: 20 })

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: q('#track')[0], start: 'top top', end: 'bottom bottom', scrub: reduced ? true : 1, onUpdate },
  })

  // ================= 01 THE AWAKENING (0–20) =================
  tl.to(q('.s1-hint'), { autoAlpha: 0, y: -20, duration: 3 }, 0)
  tl.to(world, { bloom: 1, duration: 13, ease: 'power1.inOut' }, 0)
  tl.to(world, { camZ: 4.8, duration: 16, ease: 'power1.inOut' }, 0)
  tl.to(world, { rot: 3.2, duration: 20 }, 0)
  tl.to(world, { split: 1, duration: 10, ease: 'power2.inOut' }, 4)
  tl.to(world, { burst: 1, duration: 9, ease: 'power2.in' }, 8)
  tl.to(q('.s1-veil'), { opacity: 1, duration: 4 }, 9.5)
  tl.to(q('.s1-veil'), { opacity: 0, duration: 3 }, 19)
  tl.to(q('.s1-date-in'), { clipPath: 'inset(0% 0% 0% 0%)', letterSpacing: '0.02em', duration: 4, ease: 'power3.out' }, 10)
  tl.to(words('.s1-sub'), { ...IN, stagger: 0.25, duration: 2 }, 12)
  tl.to(words('.s1-quote'), { ...IN, stagger: 0.2, duration: 2.5 }, 13.5)
  tl.to(world, { rosette: 0.25, duration: 4 }, 14)
  tl.to(q('.s1-text'), { scale: 1.6, autoAlpha: 0, duration: 3, ease: 'power2.in' }, 19)

  // ================= 02 THE BEAUTY REVEAL (20–40) =================
  // Camera lao xuyên qua tâm hoa
  tl.to(world, { camZ: -2, duration: 6, ease: 'power2.in' }, 18.5)
  tl.set(world, { roseVis: 0 }, 24.6)
  tl.to(world, { glow: 0.6, duration: 2, ease: 'power2.in' }, 22)
  tl.to(world, { glow: 0, duration: 3 }, 24)
  tl.to(q('.flash'), { scale: 3, opacity: 1, duration: 2.5, ease: 'power2.in' }, 22)
  tl.to(q('.flash'), { scale: 5, opacity: 0, duration: 3, ease: 'power2.out' }, 24.5)
  tl.to(world, { palette: 1, duration: 6 }, 20)
  tl.to(world, { split: 0.2, rosette: 0, duration: 5 }, 20)

  tl.to(q('.gallery'), { autoAlpha: 1, scale: 1, duration: 5, ease: 'power3.out' }, 23.5)
  tl.to(q('.g-svg'), { rotate: 0, duration: 5, ease: 'power3.out' }, 23.5)
  q('.pf-art').forEach((el, k) => {
    tl.fromTo(el, { y: 45 * DEPTHS[k] }, { y: -45 * DEPTHS[k], duration: 15, immediateRender: true }, 23.5)
  })
  const labels = q('.g-label')
  q('.pf').forEach((el, k) => {
    const at = 25 + k * 1.5
    tl.to(el, { scaleX: 1, scaleY: 1, opacity: 1, duration: 2.2, ease: 'back.out(1.3)' }, at)
    tl.to(el.querySelector('.pf-sweep'), { x: 420, duration: 2.6, ease: 'power2.inOut' }, at + 0.8)
    tl.to(labels[k], { autoAlpha: 1, y: 0, duration: 1.5, ease: 'power2.out' }, at + 0.6)
    if (k > 0) tl.to(labels[k - 1], { autoAlpha: isMobile ? 0 : 0.45, duration: 1 }, at + 0.3)
  })
  // Sáu khung ghép thành một bông hoa lớn
  tl.to(labels, { autoAlpha: 0, duration: 1.5 }, 35)
  tl.to(q('.pf'), { y: 40, scale: 0.9, duration: 3, ease: 'power2.inOut' }, 35)
  tl.to(q('.pf-outline'), { strokeOpacity: 1, strokeWidth: 3, duration: 2 }, 35)
  tl.to(q('.g-core'), { scale: 1, opacity: 1, duration: 3, ease: 'power3.out' }, 35.5)
  tl.to(q('.g-svg'), { rotate: 60, duration: 4, ease: 'power2.inOut' }, 35)
  tl.to(q('.gallery'), { scale: 0.82, duration: 4, ease: 'power2.inOut' }, 35)

  // ================= 03 THE STORY OF HER (40–60) =================
  tl.to(q('.g-svg'), { rotate: 200, duration: 4, ease: 'power3.in' }, 39)
  tl.to(q('.gallery'), { scale: 0, autoAlpha: 0, duration: 4, ease: 'power3.in' }, 39)
  tl.to(world, { palette: 2, duration: 4 }, 39)
  tl.to(world, { fieldScale: 0.3, duration: 4, ease: 'power2.inOut' }, 39)
  tl.to(world, { fieldScale: 1, duration: 4, ease: 'power2.inOut' }, 59)

  // Sự dịu dàng — dải lụa hồng vẽ thành trái tim
  tl.to(q('.rb-pink .rb'), { strokeDashoffset: 0, duration: 6, ease: 'power1.inOut', stagger: 0.15 }, 41)
  tl.to(q('.st-1 .st-num'), { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 43)
  tl.to(words('.st-1'), { ...IN, stagger: 0.1, duration: 1.6 }, 43)
  tl.to(q('.st-1'), { autoAlpha: 0, y: -40, duration: 2, ease: 'power2.in' }, 47.5)

  // Sự mạnh mẽ — lụa hóa thành những đường sáng vàng
  tl.to(q('.rb-pink'), { opacity: 0, duration: 3 }, 48)
  tl.to(q('.rb-gold'), { strokeDashoffset: 0, duration: 3, stagger: 0.2 }, 48)
  tl.to(world, { m1: 1, pOpacity: 0.9, duration: 4, ease: 'power2.inOut' }, 49.5)
  tl.to(q('.rb-gold'), { strokeDashoffset: -1, duration: 4, ease: 'power1.in', stagger: 0.15 }, 51)
  tl.to(q('.st-2 .st-num'), { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 49.5)
  tl.to(words('.st-2'), { ...IN, stagger: 0.1, duration: 1.6 }, 49.5)
  tl.to(q('.st-2'), { autoAlpha: 0, y: -40, duration: 2, ease: 'power2.in' }, 53.5)

  // Sự tỏa sáng — đường sáng hợp nhất thành đóa hoa từ hạt
  tl.to(world, { m2: 1, duration: 4.5, ease: 'power2.inOut' }, 53.5)
  tl.to(q('.st-3 .st-num'), { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 55)
  tl.to(words('.st-3'), { ...IN, stagger: 0.1, duration: 1.6 }, 55)
  tl.to(q('.st-3'), { autoAlpha: 0, y: -40, duration: 2, ease: 'power2.in' }, 59)

  // ================= 04 WORDS FROM THE HEART (60–80) =================
  tl.to(world, { disperse: 1, pOpacity: 0, duration: 4, ease: 'power2.in' }, 59)
  tl.set(world, { m1: 0, m2: 0, disperse: 0 }, 70)
  tl.to(world, { palette: 3, duration: 4, ease: 'power1.inOut' }, 59.5)
  tl.to(root, { '--ink': '#5a1527', duration: 3 }, 60)

  tl.to(q('.envelope'), { autoAlpha: 1, y: 0, rotateX: 12, rotateZ: -4, scale: 0.85, duration: 4, ease: 'power3.out' }, 61)
  tl.to(q('.envelope'), { rotateX: 0, rotateZ: 0, scale: 1, duration: 3, ease: 'power2.inOut' }, 64.5)
  tl.to(q('.seal'), { scale: 1.2, rotate: 72, duration: 1.2, ease: 'power2.out' }, 66.5)
  tl.to(q('.seal-petal'), { opacity: 0, scale: 1.6, svgOrigin: '0 0', duration: 1.4, stagger: 0.08, ease: 'power2.in' }, 67.3)
  tl.to(q('.seal'), { autoAlpha: 0, duration: 1 }, 68)
  tl.to(q('.flap'), { rotateX: 180, duration: 2.5, ease: 'power2.inOut' }, 68.5)
  tl.set(q('.flap'), { z: -3 }, 69.75)
  tl.to(q('.card'), { yPercent: -62, duration: 3, ease: 'power2.out' }, 70.5)
  tl.to(q('.env-piece, .flap'), { yPercent: 130, autoAlpha: 0, duration: 3, ease: 'power2.in', stagger: 0.1 }, 73.2)
  tl.to(q('.card'), { yPercent: 50, scale: isMobile ? 1 : 1.12, duration: 3.5, ease: 'power2.inOut' }, 73.5)
  tl.to(q('.card-cover'), { rotateX: 180, duration: 3, ease: 'power2.inOut' }, 74.5)
  tl.set(world, { cardLive: 1 }, 76)
  tl.to([...q('.cover-back .ln-in'), ...q('.card-base .ln-in')], { yPercent: 0, opacity: 1, stagger: 0.38, duration: 1.4, ease: 'power3.out' }, 76)

  // ================= 05 THE GRAND FINALE (80–100) =================
  tl.set(world, { cardLive: 0 }, 81.5)
  tl.to(q('.card'), { yPercent: 20, scale: 0.6, autoAlpha: 0, rotateX: 25, duration: 3, ease: 'power2.in' }, 81.5)
  tl.to(root, { '--ink': '#FFF7F0', duration: 3 }, 81.5)
  tl.to(world, { palette: 4, duration: 4 }, 81)
  tl.to(world, { camZ: 9, finale: 1, duration: 8, ease: 'power2.inOut' }, 81)
  tl.to(world, { converge: 1, duration: 9, ease: 'power1.inOut' }, 83)
  tl.to(world, { rosette: 0.5, duration: 4 }, 88)
  tl.to(world, { pOpacity: 0.5, duration: 5 }, 90)
  tl.to(world, { roseGlow: 1, duration: 2.5, ease: 'power2.in' }, 91.5)
  tl.to(q('.flash'), { scale: 3.5, opacity: 0.9, duration: 1.5, ease: 'power2.in' }, 92.5)
  tl.to(q('.flash'), { scale: 6, opacity: 0, duration: 2.5, ease: 'power2.out' }, 94)
  tl.to(world, { roseGlow: 0.2, roseBack: 1.6, duration: 3 }, 94)
  tl.to(q('.fin-veil'), { opacity: 1, duration: 3 }, 93.5)
  tl.to(words('.fin-title'), { yPercent: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.12, duration: 1.5, ease: 'power3.out' }, 93.5)
  tl.to(q('.fin-date-in'), { clipPath: 'inset(0% 0% 0% 0%)', letterSpacing: '0.02em', duration: 2.5, ease: 'power3.out' }, 95)
  tl.to(words('.fin-sub'), { ...IN, stagger: 0.12, duration: 1.5 }, 96.5)
  tl.to(q('.fin-cta'), { autoAlpha: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 98)
  tl.set({}, {}, 100)

  return tl
}
