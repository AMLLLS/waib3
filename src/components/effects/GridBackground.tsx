'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrthographicCamera } from '@react-three/drei'

const useAnimationFrame = (callback: (time: number) => void) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        callback(time)
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [callback])
}

const Background = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const scrollRef = useRef(0)
  const { viewport } = useThree()

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shaderArgs = {
    uniforms: {
      time: { value: 0 },
      scroll: { value: 0 },
      resolution: { value: new THREE.Vector2(viewport.width, viewport.height) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float scroll;
      uniform vec2 resolution;
      varying vec2 vUv;

      float wave(vec2 uv, float scale, float speed) {
        return sin(uv.x * scale + time * speed) * cos(uv.y * scale + time * speed);
      }

      float energyFlow(vec2 uv) {
        float flow = 0.0;
        
        // Réduction progressive de l'intensité avec le scroll
        float intensity = 1.0 - smoothstep(0.0, 0.7, scroll);
        
        float baseScale = 10.0;
        flow += wave(uv, baseScale, 0.5) * 0.5 * intensity;
        flow += wave(uv, baseScale * 2.0, 0.3) * 0.25 * intensity;
        flow += wave(uv, baseScale * 3.0, 0.2) * 0.125 * intensity;
        
        vec2 moved = uv + time * 0.1;
        flow += wave(moved, 15.0, 0.4) * 0.25 * intensity;
        
        return flow;
      }

      void main() {
        vec2 uv = vUv;
        
        float flow = energyFlow(uv);
        
        vec2 center = vec2(0.5);
        float dist = length(uv - center);
        float vortex = sin(dist * 10.0 - time) * 0.5 + 0.5;
        
        // Couleurs ajustées pour être plus neutres
        vec3 baseColor = vec3(0.051, 0.051, 0.059);    // #0D0D0F
        vec3 color1 = vec3(0.067, 0.067, 0.075);       // #111112
        vec3 color2 = vec3(0.082, 0.082, 0.090);       // #151516
        
        // Transition vers la couleur unie du site
        float transitionStart = 0.7;  // Début de la transition à 70% du scroll
        float transitionEnd = 0.9;    // Fin de la transition à 90% du scroll
        float transition = smoothstep(transitionStart, transitionEnd, scroll);
        
        // Mélange des couleurs avec effets
        vec3 finalColor = baseColor;
        float effectIntensity = 1.0 - transition;  // Réduction progressive des effets
        
        finalColor = mix(finalColor, color1, flow * 0.5 * effectIntensity);
        finalColor = mix(finalColor, color2, vortex * (1.0 - dist) * 0.3 * effectIntensity);
        
        // Transition finale vers la couleur du site
        finalColor = mix(finalColor, baseColor, transition);
        
        // Pulsation qui diminue avec le scroll
        float pulse = sin(time * 0.2) * 0.05 * (1.0 - transition) + 1.0;
        finalColor *= pulse;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  }

  useAnimationFrame((time) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      timeRef.current += 0.01
      material.uniforms.time.value = timeRef.current
      material.uniforms.scroll.value = scrollRef.current
      material.uniformsNeedUpdate = true
    }
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial {...shaderArgs} transparent={true} />
    </mesh>
  )
}

const GridBackground = () => {
  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
        overflow: 'hidden'
      }}
    >
      <Canvas
        style={{ display: 'block' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[0, 0, 1]}
          zoom={1}
          near={0.1}
          far={1000}
        />
        <Background />
      </Canvas>
    </div>
  )
}

export default GridBackground 