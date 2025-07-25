
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Heart,
  Utensils,
  Trophy,
  Home,
  Briefcase,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface PreferencesStepProps {
  data: any;
  updateData: (data: any) => void;
  onValidation: (isValid: boolean) => void;
}

export function PreferencesStep({ data, updateData, onValidation }: PreferencesStepProps) {
  const {
    religiousFacilities,
    halalFood,
    scholarshipRequired,
    accommodationPreference,
    workWhileStudying,
    startDatePreference
  } = data;

  useEffect(() => {
    // Always valid since preferences are optional
    onValidation(true);
  }, [onValidation]);

  const handlePreferenceChange = (key: string, value: any) => {
    updateData({ [key]: value });
  };

  const preferenceItems = [
    {
      key: 'religiousFacilities',
      title: 'Religious Facilities',
      description: 'Access to prayer rooms, religious centers',
      icon: Heart,
      value: religiousFacilities,
      type: 'switch'
    },
    {
      key: 'halalFood',
      title: 'Halal Food Availability',
      description: 'Halal dining options on campus',
      icon: Utensils,
      value: halalFood,
      type: 'switch'
    },
    {
      key: 'scholarshipRequired',
      title: 'Scholarship Required',
      description: 'Only show programs with scholarship opportunities',
      icon: Trophy,
      value: scholarshipRequired,
      type: 'switch'
    },
    {
      key: 'workWhileStudying',
      title: 'Work While Studying',
      description: 'Part-time work opportunities during studies',
      icon: Briefcase,
      value: workWhileStudying,
      type: 'switch'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Additional Preferences</h2>
        <p className="text-muted-foreground text-lg">
          Tell us about any specific requirements or preferences
        </p>
      </div>

      {/* Preference Switches */}
      <div className="grid md:grid-cols-2 gap-4">
        {preferenceItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`transition-all duration-300 ${
              item.value ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:shadow-md'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      item.value 
                        ? 'bg-green-100 dark:bg-green-800 text-green-600' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <Label className="font-medium">{item.title}</Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={item.value}
                    onCheckedChange={(checked) => handlePreferenceChange(item.key, checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Preferences */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-indigo-600" />
                <Label className="font-medium">Accommodation Preference</Label>
              </div>
              <Select 
                value={accommodationPreference} 
                onValueChange={(value) => handlePreferenceChange('accommodationPreference', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose accommodation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dormitory">University Dormitory</SelectItem>
                  <SelectItem value="shared">Shared Apartment</SelectItem>
                  <SelectItem value="studio">Private Studio</SelectItem>
                  <SelectItem value="homestay">Homestay</SelectItem>
                  <SelectItem value="no-preference">No Preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <Label className="font-medium">Preferred Start Date</Label>
              </div>
              <Select 
                value={startDatePreference} 
                onValueChange={(value) => handlePreferenceChange('startDatePreference', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="When do you want to start?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="september-2024">September 2024</SelectItem>
                  <SelectItem value="january-2025">January 2025</SelectItem>
                  <SelectItem value="september-2025">September 2025</SelectItem>
                  <SelectItem value="january-2026">January 2026</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary of Selected Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Preferences Summary</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {religiousFacilities && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Religious Facilities
                </Badge>
              )}
              {halalFood && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Halal Food
                </Badge>
              )}
              {scholarshipRequired && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Scholarship Required
                </Badge>
              )}
              {workWhileStudying && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Work While Studying
                </Badge>
              )}
              {accommodationPreference && (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  {accommodationPreference.charAt(0).toUpperCase() + accommodationPreference.slice(1)} Housing
                </Badge>
              )}
              {startDatePreference && (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                  Start: {startDatePreference}
                </Badge>
              )}
            </div>

            {!religiousFacilities && !halalFood && !scholarshipRequired && !workWhileStudying && 
             !accommodationPreference && !startDatePreference && (
              <p className="text-muted-foreground">
                No specific preferences selected - we'll show you all suitable programs
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
