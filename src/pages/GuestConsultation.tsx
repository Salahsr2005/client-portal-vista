import { GuestModeWrapper } from "@/components/layout/GuestModeWrapper"
import ProgramConsultationFlow from "@/components/consultation/ProgramConsultationFlow"

export default function GuestConsultation() {
  return (
    <GuestModeWrapper>
      <ProgramConsultationFlow />
    </GuestModeWrapper>
  )
}
