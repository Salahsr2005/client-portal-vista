
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Locate, FileQuestion, Languages, Laptop, Users, Phone, Building, CreditCard } from "lucide-react";

const servicesData = [
  {
    id: "service-1",
    title: "Document Authentication",
    description: "Get your academic documents authenticated and verified for international use.",
    icon: FileQuestion,
    price: "2,500 DZD",
    processingTime: "3-5 business days",
    popular: true
  },
  {
    id: "service-2",
    title: "Translation Services",
    description: "Professional translation of documents into English, French, and other languages.",
    icon: Languages,
    price: "1,200 DZD per page",
    processingTime: "2-3 business days",
    popular: false
  },
  {
    id: "service-3",
    title: "CV & Personal Statement Review",
    description: "Expert review and improvement of your CV and personal statements.",
    icon: FileQuestion,
    price: "3,000 DZD",
    processingTime: "5 business days",
    popular: true
  },
  {
    id: "service-4",
    title: "University Application Assistance",
    description: "Complete guidance through the university application process.",
    icon: Building,
    price: "5,000 DZD",
    processingTime: "Ongoing",
    popular: true
  },
  {
    id: "service-5",
    title: "Visa Consultation",
    description: "Expert advice on visa requirements and application procedures.",
    icon: Locate,
    price: "3,500 DZD",
    processingTime: "1-2 business days",
    popular: false
  },
  {
    id: "service-6",
    title: "Mock Interviews",
    description: "Practice interviews with feedback to prepare for university and visa interviews.",
    icon: Users,
    price: "2,000 DZD per session",
    processingTime: "By appointment",
    popular: false
  },
  {
    id: "service-7",
    title: "Language Proficiency Preparation",
    description: "IELTS, TOEFL, and TCF preparation courses and practice tests.",
    icon: BookOpen,
    price: "7,500 DZD",
    processingTime: "8 weeks course",
    popular: true
  },
  {
    id: "service-8",
    title: "Online Application Support",
    description: "Assisted form-filling and digital document preparation.",
    icon: Laptop,
    price: "1,800 DZD",
    processingTime: "Same day",
    popular: false
  },
  {
    id: "service-9",
    title: "Accommodation Arrangement",
    description: "Assistance in finding and securing accommodation abroad.",
    icon: Building,
    price: "4,000 DZD",
    processingTime: "Varies",
    popular: false
  }
];

const ServiceCard = ({ service }: { service: any }) => {
  const Icon = service.icon;
  
  return (
    <Card className={`flex flex-col h-full ${service.popular ? 'border-primary/50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="bg-primary/10 p-2 rounded-md">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {service.popular && (
            <Badge variant="secondary">Popular</Badge>
          )}
        </div>
        <CardTitle className="mt-4">{service.title}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Price:</span>
          <span>{service.price}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="font-medium">Processing Time:</span>
          <span>{service.processingTime}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Book Service</Button>
      </CardFooter>
    </Card>
  );
};

const ServicesPage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive support for your international education journey, from document preparation to language training.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        
        <div className="bg-muted p-6 rounded-lg mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Need a custom service?</h3>
              <p className="text-muted-foreground">
                Contact our team to discuss your specific requirements.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex gap-2">
                <Phone className="h-4 w-4" />
                Call Us
              </Button>
              <Button className="flex gap-2">
                <CreditCard className="h-4 w-4" />
                Request Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
