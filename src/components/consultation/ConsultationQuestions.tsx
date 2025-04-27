
import React from 'react';

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multi' | 'range' | 'text' | 'boolean';
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface ConsultationSection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const studyAbroadQuestions: ConsultationSection[] = [
  {
    id: 'academic-preferences',
    title: 'Academic Preferences',
    description: 'Tell us about your academic background and preferences',
    questions: [
      {
        id: 'study-level',
        text: 'What level of study are you interested in?',
        type: 'single',
        options: [
          { value: 'bachelor', label: 'Bachelor\'s Degree' },
          { value: 'master', label: 'Master\'s Degree' },
          { value: 'phd', label: 'PhD/Doctorate' },
          { value: 'certificate', label: 'Certificate/Diploma' },
          { value: 'language', label: 'Language Course' }
        ],
        required: true
      },
      {
        id: 'study-field',
        text: 'What field of study are you interested in?',
        type: 'single',
        options: [
          { value: 'business', label: 'Business & Management' },
          { value: 'engineering', label: 'Engineering & Technology' },
          { value: 'medicine', label: 'Medicine & Health Sciences' },
          { value: 'arts', label: 'Arts & Humanities' },
          { value: 'science', label: 'Natural Sciences' },
          { value: 'social', label: 'Social Sciences' },
          { value: 'law', label: 'Law' },
          { value: 'computer', label: 'Computer Science & IT' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'duration',
        text: 'What is your preferred program duration?',
        type: 'single',
        options: [
          { value: 'semester', label: 'Short-term (semester)' },
          { value: 'year', label: '1 year' },
          { value: 'two_years', label: '2 years' },
          { value: 'full', label: 'Full program (3+ years)' },
        ],
        required: true
      },
      {
        id: 'start-date',
        text: 'When do you want to start your studies?',
        type: 'single',
        options: [
          { value: 'immediate', label: 'As soon as possible' },
          { value: 'next_semester', label: 'Next semester' },
          { value: 'next_year', label: 'Next academic year' },
          { value: 'planning', label: 'Just planning for now' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'location-preferences',
    title: 'Location Preferences',
    description: 'Help us understand where you\'d like to study',
    questions: [
      {
        id: 'preferred-countries',
        text: 'Which countries are you interested in?',
        type: 'multi',
        options: [
          { value: 'france', label: 'France' },
          { value: 'germany', label: 'Germany' },
          { value: 'spain', label: 'Spain' },
          { value: 'italy', label: 'Italy' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'netherlands', label: 'Netherlands' },
          { value: 'belgium', label: 'Belgium' },
          { value: 'poland', label: 'Poland' },
          { value: 'portugal', label: 'Portugal' },
          { value: 'any', label: 'Open to any European country' }
        ],
        required: true
      },
      {
        id: 'city-size',
        text: 'What size of city do you prefer?',
        type: 'single',
        options: [
          { value: 'large', label: 'Large city (metropolitan area)' },
          { value: 'medium', label: 'Medium-sized city' },
          { value: 'small', label: 'Small city or town' },
          { value: 'any', label: 'No preference' }
        ],
        required: false
      },
      {
        id: 'climate',
        text: 'Do you have any climate preferences?',
        type: 'multi',
        options: [
          { value: 'warm', label: 'Warm/Mediterranean' },
          { value: 'moderate', label: 'Moderate/Temperate' },
          { value: 'cold', label: 'Cooler climate' },
          { value: 'any', label: 'No preference' }
        ],
        required: false
      }
    ]
  },
  {
    id: 'language-preferences',
    title: 'Language & Cultural Factors',
    description: 'Tell us about your language abilities and preferences',
    questions: [
      {
        id: 'language-preference',
        text: 'What language would you prefer to study in?',
        type: 'single',
        options: [
          { value: 'english', label: 'English' },
          { value: 'french', label: 'French' },
          { value: 'german', label: 'German' },
          { value: 'spanish', label: 'Spanish' },
          { value: 'italian', label: 'Italian' },
          { value: 'dutch', label: 'Dutch' },
          { value: 'polish', label: 'Polish' },
          { value: 'portuguese', label: 'Portuguese' },
          { value: 'any', label: 'No preference' }
        ],
        required: true
      },
      {
        id: 'language-proficiency',
        text: 'What is your proficiency in your preferred study language?',
        type: 'single',
        options: [
          { value: 'native', label: 'Native speaker' },
          { value: 'fluent', label: 'Fluent' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'beginner', label: 'Beginner' },
          { value: 'none', label: 'No knowledge yet' }
        ],
        required: true
      },
      {
        id: 'cultural-factors',
        text: 'Any specific cultural factors important to you?',
        type: 'multi',
        options: [
          { value: 'religious', label: 'Access to religious facilities' },
          { value: 'dietary', label: 'Special dietary requirements' },
          { value: 'cultural_community', label: 'Having a community from my country' },
          { value: 'none', label: 'No specific requirements' }
        ],
        required: false
      }
    ]
  },
  {
    id: 'financial-considerations',
    title: 'Financial Considerations',
    description: 'Help us understand your budget and financial needs',
    questions: [
      {
        id: 'budget',
        text: 'What is your annual budget for tuition and living expenses?',
        type: 'single',
        options: [
          { value: 'under_5000', label: 'Under €5,000' },
          { value: '5000_10000', label: '€5,000 - €10,000' },
          { value: '10000_15000', label: '€10,000 - €15,000' },
          { value: '15000_20000', label: '€15,000 - €20,000' },
          { value: '20000_30000', label: '€20,000 - €30,000' },
          { value: 'above_30000', label: 'Above €30,000' }
        ],
        required: true
      },
      {
        id: 'scholarship',
        text: 'Are you interested in scholarship opportunities?',
        type: 'boolean',
        required: true
      },
      {
        id: 'work-study',
        text: 'Do you plan to work while studying?',
        type: 'single',
        options: [
          { value: 'yes_full', label: 'Yes, I need full-time work' },
          { value: 'yes_part', label: 'Yes, part-time only' },
          { value: 'maybe', label: 'Maybe, if available' },
          { value: 'no', label: 'No, I don\'t plan to work' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'personal-details',
    title: 'Personal Details',
    description: 'Share your details so we can provide personalized recommendations',
    questions: [
      {
        id: 'current-education',
        text: 'What is your highest level of education completed?',
        type: 'single',
        options: [
          { value: 'high_school', label: 'High School' },
          { value: 'bachelors', label: 'Bachelor\'s Degree' },
          { value: 'masters', label: 'Master\'s Degree' },
          { value: 'phd', label: 'PhD/Doctorate' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'current-occupation',
        text: 'What is your current occupation?',
        type: 'single',
        options: [
          { value: 'student', label: 'Student' },
          { value: 'employed', label: 'Employed' },
          { value: 'unemployed', label: 'Unemployed' },
          { value: 'other', label: 'Other' }
        ],
        required: true
      },
      {
        id: 'special-needs',
        text: 'Do you have any accessibility requirements or special needs?',
        type: 'text',
        placeholder: 'Please specify any requirements or leave blank if none',
        required: false
      }
    ]
  }
];

export const languageProgramQuestions: ConsultationSection[] = [
  // We'd define similar question structure for language programs
  {
    id: 'language-goals',
    title: 'Language Learning Goals',
    description: 'Tell us about your language learning objectives',
    questions: [
      // Questions would go here
      {
        id: 'target-language',
        text: 'Which language do you want to learn?',
        type: 'single',
        options: [
          { value: 'french', label: 'French' },
          { value: 'german', label: 'German' },
          { value: 'spanish', label: 'Spanish' },
          { value: 'italian', label: 'Italian' },
          { value: 'dutch', label: 'Dutch' },
          { value: 'polish', label: 'Polish' },
          { value: 'portuguese', label: 'Portuguese' }
        ],
        required: true
      }
    ]
  }
];

export const scholarshipQuestions: ConsultationSection[] = [
  // Scholarship-specific questions
  {
    id: 'scholarship-requirements',
    title: 'Scholarship Eligibility',
    description: 'Help us determine which scholarships you may qualify for',
    questions: [
      {
        id: 'academic-achievements',
        text: 'What is your GPA or academic standing?',
        type: 'single',
        options: [
          { value: 'excellent', label: 'Excellent (3.7-4.0 GPA or equivalent)' },
          { value: 'very_good', label: 'Very good (3.3-3.6 GPA or equivalent)' },
          { value: 'good', label: 'Good (3.0-3.2 GPA or equivalent)' },
          { value: 'average', label: 'Average (2.5-2.9 GPA or equivalent)' },
          { value: 'below_average', label: 'Below average (below 2.5 GPA)' }
        ],
        required: true
      }
    ]
  }
];

export default {
  'study-abroad': studyAbroadQuestions,
  'language-programs': languageProgramQuestions,
  'scholarships': scholarshipQuestions,
  // Add more question sets for other consultation types
};
