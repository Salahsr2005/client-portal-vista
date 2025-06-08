
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  BookOpen, 
  Award,
  Trophy,
  Users,
  Clock
} from 'lucide-react';

interface LevelSelectionProps {
  data: any;
  updateData: (data: any) => void;
  onValidation: (isValid: boolean) => void;
}

const STUDY_LEVELS = [
  {
    id: 'Bachelor',
    title: 'Bachelor\'s Degree',
    subtitle: 'Undergraduate Program',
    description: 'First university degree, typically 3-4 years',
    icon: BookOpen,
    duration: '3-4 years',
    prerequisites: 'High school diploma',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  {
    id: 'Master',
    title: 'Master\'s Degree',
    subtitle: 'Graduate Program',
    description: 'Advanced degree building on bachelor\'s studies',
    icon: GraduationCap,
    duration: '1-2 years',
    prerequisites: 'Bachelor\'s degree',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  {
    id: 'PhD',
    title: 'PhD / Doctorate',
    subtitle: 'Research Program',
    description: 'Highest academic degree with original research',
    icon: Award,
    duration: '3-6 years',
    prerequisites: 'Master\'s degree',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800'
  }
];

export function LevelSelectionStep({ data, updateData, onValidation }: LevelSelectionProps) {
  const selectedLevel = data.level;

  useEffect(() => {
    onValidation(!!selectedLevel);
  }, [selectedLevel, onValidation]);

  const handleLevelSelect = (level: string) => {
    updateData({ level });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">What level of study are you interested in?</h2>
        <p className="text-muted-foreground text-lg">
          Choose the academic level that matches your educational goals
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {STUDY_LEVELS.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                selectedLevel === level.id 
                  ? `ring-2 ring-offset-2 ring-indigo-500 ${level.bgColor} ${level.borderColor}` 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleLevelSelect(level.id)}
            >
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${level.color}`}>
                    <level.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-1">{level.title}</h3>
                    <Badge variant="outline" className="mb-2">
                      {level.subtitle}
                    </Badge>
                    <p className="text-muted-foreground text-sm mb-4">
                      {level.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{level.duration}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span>{level.prerequisites}</span>
                    </div>
                  </div>

                  {selectedLevel === level.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex justify-center"
                    >
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedLevel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
            <Users className="w-5 h-5" />
            <span className="font-medium">
              Great choice! {selectedLevel} programs are popular among international students.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
