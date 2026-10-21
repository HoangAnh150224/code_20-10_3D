import * as THREE from 'three'
import { makePetalGeometry, glowTexture, clamp01 } from './rose'

const COLORS = ['#771C32', '#9c2a47', '#c9506f', '#F4B8C7', '#f9d5de', '#D9B77A', '#FFF7F0'].map((c) => new THREE.Color(c))
const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Hàng trăm cánh hoa nhỏ: bung ra từ nụ (scene 1), trôi trong không gian (2–4),
// rồi bay xoắn ốc hội tụ thành đóa hồng khổng lồ (scene 5).
export function createPetalField({ count }) {
  const root = new THREE.Group()
  const geo = makePetalGeometry(1, 1.35, 1.6, 0.35)
  geo.scale(0.32, 0.32, 0.32)
  geo.translate(0, -0.216, 0) // xoay quanh tâm cánh khi trôi tự do

  const mat = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', roughness: 0.38, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.2,
    sheen: 1, sheenColor: new THREE.Color('#D9B77A'), sheenRoughness: 0.35,
    emissive: new THREE.Color('#D9B77A'), emissiveIntensity: 0, side: THREE.DoubleSide,
  })
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false
  root.add(mesh)

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture('rgba(255,240,215,1)', 'rgba(217,183,122,0.35)'),
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0,
  }))
  glow.position.z = -0.8
  root.add(glow)

  const home = new Float32Array(count * 3)
  const seed = new Float32Array(count)
  const delay = new Float32Array(count)
  const axis = []
  const tPos = new Float32Array(count * 3)
  const tPolar = new Float32Array(count * 2)
  const tScale = new Float32Array(count)
  const tQuat = []
  const tRadial = []

  const m4 = new THREE.Matrix4()
  const Z = new THREE.Vector3(0, 0, 1)
  for (let i = 0; i < count; i++) {
    let x = (Math.random() * 2 - 1) * 6.5
    const y = (Math.random() * 2 - 1) * 3.8
    if (Math.abs(x) < 1.2 && Math.abs(y) < 0.9) x += Math.sign(x || 1) * 1.6
    home.set([x, y, -16 + Math.random() * 13], i * 3)
    seed[i] = Math.random()
    delay[i] = Math.random()
    axis.push(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize())

    // Mục tiêu trên đóa hồng lớn: phân bố phyllotaxis, cánh trong dựng đứng, cánh ngoài xòe rộng
    const u = i / count
    const r = 0.1 + 2.3 * Math.pow(u, 0.62)
    const a = i * GOLDEN
    const el = (1 - u) * 1.25 + 0.15
    const radial = new THREE.Vector3(Math.cos(a), Math.sin(a), 0)
    const yv = radial.clone().multiplyScalar(Math.cos(el)).addScaledVector(Z, Math.sin(el))
    const xv = new THREE.Vector3().crossVectors(Z, radial).normalize()
    const zv = new THREE.Vector3().crossVectors(xv, yv)
    m4.makeBasis(xv, yv, zv)
    tQuat.push(new THREE.Quaternion().setFromRotationMatrix(m4))
    const s = 0.55 + 1.25 * u
    const pos = radial.clone().multiplyScalar(r).add(new THREE.Vector3(0, 0, -0.7 * u)).addScaledVector(yv, 0.216 * s)
    tPos.set([pos.x, pos.y, pos.z], i * 3)
    tPolar.set([Math.hypot(pos.x, pos.y), Math.atan2(pos.y, pos.x)], i * 2)
    tScale[i] = s
    tRadial.push(radial)

    const c = Math.random() < 0.08 ? COLORS[5] : COLORS[Math.min(6, Math.floor(u * 5.2 + Math.random() * 1.2))]
    mesh.setColorAt(i, c)
  }
  mesh.instanceColor.needsUpdate = true

  const P = new THREE.Vector3()
  const S = new THREE.Vector3()
  const Q = new THREE.Quaternion()
  const QF = new THREE.Quaternion()

  function update(world, time) {
    const { burst, converge, pulse } = world
    for (let i = 0; i < count; i++) {
      const sd = seed[i]
      const eb = clamp01((burst - delay[i] * 0.5) / 0.5)
      if (eb <= 0) {
        mesh.setMatrixAt(i, m4.makeScale(0, 0, 0))
        continue
      }
      const ee = 1 - Math.pow(1 - eb, 3)
      const hx = home[i * 3] + Math.sin(time * 0.25 + sd * 6) * 0.3
      const hy = home[i * 3 + 1] + Math.cos(time * 0.21 + sd * 5) * 0.25
      const hz = home[i * 3 + 2] + Math.sin(time * 0.17 + sd * 4) * 0.2
      P.set(hx * ee, hy * ee + Math.sin(ee * Math.PI) * 1.2 * (sd - 0.5), hz * ee)
      QF.setFromAxisAngle(axis[i], sd * 20 + time * (0.3 + sd * 0.6) + ee * 4)
      let sc = (0.7 + sd * 0.6) * Math.min(1, eb * 3)

      const e = easeInOut(clamp01((converge - delay[i] * 0.35) / 0.65))
      if (e > 0) {
        const rh = Math.hypot(P.x, P.y)
        const ah = Math.atan2(P.y, P.x)
        const ang = ah + (tPolar[i * 2 + 1] + Math.PI * 4 - ah) * e // xoắn ốc ~2 vòng
        const rr = rh + (tPolar[i * 2] - rh) * e
        const zz = P.z + (tPos[i * 3 + 2] - P.z) * e
        P.set(Math.cos(ang) * rr, Math.sin(ang) * rr, zz)
        const breathe = Math.sin(time * 0.8 + sd * 6) * 0.025 * e
        P.addScaledVector(tRadial[i], breathe + pulse * (0.6 + sd * 1.6))
        P.z += pulse * sd * 1.5
        QF.slerp(tQuat[i], e)
        sc += (tScale[i] - sc) * e
      }
      S.setScalar(sc * world.fieldScale)
      mesh.setMatrixAt(i, m4.compose(P, Q.copy(QF), S))
    }
    mesh.instanceMatrix.needsUpdate = true
    root.position.z = -world.roseBack * 1.5
    mat.emissiveIntensity = world.roseGlow * 0.55 + pulse * 0.5
    glow.material.opacity = converge * (0.12 + world.roseGlow * 0.55 + pulse * 0.4)
    glow.scale.setScalar(6.5 + world.roseGlow * 3 + pulse * 2)
  }

  return { root, update }
}
