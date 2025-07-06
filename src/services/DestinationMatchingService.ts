import { Destination } from '@/hooks/useDestinations';

export interface DestinationConsultationPreferences {
  studyLevel: 'Bachelor' | 'Master' | 'PhD';
  budget: number;
  language: string;
  languageTestRequired: boolean;
  languageTestScore?: string;
  intakePeriod: string;
  academicLevel: 'High' | 'Medium' | 'Any';
  religiousFacilities?: boolean;
  halalFood?: boolean;
  workWhileStudying?: boolean;
  accommodationPreference?: string;
}

export interface MatchedDestination extends Destination {
  matchScore: number;
  matchReasons: string[];
  budgetMatch: number;
  languageMatch: number;
  levelMatch: number;
  intakeMatch: number;
  academicMatch: number;
}

export class DestinationMatchingService {
  static calculateDestinationMatch(
    destination: Destination,
    preferences: DestinationConsultationPreferences
  ): MatchedDestination {
    let totalScore = 0;
    let maxScore = 100;
    const matchReasons: string[] = [];

    // Budget matching (30% weight)
    const budgetScore = this.calculateBudgetMatch(destination, preferences);
    totalScore += budgetScore * 0.3;
    if (budgetScore > 70) matchReasons.push(`Fits within your budget range`);

    // Language matching (25% weight)  
    const languageScore = this.calculateLanguageMatch(destination, preferences);
    totalScore += languageScore * 0.25;
    if (languageScore > 70) matchReasons.push(`Supports your preferred language`);

    // Academic level matching (20% weight)
    const levelScore = this.calculateAcademicLevelMatch(destination, preferences);
    totalScore += levelScore * 0.2;
    if (levelScore > 80) matchReasons.push(`Matches your academic level`);

    // Intake period matching (15% weight)
    const intakeScore = this.calculateIntakeMatch(destination, preferences);
    totalScore += intakeScore * 0.15;
    if (intakeScore > 70) matchReasons.push(`Available for your preferred intake`);

    // Additional preferences (10% weight)
    const additionalScore = this.calculateAdditionalPreferences(destination, preferences);
    totalScore += additionalScore * 0.1;
    if (additionalScore > 70) matchReasons.push(`Meets your special requirements`);

    return {
      ...destination,
      matchScore: Math.round(totalScore),
      matchReasons,
      budgetMatch: budgetScore,
      languageMatch: languageScore,
      levelMatch: levelScore,
      intakeMatch: intakeScore,
      academicMatch: levelScore
    };
  }

  private static calculateBudgetMatch(
    destination: Destination,
    preferences: DestinationConsultationPreferences
  ): number {
    const { studyLevel, budget } = preferences;
    
    let tuitionMin = 0;
    let tuitionMax = 0;

    switch (studyLevel) {
      case 'Bachelor':
        tuitionMin = destination.bachelor_tuition_min || 0;
        tuitionMax = destination.bachelor_tuition_max || 0;
        break;
      case 'Master':
        tuitionMin = destination.master_tuition_min || 0;
        tuitionMax = destination.master_tuition_max || 0;
        break;
      case 'PhD':
        tuitionMin = destination.phd_tuition_min || 0;
        tuitionMax = destination.phd_tuition_max || 0;
        break;
    }

    if (tuitionMin === 0 && tuitionMax === 0) return 50; // No data available

    const avgTuition = (tuitionMin + tuitionMax) / 2;
    const totalCost = avgTuition + (destination.service_fee || 0) + (destination.application_fee || 0);

    if (budget >= totalCost) return 100;
    if (budget >= totalCost * 0.8) return 80;
    if (budget >= totalCost * 0.6) return 60;
    if (budget >= totalCost * 0.4) return 40;
    return 20;
  }

