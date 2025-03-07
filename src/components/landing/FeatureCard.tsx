
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

export function FeatureCard({ title, description, icon: Icon, index }: FeatureCardProps) {
  return (
    <Card 
      className={cn(
        "animate-on-scroll opacity-0 hover:shadow-md transition-all duration-300 border-none overflow-hidden",
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
