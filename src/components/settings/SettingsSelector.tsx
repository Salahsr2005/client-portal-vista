
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { User, Sun, Bell, Lock, Mail } from "lucide-react";

interface SettingsSelectorProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { value: 'account', label: 'Account', icon: User },
  { value: 'appearance', label: 'Appearance', icon: Sun },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'security', label: 'Security', icon: Lock },
  { value: 'email', label: 'Email', icon: Mail },
];

export default function SettingsSelector({ activeSection, onSectionChange }: SettingsSelectorProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full mb-4">
        <Select value={activeSection} onValueChange={onSectionChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Settings Section" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem key={section.value} value={section.value}>
                <div className="flex items-center">
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      {sections.map((section) => (
        <Button
          key={section.value}
          variant={activeSection === section.value ? "default" : "ghost"}
          onClick={() => onSectionChange(section.value)}
          className="justify-start px-4 py-2"
        >
          <section.icon className="h-4 w-4 mr-2" />
          {section.label}
        </Button>
      ))}
    </div>
  );
}
