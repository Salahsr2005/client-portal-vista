import React from 'react';
import { GuestModeWrapper } from '@/components/layout/GuestModeWrapper';
import Programs from './Programs';

export default function GuestPrograms() {
  return (
    <GuestModeWrapper>
      <Programs />
    </GuestModeWrapper>
  );
}