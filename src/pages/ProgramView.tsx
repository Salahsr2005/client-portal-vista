
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  Calendar,
  CheckCircle,
  CircleDollarSign,
  Clock,
  FileText,
  GraduationCap,
  Languages,
  LayoutGrid,
  Loader2,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function ProgramView() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: program, isLoading, error } = useQuery({
    queryKey: ["program", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load program details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleApplyNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to apply for this program",
        variant: "default",
      });
      return;
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-16">
        <div className="flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container max-w-6xl py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Program not found</h2>
          <p className="text-muted-foreground mb-6">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/programs">Back to Programs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = program.image_url || `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(program.name)}`;

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link to="/programs">
                  <Button variant="ghost" size="sm">
                    Programs
                  </Button>
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{program.name}</span>
              </div>
              <h1 className="text-3xl font-bold">{program.name}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <Building className="h-4 w-4 mr-1" />
                {program.university}
              </div>
            </div>
            <div className="hidden md:block">
              <Button
                onClick={handleApplyNow}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Apply Now
              </Button>
            </div>
          </div>

          {/* Image Banner */}
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-6">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="bg-opacity-50">
                  {program.study_level}
                </Badge>
                <Badge variant="secondary" className="bg-opacity-50">
                  {program.program_language}
                </Badge>
                {program.scholarship_available && (
                  <Badge variant="secondary" className="bg-opacity-50">
                    Scholarship Available
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-white/70" />
                  {program.country}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-white/70" />
                  {program.duration_months} months
                </div>
                <div className="flex items-center">
                  <CircleDollarSign className="h-4 w-4 mr-1 text-white/70" />
                  ${program.tuition_min.toLocaleString()} / year
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-white/70" />
                  Deadline: {program.application_deadline || "Contact for details"}
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1 text-white/70" />
                  {program.field}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  {program.ranking ? `Ranking: ${program.ranking}` : "Not ranked"}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Apply Button */}
          <div className="block md:hidden mb-4">
            <Button
              onClick={handleApplyNow}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Apply Now
            </Button>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="admission">Admission</TabsTrigger>
              <TabsTrigger value="costs">Costs & Aid</TabsTrigger>
              <TabsTrigger value="living">Living</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Program Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none dark:prose-invert">
                        <p>{program.description}</p>
                        {program.advantages && (
                          <>
                            <h3>Key Advantages</h3>
                            <p>{program.advantages}</p>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Program Features */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Program Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="bg-primary/10 rounded-full p-2 mr-3">
                            <Languages className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Language</h3>
                            <p className="text-sm text-muted-foreground">
                              {program.program_language}
                              {program.secondary_language && `, ${program.secondary_language}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-primary/10 rounded-full p-2 mr-3">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Duration</h3>
                            <p className="text-sm text-muted-foreground">
                              {program.duration_months} months
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-primary/10 rounded-full p-2 mr-3">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Study Level</h3>
                            <p className="text-sm text-muted-foreground">
                              {program.study_level}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-primary/10 rounded-full p-2 mr-3">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Places Available</h3>
                            <p className="text-sm text-muted-foreground">
                              {program.available_places === null
                                ? "Contact for details"
                                : program.available_places}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-primary/10 rounded-full p-2 mr-3">
                            <LayoutGrid className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Field</h3>
                            <p className="text-sm text-muted-foreground">
                              {program.field}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-primary/10 rounded-full p-2 mr-3">
                            <Star className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Success Rate</h3>
                            <p className="text-sm text-muted-foreground">
                              {program.success_rate 
                                ? `${program.success_rate}%`
                                : "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Facts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">University</p>
                          <p className="font-medium">{program.university}</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">
                            {program.city}, {program.country}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Application Deadline</p>
                          <p className="font-medium">
                            {program.application_deadline || "Contact for details"}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Tuition Fee</p>
                          <p className="font-medium">
                            ${program.tuition_min.toLocaleString()} - ${program.tuition_max.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(program.website_url, "_blank")}
                        disabled={!program.website_url}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Program Website
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {program.scholarship_available && (
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Scholarships Available
                          </li>
                        )}
                        {program.internship_opportunities && (
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Internship Opportunities
                          </li>
                        )}
                        {program.exchange_opportunities && (
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Exchange Programs
                          </li>
                        )}
                        {program.religious_facilities && (
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Religious Facilities
                          </li>
                        )}
                        {program.halal_food_availability && (
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Halal Food Available
                          </li>
                        )}
                        {program.north_african_community_size && (
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {program.north_african_community_size} North African Community
                          </li>
                        )}
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Expert Application Support
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Admission Tab */}
            <TabsContent value="admission" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admission Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none dark:prose-invert">
                        <p>{program.admission_requirements}</p>

                        {program.academic_requirements && (
                          <>
                            <h3>Academic Requirements</h3>
                            <p>{program.academic_requirements}</p>
                          </>
                        )}

                        {program.language_test && (
                          <>
                            <h3>Language Requirements</h3>
                            <p>
                              {program.language_test}: {program.language_test_score}
                            </p>
                            {program.language_test_exemptions && (
                              <p>
                                <strong>Exemptions:</strong> {program.language_test_exemptions}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Application Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none dark:prose-invert">
                        {program.application_process ? (
                          <p>{program.application_process}</p>
                        ) : (
                          <>
                            <ol>
                              <li>Register on our platform and complete your profile</li>
                              <li>Select this program and click "Apply Now"</li>
                              <li>
                                Complete the application form and upload required documents
                              </li>
                              <li>Pay the application fee</li>
                              <li>
                                Our team will review your application and assist with university
                                submission
                              </li>
                              <li>Receive admission decision</li>
                            </ol>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Completed Application Form
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Academic Transcripts
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Degree Certificates
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Language Proficiency Proof
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Motivation Letter
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Recommendation Letters
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          CV/Resume
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Copy of Passport
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Our Services</CardTitle>
                      <CardDescription>
                        We provide comprehensive support throughout your application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Document Review
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Application Submission
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Interview Preparation
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Visa Assistance
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Pre-departure Orientation
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                        Apply with Our Support
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Costs & Aid Tab */}
            <TabsContent value="costs" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tuition & Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-muted rounded-lg p-4 space-y-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium">Program Tuition</h3>
                            <div className="text-right">
                              <div className="font-medium">
                                ${program.tuition_min.toLocaleString()} - ${program.tuition_max.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">per year</div>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <h3 className="font-medium">Application Fee</h3>
                            <div className="font-medium">
                              ${program.application_fee?.toLocaleString() || "125"}
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <h3 className="font-medium">Visa Fee</h3>
                            <div className="font-medium">
                              ${program.visa_fee?.toLocaleString() || "Contact for details"}
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold text-lg">
                            <h3>Total Estimated Cost</h3>
                            <div>
                              ${(
                                program.tuition_min +
                                (program.application_fee || 125) +
                                (program.visa_fee || 0)
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="prose max-w-none dark:prose-invert">
                          <h3>Additional Information</h3>
                          <p>
                            The tuition fees shown above are estimates for the entire program
                            duration. Additional costs may apply for course materials, health
                            insurance, and university services.
                          </p>
                          <p>
                            Our services include guidance on payment procedures and assistance with
                            financial planning for your studies abroad.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {(program.scholarship_available || program.scholarship_details) && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Scholarships & Funding</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none dark:prose-invert">
                          {program.scholarship_details ? (
                            <p>{program.scholarship_details}</p>
                          ) : (
                            <>
                              <p>
                                This program offers scholarships for outstanding applicants. 
                                Scholarship amounts vary based on academic merit and financial need.
                              </p>
                              {program.scholarship_amount && (
                                <p>
                                  <strong>Available Amount:</strong> Up to ${program.scholarship_amount.toLocaleString()}
                                </p>
                              )}
                              {program.scholarship_deadline && (
                                <p>
                                  <strong>Application Deadline:</strong> {program.scholarship_deadline}
                                </p>
                              )}
                              {program.scholarship_requirements && (
                                <>
                                  <h3>Scholarship Requirements</h3>
                                  <p>{program.scholarship_requirements}</p>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Living Costs</CardTitle>
                      <CardDescription>
                        Estimated monthly expenses in {program.city}, {program.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Accommodation</span>
                          <span className="font-medium">
                            ${program.housing_cost_min} - ${program.housing_cost_max}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Food</span>
                          <span className="font-medium">$200 - $400</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transportation</span>
                          <span className="font-medium">$50 - $100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Utilities</span>
                          <span className="font-medium">$70 - $150</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Books & Supplies</span>
                          <span className="font-medium">$50 - $100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Personal Expenses</span>
                          <span className="font-medium">$100 - $200</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total (Monthly)</span>
                          <span>${program.living_cost_min} - ${program.living_cost_max}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Bank Transfer
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Credit/Debit Card
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Payment Plans Available
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Living Tab */}
            <TabsContent value="living" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Living in {program.city}, {program.country}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none dark:prose-invert">
                        <p>
                          {program.city} offers an excellent environment for international students
                          with a diverse culture, rich history, and modern amenities. The city
                          provides a safe and welcoming atmosphere for studying and living.
                        </p>

                        <h3>Transportation</h3>
                        <p>
                          {program.city} has an efficient public transportation network including
                          buses, metro, and trams. Student discounts are available, making travel
                          around the city affordable and convenient.
                        </p>

                        <h3>Climate</h3>
                        <p>
                          The climate in {program.country} varies by region. {program.city}{" "}
                          experiences typical {program.country === "Poland" ? "Central European" : program.country === "France" ? "Western European" : "Mediterranean"} weather with {program.country === "Spain" || program.country === "Portugal" ? "warm summers and mild winters" : "distinct seasons throughout the year"}.
                        </p>

                        <h3>Student Life</h3>
                        <p>
                          The university offers various student clubs, sports facilities, and social
                          events to enrich your academic experience. {program.city} has a vibrant
                          student community with cafes, libraries, and cultural venues.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {program.housing_availability && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Accommodation Options</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none dark:prose-invert">
                          <p>
                            {program.housing_availability || "Various housing options are available for international students, including on-campus dormitories and private apartments. Our team can help you find suitable accommodation based on your preferences and budget."}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-muted rounded-lg p-4">
                              <h3 className="text-base font-medium mb-2">University Dormitories</h3>
                              <p className="text-sm">
                                <strong>Price Range:</strong> ${program.housing_cost_min} - ${Math.round(program.housing_cost_min * 1.2)} per month
                              </p>
                              <p className="text-sm">
                                <strong>Features:</strong> Furnished rooms, utilities included, internet access, communal facilities
                              </p>
                            </div>

                            <div className="bg-muted rounded-lg p-4">
                              <h3 className="text-base font-medium mb-2">Private Apartments</h3>
                              <p className="text-sm">
                                <strong>Price Range:</strong> ${Math.round(program.housing_cost_min * 1.3)} - ${program.housing_cost_max} per month
                              </p>
                              <p className="text-sm">
                                <strong>Features:</strong> Independent living, various sizes available, may require additional utility payments
                              </p>
                            </div>

                            <div className="bg-muted rounded-lg p-4">
                              <h3 className="text-base font-medium mb-2">Shared Apartments</h3>
                              <p className="text-sm">
                                <strong>Price Range:</strong> ${Math.round(program.housing_cost_min * 0.8)} - ${Math.round(program.housing_cost_max * 0.9)} per month
                              </p>
                              <p className="text-sm">
                                <strong>Features:</strong> Private bedroom, shared common areas, good for socializing and saving costs
                              </p>
                            </div>

                            <div className="bg-muted rounded-lg p-4">
                              <h3 className="text-base font-medium mb-2">Homestay</h3>
                              <p className="text-sm">
                                <strong>Price Range:</strong> ${Math.round(program.housing_cost_min * 1.1)} - ${Math.round(program.housing_cost_max * 1.1)} per month
                              </p>
                              <p className="text-sm">
                                <strong>Features:</strong> Stay with a local family, meals often included, cultural immersion
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cultural & Religious Facilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {program.religious_facilities && (
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Religious Facilities</p>
                              <p className="text-sm text-muted-foreground">
                                Places of worship and prayer rooms available on or near campus
                              </p>
                            </div>
                          </li>
                        )}

                        {program.halal_food_availability && (
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Halal Food Options</p>
                              <p className="text-sm text-muted-foreground">
                                Halal food available in university cafeterias and nearby restaurants
                              </p>
                            </div>
                          </li>
                        )}

                        {program.north_african_community_size && (
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">North African Community</p>
                              <p className="text-sm text-muted-foreground">
                                {program.north_african_community_size} community of North African students and residents
                              </p>
                            </div>
                          </li>
                        )}

                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">International Student Services</p>
                            <p className="text-sm text-muted-foreground">
                              Dedicated support for international students, including orientation
                              programs
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Cultural Events</p>
                            <p className="text-sm text-muted-foreground">
                              Regular cultural celebrations and international festivals
                            </p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Healthcare & Safety</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Health Insurance</p>
                            <p className="text-sm text-muted-foreground">
                              Required for all international students, assistance with registration
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Medical Facilities</p>
                            <p className="text-sm text-muted-foreground">
                              Access to campus health center and nearby hospitals
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Campus Security</p>
                            <p className="text-sm text-muted-foreground">
                              24/7 security services and emergency support
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">International Student Support</p>
                            <p className="text-sm text-muted-foreground">
                              Dedicated advisors for international students
                            </p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Apply Now Section */}
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Ready to Apply?</h2>
                <p className="text-white/90">
                  Start your application process today and take the first step toward your
                  international education journey.
                </p>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white hover:bg-white/30 border-white/50"
                  onClick={() => navigate("/appointments")}
                >
                  Schedule Consultation
                </Button>
                <Button 
                  className="bg-white text-indigo-700 hover:bg-white/90"
                  onClick={handleApplyNow}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
