"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, PiggyBank, Home, CreditCard, Plane, Calculator } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface BudgetSelectionStepProps {
  data: any
  updateData: (data: any) => void
  onValidation: (isValid: boolean) => void
}

interface BudgetRanges {
  tuitionMin: number
  tuitionMax: number
  serviceFeeMin: number
  serviceFeeMax: number
  applicationFeeMin: number
  applicationFeeMax: number
  visaFeeMin: number
  visaFeeMax: number
  livingCostMin: number
  livingCostMax: number
}

export function BudgetSelectionStep({ data, updateData, onValidation }: BudgetSelectionStepProps) {
  const [budgetRanges, setBudgetRanges] = useState<BudgetRanges>({
    tuitionMin: 0,
    tuitionMax: 50000,
    serviceFeeMin: 0,
    serviceFeeMax: 5000,
    applicationFeeMin: 0,
    applicationFeeMax: 500,
    visaFeeMin: 0,
    visaFeeMax: 1000,
    livingCostMin: 0,
    livingCostMax: 2000,
  })
  const [loading, setLoading] = useState(true)

  const tuitionBudget = data.tuitionBudget || 0
  const serviceFeesBudget = data.serviceFeesBudget || 0
  const livingCostsBudget = data.livingCostsBudget || 0
  const totalBudget = tuitionBudget + serviceFeesBudget + livingCostsBudget

  useEffect(() => {
    fetchBudgetRanges()
  }, [data.consultationType, data.level])

  useEffect(() => {
    const total = tuitionBudget + serviceFeesBudget + livingCostsBudget
    updateData({ totalBudget: total })
    onValidation(total > 0)
  }, [tuitionBudget, serviceFeesBudget, livingCostsBudget, updateData, onValidation])

  const fetchBudgetRanges = async () => {
    try {
      setLoading(true)

      if (data.consultationType === "programs") {
        // Fetch from programs table
        const { data: programs, error } = await supabase
          .from("programs")
          .select("tuition_min, tuition_max, living_cost_min, living_cost_max")
          .not("tuition_min", "is", null)
          .not("tuition_max", "is", null)

        if (!error && programs) {
          const tuitionValues = programs.flatMap((p) => [p.tuition_min, p.tuition_max]).filter(Boolean)
          const livingValues = programs.flatMap((p) => [p.living_cost_min, p.living_cost_max]).filter(Boolean)

          setBudgetRanges({
            tuitionMin: Math.min(...tuitionValues) || 0,
            tuitionMax: Math.max(...tuitionValues) || 50000,
            serviceFeeMin: 0,
            serviceFeeMax: 2000,
            applicationFeeMin: 0,
            applicationFeeMax: 300,
            visaFeeMin: 0,
            visaFeeMax: 500,
            livingCostMin: Math.min(...livingValues) || 0,
            livingCostMax: Math.max(...livingValues) || 2000,
          })
        }
      } else if (data.consultationType === "destinations") {
        // Fetch from destinations table with level-specific tuition
        const levelPrefix = data.level?.toLowerCase() || "bachelor"
        const { data: destinations, error } = await supabase
          .from("destinations")
          .select(`
            ${levelPrefix}_tuition_min,
            ${levelPrefix}_tuition_max,
            service_fee,
            application_fee,
            visa_processing_fee
          `)
          .not(`${levelPrefix}_tuition_min`, "is", null)

        if (!error && destinations) {
          const tuitionMinKey = `${levelPrefix}_tuition_min`
          const tuitionMaxKey = `${levelPrefix}_tuition_max`

          const tuitionValues = destinations.flatMap((d) => [d[tuitionMinKey], d[tuitionMaxKey]]).filter(Boolean)
          const serviceFees = destinations.map((d) => d.service_fee).filter(Boolean)
          const applicationFees = destinations.map((d) => d.application_fee).filter(Boolean)
          const visaFees = destinations.map((d) => d.visa_processing_fee).filter(Boolean)

          // Calculate budget intervals as 1/2 of max_tuition + fees
          const maxTuition = Math.max(...tuitionValues) || 50000
          const budgetInterval = maxTuition / 2

          setBudgetRanges({
            tuitionMin: Math.min(...tuitionValues) || 0,
            tuitionMax: Math.max(...tuitionValues) || 50000,
            serviceFeeMin: Math.min(...serviceFees) || 0,
            serviceFeeMax: Math.max(...serviceFees) || 5000,
            applicationFeeMin: Math.min(...applicationFees) || 0,
            applicationFeeMax: Math.max(...applicationFees) || 500,
            visaFeeMin: Math.min(...visaFees) || 0,
            visaFeeMax: Math.max(...visaFees) || 1000,
            livingCostMin: 500,
            livingCostMax: 3000,
          })
        }
      }
    } catch (error) {
      console.error("Error fetching budget ranges:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTuitionChange = (value: number[]) => {
    updateData({ tuitionBudget: value[0] })
  }

  const handleServiceFeesChange = (value: number[]) => {
    updateData({ serviceFeesBudget: value[0] })
  }

  const handleLivingCostsChange = (value: number[]) => {
    updateData({ livingCostsBudget: value[0] })
  }

  const handleFlexibilityChange = (flexibility: string) => {
    updateData({ budgetFlexibility: flexibility })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getBudgetRecommendation = () => {
    if (totalBudget < 10000) return { level: "Budget-Friendly", color: "text-green-600", bg: "bg-green-50" }
    if (totalBudget < 25000) return { level: "Moderate", color: "text-blue-600", bg: "bg-blue-50" }
    if (totalBudget < 50000) return { level: "Premium", color: "text-purple-600", bg: "bg-purple-50" }
    return { level: "Luxury", color: "text-orange-600", bg: "bg-orange-50" }
  }

  const recommendation = getBudgetRecommendation()

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading budget information...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
        >
          <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Plan your budget
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Set your budget for different categories to find options that fit your financial plan
        </p>
      </div>

      {/* Budget Summary */}
      <Card className={`max-w-4xl mx-auto ${recommendation.bg} border-2 border-opacity-20`}>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Calculator className="w-6 h-6 text-slate-600" />
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                Total Budget Overview
              </h3>
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              {formatCurrency(totalBudget)}
            </div>
            <Badge className={`${recommendation.color} ${recommendation.bg} border-0 px-4 py-2 text-sm font-medium`}>
              {recommendation.level} Range
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <PiggyBank className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                {formatCurrency(tuitionBudget)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Tuition Fees</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                {formatCurrency(serviceFeesBudget)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Service & Application Fees</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <Home className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                {formatCurrency(livingCostsBudget)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Living Costs (Annual)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Sliders */}
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4">
        {/* Tuition Budget */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-base sm:text-lg font-semibold flex items-center">
                  <PiggyBank className="w-5 h-5 mr-2 text-blue-600" />
                  Tuition Budget
                </Label>
                <Badge variant="outline" className="text-sm">
                  {formatCurrency(tuitionBudget)}
                </Badge>
              </div>
              <Slider
                value={[tuitionBudget]}
                onValueChange={handleTuitionChange}
                max={budgetRanges.tuitionMax}
                min={budgetRanges.tuitionMin}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-xs sm:text-sm text-slate-500">
                <span>{formatCurrency(budgetRanges.tuitionMin)}</span>
                <span>{formatCurrency(budgetRanges.tuitionMax)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Fees Budget */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-base sm:text-lg font-semibold flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Service & Application Fees
                </Label>
                <Badge variant="outline" className="text-sm">
                  {formatCurrency(serviceFeesBudget)}
                </Badge>
              </div>
              <Slider
                value={[serviceFeesBudget]}
                onValueChange={handleServiceFeesChange}
                max={budgetRanges.serviceFeeMax + budgetRanges.applicationFeeMax + budgetRanges.visaFeeMax}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs sm:text-sm text-slate-500">
                <span>{formatCurrency(0)}</span>
                <span>
                  {formatCurrency(
                    budgetRanges.serviceFeeMax + budgetRanges.applicationFeeMax + budgetRanges.visaFeeMax,
                  )}
                </span>
              </div>
              <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Plane className="w-4 h-4" />
                  <span className="font-medium">Includes:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <span>• Service fees</span>
                  <span>• Application fees</span>
                  <span>• Visa processing fees</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Living Costs Budget */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-base sm:text-lg font-semibold flex items-center">
                  <Home className="w-5 h-5 mr-2 text-purple-600" />
                  Annual Living Costs
                </Label>
                <Badge variant="outline" className="text-sm">
                  {formatCurrency(livingCostsBudget)}
                </Badge>
              </div>
              <Slider
                value={[livingCostsBudget]}
                onValueChange={handleLivingCostsChange}
                max={budgetRanges.livingCostMax * 12}
                min={budgetRanges.livingCostMin * 12}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs sm:text-sm text-slate-500">
                <span>{formatCurrency(budgetRanges.livingCostMin * 12)}</span>
                <span>{formatCurrency(budgetRanges.livingCostMax * 12)}</span>
              </div>
              <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="font-medium">Includes accommodation, food, transportation, and personal expenses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Flexibility */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <Label className="text-base sm:text-lg font-semibold">Budget Flexibility</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "strict", label: "Strict", desc: "Stay within budget" },
                  { id: "flexible", label: "Flexible", desc: "Up to 20% over" },
                  { id: "very_flexible", label: "Very Flexible", desc: "Up to 50% over" },
                ].map((option) => (
                  <Button
                    key={option.id}
                    variant={data.budgetFlexibility === option.id ? "default" : "outline"}
                    onClick={() => handleFlexibilityChange(option.id)}
                    className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                  >
                    <span className="font-semibold text-sm sm:text-base">{option.label}</span>
                    <span className="text-xs opacity-75">{option.desc}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

