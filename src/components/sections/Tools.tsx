'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { FiCode, FiLayout, FiCommand, FiCpu } from 'react-icons/fi'

const tools = [
  {
    icon: <FiLayout className="w-8 h-8" />,
    title: "Design System",
    description: "Une collection complète de composants UI et de patterns de design.",
    features: [
      "Composants réutilisables",
      "Styles prédéfinis",
      "Documentation détaillée",
      "Mises à jour régulières"
    ]
  },
  {
    icon: <FiCommand className="w-8 h-8" />,
    title: "IA Assistant",
    description: "Un assistant intelligent pour accélérer votre workflow de design.",
    features: [
      "Génération de code",
      "Suggestions de design",
      "Optimisation automatique",
      "Analyse de performance"
    ]
  },
  {
    icon: <FiCode className="w-8 h-8" />,
    title: "Code Generator",
    description: "Transformez vos designs en code propre et optimisé.",
    features: [
      "Export multi-plateformes",
      "Code personnalisable",
      "Intégration facile",
      "Support responsive"
    ]
  },
  {
    icon: <FiCpu className="w-8 h-8" />,
    title: "Analytics",
    description: "Analysez et optimisez vos designs avec des données précises.",
    features: [
      "Métriques en temps réel",
      "Rapports détaillés",
      "Tests A/B",
      "Insights utilisateurs"
    ]
  }
]

const ToolCard = ({ tool, index }: { tool: typeof tools[0], index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-8 rounded-2xl bg-dark-light border border-gray-800 hover:border-primary/50 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-light/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
      
      <div className="relative">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
          {tool.icon}
        </div>

        <h3 className="text-2xl font-display font-bold mb-4">{tool.title}</h3>
        <p className="text-gray-400 mb-6">{tool.description}</p>

        <ul className="space-y-2">
          {tool.features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm text-gray-300">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <button className="text-primary hover:text-primary-dark transition-colors font-semibold">
            En savoir plus →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const Tools = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Des Outils{' '}
            <span className="bg-gradient-to-r from-primary via-primary-light to-primary text-transparent bg-clip-text">
              Puissants
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Exploitez nos outils avancés pour créer des designs exceptionnels et optimiser votre workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <ToolCard key={index} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Tools 