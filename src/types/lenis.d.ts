declare module '@studio-freight/lenis' {
    export default class Lenis {
        constructor(options?: {
            duration?: number
            easing?: (t: number) => number
            direction?: 'vertical' | 'horizontal'
            gestureDirection?: 'vertical' | 'horizontal'
            smooth?: boolean
            smoothTouch?: boolean
            touchMultiplier?: number
            infinite?: boolean
        })
        
        destroy(): void
        on(event: string, callback: Function): void
        raf(time: number): void
        start(): void
        stop(): void
    }
} 