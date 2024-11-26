'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

const testimonials = [
  {
    content: "La meilleure plateforme pour apprendre le design web. Les cours sont structurés de manière progressive et le contenu est toujours à jour.",
    author: "Marie L.",
    role: "UI/UX Designer",
    company: "Studio Digital"
  },
  {
    content: "J'ai pu passer de débutant à designer professionnel en seulement 6 mois. La qualité des ressources et le support de la communauté sont exceptionnels.",
    author: "Thomas R.",
    role: "Freelance Designer",
    company: "Indépendant"
  },
  {
    content: "Une approche unique qui combine théorie et pratique. Les projets réels m'ont permis de construire un portfolio solide.",
    author: "Sophie M.",
    role: "Creative Director",
    company: "AgenceWeb"
  }
]

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-dark-light/30 backdrop-blur-sm p-8 rounded-2xl relative border border-gray-800/50"
    >
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-dark">
        <span className="text-2xl">"</span>
      </div>
      <p className="text-lg mb-6">{testimonial.content}</p>
      <div className="flex items-center">
        <div className="ml-4">
          <p className="font-bold">{testimonial.author}</p>
          <p className="text-sm text-gray-400">{testimonial.role} @ {testimonial.company}</p>
        </div>
      </div>
    </motion.div>
  )
}

const Testimonials = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ce que disent nos{' '}
            <span className="bg-gradient-to-r from-primary via-primary-light to-primary text-transparent bg-clip-text">
              Étudiants
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials 