
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modernButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400 before:via-purple-400 before:to-pink-400 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        secondary: "border-2 border-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-[2px] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-105",
        ghost: "hover:bg-accent hover:text-accent-foreground bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 px-6 py-2",
        lg: "h-14 px-10 py-4 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modernButtonVariants> {
  asChild?: boolean
  glowEffect?: boolean
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant, size, asChild = false, glowEffect = true, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    if (variant === "secondary") {
      return (
        <div className={cn(modernButtonVariants({ variant, size }), className)}>
          <Comp
            className="bg-background text-foreground rounded-full w-full h-full flex items-center justify-center font-semibold relative z-10"
            ref={ref}
            {...props}
          >
            {children}
          </Comp>
        </div>
      )
    }
    
    return (
      <Comp
        className={cn(modernButtonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        {glowEffect && variant === "primary" && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
        )}
      </Comp>
    )
  }
)
ModernButton.displayName = "ModernButton"

export { ModernButton, modernButtonVariants }
