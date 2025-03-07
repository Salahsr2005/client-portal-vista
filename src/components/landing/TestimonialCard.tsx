
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  index: number;
}

export function TestimonialCard({ name, role, content, avatar, index }: TestimonialCardProps) {
  return (
    <Card 
      className={cn(
        "animate-on-scroll opacity-0 hover:shadow-md transition-all duration-300",
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-primary">★</span>
          ))}
        </div>
        
        <p className="italic mb-6">{content}</p>
        
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
