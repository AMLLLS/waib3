declare module 'lenis' {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    direction?: 'vertical' | 'horizontal';
    gestureDirection?: 'vertical' | 'horizontal';
    smooth?: boolean;
    mouseMultiplier?: number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    destroy(): void;
  }
} 