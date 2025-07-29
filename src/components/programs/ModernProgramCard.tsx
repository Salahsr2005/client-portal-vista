"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  GraduationCap,
  Globe,
  Heart,
  Award,
  Download,
  ExternalLink,
  Star,
  Building2,
  Clock,
  CheckCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Program {
  id: string
  name: string
  university: string
  country: string
  city?: string
  location?: string
  study_level?: string
  level?: string
  field?: string
  duration_months?: number
  duration?: string
  tuition_min?: number
  tuition_max?: number
  tuition_fee?: number
  living_cost_min?: number
  living_cost_max?: number
  program_language?: string
  language?: string
  description?: string
  ranking?: number
  success_rate?: number
  scholarship_available?: boolean
  scholarship_amount?: number
  scholarship_details?: string
  admission_requirements?: string
  gpa_requirement?: number
  language_test?: string
  language_test_score?: string
  application_fee?: number
  advantages?: string
  image_url?: string
  status?: string
  religious_facilities?: boolean
  halal_food_availability?: boolean
}

interface ModernProgramCardProps {
  program: Program
  onViewDetails: (program: Program) => void
  onApply: (program: Program) => void
}

export const ModernProgramCard: React.FC<ModernProgramCardProps> = ({ program, onViewDetails, onApply }) => {
  const [isLiked, setIsLiked] = useState(false)
  const { toast } = useToast()

  const handleDownloadBrochure = async () => {
    try {
      // Mock PDF generation - in real app, this would generate actual PDF
      toast({
        title: "Brochure Generated",
        description: "Your program brochure is being prepared for download.",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate brochure. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const tuitionFee = program.tuition_fee || program.tuition_min || 0
  const tuitionMax = program.tuition_max || tuitionFee
  const programLevel = program.study_level || program.level || "Not specified"
  const programLanguage = program.program_language || program.language || "Not specified"
  const programLocation = program.location || `${program.city || "Unknown"}, ${program.country}`
  const programDuration =
    program.duration || (program.duration_months ? `${program.duration_months} months` : "Not specified")
  const totalCostMin = tuitionFee + (program.living_cost_min || 0) * 12
  const totalCostMax = tuitionMax + (program.living_cost_max || 0) * 12

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="relative h-56 overflow-hidden">
          {program.image_url ? (
            <img
              src={program.image_url || "/placeholder.svg"}
              alt={program.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <GraduationCap className="w-20 h-20 text-white/40" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
            >
              <Heart className={cn("w-5 h-5", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
            </motion.button>
            {program.ranking && (
              <div className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-white fill-white" />
                <span className="text-white text-sm font-medium">#{program.ranking}</span>
              </div>
            )}
          </div>

          {/* Country Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-0">
              <MapPin className="w-3 h-3 mr-1" />
              {program.country}
            </Badge>
          </div>

          {/* Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg line-clamp-2 leading-tight">
              {program.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-200 text-sm drop-shadow">
              <Building2 className="w-4 h-4" />
              <span className="line-clamp-1">{program.university}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm drop-shadow mt-1">
              <MapPin className="w-4 h-4" />
              <span>{programLocation}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
          {/* Program Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <GraduationCap className="w-3 h-3 mr-1" />
                {programLevel}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {program.field || "General"}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {programDuration}
            </div>
          </div>

          {/* Description */}
          {program.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{program.description}</p>
          )}

          {/* Costs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Annual Tuition</span>
              <span className="text-lg font-bold text-green-600">
                {tuitionMax > tuitionFee
                  ? `${formatCurrency(tuitionFee)} - ${formatCurrency(tuitionMax)}`
                  : formatCurrency(tuitionFee)}
              </span>
            </div>
            {program.living_cost_min && program.living_cost_max && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Est. total cost (with living)</span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(totalCostMin)} - {formatCurrency(totalCostMax)}
                </span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>{programLanguage}</span>
            </div>
            <div className="flex items-center gap-3">
              {program.success_rate && (
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>{program.success_rate}% Success</span>
                </div>
              )}
              {program.scholarship_available && (
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                >
                  <Award className="w-3 h-3 mr-1" />
                  Scholarship
                </Badge>
              )}
            </div>
          </div>

          {/* Facilities */}
          {(program.religious_facilities || program.halal_food_availability) && (
            <div className="flex items-center gap-4 text-xs">
              {program.religious_facilities && (
                <div className="flex items-center gap-1 text-blue-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Religious Facilities</span>
                </div>
              )}
              {program.halal_food_availability && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Halal Food</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2 mt-auto">
            <div className="flex gap-3">
              <Button
                onClick={() => onViewDetails(program)}
                variant="outline"
                className="flex-1 border-border/50 hover:border-primary hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button
                onClick={handleDownloadBrochure}
                variant="outline"
                size="sm"
                className="border-border/50 hover:border-primary hover:text-primary transition-colors px-3 bg-transparent"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={() => onApply(program)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
            >
              Apply Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

