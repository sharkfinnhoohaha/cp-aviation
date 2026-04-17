import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import * as THREE from 'three'
import Navigation from '../components/Navigation'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const D2R = Math.PI / 180
const R2D = 180 / Math.PI
const KTS = 0.514444       // 1 knot  → m/s
const FT  = 0.3048         // 1 foot  → m

// C172S airframe
const S_WING = 16.17       // wing area m²
const B_WING = 11.0        // span m
const AR     = 7.32        // aspect ratio
const E_OSW  = 0.80        // Oswald efficiency
const K_IND  = 1 / (Math.PI * AR * E_OSW)   // ≈ 0.0545

// Mass
const MASS   = 1066.0      // kg (~2350 lbs typical loading)
const WEIGHT = MASS * 9.81 // N ≈ 10,457 N

// Speed limits (m/s)
const VR  = 55  * KTS      // rotation
const VY  = 74  * KTS      // best rate climb
const VS  = 48  * KTS      // stall clean
const VSO = 40  * KTS      // stall flaps
const VFE = 85  * KTS      // max flap extension
const VNE = 163 * KTS      // never exceed

// Aerodynamic drag coefficients indexed by flap setting [0°,10°,20°,30°]
const CD0_FLAP = [0.027, 0.040, 0.060, 0.090]
const CD_GEAR  = 0.015
const CL_MAX   = [1.45,  1.65,  1.85,  2.00]

// Ground friction
const MU_ROLL  = 0.02
const MU_BRAKE = 0.40

// Airport / Runway – KCMA
const ELEV_FT   = 77
const ELEV_M    = ELEV_FT * FT          // ≈ 23.47 m MSL
const RWY_LEN   = 1833                  // m (6013 ft)
const RWY_WID   = 45.72                 // m (150 ft)
const RWY_HDG   = 260                   // degrees magnetic
const RWY_HDG_R = RWY_HDG * D2R

// World coordinates: +X = East, +Y = Up, +Z = South
// Heading→direction: (sin H, 0, −cos H)
function hdgDir(deg: number): THREE.Vector3 {
  const r = deg * D2R
  return new THREE.Vector3(Math.sin(r), 0, -Math.cos(r))
}
const RWY_DIR    = hdgDir(RWY_HDG)
const RWY_CENTER = RWY_DIR.clone().multiplyScalar(RWY_LEN / 2)

// ISA atmosphere: air density at altitude MSL (m)
function airDensity(altMSL: number): number {
  const T = 288.15 - 0.0065 * altMSL
  const P = 101325 * Math.pow(T / 288.15, 9.81 / (287.05 * 0.0065))
  return P / (287.05 * T)
}

// Thrust model: empirical fixed-pitch propeller IO-360
// Static thrust ~2 446 N, decays exponentially with speed
// Verified: gives ≈720 FPM at Vy (74 kts), takeoff roll ≈16 s
function thrustN(throttle: number, v: number): number {
  return throttle * 2446 * Math.exp(-v / 200)
}

function engineRPM(throttle: number, v: number): number {
  return Math.min(2700, 700 + throttle * (2000 + v * 1.5))
}

// ─────────────────────────────────────────────────────────────────────────────
// SIMULATION STATE
// ─────────────────────────────────────────────────────────────────────────────
interface SimState {
  pos:          THREE.Vector3   // m; y = AGL above runway surface
  vel:          THREE.Vector3   // m/s world frame
  heading:      number          // deg, 0=N clockwise
  pitch:        number          // deg, +ve = nose up
  roll:         number          // deg, +ve = right bank
  throttle:     number          // 0–1
  flapIdx:      number          // 0=0°, 1=10°, 2=20°, 3=30°
  elevator:     number          // −1 to 1
  aileron:      number          // −1 to 1
  rudder:       number          // −1 to 1
  onGround:     boolean
  parkingBrake: boolean
  paused:       boolean
  stallBuffet:  number          // 0–1
  time:         number          // seconds
}

