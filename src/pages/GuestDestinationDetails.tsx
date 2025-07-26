import React from 'react';
import { GuestModeWrapper } from '@/components/layout/GuestModeWrapper';
import DestinationDetails from './DestinationDetails';

export default function GuestDestinationDetails() {
  return (
    <GuestModeWrapper>
      <DestinationDetails />
    </GuestModeWrapper>
  );
}