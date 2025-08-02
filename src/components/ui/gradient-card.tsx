import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string
  glowColor?: string
  children: React.ReactNode
}

const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient = "from-primary/10 via-purple-500/10 to-pink-500/10", glowColor = "primary", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative group",
          className
        )}
        {...props}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10`} />
        
        {/* Card */}
        <div className={`relative bg-gradient-to-r ${gradient} backdrop-blur-sm border border-primary/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
          {children}
        </div>
        
        {/* Border glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-20 blur-sm" />
      </div>
    )
  }
)

GradientCard.displayName = "GradientCard"

export { GradientCard }