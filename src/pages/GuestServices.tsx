import React from 'react';
import { GuestModeWrapper } from '@/components/layout/GuestModeWrapper';
import Services from './Services';

export default function GuestServices() {
  return (
    <GuestModeWrapper>
      <Services />
    </GuestModeWrapper>
  );
}
