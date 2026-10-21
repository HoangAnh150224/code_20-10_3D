import * as THREE from 'three'

// Hạt ánh sáng morph giữa 3 trạng thái trên GPU:
// bụi sáng (scatter) → những đường sáng vàng (lines) → đóa hoa rực rỡ (flower).
const vertexShader = /* glsl */ `
  attribute vec3 aFlower;
  attribute vec4 aSeed;
  uniform float uTime, uM1, uM2, uDisperse, uOpacity, uSize, uPR, uSpread;
  uniform vec3 uColA, uColB;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float t = uTime;
    vec3 s = position + vec3(sin(t * 0.2 + aSeed.x * 6.28), cos(t * 0.17 + aSeed.y * 6.28), sin(t * 0.13 + aSeed.w * 6.28)) * 0.25;

    float idx = floor(aSeed.z * 7.0);
    float u = fract(aSeed.x + t * 0.04 * (0.6 + aSeed.y * 0.8));
    float x = (u * 2.0 - 1.0) * uSpread * 1.25;
    float y = (idx / 6.0 - 0.5) * 1.45 + sin(x * 0.9 + idx * 0.8 + t * 0.6) * 0.45 + sin(x * 2.3 - t * 0.4 + idx) * 0.12;
    vec3 l = vec3(x, y + (aSeed.y - 0.5) * 0.06, (aSeed.w - 0.5) * 0.15);

    float ca = cos(t * 0.15), sa = sin(t * 0.15);
    vec3 f = vec3(aFlower.x * ca - aFlower.y * sa, aFlower.x * sa + aFlower.y * ca, aFlower.z);
    f *= 1.0 + sin(t * 1.5 + aSeed.x * 6.28) * 0.02;

    vec3 pos = mix(mix(s, l, uM1), f, uM2);
    pos += normalize(pos + 0.001) * uDisperse * (1.5 + aSeed.y * 3.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.4 + aSeed.w * 1.1) * (1.0 + uM1 * 0.3) * uPR / -mv.z;
    vAlpha = uOpacity * (0.65 + 0.35 * sin(t * 2.0 + aSeed.x * 40.0)) * (1.0 - uDisperse * 0.8);
    vColor = mix(uColA, uColB, step(0.62, aSeed.y));
  }
`

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
    #include <colorspace_fragment>
  }
`

function flowerPoint() {
  if (Math.random() < 0.08) {
    const r = 0.18 * Math.cbrt(Math.random())
    const th = Math.random() * Math.PI * 2
    return [Math.cos(th) * r, Math.sin(th) * r, (Math.random() - 0.5) * 0.2 + 0.2]
  }
  const layer = Math.random() < 0.55 ? 0 : 1
  const k = layer === 0 ? 6 : 5
  const R = layer === 0 ? 1.65 : 1.05
  const rot = layer === 0 ? 0 : Math.PI / 5
  const th = Math.random() * Math.PI * 2
  const env = R * Math.pow(Math.abs(Math.cos((k * th) / 2)), 0.6)
  const rr = Math.random() < 0.55 ? env * (0.92 + Math.random() * 0.08) : env * Math.sqrt(Math.random())
  return [rr * Math.cos(th + rot), rr * Math.sin(th + rot), -rr * rr * 0.18 + layer * 0.25 + (Math.random() - 0.5) * 0.05]
}

export function createParticles({ count }) {
  const scatter = new Float32Array(count * 3)
  const flower = new Float32Array(count * 3)
  const seed = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    scatter.set([(Math.random() * 2 - 1) * 7, (Math.random() * 2 - 1) * 4, -5 + Math.random() * 7], i * 3)
    flower.set(flowerPoint(), i * 3)
    seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(scatter, 3))
  geo.setAttribute('aFlower', new THREE.BufferAttribute(flower, 3))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))

  const uniforms = {
    uTime: { value: 0 }, uM1: { value: 0 }, uM2: { value: 0 }, uDisperse: { value: 0 }, uOpacity: { value: 0.35 },
    uSize: { value: 22 }, uPR: { value: 1 }, uSpread: { value: 4 },
    uColA: { value: new THREE.Color('#e9c88c') }, uColB: { value: new THREE.Color('#F4B8C7') },
  }
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false

  function resize(aspect, pr) {
    const s = Math.min(1, aspect / 1.1) // màn hình dọc: thu nhỏ đóa hoa cho vừa khung
    points.scale.setScalar(s)
    uniforms.uSpread.value = (6 * Math.tan(THREE.MathUtils.degToRad(20)) * aspect) / s
    uniforms.uPR.value = pr
  }

  function update(world, time, camZ) {
    points.visible = world.pOpacity > 0.001
    points.position.z = camZ - 6
    uniforms.uTime.value = time
    uniforms.uM1.value = world.m1
    uniforms.uM2.value = world.m2
    uniforms.uDisperse.value = world.disperse
    uniforms.uOpacity.value = world.pOpacity
  }

  return { points, resize, update }
}
