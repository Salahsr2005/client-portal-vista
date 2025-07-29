"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useDestinations } from "@/hooks/useDestinations"
import {
  DestinationMatchingService,
  type ConsultationPreferences,
  type MatchedDestination,
} from "@/services/DestinationMatchingService"

export interface ConsultationStep {
  id: number
  title: string
  description: string
  completed: boolean
}

// Mock destinations for fallback when database is unavailable
const mockDestinations = [
  {
    id: "1",
    name: "France Study Programs",
    country: "France",
    city: "Paris",
    region: "Western Europe",
    fees: 8000,
    description: "Comprehensive study programs in France with excellent academic reputation and cultural diversity.",
    status: "Active",
    bachelor_tuition_min: 2000,
    bachelor_tuition_max: 8000,
    master_tuition_min: 3000,
    master_tuition_max: 12000,
    phd_tuition_min: 1000,
    phd_tuition_max: 5000,
    available_programs: ["Bachelor", "Master", "PhD"],
    program_languages: ["French", "English"],
    language_requirements: "French B2 or English B2",
    intake_periods: ["September", "January"],
    religious_facilities: true,
    halal_food_availability: true,
    living_cost_min: 800,
    living_cost_max: 1200,
    application_fee: 100,
    service_fee: 500,
    visa_processing_fee: 99,
    admission_success_rate: 75,
    image_url: "/placeholder.svg?height=300&width=400&text=France",
  },
  {
    id: "2",
    name: "Germany Study Programs",
    country: "Germany",
    city: "Berlin",
    region: "Western Europe",
    fees: 1000,
    description: "High-quality education in Germany with minimal tuition fees and strong industry connections.",
    status: "Active",
    bachelor_tuition_min: 0,
    bachelor_tuition_max: 500,
    master_tuition_min: 0,
    master_tuition_max: 1000,
    phd_tuition_min: 0,
    phd_tuition_max: 500,
    available_programs: ["Bachelor", "Master", "PhD"],
    program_languages: ["German", "English"],
    language_requirements: "German B2 or English B2",
    intake_periods: ["September", "March"],
    religious_facilities: true,
    halal_food_availability: true,
    living_cost_min: 700,
    living_cost_max: 1100,
    application_fee: 75,
    service_fee: 400,
    visa_processing_fee: 75,
    admission_success_rate: 80,
    image_url: "/placeholder.svg?height=300&width=400&text=Germany",
  },
  {
    id: "3",
    name: "Canada Study Programs",
    country: "Canada",
    city: "Toronto",
    region: "North America",
    fees: 15000,
    description: "World-class education in Canada with diverse programs and excellent post-graduation opportunities.",
    status: "Active",
    bachelor_tuition_min: 12000,
    bachelor_tuition_max: 25000,
    master_tuition_min: 15000,
    master_tuition_max: 35000,
    phd_tuition_min: 8000,
    phd_tuition_max: 20000,
    available_programs: ["Bachelor", "Master", "PhD"],
    program_languages: ["English", "French"],
    language_requirements: "English IELTS 6.5 or French TEF B2",
    intake_periods: ["September", "January", "May"],
    religious_facilities: true,
    halal_food_availability: true,
    living_cost_min: 1000,
    living_cost_max: 1500,
    application_fee: 150,
    service_fee: 600,
    visa_processing_fee: 150,
    admission_success_rate: 70,
    image_url: "/placeholder.svg?height=300&width=400&text=Canada",
  },
]

