import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createSilk } from './silk'
import { createRose } from './rose'
import { createPetalField } from './petalField'
import { createParticles } from './particles'

// Một canvas WebGL duy nhất xuyên suốt 5 scene — mọi thứ đọc trạng thái từ `world`.
export function createStage(canvas, { lowTier }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowTier, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowTier ? 1.25 : 1.75))
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x170e1b, 7, 26)
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 80)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = env
  scene.environmentIntensity = 0.9

  const key = new THREE.DirectionalLight('#ffe0c2', 2.4)
  key.position.set(3, 4, 6)
  const rim = new THREE.DirectionalLight('#f4b8c7', 3)
  rim.position.set(-4, 2, -5)
  scene.add(key, rim, new THREE.HemisphereLight('#fff7f0', '#3a0f1f', 0.5))

  const silk = createSilk()
  const rose = createRose({ lowTier })
  const field = createPetalField({ count: lowTier ? 160 : 300 })
  const dust = createParticles({ count: lowTier ? 2600 : 7000 })
  scene.add(silk.mesh, rose.root, field.root, dust.points)

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  let aspect = 1
  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    aspect = w / h
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    silk.resize(aspect)
    dust.resize(aspect, renderer.getPixelRatio())
  }
  resize()
  window.addEventListener('resize', resize)

  const tan = Math.tan(THREE.MathUtils.degToRad(20))
  function render(world, time) {
    pointer.sx += (pointer.x - pointer.sx) * 0.04
    pointer.sy += (pointer.y - pointer.sy) * 0.04
    // Màn hình dọc: lùi camera thêm ở vĩ thanh để đóa hồng lớn vừa khung
    const fit = Math.max(0, 2.7 / (tan * Math.min(aspect, 1.2)) - 9)
    const z = world.camZ + fit * world.finale
    scene.fog.near = 7 + fit * world.finale
    scene.fog.far = 26 + fit * world.finale
    camera.position.set(pointer.sx * 0.3, pointer.sy * 0.2, z)
    camera.lookAt(pointer.sx * 0.08, pointer.sy * 0.05, z - 10)

    silk.update(world, time)
    scene.fog.color.copy(silk.fogColor)
    rose.update(world, time)
    field.update(world, time)
    dust.update(world, time, z)
    renderer.render(scene, camera)
  }

  function dispose() {
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('resize', resize)
    scene.traverse((o) => {
      o.geometry?.dispose()
      if (o.material) [].concat(o.material).forEach((m) => { m.map?.dispose(); m.dispose() })
    })
    env.dispose()
    pmrem.dispose()
    renderer.dispose()
  }

  return { render, dispose }
}
