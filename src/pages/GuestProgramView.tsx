import React from 'react';
import { GuestModeWrapper } from '@/components/layout/GuestModeWrapper';
import ProgramView from './ProgramView';

export default function GuestProgramView() {
  return (
    <GuestModeWrapper>
      <ProgramView />
    </GuestModeWrapper>
  );
}