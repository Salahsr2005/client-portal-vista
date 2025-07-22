import React from 'react';
import { GuestModeWrapper } from '@/components/layout/GuestModeWrapper';
import ModernDestinations from './ModernDestinations';

export default function GuestDestinations() {
  return (
    <GuestModeWrapper>
      <ModernDestinations />
    </GuestModeWrapper>
  );
}