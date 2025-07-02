import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, GraduationCap, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Destination } from '@/hooks/useDestinations';

interface DestinationStatsProps {
  destinations: Destination[];
}

export const DestinationStats: React.FC<DestinationStatsProps> = ({ destinations }) => {
  const stats = [
    { 
      icon: Globe, 
      label: 'Destinations', 
      value: destinations.length.toString(), 
      gradient: 'from-blue-500 to-cyan-500',
      bgClass: 'bg-blue-500/10'
    },
    { 
      icon: GraduationCap, 
      label: 'Programs', 
      value: '500+', 
      gradient: 'from-purple-500 to-pink-500',
      bgClass: 'bg-purple-500/10'
    },
    { 
      icon: Users, 
      label: 'Students Placed', 
      value: '1,200+', 
      gradient: 'from-green-500 to-emerald-500',
      bgClass: 'bg-green-500/10'
    },
    { 
      icon: TrendingUp, 
      label: 'Avg Success Rate', 
      value: destinations.length > 0 
        ? Math.round(destinations.reduce((acc, dest) => acc + (dest.admission_success_rate || 0), 0) / destinations.length) + '%'
        : '87%',
      gradient: 'from-orange-500 to-red-500',
      bgClass: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="group"
        >
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-lg hover:bg-card transition-all duration-300 overflow-hidden">
            <CardContent className="p-6 text-center relative">
              {/* Background Pattern */}
              <div className={`absolute inset-0 ${stat.bgClass} opacity-5`} />
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Value */}
              <div className="text-3xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-colors duration-300" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};