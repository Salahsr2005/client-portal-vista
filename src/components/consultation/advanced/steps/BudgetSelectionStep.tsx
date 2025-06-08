
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign,
  Home,
  Utensils,
  Bus,
  ShoppingBag,
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface BudgetSelectionProps {
  data: any;
  updateData: (data: any) => void;
  onValidation: (isValid: boolean) => void;
}

const BUDGET_RANGES = [
  { min: 5000, max: 15000, label: 'Budget-Friendly', description: 'Eastern Europe, some scholarships' },
  { min: 15000, max: 30000, label: 'Moderate', description: 'Most European countries' },
  { min: 30000, max: 50000, label: 'Comfortable', description: 'Premium universities, major cities' },
  { min: 50000, max: 100000, label: 'Premium', description: 'Top-tier programs, luxury living' }
];

const LIVING_COST_ITEMS = [
  { icon: Home, label: 'Accommodation', percentage: 40, description: 'Student housing, rent' },
  { icon: Utensils, label: 'Food & Dining', percentage: 25, description: 'Meals, groceries' },
  { icon: Bus, label: 'Transportation', percentage: 15, description: 'Public transport, travel' },
  { icon: ShoppingBag, label: 'Personal Expenses', percentage: 20, description: 'Clothing, entertainment, misc' }
];

export function BudgetSelectionStep({ data, updateData, onValidation }: BudgetSelectionProps) {
  const { budget, livingCosts } = data;
  const [customBudget, setCustomBudget] = useState(budget || 25000);
  const [customLivingCosts, setCustomLivingCosts] = useState(livingCosts || 12000);

  useEffect(() => {
    onValidation(budget > 0);
  }, [budget, onValidation]);

  useEffect(() => {
    updateData({ 
      budget: customBudget,
      livingCosts: customLivingCosts 
    });
  }, [customBudget, customLivingCosts, updateData]);

  const handleBudgetRangeSelect = (range: typeof BUDGET_RANGES[0]) => {
    const midPoint = (range.min + range.max) / 2;
    setCustomBudget(midPoint);
    setCustomLivingCosts(Math.round(midPoint * 0.4)); // Estimate living costs as 40% of total budget
  };

  const getBudgetCategory = (amount: number) => {
    for (const range of BUDGET_RANGES) {
      if (amount >= range.min && amount <= range.max) {
        return range;
      }
    }
    return BUDGET_RANGES[0];
  };

  const currentBudgetCategory = getBudgetCategory(customBudget);
  const totalBudget = customBudget + customLivingCosts;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Budget Planning</h2>
        <p className="text-muted-foreground text-lg">
          Help us understand your financial planning for studying abroad
        </p>
      </div>

      {/* Budget Range Selection */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BUDGET_RANGES.map((range, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                customBudget >= range.min && customBudget <= range.max
                  ? 'ring-2 ring-offset-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleBudgetRangeSelect(range)}
            >
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <PiggyBank className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{range.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      €{range.min.toLocaleString()} - €{range.max.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {range.description}
                    </p>
                  </div>

                  {customBudget >= range.min && customBudget <= range.max && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex justify-center"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom Budget Input */}
      <Card className="border-2 border-dashed border-indigo-200 dark:border-indigo-800">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Annual Tuition Budget</Label>
                <Badge variant="outline">
                  {currentBudgetCategory.label}
                </Badge>
              </div>
              <div className="space-y-4">
                <Slider
                  value={[customBudget]}
                  onValueChange={(value) => setCustomBudget(value[0])}
                  max={80000}
                  min={3000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={customBudget}
                    onChange={(e) => setCustomBudget(Number(e.target.value))}
                    className="max-w-32"
                    min="3000"
                    max="80000"
                  />
                  <span className="text-sm text-muted-foreground">EUR per year</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-4 block">Annual Living Costs</Label>
              <div className="space-y-4">
                <Slider
                  value={[customLivingCosts]}
                  onValueChange={(value) => setCustomLivingCosts(value[0])}
                  max={25000}
                  min={4000}
                  step={500}
                  className="w-full"
                />
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={customLivingCosts}
                    onChange={(e) => setCustomLivingCosts(Number(e.target.value))}
                    className="max-w-32"
                    min="4000"
                    max="25000"
                  />
                  <span className="text-sm text-muted-foreground">EUR per year</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Living Costs Breakdown */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Living Costs Breakdown</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {LIVING_COST_ITEMS.map((item, index) => {
              const amount = Math.round((customLivingCosts * item.percentage) / 100);
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{item.label}</span>
                      <span className="font-semibold">€{amount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Budget Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <DollarSign className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold">Total Annual Budget</h3>
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              €{totalBudget.toLocaleString()}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Tuition: </span>
                <span className="font-semibold">€{customBudget.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Living: </span>
                <span className="font-semibold">€{customLivingCosts.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
            <Info className="w-4 h-4" />
            <span className="text-sm">
              We'll match you with programs that fit within your budget range
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
