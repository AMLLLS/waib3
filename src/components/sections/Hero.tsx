'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiUsers, FiPlayCircle, FiMove, FiZap, FiKey } from 'react-icons/fi'

const words = ["commerçants", "entreprises", "artisans", "marques", "services", "micro-entreprises", "organismes", "agences", "entrepreneurs"]

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
    text: "Débutants à avancés"
  },
  {
    icon: <FiPlayCircle className="w-5 h-5 sm:w-5 sm:h-5" />,
    text: "Modules de formation"
  },
  {
    icon: <FiMove className="w-5 h-5 sm:w-5 sm:h-5" />,
    text: "Templates"
  },
  {
    icon: <FiZap className="w-5 h-5 sm:w-5 sm:h-5" />,
    text: "Prompts"
  },
  {
    icon: <FiKey className="w-5 h-5 sm:w-5 sm:h-5" />,
    text: "Lifetime"
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
    <section className="relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden pt-28 sm:pt-20 md:pt-20 lg:pt-12 xl:pt-10">
      <motion.div 
        className="relative z-10 container mx-auto px-4 text-center sm:mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative inline-flex items-center justify-center px-4 py-1.5 sm:py-2 lg:px-3 lg:py-1 mb-6 backdrop-blur-xl bg-white/[0.05] rounded-full"
          >
            <div className="absolute inset-0 rounded-full border border-primary animate-[pulse-glow_4s_ease-in-out_infinite] shadow-[0_0_12px_rgba(209,243,74,0.4)]" />
            <span className="text-[0.7rem] sm:text-xs md:text-sm lg:text-[0.7rem] xl:text-[0.75rem] font-poppins text-white/90 tracking-wide relative z-10">
              OFFRE DE LANCEMENT WAIB 3.0 : <span className="font-bold">-30%</span>
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
              className="flex items-center justify-center gap-x-4 mb-2 sm:mb-4"
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
                des sites/apps pour des
              </motion.span>
              
              {/* Conteneur du mot qui change */}
              <div className="relative h-[4rem] sm:h-[5rem] md:h-[6rem] lg:h-[7rem] xl:h-[8rem] w-full flex justify-center mb-0 sm:mb-2 lg:mb-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={words[wordIndex]}
                    className="absolute flex items-center justify-center h-full"
                    initial={{ 
                      opacity: 0,
                      y: 40,
                      scale: 0.9,
                      filter: "blur(8px)"
                    }}
                    animate={{ 
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)"
                    }}
                    exit={{ 
                      opacity: 0,
                      y: -40,
                      scale: 0.9,
                      filter: "blur(8px)"
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    <span className="text-[clamp(3rem,10vw,4rem)] sm:text-[5rem] md:text-[6rem] lg:text-[6.5rem] xl:text-[7rem] whitespace-nowrap block text-primary px-6 py-2 sm:py-2 md:py-2 lg:py-3 xl:py-2 leading-none font-serathine font-normal [font-weight:400] [text-shadow:0_0_20px_rgba(209,243,74,0.3)]">
                      {words[wordIndex]}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.h1>
        </div>
        
        <motion.div 
          className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-4 mt-12 font-aeonik leading-relaxed flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-[clamp(1rem,5.8vw,1.5rem)] sm:text-[2.2rem] md:text-[2.6rem] lg:text-[2.4rem] xl:text-[2.5rem] font-bold sm:mb-4">
            Sans compétences et grâce à l'IA,
          </p>
          <p className="text-[clamp(0.75rem,3.8vw,1.1rem)] sm:text-base md:text-lg lg:text-[0.85rem] xl:text-[0.9rem] text-gray-300 max-w-2xl mx-auto">
            devenez un expert indépendant en création de sites web
            et d'applications complexes, avec 0 budget, et accessible à tous de débutants à experts.
          </p>
        </motion.div>

        {/* Widget de features amélioré */}
        <motion.div
          className="inline-block mx-auto mt-12 sm:mt-8 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* CTA Mobile */}
          <div className="sm:hidden mb-8">
            <p className="text-[0.9rem] font-bold text-white/80 mb-3">+1500 offres à pourvoir en ligne</p>
            <motion.button
              className="relative group bg-gradient-to-br from-primary via-primary/90 to-primary/80 px-8 py-3 rounded-2xl overflow-hidden shadow-lg shadow-primary/20"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-45 -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
              <div className="relative flex flex-col items-center -my-1">
                <div className="flex items-center gap-3">
                  <span className="text-dark font-bold text-[1.2rem]">Commencer maintenant</span>
                  <motion.svg 
                    className="w-5 h-5 fill-dark"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    viewBox="0 0 16 16"
                  >
                    <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </motion.svg>
                </div>
                <span className="text-[0.65rem] text-dark/80 -mt-[0.325rem]">80€ à vie au lieu de 149€</span>
              </div>
            </motion.button>
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-y-4 sm:gap-0 px-6 sm:px-0 sm:backdrop-blur-sm sm:bg-white/[0.02] sm:rounded-2xl sm:border sm:border-white/[0.05] sm:p-2"
            whileHover={{
              boxShadow: "0 0 20px rgba(255,255,255,0.05)",
              transition: { duration: 0.3 }
            }}
          >
            {/* Première ligne sur mobile (2 premiers éléments) */}
            <div className="flex justify-center gap-6 w-full sm:hidden">
              {features.slice(0, 2).map((feature, index) => (
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

            {/* Deuxième ligne sur mobile (3 derniers éléments) */}
            <div className="flex justify-center gap-8 w-full sm:hidden">
              {features.slice(2).map((feature, index) => (
                <motion.div 
                  key={index + 2}
                  className="flex items-center gap-3 font-aeonik font-normal"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 2) * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <motion.span 
                    className="text-white"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: (index + 2) * 0.2 }}
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

        {/* Vidéo Hero */}
        <motion.div
          className="relative w-full max-w-4xl mx-auto mt-16 sm:mt-24 px-1 sm:px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="relative rounded-[20px] overflow-hidden"
            whileInView={{
              boxShadow: [
                '0 -10px 50px -15px rgba(255, 255, 255, 0.1)',
                '0 -10px 50px -12px rgba(255, 255, 255, 0.15)',
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            >
              <source 
                src="https://cdn.prod.website-files.com/66c74b953957211a234767e2/66e7f5361965c0ae8138e00b_comp_def_2-transcode.mp4" 
                type="video/mp4" 
              />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
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