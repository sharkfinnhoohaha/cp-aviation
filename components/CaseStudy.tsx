import { useEffect } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface CaseStudyProps {
  caseStudy: {
    title: string
    description: string
    highlight: string
    interactionHint: string
  }
}

export default function CaseStudy({ caseStudy }: CaseStudyProps) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const container = document.getElementById('canvas-container')
    if (!container || container.querySelector('canvas')) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xF3F4F6)
    scene.fog = new THREE.FogExp2(0xF3F4F6, 0.03)

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 15, 30)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const grid = new THREE.GridHelper(100, 50, 0xE5E7EB, 0xD1D5DB)
    grid.position.y = -0.1
    scene.add(grid)

    const rwGeo = new THREE.PlaneGeometry(4, 80)
    const rwMat = new THREE.MeshBasicMaterial({ color: 0xE5E7EB })
    const runway = new THREE.Mesh(rwGeo, rwMat)
    runway.rotation.x = -Math.PI / 2
    scene.add(runway)

    const bldgMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, roughness: 0.1 })
    const wireMat = new THREE.LineBasicMaterial({ color: 0xDC2626, opacity: 0.7, transparent: true })

    const createBuilding = (w: number, h: number, d: number, x: number, z: number) => {
      const geo = new THREE.BoxGeometry(w, h, d)
      const mesh = new THREE.Mesh(geo, bldgMat)
      mesh.position.set(x, h / 2, z)
      const edges = new THREE.EdgesGeometry(geo)
      const line = new THREE.LineSegments(edges, wireMat)
      mesh.add(line)
      scene.add(mesh)
    }

    createBuilding(6, 2, 4, -10, -5)
    createBuilding(8, 3, 5, -12, 2)
    createBuilding(4, 1.5, 4, 8, 8)
    createBuilding(5, 1, 3, 10, 2)

    const vehicles: { mesh: THREE.Mesh; speed: number }[] = []
    const vGeo = new THREE.BoxGeometry(0.3, 0.1, 0.5)
    const vMat = new THREE.MeshBasicMaterial({ color: 0x111827 })

    for (let i = 0; i < 4; i++) {
      const v = new THREE.Mesh(vGeo, vMat)
      v.position.set(8, 0.1, -15 + i * 8)
      scene.add(v)
      vehicles.push({ mesh: v, speed: 0.02 + Math.random() * 0.02 })
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    dirLight.position.set(10, 20, 10)
    scene.add(dirLight)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    document.addEventListener('mousemove', onMouseMove)

    let targetCamX = 0
    let targetCamY = 15
    let inCaseStudy = false
    let time = 0
    let animationId: number

    ScrollTrigger.create({
      trigger: '#projects',
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => { inCaseStudy = true },
      onLeave: () => { inCaseStudy = false },
      onEnterBack: () => { inCaseStudy = true },
      onLeaveBack: () => { inCaseStudy = false },
    })

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (inCaseStudy) {
        time += 0.002
        const normX = (mouseX / window.innerWidth) * 2 - 1
        const normY = -(mouseY / window.innerHeight) * 2 + 1
        targetCamX = normX * 8 + Math.sin(time) * 4
        targetCamY = 15 + normY * 4
        camera.position.x += (targetCamX - camera.position.x) * 0.05
        camera.position.y += (targetCamY - camera.position.y) * 0.05
        camera.lookAt(scene.position)
        vehicles.forEach(v => {
          v.mesh.position.z += v.speed
          if (v.mesh.position.z > 20) v.mesh.position.z = -20
        })
      }
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationId)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <section id="projects" className="relative h-[80svh] w-full overflow-hidden bg-[#F3F4F6] cursor-move interactive border-y border-gray-200">
      <div id="canvas-container" className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none flex items-center p-6 md:p-16 z-10">
        <div className="max-w-md pointer-events-auto glass-panel-light p-8 rounded shadow-lg cs-ui transform translate-y-8 opacity-0">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-jacRed animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-gray-500 uppercase">Interactive Case Study</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-sans font-bold mb-4 text-jacDark">{caseStudy.title}</h2>
          <p className="text-gray-600 font-light text-sm mb-6 leading-relaxed">
            {caseStudy.description}{' '}
            <strong className="text-jacDark font-medium">{caseStudy.highlight}</strong>.
          </p>
          <div className="text-[10px] font-mono text-gray-400 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 9l7 7 7-7" />
            </svg>
            {caseStudy.interactionHint}
          </div>
        </div>
      </div>
    </section>
  )
}
