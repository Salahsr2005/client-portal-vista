
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface MobileFiltersProps {
  studyLevel: string;
  setStudyLevel: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  field: string;
  setField: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  budget: number[];
  setBudget: (value: number[]) => void;
  onFilterChange: () => void;
}

export default function MobileFilters({
  studyLevel,
  setStudyLevel,
  country,
  setCountry,
  field,
  setField,
  language,
  setLanguage,
  budget,
  setBudget,
  onFilterChange
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = [studyLevel, country, field, language].filter(f => f && f !== "").length + (budget[1] < 50000 ? 1 : 0);

  const clearAllFilters = () => {
    setStudyLevel("");
    setCountry("");
    setField("");
    setLanguage("");
    setBudget([0, 50000]);
    onFilterChange();
    setIsOpen(false);
  };

  const applyFilters = () => {
    onFilterChange();
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
            <label className="text-sm font-medium">Study Level</label>
            <Select value={studyLevel} onValueChange={setStudyLevel}>
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
            <label className="text-sm font-medium">Country</label>
            <Select value={country} onValueChange={setCountry}>
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
            <label className="text-sm font-medium">Field of Study</label>
            <Select value={field} onValueChange={setField}>
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
            <label className="text-sm font-medium">Language</label>
            <Select value={language} onValueChange={setLanguage}>
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
            <label className="text-sm font-medium">
              Budget Range (€): {budget[0].toLocaleString()} - {budget[1].toLocaleString()}
            </label>
            <Slider
              value={budget}
              onValueChange={setBudget}
              min={0}
              max={50000}
              step={1000}
              className="w-full"
            />
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
