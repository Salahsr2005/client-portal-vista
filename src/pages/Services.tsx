
import { useState } from "react";
import { 
  Settings, 
  Search, 
  Calendar, 
  ClipboardCheck, 
  CheckCircle, 
  Users, 
  FileText, 
  Phone, 
  MapPin, 
  Clock,
  MessagesSquare,
  BookOpen,
  Edit,
  Globe,
  Star
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Service categories
const serviceCategories = [
  { id: "all", name: "All Services" },
  { id: "consulting", name: "Consulting" },
  { id: "application", name: "Application Support" },
  { id: "document", name: "Document Preparation" },
  { id: "language", name: "Language Assistance" },
  { id: "interview", name: "Interview Prep" },
  { id: "visa", name: "Visa Services" },
];

// Services data
const services = [
  {
    id: 1,
    name: "Application Review",
    description: "Complete application review and feedback from experienced consultants",
    price: "$299",
    duration: "7 days",
    category: "application",
    features: [
      "Line-by-line application review",
      "Improvement suggestions",
      "Follow-up consultation",
      "Document organization tips",
      "Final review before submission"
    ],
    popular: true
  },
  {
    id: 2,
    name: "Personal Statement Editing",
    description: "Professional editing and feedback for your personal statement",
    price: "$199",
    duration: "5 days",
    category: "document",
    features: [
      "Content evaluation",
      "Grammar and style correction",
      "Structural improvements",
      "Two revision rounds",
      "Final polishing"
    ],
    popular: true
  },
  {
    id: 3,
    name: "University Selection Consultation",
    description: "Expert guidance to select universities matching your profile and goals",
    price: "$149",
    duration: "1 hour",
    category: "consulting",
    features: [
      "Profile evaluation",
      "University shortlisting",
      "Program recommendations",
      "Admission probability assessment",
      "Written report"
    ],
    popular: false
  },
  {
    id: 4,
    name: "Mock Interview",
    description: "Practice interviews with feedback from experienced consultants",
    price: "$129",
    duration: "45 minutes",
    category: "interview",
    features: [
      "Realistic interview simulation",
      "Immediate feedback",
      "Common questions coverage",
      "Body language assessment",
      "Follow-up tips"
    ],
    popular: false
  },
  {
    id: 5,
    name: "Visa Application Assistance",
    description: "Complete guidance for student visa application process",
    price: "$249",
    duration: "Varies",
    category: "visa",
    features: [
      "Document checklist",
      "Form filling assistance",
      "Interview preparation",
      "Visa requirements guidance",
      "Follow-up support"
    ],
    popular: false
  },
  {
    id: 6,
    name: "Language Test Preparation",
    description: "Personalized coaching for IELTS, TOEFL, or other language tests",
    price: "$349",
    duration: "4 weeks",
    category: "language",
    features: [
      "Personalized study plan",
      "Weekly practice sessions",
      "Mock tests with evaluation",
      "Targeted skill improvement",
      "Tips and strategies"
    ],
    popular: true
  },
];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "all" || 
      service.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Education Services</h1>
      
      {/* Services overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Our Services
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Expert assistance for your educational journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We provide comprehensive services to help you achieve your academic goals, from application assistance to interview preparation.
            </p>
            <Button variant="secondary" className="w-full">
              Schedule a Consultation
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
              <span className="text-sm">+1 (800) 123-4567</span>
            </div>
            <div className="flex items-center">
              <MessagesSquare className="h-4 w-4 mr-3 text-muted-foreground" />
              <span className="text-sm">support@vistaedu.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
              <span className="text-sm">123 Education St, New York, NY</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
              <span className="text-sm">Mon-Fri: 9am-6pm EST</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Service Guarantees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
              <span className="text-sm">100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
              <span className="text-sm">Expert Consultants</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
              <span className="text-sm">On-time Delivery</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
              <span className="text-sm">Secure & Confidential</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Services search and tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Available Services</CardTitle>
              <CardDescription>
                Browse our range of educational services to support your application journey
              </CardDescription>
            </div>
            <div className="relative mt-4 md:mt-0 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search services..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <div className="overflow-auto pb-2">
              <TabsList className="inline-flex w-max">
                {serviceCategories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="whitespace-nowrap">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value={activeCategory} className="pt-4">
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <Card key={service.id} className={service.popular ? "border-primary" : ""}>
                      {service.popular && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary">Popular</Badge>
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span className="text-xl font-bold">{service.price}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Includes:</p>
                          <ul className="space-y-1">
                            {service.features.map((feature, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="pt-2 grid grid-cols-2 gap-2">
                          <Button variant="default" className="w-full">
                            Book Now
                          </Button>
                          <Button variant="outline" className="w-full">
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium">No services found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    {searchQuery
                      ? "No services match your search criteria. Try adjusting your search term."
                      : "No services available in this category at the moment."}
                  </p>
                  <Button onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}>
                    View All Services
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Featured services section */}
      <div className="bg-muted rounded-lg p-6 mt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">How Our Services Help You</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive suite of services is designed to support you at every stage of your educational journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Edit className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-2">Document Preparation</h3>
            <p className="text-sm text-muted-foreground">
              Expert assistance with personal statements, CVs, and application essays
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-2">Interview Coaching</h3>
            <p className="text-sm text-muted-foreground">
              One-on-one coaching to help you excel in admission and visa interviews
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-2">University Selection</h3>
            <p className="text-sm text-muted-foreground">
              Personalized guidance to find the perfect universities for your goals
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button className="px-8">
            View All Services
          </Button>
        </div>
      </div>
    </div>
  );
}
