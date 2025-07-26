import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import UnifiedConsultationFlow from "@/components/consultation/UnifiedConsultationFlow"

export default function GuestConsultation() {
  return (
    <GuestModeWrapper>
      <UnifiedConsultationFlow />
    </GuestModeWrapper>
  )
}

