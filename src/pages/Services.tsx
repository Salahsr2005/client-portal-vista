
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, Briefcase, FileText, Users, Award, 
  Calendar, Globe, MessageSquare, HelpCircle, Star
} from 'lucide-react';

const services = [
  {
    id: 1,
    title: "Academic Advising",
    description: "Get personalized guidance on program selection and academic planning.",
    icon: BookOpen,
    category: "academic",
    featured: true,
    rating: 4.8
  },
  {
    id: 2,
    title: "Career Counseling",
    description: "Career planning and professional development consultations.",
    icon: Briefcase,
    category: "career",
    featured: true,
    rating: 4.7
  },
  {
    id: 3,
    title: "Document Verification",
    description: "Authentication and verification of academic and legal documents.",
    icon: FileText,
    category: "administrative",
    featured: false,
    rating: 4.5
  },
  {
    id: 4,
    title: "Networking Events",
    description: "Connect with alumni and professionals from various fields.",
    icon: Users,
    category: "career",
    featured: false,
    rating: 4.6
  },
  {
    id: 5,
    title: "Scholarship Application Assistance",
    description: "Help with finding and applying for relevant scholarships.",
    icon: Award,
    category: "financial",
    featured: true,
    rating: 4.9
  },
  {
    id: 6,
    title: "Visa Application Support",
    description: "Guidance through the student visa application process.",
    icon: Globe,
    category: "administrative",
    featured: true,
    rating: 4.8
  },
  {
    id: 7,
    title: "Interview Preparation",
    description: "Mock interviews and preparation for program interviews.",
    icon: MessageSquare,
    category: "career",
    featured: false,
    rating: 4.7
  },
  {
    id: 8,
    title: "Financial Aid Counseling",
    description: "Information about financial aid options and budgeting advice.",
    icon: HelpCircle,
    category: "financial",
    featured: false,
    rating: 4.6
  }
];

const testimonials = [
  {
    id: 1,
    name: "Ahmed Benali",
    service: "Academic Advising",
    text: "The academic advising service was incredibly helpful. My advisor helped me choose the perfect program for my career goals.",
    rating: 5
  },
  {
    id: 2,
    name: "Leila Hadad",
    service: "Visa Application Support",
    text: "Navigating the visa process was overwhelming until I used this service. They guided me through every step and my application was approved quickly.",
    rating: 5
  },
  {
    id: 3,
    name: "Karim Taleb",
    service: "Career Counseling",
    text: "The career counselors provided insightful advice that helped me align my studies with my long-term professional goals.",
    rating: 4
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Scholarship Information Session",
    date: "November 15, 2023",
    time: "2:00 PM - 4:00 PM",
    location: "Online Webinar",
    category: "financial"
  },
  {
    id: 2,
    title: "CV Writing Workshop",
    date: "November 20, 2023",
    time: "10:00 AM - 12:00 PM",
    location: "Career Center, Main Campus",
    category: "career"
  },
  {
    id: 3,
    title: "Study Abroad Fair",
    date: "December 5, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "Exhibition Hall, University of Algiers",
    category: "academic"
  }
];

const ServicesPage = () => {
  const [activeTab, setActiveTab] = React.useState("all");
  
  const filteredServices = services.filter(service => {
    if (activeTab === "all") return true;
    return service.category === activeTab;
  });
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Services</h1>
          <p className="text-muted-foreground mt-2">
            Support services to help you succeed in your educational journey
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Book a Consultation
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Services</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="administrative">Administrative</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <p className="text-muted-foreground mb-6">
            Explore all available services to support your educational and professional development.
          </p>
        </TabsContent>
        <TabsContent value="academic" className="mt-4">
          <p className="text-muted-foreground mb-6">
            Services focused on academic support, advising, and educational planning.
          </p>
        </TabsContent>
        <TabsContent value="career" className="mt-4">
          <p className="text-muted-foreground mb-6">
            Career development and professional growth services to prepare for your future.
          </p>
        </TabsContent>
        <TabsContent value="administrative" className="mt-4">
          <p className="text-muted-foreground mb-6">
            Administrative support services including document processing and visa assistance.
          </p>
        </TabsContent>
        <TabsContent value="financial" className="mt-4">
          <p className="text-muted-foreground mb-6">
            Financial assistance, scholarship information, and funding guidance.
          </p>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredServices.map((service) => (
          <Card key={service.id} className="relative">
            {service.featured && (
              <Badge className="absolute top-3 right-3 bg-yellow-500">
                Featured
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <service.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline">{service.category}</Badge>
              </div>
              <CardTitle>{service.title}</CardTitle>
              <div className="flex items-center mt-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(service.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {service.rating.toFixed(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{service.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Testimonials Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">What Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.service}</CardDescription>
                  </div>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <Badge variant="outline">{event.category}</Badge>
                <CardTitle className="text-lg mt-2">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Register</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Contact Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Our student services team is here to assist you with any questions or needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              <span>support@vista-education.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-primary" />
              <span>+213 555 123 456</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              <span>Student Services Center, Main Campus</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button className="flex-1">Contact Us</Button>
          <Button variant="outline" className="flex-1">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServicesPage;
