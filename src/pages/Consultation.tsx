
import { useEffect } from 'react';
import ConsultationFlow from '@/components/consultation/ConsultationFlow';

export default function Consultation() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Program Consultation</h1>
        <p className="text-muted-foreground">
          Get personalized program recommendations tailored to your needs
        </p>
      </div>
      
      <ConsultationFlow />
    </div>
  );
}
