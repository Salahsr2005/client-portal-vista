
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from '../types';
import { Loader2 } from "lucide-react";

interface StepThreeProps {
  formData: FormData;
  updateForm: (key: keyof FormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const StepThree: React.FC<StepThreeProps> = ({ 
  formData, 
  updateForm, 
  onNext, 
  onBack, 
  isSubmitting 
}) => {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate budget
    if (!formData.budget) {
      newErrors.budget = "Budget is required";
    } else if (
      typeof formData.budget === 'string' && 
      !/^\d+$/.test(formData.budget)
    ) {
      newErrors.budget = "Budget must be a number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleCheckboxChange = (name: keyof typeof formData.specialRequirements) => {
    updateForm('specialRequirements', {
      ...formData.specialRequirements,
      [name]: !formData.specialRequirements[name]
    });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update if empty or numeric
    if (value === '' || /^\d+$/.test(value)) {
      updateForm('budget', value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Financial & Special Requirements</h2>

      <div className="space-y-6">
        {/* Budget */}
        <div className="space-y-2">
          <Label htmlFor="budget">Total Budget (in Euros)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
            <Input
              id="budget"
              type="text"
              inputMode="numeric"
              className={`pl-7 ${errors.budget ? 'border-red-500' : ''}`}
              placeholder="5000"
              value={formData.budget}
              onChange={handleBudgetChange}
            />
          </div>
          {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
          <p className="text-sm text-muted-foreground">
            Enter your total budget for tuition fees and living expenses combined.
          </p>
        </div>

        {/* Scholarship */}
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="scholarshipRequired"
            checked={formData.specialRequirements.scholarshipRequired}
            onCheckedChange={() => handleCheckboxChange('scholarshipRequired')}
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="scholarshipRequired"
              className="text-base cursor-pointer"
            >
              I'm looking for scholarship options
            </Label>
            <p className="text-sm text-muted-foreground">
              We'll prioritize programs with scholarship opportunities.
            </p>
          </div>
        </div>

        {/* Religious Facilities */}
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="religiousFacilities"
            checked={formData.specialRequirements.religiousFacilities}
            onCheckedChange={() => handleCheckboxChange('religiousFacilities')}
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="religiousFacilities"
              className="text-base cursor-pointer"
            >
              I need access to religious facilities
            </Label>
            <p className="text-sm text-muted-foreground">
              Such as prayer rooms, mosques, or churches near the institution.
            </p>
          </div>
        </div>

        {/* Halal Food */}
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="halalFood"
            checked={formData.specialRequirements.halalFood}
            onCheckedChange={() => handleCheckboxChange('halalFood')}
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="halalFood"
              className="text-base cursor-pointer"
            >
              I require halal food options
            </Label>
            <p className="text-sm text-muted-foreground">
              We'll consider locations with good access to halal food.
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Complete Consultation'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