function initialState(): SimState {
  return {
    pos:          new THREE.Vector3(0, 0, 0),
    vel:          new THREE.Vector3(0, 0, 0),
    heading:      RWY_HDG,
    pitch:        0,
    roll:         0,
    throttle:     0.05,
    flapIdx:      0,
    elevator:     0,
    aileron:      0,
    rudder:       0,
    onGround:     true,
    parkingBrake: true,
    paused:       false,
    stallBuffet:  0,
    time:         0,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHYSICS ENGINE
// ─────────────────────────────────────────────────────────────────────────────
// Light NW morning wind (320° @ 8 kts) — crosswind component on RWY26 ≈7 kt
const WIND = new THREE.Vector3(1.2, 0, 1.8) // m/s toward SE

function updatePhysics(s: SimState, dt: number): SimState {
  if (s.paused || dt <= 0 || dt > 0.1) return s

  const ns: SimState = { ...s, pos: s.pos.clone(), vel: s.vel.clone() }

  // Airspeed = velocity relative to air mass
  const airVel = ns.vel.clone().sub(WIND)
  const speed  = airVel.length()
  const vH     = Math.sqrt(airVel.x ** 2 + airVel.z ** 2) // horizontal airspeed

  const altMSL = ns.pos.y + ELEV_M
  const rho    = airDensity(altMSL)
  const q      = 0.5 * rho * speed * speed

  const cd0  = CD0_FLAP[ns.flapIdx] + CD_GEAR
  const clMax = CL_MAX[ns.flapIdx]

  // Flight-path angle (γ) and angle of attack (α)
  const gamma = vH > 0.5 ? Math.atan2(airVel.y, vH) * R2D : 0
  const aoa   = ns.pitch - gamma
  let CL = 0.25 + 5.73 * (aoa * D2R)     // CL_α ≈ 0.1/deg in radian form
  CL = Math.max(-0.5, Math.min(clMax, CL))

  // Stall check
  const vsStall   = ns.flapIdx === 0 ? VS : VSO + (VS - VSO) * (1 - ns.flapIdx / 3)
  const stallMgn  = speed > 0.5 ? (speed - vsStall) / vsStall : 1.0
  ns.stallBuffet  = stallMgn < 0.08 ? Math.max(0, 1 - stallMgn / 0.08) : 0
  if (stallMgn < 0) CL = Math.max(0.05, CL * (1 + stallMgn * 6))

  const CD   = cd0 + K_IND * CL * CL
  const liftF = q * S_WING * CL
  const dragF = Math.max(0, q * S_WING * CD)
  const thrF  = thrustN(ns.throttle, speed)

  const hdgR   = ns.heading * D2R
  const pitchR = ns.pitch * D2R
  const rollR  = ns.roll * D2R

  if (ns.onGround) {
    // ── GROUND ROLL ─────────────────────────────────────────────────────────
    const hSpd  = Math.sqrt(ns.vel.x ** 2 + ns.vel.z ** 2)
    const fricF = ns.parkingBrake ? MU_BRAKE * WEIGHT
                : hSpd > 0.05 ? MU_ROLL * WEIGHT : 0
    const aeroD = q * S_WING * (cd0 + 0.02)
    let spd = hSpd + ((thrF - aeroD - fricF) / MASS) * dt
    spd = Math.max(0, spd)

    // Rotation check — ground effect boosts lift by ~20% within one wingspan
    const gef    = 1 + 0.5 * Math.exp(-ns.pos.y / (B_WING * 0.3))
    const liftGE = 0.5 * rho * spd * spd * S_WING * clMax * gef
    if (spd >= VR && ns.elevator > 0.25 && !ns.parkingBrake) {
      ns.onGround = false
      ns.vel.y    = 0.5
    } else if (spd < VR) {
      ns.pitch = ns.elevator * 4   // slight nose-up during roll
    }

    // Rudder steering on ground
    const steerRate = ns.rudder * 4.5 * (spd / Math.max(spd, VY * 0.3))
    ns.heading = ((ns.heading + steerRate * dt) + 360) % 360

    ns.vel.x = spd * Math.sin(ns.heading * D2R)
    ns.vel.z = spd * (-Math.cos(ns.heading * D2R))
    ns.vel.y = 0
    ns.roll  = 0

  } else {
    // ── FLIGHT DYNAMICS ─────────────────────────────────────────────────────
    const qFactor = Math.max(0.2, Math.min(2.5, q / (0.5 * 1.225 * VY * VY)))

    // Pitch: elevator drives pitch rate; aircraft has natural pitch stability
    const pitchRate = ns.elevator * 10 * qFactor
    ns.pitch += pitchRate * dt
    ns.pitch -= (ns.pitch - ns.elevator * 8) * 0.6 * dt   // longitudinal stability
    ns.pitch  = Math.max(-20, Math.min(25, ns.pitch))

    // Auto stall recovery
    if (stallMgn < 0 && ns.pitch > 0) ns.pitch -= 22 * dt

    // Roll: ailerons drive roll rate; natural roll damping
    const rollRate = ns.aileron * 50 * qFactor
    ns.roll += rollRate * dt
    ns.roll -= ns.roll * 1.0 * dt          // damping
    ns.roll  = Math.max(-60, Math.min(60, ns.roll))

    // Heading: coordinated turn from bank + direct rudder yaw
    if (speed > vsStall * 0.7) {
      const turnRate = (9.81 / Math.max(speed, 10)) * Math.tan(rollR) * R2D
      const yawRate  = ns.rudder * 5 * qFactor + turnRate
      ns.heading = ((ns.heading + yawRate * dt) + 360) % 360
    }

    // Force decomposition (wind-axes approximation)
    const liftVert = liftF * Math.cos(rollR) * Math.cos(pitchR)
    const thrHoriz = thrF * Math.cos(pitchR)
    const thrVert  = thrF * Math.sin(pitchR)

    // Drag opposes airspeed vector
    const dX = speed > 0.1 ? -dragF * (airVel.x / speed) : 0
    const dY = speed > 0.1 ? -dragF * (airVel.y / speed) : 0
    const dZ = speed > 0.1 ? -dragF * (airVel.z / speed) : 0

    ns.vel.x += ((thrHoriz * Math.sin(hdgR))           + dX) / MASS * dt
    ns.vel.y += ((liftVert + thrVert - WEIGHT)          + dY) / MASS * dt
    ns.vel.z += ((thrHoriz * (-Math.cos(hdgR)))         + dZ) / MASS * dt

    // Speed clamp (structural limit)
    const spd2 = ns.vel.length()
    if (spd2 > VNE * 1.1) ns.vel.multiplyScalar(VNE * 1.1 / spd2)

    // Ground contact
    if (ns.pos.y <= 0) {
      ns.pos.y    = 0
      ns.vel.y    = Math.max(0, ns.vel.y)
      ns.onGround = ns.vel.y < 0.1
      if (ns.onGround) { ns.roll = 0; ns.pitch = 0 }
    }
  }

  // Integrate position
  ns.pos.x += ns.vel.x * dt
  ns.pos.y += ns.vel.y * dt
  ns.pos.z += ns.vel.z * dt
  if (ns.pos.y < 0) ns.pos.y = 0
  ns.time += dt
  return ns
}

// ─────────────────────────────────────────────────────────────────────────────
// TERRAIN NOISE
// ─────────────────────────────────────────────────────────────────────────────
function hash2(x: number, z: number): number {
  const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
  return n - Math.floor(n)
}
function smoothNoise(x: number, z: number): number {
  const ix = Math.floor(x), iz = Math.floor(z)
  const fx = x - ix, fz = z - iz
  const ux = fx * fx * (3 - 2 * fx), uz = fz * fz * (3 - 2 * fz)
  return (
    hash2(ix,   iz)   * (1-ux)*(1-uz) +
    hash2(ix+1, iz)   *    ux *(1-uz) +
    hash2(ix,   iz+1) * (1-ux)*   uz  +
    hash2(ix+1, iz+1) *    ux *   uz
  )
}
function fbm(x: number, z: number, oct: number): number {
  let v = 0, a = 1, f = 1, m = 0
  for (let i = 0; i < oct; i++) { v += smoothNoise(x*f, z*f)*a; m+=a; a*=0.5; f*=2 }
  return v / m
}

// ─────────────────────────────────────────────────────────────────────────────
// RUNWAY CANVAS TEXTURE
// ─────────────────────────────────────────────────────────────────────────────
function createRunwayTexture(): THREE.CanvasTexture {
  const W = 512, H = 4096
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d')!

  // Asphalt base
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, W, H)
  // Worn center band
  ctx.fillStyle = '#222222'; ctx.fillRect(W*0.35, 0, W*0.3, H)

  // ── 26 threshold end (top of canvas = UV v=1 = world 08 side … but we set
  //    flipY=false so canvas-top lands at the 26-threshold world position)
  const drawThreshold = (yTop: number, label0: string, label1: string) => {
    ctx.fillStyle = '#FFFFFF'
    const sW=26, sH=80, gap=8, n=12
    const tot = n*sW+(n-1)*gap, sx=(W-tot)/2
    for (let i=0;i<n;i++) ctx.fillRect(sx+i*(sW+gap), yTop+10, sW, sH)
    ctx.font = 'bold 140px Arial'; ctx.textAlign = 'center'
    ctx.fillText(label0, W/2, yTop+sH+160)
    ctx.fillText(label1, W/2, yTop+sH+330)
  }

  // Runway 26 end (near top with flipY=false, aircraft starts here)
  drawThreshold(20, '2', '6')

  // Aiming-point markers
  ctx.fillStyle = '#FFFFFF'
  const ap = 750
  ctx.fillRect(40, ap, 110, 55); ctx.fillRect(W-150, ap, 110, 55)

  // TDZ bars
  for (let i=0;i<3;i++) {
    const ty = ap+130+i*75
    ctx.fillRect(40, ty, 110, 35); ctx.fillRect(W-150, ty, 110, 35)
  }

  // Centerline
  ctx.strokeStyle = '#DDDDDD'; ctx.lineWidth=5; ctx.setLineDash([80,65])
  ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke()
  ctx.setLineDash([])

  // Edge lines
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth=7
  ctx.beginPath()
  ctx.moveTo(20,0); ctx.lineTo(20,H)
  ctx.moveTo(W-20,0); ctx.lineTo(W-20,H)
  ctx.stroke()

  // Runway 08 end (near bottom of canvas = UV v=0 side = world 08 threshold)
  drawThreshold(H-20-80-330, '0', '8')
  const ap2 = H-750-55
  ctx.fillRect(40, ap2, 110, 55); ctx.fillRect(W-150, ap2, 110, 55)
  for (let i=0;i<3;i++) {
    const ty = ap2-130-i*75
    ctx.fillRect(40, ty, 110, 35); ctx.fillRect(W-150, ty, 110, 35)
  }

  const tex = new THREE.CanvasTexture(c)
  tex.flipY = false
  return tex
}

// ─────────────────────────────────────────────────────────────────────────────
// 3-D SCENE BUILDER  — returns the aircraft mesh group
// ─────────────────────────────────────────────────────────────────────────────
function buildScene(scene: THREE.Scene): THREE.Group {

  // ── Sky sphere (gradient shader) ─────────────────────────────────────────
  const skyGeo = new THREE.SphereGeometry(75000, 32, 16)
  skyGeo.scale(-1, 1, 1)
  scene.add(new THREE.Mesh(skyGeo, new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vPos;
      void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
    `,
    fragmentShader: `
      varying vec3 vPos;
      void main(){
        float t = clamp(normalize(vPos).y*1.3+0.15, 0.0, 1.0);
        vec3 haze = vec3(0.87,0.93,0.99);
        vec3 sky  = vec3(0.22,0.50,0.82);
        gl_FragColor = vec4(mix(haze,sky,t*t),1.0);
      }
    `,
    side: THREE.BackSide, depthWrite: false
  })))

  // ── Lighting ──────────────────────────────────────────────────────────────
  const sun = new THREE.DirectionalLight(0xFFF5E0, 1.4)
  sun.position.set(5000, 7000, -6000)   // morning sun low in NE sky
  scene.add(sun)
  scene.add(new THREE.AmbientLight(0x9BB5CF, 0.55))

  // ── Atmospheric fog ───────────────────────────────────────────────────────
  scene.fog = new THREE.FogExp2(0xC5DAEE, 0.0000135)

  // ── Oxnard plain (flat terrain, vertex-coloured agricultural fields) ──────
  const plGeo = new THREE.PlaneGeometry(65000, 65000, 220, 220)
  plGeo.rotateX(-Math.PI / 2)
  const plPos  = plGeo.attributes.position as THREE.BufferAttribute
  const plCol: number[] = []
  for (let i = 0; i < plPos.count; i++) {
    const wx = plPos.getX(i), wz = plPos.getZ(i)
    let h = fbm(wx*0.00018, wz*0.00018, 3) * 5
    if (wz < -2000) h += Math.pow(Math.max(0, (-wz-2000)/9000), 1.6) * 200  // N hills
    plPos.setY(i, h)
    const fn = fbm(wx*0.0009, wz*0.0009, 2)
    if      (fn > 0.62) plCol.push(0.26,0.40,0.18)
    else if (fn > 0.48) plCol.push(0.52,0.50,0.24)
    else if (fn > 0.34) plCol.push(0.38,0.52,0.20)
    else                plCol.push(0.48,0.44,0.26)
  }
  plGeo.setAttribute('color', new THREE.Float32BufferAttribute(plCol, 3))
  plGeo.computeVertexNormals()
  scene.add(new THREE.Mesh(plGeo, new THREE.MeshLambertMaterial({ vertexColors: true })))

  // ── Santa Monica Mountains (south: +Z) ────────────────────────────────────
  const mtGeo = new THREE.PlaneGeometry(40000, 22000, 180, 90)
  mtGeo.rotateX(-Math.PI / 2)
  const mtPos = mtGeo.attributes.position as THREE.BufferAttribute
  const mtCol: number[] = []
  for (let i = 0; i < mtPos.count; i++) {
    const wx = mtPos.getX(i), lz = mtPos.getZ(i)
    const wz = lz + 15000   // world Z: centered at z=15 000 (15 km south)
    let h = 0
    if (wz > 2800) {
      const d  = (wz - 2800) / 1200
      const env = Math.min(1, d / 5)
      const n  = fbm(wx * 0.0007, wz * 0.0007, 5)
      h = env * 850 * (0.45 + 0.55 * n)
      h += Math.exp(-((wx-2500)**2/5e6 + (wz-9500)**2/4e6)) * 550
      h += Math.exp(-((wx+3200)**2/6e6 + (wz-7200)**2/5e6)) * 480
    }
    h = Math.max(0, h)
    mtPos.setY(i, h)
    const hn = h / 900
    if      (hn < 0.08) mtCol.push(0.33,0.50,0.20)
    else if (hn < 0.30) mtCol.push(0.50,0.47,0.22)
    else if (hn < 0.65) mtCol.push(0.46,0.40,0.28)
    else                mtCol.push(0.40,0.35,0.30)
  }
  mtGeo.setAttribute('color', new THREE.Float32BufferAttribute(mtCol, 3))
  mtGeo.computeVertexNormals()
  const mtMesh = new THREE.Mesh(mtGeo, new THREE.MeshLambertMaterial({ vertexColors: true }))
  mtMesh.position.set(0, 0, 15000)
  scene.add(mtMesh)

  // ── Pacific Ocean (west: −X) ───────────────────────────────────────────────
  const ocnGeo = new THREE.PlaneGeometry(28000, 40000)
  ocnGeo.rotateX(-Math.PI / 2)
  const ocnMesh = new THREE.Mesh(ocnGeo, new THREE.MeshLambertMaterial({
    color: 0x1B5E8C, transparent: true, opacity: 0.90
  }))
  ocnMesh.position.set(-23000, -3, 0)
  scene.add(ocnMesh)

  // Subtle wave normal shimmer
  const shimGeo = new THREE.PlaneGeometry(26000, 38000, 80, 80)
  shimGeo.rotateX(-Math.PI / 2)
  const shimPos = shimGeo.attributes.position as THREE.BufferAttribute
  for (let i=0;i<shimPos.count;i++) {
    shimPos.setY(i, (Math.random()-0.5)*0.4 - 2.5)
  }
  shimGeo.computeVertexNormals()
  scene.add(new THREE.Mesh(shimGeo, new THREE.MeshLambertMaterial({
    color: 0x1A7AA8, transparent: true, opacity: 0.55, wireframe: false
  })))

  // ── Channel Islands (Anacapa ~37 km WSW, Santa Cruz ~55 km WSW) ───────────
  const islandMat = new THREE.MeshLambertMaterial({ color: 0x3A4A35 })
  const islands: [number,number,number,number][] = [
    [-36000,-7500, 5000,220],
    [-52000,-11000,9000,280],
    [-50000,-4500, 6500,200],
  ]
  for (const [ix,iz,iw,ih] of islands) {
    const im = new THREE.Mesh(new THREE.BoxGeometry(iw,ih,1600), islandMat)
    im.position.set(ix, ih/2-110, iz)
    scene.add(im)
  }

  // ── Runway 26/08 ──────────────────────────────────────────────────────────
  const rwyTex = createRunwayTexture()
  rwyTex.wrapS = rwyTex.wrapT = THREE.ClampToEdgeWrapping
  const rwyGeo = new THREE.PlaneGeometry(RWY_WID, RWY_LEN)
  rwyGeo.rotateX(-Math.PI / 2)
  const rwyMesh = new THREE.Mesh(rwyGeo, new THREE.MeshLambertMaterial({ map: rwyTex }))
  // Rotation so local +Z aligns with heading 260° direction:
  // sin(θ)=sin(260°)=-0.9848, cos(θ)=cos(260°)=-0.1736  ⟹  θ = -RWY_HDG_R
  rwyMesh.rotation.y = -RWY_HDG_R
  rwyMesh.position.set(RWY_CENTER.x, 0.02, RWY_CENTER.z)
  scene.add(rwyMesh)

  // ── Runway edge lights ────────────────────────────────────────────────────
  const litMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
  const litGeo = new THREE.SphereGeometry(0.28, 6, 4)
  // perpDir is perpendicular to runway heading (90° clockwise)
  const perpDir = new THREE.Vector3(Math.cos(RWY_HDG_R), 0, Math.sin(RWY_HDG_R))
  for (let i = 0; i <= 36; i++) {
    const t  = i / 36
    const along = RWY_DIR.clone().multiplyScalar(t * RWY_LEN)
    for (const side of [-1, 1]) {
      const lm = new THREE.Mesh(litGeo, litMat)
      lm.position.copy(along).addScaledVector(perpDir, side*(RWY_WID/2+2.5))
      lm.position.y = 0.4
      scene.add(lm)
    }
  }

  // ── PAPI lights (4 lights, left side of runway 26 approach) ───────────────
  const papiColors = [0xFF2200, 0xFF2200, 0xFFFFFF, 0xFFFFFF]
  const papiBase = RWY_DIR.clone().multiplyScalar(RWY_LEN * 0.04)
    .addScaledVector(perpDir, -(RWY_WID/2+18))
  for (let i=0;i<4;i++) {
    const pm = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 8, 4),
      new THREE.MeshBasicMaterial({ color: papiColors[i] })
    )
    pm.position.copy(papiBase)
    pm.position.x += i * 3.5 * perpDir.x
    pm.position.z += i * 3.5 * perpDir.z
    pm.position.y = 0.5
    scene.add(pm)
  }

  // ── Taxiway Alpha (parallel to runway, 130 m north) ───────────────────────
  const twyGeo = new THREE.PlaneGeometry(15, RWY_LEN * 0.85)
  twyGeo.rotateX(-Math.PI / 2)
  const twyMesh = new THREE.Mesh(twyGeo, new THREE.MeshLambertMaterial({ color: 0x252525 }))
  twyMesh.rotation.y = -RWY_HDG_R
  twyMesh.position.set(RWY_CENTER.x, 0.02, RWY_CENTER.z - 130)
  scene.add(twyMesh)

  // ── Ramp / Apron ──────────────────────────────────────────────────────────
  const rampMat = new THREE.MeshLambertMaterial({ color: 0x4A4A4A })
  const rampMesh = new THREE.Mesh(new THREE.PlaneGeometry(450, 220), rampMat)
  rampMesh.rotation.x = -Math.PI / 2
  rampMesh.position.set(RWY_CENTER.x + 20, 0.03, RWY_CENTER.z - 240)
  scene.add(rampMesh)

  // ── Hangars (north side, 8 metal buildings) ───────────────────────────────
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x6E7D88 })
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x566270 })
  const hangarXZ: [number,number][] = [
    [-740,-270],[-620,-270],[-500,-270],[-380,-270],
    [-740,-390],[-620,-390],[-500,-390],[-380,-390],
  ]
  for (const [hx,hz] of hangarXZ) {
    const walls = new THREE.Mesh(new THREE.BoxGeometry(100,10,65), wallMat)
    walls.position.set(hx, 5, hz)
    scene.add(walls)
    // Arched roof
    const arch = new THREE.Mesh(
      new THREE.CylinderGeometry(38,38,100,16,1,false,0,Math.PI),
      roofMat
    )
    arch.rotation.z = Math.PI/2
    arch.position.set(hx, 10, hz)
    scene.add(arch)
    // Hangar door frame
    const door = new THREE.Mesh(new THREE.BoxGeometry(60,9.5,0.5),
      new THREE.MeshLambertMaterial({ color: 0x4A5560 }))
    door.position.set(hx, 4.75, hz + 32.5)
    scene.add(door)
  }

  // ── FBO / Terminal building (south side) ──────────────────────────────────
  const fboWall = new THREE.MeshLambertMaterial({ color: 0xE8DCC8 })
  const fboRoof = new THREE.MeshLambertMaterial({ color: 0xC8A87A })
  const fbo     = new THREE.Mesh(new THREE.BoxGeometry(90,8,45), fboWall)
  fbo.position.set(RWY_CENTER.x+10, 4, RWY_CENTER.z+130)
  scene.add(fbo)
  const fboR = new THREE.Mesh(new THREE.BoxGeometry(94,2,49), fboRoof)
  fboR.position.set(RWY_CENTER.x+10, 9, RWY_CENTER.z+130)
  scene.add(fboR)

  // Control tower
  const towerMat = new THREE.MeshLambertMaterial({ color: 0xCFBFA8 })
  const tower = new THREE.Mesh(new THREE.BoxGeometry(7,22,7), towerMat)
  tower.position.set(RWY_CENTER.x+55, 11, RWY_CENTER.z+118)
  scene.add(tower)
  const cab = new THREE.Mesh(new THREE.BoxGeometry(11,5,11),
    new THREE.MeshLambertMaterial({ color: 0x5577AA, transparent:true, opacity:0.75 }))
  cab.position.set(RWY_CENTER.x+55, 24, RWY_CENTER.z+118)
  scene.add(cab)

  // Airport beacon (white/green rotating visual)
  const bcnGeo = new THREE.CylinderGeometry(0.3,0.3,6,8)
  scene.add(Object.assign(new THREE.Mesh(bcnGeo,
    new THREE.MeshLambertMaterial({color:0xFFFFFF})),
    { position: new THREE.Vector3(RWY_CENTER.x+55, 3, RWY_CENTER.z+118) }
  ))

  // ── US-101 Freeway (east–west, 1.6 km north) ─────────────────────────────
  const hwyGeo = new THREE.PlaneGeometry(9000,30); hwyGeo.rotateX(-Math.PI/2)
  scene.add(Object.assign(new THREE.Mesh(hwyGeo,
    new THREE.MeshLambertMaterial({color:0x2E2E2E})),
    { position: new THREE.Vector3(0, 0.06, -1620) }
  ))
  // Lane markings
  const lnMat = new THREE.MeshBasicMaterial({ color: 0xFFFF55 })
  for (let i=-44;i<=44;i++) {
    const lm = new THREE.Mesh(new THREE.PlaneGeometry(22,2), lnMat)
    lm.rotation.x = -Math.PI/2
    lm.position.set(i*100, 0.07, -1620)
    scene.add(lm)
  }

  // ── Windsock ──────────────────────────────────────────────────────────────
  const poleMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12,0.12,9,8),
    new THREE.MeshLambertMaterial({color:0xFFFFFF})
  )
  poleMesh.position.set(85, 4.5, 90)
  scene.add(poleMesh)
  const sockMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7,0.2,3.5,10),
    new THREE.MeshLambertMaterial({color:0xFF6600})
  )
  sockMesh.rotation.z = Math.PI/2
  sockMesh.position.set(88, 9.2, 90)
  scene.add(sockMesh)
  // Sock ring
  scene.add(Object.assign(
    new THREE.Mesh(new THREE.TorusGeometry(0.72,0.06,8,16),
      new THREE.MeshLambertMaterial({color:0xFFFFFF})),
    { position: new THREE.Vector3(85.5, 9.2, 90) }
  ))

  // ── Scattered trees (north side of airport, south hills fringe) ───────────
  const treeMat  = new THREE.MeshLambertMaterial({ color: 0x2E5020 })
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x4A3020 })
  const treePts: [number,number][] = [
    [-200,-500],[-300,-450],[-150,-520],[100,-480],[200,-510],
    [-800,-600],[-700,-580],[-900,-620],[300,-550],[400,-530],
    [-500,3200],[-600,3300],[-450,3400],[-700,3250],[500,3100],
  ]
  for (const [tx,tz] of treePts) {
    const h = 6+Math.random()*5
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.30,h*0.35,6), trunkMat)
    trunk.position.set(tx, h*0.175, tz)
    scene.add(trunk)
    const crown = new THREE.Mesh(new THREE.ConeGeometry(2.5+Math.random()*1.5,h*0.75,7), treeMat)
    crown.position.set(tx, h*0.35+h*0.375, tz)
    scene.add(crown)
  }

  // ── Clouds (billboard sprites ~900–1 200 m AGL) ───────────────────────────
  const cloudCanvas = document.createElement('canvas')
  cloudCanvas.width = cloudCanvas.height = 256
  const cCtx = cloudCanvas.getContext('2d')!
  const cGrad = cCtx.createRadialGradient(128,128,8,128,128,128)
  cGrad.addColorStop(0,   'rgba(255,255,255,0.92)')
  cGrad.addColorStop(0.38,'rgba(248,252,255,0.72)')
  cGrad.addColorStop(1,   'rgba(200,220,255,0.00)')
  cCtx.fillStyle = cGrad; cCtx.fillRect(0,0,256,256)
  const cloudTex = new THREE.CanvasTexture(cloudCanvas)

  const cloudPts: [number,number,number,number,number][] = [
    [-2800,  960,-1600,820,320], [ 1600,1050,-2400,980,350],
    [-1100,  920, 1200,750,280], [ 2200,1100, 2100,1050,380],
    [-4800,  980,  600,900,340], [ 3200,  870,-1200,700,250],
    [-2100,1040, 3100,850,310], [  600,  960,-3800,760,290],
    [-5500,1060, 2200,1100,400],[ 4600,1020,  400,820,300],
    [ 1000,  910, 4200,680,260],[-3400,  990,-2800,960,360],
  ]
  for (const [cx,cy,cz,sw,sh] of cloudPts) {
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({
      map: cloudTex, depthWrite: false, transparent: true
    }))
    spr.scale.set(sw, sh, 1)
    spr.position.set(cx, cy, cz)
    scene.add(spr)
  }

  // ── Cessna 172S aircraft mesh ─────────────────────────────────────────────
  const acGroup = new THREE.Group()
  const wMat  = new THREE.MeshLambertMaterial({ color: 0xF4F4F4 })
  const rMat  = new THREE.MeshLambertMaterial({ color: 0xCC2200 })
  const gMat  = new THREE.MeshLambertMaterial({ color: 0x252525 })
  const glMat = new THREE.MeshLambertMaterial({ color: 0x6688BB, transparent:true, opacity:0.55 })

  // Fuselage
  const fuseGeo = new THREE.BoxGeometry(0.92,1.12,7.6)
  acGroup.add(Object.assign(new THREE.Mesh(fuseGeo, wMat), {}))
  // Nose cone
  const noseMesh = new THREE.Mesh(new THREE.ConeGeometry(0.55,1.6,8), wMat)
  noseMesh.rotation.x = Math.PI/2; noseMesh.position.set(0,-0.06,-4.4)
  acGroup.add(noseMesh)
  // Windshield
  const wsMesh = new THREE.Mesh(new THREE.BoxGeometry(0.78,0.62,0.12), glMat)
  wsMesh.rotation.x = -0.45; wsMesh.position.set(0,0.6,-1.8)
  acGroup.add(wsMesh)
  // Wings
  const wingMesh = new THREE.Mesh(new THREE.BoxGeometry(11.0,0.18,1.85), wMat)
  wingMesh.position.set(0,0.08,-0.15); acGroup.add(wingMesh)
  // Red stripe on wings
  const stripeMesh = new THREE.Mesh(new THREE.BoxGeometry(10.9,0.19,0.30), rMat)
  stripeMesh.position.set(0,0.09,0.52); acGroup.add(stripeMesh)
  // Horizontal stabiliser
  const hStab = new THREE.Mesh(new THREE.BoxGeometry(3.65,0.12,0.88), wMat)
  hStab.position.set(0,0.24,3.38); acGroup.add(hStab)
  // Vertical stabiliser
  const vStab = new THREE.Mesh(new THREE.BoxGeometry(0.13,1.15,0.88), wMat)
  vStab.position.set(0,0.82,3.32); acGroup.add(vStab)
  // Propeller disc (spinning)
  const propMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.96,0.96,0.06,20),
    new THREE.MeshLambertMaterial({color:0x333333,transparent:true,opacity:0.42})
  )
  propMesh.rotation.x = Math.PI/2; propMesh.position.set(0,-0.05,-5.0)
  acGroup.add(propMesh)
  // Landing gear (tricycle)
  const gearPts: [number,number,number,boolean][] = [
    [0,-0.95,-2.55,true],[1.58,-0.95,0.30,false],[-1.58,-0.95,0.30,false]
  ]
  for (const [gx,gy,gz,isNose] of gearPts) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.88,7), gMat)
    post.position.set(gx, gy, gz); acGroup.add(post)
    const wr = isNose ? 0.22 : 0.28
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(wr,wr,0.17,12), gMat)
    wheel.rotation.z = Math.PI/2; wheel.position.set(gx, gy-0.50, gz)
    acGroup.add(wheel)
  }
  // Navigation lights
  const navRed   = new THREE.Mesh(new THREE.SphereGeometry(0.12,6,4),
    new THREE.MeshBasicMaterial({color:0xFF0000}))
  const navGreen = new THREE.Mesh(new THREE.SphereGeometry(0.12,6,4),
    new THREE.MeshBasicMaterial({color:0x00FF44}))
  navRed.position.set(-5.5, 0.08, -0.1);   acGroup.add(navRed)
  navGreen.position.set(5.5, 0.08, -0.1);  acGroup.add(navGreen)

  scene.add(acGroup)
  return acGroup
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD DRAWING  (2-D canvas overlay)
// ─────────────────────────────────────────────────────────────────────────────
type C2D = CanvasRenderingContext2D

function roundRect(ctx: C2D, x:number, y:number, w:number, h:number, r:number) {
  ctx.beginPath()
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r)
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r)
  ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r)
  ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath()
}

function gaugeBg(ctx: C2D, cx:number, cy:number, r:number) {
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2)
  ctx.fillStyle='#0C1218'; ctx.fill()
  ctx.strokeStyle='#38485A'; ctx.lineWidth=2.5; ctx.stroke()
}

function gaugeLabel(ctx: C2D, cx:number, cy:number, r:number, txt:string) {
  ctx.fillStyle='#5A7080'; ctx.font='9px "Courier New"'; ctx.textAlign='center'
  ctx.fillText(txt, cx, cy+r+14)
}

// Airspeed Indicator — 0-200 KIAS with coloured arcs
function drawASI(ctx: C2D, cx:number, cy:number, r:number, kias:number) {
  gaugeBg(ctx,cx,cy,r)
  const arc = (v1:number,v2:number,col:string,w:number) => {
    const a1=(v1/200)*Math.PI*2-Math.PI/2, a2=(v2/200)*Math.PI*2-Math.PI/2
    ctx.beginPath(); ctx.arc(cx,cy,r-7,a1,a2)
    ctx.strokeStyle=col; ctx.lineWidth=w; ctx.stroke()
  }
  arc(40, 85, '#FFFFFF', 5.5)   // white arc: Vso–Vfe
  arc(48,129, '#00CC44', 5.5)   // green arc: Vs–Vno
  arc(129,163,'#FFCC00', 5.5)   // yellow arc: Vno–Vne
  // Red radial at Vne
  const rla = (163/200)*Math.PI*2-Math.PI/2
  ctx.beginPath(); ctx.arc(cx,cy,r-4,rla,rla+0.045)
  ctx.strokeStyle='#FF2200'; ctx.lineWidth=7; ctx.stroke()
  // Tick marks
  for (let v=0;v<=200;v+=10) {
    const a=(v/200)*Math.PI*2-Math.PI/2, major=v%40===0
    ctx.beginPath(); ctx.lineWidth=major?2:1
    ctx.strokeStyle='#BBBBBB'
    ctx.moveTo(cx+(r-15)*Math.cos(a),cy+(r-15)*Math.sin(a))
    ctx.lineTo(cx+(r-15-(major?11:6))*Math.cos(a), cy+(r-15-(major?11:6))*Math.sin(a))
    ctx.stroke()
    if (major) {
      ctx.fillStyle='#CCCCCC'; ctx.font='9px monospace'; ctx.textAlign='center'
      ctx.fillText(String(v), cx+(r-34)*Math.cos(a), cy+(r-34)*Math.sin(a)+3)
    }
  }
  // Needle
  const na=(Math.max(0,Math.min(200,kias))/200)*Math.PI*2-Math.PI/2
  ctx.beginPath(); ctx.moveTo(cx,cy)
  ctx.lineTo(cx+(r-20)*Math.cos(na), cy+(r-20)*Math.sin(na))
  ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=2.5; ctx.stroke()
  ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2)
  ctx.fillStyle='#FFFFFF'; ctx.fill()
  ctx.fillStyle='#00FF99'; ctx.font=`bold ${Math.round(r*0.19)}px "Courier New"`
  ctx.textAlign='center'; ctx.fillText(Math.round(kias).toString(),cx,cy+r*0.46)
  gaugeLabel(ctx,cx,cy,r,'KIAS')
}

// Altimeter — 3-pointer style with Kollsman
function drawALT(ctx: C2D, cx:number, cy:number, r:number, altFt:number) {
  gaugeBg(ctx,cx,cy,r)
  for (let i=0;i<50;i++) {
    const a=(i/50)*Math.PI*2-Math.PI/2, major=i%5===0
    ctx.beginPath(); ctx.strokeStyle='#BBBBBB'; ctx.lineWidth=major?2:1
    ctx.moveTo(cx+(r-8)*Math.cos(a),cy+(r-8)*Math.sin(a))
    ctx.lineTo(cx+(r-8-(major?10:5))*Math.cos(a), cy+(r-8-(major?10:5))*Math.sin(a))
    ctx.stroke()
  }
  // Hundreds needle (long)
  const hundNeedle = ((altFt%1000)/1000)*Math.PI*2-Math.PI/2
  ctx.beginPath(); ctx.moveTo(cx,cy)
  ctx.lineTo(cx+(r-18)*Math.cos(hundNeedle), cy+(r-18)*Math.sin(hundNeedle))
  ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=3; ctx.stroke()
  // Thousands needle (medium)
  const thouNeedle = ((altFt%10000)/10000)*Math.PI*2-Math.PI/2
  ctx.beginPath(); ctx.moveTo(cx,cy)
  ctx.lineTo(cx+(r-32)*Math.cos(thouNeedle), cy+(r-32)*Math.sin(thouNeedle))
  ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=2; ctx.stroke()
  // Center
  ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2); ctx.fillStyle='#FFFFFF'; ctx.fill()
  // Kollsman window
  roundRect(ctx, cx+r*0.42, cy-11, r*0.52, 22, 3)
  ctx.fillStyle='#142230'; ctx.fill()
  ctx.strokeStyle='#304858'; ctx.lineWidth=1; ctx.stroke()
  ctx.fillStyle='#88BBDD'; ctx.font=`bold ${Math.round(r*0.145)}px "Courier New"`
  ctx.textAlign='center'; ctx.fillText('29.92', cx+r*0.68, cy+4)
  ctx.fillStyle='#00FF99'; ctx.font=`bold ${Math.round(r*0.185)}px "Courier New"`
  ctx.textAlign='center'; ctx.fillText(Math.round(altFt).toString(),cx,cy+r*0.46)
  gaugeLabel(ctx,cx,cy,r,'ALT ft MSL')
}

// Attitude Indicator (ADI/AI) — horizon, pitch ladder, bank arc
function drawAI(ctx: C2D, cx:number, cy:number, r:number, pitch:number, roll:number) {
  ctx.save()
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip()
  const rollR = roll*D2R
  const pitchOff = (pitch/20)*(r*0.55)
  ctx.save()
  ctx.translate(cx,cy); ctx.rotate(rollR); ctx.translate(-cx,-cy)
  const skyH = cy+pitchOff
  ctx.fillStyle='#1A4A8A'; ctx.fillRect(cx-r*2, cy-r*2, r*4, skyH-(cy-r*2)+r*2)
  ctx.fillStyle='#5E3A1A'; ctx.fillRect(cx-r*2, skyH, r*4, r*2)
  ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=2.5
  ctx.beginPath(); ctx.moveTo(cx-r*2,skyH); ctx.lineTo(cx+r*2,skyH); ctx.stroke()
  // Pitch ladder
  ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=1.5; ctx.fillStyle='#FFFFFF'
  ctx.font='9px monospace'
  for (let p=-20;p<=20;p+=5) {
    if (p===0) continue
    const ly = skyH-(p/20)*(r*0.55), pw=p%10===0?r*0.38:r*0.22
    ctx.beginPath(); ctx.moveTo(cx-pw,ly); ctx.lineTo(cx+pw,ly); ctx.stroke()
    if (p%10===0) {
      ctx.textAlign='right'; ctx.fillText(Math.abs(p).toString(),cx-pw-4,ly+4)
      ctx.textAlign='left';  ctx.fillText(Math.abs(p).toString(),cx+pw+4,ly+4)
    }
  }
  ctx.restore()
  // Bank arc
  ctx.strokeStyle='#7A8898'; ctx.lineWidth=1.5
  ctx.beginPath(); ctx.arc(cx,cy,r-9,-Math.PI*1.22,-Math.PI*0.28); ctx.stroke()
  for (const ba of [-60,-45,-30,-20,-10,0,10,20,30,45,60]) {
    const a=(-ba-90)*D2R, tl=ba%30===0?12:6
    ctx.beginPath(); ctx.lineWidth=ba%30===0?2:1
    ctx.moveTo(cx+(r-9)*Math.cos(a),cy+(r-9)*Math.sin(a))
    ctx.lineTo(cx+(r-9-tl)*Math.cos(a),cy+(r-9-tl)*Math.sin(a))
    ctx.strokeStyle='#AAAAAA'; ctx.stroke()
  }
  // Bank pointer
  const ba=(-roll-90)*D2R
  const tipX=cx+(r-22)*Math.cos(ba), tipY=cy+(r-22)*Math.sin(ba)
  ctx.beginPath(); ctx.moveTo(tipX,tipY)
  ctx.lineTo(tipX+7*Math.cos(ba+Math.PI*0.83),tipY+7*Math.sin(ba+Math.PI*0.83))
  ctx.lineTo(tipX+7*Math.cos(ba-Math.PI*0.83),tipY+7*Math.sin(ba-Math.PI*0.83))
  ctx.closePath(); ctx.fillStyle='#FFCC00'; ctx.fill()
  // Fixed aircraft symbol
  ctx.strokeStyle='#FFCC00'; ctx.lineWidth=2.5
  ctx.beginPath()
  ctx.moveTo(cx-r*0.36,cy); ctx.lineTo(cx-r*0.14,cy)
  ctx.moveTo(cx+r*0.14,cy); ctx.lineTo(cx+r*0.36,cy)
  ctx.moveTo(cx,cy-3); ctx.lineTo(cx,cy+3)
  ctx.stroke()
  ctx.restore()
  // Bezel re-draw
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2)
  ctx.strokeStyle='#38485A'; ctx.lineWidth=3; ctx.stroke()
  gaugeLabel(ctx,cx,cy,r,'AI')
}

// Vertical Speed Indicator — ±2000 FPM
function drawVSI(ctx: C2D, cx:number, cy:number, r:number, fpm:number) {
  gaugeBg(ctx,cx,cy,r)
  const maxF=2000
  for (let v=-maxF;v<=maxF;v+=500) {
    const a=(v/maxF)*0.5*Math.PI-Math.PI/2, major=Math.abs(v)%1000===0
    ctx.beginPath(); ctx.strokeStyle='#BBBBBB'; ctx.lineWidth=major?2:1.5
    ctx.moveTo(cx+(r-8)*Math.cos(a),cy+(r-8)*Math.sin(a))
    ctx.lineTo(cx+(r-8-(major?11:6))*Math.cos(a),cy+(r-8-(major?11:6))*Math.sin(a))
    ctx.stroke()
    if (major) {
      ctx.fillStyle='#CCCCCC'; ctx.font='8px monospace'; ctx.textAlign='center'
      const lbl=v===0?'0':(v>0?'+':'')+(v/1000).toFixed(0)
      ctx.fillText(lbl, cx+(r-26)*Math.cos(a), cy+(r-26)*Math.sin(a)+3)
    }
  }
  const na=(Math.max(-maxF,Math.min(maxF,fpm))/maxF)*0.5*Math.PI-Math.PI/2
  ctx.beginPath(); ctx.moveTo(cx,cy)
  ctx.lineTo(cx+(r-20)*Math.cos(na),cy+(r-20)*Math.sin(na))
  ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=2.5; ctx.stroke()
  ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fillStyle='#FFFFFF'; ctx.fill()
  ctx.fillStyle='#00FF99'; ctx.font=`bold ${Math.round(r*0.17)}px "Courier New"`
  ctx.textAlign='center'
  ctx.fillText((fpm>=0?'+':'')+Math.round(fpm),cx,cy+r*0.46)
  gaugeLabel(ctx,cx,cy,r,'VSI fpm')
}

// Heading Indicator — rotating compass rose
function drawHDG(ctx: C2D, cx:number, cy:number, r:number, hdg:number) {
  gaugeBg(ctx,cx,cy,r)
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(-hdg*D2R); ctx.translate(-cx,-cy)
  const compass=['N','NE','E','SE','S','SW','W','NW']
  for (let i=0;i<360;i+=5) {
    const a=i*D2R-Math.PI/2, major=i%10===0, cardinal=i%90===0
    ctx.beginPath()
    ctx.strokeStyle=cardinal?'#FFFFFF':major?'#888888':'#555555'
    ctx.lineWidth=cardinal?2.5:major?1.5:1
    ctx.moveTo(cx+(r-8)*Math.cos(a),cy+(r-8)*Math.sin(a))
    ctx.lineTo(cx+(r-8-(major?10:5))*Math.cos(a),cy+(r-8-(major?10:5))*Math.sin(a))
    ctx.stroke()
    if (i%45===0) {
      ctx.fillStyle='#DDDDDD'; ctx.font=`${r<60?10:12}px monospace`
      ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText(compass[i/45], cx+(r-26)*Math.cos(a), cy+(r-26)*Math.sin(a))
    } else if (i%30===0&&i%45!==0) {
      ctx.fillStyle='#999999'; ctx.font='9px monospace'
      ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText((i/10).toString().padStart(2,'0'),
        cx+(r-26)*Math.cos(a),cy+(r-26)*Math.sin(a))
    }
  }
  ctx.textBaseline='alphabetic'; ctx.restore()
  // Fixed lubber line triangle at top
  ctx.beginPath(); ctx.moveTo(cx,cy-r+5)
  ctx.lineTo(cx-7,cy-r+18); ctx.lineTo(cx+7,cy-r+18)
  ctx.closePath(); ctx.fillStyle='#FFCC00'; ctx.fill()
  ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fillStyle='#FFFFFF'; ctx.fill()
  ctx.fillStyle='#00FF99'; ctx.font=`bold ${Math.round(r*0.22)}px "Courier New"`
  ctx.textAlign='center'
  ctx.fillText(String(Math.round(hdg)).padStart(3,'0')+'°',cx,cy+r*0.47)
  gaugeLabel(ctx,cx,cy,r,'HDG mag')
}

// Engine / systems cluster
function drawEngine(ctx: C2D, x:number, y:number, w:number, h:number,
                    thr:number, rpmV:number, flapIdx:number, speed:number) {
  roundRect(ctx,x,y,w,h,7)
  ctx.fillStyle='rgba(8,14,20,0.93)'; ctx.fill()
  ctx.strokeStyle='#2A3D4D'; ctx.lineWidth=1.5; ctx.stroke()
  ctx.fillStyle='#5A8A9A'; ctx.font='bold 10px "Courier New"'; ctx.textAlign='left'
  ctx.fillText('■ ENGINE', x+10, y+16)
  const bar=(bx:number,by:number,bw:number,bh:number,pct:number,col:string,lbl:string)=>{
    ctx.fillStyle='#181E28'; ctx.fillRect(bx,by,bw,bh)
    ctx.fillStyle=col; ctx.fillRect(bx,by,bw*pct,bh)
    ctx.strokeStyle='#2A3D4D'; ctx.lineWidth=1; ctx.strokeRect(bx,by,bw,bh)
    ctx.fillStyle='#DDEEFF'; ctx.font='8px "Courier New"'; ctx.textAlign='left'
    ctx.fillText(lbl, bx+3, by+bh-2)
  }
  bar(x+10,y+24,w-20,13, Math.min(1,rpmV/2700),'#44BBFF',`RPM ${Math.round(rpmV)}`)
  bar(x+10,y+44,w-20,13, thr,'#FFAA22',`THR ${Math.round(thr*100)}%`)
  const mp = (15+thr*14).toFixed(1)
  const flapDegs=[0,10,20,30]
  const tas = (speed / KTS).toFixed(0)
  ctx.fillStyle='#AACCDD'; ctx.font='9px "Courier New"'; ctx.textAlign='left'
  const lines=[
    `MP   ${mp} inHg`,
    `FLAP ${flapDegs[flapIdx]}°`,
    `TAS  ${tas} kt`,
    `OIL  190°F  58psi`,
    `FUEL 36.0 gal`,
  ]
  lines.forEach((l,i)=>ctx.fillText(l, x+10, y+68+i*14))
}

// Top data strip
function drawStrip(ctx:C2D, W:number, kias:number, altFt:number,
                   hdg:number, fpm:number, onGround:boolean,
                   pkBrake:boolean, stallBuf:number, paused:boolean) {
  ctx.fillStyle='rgba(4,10,18,0.90)'
  ctx.fillRect(0,0,W,40)
  ctx.strokeStyle='#1E3040'; ctx.lineWidth=1
  ctx.beginPath(); ctx.moveTo(0,40); ctx.lineTo(W,40); ctx.stroke()
  const fields=[
    ` IAS ${String(Math.round(kias)).padStart(3)} kt`,
    ` ALT ${String(Math.round(altFt)).padStart(5)} ft`,
    ` VS  ${(fpm>=0?'+':'')+String(Math.round(fpm)).padStart(5)} fpm`,
    ` HDG ${String(Math.round(hdg)).padStart(3)}° mag`,
    onGround?(pkBrake?' [PARK BRK]':' [GND ROLL]'):'  [  AIR  ]',
    paused?' ■ PAUSED ':' ► FLYING '
  ]
  const fw=Math.floor(W/fields.length)
  fields.forEach((f,i)=>{
    ctx.fillStyle=
      i===5&&paused?'#FFCC00':
      i===4&&pkBrake?'#FF6622':
      i===4&&!onGround?'#44FFAA':'#00FF99'
    ctx.font=`bold 12px "Courier New"`; ctx.textAlign='left'
    ctx.fillText(f, i*fw, 26)
  })
  if (stallBuf>0.3) {
    ctx.fillStyle=`rgba(255,40,0,${stallBuf*0.95})`
    ctx.font='bold 15px "Courier New"'; ctx.textAlign='center'
    ctx.fillText('⚠  STALL WARNING  ⚠', W/2, 26)
  }
}

function drawHUD(canvas:HTMLCanvasElement, s:SimState) {
  const ctx=canvas.getContext('2d'); if(!ctx) return
  const W=canvas.width, H=canvas.height
  ctx.clearRect(0,0,W,H)

  const speed   = s.vel.length()
  const rhoAlt  = airDensity(s.pos.y+ELEV_M)
  const rhoSL   = 1.225
  const ias     = speed*Math.sqrt(rhoAlt/rhoSL)
  const kias    = ias/KTS
  const altFt   = s.pos.y/FT + ELEV_FT
  const fpm     = s.vel.y/FT*60
  const rpmDisp = engineRPM(s.throttle, speed)

  drawStrip(ctx,W,kias,altFt,s.heading,fpm,s.onGround,s.parkingBrake,s.stallBuffet,s.paused)

  const R    = Math.min(W,H)*0.093
  const gap  = R*0.28
  const rowY = H - R - gap - 10
  const n    = 5
  const totW = n*R*2+(n-1)*gap
  const x0   = (W-totW)/2+R

  drawASI(ctx, x0,           rowY, R, kias)
  drawVSI(ctx, x0+(R*2+gap), rowY, R, fpm)
  drawAI (ctx, x0+2*(R*2+gap),rowY, R, s.pitch, s.roll)
  drawALT(ctx, x0+3*(R*2+gap),rowY, R, altFt)
  drawHDG(ctx, x0+4*(R*2+gap),rowY, R, s.heading)

  const eW=168, eH=140
  drawEngine(ctx, W-eW-12, H-eH-12, eW, eH, s.throttle, rpmDisp, s.flapIdx, speed)

  if (s.paused) {
    ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(0,0,W,H)
    ctx.fillStyle='#FFCC00'; ctx.font='bold 52px "Courier New"'; ctx.textAlign='center'
    ctx.fillText('PAUSED',W/2,H/2)
    ctx.fillStyle='#AAAAAA'; ctx.font='18px "Courier New"'
    ctx.fillText('Press P to resume',W/2,H/2+50)
  }
  if (s.stallBuffet>0.55) {
    const a=0.12*s.stallBuffet*(0.5+0.5*Math.sin(s.time*22))
    ctx.fillStyle=`rgba(255,0,0,${a})`; ctx.fillRect(0,0,W,H)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function cameraAxes(hdg:number, pitch:number, roll:number) {
  const hdgR=hdg*D2R, pitchR=pitch*D2R, rollR=roll*D2R
  const fwd = new THREE.Vector3(
    Math.sin(hdgR)*Math.cos(pitchR), Math.sin(pitchR), -Math.cos(hdgR)*Math.cos(pitchR))
  const right0 = new THREE.Vector3(Math.cos(hdgR), 0, Math.sin(hdgR))
  const up0    = new THREE.Vector3(
    -Math.sin(hdgR)*Math.sin(pitchR), Math.cos(pitchR), Math.cos(hdgR)*Math.sin(pitchR))
  const upFinal = up0.clone().multiplyScalar(Math.cos(rollR))
    .addScaledVector(right0, -Math.sin(rollR))
  return { fwd, upFinal }
}

function updateCamera(cam:THREE.PerspectiveCamera, s:SimState, mode:number) {
  const { fwd, upFinal } = cameraAxes(s.heading, s.pitch, s.roll)
  if (mode===0) {
    // Cockpit — pilot's eye ~1.1 m above datum
    const eye = s.pos.clone().add(new THREE.Vector3(0,1.1,0))
    cam.position.copy(eye)
    cam.up.copy(upFinal)
    cam.lookAt(eye.clone().add(fwd))
  } else if (mode===1) {
    // Chase — 40 m behind, 12 m above, smooth lerp
    const target = s.pos.clone().addScaledVector(fwd,-40).add(new THREE.Vector3(0,12,0))
    cam.position.lerp(target, 0.07)
    cam.up.set(0,1,0)
    cam.lookAt(s.pos.clone().add(new THREE.Vector3(0,2,0)))
  } else {
    // Tower — fixed at runway 08 threshold north side
    cam.position.set(-1806,38,218)
    cam.up.set(0,1,0)
    cam.lookAt(0,2,0)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE AIRCRAFT MESH IN SCENE
// ─────────────────────────────────────────────────────────────────────────────
function updateAircraftMesh(mesh:THREE.Group, s:SimState) {
  // Position: aircraft datum is 1.35 m above wheel contact
  mesh.position.set(s.pos.x, s.pos.y+1.35, s.pos.z)

  // Orientation via rotation matrix: aircraft nose = local −Z
  const hdgR=s.heading*D2R, pitchR=s.pitch*D2R, rollR=s.roll*D2R
  const fwd    = new THREE.Vector3(
    Math.sin(hdgR)*Math.cos(pitchR), Math.sin(pitchR), -Math.cos(hdgR)*Math.cos(pitchR))
  const right0 = new THREE.Vector3(Math.cos(hdgR), 0, Math.sin(hdgR))
  const up0    = new THREE.Vector3(
    -Math.sin(hdgR)*Math.sin(pitchR), Math.cos(pitchR), Math.cos(hdgR)*Math.sin(pitchR))
  const rightF = right0.clone().multiplyScalar(Math.cos(rollR)).addScaledVector(up0, Math.sin(rollR))
  const upF    = up0.clone().multiplyScalar(Math.cos(rollR)).addScaledVector(right0,-Math.sin(rollR))
  const back   = fwd.clone().negate()   // aircraft -Z in world = local +Z axis for the matrix
  const mat4   = new THREE.Matrix4().makeBasis(rightF, upF, back)
  mesh.quaternion.setFromRotationMatrix(mat4)
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function LoadingScreen({ onReady }: { onReady: () => void }) {
  const [progress, setProgress] = useState(0)
  const [lineIdx,  setLineIdx]  = useState(0)

  const atis = [
    'CAMARILLO INFORMATION ALPHA',
    'CAMARILLO AIRPORT (KCMA)',
    'OBSERVATION TIME 0800Z',
    'WINDS 320 AT 8 KNOTS',
    'VISIBILITY 10 MILES',
    'SKY CLEAR',
    'TEMPERATURE 18°C  DEW POINT 12°C',
    'ALTIMETER 29.92',
    'REMARKS — PIREP: SMOOTH AT 3000',
    'ADVISE ON INITIAL CONTACT',
    'YOU HAVE INFORMATION ALPHA',
    '─────────────────────────────',
    'INITIALISING SIMULATOR…',
  ]

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineIdx(v => Math.min(v+1, atis.length-1))
    }, 220)
    const progTimer = setInterval(() => {
      setProgress(v => {
        if (v >= 100) { clearInterval(progTimer); clearInterval(lineTimer); onReady(); return 100 }
        return v + 1.8
      })
    }, 55)
    return () => { clearInterval(lineTimer); clearInterval(progTimer) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      position:'fixed', inset:0, background:'#040A10', zIndex:100,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      fontFamily:'"Courier New",monospace', color:'#00FF99'
    }}>
      {/* KCMA Logo / ident */}
      <div style={{ marginBottom:32, textAlign:'center' }}>
        <div style={{ fontSize:52, fontWeight:'bold', letterSpacing:10, color:'#00FF99',
          textShadow:'0 0 30px rgba(0,255,153,0.5)' }}>KCMA</div>
        <div style={{ fontSize:14, letterSpacing:4, color:'#5A8A7A', marginTop:4 }}>
          CAMARILLO AIRPORT — RUNWAY 26
        </div>
      </div>
      {/* ATIS text */}
      <div style={{ width:420, background:'rgba(0,255,153,0.04)',
        border:'1px solid rgba(0,255,153,0.2)', borderRadius:6, padding:'16px 22px',
        marginBottom:28, fontSize:12, lineHeight:1.8 }}>
        {atis.slice(0,lineIdx+1).map((l,i)=>(
          <div key={i} style={{ color: i===lineIdx?'#00FF99':'#4A8A6A' }}>{l}</div>
        ))}
        <span style={{ animation:'blink 1s step-end infinite' }}>▋</span>
      </div>
      {/* Progress bar */}
      <div style={{ width:420 }}>
        <div style={{ height:4, background:'rgba(0,255,153,0.12)',
          borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'#00FF99',
            transition:'width 0.05s linear', boxShadow:'0 0 8px rgba(0,255,153,0.7)' }} />
        </div>
        <div style={{ fontSize:11, color:'#4A8A6A', marginTop:8, textAlign:'center' }}>
          {progress < 100 ? `Loading world geometry… ${Math.round(progress)}%` : 'Press any key or click to start'}
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCTIONS PANEL
// ─────────────────────────────────────────────────────────────────────────────
function InstructionsPanel({ show, onToggle }: { show:boolean, onToggle:()=>void }) {
  const cols: [string,string][][] = [
    [
      ['W / ↑', 'Elevator — pull (nose up)'],
      ['S / ↓', 'Elevator — push (nose down)'],
      ['A / ←', 'Aileron — bank left'],
      ['D / →', 'Aileron — bank right'],
      ['Q',     'Rudder left'],
      ['E',     'Rudder right'],
    ],[
      ['F',     'Flaps up (0°→10°→20°→30°)'],
      ['V',     'Flaps down'],
      ['T',     'Throttle +5%'],
      ['Y',     'Throttle −5%'],
      ['1–4',   'Throttle: idle/25/50/75%'],
      ['5',     'Full throttle (100%)'],
    ],[
      ['B',     'Parking brake toggle'],
      ['P',     'Pause / Resume'],
      ['C',     'Camera: cockpit/chase/tower'],
      ['R',     'Reset aircraft to RWY 26'],
      ['',      ''],
      ['',      'Pro tip: Release brake,'],
    ]
  ]
  return (
    <div style={{ position:'fixed', bottom:12, left:12, zIndex:50 }}>
      <button onClick={onToggle} style={{
        background:'rgba(4,14,22,0.88)', border:'1px solid rgba(0,200,120,0.35)',
        color:'#00CC88', fontFamily:'"Courier New",monospace', fontSize:11,
        padding:'5px 12px', borderRadius:4, cursor:'pointer', marginBottom:4,
        letterSpacing:1
      }}>
        {show ? '▼ CONTROLS' : '▶ CONTROLS'}
      </button>
      {show && (
        <div style={{
          background:'rgba(4,14,22,0.94)', border:'1px solid rgba(0,200,120,0.3)',
          borderRadius:6, padding:'12px 16px', maxWidth:600,
          fontFamily:'"Courier New",monospace', fontSize:11, color:'#8ABCAC'
        }}>
          <div style={{ color:'#00CC88', fontWeight:'bold', marginBottom:8, fontSize:12,
            letterSpacing:2 }}>KCMA RWY 26 — FLIGHT CONTROLS</div>
          <div style={{ display:'flex', gap:24 }}>
            {cols.map((col,ci)=>(
              <div key={ci}>
                {col.map(([key,desc],i)=>(
                  <div key={i} style={{ marginBottom:4, whiteSpace:'nowrap' }}>
                    {key && <span style={{
                      display:'inline-block', minWidth:38, textAlign:'center',
                      background:'rgba(0,200,120,0.12)', border:'1px solid rgba(0,200,120,0.25)',
                      borderRadius:3, padding:'0 4px', color:'#00FF99', marginRight:8, fontSize:10
                    }}>{key}</span>}
                    <span style={{ color: key?'#8ABCAC':'#4A7060', fontStyle:key?'normal':'italic' }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop:10, color:'#4A7060', fontSize:10, lineHeight:1.5 }}>
            Cessna 172S Skyhawk SP — Lycoming IO-360-L2A 180 HP — Vr 55 kt — Vy 74 kt
            {' '}— Pattern alt 1277 ft MSL — CTAF 123.025
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SIMULATOR PAGE
// ─────────────────────────────────────────────────────────────────────────────
const siteSettings = {
  logoText: 'CFI',
  contactEmail: 'info@camarilloflightinstruction.com',
}

export default function SimulatorPage() {
  const mountRef  = useRef<HTMLDivElement>(null)
  const hudRef    = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading]           = useState(true)
  const [showInst,setShowInst]          = useState(false)

  // All mutable sim state lives in refs — never triggers React re-renders
  const stateRef   = useRef<SimState>(initialState())
  const keysRef    = useRef<Set<string>>(new Set())
  const camMode    = useRef<0|1|2>(0)
  const frameId    = useRef<number>(0)
  const lastTime   = useRef<number>(0)
  const rendRef    = useRef<THREE.WebGLRenderer|null>(null)
  const camRef     = useRef<THREE.PerspectiveCamera|null>(null)
  const sceneRef   = useRef<THREE.Scene|null>(null)
  const acMeshRef  = useRef<THREE.Group|null>(null)
  const clockRef   = useRef(0)   // for throttle key repeat

  useEffect(() => {
    if (!mountRef.current || !hudRef.current) return

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mountRef.current.appendChild(renderer.domElement)
    rendRef.current = renderer

    // ── Camera ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(72, window.innerWidth/window.innerHeight, 0.5, 120000)
    camera.position.set(0, 1.5, 0)
    camRef.current = camera

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    sceneRef.current = scene
    acMeshRef.current = buildScene(scene)

    // Position aircraft mesh at start
    updateAircraftMesh(acMeshRef.current, stateRef.current)
    updateCamera(camera, stateRef.current, 0)

    // ── HUD canvas resize ──────────────────────────────────────────────────
    const resizeHUD = () => {
      if (!hudRef.current) return
      hudRef.current.width  = window.innerWidth
      hudRef.current.height = window.innerHeight
    }
    resizeHUD()

    // ── Resize handler ─────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      resizeHUD()
    }
    window.addEventListener('resize', onResize)

    // ── Keyboard handlers ──────────────────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))
        e.preventDefault()
      keysRef.current.add(e.key.toLowerCase())

      const s = stateRef.current
      switch (e.key.toLowerCase()) {
        case 'p':
          stateRef.current = { ...s, paused: !s.paused }; break
        case 'b':
          stateRef.current = { ...s, parkingBrake: !s.parkingBrake }; break
        case 'c':
          camMode.current = ((camMode.current+1)%3) as 0|1|2; break
        case 'f': {
          const ni = Math.min(3, s.flapIdx+1)
          const spd = s.vel.length()
          if (ni > s.flapIdx && spd <= VFE * 1.05)
            stateRef.current = { ...s, flapIdx: ni }
          break
        }
        case 'v':
          stateRef.current = { ...s, flapIdx: Math.max(0, s.flapIdx-1) }; break
        case '1': stateRef.current = { ...s, throttle: 0.0  }; break
        case '2': stateRef.current = { ...s, throttle: 0.25 }; break
        case '3': stateRef.current = { ...s, throttle: 0.50 }; break
        case '4': stateRef.current = { ...s, throttle: 0.75 }; break
        case '5': stateRef.current = { ...s, throttle: 1.0  }; break
        case 'r': stateRef.current = initialState();             break
      }
    }
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase())
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup',   onKeyUp)

    // ── Game loop ──────────────────────────────────────────────────────────
    function processKeys(dt: number) {
      const k = keysRef.current
      const s = stateRef.current
      let elev = s.elevator, ail = s.aileron, rud = s.rudder, thr = s.throttle

      // Elevator
      if (k.has('w') || k.has('arrowup'))   elev = Math.min(1,  elev + 2.5*dt)
      if (k.has('s') || k.has('arrowdown')) elev = Math.max(-1, elev - 2.5*dt)
      if (!k.has('w')&&!k.has('arrowup')&&!k.has('s')&&!k.has('arrowdown'))
        elev *= (1 - 3*dt)   // spring back

      // Ailerons
      if (k.has('a') || k.has('arrowleft'))  ail = Math.max(-1, ail - 3*dt)
      if (k.has('d') || k.has('arrowright')) ail = Math.min(1,  ail + 3*dt)
      if (!k.has('a')&&!k.has('arrowleft')&&!k.has('d')&&!k.has('arrowright'))
        ail *= (1 - 4*dt)

      // Rudder
      if (k.has('q')) rud = Math.max(-1, rud - 3*dt)
      if (k.has('e')) rud = Math.min(1,  rud + 3*dt)
      if (!k.has('q') && !k.has('e')) rud *= (1 - 4*dt)

      // Throttle (T/Y with key repeat limiting)
      clockRef.current += dt
      if (clockRef.current > 0.06) {
        clockRef.current = 0
        if (k.has('t')) thr = Math.min(1.0, thr + 0.015)
        if (k.has('y')) thr = Math.max(0.0, thr - 0.015)
      }

      stateRef.current = { ...s, elevator: elev, aileron: ail, rudder: rud, throttle: thr }
    }

    function loop(timestamp: number) {
      frameId.current = requestAnimationFrame(loop)
      const dt = Math.min((timestamp - lastTime.current) / 1000, 0.05)
      lastTime.current = timestamp
      if (dt <= 0) return

      processKeys(dt)
      stateRef.current = updatePhysics(stateRef.current, dt)

      const s = stateRef.current
      if (acMeshRef.current) {
        updateAircraftMesh(acMeshRef.current, s)
        // Hide aircraft mesh in cockpit view (you're inside it)
        acMeshRef.current.visible = camMode.current !== 0
      }
      if (camRef.current) updateCamera(camRef.current, s, camMode.current)
      if (rendRef.current && sceneRef.current && camRef.current)
        rendRef.current.render(sceneRef.current, camRef.current)
      if (hudRef.current) drawHUD(hudRef.current, s)
    }

    lastTime.current = performance.now()
    frameId.current  = requestAnimationFrame(loop)

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId.current)
      window.removeEventListener('resize',  onResize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup',   onKeyUp)
      renderer.dispose()
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current)
        mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Flight Simulator — KCMA Runway 26 Departure | Camarillo Flight Instruction</title>
        <meta name="description" content="Realistic Cessna 172S flight simulator of Camarillo Airport (KCMA) Runway 26 departure. Experience takeoff from KCMA with accurate physics, instruments and terrain." />
      </Head>

      {/* Navigation */}
      <Navigation siteSettings={siteSettings} />

      {/* Three.js canvas mount */}
      <div
        ref={mountRef}
        style={{ position:'fixed', inset:0, zIndex:0 }}
      />

      {/* HUD canvas overlay */}
      <canvas
        ref={hudRef}
        style={{
          position:'fixed', inset:0, zIndex:10,
          pointerEvents:'none', width:'100vw', height:'100vh'
        }}
      />

      {/* Loading screen */}
      {loading && <LoadingScreen onReady={() => setLoading(false)} />}

      {/* Instructions */}
      <div style={{ position:'fixed', bottom:0, left:0, zIndex:40 }}>
        <InstructionsPanel show={showInst} onToggle={() => setShowInst(v => !v)} />
      </div>

      {/* Camera mode badge */}
      <div style={{
        position:'fixed', top:52, right:12, zIndex:30,
        background:'rgba(4,14,22,0.88)', border:'1px solid rgba(0,200,120,0.3)',
        color:'#00CC88', fontFamily:'"Courier New",monospace', fontSize:10,
        padding:'4px 10px', borderRadius:4, letterSpacing:1, pointerEvents:'none'
      }}>
        C — CAMERA
      </div>
    </>
  )
}
