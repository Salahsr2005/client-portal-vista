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

export const useDestinationConsultation = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data: destinations, isLoading: destinationsLoading } = useDestinations()

  const [consultationData, setConsultationData] = useState<Partial<ConsultationPreferences>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [matchedDestinations, setMatchedDestinations] = useState<MatchedDestination[]>([])

  // Find matching destinations
  const findMatches = async (preferences: ConsultationPreferences): Promise<MatchedDestination[]> => {
    console.log("🔍 Starting destination matching process...")
    console.log("📊 Available destinations:", destinations?.destinations?.length || 0)
    console.log("⚙️ User preferences:", preferences)

    if (!destinations?.destinations || destinations.destinations.length === 0) {
      console.warn("❌ No destinations available for matching")
      throw new Error("No destinations available")
    }

    const matches = DestinationMatchingService.findMatchingDestinations(destinations.destinations, preferences)

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
      if (!user) throw new Error("User not authenticated")

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

    await saveConsultationMutation.mutateAsync({
      preferences: fullPreferences,
      matches,
    })

    return matches
  }

  return {
    // State
    consultationData,
    currentStep,
    matchedDestinations,

    // Loading states
    isLoading: destinationsLoading || saveConsultationMutation.isPending,
    historyLoading,

    // Data
    consultationHistory,
    destinations,

    // Actions
    updateConsultationData,
    nextStep,
    prevStep,
    resetConsultation,
    findMatches,
    completeConsultation,
    isStepValid,

    // Mutations
    saveConsultation: saveConsultationMutation.mutate,
    isSaving: saveConsultationMutation.isPending,
  }
}
