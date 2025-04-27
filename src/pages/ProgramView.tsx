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

      return data as Program;
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

  const shareProgram = () => {
    if (navigator.share) {
      navigator
        .share({
          title: program.name,
          text: `Check out this program: ${program.name} at ${program.university}`,
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

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{program.name}</h1>
            <p className="text-muted-foreground">
              {program.university}, {program.location}
            </p>
          </div>
          <div className="space-x-2 flex items-center">
            <Button variant="outline" size="icon" onClick={shareProgram}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFavorite}
              className={isFavorite ? 'text-red-500' : ''}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="secondary">
            <GraduationCap className="h-3 w-3 mr-1" />
            {program.type}
          </Badge>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            {program.duration}
          </Badge>
          <Badge variant="secondary">
            <CircleDollarSign className="h-3 w-3 mr-1" />
            {program.tuition}
          </Badge>
          {program.featured && (
            <Badge variant="default">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Key Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Language:</span>
                  <span>{program.program_language || 'English'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Application Deadline:</span>
                  <span>{new Date(program.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span>{program.location}</span>
                </div>
                {program.living_cost_min && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Living Costs:</span>
                    <span>${program.living_cost_min} / month (estimated)</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Application Fee:</span>
                  <span>{program.applicationFee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Student Enrollment:</span>
                  <span>{Math.floor(Math.random() * 5000) + 1000}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Admission Requirements
              </h2>
              <p className="text-muted-foreground">{program.admission_requirements || 'Contact university for details'}</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h2 className="text-xl font-semibold mb-4">Program Description</h2>
            <p className="text-muted-foreground">{program.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subjects Covered</h2>
          <div className="flex flex-wrap gap-2">
            {program.field_keywords?.map((subject, index) => (
              <Badge key={index} variant="outline">
                {subject}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
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
                Most programs require proof of English proficiency, such as a
                TOEFL or IELTS score. Some programs may also have requirements
                for other languages.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Is financial aid available for international students?
              </AccordionTrigger>
              <AccordionContent>
                Yes, many universities offer scholarships and financial aid
                options for international students. It is recommended to check
                the university's website or contact the admissions office for
                more information.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Ready to Apply?</h2>
        <p className="text-muted-foreground mb-4">
          Take the next step towards your education.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
          <Button asChild>
            <Link to="#">Apply Now</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="#">Request Information</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
