import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";

interface ShimmerButtonProps extends ButtonProps {
  shimmer?: boolean;
}

export function ShimmerButton({ 
  className, 
  children, 
  shimmer = true, 
  ...props 
}: ShimmerButtonProps) {
  return (
    <Button
      className={cn(
        "relative overflow-hidden",
        shimmer && [
          "before:absolute before:inset-0",
          "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
          "before:transform before:-skew-x-12 before:-translate-x-full",
          "before:transition-transform before:duration-1000",
          "hover:before:translate-x-full",
          "before:animate-shimmer"
        ],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  );
}