  private static calculateLanguageMatch(
    destination: Destination,
    preferences: DestinationConsultationPreferences
  ): number {
    const { language, languageTestRequired } = preferences;
    
    if (!destination.language_requirements) return 50; // No language info

    const requirements = destination.language_requirements.toLowerCase();
    const userLang = language.toLowerCase();

    // Direct language match
    if (requirements.includes(userLang)) {
      return languageTestRequired ? 100 : 90; // Higher score if they have test
    }

    // English fallback for international programs
    if (userLang === 'english' && requirements.includes('english')) {
      return languageTestRequired ? 90 : 80;
    }

    // Partial match for similar languages
    if (this.isLanguageSimilar(userLang, requirements)) {
      return 60;
    }

    return 30; // Low match but not zero
  }

  private static calculateAcademicLevelMatch(
    destination: Destination,
    preferences: DestinationConsultationPreferences
  ): number {
    const { studyLevel, academicLevel } = preferences;
    
    let requiredLevel: string | undefined;
    
    switch (studyLevel) {
      case 'Bachelor':
        requiredLevel = destination.bachelor_academic_level;
        break;
      case 'Master':
        requiredLevel = destination.master_academic_level;
        break;
      case 'PhD':
        requiredLevel = destination.phd_academic_level;
        break;
    }

    if (!requiredLevel || requiredLevel === 'Any') return 100;
    
    if (requiredLevel === academicLevel) return 100;
    if (requiredLevel === 'Medium' && academicLevel === 'High') return 90;
    if (requiredLevel === 'High' && academicLevel === 'Medium') return 70;
    
    return 50;
  }

  private static calculateIntakeMatch(
    destination: Destination,
    preferences: DestinationConsultationPreferences
  ): number {
    const { intakePeriod } = preferences;
    
    if (!destination.intake_periods || !Array.isArray(destination.intake_periods)) {
      return 70; // Assume flexibility if no data
    }

    const intakes = destination.intake_periods as string[];
    
    // Direct match
    if (intakes.some(intake => 
      intake.toLowerCase().includes(intakePeriod.toLowerCase())
    )) {
      return 100;
    }

    // Partial matches
    if (intakePeriod.toLowerCase() === 'flexible' || intakes.length > 2) {
      return 90;
    }

    return 40;
  }

  private static calculateAdditionalPreferences(
    destination: Destination,
    preferences: DestinationConsultationPreferences
  ): number {
    let score = 70; // Base score
    let factors = 0;
    let matches = 0;

    // Religious facilities
    if (preferences.religiousFacilities !== undefined) {
      factors++;
      // This would need to be added to destination data
      // For now, assume some countries are more accommodating
      const religiousFriendly = ['Turkey', 'Malaysia', 'UAE', 'France', 'Germany'];
      if (religiousFriendly.includes(destination.country)) {
        matches++;
      }
    }

    // Work while studying
    if (preferences.workWhileStudying !== undefined) {
      factors++;
      // Some countries allow work while studying
      const workFriendly = ['Germany', 'Canada', 'Australia', 'Netherlands', 'Sweden'];
      if (workFriendly.includes(destination.country)) {
        matches++;
      }
    }

    if (factors > 0) {
      score = (matches / factors) * 100;
    }

    return Math.max(score, 50); // Minimum 50%
  }

  private static isLanguageSimilar(userLang: string, requirements: string): boolean {
    const similarLanguages: { [key: string]: string[] } = {
      'spanish': ['portuguese', 'italian'],
      'portuguese': ['spanish', 'italian'],
      'italian': ['spanish', 'portuguese'],
      'french': ['italian', 'spanish'],
      'german': ['dutch', 'swedish'],
      'dutch': ['german', 'flemish'],
      'arabic': ['turkish', 'persian']
    };

    const similar = similarLanguages[userLang] || [];
    return similar.some(lang => requirements.includes(lang));
  }

  static findMatchingDestinations(
    destinations: Destination[],
    preferences: DestinationConsultationPreferences,
    limit: number = 10
  ): MatchedDestination[] {
    return destinations
      .map(destination => this.calculateDestinationMatch(destination, preferences))
      .filter(match => match.matchScore >= 30) // Minimum threshold
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }
}