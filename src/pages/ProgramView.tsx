
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePrograms } from "@/hooks/usePrograms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Share, GraduationCap, MapPin, Calendar, Clock, Info, DollarSign, School, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProgramView() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: programs = [], isLoading } = usePrograms();
  const program = programs.find(p => p.id === programId);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Program link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy link",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-semibold">Program Not Found</h2>
        <p className="text-muted-foreground">The program you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/programs')}>Back to Programs</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{program.name}</h1>
          <p className="text-muted-foreground">{program.university}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate(`/applications/new?program=${program.id}`)}>
            Apply Now
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Hero Image */}
          <Card>
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img 
                src={program.image_url || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f"} 
                alt={program.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{program.study_level}</Badge>
                <Badge variant="secondary">{program.field}</Badge>
                <Badge variant="outline">{program.duration_months} months</Badge>
                {program.scholarship_available && (
                  <Badge variant="default">Scholarship Available</Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Program Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{program.description}</p>
              {program.advantages && (
                <>
                  <h3 className="font-semibold mt-4">Key Advantages</h3>
                  <p className="text-muted-foreground">{program.advantages}</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Admission Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Academic Requirements</h3>
                <p className="text-muted-foreground">{program.academic_requirements}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Language Requirements</h3>
                <p className="text-muted-foreground">
                  {program.language_test}: {program.language_test_score}
                </p>
                {program.language_test_exemptions && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Exemptions: {program.language_test_exemptions}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">University</p>
                    <p className="text-sm text-muted-foreground">{program.university}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{program.city}, {program.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Study Level</p>
                    <p className="text-sm text-muted-foreground">{program.study_level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{program.duration_months} months</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Tuition Fee Range</p>
                    <p className="text-sm text-muted-foreground">
                      ${program.tuition_min?.toLocaleString()} - ${program.tuition_max?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Application Deadline</p>
                    <p className="text-sm text-muted-foreground">{program.application_deadline || "Contact for details"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {program.scholarship_available && (
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{program.scholarship_details}</p>
                {program.scholarship_requirements && (
                  <>
                    <h4 className="font-medium">Requirements:</h4>
                    <p className="text-sm text-muted-foreground">{program.scholarship_requirements}</p>
                  </>
                )}
                {program.scholarship_deadline && (
                  <div className="flex items-center gap-2 mt-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Deadline: {program.scholarship_deadline}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
