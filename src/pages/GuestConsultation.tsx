import React from 'react';
import { GuestModeWrapper } from '@/components/layout/GuestModeWrapper';
import Consultation from './Consultation';

export default function GuestConsultation() {
  return (
    <GuestModeWrapper>
      <Consultation />
    </GuestModeWrapper>
  );
}