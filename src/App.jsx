import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createStage } from './three/stage'
import { buildTimeline, world, motion } from './lib/timeline'
import Awakening from './scenes/Awakening'
import Gallery from './scenes/Gallery'
import Story from './scenes/Story'
import Letter from './scenes/Letter'
import Finale from './scenes/Finale'
import Hud, { createHudUpdater } from './scenes/Hud'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const root = useRef(null)
  const canvas = useRef(null)

  useLayoutEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = matchMedia('(max-width: 767px)').matches
    const lowTier = reduced || small || (navigator.hardwareConcurrency || 8) <= 4

    let stage = null
    try {
      stage = createStage(canvas.current, { lowTier })
    } catch (err) {
      console.warn('[HerBloom] WebGL không khả dụng, dùng nền tĩnh.', err)
      root.current.classList.add('no-webgl')
    }

    const lenis = reduced ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
    motion.lenis = lenis
    lenis?.on('scroll', ScrollTrigger.update)

    const onUpdate = createHudUpdater(root.current)
    const mm = gsap.matchMedia()
    mm.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' }, (ctx) => {
      motion.tl = buildTimeline(root.current, { isMobile: ctx.conditions.mobile, reduced, onUpdate })
    })

    // Một vòng lặp duy nhất cho smooth scroll + WebGL
    const tick = (time) => {
      lenis?.raf(time * 1000)
      stage?.render(world, reduced ? time * 0.25 : time)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      mm.revert()
      lenis?.destroy()
      stage?.dispose()
      motion.lenis = motion.tl = null
    }
  }, [])

  return (
    <div ref={root} className="app" style={{ '--ink': '#FFF7F0' }}>
      <div id="track" className="h-[1300vh]" aria-hidden="true" />
      <main className="stage pointer-events-none fixed inset-0 h-lvh w-full overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
        <div className="flash" />
        <Awakening />
        <Gallery />
        <Story />
        <Letter />
        <Finale />
        <Hud />
      </main>
    </div>
  )
}
