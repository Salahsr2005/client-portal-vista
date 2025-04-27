
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  Globe,
  Calendar,
  Clock,
  GraduationCap,
  Building,
  CircleDollarSign,
  Share2,
  Heart,
  Award,
  MapPin,
  FileText,
  Users,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Program {
  id: string;
  name: string;
  university: string;
  location: string;
  type: string;
  duration: string;
  tuition: string;
  rating: number;
  deadline: string;
  subjects: string[];
  applicationFee: string;
  featured: boolean;
  requirements: string;
  description: string;
  program_language?: string;
  living_cost_min?: number;
  tuition_min?: number;
  admission_requirements?: string;
  field_keywords?: string[];
  // Adding the missing properties that were causing errors
  image_url?: string;
  study_level?: string;
  country?: string;
  advantages?: string;
  application_process?: string;
  employment_rate?: number;
  academic_requirements?: string;
  language_test?: string;
  language_test_score?: string;
  language_test_exemptions?: string;
  scholarship_available?: boolean;
  scholarship_details?: string;
  city?: string;
  living_cost_max?: number;
  application_deadline?: string;
}

export default function ProgramView() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: program, isLoading, error } = useQuery({
    queryKey: ['program', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as unknown as Program;
    },
  });

  useEffect(() => {
    // Simulate fetching favorite status from local storage or database
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      setIsFavorite(favorites.includes(id));
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Simulate saving favorite status to local storage or database
    const storedFavorites = localStorage.getItem('favorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (!isFavorite) {
      favorites.push(id);
      toast({
        title: 'Added to favorites',
        description: 'You can view your favorite programs in your profile.',
      });
    } else {
      favorites = favorites.filter((favId: string) => favId !== id);
      toast({
        title: 'Removed from favorites',
        description: 'This program has been removed from your favorites.',
      });
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const shareProgram = () => {
    if (navigator.share) {
      navigator
        .share({
          title: program?.name,
          text: `Check out this program: ${program?.name} at ${program?.university}`,
          url: window.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied to clipboard',
        description: 'Share this link with your friends!',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium mt-4">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold">Program not found</h2>
          <p className="text-muted-foreground mt-2">
            We couldn't find the program you were looking for.
          </p>
          <Button asChild className="mt-6">
            <Link to="/programs">Browse All Programs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      {/* Hero section with program image */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div 
          className="h-64 bg-cover bg-center" 
          style={{ 
            backgroundImage: program.image_url 
              ? `url(${program.image_url})` 
              : `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop')` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-6 text-white">
              <div className="flex gap-2 mb-2">
                {program.featured && (
                  <Badge variant="default" className="bg-primary">
                    <Award className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge variant="secondary">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {program.type || program.study_level}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">{program.name}</h1>
              <p className="text-white/90 mt-1">
                {program.university}, {program.location || program.country}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="border border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
              <Clock className="h-3 w-3 mr-1" />
              {program.duration}
            </Badge>
            <Badge variant="outline" className="border border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <CircleDollarSign className="h-3 w-3 mr-1" />
              {program.tuition_min ? `€${program.tuition_min.toLocaleString()}` : program.tuition}
            </Badge>
            <Badge variant="outline" className="border border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
              <Globe className="h-3 w-3 mr-1" />
              {program.program_language || "English"}
            </Badge>
          </div>
        </div>
        <div className="space-x-2 flex items-center">
          <Button variant="outline" size="sm" onClick={shareProgram}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="sm"
            onClick={toggleFavorite}
            className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
          >
            <Heart className="h-4 w-4 mr-2" fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Program Overview</h2>
              <p className="text-muted-foreground mb-6">{program.description}</p>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="subjects">Subjects</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Program Advantages</h3>
                    <p className="text-sm text-muted-foreground">{program.advantages || "Contact university for more information about program advantages."}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Application Process</h3>
                    <p className="text-sm text-muted-foreground">{program.application_process || "The application process typically involves submitting an online application form, academic transcripts, and other supporting documents."}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Career Opportunities</h3>
                    <p className="text-sm text-muted-foreground">
                      {program.employment_rate ? 
                        `This program has a ${program.employment_rate}% employment rate after graduation.` : 
                        "Graduates from this program typically find employment in various sectors related to their field of study."}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="requirements" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Admission Requirements</h3>
                    <p className="text-sm text-muted-foreground">{program.admission_requirements}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Academic Requirements</h3>
                    <p className="text-sm text-muted-foreground">{program.academic_requirements || "Contact the university for specific academic requirements."}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Language Requirements</h3>
                    <p className="text-sm text-muted-foreground">
                      Language of instruction: <strong>{program.program_language}</strong><br />
                      {program.language_test && `Required test: ${program.language_test} (${program.language_test_score || "Contact university for minimum score"})`}
                      {program.language_test_exemptions && <><br />Exemptions: {program.language_test_exemptions}</>}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="subjects" className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {program.field_keywords?.map((subject, index) => (
                      <Badge key={index} variant="outline" className="py-1">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  
                  {!program.field_keywords?.length && (
                    <p className="text-sm text-muted-foreground">
                      Contact the university for detailed information about specific subjects covered in this program.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is the application process?</AccordionTrigger>
                  <AccordionContent>
                    The application process typically involves filling out an online
                    application form, submitting transcripts, providing letters of
                    recommendation, and paying an application fee. Specific
                    requirements may vary depending on the program.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    What are the language requirements?
                  </AccordionTrigger>
                  <AccordionContent>
                    Most programs require proof of proficiency in {program.program_language}, such as a
                    {program.language_test || " TOEFL or IELTS"} score. Some programs may also have requirements
                    for other languages.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Is financial aid available for international students?
                  </AccordionTrigger>
                  <AccordionContent>
                    {program.scholarship_available ? 
                      <>Yes, scholarships are available for this program. {program.scholarship_details || "Contact the university for more information about eligibility and application process."}</> : 
                      "Many universities offer scholarships and financial aid options for international students. It is recommended to check the university's website or contact the admissions office for more information."}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    What is the cost of living in {program.city || program.country}?
                  </AccordionTrigger>
                  <AccordionContent>
                    The estimated monthly living cost in {program.city || program.country} is between 
                    €{program.living_cost_min?.toLocaleString() || "800"} and 
                    €{program.living_cost_max?.toLocaleString() || "1200"}, 
                    which includes accommodation, food, transportation, and other personal expenses.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Key Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Application Deadline</h3>
                    <p className="text-sm text-muted-foreground">
                      {program.application_deadline || new Date(program.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <CircleDollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Application Fee</h3>
                    <p className="text-sm text-muted-foreground">
                      {program.applicationFee}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Duration</h3>
                    <p className="text-sm text-muted-foreground">
                      {program.duration_months ? `${program.duration_months} months` : program.duration}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      {program.city || program.location}, {program.country}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <CircleDollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Tuition Fee</h3>
                    <p className="text-sm text-muted-foreground">
                      {program.tuition_min ? `€${program.tuition_min.toLocaleString()}` : program.tuition}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Living Cost (Monthly)</h3>
                    <p className="text-sm text-muted-foreground">
                      {program.living_cost_min ? `€${program.living_cost_min.toLocaleString()}` : "€800 - €1200 (estimated)"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Available Places</h3>
                    <p className="text-sm text-muted-foreground">
                      {program.available_places || "Contact university"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {program.scholarship_available && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Award className="h-5 w-5 text-primary mr-2" />
                  Scholarship Information
                </h2>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {program.scholarship_details || "This program offers scholarship opportunities. Please contact the university for more information about eligibility criteria and application process."}
                  </p>
                  {program.scholarship_amount && (
                    <div className="flex items-center gap-1 text-sm">
                      <CircleDollarSign className="h-4 w-4 text-primary" />
                      <span>Amount: up to €{program.scholarship_amount}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">University Information</h2>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={program.university} />
                  <AvatarFallback>{program.university.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{program.university}</h3>
                  <p className="text-sm text-muted-foreground">{program.city || program.location}, {program.country}</p>
                </div>
              </div>
              {program.ranking && (
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>Ranking: #{program.ranking} Worldwide</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-2">Ready to Apply?</h2>
              <p className="text-sm mb-4 text-primary-foreground/80">
                Take the next step towards your education journey.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-white text-primary hover:bg-white/90" asChild>
                  <Link to={`/applications/new?program=${program.id}`}>
                    <FileText className="mr-2 h-4 w-4" /> Start Application
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10" asChild>
                  <Link to="/appointments">
                    <Calendar className="mr-2 h-4 w-4" /> Book a Consultation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
