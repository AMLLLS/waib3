"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiVideoLine, RiBookOpenLine, RiLightbulbLine, 
  RiStarLine, RiFireLine, RiTrophyLine,
  RiTimeLine, RiBarChartLine, RiArrowRightLine,
  RiPulseLine, RiAwardLine, RiVipCrownLine,
  RiFlashlightLine, RiBrainLine
} from 'react-icons/ri';
import { useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const cardHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 300 }
};

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Header Section with Welcome Message */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-dark-lighter p-4 sm:p-8 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 sm:mb-8">
            <div className="space-y-4 md:space-y-0 md:mb-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 p-0.5">
                    <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden">
                      <img 
                        src="/avatar.jpg" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 sm:w-8 h-6 sm:h-8 bg-primary rounded-lg border-2 border-dark-lighter flex items-center justify-center">
                    <RiVipCrownLine className="text-dark text-base sm:text-lg" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold">Bonjour, Alex</h1>
                    <span className="animate-wave">👋</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-400 mt-0.5 sm:mt-1 line-clamp-1">Prêt à continuer votre apprentissage ?</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 md:hidden">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center space-x-2"
                >
                  <RiBrainLine className="text-lg" />
                  <span className="font-medium text-sm">1,234 XP</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="p-2 rounded-lg bg-primary text-dark flex items-center justify-center"
                >
                  <RiFlashlightLine className="text-lg" />
                </motion.button>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center space-x-2"
              >
                <RiBrainLine className="text-xl" />
                <span className="font-medium">1,234 XP</span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="p-2 rounded-xl bg-primary text-dark"
              >
                <RiFlashlightLine className="text-xl" />
              </motion.button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <motion.div 
              className="bg-dark/50 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-primary/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                  <RiFireLine className="text-primary text-xl sm:text-2xl" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Série actuelle</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-base sm:text-lg">7 jours</p>
                    <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary/20 text-primary">+2</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-dark/50 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-primary/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                  <RiTrophyLine className="text-primary text-xl sm:text-2xl" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Niveau actuel</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-base sm:text-lg">Expert</p>
                    <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary/20 text-primary">Max</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-dark/50 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-primary/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                  <RiPulseLine className="text-primary text-xl sm:text-2xl" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Progression</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-base sm:text-lg">+15%</p>
                    <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary/20 text-primary">↑</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="bg-gradient-to-r from-primary/10 to-transparent rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <RiAwardLine className="text-xl sm:text-2xl text-primary flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold">Prochain objectif</h3>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-primary font-medium">3/5</span>
                <span className="text-gray-400">complétés</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-gray-200 text-sm sm:text-base line-clamp-1">Formation "Advanced UI Patterns"</p>
                <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary whitespace-nowrap self-start sm:self-center">En cours</span>
              </div>
              <div className="h-2 bg-dark rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary/5 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
      >
        {[
          { 
            title: 'Formations suivies', 
            value: '12/24', 
            icon: RiVideoLine, 
            color: 'bg-primary',
            change: '+2 cette semaine',
            changeType: 'positive',
            detail: '50% complété'
          },
          { 
            title: 'Ressources sauvegardées', 
            value: '45', 
            icon: RiBookOpenLine, 
            color: 'bg-primary',
            change: '+5 cette semaine',
            changeType: 'positive',
            detail: '12 non lues'
          },
          { 
            title: 'Tutoriels complétés', 
            value: '18', 
            icon: RiLightbulbLine, 
            color: 'bg-primary',
            change: '+3 cette semaine',
            changeType: 'positive',
            detail: '85% de réussite'
          },
          { 
            title: 'Points XP', 
            value: '2,450', 
            icon: RiStarLine, 
            color: 'bg-primary',
            change: '+350 points',
            changeType: 'positive',
            detail: 'Niveau 8'
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={cardHover}
            className="group relative bg-dark/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl transition-opacity group-hover:opacity-100 opacity-0" />
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
              <stat.icon className="text-2xl text-dark" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold mb-2 text-white">{stat.value}</p>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </p>
              <p className="text-xs text-gray-500">{stat.detail}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-6 lg:gap-8">
        {/* Progress Section */}
        <motion.div 
          variants={item}
          className="bg-dark/50 backdrop-blur-sm border border-white/5 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Progression globale</h2>
              <p className="text-sm text-gray-400">Suivez votre évolution</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="sm:hidden px-4 py-2 rounded-lg bg-dark/50 text-gray-400 text-sm font-medium border border-gray-800 focus:outline-none focus:border-primary"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
              <div className="hidden sm:flex bg-dark/50 rounded-lg p-1">
                {['week', 'month', 'year'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedTimeframe === timeframe
                        ? 'bg-primary text-dark shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-dark'
                    }`}
                  >
                    {timeframe === 'week' ? 'Semaine' : timeframe === 'month' ? 'Mois' : 'Année'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {[
              { name: 'Web Design', progress: 75, color: 'from-primary/80 to-primary-dark/80', icon: RiVideoLine },
              { name: 'UI/UX', progress: 60, color: 'from-primary/70 to-primary-dark/70', icon: RiBookOpenLine },
              { name: 'Développement Front-end', progress: 85, color: 'from-primary/60 to-primary-dark/60', icon: RiLightbulbLine },
            ].map((skill, index) => (
              <div key={index} className="group">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <skill.icon className="text-gray-400" />
                    <span className="font-medium text-white">{skill.name}</span>
                  </div>
                  <span className="text-gray-400">{skill.progress}%</span>
                </div>
                <div className="h-3 bg-dark/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative group-hover:shadow-lg transition-shadow duration-300`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Section */}
        <motion.div 
          variants={item}
          className="bg-dark/50 backdrop-blur-sm border border-white/5 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Activité récente</h2>
              <p className="text-sm text-gray-400">Vos dernières actions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Voir tout</span>
              <RiArrowRightLine />
            </motion.button>
          </div>

          <div className="space-y-4">
            {[
              { 
                title: 'Formation UI/UX avancée', 
                time: 'Il y a 2 heures',
                icon: RiVideoLine,
                color: 'bg-gradient-to-br from-white/10 to-white/5',
                detail: 'Chapitre 3/8'
              },
              { 
                title: 'Nouveau tutoriel complété', 
                time: 'Il y a 5 heures',
                icon: RiLightbulbLine,
                color: 'bg-gradient-to-br from-white/10 to-white/5',
                detail: '100% réussi'
              },
              { 
                title: 'Badge "Expert" débloqué', 
                time: 'Il y a 1 jour',
                icon: RiTrophyLine,
                color: 'bg-gradient-to-br from-white/10 to-white/5',
                detail: 'Nouveau niveau'
              },
              { 
                title: 'Ressource ajoutée', 
                time: 'Il y a 2 jours',
                icon: RiBookOpenLine,
                color: 'bg-gradient-to-br from-white/10 to-white/5',
                detail: 'UI Kit Premium'
              },
            ].map((activity, index) => (
              <motion.div 
                key={index} 
                className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-dark/50 transition-all duration-300"
                whileHover={{ x: 8 }}
              >
                <div className={`w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <activity.icon className="text-xl text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-white truncate">{activity.title}</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{activity.detail}</span>
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <RiArrowRightLine className="text-gray-400" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 