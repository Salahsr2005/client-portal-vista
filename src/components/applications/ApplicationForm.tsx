
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePrograms } from "@/hooks/usePrograms";
import { useCreateApplication } from "@/hooks/useCreateApplication";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  School,
  Flag,
  FileText,
} from "lucide-react";

interface Program {
  id: string;
  name: string;
  university: string;
  description: string;
  tuition: string;
  duration: string;
  country: string;
}

export function ApplicationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [notes, setNotes] = useState("");
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const createApplication = useCreateApplication();

  const handleSubmit = async () => {
    if (!selectedProgram) return;

    try {
      await createApplication.mutateAsync({
        programId: selectedProgram.id,
        priority,
        notes,
      });

      toast({
        title: "Application submitted",
        description: "Your application has been created successfully.",
      });

      navigate("/dashboard/applications");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your application.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                Select Program
              </CardTitle>
              <CardDescription>
                Choose the program you want to apply for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {programsLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  programs.map((program) => (
                    <Card
                      key={program.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedProgram?.id === program.id
                          ? "border-2 border-primary"
                          : ""
                      }`}
                      onClick={() => setSelectedProgram(program)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{program.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {program.university}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {program.tuition} • {program.duration}
                            </p>
                          </div>
                          {selectedProgram?.id === program.id && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-primary" />
                Application Details
              </CardTitle>
              <CardDescription>
                Provide additional details for your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Priority Level</Label>
                  <RadioGroup
                    value={priority}
                    onValueChange={(value: "Low" | "Medium" | "High") =>
                      setPriority(value)
                    }
                    className="grid grid-cols-3 gap-4 mt-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="Low"
                        id="low"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="low"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Low</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="Medium"
                        id="medium"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="medium"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Medium</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="High"
                        id="high"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="high"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>High</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Add any additional information about your application..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <div className="mb-8">
          <Progress value={(step / 2) * 100} className="h-2" />
          <div className="flex justify-between px-2 mt-2">
            <span className="text-sm text-muted-foreground">
              Step {step} of 2
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / 2) * 100)}%
            </span>
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between p-6 border-t">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
          )}
          <Button
            className={`flex items-center gap-2 ${
              step === 1 ? "ml-auto" : ""
            }`}
            onClick={() => {
              if (step === 1 && !selectedProgram) {
                toast({
                  title: "Please select a program",
                  description:
                    "You need to select a program before proceeding.",
                  variant: "destructive",
                });
                return;
              }
              if (step < 2) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
          >
            {step === 2 ? (
              <>
                Submit Application <FileText className="h-4 w-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
