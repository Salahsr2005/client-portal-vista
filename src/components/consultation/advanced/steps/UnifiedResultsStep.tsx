"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Target,
  MapPin,
  Clock,
  Euro,
  GraduationCap,
  Globe,
  Star,
  BookOpen,
  Users,
  Award,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { useConsultationResults } from "@/hooks/useConsultationResults"

interface UnifiedResultsStepProps {
  preferences: {
    type: "programs" | "destinations"
    level?: string
    field?: string
    subjects?: string[]
    language?: string
    budget?: number
    specialRequirements?: {
      religiousFacilities?: boolean
      halalFood?: boolean
      scholarshipRequired?: boolean
    }
  }
  onReset: () => void
}

export function UnifiedResultsStep({ preferences, onReset }: UnifiedResultsStepProps) {
  const { data: results, isLoading, error, refetch } = useConsultationResults(preferences)

  const renderProgramCard = (program: any, index: number) => (
    <motion.div
      key={program.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 h-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{program.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {program.university}, {program.city}, {program.country}
                  </span>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {program.matchScore}% Match
              </Badge>
            </div>

            {/* Program Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span>{program.study_level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{program.duration_months} months</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span>{program.program_language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Euro className="w-4 h-4 text-purple-500" />
                <span>€{program.tuition_min?.toLocaleString()}</span>
              </div>
            </div>

            {/* Special Features */}
            <div className="flex flex-wrap gap-2">
              {program.scholarship_available && (
                <Badge variant="outline" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Scholarship
                </Badge>
              )}
              {program.religious_facilities && (
                <Badge variant="outline" className="text-xs">
                  Religious Facilities
                </Badge>
              )}
              {program.halal_food_availability && (
                <Badge variant="outline" className="text-xs">
                  Halal Food
                </Badge>
              )}
            </div>

            {/* Description */}
            {program.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{program.description}</p>
            )}

            {/* Action Button */}
            <Button variant="outline" className="w-full mt-4 hover:bg-blue-50 hover:border-blue-300 bg-transparent">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Program Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderDestinationCard = (destination: any, index: number) => (
    <motion.div
      key={destination.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 h-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{destination.country}</h3>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{destination.region}</span>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {destination.matchScore}% Match
              </Badge>
            </div>

            {/* Destination Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>{destination.total_universities} Universities</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span>{destination.total_programs} Programs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Euro className="w-4 h-4 text-purple-500" />
                <span>€{destination[`${preferences.level?.toLowerCase()}_tuition_min`]?.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{destination.success_rate}% Success</span>
              </div>
            </div>

            {/* Languages */}
            {destination.languages && (
              <div className="flex flex-wrap gap-2">
                {destination.languages.slice(0, 3).map((lang: string) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
                {destination.languages.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{destination.languages.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Special Features */}
            <div className="flex flex-wrap gap-2">
              {destination.religious_facilities && (
                <Badge variant="outline" className="text-xs">
                  Religious Facilities
                </Badge>
              )}
              {destination.halal_food_availability && (
                <Badge variant="outline" className="text-xs">
                  Halal Food
                </Badge>
              )}
              {destination.work_while_studying && (
                <Badge variant="outline" className="text-xs">
                  Work Permitted
                </Badge>
              )}
            </div>

            {/* Action Button */}
            <Button variant="outline" className="w-full mt-4 hover:bg-blue-50 hover:border-blue-300 bg-transparent">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Destination Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="h-full">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
        >
          <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Your Perfect Matches
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Based on your preferences, we found {isLoading ? "..." : results?.length || 0} great {preferences.type} for
          you
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Results</span>
        </Button>
        <Button onClick={onReset} variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Target className="w-4 h-4" />
          <span>New Consultation</span>
        </Button>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4">
        {isLoading && renderLoadingSkeleton()}

        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Something went wrong</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">We couldn't load your results. Please try again.</p>
            <Button onClick={() => refetch()} className="bg-red-500 hover:bg-red-600 text-white">
              Try Again
            </Button>
          </motion.div>
        )}

        {!isLoading && !error && results && results.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No matches found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We couldn't find any {preferences.type} matching your criteria. Try adjusting your preferences.
            </p>
            <Button onClick={onReset} className="bg-blue-500 hover:bg-blue-600 text-white">
              Start Over
            </Button>
          </motion.div>
        )}

        {!isLoading && !error && results && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) =>
              preferences.type === "programs" ? renderProgramCard(result, index) : renderDestinationCard(result, index),
            )}
          </div>
        )}
      </div>
    </div>
  )
}


