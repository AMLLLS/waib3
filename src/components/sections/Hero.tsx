'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiUsers, FiClock, FiLayers, FiZap, FiShield } from 'react-icons/fi'

const words = ["commerçants", "entreprises", "artisans", "marques", "services", "SaaS"]

// Hook personnalisé pour gérer la taille de l'écran
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// Ajout des styles pour le dégradé animé
const gradientAnimation = {
  background: `
    linear-gradient(
      60deg,
      rgba(209,243,74,0.3) 0%,
      rgba(255,214,0,0.3) 25%,
      rgba(209,243,74,0.3) 50%,
      rgba(255,214,0,0.3) 75%,
      rgba(209,243,74,0.3) 100%
    )
  `,
  backgroundSize: '200% 200%',
  animation: 'moveGradient 8s linear infinite',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

const features = [
  {
    icon: <FiUsers className="w-5 h-5 sm:w-5 sm:h-5" />,
    text: "Débutants"
  },
  {
    icon: <FiClock className="w-5 h-5 sm:w-5 sm:h-5" />,
    text: "2 mois"
  },
  {
    icon: <FiLayers className="w-5 h-5 sm:w-5 sm:h-5" />,
    text: "10 Projets"
  },
  {
    icon: <FiZap className="w-5 h-5 sm:w-5 sm:h-5" />,
    text: "À vie"
  },
  {
    icon: <FiShield className="w-5 h-5 sm:w-5 sm:h-5" />,
    text: "Support"
  }
]

const Hero = () => {
  const { width } = useWindowSize()
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden pt-32 sm:pt-2 md:pt-2 lg:pt-2">
      <motion.div 
        className="relative z-10 container mx-auto px-4 text-center sm:mt-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center px-4 py-1.5 sm:py-2 mb-6 backdrop-blur-xl bg-white/[0.05] border border-white/[0.05] rounded-full"
          >
            <span className="text-xs sm:text-sm font-medium text-white">
              OFFRE DE LANCEMENT : -30%
            </span>
          </motion.div>

          <motion.h1 
            className="flex flex-col items-center font-aeonik leading-[0.9] font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Première phrase avec effet de glow */}
            <motion.div 
              className="flex items-center justify-center gap-x-4 mb-4"
              animate={{
                textShadow: [
                  '0 0 0px rgba(255,255,255,0)',
                  '0 0 10px rgba(255,255,255,0.2)',
                  '0 0 0px rgba(255,255,255,0)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-[3.2rem] sm:text-[3.2rem] md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] whitespace-nowrap">
                Créez & vendez
              </span>
            </motion.div>

            {/* Deuxième phrase et mots changeants */}
            <div className="flex flex-col items-center justify-center">
              {/* "des sites pour des" avec effet de fade */}
              <motion.span 
                className="text-[1.8rem] sm:text-[2.4rem] md:text-4xl lg:text-[3.2rem] xl:text-[4rem] whitespace-nowrap mb-2 sm:mb-6 lg:mb-6"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                des sites pour des
              </motion.span>
              
              {/* Conteneur du mot qui change */}
              <div className="relative h-[2.8rem] sm:h-[3.2rem] md:h-[3.75rem] lg:text-[5.5rem] xl:h-[6.5rem] w-full flex justify-center mb-2 sm:mb-6 lg:mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={words[wordIndex]}
                    className="absolute flex items-center justify-center backdrop-blur-xl bg-dark/20 border-[3px] border-dashed border-gray-800 rounded-2xl h-full top-[4px] lg:top-[8px] xl:top-[4px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                  >
                    <span className="text-[2.8rem] sm:text-[3.2rem] md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] whitespace-nowrap block text-primary px-6 py-6 sm:py-5 md:py-6 lg:py-8 xl:py-6 -translate-y-[4px] lg:-translate-y-[12px] xl:-translate-y-[16px] leading-none">
                      {words[wordIndex]}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* "sans compétences" avec effet de fade */}
              <motion.span 
                className="text-[1.8rem] sm:text-[2.4rem] md:text-4xl lg:text-[3.2rem] xl:text-[4rem] whitespace-nowrap"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2 // Décalé par rapport au texte du haut
                }}
              >
                sans compétences
              </motion.span>
            </div>
          </motion.h1>
        </div>
        
        <motion.p 
          className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-4 mt-12 font-aeonik font-normal leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          WAIB 3.0 vous offre un plan unique pour devenir un expert indépendant en création de sites web
          et d'applications complexes, pour débutants ou experts, à partir de 0€.
        </motion.p>

        {/* Widget de features amélioré */}
        <motion.div
          className="inline-block mx-auto mt-12 sm:mt-8 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-y-4 sm:gap-0 px-6 sm:px-0 sm:backdrop-blur-sm sm:bg-white/[0.02] sm:rounded-2xl sm:border sm:border-white/[0.05] sm:p-2"
            whileHover={{
              boxShadow: "0 0 20px rgba(255,255,255,0.05)",
              transition: { duration: 0.3 }
            }}
          >
            {/* Première ligne sur mobile (3 premiers éléments) */}
            <div className="flex justify-between w-full sm:hidden">
              {features.slice(0, 3).map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3 font-aeonik font-normal"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <motion.span 
                    className="text-white"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <motion.span 
                    className="text-sm sm:text-[13px] text-white whitespace-nowrap"
                    whileHover={{ color: "#D1F34A" }}
                  >
                    {feature.text}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Deuxième ligne sur mobile (2 derniers éléments) */}
            <div className="flex justify-center gap-12 w-full sm:hidden">
              {features.slice(3).map((feature, index) => (
                <motion.div 
                  key={index + 3}
                  className="flex items-center gap-3 font-aeonik font-normal"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 3) * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <motion.span 
                    className="text-white"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: (index + 3) * 0.2 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <motion.span 
                    className="text-sm sm:text-[13px] text-white whitespace-nowrap"
                    whileHover={{ color: "#D1F34A" }}
                  >
                    {feature.text}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Version desktop */}
            <div className="hidden sm:flex">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className={`
                    flex items-center gap-3
                    px-4 py-2 
                    font-aeonik font-normal
                    ${index !== features.length - 1 ? 'border-r border-gray-800' : ''}
                  `}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <motion.span 
                    className="text-white"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <motion.span 
                    className="text-sm sm:text-[13px] text-white whitespace-nowrap"
                    whileHover={{ color: "#D1F34A" }}
                  >
                    {feature.text}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Ajout des keyframes pour l'animation du dégradé */}
      <style jsx global>{`
        @keyframes moveGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  )
}

export default Hero 