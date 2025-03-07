
import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  isYearly: boolean;
}

export function PricingCard({ 
  name, 
  price, 
  description, 
  features, 
  buttonText, 
  popular = false,
  isYearly,
}: PricingCardProps) {
  return (
    <Card 
      className={cn(
        "animate-on-scroll opacity-0 flex flex-col h-full relative overflow-hidden transition-all duration-300",
        popular ? "border-primary shadow-md" : ""
      )}
    >
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rotate-0 rounded-bl-lg">
            Popular
          </div>
        </div>
      )}
      
      <CardHeader className="pb-0">
        <h3 className="text-2xl font-bold">{name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold">${price}</span>
          <span className="ml-1 text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
        </div>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="flex-grow pt-6">
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className={cn(
            "w-full",
            popular ? "" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
