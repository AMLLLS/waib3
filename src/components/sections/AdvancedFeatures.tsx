'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import Image from 'next/image'

const features = [
  {
    title: "Design System Complet",
    description: "Accédez à une bibliothèque exhaustive de composants UI modernes et personnalisables.",
    stats: [
      { value: "300+", label: "Composants" },
      { value: "150", label: "Templates" },
      { value: "1000+", label: "Ressources" }
    ]
  },
  {
    title: "Intelligence Artificielle",
    description: "Exploitez la puissance de l'IA pour accélérer votre workflow et générer des designs uniques.",
    stats: [
      { value: "24/7", label: "Assistance IA" },
      { value: "100+", label: "Prompts" },
      { value: "∞", label: "Possibilités" }
    ]
  }
]

const FeatureBlock = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative p-8 rounded-2xl bg-gradient-to-br from-dark-light to-transparent border border-[#262626]"
    >
      <h3 className="text-3xl font-display font-bold mb-4">{feature.title}</h3>
      <p className="text-gray-400 mb-8">{feature.description}</p>
      
      <div className="grid grid-cols-3 gap-4">
        {feature.stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const AdvancedFeatures = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Une Suite{' '}
            <span className="bg-gradient-to-r from-primary via-primary-light to-primary text-transparent bg-clip-text">
              Complète
            </span>
            {' '}d'Outils
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Découvrez un écosystème complet d'outils et de ressources pour créer des designs exceptionnels.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureBlock key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Interactive Demo Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-32 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl" />
          <div className="relative bg-dark-light rounded-2xl p-8 border border-gray-800">
            <h3 className="text-3xl font-display font-bold mb-8 text-center">
              Interface Intuitive et Moderne
            </h3>
            <div className="aspect-video relative rounded-lg overflow-hidden">
              {/* Placeholder for demo video/image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AdvancedFeatures 