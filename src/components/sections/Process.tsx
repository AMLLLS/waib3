'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FiArrowRight } from 'react-icons/fi'

interface Step {
  number: string;
  title: string;
  description: string;
  details: string[];
}

const steps: Step[] = [
  {
    number: "01",
    title: "Fondamentaux du Design",
    description: "Maîtrisez les principes essentiels du design UI/UX et développez votre œil créatif.",
    details: [
      "Théorie des couleurs",
      "Typographie",
      "Composition",
      "Psychologie visuelle"
    ]
  },
  {
    number: "02",
    title: "Outils & Techniques",
    description: "Apprenez à utiliser les outils professionnels et les techniques modernes de design.",
    details: [
      "Figma avancé",
      "Prototypage",
      "Design Systems",
      "Workflow professionnel"
    ]
  },
  {
    number: "03",
    title: "Projets Pratiques",
    description: "Appliquez vos connaissances sur des projets réels et construisez votre portfolio.",
    details: [
      "Cas d'études concrets",
      "Feedback personnalisé",
      "Révisions par les pairs",
      "Certification finale"
    ]
  }
]

interface ProcessStepProps {
  step: Step;
  index: number;
}

const ProcessStep = ({ step, index }: ProcessStepProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="relative"
    >
      {/* Connecting Line */}
      {index < steps.length - 1 && (
        <div className="absolute left-8 top-24 w-0.5 h-32 bg-gradient-to-b from-primary/50 to-transparent" />
      )}

      <div className="flex gap-8">
        {/* Number */}
        <div className="flex-shrink-0 w-16 h-16 bg-dark-light rounded-full border border-primary/20 flex items-center justify-center">
          <span className="text-2xl bg-gradient-to-br from-primary to-primary-light text-transparent bg-clip-text">
            {step.number}
          </span>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-2xl mb-4">{step.title}</h3>
          <p className="text-gray-400 mb-6">{step.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            {step.details.map((detail, i) => (
              <div 
                key={i}
                className="flex items-center space-x-2 text-sm text-gray-300"
              >
                <FiArrowRight className="text-primary" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Process = () => {
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
          <h2 className="text-4xl md:text-6xl mb-6">
            Votre Parcours vers{' '}
            <span className="bg-gradient-to-r from-primary to-[#E5F580] text-transparent bg-clip-text">
              l'Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Un programme structuré pour vous transformer en designer professionnel.
          </p>
        </motion.div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <ProcessStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process 