export const useDestinationConsultation = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data: destinations, isLoading: destinationsLoading, error: destinationsError } = useDestinations()

  const [consultationData, setConsultationData] = useState<Partial<ConsultationPreferences>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [matchedDestinations, setMatchedDestinations] = useState<MatchedDestination[]>([])
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [analysisError, setAnalysisError] = useState<Error | null>(null)

  // Get destinations with fallback to mock data
  const getDestinations = () => {
    if (destinations?.destinations && destinations.destinations.length > 0) {
      return destinations.destinations
    }
    console.log("🔄 Using mock destinations as fallback")
    return mockDestinations
  }

  // Find matching destinations
  const findMatches = async (preferences: ConsultationPreferences): Promise<MatchedDestination[]> => {
    console.log("🔍 Starting destination matching process...")

    const availableDestinations = getDestinations()
    console.log("📊 Available destinations:", availableDestinations?.length || 0)
    console.log("⚙️ User preferences:", preferences)

    if (!availableDestinations || availableDestinations.length === 0) {
      console.warn("❌ No destinations available for matching")
      throw new Error("No destinations available")
    }

    const matches = DestinationMatchingService.findMatchingDestinations(availableDestinations, preferences)

    console.log("✅ Matching completed. Found:", matches.length, "matches")
    setMatchedDestinations(matches)
    return matches
  }

  // Save consultation result
  const saveConsultationMutation = useMutation({
    mutationFn: async (data: {
      preferences: ConsultationPreferences
      matches: MatchedDestination[]
    }) => {
      if (!user) {
        console.log("👤 User not authenticated, skipping save")
        return null
      }

      const consultationResult = {
        user_id: user.id,
        study_level: data.preferences.studyLevel,
        budget:
          data.preferences.tuitionBudgetRange[1] +
          data.preferences.livingCostsBudgetRange[1] +
          data.preferences.serviceFeesBudgetRange[1],
        language_preference: data.preferences.preferredLanguages.join(", "),
        destination_preference: "AI Recommended",
        matched_programs: data.matches.map((match) => ({
          destination_id: match.destination.id,
          name: match.destination.name,
          country: match.destination.country,
          match_score: match.score,
          match_reasons: match.reasons,
          recommendation: match.recommendation,
        })),
        preferences_data: data.preferences as any,
        notes: `Destination consultation completed with ${data.matches.length} matches found.`,
        conversion_status: "New",
        consultation_date: new Date().toISOString(),
        work_while_studying: data.preferences.workWhileStudying,
        scholarship_required: data.preferences.scholarshipRequired,
      }

      const { data: result, error } = await supabase
        .from("consultation_results")
        .insert(consultationResult)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      toast({
        title: "Consultation Saved",
        description: "Your destination consultation has been saved successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["consultation-results"] })
    },
    onError: (error) => {
      console.error("Error saving consultation:", error)
      toast({
        title: "Error",
        description: "Failed to save consultation. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Get consultation history
  const { data: consultationHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["consultation-results", user?.id],
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from("consultation_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const updateConsultationData = (updates: Partial<ConsultationPreferences>) => {
    setConsultationData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const resetConsultation = () => {
    setConsultationData({})
    setCurrentStep(1)
    setMatchedDestinations([])
    setIsLoadingAnalysis(false)
    setAnalysisError(null)
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Study Level
        return !!consultationData.studyLevel
      case 2: // Budget
        return !!consultationData.tuitionBudgetRange && consultationData.tuitionBudgetRange[1] > 0
      case 3: // Language & Timeline
        return (
          !!consultationData.preferredLanguages &&
          consultationData.preferredLanguages.length > 0 &&
          !!consultationData.intakePeriods &&
          consultationData.intakePeriods.length > 0
        )
      default:
        return false
    }
  }

  const completeConsultation = async () => {
    if (
      !consultationData.studyLevel ||
      !consultationData.tuitionBudgetRange ||
      !consultationData.preferredLanguages ||
      !consultationData.intakePeriods
    ) {
      throw new Error("Please complete all required fields")
    }

    const fullPreferences = consultationData as ConsultationPreferences
    const matches = await findMatches(fullPreferences)

    if (user) {
      await saveConsultationMutation.mutateAsync({
        preferences: fullPreferences,
        matches,
      })
    }

    return matches
  }

  const analyzeDestinations = async (preferences: ConsultationPreferences) => {
    console.log("🔄 Starting destination analysis...")
    setIsLoadingAnalysis(true)
    setAnalysisError(null)

    try {
      const availableDestinations = getDestinations()
      console.log("🏛️ Available destinations:", availableDestinations?.length || 0)

      if (!availableDestinations || availableDestinations.length === 0) {
        console.log("❌ No destinations data available")
        setMatchedDestinations([])
        return
      }

      // Analyze destinations using the matching service
      const results = DestinationMatchingService.findMatchingDestinations(availableDestinations, preferences)

      console.log("📊 Found matches:", results.length)
      setMatchedDestinations(results)
    } catch (err) {
      console.error("❌ Error in destination analysis:", err)
      setAnalysisError(err as Error)
      setMatchedDestinations([])
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  return {
    // State
    consultationData,
    currentStep,
    matchedDestinations,
    matches: matchedDestinations, // Alias for compatibility

    // Loading states
    isLoading: destinationsLoading || saveConsultationMutation.isPending || isLoadingAnalysis,
    historyLoading,

    // Data
    consultationHistory,
    destinations: getDestinations(),
    analysisError,

    // Actions
    updateConsultationData,
    nextStep,
    prevStep,
    resetConsultation,
    findMatches,
    completeConsultation,
    isStepValid,
    analyzeDestinations,

    // Mutations
    saveConsultation: saveConsultationMutation.mutate,
    isSaving: saveConsultationMutation.isPending,
  }
}

