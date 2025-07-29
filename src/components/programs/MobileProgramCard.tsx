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

interface MobileProgramCardProps {
  program: Program
  onViewDetails: (program: Program) => void
  onApply: (program: Program) => void
}

export const MobileProgramCard: React.FC<MobileProgramCardProps> = ({ program, onViewDetails, onApply }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-slate-800">
        {/* Header Image */}
        <div className="relative h-40 overflow-hidden">
          {program.image_url ? (
            <img
              src={program.image_url || "/placeholder.svg"}
              alt={program.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-white/60" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge className="bg-white/90 text-gray-800 text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {program.country}
            </Badge>
            <div className="flex gap-1">
              {program.ranking && (
                <Badge className="bg-yellow-500/90 text-white text-xs">
                  <Star className="w-3 h-3 mr-1 fill-current" />#{program.ranking}
                </Badge>
              )}
              {program.scholarship_available && (
                <Badge className="bg-green-500/90 text-white text-xs">
                  <Award className="w-3 h-3" />
                </Badge>
              )}
            </div>
          </div>

          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
          >
            <Heart className={cn("w-4 h-4", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
          </motion.button>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Title and University */}
          <div>
            <h3 className="font-bold text-base line-clamp-2 mb-1 leading-tight">{program.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Building2 className="w-3 h-3" />
              <span className="line-clamp-1">{program.university}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{programLocation}</span>
            </div>
          </div>

          {/* Key Info Badges */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              <GraduationCap className="w-3 h-3 mr-1" />
              {programLevel}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              <Clock className="w-3 h-3 mr-1" />
              {programDuration}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              <Globe className="w-3 h-3 mr-1" />
              {programLanguage}
            </Badge>
          </div>

          {/* Field */}
          {program.field && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Field:</span> {program.field}
            </div>
          )}

          {/* Tuition */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Annual Tuition</div>
              <div className="text-lg font-bold text-green-600">
                {tuitionMax > tuitionFee
                  ? `${formatCurrency(tuitionFee)} - ${formatCurrency(tuitionMax)}`
                  : formatCurrency(tuitionFee)}
              </div>
            </div>
            {program.success_rate && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Success Rate</div>
                <div className="text-sm font-semibold text-blue-600">{program.success_rate}%</div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {program.religious_facilities && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Religious Facilities</span>
                </div>
              )}
              {program.halal_food_availability && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Halal Food</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <div className="flex gap-2">
              <Button onClick={() => onViewDetails(program)} variant="outline" size="sm" className="flex-1 text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Details
              </Button>
              <Button onClick={handleDownloadBrochure} variant="outline" size="sm" className="px-3 bg-transparent">
                <Download className="w-3 h-3" />
              </Button>
            </div>
            <Button
              onClick={() => onApply(program)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all text-sm"
              size="sm"
            >
              Apply Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

