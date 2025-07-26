"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  MapPin,
  Clock,
  Euro,
  Languages,
  Calendar,
  Award,
  Building2,
  GraduationCap,
  CheckCircle,
  XCircle,
  ExternalLink,
  Heart,
  Share2,
  Download,
  Star,
} from "lucide-react"
import { type CurrencyCode, formatCurrency } from "@/utils/currencyConverter"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface Program {
  id: string
  name: string
  university: string
  location: string
  country: string
  study_level?: string
  type?: string
  duration: string
  tuition_min?: number
  tuition_max?: number
  program_language?: string
  application_deadline?: string
  deadline?: string
  scholarship_available?: boolean
  hasScholarship?: boolean
  religious_facilities?: boolean
  hasReligiousFacilities?: boolean
  halal_food_availability?: boolean
  hasHalalFood?: boolean
  ranking?: number
  field?: string
  description?: string
  requirements?: string
  [key: string]: any
}

interface CompareProgramsProps {
  programs: Program[]
  onClose: () => void
  onRemoveProgram?: (id: string) => void
  currency?: CurrencyCode
}

const ComparePrograms: React.FC<CompareProgramsProps> = ({ programs, onClose, onRemoveProgram, currency = "EUR" }) => {
  const attributes = [
    {
      label: "University",
      icon: Building2,
      getter: (p: Program) => p.university,
      category: "basic",
    },
    {
      label: "Location",
      icon: MapPin,
      getter: (p: Program) => `${p.location}, ${p.country}`,
      category: "basic",
    },
    {
      label: "Study Level",
      icon: GraduationCap,
      getter: (p: Program) => p.study_level || p.type,
      category: "basic",
    },
    {
      label: "Field of Study",
      icon: Award,
      getter: (p: Program) => p.field || "Not specified",
      category: "basic",
    },
    {
      label: "Duration",
      icon: Clock,
      getter: (p: Program) => p.duration,
      category: "academic",
    },
    {
      label: "Language",
      icon: Languages,
      getter: (p: Program) => p.program_language || "Not specified",
      category: "academic",
    },
    {
      label: "Tuition Fee",
      icon: Euro,
      getter: (p: Program) => {
        if (p.tuition_min && p.tuition_max) {
          return `${formatCurrency(p.tuition_min, "EUR", currency)} - ${formatCurrency(p.tuition_max, "EUR", currency)}`
        } else if (p.tuition_min) {
          return `From ${formatCurrency(p.tuition_min, "EUR", currency)}`
        }
        return "Contact University"
      },
      category: "financial",
    },
    {
      label: "Application Deadline",
      icon: Calendar,
      getter: (p: Program) => p.application_deadline || p.deadline || "Rolling Admission",
      category: "application",
    },
    {
      label: "Scholarship Available",
      icon: Award,
      getter: (p: Program) => p.scholarship_available || p.hasScholarship,
      category: "financial",
      type: "boolean",
    },
    {
      label: "Religious Facilities",
      icon: Building2,
      getter: (p: Program) => p.religious_facilities || p.hasReligiousFacilities,
      category: "facilities",
      type: "boolean",
    },
    {
      label: "Halal Food Available",
      icon: CheckCircle,
      getter: (p: Program) => p.halal_food_availability || p.hasHalalFood,
      category: "facilities",
      type: "boolean",
    },
    {
      label: "University Ranking",
      icon: Star,
      getter: (p: Program) => (p.ranking ? `#${p.ranking}` : "Not ranked"),
      category: "academic",
    },
  ]

  const categories = [
    { id: "basic", label: "Basic Information", color: "blue" },
    { id: "academic", label: "Academic Details", color: "green" },
    { id: "financial", label: "Financial Information", color: "yellow" },
    { id: "facilities", label: "Facilities & Services", color: "purple" },
    { id: "application", label: "Application Details", color: "red" },
  ]

  const renderValue = (attr: any, program: Program) => {
    const value = attr.getter(program)

    if (attr.type === "boolean") {
      return (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700 dark:text-green-400">Yes</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 dark:text-red-400">No</span>
            </>
          )}
        </div>
      )
    }

    return <span className="text-slate-700 dark:text-slate-300">{value}</span>
  }

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
      green: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
      yellow: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800",
      purple: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
      red: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-7xl mx-auto"
    >
      <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <GraduationCap className="h-6 w-6" />
                </div>
                Compare Programs
              </CardTitle>
              <p className="text-blue-100 mt-1">Side-by-side comparison of {programs.length} programs</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[70vh]">
            <div className="p-6">
              {/* Program Headers */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {programs.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="relative overflow-hidden border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                      {onRemoveProgram && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 bg-white/80 dark:bg-slate-800/80 hover:bg-red-100 dark:hover:bg-red-900/30 z-10"
                          onClick={() => onRemoveProgram(program.id)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      )}

                      <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-4 left-4 right-12">
                          <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">{program.name}</h3>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">{program.university}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {program.location}, {program.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <Badge variant="secondary" className="text-xs">
                              {program.study_level || program.type}
                            </Badge>
                            {program.ranking && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />#{program.ranking}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Comparison Table by Categories */}
              <div className="space-y-8">
                {categories.map((category) => {
                  const categoryAttrs = attributes.filter((attr) => attr.category === category.id)
                  if (categoryAttrs.length === 0) return null

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("rounded-xl border-2 overflow-hidden", getCategoryColor(category.color))}
                    >
                      <div className="p-4 border-b border-current/20">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{category.label}</h3>
                      </div>

                      <div className="p-4">
                        <div className="space-y-4">
                          {categoryAttrs.map((attr, attrIndex) => (
                            <div key={attr.label} className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                              <div className="lg:col-span-1">
                                <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                                  <attr.icon className="h-4 w-4" />
                                  <span>{attr.label}</span>
                                </div>
                              </div>

                              <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {programs.map((program, programIndex) => (
                                  <div
                                    key={`${program.id}-${attr.label}`}
                                    className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-white/40 dark:border-slate-700/40"
                                  >
                                    {renderValue(attr, program)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {programs.map((program) => (
                    <div key={`${program.id}-actions`} className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                        <a href={`/programs/${program.id}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </a>
                      </Button>

                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        asChild
                      >
                        <a href={`/applications/new?program=${program.id}`} target="_blank" rel="noopener noreferrer">
                          Apply Now
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ComparePrograms
export { ComparePrograms }

