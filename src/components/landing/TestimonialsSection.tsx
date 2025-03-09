
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader, MapPin, Star } from "lucide-react";

interface TestimonialsSectionProps {
  destinations: any[];
  isLoading: boolean;
}

export function TestimonialsSection({ destinations, isLoading }: TestimonialsSectionProps) {
  const { t } = useTranslation();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  };

  // Fallback testimonials if no destinations are available
  const fallbackTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "United States",
      image: "/images/destination-1.jpg",
      rating: 5,
      text: "Euro Visa made my dream of studying abroad a reality. Their guidance throughout the visa process was invaluable!",
      position: "Graduate Student"
    },
    {
      id: 2,
      name: "Mohammed Al-Farsi",
      location: "United Arab Emirates",
      image: "/images/destination-2.jpg",
      rating: 5,
      text: "The team provided exceptional support for my family's immigration process. Highly recommended for their expertise and dedication.",
      position: "IT Professional"
    },
    {
      id: 3,
      name: "Elena Petrov",
      location: "Russia",
      image: "/images/destination-3.jpg",
      rating: 4,
      text: "I'm grateful for the personalized attention and strategic advice that helped me secure admission to my top-choice university.",
      position: "Medical Student"
    },
    {
      id: 4,
      name: "Raj Patel",
      location: "India",
      image: "/images/destination-4.jpg",
      rating: 5,
      text: "From application to arrival, Euro Visa provided comprehensive support that made my transition to studying abroad seamless.",
      position: "Engineering Student"
    },
    {
      id: 5,
      name: "Liu Wei",
      location: "China",
      image: "/images/destination-5.jpg",
      rating: 5,
      text: "The consultants were extremely knowledgeable about visa requirements and guided me through every step of the process.",
      position: "Business Professional"
    },
    {
      id: 6,
      name: "Maria Garcia",
      location: "Mexico",
      image: "/images/destination-6.jpg",
      rating: 4,
      text: "Euro Visa's expertise and attention to detail ensured my visa application was approved on the first attempt.",
      position: "Research Scholar"
    }
  ];

  // Map destinations to testimonials
  const testimonials = destinations.length > 0 
    ? destinations.map((destination, index) => ({
        id: destination.id,
        name: fallbackTestimonials[index % fallbackTestimonials.length].name,
        location: destination.name,
        image: destination.image || `/images/destination-${index % 6 + 1}.jpg`,
        rating: 4 + (index % 2),
        text: destination.description || fallbackTestimonials[index % fallbackTestimonials.length].text,
        position: fallbackTestimonials[index % fallbackTestimonials.length].position
      }))
    : fallbackTestimonials;

  return (
    <section className="py-24">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("testimonials.title", "What Our Clients Say")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("testimonials.subtitle", "Hear from students and professionals who've successfully achieved their international goals with our support.")}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id} 
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border border-primary/10 hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/20">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{testimonial.name}</h4>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {testimonial.location}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < testimonial.rating 
                                ? "text-yellow-500 fill-yellow-500" 
                                : "text-muted-foreground"
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <span className="absolute top-0 left-0 text-6xl text-primary/10">"</span>
                      <p className="pt-4 relative z-10 text-muted-foreground">
                        {testimonial.text}
                      </p>
                      <div className="mt-4 text-sm font-medium text-primary">
                        {testimonial.position}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
