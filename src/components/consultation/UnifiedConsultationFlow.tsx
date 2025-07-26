"use client"

import { useState } from "react"
import ConsultationTypeSelector from "./ConsultationTypeSelector"
import DestinationConsultationFlow from "./DestinationConsultationFlow"
import ProgramConsultationFlow from "./ProgramConsultationFlow"

export default function UnifiedConsultationFlow() {
  const [consultationType, setConsultationType] = useState<"destinations" | "programs" | null>(null)

  const handleSelectType = (type: "destinations" | "programs") => {
    setConsultationType(type)
  }

  const handleBackToSelection = () => {
    setConsultationType(null)
  }

  if (!consultationType) {
    return <ConsultationTypeSelector onSelectType={handleSelectType} />
  }

  if (consultationType === "destinations") {
    return <DestinationConsultationFlow />
  }

  if (consultationType === "programs") {
    return <ProgramConsultationFlow />
  }

  return null
}
