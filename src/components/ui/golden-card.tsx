"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GoldenCardProps {
  children: ReactNode
  className?: string
  isUrgent?: boolean
  onClick?: () => void
}

export function GoldenCard({ children, className, isUrgent = false, onClick }: GoldenCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        rotateY: 5,
        rotateX: 2,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      style={{ perspective: "1000px" }}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
    >
      <Card
        className={cn(
          "relative overflow-hidden border-0 shadow-2xl",
          "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-200/20 before:via-yellow-300/30 before:to-amber-400/20",
          'after:absolute after:inset-0 after:bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] after:opacity-30',
          isUrgent && "ring-4 ring-red-500/50 ring-offset-2 ring-offset-background animate-pulse",
        )}
      >
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-amber-600/40 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-amber-600/40 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-amber-600/40 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-amber-600/40 rounded-br-lg" />

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />

        {/* Embossed border */}
        <div className="absolute inset-0 rounded-lg border-2 border-amber-400/60 shadow-inner" />

        {/* Content */}
        <div className="relative z-10 text-amber-900">{children}</div>

        {/* Holographic effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      </Card>
    </motion.div>
  )
}
