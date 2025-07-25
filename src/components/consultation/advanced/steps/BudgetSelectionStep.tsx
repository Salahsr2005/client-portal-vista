"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Euro, Target, Calculator, TrendingUp, Info } from "lucide-react"

interface BudgetSelectionStepProps {
  data: {
    budget?: number
  }
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
  consultationType?: "programs" | "destinations"
  level?: string
}

const BUDGET_RANGES = [
  {
    id: "low",
    label: "Budget-Friendly",
    range: "€5,000 - €15,000",
    min: 5000,
    max: 15000,
    description: "Affordable options with good value",
    icon: "💰",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: "medium",
    label: "Mid-Range",
    range: "€15,000 - €30,000",
    min: 15000,
    max: 30000,
    description: "Balanced cost and quality programs",
    icon: "🎯",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "high",
    label: "Premium",
    range: "€30,000 - €50,000",
    min: 30000,
    max: 50000,
    description: "High-quality programs and services",
    icon: "⭐",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: "luxury",
    label: "Luxury",
    range: "€50,000+",
    min: 50000,
    max: 100000,
    description: "Premium institutions and experiences",
    icon: "💎",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
]

export function BudgetSelectionStep({
  data,
  updateData,
  onValidation,
  consultationType,
  level,
}: BudgetSelectionStepProps) {
  const [customBudget, setCustomBudget] = useState(data?.budget || 20000)
  const [selectedRange, setSelectedRange] = useState<string>("")
  const selectedBudget = data?.budget || 0

  useEffect(() => {
    onValidation(selectedBudget > 0)
  }, [selectedBudget, onValidation])

  useEffect(() => {
    // Find which range the current budget falls into
    const range = BUDGET_RANGES.find((r) => selectedBudget >= r.min && (selectedBudget <= r.max || r.id === "luxury"))
    setSelectedRange(range?.id || "")
  }, [selectedBudget])

  const handleRangeSelect = (range: (typeof BUDGET_RANGES)[0]) => {
    const midpoint = range.id === "luxury" ? 60000 : (range.min + range.max) / 2
    setCustomBudget(midpoint)
    updateData({ budget: midpoint })
  }

  const handleCustomBudgetChange = (value: number[]) => {
    const budget = value[0]
    setCustomBudget(budget)
    updateData({ budget })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setCustomBudget(value)
    updateData({ budget: value })
  }

  const getBudgetBreakdown = () => {
    if (consultationType === "destinations") {
      // For destinations, budget calculation is different
      const serviceFee = 2000
      const applicationFee = 500
      const visaFee = 300
      const maxTuition = selectedBudget - serviceFee - applicationFee - visaFee

      return {
        maxTuition: Math.max(0, maxTuition / 2), // Half of max tuition as specified
        serviceFee,
        applicationFee,
        visaFee,
        total: selectedBudget,
      }
    } else {
      // For programs
      const tuition = selectedBudget * 0.6
      const living = selectedBudget * 0.3
      const other = selectedBudget * 0.1

      return {
        tuition,
        living,
        other,
        total: selectedBudget,
      }
    }
  }

  const breakdown = getBudgetBreakdown()

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center"
        >
          <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          What's your budget?
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {consultationType === "destinations"
            ? "Set your total budget including tuition, fees, and living expenses for your study destination"
            : "Set your annual budget for tuition, living expenses, and other costs"}
        </p>
      </div>

      {/* Budget Range Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
        {BUDGET_RANGES.map((range, index) => (
          <motion.div
            key={range.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <Card
              className={`cursor-pointer transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1 h-full ${
                selectedRange === range.id
                  ? `ring-2 ring-blue-400 ${range.bgColor} ${range.borderColor} shadow-lg scale-105`
                  : "hover:shadow-md border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => handleRangeSelect(range)}
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Header */}
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-3">{range.icon}</div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                      {range.label}
                    </h3>
                    <Badge variant="outline" className={`bg-gradient-to-r ${range.color} text-white border-0 text-sm`}>
                      {range.range}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-center text-sm leading-relaxed">
                    {range.description}
                  </p>
                </div>

                {/* Selection indicator */}
                {selectedRange === range.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom Budget Slider */}
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Custom Budget
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Adjust the slider or enter a specific amount
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget-input" className="text-sm font-medium">
                    Annual Budget (EUR)
                  </Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="budget-input"
                      type="number"
                      value={customBudget}
                      onChange={handleInputChange}
                      className="pl-10 text-lg font-semibold"
                      min="1000"
                      max="100000"
                      step="1000"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Slider
                    value={[customBudget]}
                    onValueChange={handleCustomBudgetChange}
                    max={100000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>€1,000</span>
                    <span>€50,000</span>
                    <span>€100,000+</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Breakdown */}
      {selectedBudget > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto px-4">
          <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Budget Breakdown
                  </h3>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    €{selectedBudget.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3">
                  {consultationType === "destinations" ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Max Tuition (50%)</span>
                        <span className="font-semibold">€{breakdown.maxTuition.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Service Fee</span>
                        <span className="font-semibold">€{breakdown.serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Application Fee</span>
                        <span className="font-semibold">€{breakdown.applicationFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Visa Fee</span>
                        <span className="font-semibold">€{breakdown.visaFee.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Tuition (60%)</span>
                        <span className="font-semibold">€{breakdown.tuition.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Living Expenses (30%)</span>
                        <span className="font-semibold">€{breakdown.living.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Other Costs (10%)</span>
                        <span className="font-semibold">€{breakdown.other.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
                    <Info className="w-4 h-4" />
                    <span className="text-sm">
                      {consultationType === "destinations"
                        ? "Budget calculated for destination consultation with fees"
                        : "Estimated annual costs for program consultation"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}


