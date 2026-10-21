import * as THREE from 'three'

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const smooth = (t) => t * t * (3 - 2 * t)

// Cánh hoa: mặt phẳng uốn cong, gốc tại (0,0), mọc theo +y, lòng cánh hướng về -z.
export function makePetalGeometry(width = 1, length = 1.35, cup = 1.4, curl = 0.3) {
  const g = new THREE.PlaneGeometry(1, 1, 12, 16)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) + 0.5
    const v = p.getY(i) + 0.5
    const profile = Math.pow(Math.sin(Math.PI * (0.1 + 0.82 * v)), 0.7)
    const x = (u - 0.5) * width * profile
    p.setXYZ(i, x, v * length, -x * x * cup + Math.pow(v, 3) * curl)
  }
  g.computeVertexNormals()
  return g
}

export function glowTexture(inner = 'rgba(255,236,210,1)', mid = 'rgba(244,184,199,0.4)') {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const gr = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, inner)
  gr.addColorStop(0.3, mid)
  gr.addColorStop(1, 'rgba(119,28,50,0)')
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// closed/open: góc nghiêng cánh khi nụ khép / khi nở. Lớp ngoài nở trước.
const LAYERS = [
  { n: 3, s: 0.38, r: 0.02, closed: -0.2, open: 0.18, gold: true },
  { n: 5, s: 0.52, r: 0.05, closed: -0.1, open: 0.5 },
  { n: 5, s: 0.68, r: 0.08, closed: 0.0, open: 0.85 },
  { n: 7, s: 0.84, r: 0.11, closed: 0.08, open: 1.12, fly: true },
  { n: 8, s: 1.0, r: 0.14, closed: 0.16, open: 1.38, fly: true },
]

export function createRose({ lowTier }) {
  const root = new THREE.Group()
  const group = new THREE.Group()
  root.add(group)

  const geo = makePetalGeometry()
  const glass = lowTier
    ? new THREE.MeshStandardMaterial({
        color: '#f4b8c7', roughness: 0.22, metalness: 0.25, side: THREE.DoubleSide,
        transparent: true, opacity: 0.9, emissive: '#771C32', emissiveIntensity: 0.3,
      })
    : new THREE.MeshPhysicalMaterial({
        color: '#f7c6d2', roughness: 0.08, metalness: 0, transmission: 0.9, thickness: 0.45, ior: 1.5,
        attenuationColor: new THREE.Color('#b0304f'), attenuationDistance: 0.55,
        iridescence: 0.75, iridescenceIOR: 1.35,
        sheen: 1, sheenColor: new THREE.Color('#D9B77A'), sheenRoughness: 0.25,
        clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.DoubleSide, envMapIntensity: 1.4,
      })
  const gold = new THREE.MeshStandardMaterial({ color: '#D9B77A', metalness: 1, roughness: 0.22, side: THREE.DoubleSide, envMapIntensity: 1.6 })

  const petals = []
  LAYERS.forEach((L, li) => {
    for (let j = 0; j < L.n; j++) {
      const pivot = new THREE.Group()
      pivot.rotation.y = (j / L.n) * Math.PI * 2 + li * 0.7
      const hinge = new THREE.Group()
      hinge.position.z = L.r
      const mesh = new THREE.Mesh(geo, L.gold ? gold : glass)
      mesh.scale.setScalar(L.s)
      hinge.add(mesh)
      pivot.add(hinge)
      group.add(pivot)
      petals.push({ hinge, L, seed: Math.random(), delay: (LAYERS.length - 1 - li) * 0.1 })
    }
  })

  // Đài hoa + cuống ánh kim
  for (let j = 0; j < 5; j++) {
    const pivot = new THREE.Group()
    pivot.rotation.y = (j / 5) * Math.PI * 2 + 0.3
    const m = new THREE.Mesh(geo, gold)
    m.position.z = 0.06
    m.rotation.x = 2.15
    m.scale.set(0.35, 0.6, 0.6)
    pivot.add(m)
    group.add(pivot)
  }
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.03, 2.6, 10), gold)
  stem.position.y = -1.3
  group.add(stem)

  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
  sprite.position.z = -0.4
  root.add(sprite)

  function update(world, time) {
    root.visible = world.roseVis > 0.5
    if (!root.visible) return
    const eb = smooth(clamp01(world.bloom))
    group.rotation.x = 0.5 + eb * 0.75 // trục hoa nghiêng dần về phía camera
    group.rotation.y = time * 0.12 + world.bloom * 1.6
    group.position.y = -0.3 + eb * 0.25

    for (const p of petals) {
      const e = smooth(clamp01((world.bloom - p.delay) / 0.6))
      const breath = Math.sin(time * 1.1 + p.seed * 6.28) * 0.02
      p.hinge.rotation.x = p.L.closed + (p.L.open - p.L.closed) * e + breath
      if (p.L.fly) {
        const f = clamp01((world.burst - p.seed * 0.45) / 0.55)
        const ff = f * f
        p.hinge.position.set(0, ff * (1 + p.seed * 2), p.L.r + ff * (4 + p.seed * 4))
        p.hinge.rotation.z = ff * (p.seed - 0.5) * 6
        p.hinge.rotation.y = ff * 3 * p.seed
      }
    }
    sprite.material.opacity = Math.min(1, 0.3 + eb * 0.35 + world.glow)
    sprite.scale.setScalar(2.2 + eb * 2.6)
  }

  return { root, update }
}
