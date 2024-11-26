'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect, type ReactNode } from 'react'
import { FiMenu } from 'react-icons/fi'

interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [currentPath, setCurrentPath] = useState('/')
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    setCurrentPath(window.location.pathname)
    handleResize()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 0.8,
    restDelta: 0.001
  }

  const easeTransition = {
    duration: 0.4,
    ease: [0.23, 1, 0.32, 1]
  }

  return (
    <div className={`fixed w-full z-50 ${isMobile ? 'top-5' : 'py-4'}`}>
      <div className="container mx-auto px-4">
        <nav className="relative flex items-center justify-between h-16">
          {isMobile && scrolled && (
            <motion.div 
              className="absolute inset-0"
              initial={{ 
                opacity: 0,
                scale: 0.95,
                backdropFilter: 'blur(0px)',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                backgroundColor: 'rgba(18, 18, 20, 0.2)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '0.5px solid rgba(255, 255, 255, 0.1)',
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1],
              }}
            />
          )}

          <motion.div 
            className="relative z-10 w-full flex items-center justify-between"
            animate={{
              paddingLeft: isMobile ? (scrolled ? 20 : 12) : 0,
              paddingRight: isMobile ? (scrolled ? 14 : 8) : 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            <motion.div 
              animate={isMobile && scrolled ? {
                scale: 0.95,
                transition: {
                  duration: 0.8,
                  ease: [0.25, 1, 0.5, 1],
                }
              } : {
                scale: 1
              }}
            >
              {!isMobile ? (
                <AnimatePresence mode="wait">
                  {!scrolled && (
                    <motion.div
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: 1,
                        transition: {
                          duration: 0.8,
                          ease: [0.25, 1, 0.5, 1],
                        }
                      }}
                      exit={{ 
                        opacity: 0,
                        x: -20,
                        scale: 0.9,
                        transition: {
                          duration: 0.8,
                          ease: [0.25, 1, 0.5, 1],
                        }
                      }}
                    >
                      <Link href="/" className="text-[1.7rem] font-aeonik font-black relative">
                        WAIB
                        <motion.div 
                          className="absolute -top-1.5 -right-8 px-2 py-[2px] flex items-center bg-white/[0.05] backdrop-blur-sm border border-white/[0.05] rounded-md"
                          animate={{
                            boxShadow: ['0 0 0px rgba(209,243,74,0)', '0 0 8px rgba(209,243,74,0.2)', '0 0 0px rgba(209,243,74,0)']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <span className="text-[10px] font-aeonik font-normal text-primary leading-[1]">3.0</span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <Link href="/" className="text-[1.7rem] font-aeonik font-black relative">
                  WAIB
                  <motion.div 
                    className="absolute -top-1.5 -right-8 px-2 py-[2px] flex items-center bg-white/[0.05] backdrop-blur-sm border border-white/[0.05] rounded-md"
                    animate={{
                      boxShadow: ['0 0 0px rgba(209,243,74,0)', '0 0 8px rgba(209,243,74,0.2)', '0 0 0px rgba(209,243,74,0)']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-[10px] font-aeonik font-normal text-primary leading-[1]">3.0</span>
                  </motion.div>
                </Link>
              )}
            </motion.div>

            <div className={`absolute left-1/2 -translate-x-1/2 w-full flex justify-center ${isMobile ? 'hidden' : ''}`}>
              <div className="relative">
                <motion.div 
                  className="absolute -inset-y-[7px]"
                  initial={false}
                  animate={{
                    backgroundColor: scrolled ? 'rgba(18, 18, 20, 0.2)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
                    borderRadius: scrolled ? '9999px' : '0',
                    border: scrolled ? '0.5px solid rgba(255, 255, 255, 0.1)' : 'none',
                    left: scrolled ? '-12px' : '0px',
                    right: scrolled ? '-9px' : '0px',
                    scale: scrolled ? 1 : 0.98,
                    opacity: scrolled ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 1, 0.5, 1],
                    scale: {
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1]
                    },
                    opacity: {
                      duration: 0.4,
                      ease: [0.34, 1.56, 0.64, 1]
                    }
                  }}
                />
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4 relative">
                    <NavLink href="/services" isActive={currentPath === '/services'}>Services</NavLink>
                    <NavLink href="/projects" isActive={currentPath === '/projects'}>Projects</NavLink>
                    <NavLink href="/agency" isActive={currentPath === '/agency'}>Agency</NavLink>
                    <NavLink href="/contact" isActive={currentPath === '/contact'}>Contact</NavLink>
                    {scrolled && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent via-gray-700/80 to-transparent" />
                    )}
                  </div>
                  
                  <motion.div
                    animate={{
                      width: scrolled ? 'auto' : 0,
                      marginLeft: scrolled ? '16px' : 0,
                      height: scrolled ? 'auto' : 0,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 1, 0.5, 1],
                      height: {
                        duration: 0.6,
                        ease: [0.34, 1.56, 0.64, 1]
                      }
                    }}
                    className="overflow-hidden flex items-center"
                  >
                    <motion.div
                      animate={{
                        opacity: scrolled ? 1 : 0,
                        scale: scrolled ? 1 : 0.9,
                        x: scrolled ? 0 : -10,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.25, 1, 0.5, 1],
                      }}
                    >
                      <Link 
                        href="/contact"
                        className="relative inline-flex items-center px-6 py-2 text-sm font-aeonik font-bold rounded-full border border-primary/50 hover:border-primary transition-all duration-300 hover:shadow-[0_0_0_4px_rgba(209,243,74,0.1)] whitespace-nowrap group"
                      >
                        <motion.span 
                          className="absolute -inset-[1px] rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={{
                            boxShadow: ['0 0 0px rgba(209,243,74,0.2)', '0 0 20px rgba(209,243,74,0.4)', '0 0 0px rgba(209,243,74,0.2)']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.span 
                          className="bg-gradient-to-r from-primary to-primary-light text-transparent bg-clip-text relative"
                          animate={{
                            textShadow: ['0 0 0px rgba(209,243,74,0)', '0 0 8px rgba(209,243,74,0.5)', '0 0 0px rgba(209,243,74,0)']
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 0.5
                          }}
                        >
                          Rejoindre
                        </motion.span>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>

            <motion.div 
              animate={isMobile && scrolled ? {
                scale: 0.95,
                transition: {
                  duration: 0.8,
                  ease: [0.25, 1, 0.5, 1],
                }
              } : {
                scale: 1
              }}
            >
              {!isMobile ? (
                <AnimatePresence mode="wait">
                  {!scrolled && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: 1,
                        transition: {
                          duration: 0.8,
                          ease: [0.25, 1, 0.5, 1],
                        }
                      }}
                      exit={{ 
                        opacity: 0,
                        x: 20,
                        scale: 0.9,
                        transition: {
                          duration: 0.8,
                          ease: [0.25, 1, 0.5, 1],
                        }
                      }}
                    >
                      <Link 
                        href="/contact"
                        className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-dark font-aeonik font-bold rounded-[20px] transition-colors border border-primary/50 hover:border-primary shadow-lg shadow-primary/20 hover:shadow-primary/40"
                      >
                        Rejoindre
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <button 
                  className="w-12 h-12 bg-primary hover:bg-primary-dark transition-colors rounded-xl flex items-center justify-center"
                  aria-label="Menu"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <FiMenu className="w-6 h-6 text-dark" />
                </button>
              )}
            </motion.div>

            <AnimatePresence>
              {isMobile && isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute top-full right-0 mt-4 w-[280px] bg-dark/20 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-800/50"
                >
                  <div className="relative h-full p-3 flex flex-col">
                    <div className="flex-grow flex flex-col justify-between py-0">
                      <div className="space-y-2">
                        {['Services', 'Projects', 'Agency', 'Contact'].map((item, index) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: index * 0.1,
                              duration: 0.3,
                              ease: [0.23, 1, 0.32, 1]
                            }}
                          >
                            <Link 
                              href={`/${item.toLowerCase()}`}
                              className="flex items-center px-5 py-3.5 text-white font-aeonik font-bold text-lg bg-gray-800/20 transition-all duration-300 rounded-xl group relative overflow-hidden border border-gray-800/50"
                            >
                              <span className="relative group-hover:text-primary transition-colors">
                                {item}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: 0.4,
                          duration: 0.3,
                          ease: [0.23, 1, 0.32, 1]
                        }}
                        className="px-0 mt-4"
                      >
                        <Link 
                          href="/join"
                          className="flex items-center justify-center w-full py-3 bg-primary hover:bg-primary-dark text-dark font-aeonik font-bold text-lg transition-all duration-300 rounded-xl relative overflow-hidden group"
                        >
                          <motion.div 
                            className="absolute inset-0 pointer-events-none"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 4,
                              ease: "easeInOut"
                            }}
                            style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                              width: '50%',
                              filter: 'blur(8px)'
                            }}
                          />

                          <motion.div 
                            className="absolute inset-0 pointer-events-none rounded-xl"
                            animate={{
                              boxShadow: [
                                '0 0 20px 0px rgba(209,243,74,0.2)',
                                '0 0 30px 5px rgba(209,243,74,0.4)',
                                '0 0 25px 2px rgba(209,243,74,0.3)',
                                '0 0 35px 7px rgba(209,243,74,0.5)',
                                '0 0 20px 0px rgba(209,243,74,0.2)',
                              ]
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "easeInOut",
                              times: [0, 0.25, 0.5, 0.75, 1],
                              repeatType: "reverse"
                            }}
                          />

                          <div className="absolute inset-0 bg-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <span className="relative">
                            Rejoindre
                          </span>
                        </Link>
                      </motion.div>
                    </div>

                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-gray-800/50 rounded-full mb-2" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>
      </div>
    </div>
  )
}

const NavLink = ({ href, children, isActive }: NavLinkProps) => (
  <Link 
    href={href}
    className={`relative px-3 py-1.5 text-sm font-aeonik font-bold transition-colors ${
      isActive ? 'text-light' : 'text-gray-400 hover:text-primary'
    }`}
  >
    {children}
  </Link>
)

export default Navbar 