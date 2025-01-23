import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

interface StatItem {
  title: string;
  value: number;
  icon: IconType;
  color: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-dark/50 backdrop-blur rounded-xl p-6 border border-white/5"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-')}/20`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 