"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ShimmerButtonProps extends ButtonProps {
  shimmer?: boolean
  borderRadius?: string
  background?: string
  className?: string
}

export function ShimmerButton({
  className,
  children,
  shimmer = true,
  borderRadius = "0.5rem",
  background = "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)",
  ...props
}: ShimmerButtonProps) {
  return (
    <motion.div className="relative inline-block" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        className={cn(
          "relative overflow-hidden border-0 text-white font-medium",
          "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
          "hover:from-blue-600 hover:via-purple-600 hover:to-pink-600",
          "transition-all duration-300",
          shimmer && [
            "before:absolute before:inset-0",
            "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
            "before:transform before:-skew-x-12 before:-translate-x-full",
            "before:transition-transform before:duration-1000",
            "hover:before:translate-x-full",
            "before:z-10",
          ],
          className,
        )}
        style={{
          borderRadius,
          background: shimmer ? undefined : background,
        }}
        {...props}
      >
        <span className="relative z-20">{children}</span>
        {shimmer && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-100" />
        )}
      </Button>
    </motion.div>
  )
}
