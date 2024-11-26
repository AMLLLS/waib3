'use client'

import { useRef, useEffect } from 'react'
import { useThree, Canvas } from '@react-three/fiber'
import { Mesh, ShaderMaterial, Clock } from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;

  void main() {
    vec2 position = vUv * 2.0 - 1.0;
    float dist = length(position);
    float alpha = sin(dist * 10.0 - time) * 0.5 + 0.5;
    gl_FragColor = vec4(color, alpha * (1.0 - dist));
  }
`

const AnimatedBackground = () => {
  const mesh = useRef<Mesh>(null)
  const { clock } = useThree()
  const frameRef = useRef<number>()

  useEffect(() => {
    if (!mesh.current) return

    const material = mesh.current.material as ShaderMaterial
    material.uniforms = {
      time: { value: 0 },
      color: { value: [0.82, 0.95, 0.29] } // Conversion de #D1F34A en RGB normalisé
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      if (!mesh.current) return
      const material = mesh.current.material as ShaderMaterial
      material.uniforms.time.value = clock.getElapsedTime()
      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [clock])

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

const BackgroundEffect = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <AnimatedBackground />
      </Canvas>
    </div>
  )
}

export default BackgroundEffect 