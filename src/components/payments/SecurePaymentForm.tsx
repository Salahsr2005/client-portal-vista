import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Building2, 
  Receipt, 
  Shield, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { generatePaymentCredentialsPDF } from '@/utils/paymentCredentialsPdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface SecurePaymentFormProps {
  amount: number;
  currency: string;
  itemType: 'program' | 'destination' | 'service';
  itemName: string;
  clientName: string;
  clientId: string;
  onPaymentInitiated: (paymentMethod: string, reference: string) => void;
}

export const SecurePaymentForm: React.FC<SecurePaymentFormProps> = ({
  amount,
  currency,
  itemType,
  itemName,
  clientName,
  clientId,
  onPaymentInitiated
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'ccp' | 'card'>('bank');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const handleGeneratePaymentInstructions = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePaymentCredentialsPDF(
        selectedMethod,
        clientName,
        clientId,
        itemType === 'program' ? 'program_id' : undefined,
        itemType === 'service' ? 'service_id' : undefined
      );
      
      const reference = `EVS-${clientId.substring(0, 8)}-${Date.now().toString().slice(-6)}`;
      onPaymentInitiated(selectedMethod, reference);
      
      toast({
        title: "Instructions de paiement générées",
        description: "Votre facture d'engagement a été téléchargée. Suivez les instructions pour effectuer le paiement.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les instructions de paiement.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const paymentMethods = [
    {
      id: 'bank' as const,
      name: 'Virement Bancaire',
      description: 'Virement vers compte bancaire professionnel',
      icon: Building2,
      processingTime: '24-48h',
      security: 'Très élevée',
      fees: 'Variables selon banque'
    },
    {
      id: 'ccp' as const,
      name: 'Compte CCP',
      description: 'Virement ou mandat CCP Algérie Poste',
      icon: Receipt,
      processingTime: '24-72h',
      security: 'Élevée',
      fees: 'Frais CCP standards'
    },
    {
      id: 'card' as const,
      name: 'Carte Bancaire',
      description: 'Paiement sécurisé via terminal agréé',
      icon: CreditCard,
      processingTime: 'Immédiat',
      security: 'Très élevée',
      fees: 'Frais terminal'
    }
  ];

  const selectedMethodInfo = paymentMethods.find(method => method.id === selectedMethod);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Paiement Sécurisé
          </CardTitle>
          <CardDescription>
            Sélectionnez votre méthode de paiement préférée pour {itemType === 'program' ? 'le programme' : itemType === 'destination' ? 'la destination' : 'le service'}: {itemName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{amount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{currency}</div>
              <div className="text-xs text-muted-foreground mt-1">Montant total</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{clientName}</div>
              <div className="text-sm text-muted-foreground">Client</div>
              <div className="text-xs text-muted-foreground mt-1">ID: {clientId.substring(0, 8)}</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Badge variant="outline" className="text-sm">
                <Clock className="h-3 w-3 mr-1" />
                En attente
              </Badge>
              <div className="text-xs text-muted-foreground mt-2">Statut du paiement</div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choisissez votre méthode de paiement</h3>
            
            <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as 'bank' | 'ccp' | 'card')}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Label
                      key={method.id}
                      htmlFor={method.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${
                        selectedMethod === method.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{method.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Délai:</span>
                            <span className="font-medium">{method.processingTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sécurité:</span>
                            <span className="font-medium text-green-600">{method.security}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Frais:</span>
                            <span className="font-medium">{method.fees}</span>
                          </div>
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Selected Method Details */}
          {selectedMethodInfo && (
            <Alert className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Méthode sélectionnée: {selectedMethodInfo.name}</strong>
                <br />
                {selectedMethodInfo.description} - Délai de traitement: {selectedMethodInfo.processingTime}
              </AlertDescription>
            </Alert>
          )}

          {/* Security Information */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-green-800 dark:text-green-200">Paiement 100% Sécurisé</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Toutes les transactions sont cryptées et sécurisées</li>
                  <li>• Vérification manuelle par nos administrateurs</li>
                  <li>• Reçus et justificatifs obligatoires</li>
                  <li>• Remboursement garanti en cas de problème</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Generate Payment Instructions Button */}
          <div className="mt-6 text-center">
            <Button 
              onClick={handleGeneratePaymentInstructions}
              disabled={isGeneratingPDF}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? 'Génération en cours...' : 'Générer les Instructions de Paiement'}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Un PDF avec tous les détails de paiement sera téléchargé
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};