'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { FiMonitor, FiCode, FiLayout, FiUsers, FiBook, FiAward } from 'react-icons/fi'

const features = [
  {
    icon: <FiMonitor className="w-8 h-8" />,
    title: "Interface Immersive",
    description: "Une expérience d'apprentissage unique avec des animations fluides et un design moderne."
  },
  {
    icon: <FiCode className="w-8 h-8" />,
    title: "Ressources Exclusives",
    description: "Accédez à une bibliothèque complète de ressources, templates et outils de design."
  },
  {
    icon: <FiLayout className="w-8 h-8" />,
    title: "Projets Pratiques",
    description: "Apprenez en pratiquant avec des projets réels et des cas d'études concrets."
  },
  {
    icon: <FiUsers className="w-8 h-8" />,
    title: "Communauté Active",
    description: "Rejoignez une communauté de designers passionnés et échangez vos expériences."
  },
  {
    icon: <FiBook className="w-8 h-8" />,
    title: "Formation Continue",
    description: "Des contenus régulièrement mis à jour pour rester à la pointe des tendances."
  },
  {
    icon: <FiAward className="w-8 h-8" />,
    title: "Certification",
    description: "Obtenez une certification reconnue pour valoriser vos compétences."
  }
]

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-dark-light/30 backdrop-blur-sm p-6 rounded-2xl hover:bg-gradient-to-br from-dark-light/40 to-primary/5 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
        {feature.icon}
      </div>
      <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
      <p className="text-gray-400">{feature.description}</p>
    </motion.div>
  )
}

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Une Formation{' '}
            <span className="bg-gradient-to-r from-primary to-[#E5F580] text-transparent bg-clip-text">
              Complète
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Découvrez tous les outils et ressources nécessaires pour devenir un designer web professionnel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features 