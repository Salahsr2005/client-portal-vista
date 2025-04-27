
import React from 'react';
import { 
  GraduationCap, 
  Globe, 
  BookOpen, 
  Building, 
  Briefcase,
  HeartHandshake,
  Plane
} from 'lucide-react';

export type ConsultationType = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

export const consultationTypes: ConsultationType[] = [
  {
    id: 'study-abroad',
    title: 'Study Abroad',
    description: 'Find the perfect university and program abroad',
    icon: <GraduationCap />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'language-programs',
    title: 'Language Programs',
    description: 'Improve your language skills with specialized courses',
    icon: <Globe />,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    id: 'scholarships',
    title: 'Scholarships',
    description: 'Find financial aid opportunities for your studies',
    icon: <BookOpen />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    id: 'housing',
    title: 'Housing Assistance',
    description: 'Get help finding accommodation in your destination',
    icon: <Building />,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    id: 'career',
    title: 'Career Planning',
    description: 'Plan your career path and opportunities after graduation',
    icon: <Briefcase />,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  },
  {
    id: 'visa',
    title: 'Visa Support',
    description: 'Navigate the visa application process with expert help',
    icon: <Plane />,
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  },
  {
    id: 'cultural',
    title: 'Cultural Integration',
    description: 'Tips and resources for adapting to a new culture',
    icon: <HeartHandshake />,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
];

export default consultationTypes;
