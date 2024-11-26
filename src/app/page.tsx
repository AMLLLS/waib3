'use client'

import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import AdvancedFeatures from '@/components/sections/AdvancedFeatures'
import Process from '@/components/sections/Process'
import Tools from '@/components/sections/Tools'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/Pricing'

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Features />
      <AdvancedFeatures />
      <Process />
      <Tools />
      <Testimonials />
      <Pricing />
    </main>
  )
} 