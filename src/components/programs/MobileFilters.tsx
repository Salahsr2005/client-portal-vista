
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";

interface MobileFiltersProps {
  selectedCountry: string;
  selectedLevel: string;
  selectedField: string;
  selectedLanguage: string;
  maxBudget?: number;
  withScholarship: boolean;
  onCountryChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onFieldChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onBudgetChange: (value: number) => void;
  onScholarshipChange: (value: boolean) => void;
  onClose: () => void;
}

export default function MobileFilters({
  selectedCountry,
  selectedLevel,
  selectedField,
  selectedLanguage,
  maxBudget = 50000,
  withScholarship,
  onCountryChange,
  onLevelChange,
  onFieldChange,
  onLanguageChange,
  onBudgetChange,
  onScholarshipChange,
  onClose
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [budget, setBudget] = useState([0, maxBudget]);

  const activeFiltersCount = [selectedCountry, selectedLevel, selectedField, selectedLanguage].filter(f => f && f !== "").length + (withScholarship ? 1 : 0) + (budget[1] < 50000 ? 1 : 0);

  const clearAllFilters = () => {
    onCountryChange("");
    onLevelChange("");
    onFieldChange("");
    onLanguageChange("");
    onBudgetChange(50000);
    onScholarshipChange(false);
    setBudget([0, 50000]);
    onClose();
    setIsOpen(false);
  };

  const applyFilters = () => {
    onBudgetChange(budget[1]);
    onClose();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Programs</SheetTitle>
          <SheetDescription>
            Refine your search to find the perfect program
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-4">
          {/* Study Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Study Level</Label>
            <Select value={selectedLevel} onValueChange={onLevelChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="Bachelor">Bachelor</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Certificate">Certificate</SelectItem>
                <SelectItem value="Diploma">Diploma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Country</Label>
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Spain">Spain</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="Italy">Italy</SelectItem>
                <SelectItem value="Belgium">Belgium</SelectItem>
                <SelectItem value="Portugal">Portugal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Field of Study</Label>
            <Select value={selectedField} onValueChange={onFieldChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Fields" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Fields</SelectItem>
                <SelectItem value="Business">Business & Management</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Medicine">Medicine & Health</SelectItem>
                <SelectItem value="Arts">Arts & Humanities</SelectItem>
                <SelectItem value="Law">Law</SelectItem>
                <SelectItem value="Sciences">Sciences</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Language</Label>
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Languages</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Budget Range (€): {budget[0].toLocaleString()} - {budget[1].toLocaleString()}
            </Label>
            <Slider
              value={budget}
              onValueChange={setBudget}
              min={0}
              max={50000}
              step={1000}
              className="w-full"
            />
          </div>

          {/* Scholarship */}
          <div className="flex items-center space-x-2">
            <Switch
              id="scholarship"
              checked={withScholarship}
              onCheckedChange={onScholarshipChange}
            />
            <Label htmlFor="scholarship" className="text-sm font-medium">
              Scholarship Available
            </Label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={clearAllFilters} className="flex-1">
            Clear All
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
