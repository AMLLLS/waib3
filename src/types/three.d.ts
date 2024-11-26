import { Clock } from 'three'

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: any
    planeGeometry: any
    shaderMaterial: any
  }
}

declare module 'three' {
  interface Clock {
    getElapsedTime(): number
  }
} 