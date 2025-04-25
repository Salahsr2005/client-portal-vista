
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Login Required</h1>
        <p className="text-muted-foreground mb-6">
          You need to be logged in to create a new application.
        </p>
        <Button onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return <ApplicationForm />;
}
