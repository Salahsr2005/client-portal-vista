import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  DollarSign, 
  FileText, 
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';
import { Destination } from '@/hooks/useDestinations';
import { useDestinationApplicationSubmit, useDestinationApplicationPayment } from '@/hooks/useDestinationApplications';

interface DestinationApplicationModalProps {
  destination: Destination;
  isOpen: boolean;
  onClose: () => void;
}

export const DestinationApplicationModal: React.FC<DestinationApplicationModalProps> = ({
  destination,
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    programLevel: '',
    priority: 'Medium',
    notes: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }
  });
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const { submitApplication, isSubmitting } = useDestinationApplicationSubmit();
  const { createPayment } = useDestinationApplicationPayment();

  const handleSubmitApplication = async () => {
    if (!formData.programLevel) {
      return;
    }

    const result = await submitApplication({
      destinationId: destination.id,
      programLevel: formData.programLevel as any,
      priority: formData.priority as any,
      notes: formData.notes,
      applicationData: {
        personalInfo: formData.personalInfo,
      },
    });

    if (result.success && result.applicationId) {
      setApplicationId(result.applicationId);
      setStep(2);
    }
  };

  const handlePayment = async () => {
    if (!applicationId) return;

    const amount = destination.application_fee || 125;
    const result = await createPayment(applicationId, amount, destination.name);

    if (result.success) {
      setStep(3);
    }
  };

  const getFeeForLevel = (level: string) => {
    const baseFee = destination.application_fee || 125;
    const serviceFee = destination.service_fee || 75;
    return baseFee + serviceFee;
  };

  const getRequirementsForLevel = (level: string) => {
    switch (level) {
      case 'Bachelor':
        return destination.bachelor_requirements || 'Standard bachelor requirements apply';
      case 'Master':
        return destination.master_requirements || 'Standard master requirements apply';
      case 'PhD':
        return destination.phd_requirements || 'Standard PhD requirements apply';
      default:
        return 'Please select a program level';
    }
  };

  const getDocumentsForLevel = (level: string) => {
    switch (level) {
      case 'Bachelor':
        return destination.bachelor_documents || [];
      case 'Master':
        return destination.master_documents || [];
      case 'PhD':
        return destination.phd_documents || [];
      default:
        return [];
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                  }))}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                  }))}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value }
                }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.personalInfo.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: e.target.value }
                }))}
                placeholder="Enter phone number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Program Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <GraduationCap className="w-5 h-5 mr-2" />
              Program Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="programLevel">Program Level *</Label>
              <Select value={formData.programLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, programLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program level" />
                </SelectTrigger>
                <SelectContent>
                  {destination.available_programs?.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Application Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information or special requests..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {formData.programLevel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2" />
                Program Requirements & Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Academic Requirements:</h4>
                <p className="text-sm text-muted-foreground">
                  {getRequirementsForLevel(formData.programLevel)}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Required Documents:</h4>
                <div className="flex flex-wrap gap-2">
                  {getDocumentsForLevel(formData.programLevel).map((doc, index) => (
                    <Badge key={index} variant="outline">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium">Total Application Fee:</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  €{getFeeForLevel(formData.programLevel)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmitApplication}
          disabled={!formData.programLevel || !formData.personalInfo.firstName || !formData.personalInfo.lastName || !formData.personalInfo.email || isSubmitting}
          className="bg-gradient-to-r from-primary to-primary/80"
        >
          {isSubmitting ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Creating Application...
            </>
          ) : (
            'Create Application'
          )}
        </Button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Application Created Successfully!</h3>
        <p className="text-muted-foreground">
          Now complete your payment to submit your application.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Application Fee:</span>
              <span>€{destination.application_fee || 125}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee:</span>
              <span>€{destination.service_fee || 75}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">€{getFeeForLevel(formData.programLevel)}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Secure Payment</p>
                <p>Your payment is processed securely. Once completed, your application will be automatically submitted for review.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Pay Later
        </Button>
        <Button 
          onClick={handlePayment}
          className="bg-gradient-to-r from-green-600 to-green-500 text-white"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Complete Payment
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Your application has been submitted successfully.
        </p>
        <p className="text-sm text-muted-foreground">
          You will receive email confirmations and updates about your application status.
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Next steps:</strong> Our team will review your application and contact you within 3-5 business days.
        </p>
      </div>

      <Button onClick={onClose} className="w-full">
        Close
      </Button>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Apply to {destination.name}
            <span className="text-sm text-muted-foreground block font-normal">
              {destination.country} • {destination.procedure_type}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </DialogContent>
    </Dialog>
  );
};