import * as THREE from 'three'

// Nền lụa full-screen + hai lớp hoa hình học 5 cánh / 6 cánh xoay ngược chiều.
// Bảng màu chuyển liên tục theo world.palette (0..4) — mỗi scene một tông.
const PALETTES = [
  ['#2a0812', '#771C32', '#F4B8C7'], // 01 rượu vang
  ['#12091a', '#4a1530', '#c46a86'], // 02 mận chín
  ['#0b060f', '#26102c', '#9a4a6a'], // 03 đêm tím
  ['#efdcd0', '#FFF7F0', '#F4B8C7'], // 04 trắng kem
  ['#0f0813', '#4b1228', '#c46a86'], // 05 vĩ thanh
].map((p) => p.map((c) => new THREE.Color(c)))

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime, uAspect, uSplit, uRosette, uRot, uGlow, uVig;
  uniform vec3 uA, uB, uC, uGold;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float roseLine(float r, float a, float k, float R, float amp, float w) {
    float target = R * (1.0 - amp + amp * abs(cos(a * k * 0.5)));
    float d = abs(r - target);
    return smoothstep(w, 0.0, d) + exp(-d * 70.0) * 0.22;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float t = uTime * 0.12;
    float r = length(p);
    float a = atan(p.y, p.x);

    // Lụa: domain warp nhiều lớp tạo nếp gấp mềm
    vec2 q = p;
    q += normalize(p + 1e-4) * uSplit * 0.12 * sin(a * 6.0 + t * 2.0);
    q += 0.18 * vec2(sin(q.y * 2.6 + t * 1.3), sin(q.x * 2.2 - t * 1.1));
    q += 0.07 * vec2(sin(q.y * 5.7 - t * 0.9 + 1.7), sin(q.x * 4.9 + t * 1.6));
    float w = q.x * 1.3 + q.y * 0.8;
    float phase = w * 4.2 + sin(q.y * 1.8 + t) * 1.6;
    float fold = 0.5 + 0.5 * sin(phase);
    float spec = pow(0.5 + 0.5 * sin(phase + 0.9), 6.0);
    vec3 col = mix(uA, uB, smoothstep(0.0, 1.0, fold));
    col += uC * spec * 0.28;

    // Lụa tách thành các dải theo hướng cánh hoa
    float band = 0.5 + 0.5 * sin(a * 6.0 + r * 3.0 - t * 1.5 + fold * 0.8);
    float gap = smoothstep(0.55, 0.95, band) * uSplit * smoothstep(0.05, 0.35, r);
    col = mix(col, uA * 0.5, gap * 0.85);
    col += uC * smoothstep(0.5, 0.55, band) * (1.0 - smoothstep(0.55, 0.62, band)) * uSplit * 0.22;

    // Hoa hình học: 5 cánh xuôi chiều, 6 cánh ngược chiều
    float l = 0.0;
    l += roseLine(r, a + uRot, 5.0, 0.42, 0.35, 0.0035);
    l += roseLine(r, a + uRot + 0.628, 5.0, 0.30, 0.45, 0.003) * 0.7;
    l += roseLine(r, a - uRot * 1.2, 6.0, 0.48, 0.25, 0.003);
    l += roseLine(r, a - uRot * 1.2 + 0.5236, 6.0, 0.36, 0.4, 0.0025) * 0.7;
    l += smoothstep(0.003, 0.0, abs(r - 0.5)) * 0.4;
    col += uGold * l * uRosette * 0.55;

    col += uC * exp(-r * r * 6.0) * (0.06 + uGlow);
    col *= mix(1.0, smoothstep(1.25, 0.15, r), uVig);
    col += (hash(vUv * 1000.0 + fract(uTime)) - 0.5) * 0.022;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

export function createSilk() {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3))
  const uniforms = {
    uTime: { value: 0 }, uAspect: { value: 1 }, uSplit: { value: 0 }, uRosette: { value: 1 },
    uRot: { value: 0 }, uGlow: { value: 0 }, uVig: { value: 0.6 },
    uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uC: { value: new THREE.Color() },
    uGold: { value: new THREE.Color('#D9B77A') },
  }
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, depthTest: false, depthWrite: false, toneMapped: false })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  mesh.renderOrder = -10
  const fogColor = new THREE.Color()

  function update(world, time) {
    const p = Math.min(4, Math.max(0, world.palette))
    const i = Math.min(3, Math.floor(p))
    const f = p - i
    uniforms.uA.value.lerpColors(PALETTES[i][0], PALETTES[i + 1][0], f)
    uniforms.uB.value.lerpColors(PALETTES[i][1], PALETTES[i + 1][1], f)
    uniforms.uC.value.lerpColors(PALETTES[i][2], PALETTES[i + 1][2], f)
    fogColor.lerpColors(uniforms.uA.value, uniforms.uB.value, 0.55)
    uniforms.uVig.value = 0.6 - Math.max(0, 1 - Math.abs(p - 3)) * 0.45
    uniforms.uTime.value = time
    uniforms.uSplit.value = world.split
    uniforms.uRosette.value = world.rosette
    uniforms.uRot.value = world.rot + time * 0.05
    uniforms.uGlow.value = world.glow
  }

  return { mesh, fogColor, update, resize: (aspect) => (uniforms.uAspect.value = aspect) }
}
