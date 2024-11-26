'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Parfait pour débuter et explorer les fondamentaux du design.",
    features: [
      "Accès aux cours fondamentaux",
      "Ressources de base",
      "Communauté d'entraide",
      "Mises à jour mensuelles",
    ]
  },
  {
    name: "Pro",
    price: "79",
    description: "Pour les designers qui veulent passer au niveau supérieur.",
    features: [
      "Tous les avantages Starter",
      "Projets avancés",
      "Templates premium",
      "Support prioritaire",
      "Workshops mensuels",
      "Certification officielle"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "299",
    description: "Solution complète pour les équipes et les studios.",
    features: [
      "Tous les avantages Pro",
      "Licence multi-utilisateurs",
      "Formation personnalisée",
      "API access",
      "Support dédié 24/7",
      "Consulting mensuel"
    ]
  }
]

const PricingCard = ({ plan, index }: { plan: typeof plans[0], index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-8 rounded-2xl ${
        plan.popular 
          ? 'bg-gradient-to-br from-primary/20 via-primary-light/20 to-transparent border-primary' 
          : 'bg-dark-light border-gray-800'
      } border`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-2 bg-primary text-dark text-sm font-semibold rounded-full">
            Plus Populaire
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl mb-2">{plan.name}</h3>
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl font-bold">{plan.price}€</span>
          <span className="text-gray-400 ml-2">/mois</span>
        </div>
        <p className="text-gray-400">{plan.description}</p>
      </div>

      <ul className="space-y-4">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center">
            <FiCheck className="text-primary mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full mt-8 py-4 rounded-lg font-semibold transition-colors ${
          plan.popular
            ? 'bg-primary hover:bg-primary-dark text-dark'
            : 'bg-dark hover:bg-dark-light border border-gray-800'
        }`}
      >
        Commencer maintenant
      </button>
    </motion.div>
  )
}

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 bg-dark relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl mb-6">
            Choisissez votre{' '}
            <span className="bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
              Plan
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Des formules adaptées à tous les niveaux, de débutant à expert.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing 